export interface Specialty {
  id: string;
  name_en: string;
  name_hi: string;
  icon_name: string;
  sort_order: number;
  is_active: boolean;
}

export interface Doctor {
  id: string;
  user_id: string;
  full_name: string;
  phone: string;
  specialization: string;
  specialty_id: string;
  qualification: string;
  registration_number: string;
  experience_years: number;
  consultation_fee: number;
  clinic_name: string;
  clinic_address: string;
  latitude: number | null;
  longitude: number | null;
  photo_url: string | null;
  bio: string | null;
  is_verified: boolean;
  is_active: boolean;
  avg_rating: number;
  total_reviews: number;
  created_at: string;
  updated_at: string;
  // Joined data
  specialty?: Specialty;
  schedules?: Schedule[];
}

export interface Schedule {
  id: string;
  doctor_id: string;
  day_of_week: number; // 0=Sunday, 1=Monday, ..., 6=Saturday
  start_time: string;  // "09:00"
  end_time: string;    // "13:00"
  slot_duration_minutes: number; // 15, 20, 30
  is_active: boolean;
}

export interface TimeSlot {
  time: string;        // "09:00"
  available: boolean;
  appointment_id?: string; // if booked
}
