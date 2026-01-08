"""
Database migration script for adding new fields.
Run this to update your existing database with new fields.
"""
from sqlalchemy import text
from app.database import engine

def run_migrations():
    """Run database migrations to add new fields."""
    print("Running database migrations...")
    
    migrations = [
        # Add new fields to donors table
        ("ALTER TABLE donors ADD COLUMN hemoglobin FLOAT", "Add hemoglobin to donors"),
        ("ALTER TABLE donors ADD COLUMN gender VARCHAR(10)", "Add gender to donors"),
        
        # Add new field to organizers table
        ("ALTER TABLE organizers ADD COLUMN street_address TEXT", "Add street_address to organizers"),
        
        # Create blood_bank_revenue table if not exists
        ("""CREATE TABLE IF NOT EXISTS blood_bank_revenue (
            id INT PRIMARY KEY AUTO_INCREMENT,
            blood_bank_id INT NOT NULL,
            transaction_date DATE NOT NULL,
            revenue_amount FLOAT NOT NULL,
            transaction_type VARCHAR(50),
            description TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (blood_bank_id) REFERENCES blood_banks(id)
        )""", "Create blood_bank_revenue table"),
    ]
    
    with engine.connect() as conn:
        for migration, description in migrations:
            try:
                conn.execute(text(migration))
                conn.commit()
                print(f"✅ {description}")
            except Exception as e:
                if "Duplicate column" in str(e) or "already exists" in str(e):
                    print(f"⏭️  {description} (already exists)")
                else:
                    print(f"⚠️  {description} - Error: {e}")
    
    print("\n✅ Migration completed!")
    print("\nNew features added:")
    print("  • Hemoglobin and gender fields for donors")
    print("  • Street address field for organizers")
    print("  • Blood bank revenue tracking table")
    print("\nYou can now restart your server to use the new features.")

if __name__ == "__main__":
    run_migrations()
