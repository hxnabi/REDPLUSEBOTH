# Event Participation & Certificate System - Complete Guide

## Overview
This guide explains the complete flow of event participation and certificate issuance in the Red Connect platform.

## 🔄 Complete Flow

### 1. **Event Creation** (Organizer)
Organizers create blood donation events with:
- Event details (title, description, date, time, venue)
- **Maximum participants** capacity
- Location information

### 2. **Event Display** (Public)
Events are displayed publicly showing:
- ✅ Event details and time (in AM/PM format)
- ✅ **Remaining slots** available
- ✅ Registration status (Available/Full)

### 3. **Donor Registration** (Donor)
Donors can join events:
- Click "Join Event" button on event details page
- System checks:
  - ✅ Donor is logged in
  - ✅ Event has available slots
  - ✅ Donor hasn't already registered
- Creates a **SCHEDULED donation** record
- Increments event's **registered_participants** count
- Shows updated **remaining slots**

### 4. **Event Management** (Organizer)
Organizers can manage their events:
- View all registered participants
- See participant details:
  - Donor name
  - Blood type
  - Registration date
  - Current status (Scheduled/Completed)
  - Certificate status

### 5. **Complete Donation** (Organizer)
When a donor actually donates at the event:
- Organizer clicks **"Complete & Issue Certificate"**
- System automatically:
  - ✅ Marks donation as **COMPLETED**
  - ✅ Updates donor's **total_donations** count
  - ✅ Updates donor's **last_donation_date**
  - ✅ Generates unique **certificate number**
  - ✅ Creates **certificate** record with:
    - Certificate number (e.g., CERT-20260108-A1B2C3D4)
    - Issue date
    - Blood units donated
    - Blood type
    - Issued by organization name
    - Status: ISSUED

### 6. **View Certificate** (Donor)
Donors can view their certificates in:
- Dashboard → Certificates tab
- See all certificates with:
  - Certificate number
  - Issue date
  - Blood type and units
  - Issuing organization
  - Download option (when PDF available)

---

## 📌 API Endpoints

### For Donors

#### Join Event
```
POST /api/events/{event_id}/register
Authorization: Bearer {token}
```

**Response:**
```json
{
  "message": "Successfully registered for event",
  "event_id": 1,
  "event_title": "Community Blood Drive",
  "donation_id": 123,
  "event_date": "2026-01-15",
  "remaining_slots": 45
}
```

#### View My Certificates
```
GET /api/certificates/my-certificates
Authorization: Bearer {token}
```

### For Organizers

#### View Event Participants
```
GET /api/events/{event_id}/participants
Authorization: Bearer {token}
```

**Response:**
```json
{
  "event_id": 1,
  "event_title": "Community Blood Drive",
  "total_participants": 5,
  "participants": [
    {
      "donation_id": 123,
      "donor_name": "John Doe",
      "blood_type": "O+",
      "status": "scheduled",
      "donation_date": "2026-01-15",
      "has_certificate": false
    }
  ]
}
```

#### Complete Donation & Issue Certificate
```
POST /api/events/{event_id}/complete-donation/{donation_id}
Authorization: Bearer {token}
```

**Response:**
```json
{
  "message": "Donation completed and certificate issued successfully",
  "donation_id": 123,
  "donor_name": "John Doe",
  "certificate_number": "CERT-20260108-A1B2C3D4"
}
```

---

## 🎯 Features Implemented

### ✅ Event Capacity Management
- Maximum participants setting
- Real-time remaining slots calculation
- Full event prevention (no over-booking)

### ✅ Donor Registration
- One-click event joining
- Duplicate registration prevention
- Automatic donation record creation

### ✅ Participation Tracking
- Scheduled vs Completed status
- Participant list for organizers
- Blood type tracking

### ✅ Certificate System
- Automatic certificate generation
- Unique certificate numbers
- Issue date tracking
- Issuing organization attribution
- Certificate status (Issued/Pending/Revoked)

### ✅ UI/UX Improvements
- Remaining slots display (color-coded)
- Event management dashboard for organizers
- Certificate badge indicators
- One-click completion + certificate issuance

---

## 🚀 Usage Examples

### Example 1: Donor Joins Event

1. Donor browses events at `/events`
2. Sees "Remaining Slots: 45" in green
3. Clicks on event to view details
4. Clicks "Join Event" button
5. Receives confirmation: "Successfully registered for Community Blood Drive. Remaining slots: 44"

### Example 2: Organizer Issues Certificate

1. Organizer logs in to dashboard
2. Views "My Events" tab
3. Clicks "Manage Participants" on an event
4. Sees list of registered donors
5. When donor arrives and donates:
   - Clicks "Complete & Issue Certificate"
   - System marks donation as completed
   - Certificate is instantly generated
6. Donor can now view certificate in their dashboard

### Example 3: Event Gets Full

1. Event has max_participants = 100
2. Currently 99 registered
3. 100th donor joins successfully
4. Next donor sees "Full" status (red badge)
5. "Join Event" button is disabled
6. Message: "Event is full. No more participants can join."

---

## 📊 Database Schema

### Donations Table (Updated)
```sql
- id (Primary Key)
- donor_id (Foreign Key → donors)
- event_id (Foreign Key → events) -- Links donation to event
- donation_date
- blood_type
- units
- status (scheduled/completed/cancelled) -- Track participation
- notes
- created_at
- updated_at
```

### Certificates Table
```sql
- id (Primary Key)
- donation_id (Foreign Key → donations) -- One-to-one
- donor_id (Foreign Key → donors)
- certificate_number (Unique)
- issue_date
- blood_units
- blood_type
- status (pending/issued/revoked)
- certificate_url (PDF link)
- issued_by (Organization name)
- notes
- created_at
- updated_at
```

### Events Table (Updated)
```sql
- id (Primary Key)
- organizer_id (Foreign Key)
- title
- description
- event_date
- start_time
- end_time
- venue
- city
- state
- max_participants -- Capacity limit
- registered_participants -- Current count (auto-updated)
- status (upcoming/ongoing/completed/cancelled)
- created_at
- updated_at
```

---

## 🔐 Security & Validation

### Access Control
- ✅ Only logged-in donors can join events
- ✅ Only event organizers can view participants
- ✅ Only event organizers can issue certificates
- ✅ Donors can only view their own certificates

### Business Rules
- ✅ Cannot join event if full
- ✅ Cannot join same event twice
- ✅ Cannot issue duplicate certificates
- ✅ Certificate automatically created on donation completion

---

## 🎨 Frontend Components

### New Pages
1. **OrganizerEventManagement.tsx**
   - View participants
   - Issue certificates
   - Track completion status
   - Statistics dashboard

### Updated Pages
1. **EventView.tsx**
   - Join event functionality
   - Remaining slots display
   - Full event handling

2. **EventsList.tsx**
   - Remaining slots on cards
   - Color-coded availability

3. **OrganizerDashboard.tsx**
   - "Manage Participants" button
   - Navigation to event management

4. **DonorDashboard.tsx**
   - Certificates tab (already existing)
   - Past events tracking

---

## 🧪 Testing Checklist

- [ ] Create event with max_participants = 5
- [ ] Register 5 different donors
- [ ] Verify remaining slots decreases (5→4→3→2→1→0)
- [ ] Verify 6th donor cannot join (shows "Full")
- [ ] Login as organizer
- [ ] View participants list (should show 5)
- [ ] Complete donation for one participant
- [ ] Verify certificate is created
- [ ] Login as that donor
- [ ] View certificate in dashboard
- [ ] Verify donor's total_donations increased
- [ ] Verify last_donation_date updated

---

## 📝 Notes

- Certificate PDFs can be added later by setting `certificate_url`
- Organizers can bulk-issue certificates by completing multiple donations
- Event status can be updated manually by organizers (upcoming → ongoing → completed)
- Donors receive immediate feedback on registration success
- All dates use consistent formatting throughout the system

---

**Last Updated:** January 8, 2026  
**Version:** 2.1 - Full Event Participation & Certificate System
