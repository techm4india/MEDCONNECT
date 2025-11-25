-- =====================================================
-- Insert Telangana Government Medical Colleges
-- =====================================================
-- Run this script in Supabase SQL Editor
-- =====================================================

-- Insert Telangana Government Medical Colleges
INSERT INTO colleges (name, code, city, state, is_active) VALUES
-- Major Established Colleges
('Osmania Medical College', 'OMC-HYD', 'Hyderabad', 'Telangana', TRUE),
('Gandhi Medical College', 'GMC-SEC', 'Secunderabad', 'Telangana', TRUE),
('Kakatiya Medical College', 'KMC-WGL', 'Warangal', 'Telangana', TRUE),
('Rajiv Gandhi Institute of Medical Sciences', 'RGIMS-ADB', 'Adilabad', 'Telangana', TRUE),
('Government Medical College Nizamabad', 'GMC-NZB', 'Nizamabad', 'Telangana', TRUE),
('Government Medical College Mahabubnagar', 'GMC-MBNR', 'Mahabubnagar', 'Telangana', TRUE),
('Government Medical College Siddipet', 'GMC-SDPT', 'Siddipet', 'Telangana', TRUE),
('Government Medical College Nalgonda', 'GMC-NLG', 'Nalgonda', 'Telangana', TRUE),
('Government Medical College Suryapet', 'GMC-SYP', 'Suryapet', 'Telangana', TRUE),
('Government Medical College Mancherial', 'GMC-MCH', 'Mancherial', 'Telangana', TRUE),
('Government Medical College Jagtial', 'GMC-JGL', 'Jagtial', 'Telangana', TRUE),
('Government Medical College Karimnagar', 'GMC-KRM', 'Karimnagar', 'Telangana', TRUE),
('Government Medical College Sangareddy', 'GMC-SGR', 'Sangareddy', 'Telangana', TRUE),
('Government Medical College Bhadradri Kothagudem', 'GMC-BDK', 'Bhadradri Kothagudem', 'Telangana', TRUE),
('Government Medical College Jangaon', 'GMC-JGN', 'Jangaon', 'Telangana', TRUE),
('Government Medical College Jayashankar Bhupalpally', 'GMC-JSB', 'Jayashankar Bhupalpally', 'Telangana', TRUE),
('Government Medical College Kamareddy', 'GMC-KMR', 'Kamareddy', 'Telangana', TRUE),
('Government Medical College Khammam', 'GMC-KHM', 'Khammam', 'Telangana', TRUE),
('Government Medical College Vikarabad', 'GMC-VKB', 'Vikarabad', 'Telangana', TRUE),
('Government Medical College Nirmal', 'GMC-NRM', 'Nirmal', 'Telangana', TRUE),
('Government Medical College Rajanna Sircilla', 'GMC-RNS', 'Rajanna Sircilla', 'Telangana', TRUE),
('Government Medical College Medak', 'GMC-MDK', 'Medak', 'Telangana', TRUE),
('Government Medical College Quthbullapur', 'GMC-QTB', 'Quthbullapur', 'Telangana', TRUE),
('Government Medical College Yadadri', 'GMC-YDR', 'Yadadri', 'Telangana', TRUE),
('Government Medical College Mulugu', 'GMC-MLG', 'Mulugu', 'Telangana', TRUE),
('Government Medical College Maheshwaram', 'GMC-MHS', 'Maheshwaram', 'Telangana', TRUE),
('Government Medical College Narsampet', 'GMC-NSP', 'Narsampet', 'Telangana', TRUE),
('Government Medical College Narayanpet', 'GMC-NYP', 'Narayanpet', 'Telangana', TRUE),
('Government Medical College Jogulamba Gadwal', 'GMC-JGW', 'Jogulamba Gadwal', 'Telangana', TRUE),
('All India Institute of Medical Sciences Bibinagar', 'AIIMS-BBN', 'Bibinagar', 'Telangana', TRUE),
('Employees State Insurance Corporation Medical College', 'ESIC-HYD', 'Hyderabad', 'Telangana', TRUE)
ON CONFLICT (code) DO NOTHING;

-- Verify the insert
SELECT name, code, city, state FROM colleges WHERE state = 'Telangana' ORDER BY name;



