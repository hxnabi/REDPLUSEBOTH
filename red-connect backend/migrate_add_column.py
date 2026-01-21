"""
Add blood_component column to blood_inventory table
"""
import pymysql
from app.config import settings

def migrate():
    try:
        # Connect to MySQL
        connection = pymysql.connect(
            host=settings.DB_HOST,
            user=settings.DB_USER,
            password=settings.DB_PASSWORD,
            database=settings.DB_NAME,
            port=settings.DB_PORT
        )
        
        cursor = connection.cursor()
        
        print("Adding blood_component column to blood_inventory table...")
        
        # Check if column already exists
        cursor.execute("""
            SELECT COUNT(*) 
            FROM INFORMATION_SCHEMA.COLUMNS 
            WHERE TABLE_SCHEMA = %s 
            AND TABLE_NAME = 'blood_inventory' 
            AND COLUMN_NAME = 'blood_component'
        """, (settings.DB_NAME,))
        
        exists = cursor.fetchone()[0]
        
        if exists:
            print("Column 'blood_component' already exists. Skipping.")
        else:
            # Add the column
            cursor.execute("""
                ALTER TABLE blood_inventory 
                ADD COLUMN blood_component ENUM(
                    'Whole Blood', 
                    'Packed Red Blood Cells', 
                    'Platelets', 
                    'Fresh Frozen Plasma', 
                    'Cryoprecipitate'
                ) 
                NOT NULL DEFAULT 'Whole Blood'
                AFTER blood_type
            """)
            
            connection.commit()
            print("SUCCESS: Column 'blood_component' added successfully!")
        
        # Show table structure
        cursor.execute("DESCRIBE blood_inventory")
        columns = cursor.fetchall()
        
        print("\nCurrent blood_inventory table structure:")
        print("-" * 80)
        for col in columns:
            print(f"  {col[0]:<20} {col[1]:<30} {col[2]:<10}")
        print("-" * 80)
        
        cursor.close()
        connection.close()
        
    except Exception as e:
        print(f"ERROR: {e}")
        raise

if __name__ == "__main__":
    migrate()

