"use server";

import { auth } from "@/auth";
import connectDB from "@/lib/db";
import Job from "@/models/Job";
import { revalidatePath } from "next/cache";

export async function createJob(formData) {
  // 1. Check Auth
  const session = await auth();
  if (!session || !session.user) {
    throw new Error("You must be logged in to add a job.");
  }

  // 2. Validate & Prepare Data
  const title = formData.get("title");
  const company = formData.get("company");
  const location = formData.get("location");
  const url = formData.get("url");
  const date = formData.get("date");
  const status = formData.get("status") || "Applied";

  if (!title || !company) {
    throw new Error("Company and Job Title are required.");
  }

  // 3. Save to DB
  await connectDB();

  try {
    await Job.create({
      userId: session.user.id,
      title,
      company,
      location,
      url,
      date,
      status,
    });

    // 4. Refresh Dashboard
    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Create Job Error:", error);
    return { error: "Failed to save job." };
  }
}
