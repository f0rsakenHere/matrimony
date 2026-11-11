import { NextResponse } from "next/server";
import { and, count, desc, eq, inArray, or } from "drizzle-orm";
import { db } from "@/lib/db";
import { manualMatches, type MatchStatus } from "@/lib/db/schema";
import { requireAdmin } from "@/lib/auth";
import { isUuid, withId } from "@/lib/db/helpers";
import { getMemberById } from "@/lib/server/members";

const STATUSES: MatchStatus[] = ["matched", "contacted", "successful", "unsuccessful"];

// GET — list manual matches
export async function GET(request: Request) {
  try {
    const authResult = await requireAdmin(request);
    if (authResult instanceof NextResponse) return authResult;

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status") as MatchStatus | null;
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get("limit") || "20", 10) || 20));

    const where = status && STATUSES.includes(status) ? eq(manualMatches.status, status) : undefined;

    const [rows, [{ total }], grouped] = await Promise.all([
      db
        .select()
        .from(manualMatches)
        .where(where)
        .orderBy(desc(manualMatches.createdAt))
        .limit(limit)
        .offset((page - 1) * limit),
      db.select({ total: count() }).from(manualMatches).where(where),
      db
        .select({ status: manualMatches.status, n: count() })
        .from(manualMatches)
        .groupBy(manualMatches.status),
    ]);

    const stats: Record<MatchStatus, number> = { matched: 0, contacted: 0, successful: 0, unsuccessful: 0 };
    for (const g of grouped) if (g.status in stats) stats[g.status] = g.n;

    return NextResponse.json({
      matches: rows.map(withId),
      total,
      page,
      totalPages: Math.ceil(total / limit),
      stats,
    });
  } catch (error) {
    console.error("Admin matches fetch error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// POST — create a manual match
export async function POST(request: Request) {
  try {
    const authResult = await requireAdmin(request);
    if (authResult instanceof NextResponse) return authResult;

    const { user1Id, user2Id, notes } = await request.json().catch(() => ({}));
    if (!isUuid(user1Id) || !isUuid(user2Id)) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }
    if (user1Id === user2Id) {
      return NextResponse.json({ error: "Cannot match a user with themselves" }, { status: 400 });
    }

    const [u1, u2] = await Promise.all([getMemberById(user1Id), getMemberById(user2Id)]);
    if (!u1 || !u2) {
      return NextResponse.json({ error: "One or both users not found" }, { status: 404 });
    }

    const active = inArray(manualMatches.status, ["matched", "contacted"]);
    const [existing] = await db
      .select({ id: manualMatches.id })
      .from(manualMatches)
      .where(
        and(
          active,
          or(
            and(eq(manualMatches.user1Uid, u1.uid), eq(manualMatches.user2Uid, u2.uid)),
            and(eq(manualMatches.user1Uid, u2.uid), eq(manualMatches.user2Uid, u1.uid))
          )
        )
      )
      .limit(1);
    if (existing) {
      return NextResponse.json({ error: "An active match already exists between these users" }, { status: 409 });
    }

    const [match] = await db
      .insert(manualMatches)
      .values({
        user1Id: u1.id,
        user1Uid: u1.uid,
        user1Name: u1.profileName || u1.firstName || "Unknown",
        user2Id: u2.id,
        user2Uid: u2.uid,
        user2Name: u2.profileName || u2.firstName || "Unknown",
        notes: typeof notes === "string" ? notes.slice(0, 2000) : "",
        matchedBy: authResult.uid,
      })
      .returning();

    return NextResponse.json({ match: withId(match) });
  } catch (error) {
    console.error("Admin create match error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// PATCH — update match status or notes
export async function PATCH(request: Request) {
  try {
    const authResult = await requireAdmin(request);
    if (authResult instanceof NextResponse) return authResult;

    const { matchId, status, notes } = await request.json().catch(() => ({}));
    if (!isUuid(matchId)) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const updates: Partial<typeof manualMatches.$inferInsert> = {};
    if (status && STATUSES.includes(status)) updates.status = status;
    if (typeof notes === "string") updates.notes = notes.slice(0, 2000);
    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ error: "Nothing to update" }, { status: 400 });
    }

    const [match] = await db.update(manualMatches).set(updates).where(eq(manualMatches.id, matchId)).returning();
    if (!match) {
      return NextResponse.json({ error: "Match not found" }, { status: 404 });
    }
    return NextResponse.json({ match: withId(match) });
  } catch (error) {
    console.error("Admin update match error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// DELETE — remove a match
export async function DELETE(request: Request) {
  try {
    const authResult = await requireAdmin(request);
    if (authResult instanceof NextResponse) return authResult;

    const { matchId } = await request.json().catch(() => ({}));
    if (!isUuid(matchId)) {
      return NextResponse.json({ error: "Invalid match id" }, { status: 400 });
    }

    const deleted = await db.delete(manualMatches).where(eq(manualMatches.id, matchId)).returning({ id: manualMatches.id });
    if (deleted.length === 0) {
      return NextResponse.json({ error: "Match not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Admin delete match error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
