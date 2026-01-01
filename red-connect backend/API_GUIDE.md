# Red Connect API Guide

## 🎯 Quick Reference

**Base URL:** `http://localhost:8000`  
**API Docs:** `http://localhost:8000/docs`  
**Authentication:** JWT Bearer Token

---

## 📋 Complete Endpoint List

### ✅ Public Endpoints (No Authentication Required)

#### Health & Info
```http
GET  /                    # API welcome message
GET  /health              # Health check
```

#### Authentication
```http
POST /api/auth/donor/register      # Register new donor
POST /api/auth/organizer/register  # Register new organizer
POST /api/auth/login               # Login (returns JWT token)
```

#### Blood Banks (Public Access)
```http
GET  /api/blood-banks/                    # List all blood banks
GET  /api/blood-banks/{bank_id}           # Get blood bank details
GET  /api/blood-banks/states/list         # Get list of states
GET  /api/blood-banks/cities/{state}      # Get cities by state
GET  /api/blood-banks/inventory/{bank_id} # Get bank inventory
```

#### Events (Public Access)
```http
GET  /api/events/                 # List all events
GET  /api/events/upcoming         # Get upcoming events
GET  /api/events/{event_id}       # Get event details
GET  /api/events/stats/summary    # Event statistics
```

---

### 🔒 Protected Endpoints (Authentication Required)

#### User Profile
```http
GET  /api/auth/me          # Get current user info
POST /api/auth/logout      # Logout
```

#### Donor Endpoints (Donor Role Required)
```http
GET  /api/donors/me                # Get my profile
PUT  /api/donors/me                # Update my profile
GET  /api/donors/{donor_id}        # Get donor by ID
GET  /api/donors/                  # List donors (with filters)

# Donations
POST   /api/donations/             # Create donation record
GET    /api/donations/my-donations # Get my donations
GET    /api/donations/{id}         # Get donation details
PUT    /api/donations/{id}         # Update donation
DELETE /api/donations/{id}         # Delete donation
GET    /api/donations/             # List all donations
GET    /api/donations/stats/summary # Donation statistics

# Event Registration
POST /api/events/{event_id}/register # Register for event
```

#### Organizer Endpoints (Organizer Role Required)
```http
GET  /api/organizers/me                  # Get my profile
PUT  /api/organizers/me                  # Update my profile
GET  /api/organizers/{organizer_id}      # Get organizer by ID
GET  /api/organizers/                    # List organizers

# Event Management
POST   /api/events/              # Create new event
GET    /api/events/my-events     # Get my events
PUT    /api/events/{event_id}    # Update event
DELETE /api/events/{event_id}    # Delete event
```

#### Admin Endpoints (Admin Role Required)
```http
# Blood Bank Management
POST   /api/blood-banks/           # Create blood bank
PUT    /api/blood-banks/{id}       # Update blood bank
DELETE /api/blood-banks/{id}       # Delete blood bank

# Inventory Management
POST /api/blood-banks/inventory    # Create/update inventory
PUT  /api/blood-banks/inventory/{id} # Update inventory units
```

---

## 🔐 Authentication Flow

### 1. Register a New User

**Donor Registration:**
```javascript
POST /api/auth/donor/register
{
  "email": "john@example.com",
  "password": "securepass123",
  "full_name": "John Doe",
  "phone": "+919876543210",
  "blood_type": "O+",
  "date_of_birth": "1995-05-15",
  "city": "Mumbai",
  "state": "Maharashtra",
  "weight": 75.5
}
```

**Organizer Registration:**
```javascript
POST /api/auth/organizer/register
{
  "email": "org@example.com",
  "password": "securepass123",
  "organization_name": "Red Cross Mumbai",
  "contact_person": "Jane Smith",
  "phone": "+919876543220",
  "city": "Mumbai",
  "state": "Maharashtra"
}
```

### 2. Login

```javascript
POST /api/auth/login
{
  "email": "john@example.com",
  "password": "securepass123"
}

// Response:
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer",
  "user_id": 1,
  "role": "donor"
}
```

### 3. Use Token for Protected Endpoints

Add the token to your request headers:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## 📝 Common Use Cases

### Use Case 1: Find Blood Banks

**Search by state and blood type:**
```http
GET /api/blood-banks/?state=Maharashtra&blood_type=O+
```

**Filter by city and category:**
```http
GET /api/blood-banks/?city=Mumbai&category=Government
```

**Pagination:**
```http
GET /api/blood-banks/?skip=0&limit=10
```

### Use Case 2: Donor Records Donation

```javascript
// 1. Login first
POST /api/auth/login
{ "email": "donor@example.com", "password": "password123" }

// 2. Create donation record
POST /api/donations/
Headers: { "Authorization": "Bearer YOUR_TOKEN" }
Body: {
  "donation_date": "2024-01-15",
  "blood_type": "O+",
  "units": 1.0,
  "notes": "Regular donation at City Hospital"
}

// 3. View all my donations
GET /api/donations/my-donations
Headers: { "Authorization": "Bearer YOUR_TOKEN" }
```

### Use Case 3: Organizer Creates Event

```javascript
// 1. Login as organizer
POST /api/auth/login
{ "email": "organizer@example.com", "password": "password123" }

// 2. Create blood donation camp
POST /api/events/
Headers: { "Authorization": "Bearer YOUR_TOKEN" }
Body: {
  "title": "Blood Donation Camp 2024",
  "description": "Annual blood donation drive",
  "event_date": "2024-02-15",
  "start_time": "09:00",
  "end_time": "17:00",
  "venue": "Community Hall, Mumbai",
  "city": "Mumbai",
  "state": "Maharashtra",
  "max_participants": 100
}

// 3. View my events
GET /api/events/my-events
Headers: { "Authorization": "Bearer YOUR_TOKEN" }
```

### Use Case 4: Donor Registers for Event

```javascript
// Find upcoming events
GET /api/events/upcoming?city=Mumbai

// Register for specific event
POST /api/events/5/register
Headers: { "Authorization": "Bearer YOUR_TOKEN" }
```

---

## 🔍 Query Parameters

### Blood Banks
- `state` - Filter by state (e.g., Maharashtra)
- `city` - Filter by city (e.g., Mumbai)
- `blood_type` - Filter by available blood type (e.g., O+)
- `category` - Filter by category (Government/Private)
- `skip` - Number of records to skip (pagination)
- `limit` - Number of records to return (default: 10, max: 100)

### Events
- `status` - Filter by status (upcoming/ongoing/completed/cancelled)
- `city` - Filter by city
- `state` - Filter by state
- `from_date` - Filter events from this date (YYYY-MM-DD)
- `to_date` - Filter events until this date (YYYY-MM-DD)
- `skip` - Pagination offset
- `limit` - Pagination limit

### Donations
- `status` - Filter by status (scheduled/completed/cancelled)
- `from_date` - Filter donations from this date
- `to_date` - Filter donations until this date
- `skip` - Pagination offset
- `limit` - Pagination limit

---

## 📊 Response Status Codes

| Code | Meaning | When |
|------|---------|------|
| 200 | OK | Successful GET, PUT, PATCH |
| 201 | Created | Successful POST |
| 204 | No Content | Successful DELETE |
| 400 | Bad Request | Invalid input data |
| 401 | Unauthorized | Missing or invalid token |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Resource doesn't exist |
| 422 | Validation Error | Pydantic validation failed |
| 500 | Server Error | Internal server error |

---

## 🧪 Testing with cURL

### Register and Login
```bash
# Register donor
curl -X POST http://localhost:8000/api/auth/donor/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"pass123","full_name":"Test User","blood_type":"O+","phone":"+919999999999","city":"Mumbai","state":"Maharashtra"}'

# Login
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"pass123"}'
```

### Protected Endpoints
```bash
# Get my profile (replace TOKEN with actual token)
curl -X GET http://localhost:8000/api/donors/me \
  -H "Authorization: Bearer TOKEN"

# Create donation
curl -X POST http://localhost:8000/api/donations/ \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"donation_date":"2024-01-15","blood_type":"O+","units":1.0}'
```

---

## 🎨 Frontend Integration Examples

### React/Vue/Angular Example

```javascript
// API Service
const API_BASE = 'http://localhost:8000';

// Login function
async function login(email, password) {
  const response = await fetch(`${API_BASE}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  
  if (!response.ok) throw new Error('Login failed');
  
  const data = await response.json();
  // Store token in localStorage/sessionStorage
  localStorage.setItem('token', data.access_token);
  localStorage.setItem('role', data.role);
  return data;
}

// Get blood banks
async function getBloodBanks(filters = {}) {
  const params = new URLSearchParams(filters);
  const response = await fetch(`${API_BASE}/api/blood-banks/?${params}`);
  return await response.json();
}

// Create donation (authenticated)
async function createDonation(donationData) {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_BASE}/api/donations/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(donationData)
  });
  
  if (!response.ok) throw new Error('Failed to create donation');
  return await response.json();
}

// Get my profile (authenticated)
async function getMyProfile() {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');
  const endpoint = role === 'donor' ? '/api/donors/me' : '/api/organizers/me';
  
  const response = await fetch(`${API_BASE}${endpoint}`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  
  if (!response.ok) throw new Error('Failed to fetch profile');
  return await response.json();
}
```

---

## 🐛 Debugging Tips

### Check if server is running
```bash
curl http://localhost:8000/health
```

### Test authentication
```bash
# Should return 401 Unauthorized
curl http://localhost:8000/api/donors/me

# Should work with valid token
curl -H "Authorization: Bearer YOUR_TOKEN" http://localhost:8000/api/donors/me
```

### View detailed error messages
Check the server console/logs for detailed error stack traces.

### Common Issues

**Issue: 401 Unauthorized**
- Token expired (default: 30 minutes)
- Token not included in header
- Invalid token format (must be: `Bearer <token>`)

**Issue: 403 Forbidden**
- Wrong role (e.g., donor trying to access organizer endpoint)
- Check the endpoint's role requirements

**Issue: 422 Validation Error**
- Check request body matches the schema
- Ensure all required fields are provided
- Verify data types (e.g., date format: YYYY-MM-DD)

---

## 📚 Additional Resources

- **Interactive API Docs:** http://localhost:8000/docs
- **Alternative Docs:** http://localhost:8000/redoc
- **Setup Guide:** See SETUP.md
- **Full Documentation:** See README.md

---

Made with ❤️ for Red Connect

