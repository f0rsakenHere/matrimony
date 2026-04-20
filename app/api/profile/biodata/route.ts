import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";

export async function PUT(request: Request) {
  try {
    const { uid, section, data } = await request.json();

    if (!uid || !section) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const validSections = [
      "personal",
      "education",
      "family",
      "religious",
      "lifestyle",
      "aboutMe",
    ];
    if (!validSections.includes(section)) {
      return NextResponse.json(
        { error: "Invalid section" },
        { status: 400 }
      );
    }

    await connectDB();

    const updateKey =
      section === "aboutMe" ? "biodata.aboutMe" : `biodata.${section}`;

    console.log("[biodata API] section:", section);
    console.log("[biodata API] updateKey:", updateKey);
    console.log("[biodata API] data received:", JSON.stringify(data));

    const user = await User.findOneAndUpdate(
      { firebaseUid: uid },
      { $set: { [updateKey]: data } },
      { new: true }
    );

    if (user) {
      const savedSection = section === "aboutMe" ? user.biodata?.aboutMe : user.biodata?.[section as keyof typeof user.biodata];
      console.log("[biodata API] saved result:", JSON.stringify(savedSection));
    }

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error("Biodata update error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
