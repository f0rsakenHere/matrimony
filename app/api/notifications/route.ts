import { NextResponse } from "next/server";
import { and, count, desc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { notifications } from "@/lib/db/schema";
import { requireAuth } from "@/lib/auth";
import { isUuid, withId } from "@/lib/db/helpers";

async function unreadCountFor(uid: string): Promise<number> {
  const [{ n }] = await db
    .select({ n: count() })
    .from(notifications)
    .where(and(eq(notifications.recipientUid, uid), eq(notifications.read, false)));
  return n;
}

// GET — fetch notifications for the signed-in user
export async function GET(request: Request) {
  try {
    const authResult = await requireAuth(request);
    if (authResult instanceof NextResponse) return authResult;
    const uid = authResult.uid;

    const { searchParams } = new URL(request.url);
    const unreadOnly = searchParams.get("unreadOnly") === "true";
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get("limit") || "20", 10) || 20));

    const where = unreadOnly
      ? and(eq(notifications.recipientUid, uid), eq(notifications.read, false))
      : eq(notifications.recipientUid, uid);

    const [rows, [{ total }], unreadCount] = await Promise.all([
      db
        .select()
        .from(notifications)
        .where(where)
        .orderBy(desc(notifications.createdAt))
        .limit(limit)
        .offset((page - 1) * limit),
      db.select({ total: count() }).from(notifications).where(where),
      unreadCountFor(uid),
    ]);

    return NextResponse.json({
      notifications: rows.map(withId),
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
    const authResult = await requireAuth(request);
    if (authResult instanceof NextResponse) return authResult;
    const uid = authResult.uid;

    const { notificationId, markAll } = await request.json().catch(() => ({}));

    if (markAll) {
      await db
        .update(notifications)
        .set({ read: true })
        .where(and(eq(notifications.recipientUid, uid), eq(notifications.read, false)));
    } else if (isUuid(notificationId)) {
      await db
        .update(notifications)
        .set({ read: true })
        .where(and(eq(notifications.id, notificationId), eq(notifications.recipientUid, uid)));
    }

    return NextResponse.json({ success: true, unreadCount: await unreadCountFor(uid) });
  } catch (error) {
    console.error("Notification update error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
