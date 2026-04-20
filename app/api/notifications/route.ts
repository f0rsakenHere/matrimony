import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Notification from "@/models/Notification";

// GET — fetch notifications for a user
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const uid = searchParams.get("uid");
    const unreadOnly = searchParams.get("unreadOnly") === "true";
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get("limit") || "20", 10)));

    if (!uid) {
      return NextResponse.json({ error: "Missing uid" }, { status: 400 });
    }

    await connectDB();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const filter: Record<string, any> = { recipientUid: uid };
    if (unreadOnly) filter.read = false;

    const skip = (page - 1) * limit;

    const [notifications, total, unreadCount] = await Promise.all([
      Notification.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Notification.countDocuments(filter),
      Notification.countDocuments({ recipientUid: uid, read: false }),
    ]);

    return NextResponse.json({
      notifications,
      total,
      unreadCount,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("Notifications fetch error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// PATCH — mark notifications as read
export async function PATCH(request: Request) {
  try {
    const { uid, notificationId, markAll } = await request.json();

    if (!uid) {
      return NextResponse.json({ error: "Missing uid" }, { status: 400 });
    }

    await connectDB();

    if (markAll) {
      await Notification.updateMany(
        { recipientUid: uid, read: false },
        { $set: { read: true } }
      );
    } else if (notificationId) {
      await Notification.findOneAndUpdate(
        { _id: notificationId, recipientUid: uid },
        { $set: { read: true } }
      );
    }

    const unreadCount = await Notification.countDocuments({
      recipientUid: uid,
      read: false,
    });

    return NextResponse.json({ success: true, unreadCount });
  } catch (error) {
    console.error("Notification update error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
