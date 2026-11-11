export interface BiodataSection {
  personal: {
    dateOfBirth: string;
    gender: string;
    maritalStatus: string;
    height: string;
    weight: string;
    complexion: string;
    bloodGroup: string;
    nationality: string;
    city: string;
    country: string;
    bangladeshDistrict: string;
    province: string;
    ethnicity: string;
    otherEthnicity: string;
    healthIssues: string;
    citizenshipStatus: string;
  };
  education: {
    educationLevel: string;
    institution: string;
    fieldOfStudy: string;
    occupation: string;
    employer: string;
    income: string;
  };
  family: {
    fatherName: string;
    fatherOccupation: string;
    motherName: string;
    motherOccupation: string;
    siblings: string;
    familyType: string;
    familyStatus: string;
    waliName: string;
    waliRelationship: string;
    waliPhone: string;
    waliEmail: string;
    waliContactMethod: string;
  };
  religious: {
    religiousHistory: string;
    sect: string;
    prayerRoutine: string;
    modesty: string;
    beard: string;
    quranReading: string;
    islamicEducation: string;
    hijab: string;
  };
  lifestyle: {
    diet: string;
    smoking: string;
    hobbies: string;
    languages: string;
  };
  aboutMe: string;
  // Public form: "What are you looking for in your future husband/wife?"
  lookingFor?: string;
}

export const EMPTY_BIODATA: BiodataSection = {
  personal: { dateOfBirth: "", gender: "", maritalStatus: "", height: "", weight: "", complexion: "", bloodGroup: "", nationality: "", city: "", country: "", bangladeshDistrict: "", province: "", ethnicity: "", otherEthnicity: "", healthIssues: "", citizenshipStatus: "" },
  education: { educationLevel: "", institution: "", fieldOfStudy: "", occupation: "", employer: "", income: "" },
  family: { fatherName: "", fatherOccupation: "", motherName: "", motherOccupation: "", siblings: "", familyType: "", familyStatus: "", waliName: "", waliRelationship: "", waliPhone: "", waliEmail: "", waliContactMethod: "" },
  religious: { religiousHistory: "", sect: "", prayerRoutine: "", modesty: "", beard: "", quranReading: "", islamicEducation: "", hijab: "" },
  lifestyle: { diet: "", smoking: "", hobbies: "", languages: "" },
  aboutMe: "",
  lookingFor: "",
};

/** Fill any missing sections/fields with empty defaults. */
export function normalizeBiodata(b: Partial<BiodataSection> | null | undefined): BiodataSection {
  const src = b ?? {};
  return {
    personal: { ...EMPTY_BIODATA.personal, ...src.personal },
    education: { ...EMPTY_BIODATA.education, ...src.education },
    family: { ...EMPTY_BIODATA.family, ...src.family },
    religious: { ...EMPTY_BIODATA.religious, ...src.religious },
    lifestyle: { ...EMPTY_BIODATA.lifestyle, ...src.lifestyle },
    aboutMe: src.aboutMe ?? "",
    lookingFor: src.lookingFor ?? "",
  };
}
