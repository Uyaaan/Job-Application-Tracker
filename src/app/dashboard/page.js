import { auth } from "@/auth";
import { redirect } from "next/navigation";
import connectDB from "@/lib/db";
import Job from "@/models/Job";
import DashboardClient from "./DashboardClient"; // We will create this small wrapper below

// This is a SERVER COMPONENT (fetches data)
export default async function DashboardPage() {
  const session = await auth();

  if (!session) {
    redirect("/");
  }

  await connectDB();

  // Fetch jobs sorted by newest first
  // We utilize .lean() for better performance and convert _id to string
  const jobs = await Job.find({ userId: session.user.id })
    .sort({ createdAt: -1 })
    .lean();

  // Convert MongoDB objects to plain JSON for the client
  const serializedJobs = jobs.map((job) => ({
    ...job,
    _id: job._id.toString(),
    userId: job.userId.toString(),
    createdAt: job.createdAt.toISOString(),
    updatedAt: job.updatedAt.toISOString(),
  }));

  return <DashboardClient user={session.user} initialJobs={serializedJobs} />;
}
