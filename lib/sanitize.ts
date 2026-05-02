/**
 * Escape special regex characters in a string for safe use in MongoDB $regex.
 */
export function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Whitelist of allowed fields per biodata section.
 * Used to strip unknown keys before saving to the database.
 */
export const BIODATA_FIELDS: Record<string, string[]> = {
  personal: [
    "dateOfBirth", "gender", "maritalStatus", "height", "weight",
    "complexion", "bloodGroup", "nationality", "city", "country",
    "bangladeshDistrict",
  ],
  education: [
    "educationLevel", "institution", "fieldOfStudy",
    "occupation", "employer", "income",
  ],
  family: [
    "fatherName", "fatherOccupation", "motherName", "motherOccupation",
    "siblings", "familyType", "familyStatus",
    "waliName", "waliRelationship", "waliPhone", "waliEmail",
  ],
  religious: [
    "religiousHistory", "sect", "prayerRoutine", "modesty",
    "beard", "quranReading", "islamicEducation",
  ],
  lifestyle: ["diet", "smoking", "hobbies", "languages"],
};

/**
 * Sanitize biodata section data: strip unknown keys and ensure all values are strings.
 */
export function sanitizeBiodataSection(
  section: string,
  data: unknown
): Record<string, string> | null {
  if (section === "aboutMe") {
    if (typeof data !== "string") return null;
    return { aboutMe: data.slice(0, 1000) } as unknown as Record<string, string>;
  }

  const allowedKeys = BIODATA_FIELDS[section];
  if (!allowedKeys || typeof data !== "object" || data === null) return null;

  const sanitized: Record<string, string> = {};
  for (const key of allowedKeys) {
    const value = (data as Record<string, unknown>)[key];
    if (typeof value === "string") {
      sanitized[key] = value.slice(0, 500);
    } else {
      sanitized[key] = "";
    }
  }
  return sanitized;
}
