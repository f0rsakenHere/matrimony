import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { members } from "@/lib/db/schema";
import { requireAuth } from "@/lib/auth";
import { memberJson } from "@/lib/server/members";

function clamp(v: unknown, max: number): string | undefined {
  return typeof v === "string" ? v.trim().slice(0, max) : undefined;
}

export async function PUT(request: Request) {
  try {
    const authResult = await requireAuth(request);
    if (authResult instanceof NextResponse) return authResult;

    const { data } = await request.json().catch(() => ({}));
    if (!data || typeof data !== "object") {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const update: Partial<typeof members.$inferInsert> = {};
    const firstName = clamp(data.firstName, 80);
    const lastName = clamp(data.lastName, 80);
    const profileName = clamp(data.profileName, 60);
    if (firstName !== undefined) update.firstName = firstName;
    if (lastName !== undefined) update.lastName = lastName;
    if (profileName !== undefined) update.profileName = profileName;
    if (typeof data.photoURL === "string") {
      update.photoURL =
        data.photoURL.length <= 2048 && /^https:\/\//.test(data.photoURL) ? data.photoURL : null;
    }

    if (Object.keys(update).length === 0) {
      return NextResponse.json({ error: "No valid fields to update" }, { status: 400 });
    }

    const [user] = await db
      .update(members)
      .set(update)
      .where(eq(members.uid, authResult.uid))
      .returning();
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    return NextResponse.json({ user: memberJson(user) });
  } catch (error) {
    console.error("Settings update error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
