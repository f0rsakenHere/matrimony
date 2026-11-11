import { NextResponse } from "next/server";
import { eq, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import { members, type Member } from "@/lib/db/schema";
import { sendAdminBiodataEmail } from "@/lib/email";
import { getProfileCompletion } from "@/lib/profile-completion";
import { requireAuth } from "@/lib/auth";
import { sanitizeBiodataSection } from "@/lib/sanitize";
import { getMemberByUid, memberJson } from "@/lib/server/members";
import { normalizeBiodata } from "@/lib/types/biodata";

const VALID_SECTIONS = ["personal", "education", "family", "religious", "lifestyle", "aboutMe"];

function completion(m: Member) {
  return getProfileCompletion({
    profileName: m.profileName || "",
    firstName: m.firstName || "",
    lastName: m.lastName || "",
    biodata: normalizeBiodata(m.biodata) as Parameters<typeof getProfileCompletion>[0]["biodata"],
  });
}

export async function PUT(request: Request) {
  try {
    const authResult = await requireAuth(request);
    if (authResult instanceof NextResponse) return authResult;
    const uid = authResult.uid;

    const { section, data } = await request.json().catch(() => ({}));
    if (!section || !VALID_SECTIONS.includes(section)) {
      return NextResponse.json({ error: "Invalid section" }, { status: 400 });
    }

    const value: unknown =
      section === "aboutMe"
        ? typeof data === "string"
          ? data.slice(0, 1000)
          : ""
        : sanitizeBiodataSection(section, data);
    if (value === null) {
      return NextResponse.json({ error: "Invalid data format" }, { status: 400 });
    }

    const before = await getMemberByUid(uid);
    if (!before) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    const completionBefore = completion(before);

    // Atomic single-key update of the jsonb document.
    const path = `{${section}}`;
    const [user] = await db
      .update(members)
      .set({
        biodata: sql`jsonb_set(coalesce(${members.biodata}, '{}'::jsonb), ${path}::text[], ${JSON.stringify(value)}::jsonb, true)`,
      })
      .where(eq(members.uid, uid))
      .returning();

    // Notify admin once when profile crosses the 80% completion threshold
    const completionAfter = completion(user);
    if (completionBefore < 80 && completionAfter >= 80) {
      sendAdminBiodataEmail({
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        completionPct: completionAfter,
      }).catch((err) => console.error("Admin biodata email error:", err));
    }

    return NextResponse.json({ user: memberJson(user) });
  } catch (error) {
    console.error("Biodata update error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
