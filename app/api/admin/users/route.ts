import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";

// Verify the requesting user is an admin
async function verifyAdmin(uid: string | null) {
  if (!uid) return false;
  const user = await User.findOne({ firebaseUid: uid }).select("isAdmin").lean();
  return !!(user as { isAdmin?: boolean })?.isAdmin;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const adminUid = searchParams.get("adminUid");

    await connectDB();

    if (!(await verifyAdmin(adminUid))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // Filters
    const search = searchParams.get("q")?.trim();
    const gender = searchParams.get("gender");
    const maritalStatus = searchParams.get("maritalStatus");
    const educationLevel = searchParams.get("educationLevel");
    const sect = searchParams.get("sect");
    const country = searchParams.get("country")?.trim();
    const city = searchParams.get("city")?.trim();
    const ageMin = searchParams.get("ageMin");
    const ageMax = searchParams.get("ageMax");
    const onboardingComplete = searchParams.get("onboardingComplete");
    const provider = searchParams.get("provider");
    const hasWali = searchParams.get("hasWali");
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
    if (provider) filter.provider = provider;

    if (onboardingComplete === "true") filter.onboardingComplete = true;
    if (onboardingComplete === "false") filter.onboardingComplete = false;

    if (hasWali === "true") {
      filter["biodata.family.waliName"] = { $ne: "" };
      filter["biodata.family.waliPhone"] = { $ne: "" };
    }
    if (hasWali === "false") {
      filter.$or = [
        { "biodata.family.waliName": "" },
        { "biodata.family.waliName": { $exists: false } },
        { "biodata.family.waliPhone": "" },
        { "biodata.family.waliPhone": { $exists: false } },
      ];
    }

    if (country) {
      filter["biodata.personal.country"] = { $regex: `^${country}$`, $options: "i" };
    }
    if (city) {
      filter["biodata.personal.city"] = { $regex: city, $options: "i" };
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
      filter.$or = [
        { profileName: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { firstName: { $regex: search, $options: "i" } },
        { lastName: { $regex: search, $options: "i" } },
        { "biodata.personal.city": { $regex: search, $options: "i" } },
        { "biodata.personal.country": { $regex: search, $options: "i" } },
        { "biodata.education.occupation": { $regex: search, $options: "i" } },
      ];
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
    const { adminUid, userId } = await request.json();

    await connectDB();

    if (!(await verifyAdmin(adminUid))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

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
    const { adminUid, userId, updates } = await request.json();

    await connectDB();

    if (!(await verifyAdmin(adminUid))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

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
