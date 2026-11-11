import { NextRequest, NextResponse } from "next/server";
import { and, eq, or } from "drizzle-orm";
import { db } from "@/lib/db";
import { invitations, members, notifications } from "@/lib/db/schema";
import { requireAuth } from "@/lib/auth";
import { isUuid } from "@/lib/db/helpers";
import { getMemberByUid } from "@/lib/server/members";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    if (!isUuid(id)) {
      return NextResponse.json({ error: "Invalid profile id" }, { status: 400 });
    }

    const authResult = await requireAuth(req);
    if (authResult instanceof NextResponse) return authResult;
    const viewerUid = authResult.uid;

    // Whitelisted fields only. Email, names, admin flags, preferences etc.
    // are never returned to other members.
    const [profile] = await db
      .select({
        id: members.id,
        uid: members.uid,
        profileName: members.profileName,
        photoURL: members.photoURL,
        biodata: members.biodata,
        createdAt: members.createdAt,
        isShadow: members.isShadow,
      })
      .from(members)
      .where(eq(members.id, id))
      .limit(1);

    if (!profile) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const viewer = await getMemberByUid(viewerUid);

    // Shadow profiles are admin-only.
    if (profile.isShadow && !viewer?.isAdmin) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const isSelf = viewerUid === profile.uid;

    // Track the view: one notification per viewer per day (race-safe via
    // the unique dedupe index).
    if (!isSelf && !profile.isShadow && viewer) {
      const viewerName = viewer.profileName || viewer.firstName || "Someone";
      await db
        .insert(notifications)
        .values({
          recipientUid: profile.uid,
          type: "profile_view",
          title: "Profile Viewed",
          message: `${viewerName} viewed your profile`,
          actorUid: viewerUid,
          actorName: viewerName,
          actorProfileId: viewer.id,
          dayBucket: new Date().toISOString().slice(0, 10),
        })
        .onConflictDoNothing();
    }

    const biodata = JSON.parse(JSON.stringify(profile.biodata ?? {}));

    // Strip wali contact details unless an accepted invitation exists.
    // Admins always see them (they run the manual matchmaking).
    if (!isSelf && !viewer?.isAdmin) {
      const [accepted] = await db
        .select({ id: invitations.id })
        .from(invitations)
        .where(
          and(
            eq(invitations.status, "accepted"),
            or(
              and(eq(invitations.senderUid, viewerUid), eq(invitations.receiverUid, profile.uid)),
              and(eq(invitations.senderUid, profile.uid), eq(invitations.receiverUid, viewerUid))
            )
          )
        )
        .limit(1);
      if (!accepted && biodata.family) {
        biodata.family.waliName = "";
        biodata.family.waliPhone = "";
        biodata.family.waliEmail = "";
        biodata.family.waliRelationship = "";
      }
    }

    return NextResponse.json({
      profile: {
        _id: profile.id,
        profileName: profile.profileName,
        photoURL: profile.photoURL,
        biodata,
        createdAt: profile.createdAt,
        isShadow: profile.isShadow,
      },
    });
  } catch (error) {
    console.error("Error fetching single profile:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
