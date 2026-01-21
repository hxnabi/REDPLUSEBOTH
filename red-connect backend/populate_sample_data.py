"""
RED+ Sample Data Population Script
This script populates the database with dummy data for testing the admin dashboard
Run this script: python populate_sample_data.py
"""

from datetime import datetime, timedelta
from app.database import SessionLocal, engine
from app.models import User, Donor, Organizer, Event, BloodBank, Donation, Certificate, BloodInventory
from passlib.context import CryptContext
import random

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def clear_existing_data(db):
    """Clear existing data (optional)"""
    print("⚠️  Clearing existing data...")
    try:
        db.query(Certificate).delete()
        db.query(Donation).delete()
        db.query(BloodInventory).delete()
        db.query(Event).delete()
        db.query(BloodBank).delete()
        db.query(Donor).delete()
        db.query(Organizer).delete()
        # Don't delete admins and their users
        # db.query(Admin).delete()
        # Only delete donor and organizer users
        db.query(User).filter(User.role.in_(['donor', 'organizer'])).delete(synchronize_session=False)
        db.commit()
        print("✅ Existing data cleared!")
    except Exception as e:
        print(f"❌ Error clearing data: {e}")
        db.rollback()

def create_sample_users(db):
    """Create sample donor and organizer users"""
    print("\n📝 Creating users...")
    
    # Default password for all sample users
    default_password = hash_password("password123")
    
    # Donor emails
    donor_emails = [
        'john.doe@example.com',
        'jane.smith@example.com',
        'mike.wilson@example.com',
        'sarah.johnson@example.com',
        'david.brown@example.com',
        'emily.davis@example.com',
        'robert.garcia@example.com',
        'lisa.martinez@example.com',
        'james.rodriguez@example.com',
        'maria.hernandez@example.com'
    ]
    
    # Organizer emails
    organizer_emails = [
        'contact@redcrossindore.org',
        'info@rotaryclubindore.org',
        'admin@lionsclubbhopal.org',
        'events@ngohelping.org',
        'contact@youthforchange.org'
    ]
    
    users = []
    
    # Create donor users
    for email in donor_emails:
        user = User(
            email=email,
            hashed_password=default_password,
            role='donor',
            is_active=True
        )
        db.add(user)
        users.append(user)
    
    # Create organizer users
    for email in organizer_emails:
        user = User(
            email=email,
            hashed_password=default_password,
            role='organizer',
            is_active=True
        )
        db.add(user)
        users.append(user)
    
    db.commit()
    print(f"✅ Created {len(users)} users")
    return users

def create_sample_donors(db):
    """Create sample donors"""
    print("\n💉 Creating donors...")
    
    donor_data = [
        {
            'full_name': 'John Doe',
            'phone': '9876543210',
            'date_of_birth': '1990-05-15',
            'blood_type': 'A+',
            'address': '123 MG Road',
            'city': 'Indore',
            'state': 'Madhya Pradesh',
            'pincode': '452001',
            'last_donation_date': datetime.now() - timedelta(days=45),
            'total_donations': 5,
            'weight': 75.5,
            'hemoglobin': 14.2,
            'gender': 'male',
            'is_active': True
        },
        {
            'full_name': 'Jane Smith',
            'phone': '9876543211',
            'date_of_birth': '1992-08-22',
            'blood_type': 'B+',
            'address': '456 Vijay Nagar',
            'city': 'Indore',
            'state': 'Madhya Pradesh',
            'pincode': '452010',
            'last_donation_date': datetime.now() - timedelta(days=30),
            'total_donations': 3,
            'weight': 62.0,
            'hemoglobin': 13.5,
            'gender': 'female',
            'is_active': True
        },
        {
            'full_name': 'Mike Wilson',
            'phone': '9876543212',
            'date_of_birth': '1988-03-10',
            'blood_type': 'O+',
            'address': '789 Palasia',
            'city': 'Indore',
            'state': 'Madhya Pradesh',
            'pincode': '452001',
            'last_donation_date': datetime.now() - timedelta(days=72),
            'total_donations': 8,
            'weight': 82.0,
            'hemoglobin': 15.0,
            'gender': 'male',
            'is_active': True
        },
        {
            'full_name': 'Sarah Johnson',
            'phone': '9876543213',
            'date_of_birth': '1995-11-30',
            'blood_type': 'AB+',
            'address': '321 Rau',
            'city': 'Indore',
            'state': 'Madhya Pradesh',
            'pincode': '453331',
            'last_donation_date': datetime.now() - timedelta(days=20),
            'total_donations': 2,
            'weight': 58.5,
            'hemoglobin': 13.0,
            'gender': 'female',
            'is_active': True
        },
        {
            'full_name': 'David Brown',
            'phone': '9876543214',
            'date_of_birth': '1987-07-18',
            'blood_type': 'A-',
            'address': '654 Aerodrome Road',
            'city': 'Indore',
            'state': 'Madhya Pradesh',
            'pincode': '452005',
            'last_donation_date': datetime.now() - timedelta(days=107),
            'total_donations': 10,
            'weight': 78.0,
            'hemoglobin': 14.5,
            'gender': 'male',
            'is_active': True
        },
        {
            'full_name': 'Emily Davis',
            'phone': '9876543215',
            'date_of_birth': '1993-01-25',
            'blood_type': 'B-',
            'address': '987 Sapna Sangeeta',
            'city': 'Indore',
            'state': 'Madhya Pradesh',
            'pincode': '452001',
            'last_donation_date': datetime.now() - timedelta(days=33),
            'total_donations': 4,
            'weight': 65.0,
            'hemoglobin': 13.8,
            'gender': 'female',
            'is_active': True
        },
        {
            'full_name': 'Robert Garcia',
            'phone': '9876543216',
            'date_of_birth': '1991-09-12',
            'blood_type': 'O-',
            'address': '147 AB Road',
            'city': 'Indore',
            'state': 'Madhya Pradesh',
            'pincode': '452008',
            'last_donation_date': datetime.now() - timedelta(days=15),
            'total_donations': 6,
            'weight': 80.5,
            'hemoglobin': 14.8,
            'gender': 'male',
            'is_active': True
        },
        {
            'full_name': 'Lisa Martinez',
            'phone': '9876543217',
            'date_of_birth': '1994-04-08',
            'blood_type': 'AB-',
            'address': '258 Scheme 54',
            'city': 'Indore',
            'state': 'Madhya Pradesh',
            'pincode': '452010',
            'last_donation_date': datetime.now() - timedelta(days=61),
            'total_donations': 3,
            'weight': 60.0,
            'hemoglobin': 13.2,
            'gender': 'female',
            'is_active': True
        },
        {
            'full_name': 'James Rodriguez',
            'phone': '9876543218',
            'date_of_birth': '1989-12-20',
            'blood_type': 'A+',
            'address': '369 Bhawarkua',
            'city': 'Indore',
            'state': 'Madhya Pradesh',
            'pincode': '452014',
            'last_donation_date': datetime.now() - timedelta(days=40),
            'total_donations': 7,
            'weight': 76.0,
            'hemoglobin': 14.6,
            'gender': 'male',
            'is_active': True
        },
        {
            'full_name': 'Maria Hernandez',
            'phone': '9876543219',
            'date_of_birth': '1996-06-14',
            'blood_type': 'B+',
            'address': '741 South Tukoganj',
            'city': 'Indore',
            'state': 'Madhya Pradesh',
            'pincode': '452001',
            'last_donation_date': datetime.now() - timedelta(days=25),
            'total_donations': 2,
            'weight': 63.5,
            'hemoglobin': 13.4,
            'gender': 'female',
            'is_active': True
        }
    ]
    
    # Get donor users
    donor_users = db.query(User).filter(User.role == 'donor').all()
    
    donors = []
    for i, data in enumerate(donor_data):
        donor = Donor(
            user_id=donor_users[i].id,
            **data
        )
        db.add(donor)
        donors.append(donor)
    
    db.commit()
    print(f"✅ Created {len(donors)} donors")
    return donors

def create_sample_organizers(db):
    """Create sample organizers"""
    print("\n🏢 Creating organizers...")
    
    organizer_data = [
        {
            'organization_name': 'Indian Red Cross Society - Indore',
            'contact_person': 'Dr. Rajesh Sharma',
            'phone': '0731-2345678',
            'address': '1 Red Cross Road',
            'city': 'Indore',
            'state': 'Madhya Pradesh',
            'pincode': '452001',
            'organization_type': 'ngo',
            'is_verified': True
        },
        {
            'organization_name': 'Rotary Club of Indore',
            'contact_person': 'Mr. Amit Patel',
            'phone': '0731-2456789',
            'address': '45 Rotary Square',
            'city': 'Indore',
            'state': 'Madhya Pradesh',
            'pincode': '452010',
            'organization_type': 'club',
            'is_verified': True
        },
        {
            'organization_name': 'Lions Club Bhopal',
            'contact_person': 'Mrs. Priya Verma',
            'phone': '0755-3456789',
            'address': '78 Lions Street',
            'city': 'Bhopal',
            'state': 'Madhya Pradesh',
            'pincode': '462001',
            'organization_type': 'club',
            'is_verified': True
        },
        {
            'organization_name': 'Helping Hands NGO',
            'contact_person': 'Mr. Suresh Kumar',
            'phone': '0731-4567890',
            'address': '90 Service Lane',
            'city': 'Indore',
            'state': 'Madhya Pradesh',
            'pincode': '452016',
            'organization_type': 'ngo',
            'is_verified': True
        },
        {
            'organization_name': 'Youth for Change',
            'contact_person': 'Ms. Neha Singh',
            'phone': '0731-5678901',
            'address': '12 Youth Plaza',
            'city': 'Indore',
            'state': 'Madhya Pradesh',
            'pincode': '452001',
            'organization_type': 'community',
            'is_verified': True
        }
    ]
    
    # Get organizer users
    organizer_users = db.query(User).filter(User.role == 'organizer').all()
    
    organizers = []
    for i, data in enumerate(organizer_data):
        organizer = Organizer(
            user_id=organizer_users[i].id,
            **data
        )
        db.add(organizer)
        organizers.append(organizer)
    
    db.commit()
    print(f"✅ Created {len(organizers)} organizers")
    return organizers

def create_sample_blood_banks(db):
    """Create sample blood banks"""
    print("\n🏥 Creating blood banks...")
    
    blood_bank_data = [
        {
            'name': 'Choithram Hospital Blood Bank',
            'address': 'Manik Bagh Road, Indore',
            'city': 'Indore',
            'state': 'Madhya Pradesh',
            'pincode': '452014',
            'phone': '0731-2720000',
            'email': 'bloodbank@choithramhospital.com',
            'operating_hours': '24/7'
        },
        {
            'name': 'CHL Hospital Blood Bank',
            'address': 'AB Road, Indore',
            'city': 'Indore',
            'state': 'Madhya Pradesh',
            'pincode': '452008',
            'phone': '0731-4290000',
            'email': 'bloodbank@chlhospitals.com',
            'operating_hours': '24/7'
        },
        {
            'name': 'Bombay Hospital Blood Bank',
            'address': '5 Vijay Nagar, Indore',
            'city': 'Indore',
            'state': 'Madhya Pradesh',
            'pincode': '452010',
            'phone': '0731-2555000',
            'email': 'bloodbank@bombayhospital.com',
            'operating_hours': '8:00 AM - 8:00 PM'
        },
        {
            'name': 'MY Hospital Blood Bank',
            'address': 'MG Road, Indore',
            'city': 'Indore',
            'state': 'Madhya Pradesh',
            'pincode': '452001',
            'phone': '0731-2535555',
            'email': 'bloodbank@myhospital.gov.in',
            'operating_hours': '24/7'
        },
        {
            'name': 'Apollo Hospital Blood Bank',
            'address': 'Scheme 74C, Indore',
            'city': 'Indore',
            'state': 'Madhya Pradesh',
            'pincode': '452010',
            'phone': '0731-4268000',
            'email': 'bloodbank@apolloindore.com',
            'operating_hours': '24/7'
        }
    ]
    
    blood_banks = []
    for data in blood_bank_data:
        blood_bank = BloodBank(**data)
        db.add(blood_bank)
        blood_banks.append(blood_bank)
    
    db.commit()
    print(f"✅ Created {len(blood_banks)} blood banks")
    return blood_banks

def create_sample_events(db, organizers):
    """Create sample events"""
    print("\n📅 Creating events...")
    
    # Upcoming events
    upcoming_events = [
        {
            'organizer_id': organizers[0].id,
            'title': 'Mega Blood Donation Camp 2026',
            'description': 'Join us for the biggest blood donation drive of the year. Save lives, donate blood!',
            'event_date': datetime.now() + timedelta(days=26),
            'start_time': '09:00:00',
            'end_time': '17:00:00',
            'venue': 'Red Cross Headquarters, MG Road',
            'city': 'Indore',
            'state': 'Madhya Pradesh',
            'max_participants': 200,
            'registered_participants': 45,
            'status': 'upcoming'
        },
        {
            'organizer_id': organizers[1].id,
            'title': 'Rotary Blood Drive - February',
            'description': 'Monthly blood donation camp organized by Rotary Club',
            'event_date': datetime.now() + timedelta(days=12),
            'start_time': '10:00:00',
            'end_time': '16:00:00',
            'venue': 'Rotary Bhawan, Vijay Nagar',
            'city': 'Indore',
            'state': 'Madhya Pradesh',
            'max_participants': 150,
            'registered_participants': 32,
            'status': 'upcoming'
        },
        {
            'organizer_id': organizers[2].id,
            'title': 'Corporate Blood Donation Day',
            'description': 'Special blood donation camp for corporate employees',
            'event_date': datetime.now() + timedelta(days=31),
            'start_time': '09:00:00',
            'end_time': '15:00:00',
            'venue': 'TCS Campus, Ring Road',
            'city': 'Indore',
            'state': 'Madhya Pradesh',
            'max_participants': 100,
            'registered_participants': 18,
            'status': 'upcoming'
        }
    ]
    
    # Past events
    past_events = [
        {
            'organizer_id': organizers[0].id,
            'title': 'New Year Blood Donation 2026',
            'description': 'Start the new year by saving lives through blood donation',
            'event_date': datetime.now() - timedelta(days=15),
            'start_time': '09:00:00',
            'end_time': '17:00:00',
            'venue': 'Red Cross Headquarters, MG Road',
            'city': 'Indore',
            'state': 'Madhya Pradesh',
            'max_participants': 180,
            'registered_participants': 165,
            'status': 'completed'
        },
        {
            'organizer_id': organizers[1].id,
            'title': 'Republic Day Blood Camp',
            'description': 'Special blood donation camp on Republic Day',
            'event_date': datetime(2026, 1, 26),
            'start_time': '08:00:00',
            'end_time': '14:00:00',
            'venue': 'District Collectorate',
            'city': 'Indore',
            'state': 'Madhya Pradesh',
            'max_participants': 150,
            'registered_participants': 142,
            'status': 'completed'
        }
    ]
    
    events = []
    for data in upcoming_events + past_events:
        event = Event(**data)
        db.add(event)
        events.append(event)
    
    db.commit()
    print(f"✅ Created {len(events)} events")
    return events

def create_sample_donations(db, donors, events):
    """Create sample donations for completed events"""
    print("\n💉 Creating donations...")
    
    # Get completed events
    completed_events = [e for e in events if e.status == 'completed']
    
    donations = []
    certificates = []
    
    for event in completed_events:
        # Randomly select 5-8 donors for each event
        num_donations = random.randint(5, min(8, len(donors)))
        selected_donors = random.sample(donors, num_donations)
        
        for donor in selected_donors:
            donation = Donation(
                donor_id=donor.id,
                event_id=event.id,
                donation_date=event.event_date,
                blood_type=donor.blood_type,
                units=1,
                status='completed'
            )
            db.add(donation)
            donations.append(donation)
    
    db.commit()
    
    # Create certificates for donations
    for donation in donations:
        cert_num = f"CERT-{datetime.now().year}-{str(donation.id).zfill(4)}"
        certificate = Certificate(
            donation_id=donation.id,
            donor_id=donation.donor_id,
            certificate_number=cert_num,
            issue_date=donation.donation_date,
            blood_units=donation.units,
            blood_type=donation.blood_type,
            status='issued',
            issued_by='RED+ Platform'
        )
        db.add(certificate)
        certificates.append(certificate)
    
    db.commit()
    print(f"✅ Created {len(donations)} donations")
    print(f"✅ Created {len(certificates)} certificates")
    return donations, certificates

def main():
    """Main function to populate database"""
    print("=" * 60)
    print("🩸 RED+ Sample Data Population Script")
    print("=" * 60)
    
    db = SessionLocal()
    
    try:
        # Ask user if they want to clear existing data
        response = input("\n⚠️  Do you want to clear existing data? (yes/no): ")
        if response.lower() == 'yes':
            clear_existing_data(db)
        
        # Create sample data
        users = create_sample_users(db)
        donors = create_sample_donors(db)
        organizers = create_sample_organizers(db)
        blood_banks = create_sample_blood_banks(db)
        events = create_sample_events(db, organizers)
        donations, certificates = create_sample_donations(db, donors, events)
        
        print("\n" + "=" * 60)
        print("✅ SAMPLE DATA CREATED SUCCESSFULLY!")
        print("=" * 60)
        print(f"\n📊 Summary:")
        print(f"   • Users: {len(users)}")
        print(f"   • Donors: {len(donors)}")
        print(f"   • Organizers: {len(organizers)}")
        print(f"   • Blood Banks: {len(blood_banks)}")
        print(f"   • Events: {len(events)}")
        print(f"   • Donations: {len(donations)}")
        print(f"   • Certificates: {len(certificates)}")
        print(f"\n🔑 Login Credentials:")
        print(f"   • All sample users password: password123")
        print(f"   • Donor example: john.doe@example.com")
        print(f"   • Organizer example: contact@redcrossindore.org")
        print("\n🎯 You can now login as admin and see all this data!")
        print("=" * 60)
        
    except Exception as e:
        print(f"\n❌ Error: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    main()


