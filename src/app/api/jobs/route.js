import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import connectDB from "@/lib/db";
import Job from "@/models/Job";

// Force dynamic to prevent caching issues
export const dynamic = "force-dynamic";

export async function GET(req) {
  try {
    const user = await currentUser();
    if (!user)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectDB();

    // Find all jobs that belong to this user
    const jobs = await Job.find({ clerkId: user.id }).sort({ createdAt: -1 });

    // Transform _id to id to keep your frontend working
    const formattedJobs = jobs.map((job) => ({
      id: job._id.toString(),
      job_title: job.job_title,
      company: job.company,
      application_date: job.application_date,
      status: job.status,
      job_location: job.job_location,
      application_url: job.application_url,
      interview_scheduled: job.interview_scheduled,
    }));

    return NextResponse.json(formattedJobs);
  } catch (error) {
    console.error("GET Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch jobs" },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    const user = await currentUser();
    if (!user)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    await connectDB();

    // Create the new job in MongoDB
    const newJob = await Job.create({
      clerkId: user.id, // Important: Link to the logged-in user
      job_title: body.job_title,
      company: body.company,
      application_date: body.application_date,
      status: body.status || "Applied",
      job_location: body.job_location,
      application_url: body.application_url,
    });

    return NextResponse.json({ message: "Job created", job: newJob });
  } catch (error) {
    console.error("POST Error:", error);
    return NextResponse.json(
      { error: "Failed to create job" },
      { status: 500 }
    );
  }
}

// Handle Status Updates (from your StatusBadge)
export async function PUT(req) {
  try {
    const user = await currentUser();
    if (!user)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    await connectDB();

    // Update the job status
    const updatedJob = await Job.findOneAndUpdate(
      { clerkId: user.id, company: body.company },
      { status: body.newStatus },
      { new: true }
    );

    if (!updatedJob) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Status updated", job: updatedJob });
  } catch (error) {
    console.error("PUT Error:", error);
    return NextResponse.json(
      { error: "Failed to update status" },
      { status: 500 }
    );
  }
}
