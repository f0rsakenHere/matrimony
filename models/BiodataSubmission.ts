import mongoose, { Schema, type Document } from "mongoose";
import type {
  IBiodata,
  IBiodataPersonal,
  IBiodataEducation,
  IBiodataFamily,
  IBiodataReligious,
  IBiodataLifestyle,
} from "./User";

// Sub-schemas duplicated here so submissions can exist without a User record.
// Keep these field lists in sync with models/User.ts — the public form uses
// the same BiodataSection shape from lib/types/biodata.

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

const BiodataLifestyleSchema = new Schema<IBiodataLifestyle>(
  {
    diet: { type: String, default: "" },
    smoking: { type: String, default: "" },
    hobbies: { type: String, default: "" },
    languages: { type: String, default: "" },
  },
  { _id: false }
);

const BiodataSubSchema = new Schema<IBiodata>(
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

export type ModerationStatus =
  | "pending"
  | "approved"
  | "rejected"
  | "spam";

export interface IBiodataSubmission extends Document {
  biodata: IBiodata;
  moderationStatus: ModerationStatus;
  moderationNote?: string;
  moderatedByUid?: string;
  moderatedAt?: Date;

  ipHash: string;
  userAgent?: string;

  // Reserved for future "ask for email" / "claim profile" feature.
  email?: string;
  claimedByUid?: string;

  createdAt: Date;
  updatedAt: Date;
}

const BiodataSubmissionSchema = new Schema<IBiodataSubmission>(
  {
    biodata: { type: BiodataSubSchema, default: () => ({}) },
    moderationStatus: {
      type: String,
      enum: ["pending", "approved", "rejected", "spam"],
      default: "pending",
      index: true,
    },
    moderationNote: { type: String, default: "" },
    moderatedByUid: { type: String },
    moderatedAt: { type: Date },

    ipHash: { type: String, required: true, index: true },
    userAgent: { type: String, default: "" },

    email: { type: String },
    claimedByUid: { type: String },
  },
  { timestamps: true }
);

BiodataSubmissionSchema.index({ createdAt: -1 });

export default (mongoose.models.BiodataSubmission as
  | mongoose.Model<IBiodataSubmission>
  | undefined) ||
  mongoose.model<IBiodataSubmission>(
    "BiodataSubmission",
    BiodataSubmissionSchema
  );
