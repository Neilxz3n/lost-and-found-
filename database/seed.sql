-- Campus Lost and Found Management System
-- Seed Data

USE campus_lost_and_found;

-- Insert categories
INSERT INTO categories (category_name) VALUES
('Electronics'),
('Books & Notes'),
('Clothing'),
('Accessories'),
('ID & Cards'),
('Keys'),
('Bags & Wallets'),
('Sports Equipment'),
('Stationery'),
('Others');

-- Insert users (passwords are bcrypt hashed for 'password123')
-- Admin user
INSERT INTO users (full_name, email, password, role, course, year_level, contact_number) VALUES
('Admin User', 'admin@campus.edu', '$2b$10$4qNbpOz/ktMi9lJ2DOlztuI7rdn.ePm5Q3IVSr.y9w.zWm66.rqJG', 'admin', 'IT Administration', 'Staff', '09171234567');

-- Student users
INSERT INTO users (full_name, email, password, role, course, year_level, contact_number) VALUES
('Maria Santos', 'maria.santos@campus.edu', '$2b$10$4qNbpOz/ktMi9lJ2DOlztuI7rdn.ePm5Q3IVSr.y9w.zWm66.rqJG', 'user', 'BS Computer Science', '3rd Year', '09181234567'),
('Juan Dela Cruz', 'juan.delacruz@campus.edu', '$2b$10$4qNbpOz/ktMi9lJ2DOlztuI7rdn.ePm5Q3IVSr.y9w.zWm66.rqJG', 'user', 'BS Information Technology', '2nd Year', '09191234567'),
('Ana Reyes', 'ana.reyes@campus.edu', '$2b$10$4qNbpOz/ktMi9lJ2DOlztuI7rdn.ePm5Q3IVSr.y9w.zWm66.rqJG', 'user', 'BS Engineering', '4th Year', '09201234567'),
('Carlos Garcia', 'carlos.garcia@campus.edu', '$2b$10$4qNbpOz/ktMi9lJ2DOlztuI7rdn.ePm5Q3IVSr.y9w.zWm66.rqJG', 'user', 'BS Business Admin', '1st Year', '09211234567');

-- Insert lost items
INSERT INTO lost_items (user_id, category_id, item_name, description, location_lost, date_lost, status) VALUES
(2, 1, 'iPhone 14 Pro', 'Black iPhone 14 Pro with cracked screen protector, has a blue case', 'Library 2nd Floor', '2024-03-15', 'pending'),
(3, 2, 'Calculus Textbook', 'Stewart Calculus 8th Edition with highlighted pages', 'Room 301 Engineering Bldg', '2024-03-14', 'pending'),
(4, 5, 'Student ID Card', 'University ID card with lanyard, name: Ana Reyes', 'Cafeteria', '2024-03-16', 'matched'),
(5, 7, 'Black Leather Wallet', 'Contains some cards and cash, has initials C.G.', 'Parking Lot B', '2024-03-13', 'pending'),
(2, 4, 'Silver Wristwatch', 'Casio silver digital watch with metal band', 'Gymnasium', '2024-03-12', 'claimed');

-- Insert found items
INSERT INTO found_items (user_id, category_id, item_name, description, location_found, date_found, status) VALUES
(3, 1, 'Samsung Galaxy Earbuds', 'White Samsung earbuds in charging case, found near bench', 'Student Park', '2024-03-15', 'pending'),
(4, 6, 'Car Keys with Keychain', 'Toyota car keys with a red heart keychain', 'Main Gate Entrance', '2024-03-14', 'pending'),
(2, 5, 'Student ID Card', 'University ID found on floor, name starts with A', 'Cafeteria', '2024-03-16', 'matched'),
(5, 3, 'Blue Jacket', 'Nike blue windbreaker jacket, size medium', 'Auditorium', '2024-03-11', 'pending'),
(3, 9, 'Scientific Calculator', 'Casio fx-991ES PLUS, has sticker on back', 'Room 205 Science Bldg', '2024-03-10', 'claimed');

-- Insert claims
INSERT INTO claims (found_item_id, claimant_id, proof_of_ownership, claim_status, admin_remark) VALUES
(3, 4, 'I can describe the ID details: Student number 2021-00456, College of Engineering', 'approved', 'Verified with student records'),
(5, 2, 'The calculator has my name written inside the battery cover', 'approved', 'Confirmed ownership'),
(1, 5, 'I lost my earbuds near the park last week, they are white Samsung buds', 'pending', NULL);

-- Insert notifications
INSERT INTO notifications (user_id, message, is_read) VALUES
(4, 'Your claim for "Student ID Card" has been approved!', TRUE),
(2, 'Your claim for "Scientific Calculator" has been approved!', TRUE),
(5, 'Your claim for "Samsung Galaxy Earbuds" is pending review.', FALSE),
(2, 'A possible match has been found for your lost "iPhone 14 Pro".', FALSE),
(3, 'Your found item report has been updated.', FALSE);

-- Insert activity logs
INSERT INTO activity_logs (user_id, activity) VALUES
(1, 'Admin approved claim #1 for Student ID Card'),
(1, 'Admin approved claim #2 for Scientific Calculator'),
(2, 'Reported lost item: iPhone 14 Pro'),
(3, 'Reported found item: Samsung Galaxy Earbuds'),
(4, 'Submitted claim for Student ID Card'),
(5, 'Submitted claim for Samsung Galaxy Earbuds');
