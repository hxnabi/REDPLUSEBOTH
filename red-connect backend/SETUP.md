# Quick Setup Guide

Follow these steps to get your Red Connect backend up and running quickly!

## 🚀 Quick Start (5 Minutes)

### Step 1: Install Python Dependencies

```bash
pip install -r requirements.txt
```

### Step 2: Setup MySQL Database

Open MySQL and run:

```sql
CREATE DATABASE red_connect CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### Step 3: Create Environment File

Create a file named `.env` in the `red-connect backend` folder:

```env
DB_HOST=localhost
DB_PORT=3306
DB_NAME=red_connect
DB_USER=root
DB_PASSWORD=your_mysql_password_here
SECRET_KEY=change-this-to-a-random-secret-key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
DEBUG=True
```

**Important:** Replace `your_mysql_password_here` with your actual MySQL password!

### Step 4: Start the Server

**Database tables will be automatically created when you start the server!**

```bash
python run.py
```

Or alternatively:

```bash
uvicorn main:app --reload
```

### Step 5: Test the API

Open your browser and visit:
- **API Docs:** http://localhost:8000/docs
- **Health Check:** http://localhost:8000/health

## 🧪 Optional: Add Sample Data

If you want sample blood banks and test users, run:

```bash
python init_db.py
```

Type `yes` when prompted. This will add:
- 8 sample blood banks across different states
- 2 test user accounts

### Test Credentials (After running init_db.py):

**Donor Account:**
- Email: `donor@example.com`
- Password: `password123`

**Organizer Account:**
- Email: `organizer@example.com`
- Password: `password123`

## 📡 Test API Endpoints

### 1. Test Health Endpoint

Open browser: http://localhost:8000/health

### 2. Login as Donor

Go to http://localhost:8000/docs and try the `/api/auth/login` endpoint:

```json
{
  "email": "donor@example.com",
  "password": "password123"
}
```

Copy the `access_token` from the response.

### 3. Get Blood Banks

Try the `/api/blood-banks/` endpoint - no authentication needed!

### 4. Get Your Profile

Use the `/api/donors/me` endpoint with the access token:
1. Click the 🔒 icon at the top right
2. Enter: `Bearer YOUR_ACCESS_TOKEN`
3. Click "Authorize"
4. Try the `/api/donors/me` endpoint

## 🔧 Troubleshooting

### MySQL Connection Error

**Error:** `Can't connect to MySQL server`

**Solution:**
1. Make sure MySQL is running
2. Check your `.env` file has correct credentials
3. Verify database exists: `SHOW DATABASES;` in MySQL

### Import Error: No module named 'app'

**Solution:** Make sure you're in the correct directory:

```bash
cd "red-connect backend"
python run.py
```

### Port Already in Use

**Solution:** Change the port in `run.py`:

```python
uvicorn.run(
    "main:app",
    port=8001,  # Change this
    reload=True
)
```

## 📱 Connect Frontend

To connect your frontend (React/Vue/etc):

1. The backend runs on: `http://localhost:8000`
2. CORS is already configured for `http://localhost:5173` and `http://localhost:3000`
3. Use the API endpoints from http://localhost:8000/docs

Example frontend API call:

```javascript
// Login
const response = await fetch('http://localhost:8000/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'donor@example.com',
    password: 'password123'
  })
});
const data = await response.json();
const token = data.access_token;

// Use token for authenticated requests
const profile = await fetch('http://localhost:8000/api/donors/me', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
```

## 🎉 You're Ready!

Your backend is now running! You can:
- ✅ Register new donors and organizers
- ✅ Login and get JWT tokens
- ✅ Manage blood banks
- ✅ Create and manage events
- ✅ Record donations
- ✅ View statistics

For detailed API documentation, visit: http://localhost:8000/docs

Need help? Check the main README.md for more detailed information!

