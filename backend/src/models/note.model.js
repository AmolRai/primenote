import mongoose from "mongoose";

const noteSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    isComplete: {
      type: Boolean,
      default: false,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    isPublic: {
      type: Boolean,
      default: false,
    },
    publicIdentifier: {
      type: String,
    },
    pinNote: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export const Note = mongoose.model("Note", noteSchema);
