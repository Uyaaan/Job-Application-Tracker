"use client";

import { useState } from "react";
import { updateJobStatus } from "@/actions/updateJobStatus";

const STATUS_STYLES = {
  Applied: "bg-blue-100 text-blue-800 border-blue-200",
  "For Interview": "bg-green-100 text-green-800 border-green-200",
  Interviewing: "bg-yellow-100 text-yellow-800 border-yellow-200",
  "Offer Received": "bg-green-700 text-white border-green-800",
  Rejected: "bg-red-700 text-white border-red-800",
};

// Map purely for the little colored dots in the dropdown menu
const DOT_COLORS = {
  Applied: "bg-blue-500",
  "For Interview": "bg-green-500",
  Interviewing: "bg-yellow-500",
  "Offer Received": "bg-green-700",
  Rejected: "bg-red-600",
};

export default function StatusBadge({ jobId, currentStatus }) {
  const [status, setStatus] = useState(currentStatus || "Applied");
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = async (newStatus) => {
    // 1. Close menu immediately
    setIsOpen(false);

    // 2. Don't do anything if value didn't change
    if (newStatus === status) return;

    const oldStatus = status;

    // 3. Optimistic Update
    setStatus(newStatus);
    setLoading(true);

    try {
      const result = await updateJobStatus(jobId, newStatus);
      if (!result.success) {
        throw new Error(result.error);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to update status");
      setStatus(oldStatus); // Revert on failure
    } finally {
      setLoading(false);
    }
  };

  const currentStyle =
    STATUS_STYLES[status] || "bg-gray-100 text-gray-800 border-gray-200";

  return (
    <div className="relative inline-block text-left">
      {/* --- TRIGGER BUTTON --- */}
      <button
        type="button"
        onClick={() => !loading && setIsOpen(!isOpen)}
        disabled={loading}
        className={`flex items-center gap-2 px-3 py-1 rounded-full border font-medium text-xs whitespace-nowrap transition-all duration-200 ease-in-out ${currentStyle} ${
          loading
            ? "opacity-75 cursor-wait"
            : "hover:brightness-95 active:scale-95"
        }`}
      >
        <span>{status}</span>

        {/* Loading Spinner or Chevron */}
        {loading ? (
          <div className="animate-spin h-3 w-3 border-2 border-current rounded-full border-t-transparent" />
        ) : (
          <svg
            className={`w-2.5 h-2.5 transition-transform duration-200 ${
              isOpen ? "rotate-180" : ""
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="3"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        )}
      </button>

      {/* --- DROPDOWN MENU --- */}
      {isOpen && (
        <>
          {/* 1. Invisible Backdrop (Handles "Click Outside" to close) */}
          <div
            className="fixed inset-0 z-10 cursor-default"
            onClick={() => setIsOpen(false)}
          />

          {/* 2. The Menu */}
          <div className="absolute right-0 z-20 mt-2 w-48 origin-top-right rounded-xl bg-white shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none overflow-hidden animate-in fade-in zoom-in-95 duration-100">
            <div className="py-1">
              {Object.keys(STATUS_STYLES).map((optionStatus) => (
                <button
                  key={optionStatus}
                  onClick={() => handleSelect(optionStatus)}
                  className={`group flex w-full items-center gap-3 px-4 py-2.5 text-sm transition-colors
                    ${
                      status === optionStatus
                        ? "bg-gray-50 text-gray-900 font-semibold"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }
                  `}
                >
                  {/* Colored Dot Indicator */}
                  <span
                    className={`h-2 w-2 rounded-full ${DOT_COLORS[optionStatus]}`}
                  ></span>
                  {optionStatus}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
