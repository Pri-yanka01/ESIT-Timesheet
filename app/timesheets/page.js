'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function TimesheetsPage() {
  const [timesheets, setTimesheets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({ name: '', month: '', year: '' });

  const fetchTimesheets = async () => {
    try {
      setLoading(true);
      
      // Build query string from filters
      const queryParams = new URLSearchParams();
      if (filters.name) queryParams.append('name', filters.name);
      if (filters.month) queryParams.append('month', filters.month);
      if (filters.year) queryParams.append('year', filters.year);
      
      const response = await fetch(`/api/timesheets?${queryParams.toString()}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch timesheets');
      }
      
      const data = await response.json();
      setTimesheets(data.timesheets);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTimesheets();
  }, []);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchTimesheets();
  };

  // Function to download excel from the API
  const downloadExcel = async (timesheet) => {
    try {
      const response = await fetch('/api/generate-excel', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(timesheet.data),
      });

      if (!response.ok) {
        throw new Error('Failed to generate Excel');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `timesheet-${timesheet.name}-${timesheet.month}.xlsx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error downloading Excel:', error);
      alert('Error downloading Excel file');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Saved Timesheets</h1>
      
      <div className="mb-8">
        <form onSubmit={handleSearch} className="flex flex-wrap gap-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={filters.name}
              onChange={handleFilterChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            />
          </div>
          
          <div>
            <label htmlFor="month" className="block text-sm font-medium text-gray-700">Month</label>
            <input
              type="text"
              id="month"
              name="month"
              value={filters.month}
              onChange={handleFilterChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            />
          </div>
          
          <div>
            <label htmlFor="year" className="block text-sm font-medium text-gray-700">Year</label>
            <input
              type="text"
              id="year"
              name="year"
              value={filters.year}
              onChange={handleFilterChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            />
          </div>
          
          <div className="flex items-end">
            <button
              type="submit"
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              Search
            </button>
          </div>
        </form>
      </div>
      
      {loading ? (
        <p>Loading timesheets...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : timesheets.length === 0 ? (
        <p>No timesheets found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Month</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Year</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created At</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {timesheets.map((timesheet) => (
                <tr key={timesheet._id}>
                  <td className="px-6 py-4 whitespace-nowrap">{timesheet.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{timesheet.month}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{timesheet.year}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {new Date(timesheet.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <button
                      onClick={() => downloadExcel(timesheet)}
                      className="text-blue-600 hover:text-blue-900 mr-4"
                    >
                      Download Excel
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      
      <div className="mt-8">
        <Link href="/" className="text-blue-600 hover:text-blue-800">
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
} 