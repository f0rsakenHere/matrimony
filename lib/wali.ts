/**
 * Wali rules, shared by the public /start form, the member dashboard and the
 * API routes so the browser and the server always agree.
 *
 * - Sisters MUST include a wali: full name, relationship and email.
 * - Brothers have no wali at all: their wali fields are always cleared.
 * - Matches are sent to the wali by email only, so email is the required
 *   contact; phone is optional.
 */

export const WALI_EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export interface WaliFields {
  waliName: string;
  waliRelationship: string;
  waliEmail: string;
  waliPhone: string;
}

export type WaliErrors = Partial<Record<keyof WaliFields, string>>;

/** True if the user typed anything into the wali fields. */
export function hasAnyWali(f: Partial<WaliFields>): boolean {
  return [f.waliName, f.waliRelationship, f.waliEmail, f.waliPhone].some((v) => (v ?? "").trim() !== "");
}

/** Whether a wali is mandatory / was started for this person. */
export function waliRequired(gender: string | undefined, f: Partial<WaliFields>): boolean {
  if (gender === "Male") return false;
  return gender === "Female" || hasAnyWali(f);
}

/** Field-keyed error messages; empty object means the wali section is valid. */
export function waliErrors(gender: string | undefined, f: Partial<WaliFields>): WaliErrors {
  const e: WaliErrors = {};
  if (gender === "Male") return e; // brothers don't have a wali
  const name = (f.waliName ?? "").trim();
  const rel = (f.waliRelationship ?? "").trim();
  const email = (f.waliEmail ?? "").trim();

  if (email && !WALI_EMAIL_RE.test(email)) e.waliEmail = "Please enter a valid email address.";
  if (!waliRequired(gender, f)) return e;

  const why = gender === "Female" ? "Required for sisters." : "Required when including a wali.";
  if (!name) e.waliName = why;
  if (!rel) e.waliRelationship = why;
  if (!email) e.waliEmail = `${why} Matches are sent to your wali by email.`;
  return e;
}

/** Sentence form of waliErrors for API error responses. */
export function waliErrorSentence(gender: string | undefined, f: Partial<WaliFields>): string | null {
  const e = waliErrors(gender, f);
  const parts: string[] = [];
  if (e.waliName) parts.push("the wali's full name");
  if (e.waliRelationship) parts.push("the wali's relationship");
  if (e.waliEmail) parts.push(e.waliEmail.startsWith("Please enter") ? "a valid email for the wali" : "the wali's email");
  if (parts.length === 0) return null;
  const lead = gender === "Female" ? "Sisters must include a wali. Please provide" : "Please provide";
  const list = parts.length > 1 ? `${parts.slice(0, -1).join(", ")} and ${parts[parts.length - 1]}` : parts[0];
  return `${lead} ${list}.`;
}

/** Brothers don't have a wali: blank every wali field (mutates and returns f). */
export function clearWali<T extends Partial<WaliFields> & { waliContactMethod?: string }>(f: T): T {
  f.waliName = "";
  f.waliRelationship = "";
  f.waliEmail = "";
  f.waliPhone = "";
  f.waliContactMethod = "";
  return f;
}
