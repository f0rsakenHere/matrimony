import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import { sendBiodataReminderEmail } from "@/lib/email";
import { requireAuth } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const authResult = await requireAuth(request);
    if (authResult instanceof NextResponse) return authResult;
    const uid = authResult.uid;

    const { step, data } = await request.json();

    if (step === undefined) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    await connectDB();

    let update: Record<string, unknown> = {};

    switch (step) {
      case 1:
        update = {
          firstName: data.firstName,
          lastName: data.lastName,
          onboardingStep: 1,
        };
        break;
      case 2:
        update = {
          profileName: data.profileName,
          onboardingStep: 2,
        };
        break;
      case 3:
        update = {
          partnerPreferences: data.partnerPreferences,
          onboardingStep: 3,
          onboardingComplete: true,
        };
        break;
      default:
        return NextResponse.json(
          { error: "Invalid step" },
          { status: 400 }
        );
    }

    const user = await User.findOneAndUpdate(
      { firebaseUid: uid },
      { $set: update },
      { new: true }
    );

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // After onboarding completes, remind the user to fill their biodata
    if (step === 3) {
      sendBiodataReminderEmail(user.email, user.firstName || "")
        .catch((err) => console.error("Biodata reminder email error:", err));
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error("Onboarding error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
