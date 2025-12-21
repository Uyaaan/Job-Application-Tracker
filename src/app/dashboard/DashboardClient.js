"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";
import StatusBadge from "@/components/StatusBadge";
import AddJobModal from "@/components/AddJobModal";

export default function DashboardClient({ user, initialJobs }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const jobs = initialJobs;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      {/* 1. Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {/* UPDATED: Green Logo Background */}
            <div className="bg-green-600 w-8 h-8 rounded-lg flex items-center justify-center">
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
              onClick={() => signOut({ callbackUrl: "/" })}
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
            {/* UPDATED: Green Button */}
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all"
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
                <li
                  key={job._id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <div className="px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      {/* Company Icon Placeholder */}
                      <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 font-bold text-lg shrink-0">
                        {job.company.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        {/* UPDATED: Green Link */}
                        <a
                          href={job.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm font-medium text-green-600 truncate hover:underline hover:text-green-700"
                        >
                          {job.title}
                        </a>
                        <p className="text-sm text-gray-500 truncate">
                          {job.company}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-6">
                      <div className="hidden sm:block text-sm text-gray-500">
                        {job.date}
                      </div>

                      {/* Status Badge */}
                      <StatusBadge jobId={job._id} currentStatus={job.status} />
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-center py-12">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                No applications yet
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Get started by creating a new job application.
              </p>
            </div>
          )}
        </div>
      </main>

      {/* 3. Modal */}
      <AddJobModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}
