import mongoose, { Schema, type Document } from "mongoose";

export interface IInvitation extends Document {
  senderUid: string;
  senderName: string;
  senderProfileId: string;
  receiverUid: string;
  receiverName: string;
  receiverProfileId: string;
  status: "pending" | "accepted" | "declined";
  createdAt: Date;
  updatedAt: Date;
}

const InvitationSchema = new Schema<IInvitation>(
  {
    senderUid: { type: String, required: true },
    senderName: { type: String, required: true },
    senderProfileId: { type: String, required: true },
    receiverUid: { type: String, required: true },
    receiverName: { type: String, required: true },
    receiverProfileId: { type: String, required: true },
    status: {
      type: String,
      enum: ["pending", "accepted", "declined"],
      default: "pending",
    },
  },
  { timestamps: true }
);

InvitationSchema.index({ senderUid: 1, receiverUid: 1 });
InvitationSchema.index({ receiverUid: 1, status: 1 });
InvitationSchema.index({ senderUid: 1, status: 1 });

export default mongoose.models.Invitation ||
  mongoose.model<IInvitation>("Invitation", InvitationSchema);
