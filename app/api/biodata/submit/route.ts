import { NextResponse } from "next/server";
import crypto from "node:crypto";
import connectDB from "@/lib/mongodb";
import BiodataSubmission from "@/models/BiodataSubmission";
import { submissionLimiter } from "@/lib/rate-limit";
import { EMPTY_BIODATA, type BiodataSection } from "@/lib/types/biodata";

const STRING_FIELDS_BY_SECTION: Record<
  Exclude<keyof BiodataSection, "aboutMe">,
  string[]
> = {
  personal: Object.keys(EMPTY_BIODATA.personal),
  education: Object.keys(EMPTY_BIODATA.education),
  family: Object.keys(EMPTY_BIODATA.family),
  religious: Object.keys(EMPTY_BIODATA.religious),
  lifestyle: Object.keys(EMPTY_BIODATA.lifestyle),
};

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

  out.aboutMe = sanitizeString(src.aboutMe, 1000);
  return out;
}

function hashIp(ip: string): string {
  return crypto.createHash("sha256").update(ip).digest("hex").slice(0, 32);
}

export async function POST(request: Request) {
  try {
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "unknown";
    const { success } = submissionLimiter.check(ip);
    if (!success) {
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

    // Required-field validation
    const errors: string[] = [];
    if (!biodata.personal.gender) errors.push("Gender is required.");
    if (!biodata.personal.dateOfBirth) errors.push("Date of birth is required.");
    if (!biodata.family.waliName) errors.push("Wali's name is required.");
    if (!biodata.family.waliRelationship) errors.push("Wali's relationship is required.");
    if (!biodata.family.waliPhone) errors.push("Wali's phone is required.");

    if (errors.length > 0) {
      return NextResponse.json({ error: errors.join(" ") }, { status: 400 });
    }

    await connectDB();
    const submission = await BiodataSubmission.create({
      biodata,
      moderationStatus: "pending",
      ipHash: hashIp(ip),
      userAgent: (request.headers.get("user-agent") ?? "").slice(0, 500),
    });

    return NextResponse.json({
      ok: true,
      submissionId: submission._id.toString(),
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
