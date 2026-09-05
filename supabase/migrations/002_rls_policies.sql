-- DocNest Row Level Security Policies
-- Run AFTER 001_create_tables.sql

-- ============================================================
-- Enable RLS on ALL tables
-- ============================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.specialties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.doctors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.health_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.family_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.banners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clinic_queues ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.queue_entries ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- Helper: Check if current user is admin
-- ============================================================
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
$$ LANGUAGE sql SECURITY DEFINER;

-- ============================================================
-- PROFILES: Users can read/update only their own profile
-- ============================================================
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Admin can view all profiles"
  ON public.profiles FOR SELECT
  USING (public.is_admin());

-- ============================================================
-- SPECIALTIES: Public read, admin write
-- ============================================================
CREATE POLICY "Anyone can view specialties"
  ON public.specialties FOR SELECT
  USING (true);

CREATE POLICY "Admin can manage specialties"
  ON public.specialties FOR ALL
  USING (public.is_admin());

-- ============================================================
-- DOCTORS: Public read, owner update, admin full
-- ============================================================
CREATE POLICY "Anyone can view active doctors"
  ON public.doctors FOR SELECT
  USING (is_active = true);

CREATE POLICY "Doctors can update own profile"
  ON public.doctors FOR UPDATE
  USING (user_id = auth.uid());

CREATE POLICY "Admin can manage all doctors"
  ON public.doctors FOR ALL
  USING (public.is_admin());

-- ============================================================
-- SCHEDULES: Public read (for booking), doctor owner write
-- ============================================================
CREATE POLICY "Anyone can view schedules"
  ON public.schedules FOR SELECT
  USING (true);

CREATE POLICY "Doctors can manage own schedule"
  ON public.schedules FOR ALL
  USING (
    doctor_id IN (
      SELECT id FROM public.doctors WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Admin can manage all schedules"
  ON public.schedules FOR ALL
  USING (public.is_admin());

-- ============================================================
-- APPOINTMENTS: Patient sees own, doctor sees assigned
-- ============================================================
CREATE POLICY "Patients can view own appointments"
  ON public.appointments FOR SELECT
  USING (patient_id = auth.uid());

CREATE POLICY "Doctors can view their appointments"
  ON public.appointments FOR SELECT
  USING (
    doctor_id IN (
      SELECT id FROM public.doctors WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Patients can create appointments"
  ON public.appointments FOR INSERT
  WITH CHECK (patient_id = auth.uid());

CREATE POLICY "Patients can update own appointments"
  ON public.appointments FOR UPDATE
  USING (patient_id = auth.uid());

CREATE POLICY "Doctors can update their appointments"
  ON public.appointments FOR UPDATE
  USING (
    doctor_id IN (
      SELECT id FROM public.doctors WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Admin can manage all appointments"
  ON public.appointments FOR ALL
  USING (public.is_admin());

-- ============================================================
-- REVIEWS: Public read, patient insert own
-- ============================================================
CREATE POLICY "Anyone can view reviews"
  ON public.reviews FOR SELECT
  USING (true);

CREATE POLICY "Patients can create review for own appointment"
  ON public.reviews FOR INSERT
  WITH CHECK (patient_id = auth.uid());

-- No update/delete — reviews are immutable

-- ============================================================
-- HEALTH RECORDS: Only owner can see
-- ============================================================
CREATE POLICY "Users can view own health records"
  ON public.health_records FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can manage own health records"
  ON public.health_records FOR ALL
  USING (user_id = auth.uid());

-- ============================================================
-- FAMILY MEMBERS: Only owner can see
-- ============================================================
CREATE POLICY "Users can view own family members"
  ON public.family_members FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can manage own family members"
  ON public.family_members FOR ALL
  USING (user_id = auth.uid());

-- ============================================================
-- BANNERS: Public read, admin write
-- ============================================================
CREATE POLICY "Anyone can view active banners"
  ON public.banners FOR SELECT
  USING (is_active = true);

CREATE POLICY "Admin can manage banners"
  ON public.banners FOR ALL
  USING (public.is_admin());

-- ============================================================
-- CLINIC QUEUES: Public read (patients need to see queue), doctor/admin manage
-- ============================================================
CREATE POLICY "Anyone can view active queues"
  ON public.clinic_queues FOR SELECT
  USING (true);

CREATE POLICY "Doctors can manage own queue"
  ON public.clinic_queues FOR ALL
  USING (
    doctor_id IN (
      SELECT id FROM public.doctors WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Admin can manage all queues"
  ON public.clinic_queues FOR ALL
  USING (public.is_admin());

-- ============================================================
-- QUEUE ENTRIES: Patient sees own, doctor sees their queue
-- ============================================================
CREATE POLICY "Patients can view own queue entries"
  ON public.queue_entries FOR SELECT
  USING (patient_id = auth.uid());

CREATE POLICY "Anyone can view queue entries for position check"
  ON public.queue_entries FOR SELECT
  USING (
    queue_id IN (
      SELECT id FROM public.clinic_queues WHERE status = 'active'
    )
  );

CREATE POLICY "Authenticated users can join queue"
  ON public.queue_entries FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Patients can cancel own queue entry"
  ON public.queue_entries FOR UPDATE
  USING (patient_id = auth.uid());

CREATE POLICY "Doctors can manage their queue entries"
  ON public.queue_entries FOR ALL
  USING (
    queue_id IN (
      SELECT cq.id FROM public.clinic_queues cq
      JOIN public.doctors d ON d.id = cq.doctor_id
      WHERE d.user_id = auth.uid()
    )
  );

CREATE POLICY "Admin can manage all queue entries"
  ON public.queue_entries FOR ALL
  USING (public.is_admin());

-- ============================================================
-- Enable Realtime for queue tables (live updates!)
-- ============================================================
ALTER PUBLICATION supabase_realtime ADD TABLE public.clinic_queues;
ALTER PUBLICATION supabase_realtime ADD TABLE public.queue_entries;
