"use server";

import { auth } from "@/auth";
import connectDB from "@/lib/db";
import Job from "@/models/Job";
import { revalidatePath } from "next/cache";

export async function updateJobStatus(jobId, newStatus) {
  const session = await auth();
  if (!session) {
    throw new Error("Unauthorized");
  }

  await connectDB();

  try {
    await Job.findOneAndUpdate(
      { _id: jobId, userId: session.user.id }, // Ensure user owns the job
      { status: newStatus }
    );

    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Update Status Error:", error);
    return { error: "Failed to update status." };
  }
}
