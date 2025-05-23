import { NextResponse } from 'next/server';
import { appendToSheet } from '../../../lib/googleSheets';
import connectToDatabase from '../../../lib/mongodb';
import Timesheet from '../../../models/Timesheet';

export async function POST(request) {
  try {
    // Detailed environment variable logging
    console.log('=== Environment Variables Debug ===');
    console.log('NODE_ENV:', process.env.NODE_ENV);
    console.log('GOOGLE_SERVICE_ACCOUNT_EMAIL:', process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL);
    console.log('GOOGLE_PRIVATE_KEY length:', process.env.GOOGLE_PRIVATE_KEY?.length || 0);
    console.log('GOOGLE_SHEET_ID:', process.env.GOOGLE_SHEET_ID);
    console.log('================================');
    
    // Console log for debugging
    console.log('Google Sheets API endpoint called');
    
    const data = await request.json();
    console.log('Received data:', data);
    
    // Add the current year if not provided
    if (!data.year) {
      data.year = new Date().getFullYear().toString();
    }
    
    // Check if environment variables are set
    if (!process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL || 
        !process.env.GOOGLE_PRIVATE_KEY || 
        !process.env.GOOGLE_SHEET_ID) {
      console.error('Missing Google Sheets environment variables');
      return NextResponse.json({ 
        error: 'Server configuration error: Missing Google Sheets environment variables', 
        debug: {
          hasServiceEmail: !!process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
          hasPrivateKey: !!process.env.GOOGLE_PRIVATE_KEY,
          hasSheetId: !!process.env.GOOGLE_SHEET_ID
        }
      }, { status: 500 });
    }
    
    // Try MongoDB operation first without Google Sheets to isolate the issue
    let timesheetId;
    
    // 1. Save to MongoDB
    try {
      console.log('Connecting to MongoDB...');
      await connectToDatabase();
      
      // Create a new timesheet document
      const timesheet = await Timesheet.create({
        name: data.name,
        department: data.department,
        month: data.month,
        year: data.year,
        data: data
      });
      
      timesheetId = timesheet._id;
      console.log('Timesheet saved to MongoDB with ID:', timesheetId);
    } catch (dbError) {
      console.error('Error saving to MongoDB:', dbError);
      return NextResponse.json({ 
        error: 'Failed to save data to MongoDB', 
        details: dbError.message 
      }, { status: 500 });
    }
    
    // 2. Append data to Google Sheet
    try {
      console.log('Attempting to append data to Google Sheet...');
      const sheetResponse = await appendToSheet(data);
      console.log('Data appended to Google Sheet successfully:', sheetResponse);
    } catch (sheetError) {
      console.error('Detailed error appending to Google Sheet:', sheetError);
      return NextResponse.json({ 
        error: 'Data saved to MongoDB but failed to append to Google Sheet',
        details: sheetError.message,
        stack: sheetError.stack
      }, { status: 500 });
    }
    
    // Return success response
    return NextResponse.json({ 
      success: true, 
      message: 'Timesheet data saved to MongoDB and Google Sheets successfully',
      timesheetId: timesheetId?.toString()
    });
  } catch (error) {
    console.error('Error in Google Sheets API route:', error);
    return NextResponse.json({ 
      error: 'Failed to process timesheet data',
      details: error.message,
      stack: error.stack
    }, { status: 500 });
  }
} 