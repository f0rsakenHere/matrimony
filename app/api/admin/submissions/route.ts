import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import BiodataSubmission from "@/models/BiodataSubmission";
import { requireAdmin } from "@/lib/auth";
import { escapeRegex } from "@/lib/sanitize";

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

    // Demographic filters — the same shape as /api/admin/users so the shared
    // AdminUserFilters component can drive both pages.
    const gender = searchParams.get("gender");
    const maritalStatus = searchParams.get("maritalStatus");
    const educationLevel = searchParams.get("educationLevel");
    const sect = searchParams.get("sect");
    const beard = searchParams.get("beard");
    const country = searchParams.get("country")?.trim();
    const city = searchParams.get("city")?.trim();
    const bangladeshDistrict = searchParams.get("bangladeshDistrict")?.trim();
    const ageMin = searchParams.get("ageMin");
    const ageMax = searchParams.get("ageMax");
    const hasWali = searchParams.get("hasWali");

    await connectDB();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const filter: Record<string, any> = {};
    if (status && ["pending", "approved", "rejected", "spam"].includes(status)) {
      filter.moderationStatus = status;
    }

    if (gender) filter["biodata.personal.gender"] = gender;
    if (maritalStatus) filter["biodata.personal.maritalStatus"] = maritalStatus;
    if (educationLevel) filter["biodata.education.educationLevel"] = educationLevel;
    if (sect) filter["biodata.religious.sect"] = sect;
    if (beard) filter["biodata.religious.beard"] = beard;
    if (country) {
      filter["biodata.personal.country"] = {
        $regex: `^${escapeRegex(country)}$`,
        $options: "i",
      };
    }
    if (city) {
      filter["biodata.personal.city"] = {
        $regex: escapeRegex(city),
        $options: "i",
      };
    }
    if (bangladeshDistrict) {
      filter["biodata.personal.bangladeshDistrict"] = bangladeshDistrict;
    }

    if (hasWali === "true") {
      filter["biodata.family.waliName"] = { $ne: "" };
      filter["biodata.family.waliPhone"] = { $ne: "" };
    } else if (hasWali === "false") {
      filter.$or = [
        { "biodata.family.waliName": "" },
        { "biodata.family.waliName": { $exists: false } },
        { "biodata.family.waliPhone": "" },
        { "biodata.family.waliPhone": { $exists: false } },
      ];
    }

    if (ageMin || ageMax) {
      const today = new Date();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const dobFilter: Record<string, any> = {};
      if (ageMax) {
        const minDate = new Date(
          today.getFullYear() - parseInt(ageMax, 10) - 1,
          today.getMonth(),
          today.getDate() + 1
        );
        dobFilter.$gte = minDate.toISOString().split("T")[0];
      }
      if (ageMin) {
        const maxDate = new Date(
          today.getFullYear() - parseInt(ageMin, 10),
          today.getMonth(),
          today.getDate()
        );
        dobFilter.$lte = maxDate.toISOString().split("T")[0];
      }
      if (Object.keys(dobFilter).length > 0) {
        filter["biodata.personal.dateOfBirth"] = dobFilter;
      }
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
