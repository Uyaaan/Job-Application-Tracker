// src/app/dashboard/page.js
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
// We import the signOut logic from the client-side library provided by Auth.js
// Note: If this import fails, ensure you ran 'npm install next-auth@beta'
import { signOut } from "next-auth/react";

// Keep your existing component imports
import StatusBadge from "../../components/StatusBadge";
import AddJobModal from "../../components/AddJobModal";

export default function Dashboard() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [jobs, setJobs] = useState([
    // Example Initial Data - You can replace this with your DB fetch later
    {
      id: 1,
      company: "Google",
      role: "Frontend Dev",
      status: "Interview",
      date: "2024-12-15",
    },
    {
      id: 2,
      company: "Netflix",
      role: "UI Engineer",
      status: "Applied",
      date: "2024-12-14",
    },
  ]);

  // Mock User Data (Since we are client-side, we can fetch real user data later)
  const user = { name: "Developer", email: "dev@test.com" };

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/login" });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* 1. Header (Replaces Clerk UserButton) */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 w-8 h-8 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">J</span>
            </div>
            <span className="text-xl font-bold text-gray-900 tracking-tight">
              JobTracker
            </span>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500 hidden sm:block">
              {user.email}
            </span>
            <button
              onClick={handleLogout}
              className="text-sm font-medium text-gray-700 hover:text-red-600 transition-colors"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>

      {/* 2. Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="sm:flex sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Applications</h1>
            <p className="mt-1 text-sm text-gray-500">
              Manage and track your ongoing job applications.
            </p>
          </div>
          <div className="mt-4 sm:mt-0">
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all"
            >
              + Add Job
            </button>
          </div>
        </div>

        {/* Job List Container */}
        <div className="bg-white shadow-sm border border-gray-200 rounded-xl overflow-hidden">
          {jobs.length > 0 ? (
            <ul className="divide-y divide-gray-200">
              {jobs.map((job) => (
                <li key={job.id} className="hover:bg-gray-50 transition-colors">
                  <div className="px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      {/* Company Icon Placeholder */}
                      <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 font-bold text-lg">
                        {job.company.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-blue-600 truncate">
                          {job.role}
                        </p>
                        <p className="text-sm text-gray-500">{job.company}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-6">
                      <div className="hidden sm:block text-sm text-gray-500">
                        {job.date}
                      </div>

                      {/* Use your existing StatusBadge component */}
                      <StatusBadge status={job.status} />

                      <button className="text-gray-400 hover:text-gray-600">
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 text-sm">No jobs tracked yet.</p>
            </div>
          )}
        </div>
      </main>

      {/* 3. Modal (Uses your existing component) */}
      {isModalOpen && (
        <AddJobModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
}
