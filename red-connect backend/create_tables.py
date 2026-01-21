"""
Database Table Creation Script
Run this script to manually create all database tables
"""

from app.database import engine, Base
from app.models import (
    User, 
    Admin,
    Donor, 
    Organizer, 
    BloodBank, 
    BloodInventory,
    BloodBankRevenue,
    Event, 
    Donation, 
    Certificate
)

def create_all_tables():
    """Create all database tables"""
    print("🔄 Creating database tables...")
    print("-" * 50)
    
    try:
        # Import all models to ensure they're registered
        print("📋 Models loaded:")
        print("  ✓ User")
        print("  ✓ Admin")
        print("  ✓ Donor")
        print("  ✓ Organizer")
        print("  ✓ BloodBank")
        print("  ✓ BloodInventory")
        print("  ✓ BloodBankRevenue")
        print("  ✓ Event")
        print("  ✓ Donation")
        print("  ✓ Certificate")
        print("-" * 50)
        
        # Create all tables
        Base.metadata.create_all(bind=engine)
        
        print("\n✅ SUCCESS! All database tables created successfully!")
        print("\n📊 Tables created:")
        print("  • users")
        print("  • admins")
        print("  • donors")
        print("  • organizers")
        print("  • blood_banks")
        print("  • blood_inventory")
        print("  • blood_bank_revenue")
        print("  • events")
        print("  • donations")
        print("  • certificates")
        print("\n🎉 Your database is ready to use!")
        
    except Exception as e:
        print(f"\n❌ ERROR: Failed to create tables")
        print(f"Error message: {e}")
        print("\n💡 Troubleshooting:")
        print("  1. Make sure MySQL is running")
        print("  2. Check your .env file has correct database credentials")
        print("  3. Ensure the database 'redpluse' exists")
        print("  4. Verify MySQL user has proper permissions")

if __name__ == "__main__":
    create_all_tables()

