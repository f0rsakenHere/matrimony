import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import BiodataSubmission from "@/models/BiodataSubmission";
import { requireAdmin } from "@/lib/auth";

export async function GET(request: Request) {
  try {
    const authResult = await requireAdmin(request);
    if (authResult instanceof NextResponse) return authResult;

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
    const limit = Math.min(
      100,
      Math.max(1, parseInt(searchParams.get("limit") ?? "20", 10))
    );

    await connectDB();

    const filter: Record<string, unknown> = {};
    if (status && ["pending", "approved", "rejected", "spam"].includes(status)) {
      filter.moderationStatus = status;
    }

    const skip = (page - 1) * limit;

    const [submissions, total, counts] = await Promise.all([
      BiodataSubmission.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      BiodataSubmission.countDocuments(filter),
      BiodataSubmission.aggregate([
        { $group: { _id: "$moderationStatus", count: { $sum: 1 } } },
      ]),
    ]);

    const statusCounts: Record<string, number> = {
      pending: 0,
      approved: 0,
      rejected: 0,
      spam: 0,
    };
    for (const c of counts) {
      if (c._id in statusCounts) statusCounts[c._id] = c.count;
    }

    return NextResponse.json({
      submissions,
      total,
      page,
      totalPages: Math.max(1, Math.ceil(total / limit)),
      statusCounts,
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error("[/api/admin/submissions] GET error:", msg);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
