# Quick Setup Guide for Updated Red Connect Project

## Prerequisites
- MySQL database running
- Python 3.8+ installed
- Node.js 16+ installed
- Backend and frontend dependencies already installed

## Step-by-Step Setup

### 1. Update Database Schema

```bash
# Navigate to backend directory
cd "red-connect backend"

# Run migration script
python migrate_db.py
```

This will add new columns and tables to your existing database without affecting current data.

### 2. Restart Backend Server

```bash
# If using the batch file
start.bat

# Or manually
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### 3. Restart Frontend Development Server

```bash
# Navigate to frontend directory
cd "red-connect frontend"

# Start the development server
npm run dev
```

### 4. Verify Changes

#### Test Donor Features:
1. Login as a donor (or register new donor)
2. Go to Dashboard > Update Profile
3. Add weight, hemoglobin, gender, and date of birth
4. Click "Check Donation Eligibility" button
5. Verify validation feedback shows for:
   - Age (18-65 years)
   - Weight (≥50 kg)
   - Hemoglobin (Female: ≥12.5, Male: ≥13.0)

#### Test Event Features:
1. Navigate to Events page
2. Verify time displays in AM/PM format (e.g., "2:30 PM")
3. Check "Remaining Slots" label appears on event cards
4. Open an event details page
5. Verify remaining donor count is displayed

#### Test Organizer Registration:
1. Go to Organizer Registration page
2. Verify these fields are present:
   - Contact Person
   - Phone
   - Email
   - Address Line 1
   - Address Line 2
   - City, State, Pincode
   - Website
3. Verify these fields are removed:
   - Organization Name
   - Registration Number

#### Test Past Events Tab:
1. Login as donor
2. Go to Dashboard
3. Click on "Past Events" tab
4. Verify it shows:
   - Total Donations count
   - Last Donation date
   - Link to browse events

## Common Issues & Solutions

### Issue: Migration script fails
**Solution**: Check MySQL connection in `.env` file. Ensure database exists and user has ALTER permissions.

### Issue: Frontend shows old data
**Solution**: Clear browser cache or open in incognito mode. Hard refresh (Ctrl+Shift+R).

### Issue: Eligibility check returns 404
**Solution**: Ensure backend server is running and you're logged in as a donor.

### Issue: Time shows as "NaN:NaN AM"
**Solution**: Event data may have old format. Update events to use separate date and time fields.

## API Endpoints Added

### GET /api/donors/me/eligibility
Returns donor's eligibility status for blood donation.

**Response Example:**
```json
{
  "eligible": false,
  "issues": [
    "Weight must be at least 50 kg (Current: 45 kg)",
    "Must wait 30 more days. Next eligible date: February 7, 2026"
  ],
  "last_donation_date": "2026-01-08",
  "next_eligible_date": "2026-02-07"
}
```

## Database Schema Updates

### donors table - New Columns:
- `hemoglobin` (FLOAT): Hemoglobin level in g/dL
- `gender` (VARCHAR(10)): Gender for hemoglobin validation

### organizers table - New Column:
- `street_address` (TEXT): Additional address line

### New Table: blood_bank_revenue
- `id` (INT, Primary Key)
- `blood_bank_id` (INT, Foreign Key)
- `transaction_date` (DATE)
- `revenue_amount` (FLOAT)
- `transaction_type` (VARCHAR(50))
- `description` (TEXT)
- `created_at` (DATETIME)

## Support

For issues or questions:
1. Check CHANGES_SUMMARY.md for detailed information
2. Review error logs in browser console (F12)
3. Check backend logs in terminal

---

**Last Updated**: January 8, 2026
