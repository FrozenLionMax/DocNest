export type AppointmentStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';
export type AppointmentType = 'clinic' | 'video' | 'chat';
export type PaymentStatus = 'pending' | 'paid' | 'pay_at_clinic' | 'refunded' | 'failed';

export interface Appointment {
  id: string;
  patient_id: string;
  doctor_id: string;
  appointment_date: string;   // "2026-09-15"
  appointment_time: string;   // "10:00"
  type: AppointmentType;
  status: AppointmentStatus;
  fee_amount: number;
  payment_id: string | null;
  payment_status: PaymentStatus;
  notes: string | null;
  cancellation_reason: string | null;
  booked_for_name: string | null;      // If booked for family member
  booked_for_relation: string | null;
  created_at: string;
  // Joined data
  doctor?: import('./doctor').Doctor;
  patient?: import('./user').Profile;
  queue_entry?: QueueEntry;
}

export interface Review {
  id: string;
  patient_id: string;
  doctor_id: string;
  appointment_id: string;
  rating: number;     // 1-5
  comment: string;
  created_at: string;
  // Joined
  patient?: import('./user').Profile;
}
