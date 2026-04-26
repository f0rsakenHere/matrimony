import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Invitation from "@/models/Invitation";
import { requireAuth } from "@/lib/auth";

// GET — check invitation status between current user and a profile
export async function GET(request: Request) {
  try {
    const authResult = await requireAuth(request);
    if (authResult instanceof NextResponse) return authResult;
    const uid = authResult.uid;

    const { searchParams } = new URL(request.url);
    const profileUid = searchParams.get("profileUid");

    if (!profileUid) {
      return NextResponse.json({ error: "Missing params" }, { status: 400 });
    }

    await connectDB();

    // Check both directions
    const [sentInvite, receivedInvite] = await Promise.all([
      Invitation.findOne({
        senderUid: uid,
        receiverUid: profileUid,
        status: { $in: ["pending", "accepted"] },
      }).lean(),
      Invitation.findOne({
        senderUid: profileUid,
        receiverUid: uid,
        status: { $in: ["pending", "accepted"] },
      }).lean(),
    ]);

    const invite = sentInvite || receivedInvite;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const inviteData = invite as any;

    const waliUnlocked =
      (sentInvite && inviteData?.status === "accepted") ||
      (receivedInvite && inviteData?.status === "accepted");

    return NextResponse.json({
      status: inviteData?.status ?? null,
      direction: sentInvite ? "sent" : receivedInvite ? "received" : null,
      invitationId: inviteData?._id ? String(inviteData._id) : null,
      waliUnlocked: !!waliUnlocked,
    });
  } catch (error) {
    console.error("Invitation status error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
