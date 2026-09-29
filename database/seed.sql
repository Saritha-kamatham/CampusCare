-- ===================================================================
-- CampusCare Seed Script (MySQL 8.0+)
-- Note: Spring Boot automatically seeds this data via DatabaseSeeder.java!
-- Use this script for manual MySQL population if running standalone.
-- ===================================================================

USE campuscare_db;

-- 1. USERS
-- Password for admin123, staff123, student123 is: $2a$10$8.UnVuG9HHgffUDAlk8qfOuVGkqRzgVymGe07xd00DMxs.AQubh4a
INSERT INTO users (id, name, email, password, role, department, phone, active, created_at, updated_at) VALUES
(1, 'Dr. Evelyn Reed', 'admin@campuscare.com', '$2a$10$8.UnVuG9HHgffUDAlk8qfOuVGkqRzgVymGe07xd00DMxs.AQubh4a', 'ROLE_ADMIN', 'Campus Administration', '+1 (555) 019-2831', TRUE, NOW(), NOW()),
(2, 'Marcus Vance', 'staff1@campuscare.com', '$2a$10$8.UnVuG9HHgffUDAlk8qfOuVGkqRzgVymGe07xd00DMxs.AQubh4a', 'ROLE_STAFF', 'Electrical & Hardware Maintenance', '+1 (555) 014-9921', TRUE, NOW(), NOW()),
(3, 'Priya Sharma', 'staff2@campuscare.com', '$2a$10$8.UnVuG9HHgffUDAlk8qfOuVGkqRzgVymGe07xd00DMxs.AQubh4a', 'ROLE_STAFF', 'IT Infrastructure & Networks', '+1 (555) 018-4432', TRUE, NOW(), NOW()),
(4, 'David Chen', 'staff3@campuscare.com', '$2a$10$8.UnVuG9HHgffUDAlk8qfOuVGkqRzgVymGe07xd00DMxs.AQubh4a', 'ROLE_STAFF', 'Facilities & Hostel Operations', '+1 (555) 012-7789', TRUE, NOW(), NOW()),
(5, 'Alex Rivera', 'student1@campuscare.com', '$2a$10$8.UnVuG9HHgffUDAlk8qfOuVGkqRzgVymGe07xd00DMxs.AQubh4a', 'ROLE_STUDENT', 'Computer Science & Eng.', '+1 (555) 011-3321', TRUE, NOW(), NOW()),
(6, 'Samantha Brooke', 'student2@campuscare.com', '$2a$10$8.UnVuG9HHgffUDAlk8qfOuVGkqRzgVymGe07xd00DMxs.AQubh4a', 'ROLE_STUDENT', 'Electrical Engineering', '+1 (555) 013-4412', TRUE, NOW(), NOW()),
(7, 'Rohan Patel', 'student3@campuscare.com', '$2a$10$8.UnVuG9HHgffUDAlk8qfOuVGkqRzgVymGe07xd00DMxs.AQubh4a', 'ROLE_STUDENT', 'Mechanical Engineering', '+1 (555) 015-6671', TRUE, NOW(), NOW()),
(8, 'Emily Zhang', 'student4@campuscare.com', '$2a$10$8.UnVuG9HHgffUDAlk8qfOuVGkqRzgVymGe07xd00DMxs.AQubh4a', 'ROLE_STUDENT', 'Biotechnology', '+1 (555) 017-8891', TRUE, NOW(), NOW()),
(9, 'Jordan Hayes', 'student5@campuscare.com', '$2a$10$8.UnVuG9HHgffUDAlk8qfOuVGkqRzgVymGe07xd00DMxs.AQubh4a', 'ROLE_STUDENT', 'Business Administration', '+1 (555) 019-1142', TRUE, NOW(), NOW());

-- 2. SAMPLE ISSUES
INSERT INTO issues (id, issue_code, title, description, category, priority, status, location, created_by_user_id, assigned_staff_id, assigned_admin_id, created_at, updated_at) VALUES
(1, 'CC-2026-1001', 'Wi-Fi not working in CSE Lab 2', 'Students are unable to connect to the campus Wi-Fi network CampusCare-Secure in lab 2. Gateway appears unresponsive.', 'WIFI_INTERNET', 'HIGH', 'REPORTED', 'Turing Block, Room 204 (CSE Lab 2)', 5, NULL, NULL, DATE_SUB(NOW(), INTERVAL 2 HOUR), DATE_SUB(NOW(), INTERVAL 2 HOUR)),
(2, 'CC-2026-1002', 'Projector bulb burnt out during lecture', 'Ceiling-mounted Epson projector in Seminar Hall B flickers violently and shut down mid-lecture.', 'CLASSROOM', 'MEDIUM', 'REPORTED', 'Academic Hall B, 3rd Floor', 6, NULL, NULL, DATE_SUB(NOW(), INTERVAL 4 HOUR), DATE_SUB(NOW(), INTERVAL 4 HOUR)),
(3, 'CC-2026-1003', 'Main water cooler leaking in East Wing', 'Continuous water overflow near the stairwell posing a severe slip hazard for students.', 'HOSTEL', 'CRITICAL', 'REPORTED', 'Oak Residence Hall, 1st Floor East Wing', 7, NULL, NULL, DATE_SUB(NOW(), INTERVAL 5 HOUR), DATE_SUB(NOW(), INTERVAL 5 HOUR)),
(4, 'CC-2026-1005', 'Exposed wiring on workbench electrical outlet', 'Faceplate cracked and live neutral wire slightly visible on station table 7.', 'ELECTRICAL', 'CRITICAL', 'ASSIGNED', 'Robotics Lab, Station 7', 5, 2, 1, DATE_SUB(NOW(), INTERVAL 1 DAY), DATE_SUB(NOW(), INTERVAL 1 DAY)),
(5, 'CC-2026-1009', 'Campus Shuttle Bus 4 hydraulic lift malfunction', 'Wheelchair access lift on Shuttle 4 failed safety check before morning campus route.', 'TRANSPORT', 'HIGH', 'IN_PROGRESS', 'Central Transit Depot', 8, 4, 1, DATE_SUB(NOW(), INTERVAL 2 DAY), DATE_SUB(NOW(), INTERVAL 2 DAY)),
(6, 'CC-2026-1013', 'Flickering fluorescent tubes in Chemistry Lab 3', 'Overhead ballast humming loudly and four light tubes flickering constantly.', 'ELECTRICAL', 'LOW', 'RESOLVED', 'Mendeleev Chemistry Complex, Lab 3', 6, 2, 1, DATE_SUB(NOW(), INTERVAL 4 DAY), DATE_SUB(NOW(), INTERVAL 4 DAY));

-- 3. SAMPLE HISTORY
INSERT INTO issue_history (issue_id, changed_by_user_id, old_status, new_status, note, changed_at) VALUES
(1, 5, NULL, 'REPORTED', 'Issue reported by student Alex Rivera', DATE_SUB(NOW(), INTERVAL 2 HOUR)),
(4, 5, NULL, 'REPORTED', 'Issue reported by student Alex Rivera', DATE_SUB(NOW(), INTERVAL 1 DAY)),
(4, 1, 'REPORTED', 'ASSIGNED', 'Assigned to staff Marcus Vance by Admin Dr. Evelyn Reed', DATE_SUB(NOW(), INTERVAL 22 HOUR)),
(5, 8, NULL, 'REPORTED', 'Issue reported by student Emily Zhang', DATE_SUB(NOW(), INTERVAL 2 DAY)),
(5, 1, 'REPORTED', 'ASSIGNED', 'Assigned to staff David Chen by Admin Dr. Evelyn Reed', DATE_SUB(NOW(), INTERVAL 44 HOUR)),
(5, 4, 'ASSIGNED', 'IN_PROGRESS', 'Staff member David Chen accepted assignment and initiated troubleshooting.', DATE_SUB(NOW(), INTERVAL 40 HOUR));
