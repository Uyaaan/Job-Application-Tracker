"use client";
import { useState, useEffect, useCallback } from "react";
import { useUser, UserButton } from "@clerk/nextjs";
import StatusBadge from "../../components/StatusBadge";
// 1. Import the new separate component
import AddJobModal from "../../components/AddJobModal";

export default function Dashboard() {
  const { isLoaded, isSignedIn, user } = useUser();
  const [jobs, setJobs] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  // We still need this state to know IF the modal should show
  const [showModal, setShowModal] = useState(false);

  // --- Fetch Jobs ---
  const fetchJobs = useCallback(async () => {
    setIsRefreshing(true);
    try {
      const res = await fetch(`/api/jobs?t=${Date.now()}`);
      const data = await res.json();
      setJobs(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching jobs:", error);
    } finally {
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    if (isLoaded && isSignedIn) fetchJobs();
  }, [isLoaded, isSignedIn, fetchJobs]);

  if (!isLoaded || !isSignedIn) return null;

  // --- Stats Calculation ---
  const totalJobs = jobs.length;
  const interviewing = jobs.filter((j) => j.status === "Interviewing").length;
  const offers = jobs.filter((j) => j.status === "Offer").length;
  const rejected = jobs.filter((j) => j.status === "Rejected").length;

  return (
    <div className="flex min-h-screen bg-[#F3F4F6]">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col">
        <div className="p-6">
          <span className="text-2xl">🚀</span>
          <span className="ml-2 font-bold text-[#111827] text-xl">
            JobTracker
          </span>
        </div>
        <div className="p-4 border-t border-gray-100 mt-auto">
          <UserButton showName={true} />
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto relative">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[#111827]">Dashboard</h1>
            <p className="text-[#374151] mt-1">
              Welcome back, {user?.firstName}!
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={fetchJobs}
              disabled={isRefreshing}
              className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-[#374151] hover:bg-gray-50 transition shadow-sm flex items-center gap-2"
            >
              <span className={isRefreshing ? "animate-spin" : ""}>↻</span>{" "}
              Refresh
            </button>
            {/* Button just toggles the state now */}
            <button
              onClick={() => setShowModal(true)}
              className="px-4 py-2 bg-[#14B8A6] text-white rounded-lg text-sm font-bold hover:bg-teal-600 transition shadow-md"
            >
              + Add Job
            </button>
          </div>
        </header>

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <StatCard
            title="Total Jobs"
            value={totalJobs}
            icon="💼"
            color="bg-blue-50 text-blue-600"
          />
          <StatCard
            title="Interviewing"
            value={interviewing}
            icon="🎤"
            color="bg-purple-50 text-purple-600"
          />
          <StatCard
            title="Offers"
            value={offers}
            icon="🎉"
            color="bg-green-50 text-green-600"
          />
          <StatCard
            title="Rejected"
            value={rejected}
            icon="❌"
            color="bg-red-50 text-red-600"
          />
        </div>

        {/* Job Grid */}
        {jobs.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-300">
            <div className="text-5xl mb-4">📝</div>
            <p className="text-gray-500 font-medium">No jobs yet.</p>
            <p className="text-gray-400 text-sm mt-1">
              Click "Add Job" to start tracking!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs.map((job, index) => (
              <JobCard key={index} job={job} />
            ))}
          </div>
        )}

        {/* 2. Render the new component here.
          We pass it the 'showModal' state, and functions to close itself and refresh data.
        */}
        <AddJobModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          onJobAdded={fetchJobs}
        />
      </main>
    </div>
  );
}

// --- Sub-Components (Keep these here for now) ---
function StatCard({ title, value, icon, color }) {
  return (
    <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-500 font-medium">{title}</p>
        <p className="text-2xl font-bold text-[#111827] mt-1">{value}</p>
      </div>
      <div
        className={`w-10 h-10 rounded-full flex items-center justify-center text-xl ${color}`}
      >
        {icon}
      </div>
    </div>
  );
}

function JobCard({ job }) {
  return (
    <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition group relative overflow-hidden">
      <div className="absolute top-0 left-0 w-1 h-full bg-[#14B8A6]"></div>
      <div className="flex justify-between items-start mb-3">
        <h3 className="font-bold text-lg text-[#111827] truncate pr-2">
          {job.job_title}
        </h3>
        <StatusBadge currentStatus={job.status} companyName={job.company} />
      </div>
      <p className="text-[#14B8A6] font-medium text-sm mb-4">{job.company}</p>
      <div className="space-y-2 text-sm text-gray-500 mb-4">
        <p>📅 {job.application_date || "N/A"}</p>
        <p>📍 {job.job_location || "Remote"}</p>
      </div>
      {job.application_url && (
        <a
          href={job.application_url}
          target="_blank"
          className="block text-center text-sm text-[#14B8A6] hover:underline font-medium"
        >
          View Post
        </a>
      )}
    </div>
  );
}
