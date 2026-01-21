# 📊 How to Populate Sample Data

This guide explains how to add dummy data to your RED+ database so you can test the admin dashboard with realistic information.

---

## 🎯 What This Does

The sample data script will create:
- **10 Donors** with different blood types and donation history
- **5 Organizers** (NGOs, clubs, and community groups)
- **10 Blood Banks** in Indore and Bhopal area
- **5 Events** (upcoming and completed)
- **24 Donations** for completed events
- **24 Certificates** for donors

---

## 🚀 Option 1: Using Python Script (RECOMMENDED)

This method uses proper password hashing and is safer.

### Step 1: Navigate to Backend Directory
```bash
cd "red-connect backend"
```

### Step 2: Run the Script
```bash
python populate_sample_data.py
```

### Step 3: Follow the Prompts
- The script will ask if you want to clear existing data
- Type `yes` to clear or `no` to keep existing data
- Wait for the script to complete

### Step 4: Success!
You should see a summary like:
```
✅ SAMPLE DATA CREATED SUCCESSFULLY!
📊 Summary:
   • Users: 15
   • Donors: 10
   • Organizers: 5
   • Blood Banks: 10
   • Events: 5
   • Donations: 24
   • Certificates: 24
```

---

## 🗃️ Option 2: Using SQL Script (Alternative)

If you prefer SQL, you can use the SQL file directly.

### Step 1: Open MySQL Workbench or Command Line
```bash
mysql -u root -p
```

### Step 2: Select Your Database
```sql
USE `red-connect`;
```

### Step 3: Run the SQL Script
```bash
source sample_data.sql
```

**Note:** You'll need to update the password hashes in the SQL file to match your bcrypt hashing.

---

## 🔑 Login Credentials

After populating the data, you can login with these accounts:

### Donors
- Email: `john.doe@example.com`
- Email: `jane.smith@example.com`
- Email: `mike.wilson@example.com`
- ... and 7 more donors
- **Password:** `password123` (for all)

### Organizers
- Email: `contact@redcrossindore.org`
- Email: `info@rotaryclubindore.org`
- Email: `admin@lionsclubbhopal.org`
- Email: `events@ngohelping.org`
- Email: `contact@youthforchange.org`
- **Password:** `password123` (for all)

---

## 📊 What You'll See in Admin Dashboard

After running the script and logging in as admin:

### Statistics Section
- **Total Donors:** 10 donors
- **Active Donors:** Based on recent donations
- **Total Organizers:** 5 organizations
- **Total Events:** 5 events (3 upcoming, 2 completed)
- **Total Donations:** 24 donations
- **Total Blood Banks:** 10 blood banks
- **Total Certificates:** 24 certificates issued

### Donors Tab (Click Refresh)
You'll see 10 donors with:
- Names, emails, blood groups
- Donation counts
- Active/Inactive status
- Toggle and delete buttons

### Organizers Tab (Click Refresh)
You'll see 5 organizers with:
- Organization names
- Contact persons
- Event counts
- Verified status
- Toggle and delete buttons

### Events Tab (Click Refresh)
You'll see 5 events with:
- Event titles and dates
- Organizer names
- Participant counts
- Status (upcoming/completed)
- Delete buttons

### Blood Banks Tab (Click Refresh)
You'll see 10 blood banks with:
- Names and addresses
- Contact information
- Registration dates

---

## ⚠️ Important Notes

1. **Clearing Data:** If you choose to clear existing data, it will DELETE all donors, organizers, events, donations, and certificates. Your admin account will NOT be affected.

2. **Password:** All sample accounts use `password123` as the password. This is for testing only!

3. **Running Multiple Times:** You can run the script multiple times. Just choose to clear existing data first to avoid duplicates.

4. **Production Warning:** NEVER use this script in production! This is for testing only.

---

## 🔄 Refresh Admin Dashboard

After populating data:

1. Go to `http://localhost:5173/admin-login`
2. Login with your admin credentials
3. Click on each tab (Donors, Organizers, Events, Blood Banks)
4. Click the **Refresh** button in each tab
5. You'll see all the sample data!

---

## 🐛 Troubleshooting

### Script Errors
If you get import errors:
```bash
pip install passlib bcrypt
```

### Database Connection Error
Make sure:
- MySQL is running
- Your `.env` file has correct database credentials
- The database `red-connect` exists

### No Data Showing
- Click the **Refresh** button in each tab
- Check browser console for errors
- Verify backend is running

---

## 📞 Need Help?

If you encounter issues:
1. Check the backend logs
2. Verify database connection
3. Make sure all tables are created
4. Try clearing data and running again

---

**Happy Testing! 🎉**


