import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";

export async function PUT(request: Request) {
  try {
    const { uid, data } = await request.json();

    if (!uid || !data) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    await connectDB();

    const allowedFields: Record<string, boolean> = {
      firstName: true,
      lastName: true,
      profileName: true,
      photoURL: true,
    };

    const update: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(data)) {
      if (allowedFields[key]) {
        update[key] = value;
      }
    }

    if (Object.keys(update).length === 0) {
      return NextResponse.json(
        { error: "No valid fields to update" },
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

    return NextResponse.json({ user });
  } catch (error) {
    console.error("Settings update error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
