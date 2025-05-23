import { NextResponse } from 'next/server';
import connectToDatabase from '../../lib/mongodb';
import Timesheet from '../../models/Timesheet';

export async function GET(request) {
  try {
    await connectToDatabase();
    
    // Get query parameters
    const { searchParams } = new URL(request.url);
    const name = searchParams.get('name');
    const month = searchParams.get('month');
    const year = searchParams.get('year');
    
    // Build query filter
    const filter = {};
    if (name) filter.name = name;
    if (month) filter.month = month;
    if (year) filter.year = year;
    
    // Fetch timesheets from MongoDB
    const timesheets = await Timesheet.find(filter).sort({ createdAt: -1 });
    
    return NextResponse.json({ timesheets });
  } catch (error) {
    console.error('Error fetching timesheets:', error);
    return NextResponse.json({ error: 'Failed to fetch timesheets' }, { status: 500 });
  }
} 