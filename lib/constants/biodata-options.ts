export const GENDER_OPTIONS = ["Male", "Female"];
export const MARITAL_STATUS_OPTIONS = ["Never Married", "Divorced", "Widowed"];
export const HEIGHT_OPTIONS = Array.from({ length: 25 }, (_, i) => {
  const totalInches = 54 + i;
  const ft = Math.floor(totalInches / 12);
  const inch = totalInches % 12;
  return `${ft}'${inch}"`;
});
export const COMPLEXION_OPTIONS = ["Fair", "Medium", "Olive", "Brown", "Dark"];
export const BLOOD_GROUP_OPTIONS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

export const EDUCATION_LEVEL_OPTIONS = [
  "High School",
  "Diploma",
  "Bachelor's",
  "Master's",
  "PhD / Doctoral",
  "Islamic Scholar",
  "Other",
];

export const FAMILY_TYPE_OPTIONS = ["Nuclear", "Joint", "Extended"];
export const FAMILY_STATUS_OPTIONS = ["Middle Class", "Upper Middle Class", "Upper Class"];

export const RELIGIOUS_HISTORY_OPTIONS = ["Muslim Since Birth", "Revert Muslim"];
export const SECT_OPTIONS = ["Sunni Muslim", "Shia Muslim", "Simply Muslim"];
export const PRAYER_ROUTINE_OPTIONS = [
  "Always prays",
  "Occasionally miss Fajr, make up later",
  "Rarely miss prayers, compensate later",
  "Occasionally prays",
  "Intend to start praying",
];
export const MODESTY_OPTIONS = [
  "Not Wearing Hijab",
  "Occasionally Wears Hijab",
  "Always Wears Hijab",
  "Always Wears Niqab",
];
export const BEARD_OPTIONS = ["Yes", "No"];
export const QURAN_READING_OPTIONS = [
  "Can read Arabic fluently",
  "Learning to read",
  "Cannot read Arabic",
  "Reads with translation",
];

export const INCOME_OPTIONS = [
  "Prefer not to say",
  "Below $30,000",
  "$30,000 – $50,000",
  "$50,000 – $75,000",
  "$75,000 – $100,000",
  "$100,000 – $150,000",
  "Above $150,000",
];

export const WALI_RELATIONSHIP_OPTIONS = [
  "Father",
  "Brother",
  "Uncle (Paternal)",
  "Uncle (Maternal)",
  "Grandfather",
  "Other Male Guardian",
];

export const DIET_OPTIONS = ["Strictly Halal", "Halal when possible", "No restrictions"];
export const SMOKING_OPTIONS = ["Never", "Occasionally", "Trying to quit", "Yes"];

export const COUNTRY_OPTIONS = [
  "Bangladesh", "Canada", "USA", "UK", "Australia", "India",
  "Pakistan", "Saudi Arabia", "UAE", "Malaysia", "Qatar", "Kuwait",
  "Oman", "Bahrain", "Germany", "France", "Italy", "Sweden",
  "Norway", "South Africa", "Nigeria", "Turkey", "Egypt", "Other",
];
