"""
Database initialization script.
Run this ONLY to populate sample data.
Tables will be automatically created when you start the server!
"""
from app.database import engine, Base, SessionLocal
from app.models import User, Donor, Organizer, BloodBank, BloodInventory, Event, Donation
from sqlalchemy.orm import Session
from app.auth import get_password_hash
from datetime import date, datetime

def create_tables():
    """Create all database tables (Note: This is now done automatically on server startup)."""
    print("Creating database tables...")
    try:
        Base.metadata.create_all(bind=engine)
        print("✅ Tables created successfully!")
    except Exception as e:
        print(f"❌ Error creating tables: {e}")
        print("Please check your MySQL connection settings in .env file")
        return False
    return True

def populate_sample_blood_banks(db: Session):
    """Populate sample blood bank data."""
    print("\nPopulating sample blood banks...")
    
    blood_banks_data = [
        {
            "name": "Acharya-Bhandari Blood Bank",
            "address": "H.No. 46, Arya Street, Srinagar 586007",
            "phone": "+914579646942",
            "email": "xbatta@agate.com",
            "category": "Government",
            "city": "Surat",
            "state": "Gujarat",
            "available_blood_types": "O-, B+, B-, A+, A-",
            "operating_hours": "24/7"
        },
        {
            "name": "Som, Sastry and Shan Blood Bank",
            "address": "22/35, Kannan Ganj, Kottayam 078563",
            "phone": "+912649364286",
            "email": "bhattacharyyajhanvi@shankar-som.biz",
            "category": "Government",
            "city": "Hubli",
            "state": "Karnataka",
            "available_blood_types": "B+, A+, B-, A-",
            "operating_hours": "9 AM - 6 PM"
        },
        {
            "name": "Doctor Ltd Blood Bank",
            "address": "05/17, Sharaf Ganj, Aizawl 634122",
            "phone": "+913833455932",
            "email": "mirayaaurora@atwal-sastry.net",
            "category": "Government",
            "city": "Bhagalpur",
            "state": "Bihar",
            "available_blood_types": "B+, AB+, AB-, A-",
            "operating_hours": "8 AM - 8 PM"
        },
        {
            "name": "Doshi, Ramanathan and D'Alia Blood Bank",
            "address": "H.No. 263, Shroff Nagar, Khammam 185264",
            "phone": "+917233274374",
            "email": "lagan58@verma.com",
            "category": "Private",
            "city": "Hubli",
            "state": "Karnataka",
            "available_blood_types": "A-, B+, O-",
            "operating_hours": "10 AM - 6 PM"
        },
        {
            "name": "Tank-Buch Blood Bank",
            "address": "52/73, Sani Marg, Udaipur 395328",
            "phone": "7544500965",
            "email": "brahmbhattivan@chaudry.biz",
            "category": "Government",
            "city": "Udaipur",
            "state": "Rajasthan",
            "available_blood_types": "B-, O-, AB+, O+",
            "operating_hours": "24/7"
        },
        {
            "name": "Metro City Blood Center",
            "address": "123 Health Ave, Mumbai 400001",
            "phone": "+912233445566",
            "email": "contact@metrocity.org",
            "category": "Private",
            "city": "Mumbai",
            "state": "Maharashtra",
            "available_blood_types": "A+, A-, B+, O+",
            "operating_hours": "7 AM - 10 PM"
        },
        {
            "name": "Central Hospital Blood Bank",
            "address": "45 Medical Lane, Delhi 110001",
            "phone": "+911122334455",
            "email": "info@centralhospital.in",
            "category": "Government",
            "city": "Delhi",
            "state": "Delhi",
            "available_blood_types": "O+, O-, AB+, B-",
            "operating_hours": "24/7"
        },
        {
            "name": "Life Care Blood Services",
            "address": "78 Wellness Road, Bangalore 560001",
            "phone": "+918899776655",
            "email": "help@lifecare.com",
            "category": "Private",
            "city": "Bangalore",
            "state": "Karnataka",
            "available_blood_types": "A+, B+, AB+, O+",
            "operating_hours": "8 AM - 8 PM"
        }
    ]
    
    for bank_data in blood_banks_data:
        blood_bank = BloodBank(**bank_data)
        db.add(blood_bank)
    
    db.commit()
    print(f"✅ Added {len(blood_banks_data)} blood banks!")

def create_sample_user(db: Session):
    """Create a sample donor and organizer for testing."""
    print("\nCreating sample users...")
    
    # Check if users already exist
    existing_donor = db.query(User).filter(User.email == "donor@example.com").first()
    existing_organizer = db.query(User).filter(User.email == "organizer@example.com").first()
    
    if existing_donor:
        print("ℹ️  Sample donor already exists")
    else:
        # Create sample donor
        donor_user = User(
            email="donor@example.com",
            hashed_password=get_password_hash("password123"),
            role="donor"
        )
        db.add(donor_user)
        db.commit()
        db.refresh(donor_user)
        
        donor_profile = Donor(
            user_id=donor_user.id,
            full_name="John Doe",
            phone="+919876543210",
            date_of_birth=date(1995, 5, 15),
            blood_type="O+",
            address="123 Main Street",
            city="Mumbai",
            state="Maharashtra",
            pincode="400001",
            weight=75.0,
            emergency_contact="+919876543211"
        )
        db.add(donor_profile)
        db.commit()
        print("✅ Sample donor created (email: donor@example.com, password: password123)")
    
    if existing_organizer:
        print("ℹ️  Sample organizer already exists")
    else:
        # Create sample organizer
        organizer_user = User(
            email="organizer@example.com",
            hashed_password=get_password_hash("password123"),
            role="organizer"
        )
        db.add(organizer_user)
        db.commit()
        db.refresh(organizer_user)
        
        organizer_profile = Organizer(
            user_id=organizer_user.id,
            organization_name="Red Cross Mumbai",
            contact_person="Jane Smith",
            phone="+919876543220",
            address="456 Health Avenue",
            city="Mumbai",
            state="Maharashtra",
            pincode="400002",
            registration_number="RC-MH-2020-001",
            website="https://redcross-mumbai.org",
            description="Leading blood donation organization in Mumbai",
            verified=True
        )
        db.add(organizer_profile)
        db.commit()
        print("✅ Sample organizer created (email: organizer@example.com, password: password123)")

def main():
    """Main initialization function."""
    print("🏥 Red Connect - Database Sample Data Populator\n")
    print("=" * 50)
    print("\n📌 NOTE: Database tables will be automatically created when you start the server!")
    print("This script is only for adding sample/test data.\n")
    
    # Ask if user wants to populate sample data
    populate = input("Do you want to populate sample data? (yes/no): ").lower().strip()
    
    if populate in ['yes', 'y']:
        # Try to create tables first (in case server hasn't been started yet)
        print("\nChecking database connection...")
        if not create_tables():
            print("\n❌ Cannot connect to database. Please:")
            print("  1. Make sure MySQL is running")
            print("  2. Check your .env file has correct credentials")
            print("  3. Run: CREATE DATABASE red_connect;")
            return
        
        db = SessionLocal()
        try:
            populate_sample_blood_banks(db)
            create_sample_user(db)
            print("\n" + "=" * 50)
            print("✅ Sample data added successfully!")
            print("\nSample Login Credentials:")
            print("  Donor: donor@example.com / password123")
            print("  Organizer: organizer@example.com / password123")
        except Exception as e:
            print(f"\n❌ Error: {e}")
            db.rollback()
        finally:
            db.close()
    else:
        print("\n✅ No sample data added.")
    
    print("\n" + "=" * 50)
    print("To start the server, run:")
    print("  uvicorn main:app --reload")
    print("\nOr double-click: start.bat")
    print("\nAPI Docs will be at: http://localhost:8000/docs")

if __name__ == "__main__":
    main()

