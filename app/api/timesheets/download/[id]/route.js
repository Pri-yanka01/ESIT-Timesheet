import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import connectToDatabase from '../../../../lib/mongodb';
import Timesheet from '../../../../models/Timesheet';
import { getFile } from '../../../../lib/gridfs';

export async function GET(request, { params }) {
  try {
    const { id } = params;
    
    if (!id || !ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid timesheet ID' }, { status: 400 });
    }
    
    // Connect to database
    await connectToDatabase();
    
    // Get the timesheet document
    const timesheet = await Timesheet.findById(id);
    
    if (!timesheet) {
      return NextResponse.json({ error: 'Timesheet not found' }, { status: 404 });
    }
    
    if (!timesheet.fileId) {
      return NextResponse.json({ error: 'No file associated with this timesheet' }, { status: 404 });
    }
    
    try {
      // Get the file from GridFS
      const fileBuffer = await getFile(new ObjectId(timesheet.fileId));
      
      // Create filename
      const filename = `timesheet-${timesheet.name}-${timesheet.month}.xlsx`;
      
      // Return the file
      return new NextResponse(fileBuffer, {
        headers: {
          'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          'Content-Disposition': `attachment; filename="${filename}"`,
        },
      });
    } catch (fileError) {
      console.error('Error retrieving file:', fileError);
      return NextResponse.json({ error: 'File not found or error retrieving file' }, { status: 404 });
    }
  } catch (error) {
    console.error('Error in download API:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
} 