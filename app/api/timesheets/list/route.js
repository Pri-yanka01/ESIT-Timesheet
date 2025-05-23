import { NextResponse } from 'next/server';
import connectToDatabase from '../../../lib/mongodb';
import Timesheet from '../../../models/Timesheet';

export async function GET() {
  try {
    // Connect to database
    await connectToDatabase();
    
    // Get all timesheets, sorted by creation date (newest first)
    const timesheets = await Timesheet.find({})
      .sort({ createdAt: -1 })
      .lean();
    
    // Map timesheets to add download URLs
    const timesheetsWithUrls = timesheets.map(timesheet => {
      const hasFile = Boolean(timesheet.fileId);
      
      return {
        ...timesheet,
        _id: timesheet._id.toString(),
        fileId: timesheet.fileId ? timesheet.fileId.toString() : null,
        hasFile,
        downloadUrl: hasFile ? `/api/timesheets/download/${timesheet._id}` : null
      };
    });
    
    return NextResponse.json({ timesheets: timesheetsWithUrls });
  } catch (error) {
    console.error('Error listing timesheets:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
} 