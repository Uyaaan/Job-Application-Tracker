import mongoose from "mongoose";

const JobSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    company: {
      type: String,
      required: true,
    },
    location: String,
    status: {
      type: String,
      enum: [
        "Applied",
        "For Interview",
        "Interviewing",
        "Offer Received",
        "Rejected",
      ],
      default: "Applied",
    },
    url: String,
    date: {
      type: String, // Storing as YYYY-MM-DD string for simplicity
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Job || mongoose.model("Job", JobSchema);
