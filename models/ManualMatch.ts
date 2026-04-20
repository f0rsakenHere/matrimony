import mongoose, { Schema, type Document } from "mongoose";

export interface IManualMatch extends Document {
  user1Id: string;
  user1Uid: string;
  user1Name: string;
  user2Id: string;
  user2Uid: string;
  user2Name: string;
  status: "matched" | "contacted" | "successful" | "unsuccessful";
  notes: string;
  matchedBy: string; // admin firebaseUid
  createdAt: Date;
  updatedAt: Date;
}

const ManualMatchSchema = new Schema<IManualMatch>(
  {
    user1Id: { type: String, required: true },
    user1Uid: { type: String, required: true },
    user1Name: { type: String, required: true },
    user2Id: { type: String, required: true },
    user2Uid: { type: String, required: true },
    user2Name: { type: String, required: true },
    status: {
      type: String,
      enum: ["matched", "contacted", "successful", "unsuccessful"],
      default: "matched",
    },
    notes: { type: String, default: "" },
    matchedBy: { type: String, required: true },
  },
  { timestamps: true }
);

ManualMatchSchema.index({ user1Uid: 1 });
ManualMatchSchema.index({ user2Uid: 1 });
ManualMatchSchema.index({ status: 1 });

export default mongoose.models.ManualMatch ||
  mongoose.model<IManualMatch>("ManualMatch", ManualMatchSchema);
