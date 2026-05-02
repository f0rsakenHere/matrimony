import mongoose, { Schema, type Document } from "mongoose";

/* ─── Partner preference sub-schema ─── */
export interface IPartnerPreferences {
  qualification: string[];
  religiousHistory: string;
  sect: string;
  prayerRoutine: string;
  modesty: string;
}

const PartnerPreferencesSchema = new Schema<IPartnerPreferences>(
  {
    qualification: { type: [String], default: [] },
    religiousHistory: { type: String, default: "" },
    sect: { type: String, default: "" },
    prayerRoutine: { type: String, default: "" },
    modesty: { type: String, default: "" },
  },
  { _id: false }
);

/* ─── Biodata sub-schemas ─── */
export interface IBiodataPersonal {
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
}

const BiodataPersonalSchema = new Schema<IBiodataPersonal>(
  {
    dateOfBirth: { type: String, default: "" },
    gender: { type: String, default: "" },
    maritalStatus: { type: String, default: "" },
    height: { type: String, default: "" },
    weight: { type: String, default: "" },
    complexion: { type: String, default: "" },
    bloodGroup: { type: String, default: "" },
    nationality: { type: String, default: "" },
    city: { type: String, default: "" },
    country: { type: String, default: "" },
    bangladeshDistrict: { type: String, default: "" },
  },
  { _id: false }
);

export interface IBiodataEducation {
  educationLevel: string;
  institution: string;
  fieldOfStudy: string;
  occupation: string;
  employer: string;
  income: string;
}

const BiodataEducationSchema = new Schema<IBiodataEducation>(
  {
    educationLevel: { type: String, default: "" },
    institution: { type: String, default: "" },
    fieldOfStudy: { type: String, default: "" },
    occupation: { type: String, default: "" },
    employer: { type: String, default: "" },
    income: { type: String, default: "" },
  },
  { _id: false }
);

export interface IBiodataFamily {
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
}

const BiodataFamilySchema = new Schema<IBiodataFamily>(
  {
    fatherName: { type: String, default: "" },
    fatherOccupation: { type: String, default: "" },
    motherName: { type: String, default: "" },
    motherOccupation: { type: String, default: "" },
    siblings: { type: String, default: "" },
    familyType: { type: String, default: "" },
    familyStatus: { type: String, default: "" },
    waliName: { type: String, default: "" },
    waliRelationship: { type: String, default: "" },
    waliPhone: { type: String, default: "" },
    waliEmail: { type: String, default: "" },
  },
  { _id: false }
);

export interface IBiodataReligious {
  religiousHistory: string;
  sect: string;
  prayerRoutine: string;
  modesty: string;
  beard: string;
  quranReading: string;
  islamicEducation: string;
}

const BiodataReligiousSchema = new Schema<IBiodataReligious>(
  {
    religiousHistory: { type: String, default: "" },
    sect: { type: String, default: "" },
    prayerRoutine: { type: String, default: "" },
    modesty: { type: String, default: "" },
    beard: { type: String, default: "" },
    quranReading: { type: String, default: "" },
    islamicEducation: { type: String, default: "" },
  },
  { _id: false }
);

export interface IBiodataLifestyle {
  diet: string;
  smoking: string;
  hobbies: string;
  languages: string;
}

const BiodataLifestyleSchema = new Schema<IBiodataLifestyle>(
  {
    diet: { type: String, default: "" },
    smoking: { type: String, default: "" },
    hobbies: { type: String, default: "" },
    languages: { type: String, default: "" },
  },
  { _id: false }
);

export interface IBiodata {
  personal: IBiodataPersonal;
  education: IBiodataEducation;
  family: IBiodataFamily;
  religious: IBiodataReligious;
  lifestyle: IBiodataLifestyle;
  aboutMe: string;
}

const BiodataSchema = new Schema<IBiodata>(
  {
    personal: { type: BiodataPersonalSchema, default: () => ({}) },
    education: { type: BiodataEducationSchema, default: () => ({}) },
    family: { type: BiodataFamilySchema, default: () => ({}) },
    religious: { type: BiodataReligiousSchema, default: () => ({}) },
    lifestyle: { type: BiodataLifestyleSchema, default: () => ({}) },
    aboutMe: { type: String, default: "" },
  },
  { _id: false }
);

/* ─── Main user document ─── */
export interface IUser extends Document {
  firebaseUid: string;
  email: string;
  provider: "email" | "google";
  photoURL?: string;

  // Personal (step 1 — not visible to matches)
  firstName: string;
  lastName: string;

  // Profile (step 2 — visible to matches)
  profileName: string;

  // Partner preferences (step 3)
  partnerPreferences: IPartnerPreferences;

  // Full biodata
  biodata: IBiodata;

  // Onboarding progress
  onboardingStep: number; // 0 = not started, 1-3 = in progress, 4 = complete
  onboardingComplete: boolean;

  // Admin
  isAdmin: boolean;

  // Invitations
  invitesRemaining: number;
  isPremium: boolean;

  // Shadow user — created from an approved BiodataSubmission for someone
  // who hasn't signed up. firebaseUid is "shadow:<submissionId>" so it stays
  // unique. Filtered out of public profile queries until claimed.
  isShadow: boolean;
  sourceSubmissionId?: string;

  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    firebaseUid: { type: String, required: true, unique: true },
    email: { type: String, required: true },
    provider: { type: String, enum: ["email", "google"], required: true },
    photoURL: { type: String },

    firstName: { type: String, default: "" },
    lastName: { type: String, default: "" },
    profileName: { type: String, default: "" },

    partnerPreferences: {
      type: PartnerPreferencesSchema,
      default: () => ({}),
    },

    biodata: {
      type: BiodataSchema,
      default: () => ({}),
    },

    onboardingStep: { type: Number, default: 0 },
    onboardingComplete: { type: Boolean, default: false },
    isAdmin: { type: Boolean, default: false },
    invitesRemaining: { type: Number, default: 3 },
    isPremium: { type: Boolean, default: false },

    isShadow: { type: Boolean, default: false, index: true },
    sourceSubmissionId: { type: String },
  },
  { timestamps: true }
);

export default mongoose.models.User ||
  mongoose.model<IUser>("User", UserSchema);
