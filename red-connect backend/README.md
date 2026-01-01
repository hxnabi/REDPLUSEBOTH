# Red Connect Backend API

A comprehensive FastAPI-based backend system for blood donation management, connecting donors, organizers, and blood banks.

## Features

- 🔐 **User Authentication** - JWT-based authentication for donors and organizers
- 🩸 **Donor Management** - Complete donor profile management with blood type tracking
- 🏥 **Blood Bank Management** - Blood bank listings with inventory management
- 📅 **Event Management** - Blood donation camp/event organization
- 💉 **Donation Tracking** - Complete donation history and certificate generation
- 📊 **Statistics & Analytics** - Real-time stats for donations and events
- 🔍 **Advanced Filtering** - Filter blood banks, events, and donations by location, date, blood type

## Tech Stack

- **Framework**: FastAPI 0.109.0
- **Database**: MySQL with SQLAlchemy ORM
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: Bcrypt
- **Python**: 3.8+

## Project Structure

```
red-connect backend/
├── app/
│   ├── __init__.py
│   ├── auth.py              # Authentication utilities
│   ├── config.py            # Configuration settings
│   ├── database.py          # Database connection
│   ├── models.py            # SQLAlchemy models
│   ├── schemas.py           # Pydantic schemas
│   └── routers/
│       ├── __init__.py
│       ├── auth.py          # Authentication endpoints
│       ├── donors.py        # Donor endpoints
│       ├── organizers.py    # Organizer endpoints
│       ├── blood_banks.py   # Blood bank endpoints
│       ├── donations.py     # Donation endpoints
│       └── events.py        # Event endpoints
├── main.py                  # Application entry point
├── requirements.txt         # Python dependencies
├── .env.example            # Environment variables template
├── .gitignore              # Git ignore rules
└── README.md               # This file
```

## Installation & Setup

### Prerequisites

- Python 3.8 or higher
- MySQL 8.0 or higher
- pip (Python package manager)

### Step 1: Clone the Repository

```bash
cd "red-connect backend"
```

### Step 2: Create Virtual Environment

```bash
# Windows
python -m venv venv
venv\Scripts\activate

# macOS/Linux
python3 -m venv venv
source venv/bin/activate
```

### Step 3: Install Dependencies

```bash
pip install -r requirements.txt
```

### Step 4: Setup MySQL Database

1. Create a MySQL database:

```sql
CREATE DATABASE red_connect CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

2. Create a MySQL user (optional):

```sql
CREATE USER 'red_connect_user'@'localhost' IDENTIFIED BY 'your_secure_password';
GRANT ALL PRIVILEGES ON red_connect.* TO 'red_connect_user'@'localhost';
FLUSH PRIVILEGES;
```

### Step 5: Configure Environment Variables

Create a `.env` file in the project root:

```bash
# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_NAME=red_connect
DB_USER=root
DB_PASSWORD=your_mysql_password

# JWT Configuration
SECRET_KEY=your-super-secret-key-change-this-in-production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# App Configuration
DEBUG=True
```

**Important**: Change the `SECRET_KEY` to a secure random string in production!

To generate a secure secret key:
```bash
python -c "import secrets; print(secrets.token_urlsafe(32))"
```

### Step 6: Initialize Database Tables

The application will automatically create all necessary tables on first run. Just start the server:

```bash
uvicorn main:app --reload
```

## Running the Application

### Development Mode

```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at:
- **API**: http://localhost:8000
- **Interactive Documentation (Swagger UI)**: http://localhost:8000/docs
- **Alternative Documentation (ReDoc)**: http://localhost:8000/redoc

### Production Mode

```bash
uvicorn main:app --host 0.0.0.0 --port 8000 --workers 4
```

## API Endpoints

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/donor/register` | Register a new donor |
| POST | `/api/auth/organizer/register` | Register a new organizer |
| POST | `/api/auth/login` | Login (donor/organizer) |
| GET | `/api/auth/me` | Get current user info |
| POST | `/api/auth/logout` | Logout |

### Donors

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/donors/me` | Get current donor profile |
| PUT | `/api/donors/me` | Update donor profile |
| GET | `/api/donors/{donor_id}` | Get donor by ID |
| GET | `/api/donors/` | List donors (with filters) |

### Organizers

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/organizers/me` | Get current organizer profile |
| PUT | `/api/organizers/me` | Update organizer profile |
| GET | `/api/organizers/{organizer_id}` | Get organizer by ID |
| GET | `/api/organizers/` | List organizers (with filters) |

### Blood Banks

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/blood-banks/` | Create blood bank |
| GET | `/api/blood-banks/` | List blood banks (with filters) |
| GET | `/api/blood-banks/{bank_id}` | Get blood bank by ID |
| PUT | `/api/blood-banks/{bank_id}` | Update blood bank |
| DELETE | `/api/blood-banks/{bank_id}` | Delete blood bank |
| POST | `/api/blood-banks/inventory` | Create/update inventory |
| GET | `/api/blood-banks/inventory/{bank_id}` | Get bank inventory |
| GET | `/api/blood-banks/states/list` | Get list of states |
| GET | `/api/blood-banks/cities/{state}` | Get cities by state |

### Donations

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/donations/` | Create donation record |
| GET | `/api/donations/my-donations` | Get my donations |
| GET | `/api/donations/{donation_id}` | Get donation by ID |
| PUT | `/api/donations/{donation_id}` | Update donation |
| DELETE | `/api/donations/{donation_id}` | Delete donation |
| GET | `/api/donations/` | List all donations (with filters) |
| GET | `/api/donations/stats/summary` | Get donation statistics |

### Events

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/events/` | Create event (organizer) |
| GET | `/api/events/my-events` | Get my events (organizer) |
| GET | `/api/events/` | List all events (with filters) |
| GET | `/api/events/upcoming` | Get upcoming events |
| GET | `/api/events/{event_id}` | Get event by ID |
| PUT | `/api/events/{event_id}` | Update event |
| DELETE | `/api/events/{event_id}` | Delete event |
| POST | `/api/events/{event_id}/register` | Register for event (donor) |
| GET | `/api/events/stats/summary` | Get event statistics |

## Example API Usage

### 1. Register a Donor

```bash
curl -X POST "http://localhost:8000/api/auth/donor/register" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john.doe@example.com",
    "password": "securepass123",
    "full_name": "John Doe",
    "phone": "+919876543210",
    "blood_type": "O+",
    "city": "Mumbai",
    "state": "Maharashtra",
    "weight": 75.5
  }'
```

### 2. Login

```bash
curl -X POST "http://localhost:8000/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john.doe@example.com",
    "password": "securepass123"
  }'
```

Response:
```json
{
  "access_token": "eyJhbGc...",
  "token_type": "bearer",
  "user_id": 1,
  "role": "donor"
}
```

### 3. Get Blood Banks (with filters)

```bash
curl -X GET "http://localhost:8000/api/blood-banks/?state=Maharashtra&blood_type=O+"
```

### 4. Create Donation Record (Authenticated)

```bash
curl -X POST "http://localhost:8000/api/donations/" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "donation_date": "2024-01-15",
    "blood_type": "O+",
    "units": 1.0,
    "notes": "Regular donation"
  }'
```

## Database Models

### User
- Core user authentication model
- Roles: donor, organizer, admin

### Donor
- Personal information
- Blood type
- Medical history
- Donation statistics

### Organizer
- Organization details
- Contact information
- Verification status

### BloodBank
- Location details
- Contact information
- Category (Government/Private)
- Available blood types

### BloodInventory
- Blood type
- Units available
- Last updated

### Event
- Event details
- Date and venue
- Organizer information
- Participant tracking

### Donation
- Donor information
- Blood type and units
- Date and status
- Certificate tracking

## Security Features

- ✅ JWT-based authentication
- ✅ Password hashing with Bcrypt
- ✅ Role-based access control
- ✅ Protected endpoints with authentication middleware
- ✅ CORS configuration for frontend integration

## CORS Configuration

The backend is configured to accept requests from:
- `http://localhost:5173` (Vite default)
- `http://localhost:3000` (React default)

To add more origins, modify the `allow_origins` list in `main.py`:

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://your-frontend-url"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

## Testing

Run the test suite:

```bash
pytest
```

Run with coverage:

```bash
pytest --cov=app tests/
```

## Common Issues & Troubleshooting

### Issue: Database Connection Error

**Solution**: Ensure MySQL is running and credentials in `.env` are correct.

```bash
# Check MySQL status
# Windows
net start MySQL80

# Linux/macOS
sudo systemctl status mysql
```

### Issue: Module Import Errors

**Solution**: Ensure virtual environment is activated and dependencies are installed.

```bash
pip install -r requirements.txt
```

### Issue: CORS Errors

**Solution**: Add your frontend URL to the `allow_origins` list in `main.py`.

## Deployment

### Using Docker (Optional)

Create `Dockerfile`:

```dockerfile
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

Build and run:

```bash
docker build -t red-connect-backend .
docker run -p 8000:8000 red-connect-backend
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Contact & Support

For issues, questions, or contributions, please open an issue on GitHub.

---

Made with ❤️ for Red Connect - Connecting Lives Through Blood Donation

