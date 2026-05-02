import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import BiodataSubmission from "@/models/BiodataSubmission";
import { requireAdmin } from "@/lib/auth";

const VALID_STATUSES = ["pending", "approved", "rejected", "spam"] as const;
type Status = (typeof VALID_STATUSES)[number];

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authResult = await requireAdmin(request);
    if (authResult instanceof NextResponse) return authResult;

    const { id } = await params;
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
    ).lean();

    if (!updated) {
      return NextResponse.json(
        { error: "Submission not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ submission: updated });
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
