import { NextResponse } from "next/server";
import mongoose from "mongoose";
import connectDB from "@/lib/mongodb";
import BiodataSubmission, {
  type IBiodataSubmission,
} from "@/models/BiodataSubmission";
import User from "@/models/User";
import { requireAdmin } from "@/lib/auth";

const VALID_STATUSES = ["pending", "approved", "rejected", "spam"] as const;
type Status = (typeof VALID_STATUSES)[number];

/**
 * Upsert a shadow User for an approved submission. Shadow users are real
 * Mongo records (so they can participate in ManualMatch) but carry
 * isShadow:true so they're filtered out of public profile queries until
 * the actual person signs up and claims them.
 *
 * The firebaseUid is "shadow:<submissionId>" — guaranteed unique, and the
 * "shadow:" prefix lets us also key off it in the auth-sync claim flow.
 */
async function upsertShadowUser(submission: IBiodataSubmission) {
  const submissionId = String(submission._id);
  const shadowUid = `shadow:${submissionId}`;
  const fullName = [submission.submitterFirstName, submission.submitterLastName]
    .filter((s) => s && s.trim())
    .join(" ")
    .trim();

  const existing = submission.shadowUserId
    ? await User.findById(submission.shadowUserId)
    : await User.findOne({ firebaseUid: shadowUid });

  if (existing) {
    existing.firstName = submission.submitterFirstName ?? "";
    existing.lastName = submission.submitterLastName ?? "";
    existing.profileName = fullName || existing.profileName;
    existing.biodata = submission.biodata;
    existing.isShadow = true;
    existing.sourceSubmissionId = submissionId;
    existing.onboardingComplete = true;
    if (submission.email && !existing.email) existing.email = submission.email;
    await existing.save();
    return existing;
  }

  const created = await User.create({
    firebaseUid: shadowUid,
    email: submission.email ?? `${shadowUid}@shadow.local`,
    provider: "email",
    firstName: submission.submitterFirstName ?? "",
    lastName: submission.submitterLastName ?? "",
    profileName: fullName,
    biodata: submission.biodata,
    onboardingStep: 4,
    onboardingComplete: true,
    isShadow: true,
    sourceSubmissionId: submissionId,
  });
  return created;
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authResult = await requireAdmin(request);
    if (authResult instanceof NextResponse) return authResult;

    const { id } = await params;
    if (!mongoose.isValidObjectId(id)) {
      return NextResponse.json({ error: "Invalid submission id" }, { status: 400 });
    }

    const body = await request.json().catch(() => ({}));
    const status: Status | undefined = body.status;
    const note: string | undefined = body.note;

    if (!status || !VALID_STATUSES.includes(status)) {
      return NextResponse.json(
        { error: "Invalid status" },
        { status: 400 }
      );
    }

    await connectDB();

    const updated = await BiodataSubmission.findByIdAndUpdate(
      id,
      {
        $set: {
          moderationStatus: status,
          ...(typeof note === "string" ? { moderationNote: note.slice(0, 1000) } : {}),
          moderatedByUid: authResult.uid,
          moderatedAt: new Date(),
        },
      },
      { new: true }
    );

    if (!updated) {
      return NextResponse.json(
        { error: "Submission not found" },
        { status: 404 }
      );
    }

    if (status === "approved") {
      const shadow = await upsertShadowUser(updated);
      if (!updated.shadowUserId || updated.shadowUserId !== String(shadow._id)) {
        updated.shadowUserId = String(shadow._id);
        await updated.save();
      }
    }

    return NextResponse.json({ submission: updated.toObject() });
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error("[/api/admin/submissions/:id] PATCH error:", msg);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authResult = await requireAdmin(request);
    if (authResult instanceof NextResponse) return authResult;

    const { id } = await params;

    await connectDB();

    const deleted = await BiodataSubmission.findByIdAndDelete(id);
    if (!deleted) {
      return NextResponse.json(
        { error: "Submission not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error("[/api/admin/submissions/:id] DELETE error:", msg);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
