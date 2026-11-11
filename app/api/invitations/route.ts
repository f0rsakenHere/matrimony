import { NextResponse } from "next/server";
import { and, desc, eq, inArray, or, sql, type SQL } from "drizzle-orm";
import { db } from "@/lib/db";
import { invitations, members, notifications, type InvitationStatus } from "@/lib/db/schema";
import { requireAuth } from "@/lib/auth";
import { isUuid, withId } from "@/lib/db/helpers";
import { inviteLimiter } from "@/lib/rate-limit";
import { getMemberById, getMemberByUid } from "@/lib/server/members";

const STATUSES: InvitationStatus[] = ["pending", "accepted", "declined"];

// GET — invitations for the signed-in user (sent + received)
export async function GET(request: Request) {
  try {
    const authResult = await requireAuth(request);
    if (authResult instanceof NextResponse) return authResult;
    const uid = authResult.uid;

    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");
    const status = searchParams.get("status") as InvitationStatus | null;

    const conds: SQL[] = [
      type === "sent"
        ? eq(invitations.senderUid, uid)
        : type === "received"
          ? eq(invitations.receiverUid, uid)
          : or(eq(invitations.senderUid, uid), eq(invitations.receiverUid, uid))!,
    ];
    if (status && STATUSES.includes(status)) conds.push(eq(invitations.status, status));

    const rows = await db
      .select()
      .from(invitations)
      .where(and(...conds))
      .orderBy(desc(invitations.createdAt));

    return NextResponse.json({ invitations: rows.map(withId) });
  } catch (error) {
    console.error("Invitations fetch error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// POST — send an invitation
export async function POST(request: Request) {
  try {
    const authResult = await requireAuth(request);
    if (authResult instanceof NextResponse) return authResult;
    const senderUid = authResult.uid;

    const { success } = inviteLimiter.check(senderUid);
    if (!success) {
      return NextResponse.json({ error: "Too many invitations. Please try again later." }, { status: 429 });
    }

    const { receiverProfileId } = await request.json().catch(() => ({}));
    if (!isUuid(receiverProfileId)) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const sender = await getMemberByUid(senderUid);
    if (!sender) {
      return NextResponse.json({ error: "Sender not found" }, { status: 404 });
    }
    if (sender.invitesRemaining <= 0 && !sender.isPremium) {
      return NextResponse.json({ error: "No invitations remaining. Upgrade to get more." }, { status: 403 });
    }

    const receiver = await getMemberById(receiverProfileId);
    if (!receiver || receiver.isShadow) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }
    if (sender.uid === receiver.uid) {
      return NextResponse.json({ error: "Cannot invite yourself" }, { status: 400 });
    }

    const [existing] = await db
      .select({ id: invitations.id })
      .from(invitations)
      .where(
        and(
          eq(invitations.senderUid, senderUid),
          eq(invitations.receiverUid, receiver.uid),
          inArray(invitations.status, ["pending", "accepted"])
        )
      )
      .limit(1);
    if (existing) {
      return NextResponse.json({ error: "You have already sent an invitation to this person" }, { status: 409 });
    }

    const senderName = sender.profileName || sender.firstName || "Someone";
    const receiverName = receiver.profileName || receiver.firstName || "Someone";

    const invitation = await db.transaction(async (tx) => {
      const [inv] = await tx
        .insert(invitations)
        .values({
          senderUid: sender.uid,
          senderName,
          senderProfileId: sender.id,
          receiverUid: receiver.uid,
          receiverName,
          receiverProfileId: receiver.id,
        })
        .returning();

      if (!sender.isPremium) {
        await tx
          .update(members)
          .set({ invitesRemaining: sql`${members.invitesRemaining} - 1` })
          .where(eq(members.uid, senderUid));
      }

      await tx.insert(notifications).values({
        recipientUid: receiver.uid,
        type: "system",
        title: "New Invitation",
        message: `${senderName}'s family has expressed interest in your profile. Review and respond to this invitation.`,
        actorUid: sender.uid,
        actorName: senderName,
        actorProfileId: sender.id,
      });
      return inv;
    });

    return NextResponse.json({ invitation: withId(invitation) });
  } catch (error) {
    console.error("Send invitation error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// PATCH — accept or decline an invitation
export async function PATCH(request: Request) {
  try {
    const authResult = await requireAuth(request);
    if (authResult instanceof NextResponse) return authResult;
    const uid = authResult.uid;

    const { invitationId, action } = await request.json().catch(() => ({}));
    if (!isUuid(invitationId) || !["accept", "decline"].includes(action)) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    const [invitation] = await db.select().from(invitations).where(eq(invitations.id, invitationId)).limit(1);
    if (!invitation) {
      return NextResponse.json({ error: "Invitation not found" }, { status: 404 });
    }
    if (invitation.receiverUid !== uid) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const newStatus: InvitationStatus = action === "accept" ? "accepted" : "declined";
    // Conditional update so two concurrent responses can't both succeed.
    const [updated] = await db
      .update(invitations)
      .set({ status: newStatus })
      .where(and(eq(invitations.id, invitationId), eq(invitations.status, "pending")))
      .returning();
    if (!updated) {
      return NextResponse.json({ error: "This invitation has already been responded to" }, { status: 400 });
    }

    await db.insert(notifications).values(
      action === "accept"
        ? {
            recipientUid: invitation.senderUid,
            type: "system",
            title: "Invitation Accepted!",
            message: `${invitation.receiverName}'s family has accepted your invitation. You can now view each other's Wali contact details.`,
            actorUid: invitation.receiverUid,
            actorName: invitation.receiverName,
            actorProfileId: invitation.receiverProfileId,
          }
        : {
            recipientUid: invitation.senderUid,
            type: "system",
            title: "Invitation Declined",
            message: `Your invitation to ${invitation.receiverName} was not accepted at this time.`,
          }
    );

    return NextResponse.json({ invitation: withId(updated) });
  } catch (error) {
    console.error("Invitation response error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
