import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import ManualMatch from "@/models/ManualMatch";
import { requireAdmin } from "@/lib/auth";

// GET — list manual matches
export async function GET(request: Request) {
  try {
    const authResult = await requireAdmin(request);
    if (authResult instanceof NextResponse) return authResult;

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get("limit") || "20", 10)));

    await connectDB();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const filter: Record<string, any> = {};
    if (status) filter.status = status;

    const skip = (page - 1) * limit;
    const [matches, total] = await Promise.all([
      ManualMatch.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      ManualMatch.countDocuments(filter),
    ]);

    // Count by status
    const [matchedCount, contactedCount, successfulCount, unsuccessfulCount] =
      await Promise.all([
        ManualMatch.countDocuments({ status: "matched" }),
        ManualMatch.countDocuments({ status: "contacted" }),
        ManualMatch.countDocuments({ status: "successful" }),
        ManualMatch.countDocuments({ status: "unsuccessful" }),
      ]);

    return NextResponse.json({
      matches,
      total,
      page,
      totalPages: Math.ceil(total / limit),
      stats: {
        matched: matchedCount,
        contacted: contactedCount,
        successful: successfulCount,
        unsuccessful: unsuccessfulCount,
      },
    });
  } catch (error) {
    console.error("Admin matches fetch error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// POST — create a manual match
export async function POST(request: Request) {
  try {
    const authResult = await requireAdmin(request);
    if (authResult instanceof NextResponse) return authResult;
    const adminUid = authResult.uid;

    const { user1Id, user2Id, notes } = await request.json();

    if (!user1Id || !user2Id) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    if (user1Id === user2Id) {
      return NextResponse.json({ error: "Cannot match a user with themselves" }, { status: 400 });
    }

    await connectDB();

    const [u1, u2] = await Promise.all([
      User.findById(user1Id).lean(),
      User.findById(user2Id).lean(),
    ]);

    if (!u1 || !u2) {
      return NextResponse.json({ error: "One or both users not found" }, { status: 404 });
    }

    const u1Data = u1 as { _id: string; firebaseUid: string; profileName?: string; firstName?: string };
    const u2Data = u2 as { _id: string; firebaseUid: string; profileName?: string; firstName?: string };

    // Check for existing active match between these two
    const existing = await ManualMatch.findOne({
      $or: [
        { user1Uid: u1Data.firebaseUid, user2Uid: u2Data.firebaseUid, status: { $in: ["matched", "contacted"] } },
        { user1Uid: u2Data.firebaseUid, user2Uid: u1Data.firebaseUid, status: { $in: ["matched", "contacted"] } },
      ],
    });

    if (existing) {
      return NextResponse.json({ error: "An active match already exists between these users" }, { status: 409 });
    }

    const match = await ManualMatch.create({
      user1Id: String(u1Data._id),
      user1Uid: u1Data.firebaseUid,
      user1Name: u1Data.profileName || u1Data.firstName || "Unknown",
      user2Id: String(u2Data._id),
      user2Uid: u2Data.firebaseUid,
      user2Name: u2Data.profileName || u2Data.firstName || "Unknown",
      notes: notes || "",
      matchedBy: adminUid,
    });

    return NextResponse.json({ match });
  } catch (error) {
    console.error("Admin create match error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// PATCH — update match status or notes
export async function PATCH(request: Request) {
  try {
    const authResult = await requireAdmin(request);
    if (authResult instanceof NextResponse) return authResult;

    const { matchId, status, notes } = await request.json();

    if (!matchId) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    await connectDB();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updates: Record<string, any> = {};
    if (status) updates.status = status;
    if (notes !== undefined) updates.notes = notes;

    const match = await ManualMatch.findByIdAndUpdate(
      matchId,
      { $set: updates },
      { new: true }
    ).lean();

    if (!match) {
      return NextResponse.json({ error: "Match not found" }, { status: 404 });
    }

    return NextResponse.json({ match });
  } catch (error) {
    console.error("Admin update match error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// DELETE — remove a match
export async function DELETE(request: Request) {
  try {
    const authResult = await requireAdmin(request);
    if (authResult instanceof NextResponse) return authResult;

    const { matchId } = await request.json();

    await connectDB();

    const deleted = await ManualMatch.findByIdAndDelete(matchId);
    if (!deleted) {
      return NextResponse.json({ error: "Match not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Admin delete match error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
