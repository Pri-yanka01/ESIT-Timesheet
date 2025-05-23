# Google Sheets API Integration Guide

## Environment Variables Setup

Create a `.env.local` file in the root of your project with the following variables:

```
# MongoDB Configuration
MONGODB_URI=mongodb+srv://your-username:your-password@your-cluster.mongodb.net/your-database

# Google Sheets API Configuration
GOOGLE_SERVICE_ACCOUNT_EMAIL=your-service-account@your-project.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour Private Key Here\n-----END PRIVATE KEY-----\n"
GOOGLE_SHEET_ID=your-google-sheet-id-from-url
```

## How to Get Google Sheets Credentials

1. **Create a Google Cloud Project**:
   - Go to the [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select an existing one

2. **Enable the Google Sheets API**:
   - In your project, go to "APIs & Services" > "Library"
   - Search for "Google Sheets API" and enable it

3. **Create Service Account Credentials**:
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "Service Account"
   - Fill in the required details and create the service account
   - Go to the service account details page
   - Under "Keys", add a new key (JSON format)
   - Download the JSON file with your credentials

4. **Extract Credentials**:
   - From the downloaded JSON file, you need:
     - `client_email`: This is your `GOOGLE_SERVICE_ACCOUNT_EMAIL`
     - `private_key`: This is your `GOOGLE_PRIVATE_KEY`

5. **Create a Google Sheet**:
   - Create a new Google Sheet
   - Share it with your service account email (with Editor permissions)
   - Copy the Sheet ID from the URL: `https://docs.google.com/spreadsheets/d/YOUR_SHEET_ID/edit`
   - Set this as your `GOOGLE_SHEET_ID`

6. **Setup Sheet Headers**:
   - The first row of your sheet should have headers matching the data you're storing:
     - Name
     - Department
     - Month
     - Year
     - Timestamp 