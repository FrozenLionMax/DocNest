-- Migration 004: Prescriptions, Pharmacy Orders, Schema Refinements & RLS Policies

-- 1. Prescriptions Table
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

-- 2. Prescription Items Table
CREATE TABLE IF NOT EXISTS public.prescription_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    prescription_id UUID REFERENCES public.prescriptions(id) ON DELETE CASCADE,
    medicine_name TEXT NOT NULL,
    dosage TEXT NOT NULL, -- e.g. "1-0-1 (सुबह - शाम)"
    duration TEXT NOT NULL, -- e.g. "5 दिन"
    instructions TEXT, -- e.g. "खाने के बाद"
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Medicave Pharmacy Orders Table
CREATE TABLE IF NOT EXISTS public.medicave_orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    prescription_id UUID REFERENCES public.prescriptions(id) ON DELETE SET NULL,
    patient_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    delivery_address TEXT NOT NULL,
    items_summary TEXT NOT NULL,
    total_amount NUMERIC(10, 2) DEFAULT 0.00,
    status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'processing', 'out_for_delivery', 'delivered', 'cancelled'
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Foreign Key and Structural Refinements
ALTER TABLE public.appointments 
ADD COLUMN IF NOT EXISTS family_member_id UUID REFERENCES public.family_members(id) ON DELETE SET NULL;

ALTER TABLE public.health_records 
ADD COLUMN IF NOT EXISTS doctor_id UUID REFERENCES public.doctors(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS appointment_id UUID REFERENCES public.appointments(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS prescription_id UUID REFERENCES public.prescriptions(id) ON DELETE SET NULL;

-- 5. Fix Schedule Constraint for Split Shifts
ALTER TABLE public.schedules DROP CONSTRAINT IF EXISTS schedules_doctor_id_day_of_week_key;
ALTER TABLE public.schedules ADD CONSTRAINT schedules_doctor_day_start_unique UNIQUE (doctor_id, day_of_week, start_time);

-- 6. Ensure doctors table has UNIQUE(user_id)
ALTER TABLE public.doctors ADD CONSTRAINT doctors_user_id_unique UNIQUE (user_id);

-- 7. Enable RLS on New Tables
ALTER TABLE public.prescriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prescription_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.medicave_orders ENABLE ROW LEVEL SECURITY;

-- 8. RLS Policies for Prescriptions
CREATE POLICY "Patients can view their own prescriptions" 
ON public.prescriptions FOR SELECT 
USING (patient_id = auth.uid() OR auth.uid() IN (SELECT user_id FROM public.doctors WHERE id = prescriptions.doctor_id) OR public.is_admin());

CREATE POLICY "Doctors can create prescriptions" 
ON public.prescriptions FOR INSERT 
WITH CHECK (auth.uid() IN (SELECT user_id FROM public.doctors WHERE id = prescriptions.doctor_id) OR public.is_admin());

CREATE POLICY "Doctors can update their prescriptions" 
ON public.prescriptions FOR UPDATE 
USING (auth.uid() IN (SELECT user_id FROM public.doctors WHERE id = prescriptions.doctor_id) OR public.is_admin());

-- RLS Policies for Prescription Items
CREATE POLICY "Prescription items viewable by prescription viewers" 
ON public.prescription_items FOR SELECT 
USING (EXISTS (
    SELECT 1 FROM public.prescriptions p 
    WHERE p.id = prescription_items.prescription_id 
    AND (p.patient_id = auth.uid() OR auth.uid() IN (SELECT user_id FROM public.doctors WHERE id = p.doctor_id) OR public.is_admin())
));

CREATE POLICY "Doctors can insert prescription items" 
ON public.prescription_items FOR INSERT 
WITH CHECK (EXISTS (
    SELECT 1 FROM public.prescriptions p 
    WHERE p.id = prescription_items.prescription_id 
    AND (auth.uid() IN (SELECT user_id FROM public.doctors WHERE id = p.doctor_id) OR public.is_admin())
));

-- RLS Policies for Medicave Orders
CREATE POLICY "Patients can view their own pharmacy orders" 
ON public.medicave_orders FOR SELECT 
USING (patient_id = auth.uid() OR public.is_admin());

CREATE POLICY "Patients can create pharmacy orders" 
ON public.medicave_orders FOR INSERT 
WITH CHECK (patient_id = auth.uid() OR public.is_admin());

CREATE POLICY "Admins can update pharmacy orders" 
ON public.medicave_orders FOR UPDATE 
USING (public.is_admin());

-- 9. Add to Realtime Publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.prescriptions;
ALTER PUBLICATION supabase_realtime ADD TABLE public.medicave_orders;
ALTER PUBLICATION supabase_realtime ADD TABLE public.queue_entries;
