"""
Fix blood_component ENUM values to match SQLAlchemy enum member names
"""
import pymysql
from app.config import settings

def fix_enum():
    try:
        connection = pymysql.connect(
            host=settings.DB_HOST,
            user=settings.DB_USER,
            password=settings.DB_PASSWORD,
            database=settings.DB_NAME,
            port=settings.DB_PORT
        )
        
        cursor = connection.cursor()
        
        print("Fixing blood_component ENUM values...")
        
        # Drop the column
        print("1. Dropping old column...")
        cursor.execute("ALTER TABLE blood_inventory DROP COLUMN blood_component")
        
        # Add it back with correct ENUM values (using member names, not values)
        print("2. Adding column with correct ENUM values...")
        cursor.execute("""
            ALTER TABLE blood_inventory 
            ADD COLUMN blood_component ENUM(
                'WHOLE_BLOOD',
                'PACKED_RED_CELLS',
                'PLATELETS',
                'FRESH_FROZEN_PLASMA',
                'CRYOPRECIPITATE'
            ) 
            NOT NULL DEFAULT 'WHOLE_BLOOD'
            AFTER blood_type
        """)
        
        connection.commit()
        print("SUCCESS: ENUM fixed!")
        
        # Show table structure
        cursor.execute("DESCRIBE blood_inventory")
        columns = cursor.fetchall()
        
        print("\nUpdated blood_inventory table structure:")
        print("-" * 80)
        for col in columns:
            print(f"  {col[0]:<20} {col[1]:<50}")
        print("-" * 80)
        
        cursor.close()
        connection.close()
        
    except Exception as e:
        print(f"ERROR: {e}")
        raise

if __name__ == "__main__":
    fix_enum()

