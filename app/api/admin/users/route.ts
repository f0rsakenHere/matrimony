import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import { requireAdmin } from "@/lib/auth";
import { escapeRegex } from "@/lib/sanitize";

export async function GET(request: Request) {
  try {
    const authResult = await requireAdmin(request);
    if (authResult instanceof NextResponse) return authResult;

    const { searchParams } = new URL(request.url);
    await connectDB();

    // Filters
    const search = searchParams.get("q")?.trim();
    const gender = searchParams.get("gender");
    const maritalStatus = searchParams.get("maritalStatus");
    const educationLevel = searchParams.get("educationLevel");
    const sect = searchParams.get("sect");
    const country = searchParams.get("country")?.trim();
    const city = searchParams.get("city")?.trim();
    const bangladeshDistrict = searchParams.get("bangladeshDistrict")?.trim();
    const ageMin = searchParams.get("ageMin");
    const ageMax = searchParams.get("ageMax");
    const onboardingComplete = searchParams.get("onboardingComplete");
    const provider = searchParams.get("provider");
    const hasWali = searchParams.get("hasWali");
    const beard = searchParams.get("beard");
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const sortOrder = searchParams.get("sortOrder") === "asc" ? 1 : -1;
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "20", 10)));

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const filter: Record<string, any> = {};

    if (gender) filter["biodata.personal.gender"] = gender;
    if (maritalStatus) filter["biodata.personal.maritalStatus"] = maritalStatus;
    if (educationLevel) filter["biodata.education.educationLevel"] = educationLevel;
    if (sect) filter["biodata.religious.sect"] = sect;
    if (beard) filter["biodata.religious.beard"] = beard;
    if (provider) filter.provider = provider;

    if (onboardingComplete === "true") filter.onboardingComplete = true;
    if (onboardingComplete === "false") filter.onboardingComplete = false;

    if (hasWali === "true") {
      filter["biodata.family.waliName"] = { $ne: "" };
      filter["biodata.family.waliPhone"] = { $ne: "" };
    }

    // Collect $or conditions to avoid overwriting
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const orConditions: Record<string, any>[][] = [];

    if (hasWali === "false") {
      orConditions.push([
        { "biodata.family.waliName": "" },
        { "biodata.family.waliName": { $exists: false } },
        { "biodata.family.waliPhone": "" },
        { "biodata.family.waliPhone": { $exists: false } },
      ]);
    }

    if (country) {
      filter["biodata.personal.country"] = { $regex: `^${escapeRegex(country)}$`, $options: "i" };
    }
    if (city) {
      filter["biodata.personal.city"] = { $regex: escapeRegex(city), $options: "i" };
    }
    if (bangladeshDistrict) {
      filter["biodata.personal.bangladeshDistrict"] = bangladeshDistrict;
    }

    // Age range
    if (ageMin || ageMax) {
      const today = new Date();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const dobFilter: Record<string, any> = {};
      if (ageMax) {
        const minDate = new Date(today.getFullYear() - parseInt(ageMax, 10) - 1, today.getMonth(), today.getDate() + 1);
        dobFilter.$gte = minDate.toISOString().split("T")[0];
      }
      if (ageMin) {
        const maxDate = new Date(today.getFullYear() - parseInt(ageMin, 10), today.getMonth(), today.getDate());
        dobFilter.$lte = maxDate.toISOString().split("T")[0];
      }
      if (Object.keys(dobFilter).length > 0) {
        filter["biodata.personal.dateOfBirth"] = dobFilter;
      }
    }

    // Text search
    if (search) {
      const escaped = escapeRegex(search);
      orConditions.push([
        { profileName: { $regex: escaped, $options: "i" } },
        { email: { $regex: escaped, $options: "i" } },
        { firstName: { $regex: escaped, $options: "i" } },
        { lastName: { $regex: escaped, $options: "i" } },
        { "biodata.personal.city": { $regex: escaped, $options: "i" } },
        { "biodata.personal.country": { $regex: escaped, $options: "i" } },
        { "biodata.education.occupation": { $regex: escaped, $options: "i" } },
      ]);
    }

    // Combine multiple $or conditions with $and
    if (orConditions.length === 1) {
      filter.$or = orConditions[0];
    } else if (orConditions.length > 1) {
      filter.$and = orConditions.map((cond) => ({ $or: cond }));
    }

    const skip = (page - 1) * limit;
    const sortField = sortBy === "name" ? "profileName" : sortBy === "email" ? "email" : "createdAt";

    const [users, total] = await Promise.all([
      User.find(filter)
        .sort({ [sortField]: sortOrder })
        .skip(skip)
        .limit(limit)
        .lean(),
      User.countDocuments(filter),
    ]);

    return NextResponse.json({
      users,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("Admin users fetch error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// DELETE a user
export async function DELETE(request: Request) {
  try {
    const authResult = await requireAdmin(request);
    if (authResult instanceof NextResponse) return authResult;

    const { userId } = await request.json();

    await connectDB();

    const deleted = await User.findByIdAndDelete(userId);
    if (!deleted) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Admin delete error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// PATCH — toggle admin, etc.
export async function PATCH(request: Request) {
  try {
    const authResult = await requireAdmin(request);
    if (authResult instanceof NextResponse) return authResult;

    const { userId, updates } = await request.json();

    await connectDB();

    // Only allow safe fields
    const allowed: Record<string, boolean> = {
      isAdmin: true,
      onboardingComplete: true,
    };
    const safeUpdates: Record<string, unknown> = {};
    for (const [key, val] of Object.entries(updates)) {
      if (allowed[key]) safeUpdates[key] = val;
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { $set: safeUpdates },
      { new: true }
    ).lean();

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error("Admin patch error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
