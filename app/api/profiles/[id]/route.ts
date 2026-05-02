import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import Notification from "@/models/Notification";
import Invitation from "@/models/Invitation";
import { requireAuth } from "@/lib/auth";

// Whitelisted fields returned to authenticated viewers. Sensitive fields
// (email, isAdmin, invitesRemaining, partnerPreferences, onboardingStep,
// firstName/lastName, raw firebaseUid) are intentionally omitted.
const PUBLIC_PROFILE_FIELDS =
  "_id profileName photoURL biodata createdAt firebaseUid";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!mongoose.isValidObjectId(id)) {
      return NextResponse.json({ error: "Invalid profile id" }, { status: 400 });
    }

    const authResult = await requireAuth(req);
    if (authResult instanceof NextResponse) return authResult;
    const viewerUid = authResult.uid;

    await connectDB();

    const user = await User.findById(id).select(PUBLIC_PROFILE_FIELDS).lean();

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const profileUser = user as { firebaseUid?: string; _id?: string };

    // Track profile view — create a notification for the profile owner
    if (profileUser.firebaseUid && viewerUid !== profileUser.firebaseUid) {
      const viewer = await User.findOne({ firebaseUid: viewerUid })
        .select("profileName firstName _id")
        .lean();

      if (viewer) {
        const viewerData = viewer as { profileName?: string; firstName?: string; _id?: string };
        const viewerName = viewerData.profileName || viewerData.firstName || "Someone";

        // Race-safe upsert: only one notification per viewer per day.
        const dayBucket = new Date().toISOString().slice(0, 10);
        await Notification.updateOne(
          {
            recipientUid: profileUser.firebaseUid,
            type: "profile_view",
            actorUid: viewerUid,
            dayBucket,
          },
          {
            $setOnInsert: {
              recipientUid: profileUser.firebaseUid,
              type: "profile_view",
              title: "Profile Viewed",
              message: `${viewerName} viewed your profile`,
              actorUid: viewerUid,
              actorName: viewerName,
              actorProfileId: String(viewerData._id),
              dayBucket,
            },
          },
          { upsert: true }
        );
      }
    }

    // Strip wali contact details unless an accepted invitation exists.
    // Also drop firebaseUid before returning — it's only needed internally.
    const profileData = JSON.parse(JSON.stringify(user)) as {
      firebaseUid?: string;
      biodata?: { family?: Record<string, string> };
    };

    if (profileUser.firebaseUid && viewerUid !== profileUser.firebaseUid) {
      const acceptedInvite = await Invitation.findOne({
        $or: [
          { senderUid: viewerUid, receiverUid: profileUser.firebaseUid, status: "accepted" },
          { senderUid: profileUser.firebaseUid, receiverUid: viewerUid, status: "accepted" },
        ],
      });
      if (!acceptedInvite && profileData.biodata?.family) {
        profileData.biodata.family.waliName = "";
        profileData.biodata.family.waliPhone = "";
        profileData.biodata.family.waliEmail = "";
        profileData.biodata.family.waliRelationship = "";
      }
    }

    delete profileData.firebaseUid;

    return NextResponse.json({ profile: profileData });
  } catch (error) {
    console.error("Error fetching single profile:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
