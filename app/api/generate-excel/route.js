import { NextResponse } from 'next/server';
import * as XLSX from 'xlsx';
import connectToDatabase from '../../lib/mongodb';
import Timesheet from '../../models/Timesheet';
import { uploadFile } from '../../lib/gridfs';

export async function POST(request) {
  try {
    const data = await request.json();
    let timesheetId;
    let fileId;
    
    // Save data to MongoDB
    try {
      await connectToDatabase();
      
      // Extract year from data or use current year
      const year = data.year || new Date().getFullYear().toString();
      
      // Create a new timesheet document
      const timesheet = await Timesheet.create({
        name: data.name,
        month: data.month,
        year: year,
        data: data
      });
      
      timesheetId = timesheet._id;
      console.log('Timesheet saved to MongoDB');
    } catch (dbError) {
      console.error('Error saving to MongoDB:', dbError);
      return NextResponse.json({ error: 'Failed to save data to MongoDB' }, { status: 500 });
    }
    
    // Create a new workbook
    const wb = XLSX.utils.book_new();
    
    // Create a worksheet with the user data
    const worksheet = XLSX.utils.json_to_sheet([data]);
    
    // Add the worksheet to the workbook
    XLSX.utils.book_append_sheet(wb, worksheet, 'User Data');
    
    // Generate the Excel file
    const excelBuffer = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });
    
    // Filename for the Excel file
    const filename = `timesheet-${data.name}-${data.month}.xlsx`;
    
    // Store the Excel file in MongoDB GridFS
    try {
      const fileMetadata = {
        timesheetId: timesheetId,
        name: data.name,
        month: data.month,
        year: data.year || new Date().getFullYear().toString()
      };
      
      const uploadedFile = await uploadFile(excelBuffer, filename, fileMetadata);
      console.log('Excel file stored in GridFS:', uploadedFile);
      fileId = uploadedFile._id;
      
      // Update the timesheet document with the file ID
      if (timesheetId) {
        await Timesheet.findByIdAndUpdate(timesheetId, {
          fileId: uploadedFile._id
        });
      }
    } catch (uploadError) {
      console.error('Error uploading file to GridFS:', uploadError);
      return NextResponse.json({ error: 'Failed to store Excel file in database' }, { status: 500 });
    }
    
    // Return success response instead of the file
    return NextResponse.json({ 
      success: true, 
      message: 'Timesheet data and Excel file saved successfully', 
      timesheetId: timesheetId.toString(),
      fileId: fileId.toString(),
      downloadUrl: `/api/timesheets/download/${timesheetId}`
    });
  } catch (error) {
    console.error('Error generating Excel:', error);
    return NextResponse.json({ error: 'Failed to generate Excel file' }, { status: 500 });
  }
} 