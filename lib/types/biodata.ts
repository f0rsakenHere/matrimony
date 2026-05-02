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
  };
  religious: {
    religiousHistory: string;
    sect: string;
    prayerRoutine: string;
    modesty: string;
    beard: string;
    quranReading: string;
    islamicEducation: string;
  };
  lifestyle: {
    diet: string;
    smoking: string;
    hobbies: string;
    languages: string;
  };
  aboutMe: string;
}

export const EMPTY_BIODATA: BiodataSection = {
  personal: { dateOfBirth: "", gender: "", maritalStatus: "", height: "", weight: "", complexion: "", bloodGroup: "", nationality: "", city: "", country: "", bangladeshDistrict: "" },
  education: { educationLevel: "", institution: "", fieldOfStudy: "", occupation: "", employer: "", income: "" },
  family: { fatherName: "", fatherOccupation: "", motherName: "", motherOccupation: "", siblings: "", familyType: "", familyStatus: "", waliName: "", waliRelationship: "", waliPhone: "", waliEmail: "" },
  religious: { religiousHistory: "", sect: "", prayerRoutine: "", modesty: "", beard: "", quranReading: "", islamicEducation: "" },
  lifestyle: { diet: "", smoking: "", hobbies: "", languages: "" },
  aboutMe: "",
};
