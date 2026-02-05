-- Migration script to add google_id column to users table
-- Run this script to update your database schema

-- Add google_id column to users table
ALTER TABLE users 
ADD COLUMN google_id VARCHAR(255) NULL AFTER hashed_password;

-- Make hashed_password nullable (for Google OAuth users)
ALTER TABLE users 
MODIFY COLUMN hashed_password VARCHAR(255) NULL;

-- Add unique index on google_id
CREATE UNIQUE INDEX idx_users_google_id ON users(google_id);

-- Note: Existing users will have NULL google_id and hashed_password
-- Google OAuth users will have google_id set and hashed_password as NULL
-- Regular users will have hashed_password set and google_id as NULL

