import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    // We removed clerkId. These are optional standard fields:
    image: String,
    emailVerified: Date,
  },
  { timestamps: true }
);

// Check if the model exists before compiling it (prevents hot-reload errors)
export default mongoose.models.User || mongoose.model("User", UserSchema);
