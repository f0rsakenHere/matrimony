import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import { requireAuth } from "@/lib/auth";
import { escapeRegex } from "@/lib/sanitize";
import { apiLimiter } from "@/lib/rate-limit";

export async function GET(request: Request) {
  try {
    const authResult = await requireAuth(request);
    if (authResult instanceof NextResponse) return authResult;
    const uid = authResult.uid;

    const { success } = apiLimiter.check(uid);
    if (!success) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    }

    const { searchParams } = new URL(request.url);
    const search = searchParams.get("q")?.trim();
    const gender = searchParams.get("gender");
    const maritalStatus = searchParams.get("maritalStatus");
    const educationLevel = searchParams.get("educationLevel");
    const sect = searchParams.get("sect");
    const prayerRoutine = searchParams.get("prayerRoutine");
    const country = searchParams.get("country")?.trim();
    const city = searchParams.get("city")?.trim();
    const complexion = searchParams.get("complexion");
    const diet = searchParams.get("diet");
    const smoking = searchParams.get("smoking");
    const modesty = searchParams.get("modesty");
    const beard = searchParams.get("beard");
    const ageMin = searchParams.get("ageMin");
    const ageMax = searchParams.get("ageMax");
    const heightMin = searchParams.get("heightMin"); // e.g. "5'0\""
    const heightMax = searchParams.get("heightMax");
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get("limit") || "12", 10)));

    await connectDB();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const filter: Record<string, any> = {};

    // Exclude current user and show only opposite gender
    filter.firebaseUid = { $ne: uid };
    // Hide shadow users (auto-created from anonymous submissions) from
    // public-facing search — they haven't consented to being viewed by
    // other registered users until they sign up and claim their record.
    filter.isShadow = { $ne: true };
    const currentUser = await User.findOne({ firebaseUid: uid })
      .select("biodata.personal.gender")
      .lean();
    const userGender = (currentUser as { biodata?: { personal?: { gender?: string } } })
      ?.biodata?.personal?.gender;
    if (userGender) {
      filter["biodata.personal.gender"] = userGender === "Male" ? "Female" : "Male";
    } else {
      filter["biodata.personal.gender"] = { $in: ["Male", "Female"] };
    }

    // Override with explicit gender filter only if provided (admin use case)
    if (gender) filter["biodata.personal.gender"] = gender;
    if (maritalStatus) filter["biodata.personal.maritalStatus"] = maritalStatus;
    if (complexion) filter["biodata.personal.complexion"] = complexion;
    if (educationLevel) filter["biodata.education.educationLevel"] = educationLevel;
    if (sect) filter["biodata.religious.sect"] = sect;
    if (prayerRoutine) filter["biodata.religious.prayerRoutine"] = prayerRoutine;
    if (modesty) filter["biodata.religious.modesty"] = modesty;
    if (beard) filter["biodata.religious.beard"] = beard;
    if (diet) filter["biodata.lifestyle.diet"] = diet;
    if (smoking) filter["biodata.lifestyle.smoking"] = smoking;

    if (country) {
      filter["biodata.personal.country"] = { $regex: `^${escapeRegex(country)}$`, $options: "i" };
    }
    if (city) {
      filter["biodata.personal.city"] = { $regex: escapeRegex(city), $options: "i" };
    }

    // Age range → DOB boundaries (dateOfBirth stored as "YYYY-MM-DD" string)
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

    // Height range — stored as strings like 5'4", compare by converting to total inches
    // We handle this in-memory after fetch since MongoDB can't parse these strings easily
    // For now, we skip height filtering at DB level (filtered client-side or we use $where)

    // Text search
    if (search) {
      const escaped = escapeRegex(search);
      filter.$or = [
        { profileName: { $regex: escaped, $options: "i" } },
        { "biodata.personal.city": { $regex: escaped, $options: "i" } },
        { "biodata.personal.country": { $regex: escaped, $options: "i" } },
        { "biodata.education.occupation": { $regex: escaped, $options: "i" } },
        { "biodata.education.institution": { $regex: escaped, $options: "i" } },
        { "biodata.education.fieldOfStudy": { $regex: escaped, $options: "i" } },
      ];
    }

    const skip = (page - 1) * limit;

    const [profiles, total] = await Promise.all([
      User.find(filter)
        .select(
          "profileName photoURL biodata.personal biodata.education biodata.religious biodata.lifestyle biodata.family biodata.aboutMe"
        )
        .sort({ updatedAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      User.countDocuments(filter),
    ]);

    // Post-filter by height if needed
    let filtered = profiles;
    if (heightMin || heightMax) {
      const parseHeight = (h: string): number => {
        const m = h.match(/(\d+)'(\d+)"/);
        return m ? parseInt(m[1], 10) * 12 + parseInt(m[2], 10) : 0;
      };
      const minInches = heightMin ? parseHeight(heightMin) : 0;
      const maxInches = heightMax ? parseHeight(heightMax) : 999;
      filtered = profiles.filter((p) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const h = (p as any).biodata?.personal?.height;
        if (!h) return true;
        const inches = parseHeight(h);
        return inches >= minInches && inches <= maxInches;
      });
    }

    return NextResponse.json({
      profiles: filtered,
      total: heightMin || heightMax ? filtered.length : total,
      page,
      totalPages: Math.ceil((heightMin || heightMax ? filtered.length : total) / limit),
    });
  } catch (error) {
    console.error("Search error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
