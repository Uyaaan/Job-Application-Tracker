"use server";

import { auth } from "@/auth";
import connectDB from "@/lib/db";
import Job from "@/models/Job";
import { revalidatePath } from "next/cache";

export async function updateJob(jobId, formData) {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");

  const title = formData.get("title");
  const company = formData.get("company");
  const location = formData.get("location");
  const url = formData.get("url");
  const date = formData.get("date");

  if (!title || !company) {
    return { error: "Company and Job Title are required." };
  }

  await connectDB();

  try {
    await Job.findOneAndUpdate(
      { _id: jobId, userId: session.user.id },
      { title, company, location, url, date }
    );

    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Update Job Error:", error);
    return { error: "Failed to update job." };
  }
}
