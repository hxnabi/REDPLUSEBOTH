-- Add blood_component column to blood_inventory table
USE red_connect;

-- Add the column
ALTER TABLE blood_inventory 
ADD COLUMN blood_component ENUM('Whole Blood', 'Packed Red Blood Cells', 'Platelets', 'Fresh Frozen Plasma', 'Cryoprecipitate') 
NOT NULL DEFAULT 'Whole Blood'
AFTER blood_type;

-- Verify the change
DESCRIBE blood_inventory;

