-- ========================================================
-- DocNest — Complete Master Production Database Setup Script
-- Executes all tables, functions, RLS policies, Realtime publications, and seeds
-- ========================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. PROFILES TABLE (User Accounts)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    phone TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'patient' CHECK (role IN ('patient', 'doctor', 'admin')),
    gender TEXT,
    date_of_birth DATE,
    blood_group TEXT,
    address TEXT,
    block TEXT DEFAULT 'Deoria Sadar',
    avatar_url TEXT,
    fcm_token TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. SPECIALTIES TABLE
CREATE TABLE IF NOT EXISTS public.specialties (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    name_hi TEXT NOT NULL,
    icon TEXT NOT NULL,
    description TEXT,
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. DOCTORS TABLE
CREATE TABLE IF NOT EXISTS public.doctors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID UNIQUE REFERENCES public.profiles(id) ON DELETE SET NULL,
    full_name TEXT NOT NULL,
    specialization TEXT NOT NULL,
    specialty_id UUID REFERENCES public.specialties(id) ON DELETE SET NULL,
    qualification TEXT NOT NULL,
    experience_years INTEGER NOT NULL DEFAULT 0,
    registration_number TEXT NOT NULL UNIQUE,
    clinic_name TEXT NOT NULL,
    clinic_address TEXT NOT NULL,
    block TEXT NOT NULL DEFAULT 'Deoria Sadar',
    latitude NUMERIC(10, 8),
    longitude NUMERIC(11, 8),
    consultation_fee NUMERIC(10, 2) NOT NULL DEFAULT 300.00,
    avg_consultation_minutes INTEGER DEFAULT 10,
    phone TEXT NOT NULL,
    profile_image_url TEXT,
    is_verified BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    avg_rating NUMERIC(3, 2) DEFAULT 5.00,
    total_reviews INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. SCHEDULES TABLE
CREATE TABLE IF NOT EXISTS public.schedules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    doctor_id UUID NOT NULL REFERENCES public.doctors(id) ON DELETE CASCADE,
    day_of_week TEXT NOT NULL CHECK (day_of_week IN ('monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday')),
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    slot_duration_minutes INTEGER DEFAULT 15,
    max_patients_per_slot INTEGER DEFAULT 4,
    is_available BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT schedules_doctor_day_start_unique UNIQUE (doctor_id, day_of_week, start_time)
);

-- 6. APPOINTMENTS TABLE
CREATE TABLE IF NOT EXISTS public.appointments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    appointment_number TEXT NOT NULL UNIQUE,
    patient_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    doctor_id UUID NOT NULL REFERENCES public.doctors(id) ON DELETE CASCADE,
    appointment_date DATE NOT NULL,
    appointment_time TIME NOT NULL,
    status TEXT NOT NULL DEFAULT 'booked' CHECK (status IN ('booked', 'completed', 'cancelled', 'no_show', 'in_consultation')),
    payment_status TEXT NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'completed', 'failed', 'refunded')),
    payment_method TEXT DEFAULT 'pay_at_clinic',
    payment_amount NUMERIC(10, 2) NOT NULL,
    transaction_id TEXT,
    booked_for_name TEXT,
    booked_for_relation TEXT,
    family_member_id UUID,
    symptoms_notes TEXT,
    token_number INTEGER,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. CLINIC QUEUES TABLE
CREATE TABLE IF NOT EXISTS public.clinic_queues (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    doctor_id UUID NOT NULL REFERENCES public.doctors(id) ON DELETE CASCADE,
    queue_date DATE NOT NULL DEFAULT CURRENT_DATE,
    current_token INTEGER DEFAULT 0,
    total_issued INTEGER DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'paused', 'closed')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(doctor_id, queue_date)
);

-- 8. QUEUE ENTRIES TABLE
CREATE TABLE IF NOT EXISTS public.queue_entries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    queue_id UUID REFERENCES public.clinic_queues(id) ON DELETE CASCADE,
    appointment_id UUID REFERENCES public.appointments(id) ON DELETE SET NULL,
    patient_name TEXT NOT NULL,
    patient_phone TEXT,
    token_number INTEGER NOT NULL,
    status TEXT NOT NULL DEFAULT 'waiting' CHECK (status IN ('waiting', 'in_consultation', 'completed', 'skipped', 'cancelled')),
    source TEXT NOT NULL DEFAULT 'walk_in' CHECK (source IN ('online', 'walk_in')),
    estimated_time TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. PRESCRIPTIONS & ITEMS TABLES
CREATE TABLE IF NOT EXISTS public.prescriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    doctor_id UUID REFERENCES public.doctors(id) ON DELETE CASCADE,
    patient_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    appointment_id UUID REFERENCES public.appointments(id) ON DELETE SET NULL,
    doctor_name TEXT NOT NULL,
    patient_name TEXT NOT NULL,
    patient_age INTEGER,
    patient_gender TEXT,
    diagnosis TEXT NOT NULL,
    advice TEXT,
    follow_up_date DATE,
    clinic_name TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.prescription_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    prescription_id UUID REFERENCES public.prescriptions(id) ON DELETE CASCADE,
    medicine_name TEXT NOT NULL,
    dosage TEXT NOT NULL,
    duration TEXT NOT NULL,
    instructions TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. MEDICAVE ORDERS TABLE
CREATE TABLE IF NOT EXISTS public.medicave_orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    prescription_id UUID REFERENCES public.prescriptions(id) ON DELETE SET NULL,
    patient_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    delivery_address TEXT NOT NULL,
    items_summary TEXT NOT NULL,
    total_amount NUMERIC(10, 2) DEFAULT 0.00,
    status TEXT NOT NULL DEFAULT 'pending',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. HEALTH RECORDS TABLE
CREATE TABLE IF NOT EXISTS public.health_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    doctor_id UUID REFERENCES public.doctors(id) ON DELETE SET NULL,
    appointment_id UUID REFERENCES public.appointments(id) ON DELETE SET NULL,
    prescription_id UUID REFERENCES public.prescriptions(id) ON DELETE SET NULL,
    record_type TEXT NOT NULL,
    record_title TEXT NOT NULL,
    doctor_name TEXT,
    hospital_name TEXT,
    file_url TEXT NOT NULL,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. FAMILY MEMBERS TABLE
CREATE TABLE IF NOT EXISTS public.family_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    relation TEXT NOT NULL,
    age INTEGER,
    gender TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 13. BANNERS TABLE
CREATE TABLE IF NOT EXISTS public.banners (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    subtitle TEXT,
    image_url TEXT NOT NULL,
    target_action TEXT,
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 14. RPC FUNCTION: INCREMENT DOCTOR TOKEN
CREATE OR REPLACE FUNCTION public.increment_doctor_token(p_doctor_id UUID)
RETURNS TABLE(new_token INTEGER, queue_status TEXT) AS $$
DECLARE
    v_queue_id UUID;
    v_new_token INTEGER;
    v_status TEXT;
BEGIN
    SELECT id, current_token, status INTO v_queue_id, v_new_token, v_status
    FROM public.clinic_queues
    WHERE doctor_id = p_doctor_id AND queue_date = CURRENT_DATE;

    IF v_queue_id IS NULL THEN
        INSERT INTO public.clinic_queues (doctor_id, queue_date, current_token, total_issued, status)
        VALUES (p_doctor_id, CURRENT_DATE, 1, 1, 'active')
        RETURNING id, current_token, status INTO v_queue_id, v_new_token, v_status;
    ELSE
        v_new_token := v_new_token + 1;
        UPDATE public.clinic_queues
        SET current_token = v_new_token, updated_at = NOW()
        WHERE id = v_queue_id;
    END IF;

    RETURN QUERY SELECT v_new_token, v_status;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 15. ENABLE REALTIME PUBLICATION
ALTER PUBLICATION supabase_realtime ADD TABLE public.clinic_queues;
ALTER PUBLICATION supabase_realtime ADD TABLE public.queue_entries;
ALTER PUBLICATION supabase_realtime ADD TABLE public.prescriptions;
ALTER PUBLICATION supabase_realtime ADD TABLE public.medicave_orders;

-- 16. SEED ESSENTIAL SPECIALTIES
INSERT INTO public.specialties (name, name_hi, icon, display_order) VALUES
('General Physician', 'सामान्य चिकित्सक', '🩺', 1),
('Orthopedic Surgeon', 'हड्डी एवं जोड़', '🦴', 2),
('Gynecologist', 'स्त्री एवं प्रसूति रोग', '👶', 3),
('Pediatrician', 'बाल रोग विशेषज्ञ', '🍼', 4),
('Dermatologist', 'त्वचा एवं बाल', '✨', 5),
('Cardiologist', 'हृदय रोग विशेषज्ञ', '❤️', 6)
ON CONFLICT (name) DO NOTHING;

-- 17. SEED DEMO DOCTOR
INSERT INTO public.doctors (id, full_name, specialization, qualification, experience_years, registration_number, clinic_name, clinic_address, consultation_fee, phone, is_verified) VALUES
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Dr. Amit Kumar', 'Orthopedic Surgeon', 'MBBS, MS (Ortho)', 12, 'UP-MC-48201', 'Gupta Clinic & Joint Care Center', 'Station Road, Deoria Sadar', 300.00, '+919876543210', TRUE)
ON CONFLICT (registration_number) DO NOTHING;
