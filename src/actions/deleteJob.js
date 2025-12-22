"use server";

import { auth } from "@/auth";
import connectDB from "@/lib/db";
import Job from "@/models/Job";
import { revalidatePath } from "next/cache";

export async function deleteJob(jobId) {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");

  await connectDB();

  try {
    // We strictly check userId to ensure you can only delete YOUR own jobs
    await Job.findOneAndDelete({ _id: jobId, userId: session.user.id });

    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Delete Job Error:", error);
    return { error: "Failed to delete job." };
  }
}
