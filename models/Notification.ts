import mongoose, { Schema, type Document } from "mongoose";

export interface INotification extends Document {
  recipientUid: string;
  type: "profile_view" | "new_match" | "system" | "welcome" | "profile_incomplete";
  title: string;
  message: string;
  read: boolean;
  // For profile_view: who viewed
  actorUid?: string;
  actorName?: string;
  actorProfileId?: string;
  // YYYY-MM-DD bucket — used with a unique index to dedupe profile_view
  // notifications race-safely (one per viewer per day per recipient).
  dayBucket?: string;
  createdAt: Date;
  updatedAt: Date;
}

const NotificationSchema = new Schema<INotification>(
  {
    recipientUid: { type: String, required: true, index: true },
    type: {
      type: String,
      enum: ["profile_view", "new_match", "system", "welcome", "profile_incomplete"],
      required: true,
    },
    title: { type: String, required: true },
    message: { type: String, required: true },
    read: { type: Boolean, default: false },
    actorUid: { type: String },
    actorName: { type: String },
    actorProfileId: { type: String },
    dayBucket: { type: String },
  },
  { timestamps: true }
);

// Compound index for efficient queries
NotificationSchema.index({ recipientUid: 1, createdAt: -1 });
NotificationSchema.index({ recipientUid: 1, read: 1 });
// Race-safe dedupe key for profile_view spam. Sparse so older docs without
// dayBucket don't conflict.
NotificationSchema.index(
  { recipientUid: 1, type: 1, actorUid: 1, dayBucket: 1 },
  { unique: true, sparse: true }
);

export default mongoose.models.Notification ||
  mongoose.model<INotification>("Notification", NotificationSchema);
