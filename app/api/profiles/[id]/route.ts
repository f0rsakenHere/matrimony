import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import Notification from "@/models/Notification";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const viewerUid = req.nextUrl.searchParams.get("viewerUid");

    await connectDB();

    const user = await User.findById(id).lean();

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Track profile view — create a notification for the profile owner
    const profileUser = user as { firebaseUid?: string; _id?: string };
    if (viewerUid && profileUser.firebaseUid && viewerUid !== profileUser.firebaseUid) {
      // Get viewer info
      const viewer = await User.findOne({ firebaseUid: viewerUid })
        .select("profileName firstName _id")
        .lean();

      if (viewer) {
        const viewerData = viewer as { profileName?: string; firstName?: string; _id?: string };
        const viewerName = viewerData.profileName || viewerData.firstName || "Someone";

        // Don't spam — only create if no view notification from this viewer in last 24h
        const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
        const recentView = await Notification.findOne({
          recipientUid: profileUser.firebaseUid,
          type: "profile_view",
          actorUid: viewerUid,
          createdAt: { $gte: oneDayAgo },
        });

        if (!recentView) {
          await Notification.create({
            recipientUid: profileUser.firebaseUid,
            type: "profile_view",
            title: "Profile Viewed",
            message: `${viewerName} viewed your profile`,
            actorUid: viewerUid,
            actorName: viewerName,
            actorProfileId: String(viewerData._id),
          });
        }
      }
    }

    return NextResponse.json({ profile: user });
  } catch (error) {
    console.error("Error fetching single profile:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
