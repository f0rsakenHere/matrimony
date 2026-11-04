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

// All 64 districts of Bangladesh, alphabetical. Used to capture a user's
// district of origin so families can match by ancestral region.
export const BANGLADESH_DISTRICT_OPTIONS = [
  "Bagerhat", "Bandarban", "Barguna", "Barisal", "Bhola", "Bogura",
  "Brahmanbaria", "Chandpur", "Chapainawabganj", "Chattogram", "Chuadanga",
  "Cumilla", "Cox's Bazar", "Dhaka", "Dinajpur", "Faridpur", "Feni",
  "Gaibandha", "Gazipur", "Gopalganj", "Habiganj", "Jamalpur", "Jashore",
  "Jhalokati", "Jhenaidah", "Joypurhat", "Khagrachhari", "Khulna",
  "Kishoreganj", "Kurigram", "Kushtia", "Lakshmipur", "Lalmonirhat",
  "Madaripur", "Magura", "Manikganj", "Meherpur", "Moulvibazar",
  "Munshiganj", "Mymensingh", "Naogaon", "Narail", "Narayanganj",
  "Narsingdi", "Natore", "Netrokona", "Nilphamari", "Noakhali", "Pabna",
  "Panchagarh", "Patuakhali", "Pirojpur", "Rajbari", "Rajshahi",
  "Rangamati", "Rangpur", "Satkhira", "Shariatpur", "Sherpur", "Sirajganj",
  "Sunamganj", "Sylhet", "Tangail", "Thakurgaon", "Other",
];

/* ─── Public biodata form (/start) ─── */
// Mirrors the NikahCanada registration questionnaire the client asked for.
// Kept separate from the dashboard option lists above so the member editor
// and existing data are unaffected.

export const ETHNICITY_OPTIONS = [
  "Bangladesh", "Afghanistan", "Albania", "Algeria", "Andorra", "Angola",
  "Antigua and Barbuda", "Argentina", "Armenia", "Australia", "Austria",
  "Azerbaijan", "Bahamas", "Bahrain", "Barbados", "Belarus", "Belgium",
  "Belize", "Benin", "Bhutan", "Bolivia", "Bosnia and Herzegovina",
  "Botswana", "Brazil", "Brunei", "Bulgaria", "Burkina Faso", "Burundi",
  "Côte d'Ivoire", "Cabo Verde", "Cambodia", "Cameroon", "Canada",
  "Central African Republic", "Chad", "Chile", "China", "Colombia",
  "Comoros", "Congo (Congo-Brazzaville)", "Costa Rica", "Croatia", "Cuba",
  "Cyprus", "Czechia (Czech Republic)", "Democratic Republic of the Congo",
  "Denmark", "Djibouti", "Dominica", "Dominican Republic", "Ecuador",
  "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia",
  "Eswatini (fmr. \"Swaziland\")", "Ethiopia", "Fiji", "Finland", "France",
  "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Greece", "Grenada",
  "Guatemala", "Guinea", "Guinea-Bissau", "Guyana", "Haiti", "Holy See",
  "Honduras", "Hungary", "Iceland", "India", "Indonesia", "Iran", "Iraq",
  "Ireland", "Israel", "Italy", "Jamaica", "Japan", "Jordan", "Kazakhstan",
  "Kenya", "Kiribati", "Kuwait", "Kyrgyzstan", "Laos", "Latvia", "Lebanon",
  "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg",
  "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta",
  "Marshall Islands", "Mauritania", "Mauritius", "Mexico", "Micronesia",
  "Moldova", "Monaco", "Mongolia", "Montenegro", "Morocco", "Mozambique",
  "Myanmar (formerly Burma)", "Namibia", "Nauru", "Nepal", "Netherlands",
  "New Zealand", "Nicaragua", "Niger", "Nigeria", "North Korea",
  "North Macedonia", "Norway", "Oman", "Pakistan", "Palau",
  "Palestine State", "Panama", "Papua New Guinea", "Paraguay", "Peru",
  "Philippines", "Poland", "Portugal", "Qatar", "Romania", "Russia",
  "Rwanda", "Saint Kitts and Nevis", "Saint Lucia",
  "Saint Vincent and the Grenadines", "Samoa", "San Marino",
  "Sao Tome and Principe", "Saudi Arabia", "Senegal", "Serbia", "Seychelles",
  "Sierra Leone", "Singapore", "Slovakia", "Slovenia", "Solomon Islands",
  "Somalia", "South Africa", "South Korea", "South Sudan", "Spain",
  "Sri Lanka", "Sudan", "Suriname", "Sweden", "Switzerland", "Syria",
  "Tajikistan", "Tanzania", "Thailand", "Timor-Leste", "Togo", "Tonga",
  "Trinidad and Tobago", "Tunisia", "Turkey", "Turkmenistan", "Tuvalu",
  "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom",
  "United States of America", "Uruguay", "Uzbekistan", "Vanuatu",
  "Venezuela", "Vietnam", "Yemen", "Zambia", "Zimbabwe",
];

// Height 3'5" – 7'5", same string format as HEIGHT_OPTIONS.
export const PUBLIC_HEIGHT_OPTIONS = Array.from({ length: 49 }, (_, i) => {
  const totalInches = 41 + i;
  return `${Math.floor(totalInches / 12)}'${totalInches % 12}"`;
});

export const WEIGHT_KG_OPTIONS = Array.from({ length: 101 }, (_, i) => String(30 + i));

export const CITIZENSHIP_STATUS_OPTIONS = [
  "Citizen",
  "Permanent Resident",
  "On A Work Visa",
  "On A Study Visa",
  "On A Visitor Visa",
  "Refugee",
  "Other",
];

export const PUBLIC_MARITAL_STATUS_OPTIONS = [
  "Never Married",
  "Widowed Without Kid(s)",
  "Widowed With Kid(s)",
  "Divorced Without Kid(s)",
  "Divorced With Kid(s)",
];

export const HIJAB_OPTIONS = ["Yes", "No", "Sometimes", "Not Always, But I Try My Best"];

export const PUBLIC_WALI_RELATIONSHIP_OPTIONS = [
  "Father",
  "Grandfather",
  "Brother",
  "Maternal Uncle",
  "Paternal Uncle",
  "Imam Of The Local Masjid",
];

export const WALI_CONTACT_METHOD_OPTIONS = ["Email", "WhatsApp", "SMS"];

export const HOW_HEARD_OPTIONS = [
  "Personal Referral",
  "Masjid / Community",
  "Poster",
  "Social Media",
  "Other",
];
