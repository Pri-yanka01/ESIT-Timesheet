import { NextResponse } from 'next/server';
import * as XLSX from 'xlsx';

export async function POST(request) {
  try {
    const data = await request.json();
    
    // Create a new workbook
    const wb = XLSX.utils.book_new();
    
    // Create a worksheet with the user data
    const worksheet = XLSX.utils.json_to_sheet([data]);
    
    // Add the worksheet to the workbook
    XLSX.utils.book_append_sheet(wb, worksheet, 'User Data');
    
    // Generate the Excel file
    const excelBuffer = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });
    
    // Return the Excel file as a response
    return new NextResponse(excelBuffer, {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename="timesheet-${data.name}-${data.month}.xlsx"`,
      },
    });
  } catch (error) {
    console.error('Error generating Excel:', error);
    return NextResponse.json({ error: 'Failed to generate Excel file' }, { status: 500 });
  }
} 