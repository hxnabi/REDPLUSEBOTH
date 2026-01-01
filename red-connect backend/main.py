from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import Response
from app.database import engine
from app.models import Base
from app.routers import auth, donors, organizers, blood_banks, donations, events, certificates
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="Red Connect API",
    description="Blood Donation Management System API",
    version="1.0.0"
)

# Configure CORS FIRST - Must be before any routes
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:3000",
        "http://localhost:8080",
        "http://localhost:8081",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:8080",
        "http://127.0.0.1:8081",
        "http://localhost:8000",
        "https://localhost:5173",
        "https://localhost:3000",
    ],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH", "HEAD"],
    allow_headers=["Content-Type", "Authorization", "Accept", "*"],
    expose_headers=["*"],
    max_age=7200,  # Cache preflight for 2 hours
)

# Create database tables automatically on startup
@app.on_event("startup")
async def startup_event():
    """Create database tables on application startup."""
    try:
        logger.info("Creating database tables...")
        Base.metadata.create_all(bind=engine)
        logger.info("✅ Database tables created successfully!")
    except Exception as e:
        logger.error(f"❌ Database connection failed: {e}")
        logger.warning("⚠️ Server will start but database endpoints won't work until MySQL is configured.")
        logger.warning("Please check your .env file and ensure MySQL is running.")

# Add explicit OPTIONS handler for CORS preflight
@app.options("/{full_path:path}")
async def preflight_handler(full_path: str) -> Response:
    """Handle CORS preflight requests."""
    return Response(
        status_code=200,
        headers={
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS, PATCH",
            "Access-Control-Allow-Headers": "Content-Type, Authorization",
        },
    )

# Include routers
app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(donors.router, prefix="/api/donors", tags=["Donors"])
app.include_router(organizers.router, prefix="/api/organizers", tags=["Organizers"])
app.include_router(blood_banks.router, prefix="/api/blood-banks", tags=["Blood Banks"])
app.include_router(donations.router, prefix="/api/donations", tags=["Donations"])
app.include_router(events.router, prefix="/api/events", tags=["Events"])
app.include_router(certificates.router, prefix="/api/certificates", tags=["Certificates"])

@app.get("/")
def read_root():
    return {
        "message": "Welcome to Red Connect API",
        "version": "1.0.0",
        "docs": "/docs"
    }

@app.get("/health")
def health_check():
    return {"status": "healthy"}

