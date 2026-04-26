import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import Notification from "@/models/Notification";
import { sendWelcomeEmail, sendAdminNewUserEmail } from "@/lib/email";
import { requireAuth } from "@/lib/auth";
import { authLimiter } from "@/lib/rate-limit";

export async function POST(request: Request) {
  try {
    const ip = request.headers.get("x-forwarded-for") ?? "unknown";
    const { success } = authLimiter.check(ip);
    if (!success) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    }

    const authResult = await requireAuth(request);
    if (authResult instanceof NextResponse) return authResult;
    const uid = authResult.uid;

    const { email, photoURL, provider } = await request.json();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: "Missing or invalid email" },
        { status: 400 }
      );
    }

    await connectDB();

    let user = await User.findOneAndUpdate(
      { firebaseUid: uid },
      {
        $setOnInsert: {
          firebaseUid: uid,
          email,
          provider: provider || "email",
          photoURL: photoURL || undefined,
          onboardingStep: 0,
          onboardingComplete: false,
          biodata: {},
        },
      },
      { upsert: true, new: true }
    );

    // Ensure biodata field exists for users created before it was added
    if (!user.biodata) {
      user = await User.findOneAndUpdate(
        { firebaseUid: uid },
        { $set: { biodata: {} } },
        { new: true }
      );
    }

    const isNewUser = !user!.biodata?.personal?.gender;

    // Send welcome notification for brand new users (no existing notifications)
    if (isNewUser) {
      const hasWelcome = await Notification.findOne({
        recipientUid: uid,
        type: "welcome",
      });
      if (!hasWelcome) {
        await Notification.create([
          {
            recipientUid: uid,
            type: "welcome",
            title: "Assalamu Alaikum!",
            message:
              "Welcome to BdCan Nikah. Complete your biodata so families can find the right match for you, In Sha Allah.",
          },
          {
            recipientUid: uid,
            type: "profile_incomplete",
            title: "Complete Your Profile",
            message:
              "Your biodata is incomplete. Fill in your personal details, family info, and Wali contact to appear in search results.",
          },
        ]);

        // Send emails (non-blocking — don't fail the request if email fails)
        Promise.all([
          sendWelcomeEmail(email, user!.firstName || ""),
          sendAdminNewUserEmail({
            email,
            firstName: user!.firstName,
            lastName: user!.lastName,
            provider: user!.provider,
            createdAt: user!.createdAt,
          }),
        ]).catch((err) => console.error("Signup email error:", err));
      }
    }

    return NextResponse.json({
      user,
      isNewUser,
    });
  } catch (error) {
    console.error("Auth sync error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
