import { NextResponse } from "next/server";
import { eq, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import { members, type Member } from "@/lib/db/schema";
import { sendAdminBiodataEmail, sendWaliNotificationEmail } from "@/lib/email";
import { waliEmailLimiter } from "@/lib/rate-limit";
import { clearWali, waliErrorSentence, waliRequired } from "@/lib/wali";
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
    const beforeBio = normalizeBiodata(before.biodata);

    // Wali rules (lib/wali.ts): mandatory for sisters, complete-if-started for
    // brothers. Matches go to the wali by email only.
    let newWaliEmail: string | null = null;
    if (section === "family") {
      const fam = value as Record<string, string>;
      const gender = beforeBio.personal.gender;
      if (gender === "Male") clearWali(fam); // brothers have no wali
      const problem = waliErrorSentence(gender, fam);
      if (problem) {
        return NextResponse.json({ error: problem }, { status: 400 });
      }
      fam.waliEmail = (fam.waliEmail ?? "").trim().toLowerCase();
      fam.waliContactMethod = waliRequired(gender, fam) ? "Email" : "";
      if (fam.waliEmail && fam.waliEmail !== beforeBio.family.waliEmail.trim().toLowerCase()) {
        newWaliEmail = fam.waliEmail;
      }
    }

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

    // A new or changed wali email: let the wali know they've been named.
    // Rate-limited per member so this can't be used to spam an address.
    if (newWaliEmail && newWaliEmail !== user.email.toLowerCase()) {
      if (waliEmailLimiter.check(uid).success) {
        const fam = normalizeBiodata(user.biodata).family;
        sendWaliNotificationEmail({
          to: newWaliEmail,
          waliName: fam.waliName,
          relationship: fam.waliRelationship,
          candidateName: `${user.firstName} ${user.lastName}`.trim() || user.profileName || "",
          gender: normalizeBiodata(user.biodata).personal.gender,
        }).catch((err) => console.error("Wali notification email error:", err));
      } else {
        console.warn(`[biodata] wali email rate limit reached for ${uid}; notification skipped`);
      }
    }

    return NextResponse.json({ user: memberJson(user) });
  } catch (error) {
    console.error("Biodata update error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
