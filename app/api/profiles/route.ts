import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import { requireAuth } from "@/lib/auth";

export async function GET(request: Request) {
  try {
    const authResult = await requireAuth(request);
    if (authResult instanceof NextResponse) return authResult;
    const uid = authResult.uid;

    await connectDB();

    // Get the current user's gender
    const currentUser = await User.findOne({ firebaseUid: uid }).lean();
    if (!currentUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const userGender =
      (currentUser.biodata as { personal?: { gender?: string } })?.personal
        ?.gender || "";

    // If gender not set, return empty
    if (!userGender) {
      return NextResponse.json({ profiles: [] });
    }

    // Determine opposite gender
    const targetGender = userGender === "Male" ? "Female" : "Male";

    // Fetch profiles of opposite gender, exclude current user.
    // Hide shadow users (auto-created from anonymous submissions); they're
    // not yet claimed by a real signed-up account.
    const profiles = await User.find({
      firebaseUid: { $ne: uid },
      "biodata.personal.gender": targetGender,
      isShadow: { $ne: true },
    })
      .select(
        "profileName photoURL biodata.personal biodata.education biodata.religious biodata.lifestyle biodata.aboutMe"
      )
      .lean();

    return NextResponse.json({ profiles });
  } catch (error) {
    console.error("Profiles fetch error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
