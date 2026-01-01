# Certificate Management API Guide

## Overview
The Certificate Management system allows organizers to issue certificates to donors after completed blood donations. Donors can view their certificates and download them.

## Endpoints

### 1. Create Certificate (Organizer/Admin)
**POST** `/api/certificates/`

Create a certificate for a completed blood donation.

**Headers:**
```
Authorization: Bearer {access_token}
Content-Type: application/json
```

**Request Body:**
```json
{
  "donation_id": 1,
  "blood_units": 1.0,
  "blood_type": "O+",
  "issued_by": "Red Cross Blood Bank",
  "notes": "Optional notes about the donation"
}
```

**Response (201 Created):**
```json
{
  "id": 1,
  "donation_id": 1,
  "donor_id": 5,
  "certificate_number": "CERT-20251227-ABC12345",
  "issue_date": "2025-12-27",
  "blood_units": 1.0,
  "blood_type": "O+",
  "status": "issued",
  "certificate_url": null,
  "issued_by": "Red Cross Blood Bank",
  "notes": "Optional notes",
  "created_at": "2025-12-27T10:30:00",
  "updated_at": "2025-12-27T10:30:00"
}
```

**Errors:**
- `403 Forbidden` - User is not an organizer or admin
- `404 Not Found` - Donation not found
- `400 Bad Request` - Certificate already exists for this donation

---

### 2. Get My Certificates (Donor)
**GET** `/api/certificates/my-certificates`

Retrieve all certificates for the current donor.

**Headers:**
```
Authorization: Bearer {access_token}
```

**Query Parameters:** None

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "donation_id": 1,
    "donor_id": 5,
    "certificate_number": "CERT-20251227-ABC12345",
    "issue_date": "2025-12-27",
    "blood_units": 1.0,
    "blood_type": "O+",
    "status": "issued",
    "certificate_url": "https://example.com/certs/cert-1.pdf",
    "issued_by": "Red Cross Blood Bank",
    "notes": null,
    "created_at": "2025-12-27T10:30:00",
    "updated_at": "2025-12-27T10:30:00"
  }
]
```

---

### 3. Get Specific Certificate
**GET** `/api/certificates/{certificate_id}`

Retrieve a specific certificate by ID.

**Headers:**
```
Authorization: Bearer {access_token}
```

**URL Parameters:**
- `certificate_id` (int, required) - ID of the certificate

**Response (200 OK):**
```json
{
  "id": 1,
  "donation_id": 1,
  "donor_id": 5,
  "certificate_number": "CERT-20251227-ABC12345",
  "issue_date": "2025-12-27",
  "blood_units": 1.0,
  "blood_type": "O+",
  "status": "issued",
  "certificate_url": "https://example.com/certs/cert-1.pdf",
  "issued_by": "Red Cross Blood Bank",
  "notes": null,
  "created_at": "2025-12-27T10:30:00",
  "updated_at": "2025-12-27T10:30:00"
}
```

**Errors:**
- `404 Not Found` - Certificate not found
- `403 Forbidden` - Not authorized to view this certificate

---

### 4. Update Certificate (Organizer/Admin)
**PUT** `/api/certificates/{certificate_id}`

Update a certificate's details.

**Headers:**
```
Authorization: Bearer {access_token}
Content-Type: application/json
```

**URL Parameters:**
- `certificate_id` (int, required) - ID of the certificate

**Request Body:**
```json
{
  "status": "issued",
  "certificate_url": "https://example.com/certs/cert-1.pdf",
  "notes": "Updated notes",
  "issued_by": "New Hospital Name"
}
```

**Response (200 OK):**
```json
{
  "id": 1,
  "donation_id": 1,
  "donor_id": 5,
  "certificate_number": "CERT-20251227-ABC12345",
  "issue_date": "2025-12-27",
  "blood_units": 1.0,
  "blood_type": "O+",
  "status": "issued",
  "certificate_url": "https://example.com/certs/cert-1.pdf",
  "issued_by": "New Hospital Name",
  "notes": "Updated notes",
  "created_at": "2025-12-27T10:30:00",
  "updated_at": "2025-12-27T10:35:00"
}
```

**Errors:**
- `403 Forbidden` - User is not an organizer or admin
- `404 Not Found` - Certificate not found

---

### 5. Delete Certificate (Admin)
**DELETE** `/api/certificates/{certificate_id}`

Delete a certificate (admin only).

**Headers:**
```
Authorization: Bearer {access_token}
```

**URL Parameters:**
- `certificate_id` (int, required) - ID of the certificate

**Response (204 No Content)**

**Errors:**
- `403 Forbidden` - User is not an admin
- `404 Not Found` - Certificate not found

---

### 6. Get Donor Certificates (Organizer/Admin)
**GET** `/api/certificates/donor/{donor_id}`

Retrieve all certificates for a specific donor.

**Headers:**
```
Authorization: Bearer {access_token}
```

**URL Parameters:**
- `donor_id` (int, required) - ID of the donor

**Query Parameters:** None

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "donation_id": 1,
    "donor_id": 5,
    "certificate_number": "CERT-20251227-ABC12345",
    "issue_date": "2025-12-27",
    "blood_units": 1.0,
    "blood_type": "O+",
    "status": "issued",
    "certificate_url": "https://example.com/certs/cert-1.pdf",
    "issued_by": "Red Cross Blood Bank",
    "notes": null,
    "created_at": "2025-12-27T10:30:00",
    "updated_at": "2025-12-27T10:30:00"
  }
]
```

**Errors:**
- `403 Forbidden` - Not authorized to view donor certificates

---

### 7. List All Certificates (Organizer/Admin)
**GET** `/api/certificates/`

List all certificates with optional filtering.

**Headers:**
```
Authorization: Bearer {access_token}
```

**Query Parameters:**
- `skip` (int, optional, default: 0) - Number of records to skip
- `limit` (int, optional, default: 10, max: 100) - Number of records to return
- `status` (string, optional) - Filter by status (pending, issued, revoked)

**Example:** 
```
GET /api/certificates/?skip=0&limit=10&status=issued
```

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "donation_id": 1,
    "donor_id": 5,
    "certificate_number": "CERT-20251227-ABC12345",
    "issue_date": "2025-12-27",
    "blood_units": 1.0,
    "blood_type": "O+",
    "status": "issued",
    "certificate_url": "https://example.com/certs/cert-1.pdf",
    "issued_by": "Red Cross Blood Bank",
    "notes": null,
    "created_at": "2025-12-27T10:30:00",
    "updated_at": "2025-12-27T10:30:00"
  }
]
```

**Errors:**
- `403 Forbidden` - User is not an organizer or admin

---

## Certificate Statuses

- **pending**: Certificate has been created but not yet issued
- **issued**: Certificate has been issued and is available for download
- **revoked**: Certificate has been revoked and is no longer valid

---

## Integration Examples

### Example 1: Donor Views Their Certificates

```python
import requests

token = "your_access_token"
headers = {
    "Authorization": f"Bearer {token}",
    "Content-Type": "application/json"
}

response = requests.get(
    "http://localhost:8000/api/certificates/my-certificates",
    headers=headers
)

certificates = response.json()
for cert in certificates:
    print(f"Certificate {cert['certificate_number']} - {cert['blood_type']}")
```

### Example 2: Organizer Issues a Certificate

```python
import requests

token = "your_access_token"
headers = {
    "Authorization": f"Bearer {token}",
    "Content-Type": "application/json"
}

data = {
    "donation_id": 1,
    "blood_units": 1.0,
    "blood_type": "O+",
    "issued_by": "Red Cross Blood Bank",
    "notes": "Donation completed successfully"
}

response = requests.post(
    "http://localhost:8000/api/certificates/",
    headers=headers,
    json=data
)

certificate = response.json()
print(f"Certificate created: {certificate['certificate_number']}")
```

### Example 3: Update Certificate with PDF URL

```python
import requests

token = "your_access_token"
cert_id = 1
headers = {
    "Authorization": f"Bearer {token}",
    "Content-Type": "application/json"
}

data = {
    "status": "issued",
    "certificate_url": "https://example.com/certs/CERT-20251227-ABC12345.pdf"
}

response = requests.put(
    f"http://localhost:8000/api/certificates/{cert_id}",
    headers=headers,
    json=data
)

certificate = response.json()
print(f"Certificate updated: {certificate['status']}")
```

---

## Database Schema

### Certificates Table

```sql
CREATE TABLE certificates (
    id INT PRIMARY KEY AUTO_INCREMENT,
    donation_id INT UNIQUE NOT NULL,
    donor_id INT NOT NULL,
    certificate_number VARCHAR(100) UNIQUE NOT NULL,
    issue_date DATE NOT NULL,
    blood_units FLOAT NOT NULL,
    blood_type ENUM(...) NOT NULL,
    status ENUM('pending', 'issued', 'revoked') DEFAULT 'pending',
    certificate_url VARCHAR(255),
    issued_by VARCHAR(255) NOT NULL,
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (donation_id) REFERENCES donations(id),
    FOREIGN KEY (donor_id) REFERENCES donors(id)
);
```

---

## Error Responses

All error responses follow this format:

```json
{
  "detail": "Error message describing what went wrong"
}
```

Common HTTP Status Codes:
- `200 OK` - Request succeeded
- `201 Created` - Resource created successfully
- `204 No Content` - Resource deleted successfully
- `400 Bad Request` - Invalid request data
- `403 Forbidden` - User lacks permission
- `404 Not Found` - Resource not found
- `500 Internal Server Error` - Server error

---

## Best Practices

1. **Certificate Generation**: Always generate certificates after marking donations as completed
2. **PDF Storage**: Store certificate PDFs in a secure location and update the `certificate_url` field
3. **Donor Privacy**: Ensure donors can only view their own certificates
4. **Audit Trail**: Keep track of certificate creation and updates for compliance
5. **Notification**: Send email notifications to donors when their certificate is issued
6. **Validation**: Always validate donation records before issuing certificates
