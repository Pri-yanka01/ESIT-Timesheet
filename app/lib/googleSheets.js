import { google } from 'googleapis';

/**
 * Authenticates with Google using service account credentials
 * @returns {google.auth.JWT} Authenticated JWT client
 */
export async function getAuthClient() {
  try {
    console.log('Starting Google authentication...');
    
    // Check if required environment variables are set
    if (!process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL) {
      throw new Error('GOOGLE_SERVICE_ACCOUNT_EMAIL environment variable is not set');
    }
    
    if (!process.env.GOOGLE_PRIVATE_KEY) {
      throw new Error('GOOGLE_PRIVATE_KEY environment variable is not set');
    }
    
    // Load credentials from environment variables
    const credentials = {
      client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    };

    // Log for debugging
    console.log('Using service account email:', credentials.client_email);
    console.log('Private key length:', credentials.private_key?.length || 0);
    
    if (!credentials.private_key || credentials.private_key.length < 10) {
      throw new Error('Private key is missing or malformed');
    }
    
    // Create a new JWT client using the credentials
    console.log('Creating JWT client...');
    const client = new google.auth.JWT(
      credentials.client_email,
      null,
      credentials.private_key,
      ['https://www.googleapis.com/auth/spreadsheets']
    );

    // Authenticate the client
    console.log('Authorizing with Google...');
    await client.authorize();
    console.log('Successfully authenticated with Google');
    return client;
  } catch (error) {
    console.error('Error authenticating with Google:', error);
    throw new Error(`Failed to authenticate with Google Sheets: ${error.message}`);
  }
}

/**
 * Appends a row to a Google Sheet
 * @param {Object} data - The data to append to the sheet
 * @returns {Object} Response from the Google Sheets API
 */
export async function appendToSheet(data) {
  try {
    console.log('Starting appendToSheet function...');
    
    // Check if spreadsheet ID is set
    if (!process.env.GOOGLE_SHEET_ID) {
      throw new Error('GOOGLE_SHEET_ID environment variable is not set');
    }
    
    console.log('Getting auth client...');
    const auth = await getAuthClient();
    console.log('Creating Google Sheets client...');
    const sheets = google.sheets({ version: 'v4', auth });
    
    // The ID of your spreadsheet
    const spreadsheetId = process.env.GOOGLE_SHEET_ID;
    
    // Log for debugging
    console.log('Using spreadsheet ID:', spreadsheetId);
    
    // Convert the data object to array format expected by Google Sheets
    const values = [
      [
        data.name,
        data.department,
        data.month,
        data.year || new Date().getFullYear().toString(),
        new Date().toISOString() // Timestamp
      ]
    ];
    
    console.log('Prepared values for sheet:', values);

    // Append the values to the sheet
    console.log('Calling Google Sheets API to append values...');
    const response = await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: 'Sheet1!A:E', // Adjust range as needed
      valueInputOption: 'USER_ENTERED',
      insertDataOption: 'INSERT_ROWS',
      resource: {
        values,
      },
    });

    console.log('Successfully appended data to Google Sheet');
    return response.data;
  } catch (error) {
    console.error('Error appending to Google Sheet:', error);
    throw new Error(`Failed to append data to Google Sheet: ${error.message}`);
  }
} 