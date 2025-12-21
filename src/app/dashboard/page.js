import { auth } from "@/auth";
import { redirect } from "next/navigation";
import connectDB from "@/lib/db";
import Job from "@/models/Job";
import DashboardClient from "./DashboardClient";

// This is a SERVER COMPONENT (fetches data)
export default async function DashboardPage() {
  const session = await auth();

  if (!session) {
    redirect("/");
  }

  await connectDB();

  // Fetch jobs sorted by newest first
  const jobs = await Job.find({ userId: session.user.id })
    .sort({ createdAt: -1 })
    .lean();

  // Convert MongoDB objects to plain JSON for the client
  // FIXED: Added safety checks (?) to prevent crashes if fields are missing
  const serializedJobs = jobs.map((job) => ({
    ...job,
    _id: job._id.toString(),
    userId: job.userId ? job.userId.toString() : session.user.id, // Fallback to session ID if missing
    createdAt: job.createdAt
      ? job.createdAt.toISOString()
      : new Date().toISOString(),
    updatedAt: job.updatedAt
      ? job.updatedAt.toISOString()
      : new Date().toISOString(),
  }));

  return <DashboardClient user={session.user} initialJobs={serializedJobs} />;
}
