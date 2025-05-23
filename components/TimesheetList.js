'use client';

import { useEffect, useState } from 'react';

export default function TimesheetList() {
  const [timesheets, setTimesheets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [downloadStatus, setDownloadStatus] = useState({});

  useEffect(() => {
    async function fetchTimesheets() {
      try {
        setLoading(true);
        const response = await fetch('/api/timesheets/list');
        
        if (!response.ok) {
          throw new Error('Failed to fetch timesheets');
        }
        
        const data = await response.json();
        setTimesheets(data.timesheets || []);
      } catch (err) {
        console.error('Error fetching timesheets:', err);
        setError('Failed to load timesheets. Please try again later.');
      } finally {
        setLoading(false);
      }
    }
    
    fetchTimesheets();
  }, [refreshTrigger]);

  // Function to refresh the list
  const refreshList = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  // Handle file download with status
  const handleDownload = async (timesheetId, filename) => {
    try {
      setDownloadStatus(prev => ({ ...prev, [timesheetId]: 'downloading' }));
      
      const response = await fetch(`/api/timesheets/download/${timesheetId}`);
      
      if (!response.ok) {
        throw new Error('Download failed');
      }
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      
      setDownloadStatus(prev => ({ ...prev, [timesheetId]: 'success' }));
      
      // Reset status after 3 seconds
      setTimeout(() => {
        setDownloadStatus(prev => {
          const newStatus = { ...prev };
          delete newStatus[timesheetId];
          return newStatus;
        });
      }, 3000);
      
    } catch (error) {
      console.error('Download error:', error);
      setDownloadStatus(prev => ({ ...prev, [timesheetId]: 'error' }));
      
      // Reset error status after 3 seconds
      setTimeout(() => {
        setDownloadStatus(prev => {
          const newStatus = { ...prev };
          delete newStatus[timesheetId];
          return newStatus;
        });
      }, 3000);
    }
  };

  if (loading && timesheets.length === 0) {
    return <div className="text-center py-4">Loading timesheets...</div>;
  }

  if (error && timesheets.length === 0) {
    return (
      <div className="text-center py-4">
        <p className="text-red-500 mb-2">{error}</p>
        <button 
          onClick={refreshList}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (timesheets.length === 0) {
    return <div className="text-center py-4">No timesheets found. Create your first timesheet above.</div>;
  }

  return (
    <div className="mt-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Your Timesheets</h2>
        <button 
          onClick={refreshList}
          className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 flex items-center"
        >
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
          </svg>
          Refresh
        </button>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-2 px-4 border-b text-left">Name</th>
              <th className="py-2 px-4 border-b text-left">Month</th>
              <th className="py-2 px-4 border-b text-left">Year</th>
              <th className="py-2 px-4 border-b text-left">Created</th>
              <th className="py-2 px-4 border-b text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {timesheets.map((timesheet) => {
              const filename = `timesheet-${timesheet.name}-${timesheet.month}.xlsx`;
              const status = downloadStatus[timesheet._id];
              
              return (
                <tr key={timesheet._id} className="hover:bg-gray-50">
                  <td className="py-2 px-4 border-b">{timesheet.name}</td>
                  <td className="py-2 px-4 border-b">{timesheet.month}</td>
                  <td className="py-2 px-4 border-b">{timesheet.year}</td>
                  <td className="py-2 px-4 border-b">
                    {new Date(timesheet.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-2 px-4 border-b text-center">
                    {timesheet.hasFile ? (
                      <button 
                        onClick={() => handleDownload(timesheet._id, filename)}
                        disabled={status === 'downloading'}
                        className={`inline-flex items-center px-3 py-1 rounded text-white ${
                          status === 'downloading' ? 'bg-gray-400' :
                          status === 'error' ? 'bg-red-500 hover:bg-red-600' :
                          status === 'success' ? 'bg-green-500' :
                          'bg-blue-500 hover:bg-blue-600'
                        }`}
                      >
                        {status === 'downloading' ? (
                          <>
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Downloading...
                          </>
                        ) : status === 'error' ? (
                          'Try Again'
                        ) : status === 'success' ? (
                          'Downloaded!'
                        ) : (
                          <>
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
                            </svg>
                            Download
                          </>
                        )}
                      </button>
                    ) : (
                      <span className="text-gray-400">No file</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
} 