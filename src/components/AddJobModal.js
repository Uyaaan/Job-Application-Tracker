"use client";
import { useState } from "react";
import { createJob } from "@/actions/createJob";

export default function AddJobModal({ isOpen, onClose }) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  async function handleSubmit(event) {
    event.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(event.target);

    try {
      const result = await createJob(formData);
      if (result.success) {
        onClose();
      } else {
        alert(result.error);
      }
    } catch (error) {
      alert("Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
  }

  // UPDATED: Changed focus ring to green-600
  const inputClass =
    "w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent outline-none transition text-gray-900 placeholder:text-gray-400";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-0 bg-gray-900/50 backdrop-blur-sm transition-opacity">
      <div className="relative transform overflow-hidden rounded-xl bg-white text-left shadow-2xl transition-all sm:my-8 sm:w-full sm:max-w-lg font-sans">
        <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
          <h3 className="text-xl font-bold text-gray-900 mb-6">
            Add New Application
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input type="hidden" name="status" value="Applied" />

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">
                Job Title <span className="text-red-500">*</span>
              </label>
              <input
                name="title"
                required
                type="text"
                placeholder="e.g. Frontend Engineer"
                className={inputClass}
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">
                Company <span className="text-red-500">*</span>
              </label>
              <input
                name="company"
                required
                type="text"
                placeholder="e.g. Google"
                className={inputClass}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">
                  Location
                </label>
                <input
                  name="location"
                  type="text"
                  placeholder="e.g. Remote"
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">
                  Date Applied
                </label>
                <input
                  name="date"
                  type="date"
                  required
                  defaultValue={new Date().toISOString().split("T")[0]}
                  className={inputClass}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">
                Link / URL
              </label>
              <input
                name="url"
                type="url"
                placeholder="https://..."
                className={inputClass}
              />
            </div>

            <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6 -mx-6 -mb-6 mt-6 rounded-b-xl">
              {/* UPDATED: Changed background to bg-green-600 */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex w-full justify-center rounded-lg bg-green-600 px-3 py-2 text-sm font-bold text-white shadow-sm hover:bg-green-700 sm:ml-3 sm:w-auto disabled:opacity-50 transition"
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
  );
}
