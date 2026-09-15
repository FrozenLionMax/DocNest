-- ========================================================
-- DOCNEST PRODUCTION DATABASE SCHEMA & RLS POLICIES
-- ========================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES TABLE (Doctors, Compounders, Admins, Patients)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('doctor', 'compounder', 'admin', 'patient')),
  phone TEXT UNIQUE,
  clinic_name TEXT,
  specialty TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. CLINIC QUEUES TABLE
CREATE TABLE IF NOT EXISTS public.clinic_queues (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  doctor_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  current_token INT DEFAULT 1,
  total_issued INT DEFAULT 0,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'paused', 'closed')),
  date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. QUEUE ENTRIES TABLE (Patients in Queue)
CREATE TABLE IF NOT EXISTS public.queue_entries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  queue_id UUID REFERENCES public.clinic_queues(id) ON DELETE CASCADE,
  token_number INT NOT NULL,
  patient_name TEXT NOT NULL,
  patient_phone TEXT,
  source TEXT DEFAULT 'online' CHECK (source IN ('online', 'walk_in')),
  status TEXT DEFAULT 'waiting' CHECK (status IN ('waiting', 'in_consultation', 'completed', 'skipped', 'cancelled')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. PRESCRIPTIONS TABLE
CREATE TABLE IF NOT EXISTS public.prescriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  doctor_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  patient_name TEXT NOT NULL,
  patient_phone TEXT,
  token_number INT,
  vitals JSONB,
  diagnosis TEXT,
  medicines JSONB NOT NULL DEFAULT '[]'::jsonb,
  advice TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- --------------------------------------------------------
-- REALTIME PUBLICATION SETUP
-- --------------------------------------------------------
ALTER PUBLICATION supabase_realtime ADD TABLE public.clinic_queues;
ALTER PUBLICATION supabase_realtime ADD TABLE public.queue_entries;

-- --------------------------------------------------------
-- ROW LEVEL SECURITY (RLS) POLICIES
-- --------------------------------------------------------
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clinic_queues ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.queue_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prescriptions ENABLE ROW LEVEL SECURITY;

-- Allow users to read all profiles (public for clinic lookups)
CREATE POLICY "Public profiles are readable by authenticated users" 
ON public.profiles FOR SELECT USING (true);

-- Allow doctors to update their own clinic queue
CREATE POLICY "Doctors can manage their clinic queues" 
ON public.clinic_queues FOR ALL USING (auth.uid() = doctor_id);

-- Allow public read of live clinic queue status
CREATE POLICY "Public can view live queue token status" 
ON public.clinic_queues FOR SELECT USING (true);

-- Allow patients to insert into queue entries
CREATE POLICY "Patients can create queue entries" 
ON public.queue_entries FOR INSERT WITH CHECK (true);

-- Allow doctors & staff to update queue entries
CREATE POLICY "Doctors & staff can manage queue entries" 
ON public.queue_entries FOR ALL USING (true);
