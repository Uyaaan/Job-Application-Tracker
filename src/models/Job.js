import mongoose from "mongoose";

const JobSchema = new mongoose.Schema({
  clerkId: {
    type: String,
    required: true, // Links the job to the specific user
  },
  job_title: {
    type: String,
    required: true,
  },
  company: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    default: "Applied",
    enum: [
      "Applied",
      "For Interview",
      "Interviewing",
      "Offer Received",
      "Rejected",
    ],
  },
  application_date: {
    type: String, // Keeping as String to match your current frontend format
  },
  job_location: {
    type: String,
  },
  application_url: {
    type: String,
  },
  interview_scheduled: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Job || mongoose.model("Job", JobSchema);
