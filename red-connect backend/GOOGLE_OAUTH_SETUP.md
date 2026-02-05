# Google OAuth Setup Guide

This guide will help you set up Google OAuth authentication for the Red Connect application.

## Prerequisites

1. A Google Cloud Platform (GCP) account
2. Access to Google Cloud Console

## Step 1: Create Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API:
   - Navigate to "APIs & Services" > "Library"
   - Search for "Google+ API" or "Google Identity Services"
   - Click "Enable"

4. Create OAuth 2.0 credentials:
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth client ID"
   - Choose "Web application" as the application type
   - Add authorized JavaScript origins:
     - `http://localhost:5173`
     - `http://127.0.0.1:5173`
     - (Add your production URLs when deploying)
   - Add authorized redirect URIs:
     - `http://localhost:5173`
     - `http://127.0.0.1:5173`
     - (Add your production URLs when deploying)
   - Click "Create"
   - Copy the **Client ID** and **Client Secret**

## Step 2: Update Backend Configuration

1. Create or update the `.env` file in the `red-connect backend` directory:

```env
# Google OAuth Configuration
GOOGLE_CLIENT_ID=your-google-client-id-here
GOOGLE_CLIENT_SECRET=your-google-client-secret-here
GOOGLE_REDIRECT_URI=http://localhost:5173/auth/google/callback
```

2. Install backend dependencies:
```bash
cd "red-connect backend"
pip install -r requirements.txt
```

## Step 3: Update Frontend Configuration

1. Create or update the `.env` file in the `red-connect frontend` directory:

```env
VITE_GOOGLE_CLIENT_ID=your-google-client-id-here
```

2. Install frontend dependencies (if not already done):
```bash
cd "red-connect frontend"
npm install
```

## Step 4: Run Database Migration

Run the migration script to add the `google_id` column to the users table:

```bash
# Option 1: Using MySQL command line
mysql -u your_username -p your_database < migrate_add_google_id.sql

# Option 2: Using a database client (phpMyAdmin, MySQL Workbench, etc.)
# Open migrate_add_google_id.sql and execute it
```

Or you can run it programmatically using Python:

```python
# Run this in Python
from app.database import engine
from sqlalchemy import text

with engine.connect() as conn:
    conn.execute(text("ALTER TABLE users ADD COLUMN google_id VARCHAR(255) NULL AFTER hashed_password"))
    conn.execute(text("ALTER TABLE users MODIFY COLUMN hashed_password VARCHAR(255) NULL"))
    conn.execute(text("CREATE UNIQUE INDEX idx_users_google_id ON users(google_id)"))
    conn.commit()
```

## Step 5: Start the Application

1. Start the backend:
```bash
cd "red-connect backend"
uvicorn main:app --reload
```

2. Start the frontend:
```bash
cd "red-connect frontend"
npm run dev
```

## Step 6: Test Google OAuth

1. Navigate to any login page (Donor, Organizer, or Admin)
2. Click the "Sign in with Google" button
3. Complete the Google authentication flow
4. You should be logged in and redirected to the appropriate dashboard

## Features

- **Automatic Account Creation**: If a user logs in with Google for the first time, an account is automatically created
- **Account Linking**: If a user has an existing account with the same email, the Google ID is linked to that account
- **Role-Based Authentication**: Google OAuth works for all three roles (Donor, Organizer, Admin)
- **Secure Token Verification**: Backend verifies Google ID tokens before creating sessions

## Troubleshooting

### "Invalid Google token" error
- Make sure `GOOGLE_CLIENT_ID` is set correctly in backend `.env`
- Verify the Client ID matches in both frontend and backend
- Check that the Google OAuth consent screen is configured

### "No credential received from Google"
- Make sure `VITE_GOOGLE_CLIENT_ID` is set in frontend `.env`
- Restart the frontend dev server after updating `.env`
- Check browser console for errors

### Database errors
- Make sure the migration script has been run
- Verify the `google_id` column exists in the `users` table
- Check that `hashed_password` column allows NULL values

## Security Notes

- Never commit `.env` files to version control
- Use different Client IDs for development and production
- Regularly rotate your Google OAuth credentials
- Monitor OAuth usage in Google Cloud Console

