import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import { sendBiodataReminderEmail } from "@/lib/email";
import { requireAuth } from "@/lib/auth";

const NAME_MAX = 80;
const PROFILE_NAME_MAX = 60;
const PREF_STRING_MAX = 200;
const QUALIFICATION_MAX_ITEMS = 20;

function clampString(v: unknown, max: number): string {
  if (typeof v !== "string") return "";
  return v.trim().slice(0, max);
}

function sanitizePartnerPreferences(input: unknown) {
  const src = (input && typeof input === "object" ? input : {}) as Record<
    string,
    unknown
  >;
  const qualificationRaw = Array.isArray(src.qualification)
    ? src.qualification
    : [];
  const qualification = qualificationRaw
    .slice(0, QUALIFICATION_MAX_ITEMS)
    .map((q) => clampString(q, PREF_STRING_MAX))
    .filter((q) => q.length > 0);

  return {
    qualification,
    religiousHistory: clampString(src.religiousHistory, PREF_STRING_MAX),
    sect: clampString(src.sect, PREF_STRING_MAX),
    prayerRoutine: clampString(src.prayerRoutine, PREF_STRING_MAX),
    modesty: clampString(src.modesty, PREF_STRING_MAX),
  };
}

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

    const safeData = (data && typeof data === "object" ? data : {}) as Record<
      string,
      unknown
    >;

    await connectDB();

    let update: Record<string, unknown> = {};

    switch (step) {
      case 1:
        update = {
          firstName: clampString(safeData.firstName, NAME_MAX),
          lastName: clampString(safeData.lastName, NAME_MAX),
          onboardingStep: 1,
        };
        break;
      case 2:
        update = {
          profileName: clampString(safeData.profileName, PROFILE_NAME_MAX),
          onboardingStep: 2,
        };
        break;
      case 3:
        update = {
          partnerPreferences: sanitizePartnerPreferences(
            safeData.partnerPreferences
          ),
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
