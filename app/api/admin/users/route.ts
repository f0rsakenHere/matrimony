import { NextResponse } from "next/server";
import { and, asc, count, desc, eq, or, type SQL } from "drizzle-orm";
import { db } from "@/lib/db";
import { members, user as authUser } from "@/lib/db/schema";
import { requireAdmin } from "@/lib/auth";
import { bio, biodataFilters, containsCI, isUuid, withId } from "@/lib/db/helpers";
import { memberJson } from "@/lib/server/members";

export async function GET(request: Request) {
  try {
    const authResult = await requireAdmin(request);
    if (authResult instanceof NextResponse) return authResult;

    const { searchParams } = new URL(request.url);
    const search = searchParams.get("q")?.trim();
    const onboardingComplete = searchParams.get("onboardingComplete");
    const provider = searchParams.get("provider");
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const sortDir = searchParams.get("sortOrder") === "asc" ? asc : desc;
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "20", 10) || 20));

    const conds: SQL[] = biodataFilters(members.biodata, searchParams);
    if (provider) conds.push(eq(members.provider, provider));
    if (onboardingComplete === "true") conds.push(eq(members.onboardingComplete, true));
    if (onboardingComplete === "false") conds.push(eq(members.onboardingComplete, false));

    if (search) {
      conds.push(
        or(
          containsCI(members.profileName, search),
          containsCI(members.email, search),
          containsCI(members.firstName, search),
          containsCI(members.lastName, search),
          containsCI(bio(members.biodata, "personal", "city"), search),
          containsCI(bio(members.biodata, "personal", "country"), search),
          containsCI(bio(members.biodata, "education", "occupation"), search)
        )!
      );
    }

    const sortCol =
      sortBy === "name" ? members.profileName : sortBy === "email" ? members.email : members.createdAt;
    const where = conds.length ? and(...conds) : undefined;

    const [rows, [{ total }]] = await Promise.all([
      db
        .select()
        .from(members)
        .where(where)
        .orderBy(sortDir(sortCol))
        .limit(limit)
        .offset((page - 1) * limit),
      db.select({ total: count() }).from(members).where(where),
    ]);

    return NextResponse.json({
      users: rows.map(memberJson),
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("Admin users fetch error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// DELETE a member (and their login, if they have one)
export async function DELETE(request: Request) {
  try {
    const authResult = await requireAdmin(request);
    if (authResult instanceof NextResponse) return authResult;

    const { userId } = await request.json().catch(() => ({}));
    if (!isUuid(userId)) {
      return NextResponse.json({ error: "Invalid user id" }, { status: 400 });
    }

    const [target] = await db.select().from(members).where(eq(members.id, userId)).limit(1);
    if (!target) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    if (target.uid === authResult.uid) {
      return NextResponse.json({ error: "You cannot delete your own account" }, { status: 400 });
    }
    if (target.isAdmin) {
      const [{ admins }] = await db
        .select({ admins: count() })
        .from(members)
        .where(eq(members.isAdmin, true));
      if (admins <= 1) {
        return NextResponse.json({ error: "Cannot delete the last admin" }, { status: 400 });
      }
    }

    await db.transaction(async (tx) => {
      await tx.delete(members).where(eq(members.id, userId));
      if (!target.isShadow) {
        // Cascades to sessions and accounts.
        await tx.delete(authUser).where(eq(authUser.id, target.uid));
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Admin delete error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// PATCH — toggle admin / onboarding flags
export async function PATCH(request: Request) {
  try {
    const authResult = await requireAdmin(request);
    if (authResult instanceof NextResponse) return authResult;

    const { userId, updates } = await request.json().catch(() => ({}));
    if (!isUuid(userId) || !updates || typeof updates !== "object") {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    const safe: Partial<typeof members.$inferInsert> = {};
    if (typeof updates.isAdmin === "boolean") safe.isAdmin = updates.isAdmin;
    if (typeof updates.onboardingComplete === "boolean") safe.onboardingComplete = updates.onboardingComplete;
    if (Object.keys(safe).length === 0) {
      return NextResponse.json({ error: "No valid fields to update" }, { status: 400 });
    }

    if (safe.isAdmin === false) {
      const [target] = await db
        .select({ uid: members.uid })
        .from(members)
        .where(eq(members.id, userId))
        .limit(1);
      if (target?.uid === authResult.uid) {
        return NextResponse.json({ error: "You cannot remove your own admin access" }, { status: 400 });
      }
    }

    const [updated] = await db.update(members).set(safe).where(eq(members.id, userId)).returning();
    if (!updated) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    return NextResponse.json({ user: withId(updated) });
  } catch (error) {
    console.error("Admin patch error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
