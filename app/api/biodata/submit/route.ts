import { NextResponse } from "next/server";
import crypto from "node:crypto";
import { db } from "@/lib/db";
import { biodataSubmissions } from "@/lib/db/schema";
import { clientIp } from "@/lib/auth";
import { sendSubmissionEmail, sendSubmissionReceivedEmail, sendWaliNotificationEmail } from "@/lib/email";
import { clearWali, waliErrorSentence, waliRequired } from "@/lib/wali";
import { submissionLimiter } from "@/lib/rate-limit";
import { EMPTY_BIODATA, type BiodataSection } from "@/lib/types/biodata";
import {
  ETHNICITY_OPTIONS,
  PUBLIC_HEIGHT_OPTIONS,
  WEIGHT_KG_OPTIONS,
  CITIZENSHIP_STATUS_OPTIONS,
  PUBLIC_MARITAL_STATUS_OPTIONS,
  HIJAB_OPTIONS,
  PUBLIC_WALI_RELATIONSHIP_OPTIONS,
  WALI_CONTACT_METHOD_OPTIONS,
  HOW_HEARD_OPTIONS,
  GENDER_OPTIONS,
} from "@/lib/constants/biodata-options";

const STRING_FIELDS_BY_SECTION: Record<
  Exclude<keyof BiodataSection, "aboutMe" | "lookingFor">,
  string[]
> = {
  personal: Object.keys(EMPTY_BIODATA.personal),
  education: Object.keys(EMPTY_BIODATA.education),
  family: Object.keys(EMPTY_BIODATA.family),
  religious: Object.keys(EMPTY_BIODATA.religious),
  lifestyle: Object.keys(EMPTY_BIODATA.lifestyle),
};

const LONG_TEXT_MAX = 3000;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const DOB_RE = /^(\d{4})-(\d{2})-(\d{2})$/;

function sanitizeString(v: unknown, max = 500): string {
  if (typeof v !== "string") return "";
  // Trim, drop null bytes, cap length.
  return v.replace(/\0/g, "").trim().slice(0, max);
}

function sanitizeBiodata(input: unknown): BiodataSection {
  const out: BiodataSection = JSON.parse(JSON.stringify(EMPTY_BIODATA));
  if (!input || typeof input !== "object") return out;
  const src = input as Record<string, unknown>;

  for (const section of Object.keys(STRING_FIELDS_BY_SECTION) as Array<
    keyof typeof STRING_FIELDS_BY_SECTION
  >) {
    const sectionData = src[section];
    if (sectionData && typeof sectionData === "object") {
      const sectionSrc = sectionData as Record<string, unknown>;
      for (const field of STRING_FIELDS_BY_SECTION[section]) {
        const sectionOut = out[section] as Record<string, string>;
        sectionOut[field] = sanitizeString(sectionSrc[field]);
      }
    }
  }

  out.aboutMe = sanitizeString(src.aboutMe, LONG_TEXT_MAX);
  out.lookingFor = sanitizeString(src.lookingFor, LONG_TEXT_MAX);
  return out;
}

/** A complete, real calendar date — rejects partial sentinels like "0000-00-12". */
function isValidDob(v: string): boolean {
  const m = DOB_RE.exec(v);
  if (!m) return false;
  const [y, mo, d] = [Number(m[1]), Number(m[2]), Number(m[3])];
  if (y < 1900 || mo < 1 || mo > 12 || d < 1) return false;
  const date = new Date(y, mo - 1, d);
  return date.getFullYear() === y && date.getMonth() === mo - 1 && date.getDate() === d;
}

/** Empty is allowed (field optional); otherwise must be one of the options. */
function inOptions(v: string, options: readonly string[]): boolean {
  return v === "" || options.includes(v);
}

function hashIp(ip: string): string {
  return crypto.createHash("sha256").update(ip).digest("hex").slice(0, 32);
}

export async function POST(request: Request) {
  try {
    const ip = clientIp(request);
    // Only successful submissions count toward the limit (counted after the
    // insert below), so fixing validation errors never locks someone out.
    if (!submissionLimiter.peek(ip)) {
      return NextResponse.json(
        { error: "Too many submissions. Please try again tomorrow." },
        { status: 429 }
      );
    }

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    const payload = (body ?? {}) as Record<string, unknown>;

    // Honeypot — bots fill the hidden field, humans don't. Silently accept
    // (return 200 so bots don't learn) but never persist.
    if (typeof payload.website === "string" && payload.website.length > 0) {
      return NextResponse.json({ ok: true, submissionId: null });
    }

    const biodata = sanitizeBiodata(payload.biodata);
    const submitterFirstName = sanitizeString(payload.submitterFirstName, 80);
    const submitterLastName = sanitizeString(payload.submitterLastName, 80);
    const email = sanitizeString(payload.email, 200).toLowerCase();
    const phone = sanitizeString(payload.phone, 40);
    const howHeard = sanitizeString(payload.howHeard, 100);
    const faithDeclarationAccepted = payload.faithDeclarationAccepted === true;

    const p = biodata.personal;
    const f = biodata.family;
    const isSister = p.gender === "Female";

    // Required-field validation — mirrors the client form.
    const errors: string[] = [];
    if (!GENDER_OPTIONS.includes(p.gender)) errors.push("Please choose sister or brother.");
    if (!submitterFirstName) errors.push("First name is required.");
    if (!submitterLastName) errors.push("Last name is required.");
    if (!EMAIL_RE.test(email)) errors.push("A valid email is required.");
    if (!phone) errors.push("Phone is required.");
    if (!p.city) errors.push("City is required.");
    if (!p.country) errors.push("Country is required.");
    if (!p.ethnicity) errors.push("Ethnicity is required.");
    if (!biodata.lifestyle.languages) errors.push("Languages are required.");
    if (!isValidDob(p.dateOfBirth)) errors.push("A complete date of birth is required.");
    if (!p.height) errors.push("Height is required.");
    if (!p.weight) errors.push("Weight is required.");
    if (!p.healthIssues) errors.push("Please answer the health question.");
    if (!p.citizenshipStatus) errors.push("Citizenship status is required.");
    if (!p.maritalStatus) errors.push("Marital status is required.");
    if (isSister && !biodata.religious.hijab) errors.push("Please answer the hijab question.");
    if (!biodata.aboutMe) errors.push("Please tell us what you do in life.");
    if (!biodata.lookingFor) errors.push("Please describe what you are looking for.");
    if (!faithDeclarationAccepted) errors.push("The declaration of Islamic faith must be accepted.");

    // Wali: mandatory for sisters (name, relationship, email); brothers have
    // no wali, so anything sent for them is discarded. Matches go to the wali
    // by email only, so the contact method is set here, never from the client.
    if (!isSister) clearWali(f);
    const waliProblem = waliErrorSentence(p.gender, f);
    if (waliProblem) errors.push(waliProblem);
    f.waliEmail = f.waliEmail.toLowerCase();
    f.waliContactMethod = waliRequired(p.gender, f) ? "Email" : "";

    // Dropdown values must come from the known lists.
    const optionChecks: Array<[string, readonly string[], string]> = [
      [p.ethnicity, ETHNICITY_OPTIONS, "Ethnicity"],
      [p.otherEthnicity, ETHNICITY_OPTIONS, "Other ethnicity"],
      [p.height, PUBLIC_HEIGHT_OPTIONS, "Height"],
      [p.weight, WEIGHT_KG_OPTIONS, "Weight"],
      [p.citizenshipStatus, CITIZENSHIP_STATUS_OPTIONS, "Citizenship status"],
      [p.maritalStatus, PUBLIC_MARITAL_STATUS_OPTIONS, "Marital status"],
      [biodata.religious.hijab, HIJAB_OPTIONS, "Hijab"],
      [f.waliRelationship, PUBLIC_WALI_RELATIONSHIP_OPTIONS, "Wali relationship"],
      [f.waliContactMethod, WALI_CONTACT_METHOD_OPTIONS, "Wali contact method"],
      [howHeard, HOW_HEARD_OPTIONS, "How did you hear about us"],
    ];
    for (const [value, options, label] of optionChecks) {
      if (!inOptions(value, options)) errors.push(`${label} has an invalid value.`);
    }

    if (errors.length > 0) {
      return NextResponse.json({ error: errors.join(" ") }, { status: 400 });
    }

    // Brothers aren't asked the hijab question.
    if (!isSister) biodata.religious.hijab = "";

    const [submission] = await db
      .insert(biodataSubmissions)
      .values({
      biodata,
      submitterFirstName,
      submitterLastName,
      email,
      phone,
      howHeard,
      faithDeclarationAccepted: true,
      faithDeclarationAcceptedAt: new Date(),
      moderationStatus: "pending",
      ipHash: hashIp(ip),
      userAgent: (request.headers.get("user-agent") ?? "").slice(0, 500),
      })
      .returning({ id: biodataSubmissions.id, createdAt: biodataSubmissions.createdAt });
    submissionLimiter.check(ip);

    // Emails (fire-and-forget: the submission is already saved, so a mail
    // failure must not fail it):
    //  1. the full biodata + PDF to the office inbox,
    //  2. a confirmation to the person who submitted,
    //  3. a notice to the wali, unless the wali uses the same inbox.
    const wali = f.waliEmail ? { name: f.waliName, email: f.waliEmail } : null;
    const candidateName = `${submitterFirstName} ${submitterLastName}`.trim();
    const sends: Array<[string, Promise<unknown>]> = [
      [
        "office",
        sendSubmissionEmail({
          id: submission.id,
          createdAt: submission.createdAt,
          submitterFirstName,
          submitterLastName,
          email,
          phone,
          howHeard,
          biodata,
        }),
      ],
      ["submitter", sendSubmissionReceivedEmail({ to: email, firstName: submitterFirstName, wali })],
    ];
    if (wali && wali.email !== email) {
      sends.push([
        "wali",
        sendWaliNotificationEmail({
          to: wali.email,
          waliName: f.waliName,
          relationship: f.waliRelationship,
          candidateName,
          gender: p.gender,
        }),
      ]);
    }
    void Promise.allSettled(sends.map(([, pr]) => pr)).then((results) =>
      results.forEach((res, i) => {
        if (res.status === "rejected") {
          console.error(`[/api/biodata/submit] ${sends[i][0]} email failed:`, res.reason);
        }
      })
    );

    return NextResponse.json({
      ok: true,
      submissionId: submission.id,
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error("[/api/biodata/submit] error:", msg);
    return NextResponse.json(
      {
        error: "Internal server error",
        ...(process.env.NODE_ENV !== "production" ? { detail: msg } : {}),
      },
      { status: 500 }
    );
  }
}
