"use client"; 

import { useState, useEffect } from 'react';

const STATUS_STYLES = {
  'Applied': 'bg-blue-100 text-blue-800 border-blue-200',
  'For Interview': 'bg-green-100 text-green-800 border-green-200', 
  'Interviewing': 'bg-yellow-100 text-yellow-800 border-yellow-200', 
  'Offer Received': 'bg-green-700 text-white border-green-800',     
  'Rejected': 'bg-red-700 text-white border-red-800',               
};

export default function StatusBadge({ currentStatus, companyName }) {
  const [status, setStatus] = useState(currentStatus || 'Applied');
  const [loading, setLoading] = useState(false);

  // Sync state when parent data changes (Refresh button fix)
  useEffect(() => {
    setStatus(currentStatus || 'Applied');
  }, [currentStatus]);

  const handleChange = async (e) => {
    const newStatus = e.target.value;
    const oldStatus = status; 
    
    // Optimistic Update
    setStatus(newStatus);
    setLoading(true);

    try {
      const response = await fetch('/api/jobs', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ company: companyName, newStatus }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Unknown error');
      }
    } catch (err) {
      console.error(err);
      alert(`Update Failed: ${err.message}`); 
      setStatus(oldStatus); 
    } finally {
      setLoading(false);
    }
  };

  const currentStyle = STATUS_STYLES[status] || 'bg-gray-100 text-gray-800 border-gray-200';

  return (
    <div className="relative inline-block">
      <select
        value={status}
        onChange={handleChange}
        disabled={loading}
        className={`appearance-none font-medium text-xs px-3 py-1 rounded-full cursor-pointer border focus:ring-2 focus:ring-offset-1 focus:ring-blue-300 outline-none transition-colors ${currentStyle}`}
      >
        <option value="Applied" className="bg-white text-gray-800">Applied</option>
        <option value="For Interview" className="bg-white text-gray-800">For Interview</option>
        <option value="Interviewing" className="bg-white text-gray-800">Interviewing</option>
        <option value="Offer Received" className="bg-white text-gray-800">Offer Received</option>
        <option value="Rejected" className="bg-white text-gray-800">Rejected</option>
      </select>
      
      {loading && (
        <div className="absolute top-0 right-0 -mr-3 flex items-center h-full">
           <div className="animate-spin h-3 w-3 border-2 border-blue-500 rounded-full border-t-transparent"></div>
        </div>
      )}
    </div>
  );
}