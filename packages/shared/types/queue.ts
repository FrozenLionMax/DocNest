/**
 * Live Clinic Queue System — Digital Token/Parchi
 * 
 * How it works (like offline system in Deoria clinics):
 * 
 * 1. Doctor/receptionist starts a queue for the day
 * 2. Patients join the queue (from app or at clinic)
 * 3. Each patient gets a token number (1, 2, 3, ...)
 * 4. App shows real-time: "Your Token: 15 | Now Serving: 8 | Wait: ~35 min"
 * 5. Doctor taps "Next" to advance the queue
 * 6. Patient gets push notification: "Aapka number aane wala hai!"
 * 
 * Uses Supabase Realtime for live updates — 
 * all patients see queue position change instantly.
 */

export type QueueStatus = 'active' | 'paused' | 'closed';
export type QueueEntryStatus = 'waiting' | 'in_consultation' | 'completed' | 'skipped' | 'cancelled';

/** One queue per doctor per day */
export interface ClinicQueue {
  id: string;
  doctor_id: string;
  queue_date: string;             // "2026-09-15"
  status: QueueStatus;            // active / paused (doctor on break) / closed (day over)
  current_token: number;          // Currently being served (e.g., 8)
  next_token: number;             // Next token to assign (e.g., 16 — means 15 patients joined)
  avg_consultation_minutes: number; // Average time per patient (auto-calculated)
  started_at: string | null;
  closed_at: string | null;
  created_at: string;
  // Joined
  doctor?: import('./doctor').Doctor;
  entries?: QueueEntry[];
}

/** Each patient in the queue */
export interface QueueEntry {
  id: string;
  queue_id: string;
  patient_id: string | null;      // null if walk-in without app
  token_number: number;           // 1, 2, 3, ...
  patient_name: string;           // Name (for walk-ins or family members)
  patient_phone: string | null;   // Phone (for SMS/WhatsApp notification)
  status: QueueEntryStatus;
  source: 'app' | 'walk_in';     // Joined via app or at clinic counter
  appointment_id: string | null;  // If linked to a pre-booked appointment
  joined_at: string;
  called_at: string | null;       // When doctor called this token
  completed_at: string | null;    // When consultation ended
  estimated_wait_minutes: number | null;
  notes: string | null;
}

/** Real-time queue info shown to patient */
export interface QueuePosition {
  your_token: number;
  current_token: number;
  people_ahead: number;
  estimated_wait_minutes: number;
  queue_status: QueueStatus;
  doctor_name: string;
  clinic_name: string;
}
