"use client";
import { useState, useEffect, useCallback } from "react";
import StatusBadge from "../components/StatusBadge";

export default function Home() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Define fetch function outside useEffect so we can reuse it
  const fetchJobs = useCallback(async (showLoading = true) => {
    if (showLoading) setIsRefreshing(true);

    try {
      // FIX: We add 'cache: no-store' to tell Next.js/Browser "Do not save this, get new data."
      // We also keep the timestamp as a backup breaker.
      const res = await fetch(`/api/jobs?t=${Date.now()}`, {
        cache: "no-store",
        next: { revalidate: 0 },
        headers: {
          Pragma: "no-cache",
          "Cache-Control": "no-cache, no-store, must-revalidate",
        },
      });

      const data = await res.json();
      setJobs(data);
    } catch (error) {
      console.error("Error fetching jobs:", error);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  // 1. Initial Load
  useEffect(() => {
    fetchJobs(true);
  }, [fetchJobs]);

  // 2. Auto-Refresh when you tab back to this window
  useEffect(() => {
    const onFocus = () => {
      console.log("Tab focused, refreshing data...");
      fetchJobs(false); // Silent refresh
    };

    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, [fetchJobs]);

  if (loading)
    return (
      <div className="p-10 text-center text-gray-500">
        Loading your tracker...
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header with Refresh Button */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">
            🚀 Job Application Tracker
          </h1>

          <button
            onClick={() => fetchJobs(true)}
            disabled={isRefreshing}
            className={`flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 transition ${
              isRefreshing ? "opacity-70 cursor-wait" : ""
            }`}
          >
            <svg
              className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            {isRefreshing ? "Syncing..." : "Refresh"}
          </button>
        </div>

        {/* The Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {jobs.map((job) => (
            <div
              key={job.id || job.company}
              className="bg-white p-5 rounded-lg shadow hover:shadow-md transition border-l-4 border-blue-500 relative group"
            >
              <div className="flex justify-between items-start mb-2 gap-2">
                <h2 className="font-bold text-lg text-gray-900 leading-tight">
                  {job.job_title}
                </h2>

                <StatusBadge
                  currentStatus={job.status}
                  companyName={job.company}
                />
              </div>

              <p className="text-gray-600 mb-4">{job.company}</p>

              <div className="text-sm text-gray-500 space-y-1">
                <p>📅 {job.application_date || "No Date"}</p>
                <p>📍 {job.job_location || "Remote/Unknown"}</p>
              </div>

              {job.application_url && (
                <a
                  href={job.application_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block mt-4 text-center w-full py-2 bg-gray-50 text-sm font-medium text-gray-600 rounded hover:bg-gray-100"
                >
                  View Job Post
                </a>
              )}
            </div>
          ))}
        </div>

        {jobs.length === 0 && !loading && (
          <p className="text-center text-gray-500 mt-10">
            No jobs found. Add some to your Sheet!
          </p>
        )}
      </div>
    </div>
  );
}
