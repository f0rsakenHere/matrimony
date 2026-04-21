import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import { sendAdminBiodataEmail } from "@/lib/email";
import { getProfileCompletion } from "@/lib/profile-completion";

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

    // Snapshot completion before update
    const userBefore = await User.findOne({ firebaseUid: uid });
    const completionBefore = userBefore
      ? getProfileCompletion({
          profileName: userBefore.profileName || "",
          firstName: userBefore.firstName || "",
          lastName: userBefore.lastName || "",
          biodata: userBefore.biodata as Parameters<typeof getProfileCompletion>[0]["biodata"],
        })
      : 0;

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

    // Notify admin once when profile crosses the 80% completion threshold
    const completionAfter = getProfileCompletion({
      profileName: user.profileName || "",
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      biodata: user.biodata as Parameters<typeof getProfileCompletion>[0]["biodata"],
    });
    if (completionBefore < 80 && completionAfter >= 80) {
      sendAdminBiodataEmail({
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        completionPct: completionAfter,
      }).catch((err) => console.error("Admin biodata email error:", err));
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
