import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import Invitation from "@/models/Invitation";
import Notification from "@/models/Notification";

// GET — fetch invitations for a user (sent + received)
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const uid = searchParams.get("uid");
    const type = searchParams.get("type"); // "sent" | "received"
    const status = searchParams.get("status"); // "pending" | "accepted" | "declined"

    if (!uid) {
      return NextResponse.json({ error: "Missing uid" }, { status: 400 });
    }

    await connectDB();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const filter: Record<string, any> = {};
    if (type === "sent") {
      filter.senderUid = uid;
    } else if (type === "received") {
      filter.receiverUid = uid;
    } else {
      filter.$or = [{ senderUid: uid }, { receiverUid: uid }];
    }
    if (status) filter.status = status;

    const invitations = await Invitation.find(filter)
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ invitations });
  } catch (error) {
    console.error("Invitations fetch error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// POST — send an invitation
export async function POST(request: Request) {
  try {
    const { senderUid, receiverProfileId } = await request.json();

    if (!senderUid || !receiverProfileId) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    await connectDB();

    // Get sender
    const sender = await User.findOne({ firebaseUid: senderUid }).lean();
    if (!sender) {
      return NextResponse.json({ error: "Sender not found" }, { status: 404 });
    }
    const senderData = sender as {
      _id: string;
      firebaseUid: string;
      profileName?: string;
      firstName?: string;
      invitesRemaining?: number;
      isPremium?: boolean;
    };

    // Check invite balance
    const remaining = senderData.invitesRemaining ?? 3;
    if (remaining <= 0 && !senderData.isPremium) {
      return NextResponse.json(
        { error: "No invitations remaining. Upgrade to get more." },
        { status: 403 }
      );
    }

    // Get receiver
    const receiver = await User.findById(receiverProfileId).lean();
    if (!receiver) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }
    const receiverData = receiver as {
      _id: string;
      firebaseUid: string;
      profileName?: string;
      firstName?: string;
    };

    // Can't invite yourself
    if (senderData.firebaseUid === receiverData.firebaseUid) {
      return NextResponse.json({ error: "Cannot invite yourself" }, { status: 400 });
    }

    // Check for existing invitation between these two
    const existing = await Invitation.findOne({
      senderUid: senderUid,
      receiverUid: receiverData.firebaseUid,
      status: { $in: ["pending", "accepted"] },
    });
    if (existing) {
      return NextResponse.json(
        { error: "You have already sent an invitation to this person" },
        { status: 409 }
      );
    }

    const senderName = senderData.profileName || senderData.firstName || "Someone";
    const receiverName = receiverData.profileName || receiverData.firstName || "Someone";

    // Create invitation
    const invitation = await Invitation.create({
      senderUid: senderData.firebaseUid,
      senderName,
      senderProfileId: String(senderData._id),
      receiverUid: receiverData.firebaseUid,
      receiverName,
      receiverProfileId: String(receiverData._id),
    });

    // Deduct invite (skip for premium)
    if (!senderData.isPremium) {
      await User.updateOne(
        { firebaseUid: senderUid },
        { $inc: { invitesRemaining: -1 } }
      );
    }

    // Notify receiver
    await Notification.create({
      recipientUid: receiverData.firebaseUid,
      type: "system",
      title: "New Invitation",
      message: `${senderName}'s family has expressed interest in your profile. Review and respond to this invitation.`,
      actorUid: senderData.firebaseUid,
      actorName: senderName,
      actorProfileId: String(senderData._id),
    });

    return NextResponse.json({ invitation });
  } catch (error) {
    console.error("Send invitation error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// PATCH — accept or decline an invitation
export async function PATCH(request: Request) {
  try {
    const { uid, invitationId, action } = await request.json();

    if (!uid || !invitationId || !["accept", "decline"].includes(action)) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    await connectDB();

    const invitation = await Invitation.findById(invitationId);
    if (!invitation) {
      return NextResponse.json({ error: "Invitation not found" }, { status: 404 });
    }

    // Only the receiver can respond
    if (invitation.receiverUid !== uid) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    if (invitation.status !== "pending") {
      return NextResponse.json(
        { error: "This invitation has already been responded to" },
        { status: 400 }
      );
    }

    const newStatus = action === "accept" ? "accepted" : "declined";
    invitation.status = newStatus;
    await invitation.save();

    // Notify the sender
    if (action === "accept") {
      await Notification.create({
        recipientUid: invitation.senderUid,
        type: "system",
        title: "Invitation Accepted!",
        message: `${invitation.receiverName}'s family has accepted your invitation. You can now view each other's Wali contact details.`,
        actorUid: invitation.receiverUid,
        actorName: invitation.receiverName,
        actorProfileId: invitation.receiverProfileId,
      });
    } else {
      await Notification.create({
        recipientUid: invitation.senderUid,
        type: "system",
        title: "Invitation Declined",
        message: `Your invitation to ${invitation.receiverName} was not accepted at this time.`,
      });
    }

    return NextResponse.json({ invitation });
  } catch (error) {
    console.error("Invitation response error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
