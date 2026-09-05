-- DocNest Seed Data
-- Initial specialties and demo doctors for testing

-- ============================================================
-- SPECIALTIES
-- ============================================================
INSERT INTO public.specialties (name_en, name_hi, icon_name, sort_order) VALUES
  ('General Physician', 'सामान्य चिकित्सक', 'stethoscope', 1),
  ('Cardiologist', 'हृदय रोग विशेषज्ञ', 'heart-pulse', 2),
  ('Orthopedic', 'हड्डी रोग विशेषज्ञ', 'bone', 3),
  ('Gynecologist', 'स्त्री रोग विशेषज्ञ', 'baby', 4),
  ('Pediatrician', 'बाल रोग विशेषज्ञ', 'smile', 5),
  ('Dentist', 'दंत चिकित्सक', 'scan-face', 6),
  ('Dermatologist', 'त्वचा विशेषज्ञ', 'hand', 7),
  ('ENT Specialist', 'कान-नाक-गला विशेषज्ञ', 'ear', 8),
  ('Ophthalmologist', 'नेत्र विशेषज्ञ', 'eye', 9),
  ('Neurologist', 'तंत्रिका विशेषज्ञ', 'brain', 10),
  ('Urologist', 'मूत्र रोग विशेषज्ञ', 'activity', 11),
  ('Psychiatrist', 'मनोचिकित्सक', 'brain-cog', 12),
  ('Pulmonologist', 'फेफड़े विशेषज्ञ', 'wind', 13),
  ('Gastroenterologist', 'पेट रोग विशेषज्ञ', 'pill', 14),
  ('Ayurveda', 'आयुर्वेदिक चिकित्सक', 'leaf', 15)
ON CONFLICT DO NOTHING;

-- ============================================================
-- DEMO DOCTORS (Replace with real Deoria doctors before launch)
-- ============================================================
INSERT INTO public.doctors (full_name, phone, specialization, qualification, experience_years, consultation_fee, clinic_name, clinic_address, latitude, longitude, bio, is_verified, is_active, avg_rating, total_reviews, specialty_id) VALUES
(
  'Dr. Rajesh Kumar Sharma',
  '9876543210',
  'General Physician',
  'MBBS, MD (Medicine)',
  15,
  300,
  'Sharma Clinic',
  'Civil Lines, Deoria',
  26.5024,
  83.7791,
  'Dr. Rajesh Kumar Sharma is a senior general physician with 15 years of experience in Deoria. Specializes in diabetes, hypertension, and general medicine. Available for both clinic visits and home consultations.',
  true,
  true,
  4.5,
  42,
  (SELECT id FROM public.specialties WHERE name_en = 'General Physician' LIMIT 1)
),
(
  'Dr. Sunita Verma',
  '9876543211',
  'Gynecologist',
  'MBBS, MS (OBG)',
  12,
  500,
  'Verma Women''s Clinic',
  'Station Road, Deoria',
  26.5010,
  83.7815,
  'Dr. Sunita Verma is an experienced gynecologist and obstetrician. She provides comprehensive women''s healthcare including prenatal care, delivery, and gynecological treatments.',
  true,
  true,
  4.8,
  67,
  (SELECT id FROM public.specialties WHERE name_en = 'Gynecologist' LIMIT 1)
),
(
  'Dr. Amit Gupta',
  '9876543212',
  'Pediatrician',
  'MBBS, DCH',
  8,
  400,
  'Gupta Child Care',
  'Gandhi Chowk, Deoria',
  26.5030,
  83.7800,
  'Dr. Amit Gupta specializes in child healthcare. Expert in newborn care, vaccinations, and childhood diseases. Friendly approach with children.',
  true,
  true,
  4.6,
  35,
  (SELECT id FROM public.specialties WHERE name_en = 'Pediatrician' LIMIT 1)
),
(
  'Dr. Priya Singh',
  '9876543213',
  'Dermatologist',
  'MBBS, MD (Dermatology)',
  6,
  350,
  'Skin & Care Clinic',
  'Sadar Bazar, Deoria',
  26.5015,
  83.7825,
  'Dr. Priya Singh is a dermatologist specializing in skin diseases, hair problems, and cosmetic dermatology. Uses modern treatment methods.',
  true,
  true,
  4.3,
  28,
  (SELECT id FROM public.specialties WHERE name_en = 'Dermatologist' LIMIT 1)
),
(
  'Dr. Ramesh Yadav',
  '9876543214',
  'Orthopedic',
  'MBBS, MS (Ortho)',
  20,
  600,
  'Yadav Orthopedic Centre',
  'Medical College Road, Deoria',
  26.5040,
  83.7780,
  'Dr. Ramesh Yadav is a senior orthopedic surgeon with 20 years of experience. Expert in joint replacement, fracture management, and sports injuries.',
  true,
  true,
  4.7,
  53,
  (SELECT id FROM public.specialties WHERE name_en = 'Orthopedic' LIMIT 1)
);

-- ============================================================
-- DEMO SCHEDULES (for demo doctors)
-- ============================================================
INSERT INTO public.schedules (doctor_id, day_of_week, start_time, end_time, slot_duration_minutes) 
SELECT d.id, day_num, '09:00', '13:00', 15
FROM public.doctors d
CROSS JOIN (VALUES (1), (2), (3), (4), (5), (6)) AS days(day_num)
WHERE d.full_name = 'Dr. Rajesh Kumar Sharma';

INSERT INTO public.schedules (doctor_id, day_of_week, start_time, end_time, slot_duration_minutes) 
SELECT d.id, day_num, '10:00', '14:00', 20
FROM public.doctors d
CROSS JOIN (VALUES (1), (2), (3), (4), (5)) AS days(day_num)
WHERE d.full_name = 'Dr. Sunita Verma';

INSERT INTO public.schedules (doctor_id, day_of_week, start_time, end_time, slot_duration_minutes) 
SELECT d.id, day_num, '09:30', '12:30', 15
FROM public.doctors d
CROSS JOIN (VALUES (1), (2), (3), (4), (5), (6)) AS days(day_num)
WHERE d.full_name = 'Dr. Amit Gupta';

INSERT INTO public.schedules (doctor_id, day_of_week, start_time, end_time, slot_duration_minutes) 
SELECT d.id, day_num, '11:00', '15:00', 20
FROM public.doctors d
CROSS JOIN (VALUES (1), (2), (3), (5)) AS days(day_num)
WHERE d.full_name = 'Dr. Priya Singh';

INSERT INTO public.schedules (doctor_id, day_of_week, start_time, end_time, slot_duration_minutes) 
SELECT d.id, day_num, '10:00', '13:00', 20
FROM public.doctors d
CROSS JOIN (VALUES (1), (2), (3), (4), (5)) AS days(day_num)
WHERE d.full_name = 'Dr. Ramesh Yadav';

-- ============================================================
-- DEMO BANNERS
-- ============================================================
INSERT INTO public.banners (title, image_url, sort_order) VALUES
  ('Welcome to DocNest', 'https://placehold.co/800x400/0A8F6C/FFFFFF?text=DocNest+x+Medicave', 1),
  ('Free Health Checkup Camp', 'https://placehold.co/800x400/FF6B35/FFFFFF?text=Free+Health+Camp', 2),
  ('Book Your First Appointment', 'https://placehold.co/800x400/1A1A2E/FFFFFF?text=Book+Appointment', 3);
