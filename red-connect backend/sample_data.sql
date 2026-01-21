-- =====================================================
-- RED+ Sample Data Script
-- This script populates the database with dummy data
-- for testing the admin dashboard
-- =====================================================

-- Clear existing data (optional - comment out if you want to keep existing data)
-- SET FOREIGN_KEY_CHECKS = 0;
-- TRUNCATE TABLE certificates;
-- TRUNCATE TABLE donations;
-- TRUNCATE TABLE events;
-- TRUNCATE TABLE blood_inventory;
-- TRUNCATE TABLE blood_bank_revenue;
-- TRUNCATE TABLE blood_banks;
-- TRUNCATE TABLE donors;
-- TRUNCATE TABLE organizers;
-- TRUNCATE TABLE admins;
-- TRUNCATE TABLE users;
-- SET FOREIGN_KEY_CHECKS = 1;

-- =====================================================
-- 1. USERS (Donors, Organizers, Admins)
-- =====================================================
-- Password for all users: "password123" (hashed with bcrypt)
-- You'll need to update these with actual bcrypt hashes from your backend

-- Donor Users
INSERT INTO users (email, hashed_password, role, is_active, created_at, updated_at) VALUES
('john.doe@example.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5UpPk6oDXMb4O', 'donor', 1, NOW(), NOW()),
('jane.smith@example.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5UpPk6oDXMb4O', 'donor', 1, NOW(), NOW()),
('mike.wilson@example.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5UpPk6oDXMb4O', 'donor', 1, NOW(), NOW()),
('sarah.johnson@example.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5UpPk6oDXMb4O', 'donor', 1, NOW(), NOW()),
('david.brown@example.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5UpPk6oDXMb4O', 'donor', 1, NOW(), NOW()),
('emily.davis@example.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5UpPk6oDXMb4O', 'donor', 1, NOW(), NOW()),
('robert.garcia@example.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5UpPk6oDXMb4O', 'donor', 1, NOW(), NOW()),
('lisa.martinez@example.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5UpPk6oDXMb4O', 'donor', 1, NOW(), NOW()),
('james.rodriguez@example.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5UpPk6oDXMb4O', 'donor', 1, NOW(), NOW()),
('maria.hernandez@example.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5UpPk6oDXMb4O', 'donor', 1, NOW(), NOW());

-- Organizer Users
INSERT INTO users (email, hashed_password, role, is_active, created_at, updated_at) VALUES
('contact@redcrossindore.org', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5UpPk6oDXMb4O', 'organizer', 1, NOW(), NOW()),
('info@rotaryclubindore.org', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5UpPk6oDXMb4O', 'organizer', 1, NOW(), NOW()),
('admin@lionsclubbhopal.org', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5UpPk6oDXMb4O', 'organizer', 1, NOW(), NOW()),
('events@ngohelping.org', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5UpPk6oDXMb4O', 'organizer', 1, NOW(), NOW()),
('contact@youthforchange.org', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5UpPk6oDXMb4O', 'organizer', 1, NOW(), NOW());

-- =====================================================
-- 2. DONORS
-- =====================================================
INSERT INTO donors (user_id, full_name, phone, date_of_birth, blood_type, address, city, state, pincode, last_donation_date, total_donations, weight, hemoglobin, gender, is_active) VALUES
(1, 'John Doe', '9876543210', '1990-05-15', 'A+', '123 MG Road', 'Indore', 'Madhya Pradesh', '452001', '2025-11-15', 5, 75.5, 14.2, 'male', 1),
(2, 'Jane Smith', '9876543211', '1992-08-22', 'B+', '456 Vijay Nagar', 'Indore', 'Madhya Pradesh', '452010', '2025-12-01', 3, 62.0, 13.5, 'female', 1),
(3, 'Mike Wilson', '9876543212', '1988-03-10', 'O+', '789 Palasia', 'Indore', 'Madhya Pradesh', '452001', '2025-10-20', 8, 82.0, 15.0, 'male', 1),
(4, 'Sarah Johnson', '9876543213', '1995-11-30', 'AB+', '321 Rau', 'Indore', 'Madhya Pradesh', '453331', '2025-12-10', 2, 58.5, 13.0, 'female', 1),
(5, 'David Brown', '9876543214', '1987-07-18', 'A-', '654 Aerodrome Road', 'Indore', 'Madhya Pradesh', '452005', '2025-09-05', 10, 78.0, 14.5, 'male', 1),
(6, 'Emily Davis', '9876543215', '1993-01-25', 'B-', '987 Sapna Sangeeta', 'Indore', 'Madhya Pradesh', '452001', '2025-11-28', 4, 65.0, 13.8, 'female', 1),
(7, 'Robert Garcia', '9876543216', '1991-09-12', 'O-', '147 AB Road', 'Indore', 'Madhya Pradesh', '452008', '2025-12-15', 6, 80.5, 14.8, 'male', 1),
(8, 'Lisa Martinez', '9876543217', '1994-04-08', 'AB-', '258 Scheme 54', 'Indore', 'Madhya Pradesh', '452010', '2025-10-30', 3, 60.0, 13.2, 'female', 1),
(9, 'James Rodriguez', '9876543218', '1989-12-20', 'A+', '369 Bhawarkua', 'Indore', 'Madhya Pradesh', '452014', '2025-11-20', 7, 76.0, 14.6, 'male', 1),
(10, 'Maria Hernandez', '9876543219', '1996-06-14', 'B+', '741 South Tukoganj', 'Indore', 'Madhya Pradesh', '452001', '2025-12-05', 2, 63.5, 13.4, 'female', 1);

-- =====================================================
-- 3. ORGANIZERS
-- =====================================================
INSERT INTO organizers (user_id, organization_name, contact_person, phone, address, city, state, pincode, organization_type, is_verified) VALUES
(11, 'Indian Red Cross Society - Indore', 'Dr. Rajesh Sharma', '0731-2345678', '1 Red Cross Road', 'Indore', 'Madhya Pradesh', '452001', 'ngo', 1),
(12, 'Rotary Club of Indore', 'Mr. Amit Patel', '0731-2456789', '45 Rotary Square', 'Indore', 'Madhya Pradesh', '452010', 'club', 1),
(13, 'Lions Club Bhopal', 'Mrs. Priya Verma', '0755-3456789', '78 Lions Street', 'Bhopal', 'Madhya Pradesh', '462001', 'club', 1),
(14, 'Helping Hands NGO', 'Mr. Suresh Kumar', '0731-4567890', '90 Service Lane', 'Indore', 'Madhya Pradesh', '452016', 'ngo', 1),
(15, 'Youth for Change', 'Ms. Neha Singh', '0731-5678901', '12 Youth Plaza', 'Indore', 'Madhya Pradesh', '452001', 'community', 1);

-- =====================================================
-- 4. BLOOD BANKS
-- =====================================================
INSERT INTO blood_banks (name, address, city, state, pincode, phone, email, operating_hours, created_at, updated_at) VALUES
('Choithram Hospital Blood Bank', 'Manik Bagh Road, Indore', 'Indore', 'Madhya Pradesh', '452014', '0731-2720000', 'bloodbank@choithramhospital.com', '24/7', NOW(), NOW()),
('CHL Hospital Blood Bank', 'AB Road, Indore', 'Indore', 'Madhya Pradesh', '452008', '0731-4290000', 'bloodbank@chlhospitals.com', '24/7', NOW(), NOW()),
('Bombay Hospital Blood Bank', '5 Vijay Nagar, Indore', 'Indore', 'Madhya Pradesh', '452010', '0731-2555000', 'bloodbank@bombayhospital.com', '8:00 AM - 8:00 PM', NOW(), NOW()),
('MY Hospital Blood Bank', 'MG Road, Indore', 'Indore', 'Madhya Pradesh', '452001', '0731-2535555', 'bloodbank@myhospital.gov.in', '24/7', NOW(), NOW()),
('Apollo Hospital Blood Bank', 'Scheme 74C, Indore', 'Indore', 'Madhya Pradesh', '452010', '0731-4268000', 'bloodbank@apolloindore.com', '24/7', NOW(), NOW()),
('AIIMS Bhopal Blood Bank', 'Saket Nagar, Bhopal', 'Bhopal', 'Madhya Pradesh', '462020', '0755-2672222', 'bloodbank@aiimsbhopal.edu.in', '24/7', NOW(), NOW()),
('Hamidia Hospital Blood Bank', 'Sultania Road, Bhopal', 'Bhopal', 'Madhya Pradesh', '462001', '0755-2740666', 'bloodbank@hamidia.gov.in', '24/7', NOW(), NOW()),
('Medanta Hospital Blood Bank', 'Sector D, LIG Square, Indore', 'Indore', 'Madhya Pradesh', '452008', '0731-4777777', 'bloodbank@medanta.org', '24/7', NOW(), NOW()),
('Care Hospital Blood Bank', 'Vijay Nagar, Indore', 'Indore', 'Madhya Pradesh', '452010', '0731-4044444', 'bloodbank@carehospitals.com', '8:00 AM - 6:00 PM', NOW(), NOW()),
('Suyash Hospital Blood Bank', 'Scheme 140, Indore', 'Indore', 'Madhya Pradesh', '452016', '0731-4005000', 'bloodbank@suyashhospital.com', '24/7', NOW(), NOW());

-- =====================================================
-- 5. EVENTS
-- =====================================================
INSERT INTO events (organizer_id, title, description, event_date, start_time, end_time, venue, city, state, max_participants, registered_participants, status, created_at, updated_at) VALUES
-- Upcoming Events
(1, 'Mega Blood Donation Camp 2026', 'Join us for the biggest blood donation drive of the year. Save lives, donate blood!', '2026-02-15', '09:00:00', '17:00:00', 'Red Cross Headquarters, MG Road', 'Indore', 'Madhya Pradesh', 200, 45, 'upcoming', NOW(), NOW()),
(2, 'Rotary Blood Drive - January', 'Monthly blood donation camp organized by Rotary Club', '2026-02-01', '10:00:00', '16:00:00', 'Rotary Bhawan, Vijay Nagar', 'Indore', 'Madhya Pradesh', 150, 32, 'upcoming', NOW(), NOW()),
(3, 'Corporate Blood Donation Day', 'Special blood donation camp for corporate employees', '2026-02-20', '09:00:00', '15:00:00', 'TCS Campus, Ring Road', 'Indore', 'Madhya Pradesh', 100, 18, 'upcoming', NOW(), NOW()),
(4, 'Youth Blood Heroes Campaign', 'Calling all youth to become blood donation heroes!', '2026-03-05', '08:00:00', '14:00:00', 'Devi Ahilya University', 'Indore', 'Madhya Pradesh', 250, 67, 'upcoming', NOW(), NOW()),
(5, 'Community Health & Blood Drive', 'Free health checkup along with blood donation camp', '2026-02-28', '10:00:00', '18:00:00', 'Community Center, Scheme 54', 'Indore', 'Madhya Pradesh', 120, 28, 'upcoming', NOW(), NOW()),

-- Past Events (Completed)
(1, 'New Year Blood Donation 2026', 'Start the new year by saving lives through blood donation', '2026-01-05', '09:00:00', '17:00:00', 'Red Cross Headquarters, MG Road', 'Indore', 'Madhya Pradesh', 180, 165, 'completed', '2025-12-15 10:00:00', NOW()),
(2, 'World Blood Donor Day Celebration', 'Special event celebrating blood donors worldwide', '2025-06-14', '08:00:00', '18:00:00', 'City Center Mall', 'Indore', 'Madhya Pradesh', 300, 287, 'completed', '2025-05-20 10:00:00', NOW()),
(3, 'Monsoon Blood Drive', 'Rainy season special blood donation camp', '2025-08-15', '10:00:00', '16:00:00', 'Brilliant Convention Centre', 'Indore', 'Madhya Pradesh', 200, 178, 'completed', '2025-07-25 10:00:00', NOW()),
(4, 'Diwali Blood Donation Festival', 'Celebrate Diwali by donating blood and spreading light', '2025-11-01', '09:00:00', '15:00:00', 'Nehru Stadium', 'Indore', 'Madhya Pradesh', 250, 234, 'completed', '2025-10-10 10:00:00', NOW()),
(5, 'Republic Day Blood Camp', 'Special blood donation camp on Republic Day', '2026-01-26', '08:00:00', '14:00:00', 'District Collectorate', 'Indore', 'Madhya Pradesh', 150, 142, 'completed', '2026-01-10 10:00:00', NOW());

-- =====================================================
-- 6. DONATIONS (for completed events)
-- =====================================================
-- Donations for "New Year Blood Donation 2026" (Event ID: 6)
INSERT INTO donations (donor_id, event_id, donation_date, blood_type, units, status, created_at, updated_at) VALUES
(1, 6, '2026-01-05', 'A+', 1, 'completed', '2026-01-05 10:30:00', '2026-01-05 10:30:00'),
(3, 6, '2026-01-05', 'O+', 1, 'completed', '2026-01-05 11:00:00', '2026-01-05 11:00:00'),
(5, 6, '2026-01-05', 'A-', 1, 'completed', '2026-01-05 11:30:00', '2026-01-05 11:30:00'),
(7, 6, '2026-01-05', 'O-', 1, 'completed', '2026-01-05 12:00:00', '2026-01-05 12:00:00'),
(9, 6, '2026-01-05', 'A+', 1, 'completed', '2026-01-05 14:00:00', '2026-01-05 14:00:00');

-- Donations for "World Blood Donor Day Celebration" (Event ID: 7)
INSERT INTO donations (donor_id, event_id, donation_date, blood_type, units, status, created_at, updated_at) VALUES
(2, 7, '2025-06-14', 'B+', 1, 'completed', '2025-06-14 09:30:00', '2025-06-14 09:30:00'),
(4, 7, '2025-06-14', 'AB+', 1, 'completed', '2025-06-14 10:00:00', '2025-06-14 10:00:00'),
(6, 7, '2025-06-14', 'B-', 1, 'completed', '2025-06-14 11:00:00', '2025-06-14 11:00:00'),
(8, 7, '2025-06-14', 'AB-', 1, 'completed', '2025-06-14 12:30:00', '2025-06-14 12:30:00'),
(10, 7, '2025-06-14', 'B+', 1, 'completed', '2025-06-14 13:00:00', '2025-06-14 13:00:00');

-- Donations for "Monsoon Blood Drive" (Event ID: 8)
INSERT INTO donations (donor_id, event_id, donation_date, blood_type, units, status, created_at, updated_at) VALUES
(1, 8, '2025-08-15', 'A+', 1, 'completed', '2025-08-15 10:30:00', '2025-08-15 10:30:00'),
(3, 8, '2025-08-15', 'O+', 1, 'completed', '2025-08-15 11:00:00', '2025-08-15 11:00:00'),
(5, 8, '2025-08-15', 'A-', 1, 'completed', '2025-08-15 12:00:00', '2025-08-15 12:00:00'),
(7, 8, '2025-08-15', 'O-', 1, 'completed', '2025-08-15 13:00:00', '2025-08-15 13:00:00');

-- Donations for "Diwali Blood Donation Festival" (Event ID: 9)
INSERT INTO donations (donor_id, event_id, donation_date, blood_type, units, status, created_at, updated_at) VALUES
(2, 9, '2025-11-01', 'B+', 1, 'completed', '2025-11-01 09:30:00', '2025-11-01 09:30:00'),
(4, 9, '2025-11-01', 'AB+', 1, 'completed', '2025-11-01 10:30:00', '2025-11-01 10:30:00'),
(6, 9, '2025-11-01', 'B-', 1, 'completed', '2025-11-01 11:30:00', '2025-11-01 11:30:00'),
(8, 9, '2025-11-01', 'AB-', 1, 'completed', '2025-11-01 12:30:00', '2025-11-01 12:30:00'),
(9, 9, '2025-11-01', 'A+', 1, 'completed', '2025-11-01 14:00:00', '2025-11-01 14:00:00');

-- Donations for "Republic Day Blood Camp" (Event ID: 10)
INSERT INTO donations (donor_id, event_id, donation_date, blood_type, units, status, created_at, updated_at) VALUES
(1, 10, '2026-01-26', 'A+', 1, 'completed', '2026-01-26 09:00:00', '2026-01-26 09:00:00'),
(3, 10, '2026-01-26', 'O+', 1, 'completed', '2026-01-26 09:30:00', '2026-01-26 09:30:00'),
(5, 10, '2026-01-26', 'A-', 1, 'completed', '2026-01-26 10:00:00', '2026-01-26 10:00:00'),
(7, 10, '2026-01-26', 'O-', 1, 'completed', '2026-01-26 10:30:00', '2026-01-26 10:30:00'),
(10, 10, '2026-01-26', 'B+', 1, 'completed', '2026-01-26 11:00:00', '2026-01-26 11:00:00');

-- =====================================================
-- 7. CERTIFICATES (for completed donations)
-- =====================================================
INSERT INTO certificates (donation_id, donor_id, certificate_number, issue_date, blood_units, blood_type, status, issued_by, created_at, updated_at) VALUES
-- Certificates for Event 6 donations
(1, 1, 'CERT-2026-001', '2026-01-05', 1, 'A+', 'issued', 'Red Cross Society', '2026-01-05 17:00:00', '2026-01-05 17:00:00'),
(2, 3, 'CERT-2026-002', '2026-01-05', 1, 'O+', 'issued', 'Red Cross Society', '2026-01-05 17:00:00', '2026-01-05 17:00:00'),
(3, 5, 'CERT-2026-003', '2026-01-05', 1, 'A-', 'issued', 'Red Cross Society', '2026-01-05 17:00:00', '2026-01-05 17:00:00'),
(4, 7, 'CERT-2026-004', '2026-01-05', 1, 'O-', 'issued', 'Red Cross Society', '2026-01-05 17:00:00', '2026-01-05 17:00:00'),
(5, 9, 'CERT-2026-005', '2026-01-05', 1, 'A+', 'issued', 'Red Cross Society', '2026-01-05 17:00:00', '2026-01-05 17:00:00'),

-- Certificates for Event 7 donations
(6, 2, 'CERT-2025-101', '2025-06-14', 1, 'B+', 'issued', 'Rotary Club of Indore', '2025-06-14 18:00:00', '2025-06-14 18:00:00'),
(7, 4, 'CERT-2025-102', '2025-06-14', 1, 'AB+', 'issued', 'Rotary Club of Indore', '2025-06-14 18:00:00', '2025-06-14 18:00:00'),
(8, 6, 'CERT-2025-103', '2025-06-14', 1, 'B-', 'issued', 'Rotary Club of Indore', '2025-06-14 18:00:00', '2025-06-14 18:00:00'),
(9, 8, 'CERT-2025-104', '2025-06-14', 1, 'AB-', 'issued', 'Rotary Club of Indore', '2025-06-14 18:00:00', '2025-06-14 18:00:00'),
(10, 10, 'CERT-2025-105', '2025-06-14', 1, 'B+', 'issued', 'Rotary Club of Indore', '2025-06-14 18:00:00', '2025-06-14 18:00:00'),

-- Certificates for Event 8 donations
(11, 1, 'CERT-2025-201', '2025-08-15', 1, 'A+', 'issued', 'Lions Club Bhopal', '2025-08-15 17:00:00', '2025-08-15 17:00:00'),
(12, 3, 'CERT-2025-202', '2025-08-15', 1, 'O+', 'issued', 'Lions Club Bhopal', '2025-08-15 17:00:00', '2025-08-15 17:00:00'),
(13, 5, 'CERT-2025-203', '2025-08-15', 1, 'A-', 'issued', 'Lions Club Bhopal', '2025-08-15 17:00:00', '2025-08-15 17:00:00'),
(14, 7, 'CERT-2025-204', '2025-08-15', 1, 'O-', 'issued', 'Lions Club Bhopal', '2025-08-15 17:00:00', '2025-08-15 17:00:00'),

-- Certificates for Event 9 donations
(15, 2, 'CERT-2025-301', '2025-11-01', 1, 'B+', 'issued', 'Helping Hands NGO', '2025-11-01 16:00:00', '2025-11-01 16:00:00'),
(16, 4, 'CERT-2025-302', '2025-11-01', 1, 'AB+', 'issued', 'Helping Hands NGO', '2025-11-01 16:00:00', '2025-11-01 16:00:00'),
(17, 6, 'CERT-2025-303', '2025-11-01', 1, 'B-', 'issued', 'Helping Hands NGO', '2025-11-01 16:00:00', '2025-11-01 16:00:00'),
(18, 8, 'CERT-2025-304', '2025-11-01', 1, 'AB-', 'issued', 'Helping Hands NGO', '2025-11-01 16:00:00', '2025-11-01 16:00:00'),
(19, 9, 'CERT-2025-305', '2025-11-01', 1, 'A+', 'issued', 'Helping Hands NGO', '2025-11-01 16:00:00', '2025-11-01 16:00:00'),

-- Certificates for Event 10 donations
(20, 1, 'CERT-2026-401', '2026-01-26', 1, 'A+', 'issued', 'Youth for Change', '2026-01-26 15:00:00', '2026-01-26 15:00:00'),
(21, 3, 'CERT-2026-402', '2026-01-26', 1, 'O+', 'issued', 'Youth for Change', '2026-01-26 15:00:00', '2026-01-26 15:00:00'),
(22, 5, 'CERT-2026-403', '2026-01-26', 1, 'A-', 'issued', 'Youth for Change', '2026-01-26 15:00:00', '2026-01-26 15:00:00'),
(23, 7, 'CERT-2026-404', '2026-01-26', 1, 'O-', 'issued', 'Youth for Change', '2026-01-26 15:00:00', '2026-01-26 15:00:00'),
(24, 10, 'CERT-2026-405', '2026-01-26', 1, 'B+', 'issued', 'Youth for Change', '2026-01-26 15:00:00', '2026-01-26 15:00:00');

-- =====================================================
-- 8. BLOOD INVENTORY (Sample inventory for blood banks)
-- =====================================================
INSERT INTO blood_inventory (blood_bank_id, blood_type, units_available, units_required, last_updated) VALUES
-- Choithram Hospital
(1, 'A+', 45, 60, NOW()),
(1, 'A-', 12, 20, NOW()),
(1, 'B+', 38, 50, NOW()),
(1, 'B-', 8, 15, NOW()),
(1, 'O+', 52, 70, NOW()),
(1, 'O-', 15, 25, NOW()),
(1, 'AB+', 18, 30, NOW()),
(1, 'AB-', 5, 10, NOW()),

-- CHL Hospital
(2, 'A+', 40, 55, NOW()),
(2, 'A-', 10, 18, NOW()),
(2, 'B+', 35, 45, NOW()),
(2, 'B-', 7, 12, NOW()),
(2, 'O+', 48, 65, NOW()),
(2, 'O-', 12, 20, NOW()),
(2, 'AB+', 15, 25, NOW()),
(2, 'AB-', 4, 8, NOW());

-- =====================================================
-- SUCCESS MESSAGE
-- =====================================================
SELECT 'Sample data inserted successfully!' AS Status;
SELECT 
    (SELECT COUNT(*) FROM users) AS Total_Users,
    (SELECT COUNT(*) FROM donors) AS Total_Donors,
    (SELECT COUNT(*) FROM organizers) AS Total_Organizers,
    (SELECT COUNT(*) FROM blood_banks) AS Total_BloodBanks,
    (SELECT COUNT(*) FROM events) AS Total_Events,
    (SELECT COUNT(*) FROM donations) AS Total_Donations,
    (SELECT COUNT(*) FROM certificates) AS Total_Certificates;


