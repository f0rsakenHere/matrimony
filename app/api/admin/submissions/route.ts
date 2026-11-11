import { NextResponse } from "next/server";
import { and, count, desc, eq, type SQL } from "drizzle-orm";
import { db } from "@/lib/db";
import { biodataSubmissions, type ModerationStatus } from "@/lib/db/schema";
import { requireAdmin } from "@/lib/auth";
import { biodataFilters, withId } from "@/lib/db/helpers";

const STATUSES: ModerationStatus[] = ["pending", "approved", "rejected", "spam"];

export async function GET(request: Request) {
  try {
    const authResult = await requireAdmin(request);
    if (authResult instanceof NextResponse) return authResult;

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status") as ModerationStatus | null;
    const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") ?? "20", 10) || 20));

    // Same demographic filters as /api/admin/users so the shared
    // AdminUserFilters component drives both pages.
    const conds: SQL[] = biodataFilters(biodataSubmissions.biodata, searchParams);
    if (status && STATUSES.includes(status)) conds.push(eq(biodataSubmissions.moderationStatus, status));
    const where = conds.length ? and(...conds) : undefined;

    const [rows, [{ total }], grouped] = await Promise.all([
      db
        .select()
        .from(biodataSubmissions)
        .where(where)
        .orderBy(desc(biodataSubmissions.createdAt))
        .limit(limit)
        .offset((page - 1) * limit),
      db.select({ total: count() }).from(biodataSubmissions).where(where),
      db
        .select({ status: biodataSubmissions.moderationStatus, n: count() })
        .from(biodataSubmissions)
        .groupBy(biodataSubmissions.moderationStatus),
    ]);

    const statusCounts: Record<ModerationStatus, number> = { pending: 0, approved: 0, rejected: 0, spam: 0 };
    for (const g of grouped) if (g.status in statusCounts) statusCounts[g.status] = g.n;

    return NextResponse.json({
      submissions: rows.map(withId),
      total,
      page,
      totalPages: Math.max(1, Math.ceil(total / limit)),
      statusCounts,
    });
  } catch (error) {
    console.error("[/api/admin/submissions] GET error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
