"""
Sample Data Population Script
Run this after starting the backend to add sample data
"""
import sys
from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from app.database import SessionLocal, engine
from app.models import (
    Base, User, Admin, Donor, Organizer, BloodBank, 
    BloodInventory, Event, Donation, Certificate,
    UserRole, BloodType, BloodComponent, EventStatus, DonationStatus
)
from app.auth import get_password_hash


def populate_data():
    db = SessionLocal()
    
    try:
        print("Starting sample data population...")
        
        # ========== ADMIN ==========
        print("Creating Admin...")
        admin_user = User(
            email="admin@redconnect.com",
            hashed_password=get_password_hash("Admin@123"),
            role=UserRole.ADMIN,
            is_active=True,
            created_at=datetime.utcnow()
        )
        db.add(admin_user)
        db.flush()
        
        admin = Admin(
            user_id=admin_user.id,
            full_name="System Administrator",
            phone="9999999999"
        )
        db.add(admin)
        
        # ========== ORGANIZERS ==========
        print("Creating Organizers...")
        org1_user = User(
            email="organizer1@hospital.com",
            hashed_password=get_password_hash("Org@123"),
            role=UserRole.ORGANIZER,
            is_active=True,
            created_at=datetime.utcnow()
        )
        db.add(org1_user)
        db.flush()
        
        organizer1 = Organizer(
            user_id=org1_user.id,
            organization_name="City General Hospital",
            contact_person="Dr. Rajesh Kumar",
            phone="9876543210",
            address="123 MG Road, Mumbai",
            city="Mumbai",
            state="Maharashtra",
            pincode="400001"
        )
        db.add(organizer1)
        
        org2_user = User(
            email="organizer2@ngo.org",
            hashed_password=get_password_hash("Org@123"),
            role=UserRole.ORGANIZER,
            is_active=True,
            created_at=datetime.utcnow()
        )
        db.add(org2_user)
        db.flush()
        
        organizer2 = Organizer(
            user_id=org2_user.id,
            organization_name="Red Cross Delhi",
            contact_person="Priya Sharma",
            phone="9876543211",
            address="456 Connaught Place, Delhi",
            city="New Delhi",
            state="Delhi",
            pincode="110001"
        )
        db.add(organizer2)
        
        # ========== DONORS ==========
        print("Creating Donors...")
        donor1_user = User(
            email="donor1@gmail.com",
            hashed_password=get_password_hash("Donor@123"),
            role=UserRole.DONOR,
            is_active=True,
            created_at=datetime.utcnow()
        )
        db.add(donor1_user)
        db.flush()
        
        donor1 = Donor(
            user_id=donor1_user.id,
            full_name="Amit Verma",
            phone="9123456780",
            blood_type=BloodType.A_POSITIVE,
            date_of_birth=datetime(1995, 5, 15),
            gender="Male",
            address="789 Park Street, Kolkata",
            city="Kolkata",
            state="West Bengal",
            pincode="700016",
            last_donation_date=datetime.utcnow() - timedelta(days=120),
            total_donations=5
        )
        db.add(donor1)
        
        donor2_user = User(
            email="donor2@gmail.com",
            hashed_password=get_password_hash("Donor@123"),
            role=UserRole.DONOR,
            is_active=True,
            created_at=datetime.utcnow()
        )
        db.add(donor2_user)
        db.flush()
        
        donor2 = Donor(
            user_id=donor2_user.id,
            full_name="Sneha Patel",
            phone="9123456781",
            blood_type=BloodType.O_NEGATIVE,
            date_of_birth=datetime(1992, 8, 20),
            gender="Female",
            address="321 MG Road, Bangalore",
            city="Bangalore",
            state="Karnataka",
            pincode="560001",
            last_donation_date=datetime.utcnow() - timedelta(days=90),
            total_donations=8
        )
        db.add(donor2)
        
        donor3_user = User(
            email="donor3@gmail.com",
            hashed_password=get_password_hash("Donor@123"),
            role=UserRole.DONOR,
            is_active=True,
            created_at=datetime.utcnow()
        )
        db.add(donor3_user)
        db.flush()
        
        donor3 = Donor(
            user_id=donor3_user.id,
            full_name="Rahul Singh",
            phone="9123456782",
            blood_type=BloodType.B_POSITIVE,
            date_of_birth=datetime(1998, 3, 10),
            gender="Male",
            address="654 Anna Salai, Chennai",
            city="Chennai",
            state="Tamil Nadu",
            pincode="600002",
            last_donation_date=datetime.utcnow() - timedelta(days=60),
            total_donations=3
        )
        db.add(donor3)
        
        db.flush()
        
        # ========== BLOOD BANKS ==========
        print("Creating Blood Banks...")
        bb1 = BloodBank(
            name="Mumbai Central Blood Bank",
            category="Government",
            address="12 Dr. Annie Besant Road, Worli",
            city="Mumbai",
            state="Maharashtra",
            pincode="400018",
            phone="02224938888",
            email="mumbai.bb@gov.in",
            operating_hours="24/7",
            latitude=19.0176,
            longitude=72.8561
        )
        db.add(bb1)
        
        bb2 = BloodBank(
            name="Delhi State Blood Transfusion Council",
            category="Government",
            address="Rajpur Road, Civil Lines",
            city="New Delhi",
            state="Delhi",
            pincode="110054",
            phone="01123817102",
            email="delhi.bb@gov.in",
            operating_hours="9:00 AM - 6:00 PM",
            latitude=28.7041,
            longitude=77.1025
        )
        db.add(bb2)
        
        bb3 = BloodBank(
            name="Bangalore Medical College Blood Bank",
            category="Government",
            address="Fort, KR Road",
            city="Bangalore",
            state="Karnataka",
            pincode="560002",
            phone="08026700001",
            email="blr.bb@gov.in",
            operating_hours="8:00 AM - 8:00 PM",
            latitude=12.9716,
            longitude=77.5946
        )
        db.add(bb3)
        
        bb4 = BloodBank(
            name="Chennai Rotary Blood Bank",
            category="Private",
            address="Kilpauk Garden Road",
            city="Chennai",
            state="Tamil Nadu",
            pincode="600010",
            phone="04426441526",
            email="chennai.rbb@rotary.org",
            operating_hours="24/7",
            latitude=13.0827,
            longitude=80.2707
        )
        db.add(bb4)
        
        bb5 = BloodBank(
            name="Kolkata Red Cross Blood Bank",
            category="Private",
            address="7 Red Cross Place",
            city="Kolkata",
            state="West Bengal",
            pincode="700001",
            phone="03322521616",
            email="kolkata.rc@redcross.in",
            operating_hours="9:00 AM - 5:00 PM",
            latitude=22.5726,
            longitude=88.3639
        )
        db.add(bb5)
        
        db.flush()
        
        # ========== BLOOD INVENTORY ==========
        print("Creating Blood Inventory...")
        blood_types = [BloodType.A_POSITIVE, BloodType.A_NEGATIVE, BloodType.B_POSITIVE, 
                       BloodType.B_NEGATIVE, BloodType.O_POSITIVE, BloodType.O_NEGATIVE, 
                       BloodType.AB_POSITIVE, BloodType.AB_NEGATIVE]
        
        components = [
            BloodComponent.WHOLE_BLOOD,
            BloodComponent.PACKED_RED_CELLS,
            BloodComponent.PLATELETS,
            BloodComponent.FRESH_FROZEN_PLASMA,
            BloodComponent.CRYOPRECIPITATE
        ]
        
        blood_banks = [bb1, bb2, bb3, bb4, bb5]
        
        for bb in blood_banks:
            for blood_type in blood_types:
                for component in components:
                    inventory = BloodInventory(
                        blood_bank_id=bb.id,
                        blood_type=blood_type,
                        blood_component=component,
                        units_available=float(5 + (hash(f"{bb.id}{blood_type}{component}") % 50)),
                        last_updated=datetime.utcnow()
                    )
                    db.add(inventory)
        
        db.flush()
        
        # ========== EVENTS ==========
        print("Creating Events...")
        event1 = Event(
            organizer_id=organizer1.id,
            title="Blood Donation Camp - Mumbai",
            description="Mega blood donation drive organized by City General Hospital",
            event_date=datetime.utcnow() + timedelta(days=7),
            start_time="09:00",
            end_time="17:00",
            venue="City General Hospital Main Hall, 123 MG Road, Mumbai",
            city="Mumbai",
            state="Maharashtra",
            max_participants=100,
            registered_participants=45,
            status=EventStatus.UPCOMING
        )
        db.add(event1)
        
        event2 = Event(
            organizer_id=organizer2.id,
            title="World Blood Donor Day Camp",
            description="Special camp on World Blood Donor Day",
            event_date=datetime.utcnow() + timedelta(days=14),
            start_time="10:00",
            end_time="16:00",
            venue="Red Cross Community Center, 456 Connaught Place, Delhi",
            city="New Delhi",
            state="Delhi",
            max_participants=150,
            registered_participants=80,
            status=EventStatus.UPCOMING
        )
        db.add(event2)
        
        event3 = Event(
            organizer_id=organizer1.id,
            title="Corporate Blood Donation Drive",
            description="Blood donation camp for corporate employees",
            event_date=datetime.utcnow() - timedelta(days=30),
            start_time="11:00",
            end_time="15:00",
            venue="Tech Park Auditorium, Electronic City, Bangalore",
            city="Bangalore",
            state="Karnataka",
            max_participants=75,
            registered_participants=75,
            status=EventStatus.COMPLETED
        )
        db.add(event3)
        
        db.flush()
        
        # ========== DONATIONS ==========
        print("Creating Donations...")
        donation1 = Donation(
            donor_id=donor1.id,
            event_id=event3.id,
            donation_date=datetime.utcnow() - timedelta(days=120),
            blood_type=BloodType.A_POSITIVE,
            units=1.0,
            status=DonationStatus.COMPLETED,
            notes="Successful donation, no complications"
        )
        db.add(donation1)
        
        donation2 = Donation(
            donor_id=donor2.id,
            event_id=event3.id,
            donation_date=datetime.utcnow() - timedelta(days=90),
            blood_type=BloodType.O_NEGATIVE,
            units=1.0,
            status=DonationStatus.COMPLETED,
            notes="Excellent condition, regular donor"
        )
        db.add(donation2)
        
        donation3 = Donation(
            donor_id=donor3.id,
            donation_date=datetime.utcnow() - timedelta(days=60),
            blood_type=BloodType.B_POSITIVE,
            units=1.0,
            status=DonationStatus.COMPLETED,
            notes="Walk-in donation, first-time donor"
        )
        db.add(donation3)
        
        donation4 = Donation(
            donor_id=donor1.id,
            event_id=event1.id,
            donation_date=datetime.utcnow() + timedelta(days=7),
            blood_type=BloodType.A_POSITIVE,
            units=1.0,
            status=DonationStatus.SCHEDULED,
            notes="Registered for upcoming camp"
        )
        db.add(donation4)
        
        db.flush()
        
        # ========== CERTIFICATES ==========
        print("Creating Certificates...")
        cert1 = Certificate(
            donation_id=donation1.id,
            donor_id=donor1.id,
            certificate_number="CERT-2024-001",
            issue_date=datetime.utcnow() - timedelta(days=120),
            blood_units=1.0,
            blood_type=BloodType.A_POSITIVE,
            issued_by="City General Hospital",
            status="ISSUED"
        )
        db.add(cert1)
        
        cert2 = Certificate(
            donation_id=donation2.id,
            donor_id=donor2.id,
            certificate_number="CERT-2024-002",
            issue_date=datetime.utcnow() - timedelta(days=90),
            blood_units=1.0,
            blood_type=BloodType.O_NEGATIVE,
            issued_by="Red Cross Delhi",
            status="ISSUED"
        )
        db.add(cert2)
        
        cert3 = Certificate(
            donation_id=donation3.id,
            donor_id=donor3.id,
            certificate_number="CERT-2024-003",
            issue_date=datetime.utcnow() - timedelta(days=60),
            blood_units=1.0,
            blood_type=BloodType.B_POSITIVE,
            issued_by="Bangalore Medical College",
            status="ISSUED"
        )
        db.add(cert3)
        
        db.commit()
        
        print("\n" + "="*60)
        print("SAMPLE DATA CREATED SUCCESSFULLY!")
        print("="*60)
        print("\nLOGIN CREDENTIALS:\n")
        print("ADMIN:")
        print("   Email: admin@redconnect.com")
        print("   Password: Admin@123")
        print("\nORGANIZER 1:")
        print("   Email: organizer1@hospital.com")
        print("   Password: Org@123")
        print("   Organization: City General Hospital")
        print("\nORGANIZER 2:")
        print("   Email: organizer2@ngo.org")
        print("   Password: Org@123")
        print("   Organization: Red Cross Delhi")
        print("\nDONOR 1:")
        print("   Email: donor1@gmail.com")
        print("   Password: Donor@123")
        print("   Name: Amit Verma (A+)")
        print("\nDONOR 2:")
        print("   Email: donor2@gmail.com")
        print("   Password: Donor@123")
        print("   Name: Sneha Patel (O-)")
        print("\nDONOR 3:")
        print("   Email: donor3@gmail.com")
        print("   Password: Donor@123")
        print("   Name: Rahul Singh (B+)")
        print("\n" + "="*60)
        print("DATA SUMMARY:")
        print("="*60)
        print(f"   1 Admin")
        print(f"   2 Organizers")
        print(f"   3 Donors")
        print(f"   5 Blood Banks")
        print(f"   {len(blood_types) * len(components) * len(blood_banks)} Blood Inventory Records")
        print(f"   3 Events (2 Upcoming, 1 Completed)")
        print(f"   4 Donations (3 Completed, 1 Scheduled)")
        print(f"   3 Certificates")
        print("="*60 + "\n")
        
    except Exception as e:
        print(f"ERROR: {e}")
        db.rollback()
        raise
    finally:
        db.close()


if __name__ == "__main__":
    import sys
    
    # Check if --yes flag is provided
    if "--yes" in sys.argv or "-y" in sys.argv:
        populate_data()
    else:
        print("WARNING: This will add sample data to your database!")
        print("Make sure your backend is running and tables are created.\n")
        
        response = input("Continue? (yes/no): ")
        if response.lower() == "yes":
            populate_data()
        else:
            print("Cancelled")

