'use client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

export default function DashboardForm() {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  
  const onSubmit = async (data) => {
    setIsLoading(true);
    setSuccessMessage('');
    setErrorMessage('');
    
    try {
      // Using the new Google Sheets API endpoint
      const response = await fetch('/api/timesheets/google-sheets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      
      const responseData = await response.json();
      
      if (response.ok) {
        setSuccessMessage('Timesheet data saved successfully to MongoDB and Google Sheets!');
        reset(); // Reset form fields
      } else {
        setErrorMessage(responseData.error || 'Error saving timesheet');
        console.error('API Error:', responseData);
      }
    } catch (error) {
      console.error('Error:', error);
      setErrorMessage('Error processing timesheet');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Timesheet Information</h2>
      
      {successMessage && (
        <div className="mb-6 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
          <p className="font-medium">{successMessage}</p>
        </div>
      )}
      
      {errorMessage && (
        <div className="mb-6 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          <p className="font-medium">{errorMessage}</p>
        </div>
      )}
      
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Name</label>
          <input 
            {...register('name', { required: 'Name is required' })}
            className="w-full px-3 py-2 border rounded-md"
          />
          {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Department</label>
          <input 
            {...register('department', { required: 'Department is required' })}
            className="w-full px-3 py-2 border rounded-md"
          />
          {errors.department && <p className="text-red-500 text-sm mt-1">{errors.department.message}</p>}
        </div>
        
        <div className="mb-6">
          <label className="block text-gray-700 mb-2">Month</label>
          <select 
            {...register('month', { required: 'Month is required' })}
            className="w-full px-3 py-2 border rounded-md"
          >
            <option value="">Select month</option>
            <option value="January">January</option>
            <option value="February">February</option>
            <option value="March">March</option>
            <option value="April">April</option>
            <option value="May">May</option>
            <option value="June">June</option>
            <option value="July">July</option>
            <option value="August">August</option>
            <option value="September">September</option>
            <option value="October">October</option>
            <option value="November">November</option>
            <option value="December">December</option>
          </select>
          {errors.month && <p className="text-red-500 text-sm mt-1">{errors.month.message}</p>}
        </div>
        
        <button 
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded disabled:bg-blue-300"
        >
          {isLoading ? 'Saving...' : 'Save Timesheet'}
        </button>
      </form>
    </div>
  );
} 