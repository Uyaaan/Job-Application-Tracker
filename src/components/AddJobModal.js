"use client";
import { useState } from "react";

export default function AddJobModal({ isOpen, onClose, onJobAdded }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const initialFormState = {
    job_title: "",
    company: "",
    job_location: "",
    application_url: "",
    status: "Applied",
    application_date: new Date().toISOString().split("T")[0],
  };
  const [formData, setFormData] = useState(initialFormState);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await fetch("/api/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      setFormData(initialFormState);
      onJobAdded();
      onClose();
    } catch (error) {
      console.error("Failed to add job", error);
      alert("Failed to save job. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Shared class for all inputs to ensure consistent styling
  const inputClass =
    "w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#14B8A6] focus:border-transparent outline-none transition text-gray-900 placeholder:text-gray-400";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-0 bg-gray-900/50 backdrop-blur-sm transition-opacity">
      <div className="relative transform overflow-hidden rounded-xl bg-white text-left shadow-2xl transition-all sm:my-8 sm:w-full sm:max-w-lg font-sans">
        <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
          <div className="sm:flex sm:items-start">
            <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left w-full">
              <h3 className="text-xl font-bold leading-6 text-gray-900 mb-6">
                Add New Application
              </h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Job Title */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">
                    Job Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    required
                    type="text"
                    placeholder="e.g. Frontend Engineer"
                    className={inputClass}
                    value={formData.job_title}
                    onChange={(e) =>
                      setFormData({ ...formData, job_title: e.target.value })
                    }
                  />
                </div>

                {/* Company */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">
                    Company <span className="text-red-500">*</span>
                  </label>
                  <input
                    required
                    type="text"
                    placeholder="e.g. Google"
                    className={inputClass}
                    value={formData.company}
                    onChange={(e) =>
                      setFormData({ ...formData, company: e.target.value })
                    }
                  />
                </div>

                {/* Location & Date */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">
                      Location
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Remote / NY"
                      className={inputClass}
                      value={formData.job_location}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          job_location: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">
                      Date Applied
                    </label>
                    <input
                      type="date"
                      className={inputClass}
                      value={formData.application_date}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          application_date: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>

                {/* URL */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">
                    Link / URL
                  </label>
                  <input
                    type="url"
                    placeholder="https://..."
                    className={inputClass}
                    value={formData.application_url}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        application_url: e.target.value,
                      })
                    }
                  />
                </div>

                {/* Buttons */}
                <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6 -mx-6 -mb-6 mt-6 rounded-b-xl">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex w-full justify-center rounded-lg bg-[#14B8A6] px-3 py-2 text-sm font-bold text-white shadow-sm hover:bg-teal-700 sm:ml-3 sm:w-auto disabled:opacity-50 transition"
                  >
                    {isSubmitting ? "Saving..." : "Save Application"}
                  </button>
                  <button
                    type="button"
                    onClick={onClose}
                    className="mt-3 inline-flex w-full justify-center rounded-lg bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto transition"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
