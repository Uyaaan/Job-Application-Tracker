import mongoose from "mongoose";

const JobSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true, // Links the job to the user who created it
    },
    company: {
      type: String,
      required: [true, "Please provide a company name"],
      maxlength: 50,
    },
    position: {
      type: String,
      required: [true, "Please provide a position title"],
      maxlength: 100,
    },
    status: {
      type: String,
      enum: ["Applied", "Interviewing", "Offer", "Rejected"],
      default: "Applied",
    },
    jobType: {
      type: String,
      enum: ["Remote", "On-site", "Hybrid"],
      default: "On-site",
    },
    dateApplied: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
); // Adds createdAt and updatedAt automatically

// Prevent recompiling the model if it already exists
export default mongoose.models.Job || mongoose.model("Job", JobSchema);
