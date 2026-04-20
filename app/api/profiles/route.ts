import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const uid = searchParams.get("uid");

    if (!uid) {
      return NextResponse.json(
        { error: "Missing uid parameter" },
        { status: 400 }
      );
    }

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

    // Fetch profiles of opposite gender, exclude current user
    const profiles = await User.find({
      firebaseUid: { $ne: uid },
      "biodata.personal.gender": targetGender,
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
