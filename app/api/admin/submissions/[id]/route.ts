import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { biodataSubmissions, members, type BiodataSubmission, type ModerationStatus } from "@/lib/db/schema";
import { requireAdmin } from "@/lib/auth";
import { isUuid, withId } from "@/lib/db/helpers";

const VALID_STATUSES: ModerationStatus[] = ["pending", "approved", "rejected", "spam"];

type Tx = Parameters<Parameters<typeof db.transaction>[0]>[0];

/**
 * Upsert a shadow member for an approved submission. Shadow members are real
 * rows (so they can take part in manual matches) but carry isShadow = true
 * and uid "shadow:<submissionId>", and are hidden from member-facing queries.
 */
async function upsertShadowMember(tx: Tx, submission: BiodataSubmission) {
  const shadowUid = `shadow:${submission.id}`;
  const fullName = [submission.submitterFirstName, submission.submitterLastName]
    .filter((s) => s && s.trim())
    .join(" ")
    .trim();

  const [shadow] = await tx
    .insert(members)
    .values({
      uid: shadowUid,
      email: submission.email || `${shadowUid}@shadow.local`,
      provider: "email",
      firstName: submission.submitterFirstName,
      lastName: submission.submitterLastName,
      profileName: fullName,
      biodata: submission.biodata,
      onboardingStep: 4,
      onboardingComplete: true,
      isShadow: true,
      sourceSubmissionId: submission.id,
    })
    .onConflictDoUpdate({
      target: members.uid,
      set: {
        firstName: submission.submitterFirstName,
        lastName: submission.submitterLastName,
        profileName: fullName,
        biodata: submission.biodata,
        isShadow: true,
        onboardingComplete: true,
      },
    })
    .returning({ id: members.id });
  return shadow;
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const authResult = await requireAdmin(request);
    if (authResult instanceof NextResponse) return authResult;

    const { id } = await params;
    if (!isUuid(id)) {
      return NextResponse.json({ error: "Invalid submission id" }, { status: 400 });
    }

    const body = await request.json().catch(() => ({}));
    const status = body.status as ModerationStatus | undefined;
    const note: unknown = body.note;
    if (!status || !VALID_STATUSES.includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    const result = await db.transaction(async (tx) => {
      const [updated] = await tx
        .update(biodataSubmissions)
        .set({
          moderationStatus: status,
          ...(typeof note === "string" ? { moderationNote: note.slice(0, 1000) } : {}),
          moderatedByUid: authResult.uid,
          moderatedAt: new Date(),
        })
        .where(eq(biodataSubmissions.id, id))
        .returning();
      if (!updated) return null;

      if (status === "approved") {
        const shadow = await upsertShadowMember(tx, updated);
        if (updated.shadowUserId !== shadow.id) {
          const [linked] = await tx
            .update(biodataSubmissions)
            .set({ shadowUserId: shadow.id })
            .where(eq(biodataSubmissions.id, id))
            .returning();
          return linked;
        }
      }
      return updated;
    });

    if (!result) {
      return NextResponse.json({ error: "Submission not found" }, { status: 404 });
    }
    return NextResponse.json({ submission: withId(result) });
  } catch (error) {
    console.error("[/api/admin/submissions/:id] PATCH error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const authResult = await requireAdmin(request);
    if (authResult instanceof NextResponse) return authResult;

    const { id } = await params;
    if (!isUuid(id)) {
      return NextResponse.json({ error: "Invalid submission id" }, { status: 400 });
    }

    const deleted = await db
      .delete(biodataSubmissions)
      .where(eq(biodataSubmissions.id, id))
      .returning({ id: biodataSubmissions.id });
    if (deleted.length === 0) {
      return NextResponse.json({ error: "Submission not found" }, { status: 404 });
    }
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[/api/admin/submissions/:id] DELETE error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
