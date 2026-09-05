-- DocNest Database Schema
-- Migration 001: Core tables for the DocNest healthcare platform
-- Run this in Supabase SQL Editor

-- ============================================================
-- 1. PROFILES (extends Supabase auth.users)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL DEFAULT '',
  phone TEXT UNIQUE,
  gender TEXT CHECK (gender IN ('male', 'female', 'other')),
  date_of_birth DATE,
  address TEXT,
  city TEXT DEFAULT 'Deoria',
  avatar_url TEXT,
  language_pref TEXT DEFAULT 'hi' CHECK (language_pref IN ('hi', 'en')),
  role TEXT DEFAULT 'patient' CHECK (role IN ('patient', 'doctor', 'admin')),
  fcm_token TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Auto-create profile when user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, phone)
  VALUES (NEW.id, NEW.phone);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- ============================================================
-- 2. SPECIALTIES
-- ============================================================
CREATE TABLE IF NOT EXISTS public.specialties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name_en TEXT NOT NULL,
  name_hi TEXT NOT NULL,
  icon_name TEXT NOT NULL DEFAULT 'stethoscope',
  sort_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 3. DOCTORS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.doctors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  specialization TEXT NOT NULL,
  specialty_id UUID REFERENCES public.specialties(id),
  qualification TEXT NOT NULL DEFAULT '',
  registration_number TEXT DEFAULT '',
  experience_years INT DEFAULT 0,
  consultation_fee INT DEFAULT 300,
  clinic_name TEXT NOT NULL DEFAULT '',
  clinic_address TEXT NOT NULL DEFAULT '',
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  photo_url TEXT,
  bio TEXT,
  is_verified BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  avg_rating NUMERIC(2,1) DEFAULT 0.0,
  total_reviews INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_doctors_specialty ON public.doctors(specialty_id);
CREATE INDEX idx_doctors_active ON public.doctors(is_active, is_verified);
CREATE INDEX idx_doctors_rating ON public.doctors(avg_rating DESC);
-- GiST index for location-based queries (nearby doctors)
CREATE INDEX idx_doctors_location ON public.doctors 
  USING gist (point(longitude, latitude));

CREATE TRIGGER doctors_updated_at
  BEFORE UPDATE ON public.doctors
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- Full-text search index for doctor name, specialty, clinic
ALTER TABLE public.doctors ADD COLUMN IF NOT EXISTS search_vector tsvector;

CREATE OR REPLACE FUNCTION doctors_search_update() RETURNS TRIGGER AS $$
BEGIN
  NEW.search_vector := 
    to_tsvector('simple', COALESCE(NEW.full_name, '')) ||
    to_tsvector('simple', COALESCE(NEW.specialization, '')) ||
    to_tsvector('simple', COALESCE(NEW.clinic_name, '')) ||
    to_tsvector('simple', COALESCE(NEW.clinic_address, ''));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER doctors_search_vector_update
  BEFORE INSERT OR UPDATE ON public.doctors
  FOR EACH ROW EXECUTE FUNCTION doctors_search_update();

CREATE INDEX idx_doctors_search ON public.doctors USING gin(search_vector);

-- ============================================================
-- 4. SCHEDULES (Doctor availability)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.schedules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  doctor_id UUID NOT NULL REFERENCES public.doctors(id) ON DELETE CASCADE,
  day_of_week INT NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6),
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  slot_duration_minutes INT DEFAULT 15 CHECK (slot_duration_minutes > 0),
  is_active BOOLEAN DEFAULT TRUE,
  UNIQUE(doctor_id, day_of_week)
);

CREATE INDEX idx_schedules_doctor ON public.schedules(doctor_id);

-- ============================================================
-- 5. APPOINTMENTS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL REFERENCES public.profiles(id),
  doctor_id UUID NOT NULL REFERENCES public.doctors(id),
  appointment_date DATE NOT NULL,
  appointment_time TIME NOT NULL,
  type TEXT DEFAULT 'clinic' CHECK (type IN ('clinic', 'video', 'chat')),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
  fee_amount INT DEFAULT 0,
  payment_id TEXT,
  payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'pay_at_clinic', 'refunded', 'failed')),
  notes TEXT,
  cancellation_reason TEXT,
  booked_for_name TEXT,
  booked_for_relation TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_appointments_patient ON public.appointments(patient_id, created_at DESC);
CREATE INDEX idx_appointments_doctor ON public.appointments(doctor_id, appointment_date);
CREATE INDEX idx_appointments_date ON public.appointments(appointment_date, appointment_time);
-- Prevent double-booking same slot
CREATE UNIQUE INDEX idx_appointments_unique_slot 
  ON public.appointments(doctor_id, appointment_date, appointment_time) 
  WHERE status != 'cancelled';

-- ============================================================
-- 6. REVIEWS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL REFERENCES public.profiles(id),
  doctor_id UUID NOT NULL REFERENCES public.doctors(id),
  appointment_id UUID REFERENCES public.appointments(id),
  rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(patient_id, appointment_id)
);

CREATE INDEX idx_reviews_doctor ON public.reviews(doctor_id, created_at DESC);

-- Auto-update doctor avg_rating and total_reviews after new review
CREATE OR REPLACE FUNCTION update_doctor_rating() RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.doctors SET
    avg_rating = (
      SELECT ROUND(AVG(rating)::numeric, 1)
      FROM public.reviews
      WHERE doctor_id = COALESCE(NEW.doctor_id, OLD.doctor_id)
    ),
    total_reviews = (
      SELECT COUNT(*)
      FROM public.reviews
      WHERE doctor_id = COALESCE(NEW.doctor_id, OLD.doctor_id)
    )
  WHERE id = COALESCE(NEW.doctor_id, OLD.doctor_id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_review_change
  AFTER INSERT OR UPDATE OR DELETE ON public.reviews
  FOR EACH ROW EXECUTE FUNCTION update_doctor_rating();

-- ============================================================
-- 7. HEALTH RECORDS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.health_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  record_type TEXT DEFAULT 'other' CHECK (record_type IN ('prescription', 'report', 'xray', 'scan', 'other')),
  title TEXT NOT NULL,
  file_url TEXT NOT NULL,
  doctor_name TEXT,
  hospital_name TEXT,
  record_date DATE DEFAULT CURRENT_DATE,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_health_records_user ON public.health_records(user_id, created_at DESC);

-- ============================================================
-- 8. FAMILY MEMBERS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.family_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  relation TEXT NOT NULL,
  gender TEXT CHECK (gender IN ('male', 'female', 'other')),
  date_of_birth DATE,
  phone TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_family_members_user ON public.family_members(user_id);

-- ============================================================
-- 9. BANNERS (Home screen promotions)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.banners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  image_url TEXT NOT NULL,
  link_url TEXT,
  sort_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 10. CLINIC QUEUES (Live Token / Parchi System)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.clinic_queues (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  doctor_id UUID NOT NULL REFERENCES public.doctors(id) ON DELETE CASCADE,
  queue_date DATE NOT NULL DEFAULT CURRENT_DATE,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'paused', 'closed')),
  current_token INT DEFAULT 0,
  next_token INT DEFAULT 1,
  avg_consultation_minutes INT DEFAULT 10,
  started_at TIMESTAMPTZ DEFAULT NOW(),
  closed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(doctor_id, queue_date)
);

CREATE INDEX idx_clinic_queues_doctor_date ON public.clinic_queues(doctor_id, queue_date);

-- ============================================================
-- 11. QUEUE ENTRIES (Each patient's token in the queue)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.queue_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  queue_id UUID NOT NULL REFERENCES public.clinic_queues(id) ON DELETE CASCADE,
  patient_id UUID REFERENCES public.profiles(id),
  token_number INT NOT NULL,
  patient_name TEXT NOT NULL,
  patient_phone TEXT,
  status TEXT DEFAULT 'waiting' CHECK (status IN ('waiting', 'in_consultation', 'completed', 'skipped', 'cancelled')),
  source TEXT DEFAULT 'app' CHECK (source IN ('app', 'walk_in')),
  appointment_id UUID REFERENCES public.appointments(id),
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  called_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  estimated_wait_minutes INT,
  notes TEXT
);

CREATE INDEX idx_queue_entries_queue ON public.queue_entries(queue_id, token_number);
CREATE INDEX idx_queue_entries_patient ON public.queue_entries(patient_id);
CREATE INDEX idx_queue_entries_status ON public.queue_entries(queue_id, status);

-- Auto-calculate estimated wait for new queue entries
CREATE OR REPLACE FUNCTION calculate_queue_wait() RETURNS TRIGGER AS $$
DECLARE
  avg_mins INT;
  people_ahead INT;
BEGIN
  SELECT avg_consultation_minutes INTO avg_mins
  FROM public.clinic_queues WHERE id = NEW.queue_id;
  
  SELECT COUNT(*) INTO people_ahead
  FROM public.queue_entries
  WHERE queue_id = NEW.queue_id 
    AND status = 'waiting' 
    AND token_number < NEW.token_number;
  
  NEW.estimated_wait_minutes := people_ahead * COALESCE(avg_mins, 10);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER queue_entry_calc_wait
  BEFORE INSERT ON public.queue_entries
  FOR EACH ROW EXECUTE FUNCTION calculate_queue_wait();

-- Auto-update avg_consultation_minutes when a patient completes
CREATE OR REPLACE FUNCTION update_avg_consultation_time() RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'completed' AND NEW.called_at IS NOT NULL THEN
    NEW.completed_at := NOW();
    
    UPDATE public.clinic_queues SET
      avg_consultation_minutes = (
        SELECT COALESCE(
          ROUND(AVG(EXTRACT(EPOCH FROM (completed_at - called_at)) / 60)::numeric),
          10
        )
        FROM public.queue_entries
        WHERE queue_id = NEW.queue_id AND status = 'completed'
          AND called_at IS NOT NULL AND completed_at IS NOT NULL
      )
    WHERE id = NEW.queue_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER queue_entry_update_avg
  BEFORE UPDATE ON public.queue_entries
  FOR EACH ROW
  WHEN (NEW.status = 'completed')
  EXECUTE FUNCTION update_avg_consultation_time();
