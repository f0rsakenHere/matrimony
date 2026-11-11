import { NextResponse } from "next/server";
import { and, eq, inArray } from "drizzle-orm";
import { db } from "@/lib/db";
import { invitations } from "@/lib/db/schema";
import { requireAuth } from "@/lib/auth";

// GET — invitation status between the signed-in user and a profile
export async function GET(request: Request) {
  try {
    const authResult = await requireAuth(request);
    if (authResult instanceof NextResponse) return authResult;
    const uid = authResult.uid;

    const profileUid = new URL(request.url).searchParams.get("profileUid");
    if (!profileUid) {
      return NextResponse.json({ error: "Missing params" }, { status: 400 });
    }

    const active = inArray(invitations.status, ["pending", "accepted"]);
    const [[sentInvite], [receivedInvite]] = await Promise.all([
      db
        .select()
        .from(invitations)
        .where(and(eq(invitations.senderUid, uid), eq(invitations.receiverUid, profileUid), active))
        .limit(1),
      db
        .select()
        .from(invitations)
        .where(and(eq(invitations.senderUid, profileUid), eq(invitations.receiverUid, uid), active))
        .limit(1),
    ]);

    const invite = sentInvite ?? receivedInvite;
    return NextResponse.json({
      status: invite?.status ?? null,
      direction: sentInvite ? "sent" : receivedInvite ? "received" : null,
      invitationId: invite?.id ?? null,
      waliUnlocked: invite?.status === "accepted",
    });
  } catch (error) {
    console.error("Invitation status error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
