import type { BiodataSection } from "@/contexts/AuthContext";

/**
 * Counts filled (non-empty string) fields across the profile and biodata
 * to produce a 0–100 completion percentage.
 */
export function getProfileCompletion(profile: {
  profileName: string;
  firstName: string;
  lastName: string;
  biodata: BiodataSection;
}): number {
  let filled = 0;
  let total = 0;

  // Core profile fields
  const coreFields = [profile.profileName, profile.firstName, profile.lastName];
  total += coreFields.length;
  filled += coreFields.filter((v) => v.trim().length > 0).length;

  // Biodata object sections
  const sections: Record<string, unknown>[] = [
    profile.biodata.personal,
    profile.biodata.education,
    profile.biodata.family,
    profile.biodata.religious,
    profile.biodata.lifestyle,
  ];

  for (const section of sections) {
    for (const value of Object.values(section)) {
      total += 1;
      if (typeof value === "string" && value.trim().length > 0) {
        filled += 1;
      }
    }
  }

  // About me
  total += 1;
  if (profile.biodata.aboutMe.trim().length > 0) {
    filled += 1;
  }

  if (total === 0) return 0;
  return Math.round((filled / total) * 100);
}
