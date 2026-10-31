'use client';

import { supabase } from './supabase';

export interface QueueEntry {
  id: string;
  doctorId: string;
  tokenNumber: number;
  patientName: string;
  patientPhone: string;
  time: string;
  status: 'waiting' | 'in_consultation' | 'completed' | 'skipped' | 'cancelled';
  source: 'online' | 'walk_in';
  ageGender?: string;
  allergies?: string[];
  notes?: string;
  paidStatus: 'paid' | 'unpaid_counter';
  paymentMode: string;
  totalAmount: number;
  date: string;
}

export interface ClinicQueueState {
  doctorId: string;
  currentToken: number;
  totalIssued: number;
  status: 'active' | 'paused' | 'closed';
  pauseReason?: string;
  date: string;
}

export interface MedicineItem {
  id?: string;
  name: string;
  dosage: string;
  duration: string;
  instructions?: string;
  timing?: string;
  price?: number;
}

export interface PrescriptionRecord {
  id: string;
  doctorId: string;
  doctorName: string;
  specialty?: string;
  patientName: string;
  patientPhone: string;
  patientAge?: string;
  patientGender?: string;
  diagnosis: string;
  advice: string;
  followUpDate: string;
  clinicName: string;
  tokenNumber: number;
  medicines: MedicineItem[];
  totalBill: number;
  status: 'pending' | 'dispensed';
  createdAt: string;
}

export interface AppointmentRecord {
  id: string;
  doctorId: string;
  doctorName: string;
  specialty: string;
  clinicName: string;
  address: string;
  date: string;
  slot: string;
  tokenNumber: number;
  patientName: string;
  patientPhone: string;
  patientEmail: string;
  status: 'confirmed' | 'completed' | 'cancelled';
  paidAmount: number;
  paymentMode: string;
  paymentStatus: 'paid' | 'unpaid_counter';
  hasPrescription?: boolean;
  createdAt: string;
}

// Storage keys
const QUEUE_KEY = 'docnest_queue_entries_v2';
const CLINIC_STATE_KEY = 'docnest_clinic_state_v2';
const RX_KEY = 'docnest_prescriptions_v2';
const APT_KEY = 'docnest_appointments_v2';

// Safe localStorage access
function getStorage<T>(key: string, defaultValue: T): T {
  if (typeof window === 'undefined') return defaultValue;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return defaultValue;
    return JSON.parse(raw) as T;
  } catch (e) {
    console.warn(`Error reading ${key} from storage:`, e);
    return defaultValue;
  }
}

function setStorage<T>(key: string, value: T) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
    broadcastEvent({ type: key, payload: value });
  } catch (e) {
    console.warn(`Error saving ${key} to storage:`, e);
  }
}

// Cross-tab Event Broadcast
let channel: BroadcastChannel | null = null;
if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
  try {
    channel = new BroadcastChannel('docnest-clinical-events');
  } catch (e) {
    console.warn('BroadcastChannel not supported');
  }
}

function broadcastEvent(data: { type: string; payload: any }) {
  if (channel) {
    try {
      channel.postMessage(data);
    } catch (e) {}
  }
}

export function subscribeToClinicalEvents(callback: (data: { type: string; payload: any }) => void): () => void {
  if (typeof window === 'undefined') return () => {};

  const handleMessage = (e: MessageEvent) => {
    if (e.data) callback(e.data);
  };

  const handleStorage = (e: StorageEvent) => {
    if (e.key && e.newValue) {
      try {
        callback({ type: e.key, payload: JSON.parse(e.newValue) });
      } catch (err) {}
    }
  };

  if (channel) {
    channel.addEventListener('message', handleMessage);
  }
  window.addEventListener('storage', handleStorage);

  return () => {
    if (channel) {
      channel.removeEventListener('message', handleMessage);
    }
    window.removeEventListener('storage', handleStorage);
  };
}

// Initial Seed Data
const INITIAL_DOCTOR_ID = 'doc-001';

const SEED_QUEUE: QueueEntry[] = [
  {
    id: 'q-1',
    doctorId: INITIAL_DOCTOR_ID,
    tokenNumber: 1,
    patientName: 'Rahul Sharma (राहुल शर्मा)',
    patientPhone: '9876543210',
    time: '10:00 AM',
    status: 'in_consultation',
    source: 'online',
    ageGender: '32 / Male',
    allergies: ['Penicillin'],
    notes: 'Chronic knee joint pain and inflammation.',
    paidStatus: 'paid',
    paymentMode: 'Online UPI',
    totalAmount: 375,
    date: new Date().toISOString().split('T')[0],
  },
  {
    id: 'q-2',
    doctorId: INITIAL_DOCTOR_ID,
    tokenNumber: 2,
    patientName: 'Priya Singh (प्रिया सिंह)',
    patientPhone: '9812345678',
    time: '10:15 AM',
    status: 'waiting',
    source: 'online',
    ageGender: '28 / Female',
    allergies: ['None'],
    notes: 'Stiffness in right knee on stair climbing.',
    paidStatus: 'unpaid_counter',
    paymentMode: 'Pay at Clinic',
    totalAmount: 375,
    date: new Date().toISOString().split('T')[0],
  },
  {
    id: 'q-3',
    doctorId: INITIAL_DOCTOR_ID,
    tokenNumber: 3,
    patientName: 'Amitabh Mishra (अमिताभ मिश्रा)',
    patientPhone: '9988776655',
    time: '10:30 AM',
    status: 'waiting',
    source: 'walk_in',
    ageGender: '45 / Male',
    allergies: ['Dust / Pollen'],
    notes: 'Walk-in slip for shoulder ache.',
    paidStatus: 'paid',
    paymentMode: 'Cash at Counter',
    totalAmount: 300,
    date: new Date().toISOString().split('T')[0],
  },
  {
    id: 'q-4',
    doctorId: INITIAL_DOCTOR_ID,
    tokenNumber: 4,
    patientName: 'Sunita Devi (सुनीता देवी)',
    patientPhone: '9765432109',
    time: '10:45 AM',
    status: 'waiting',
    source: 'walk_in',
    ageGender: '52 / Female',
    allergies: ['Sulfa drugs'],
    notes: 'Cervical spondylosis follow-up check.',
    paidStatus: 'unpaid_counter',
    paymentMode: 'Pay at Clinic',
    totalAmount: 300,
    date: new Date().toISOString().split('T')[0],
  },
];

const SEED_PRESCRIPTIONS: PrescriptionRecord[] = [
  {
    id: 'rx-seed-1',
    doctorId: 'doc-001',
    doctorName: 'Dr. Amit Kumar',
    specialty: 'Orthopedic Surgeon',
    patientName: 'Rahul Sharma (राहुल शर्मा)',
    patientPhone: '9876543210',
    patientAge: '32',
    patientGender: 'Male',
    diagnosis: 'Acute Joint Pain & Cervical Strain',
    advice: 'Avoid heavy weight lifting for 7 days. Cold compress twice daily.',
    followUpDate: '2026-11-10',
    clinicName: 'Gupta Clinic & Joint Care Center',
    tokenNumber: 1,
    medicines: [
      { id: 'm-1', name: 'Tab Zerodol-SP', dosage: '1-0-1', duration: '5 days', instructions: 'After food', price: 120 },
      { id: 'm-2', name: 'Tab Pan-40', dosage: '1-0-0', duration: '7 days', instructions: 'Empty stomach', price: 95 },
      { id: 'm-3', name: 'Sachet Cholecalciferol (60k UI)', dosage: 'Once a week', duration: '4 weeks', instructions: 'With warm milk', price: 140 },
    ],
    totalBill: 355,
    status: 'pending',
    createdAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
  },
];

// --- Clinical Store API ---

export function getQueueEntries(doctorId: string = INITIAL_DOCTOR_ID): QueueEntry[] {
  const entries = getStorage<QueueEntry[]>(QUEUE_KEY, SEED_QUEUE);
  return entries.filter(e => e.doctorId === doctorId || !e.doctorId);
}

export function getClinicState(doctorId: string = INITIAL_DOCTOR_ID): ClinicQueueState {
  const defaultState: ClinicQueueState = {
    doctorId,
    currentToken: 1,
    totalIssued: 4,
    status: 'active',
    date: new Date().toISOString().split('T')[0],
  };
  const allStates = getStorage<Record<string, ClinicQueueState>>(CLINIC_STATE_KEY, {});
  return allStates[doctorId] || defaultState;
}

export function saveClinicState(state: ClinicQueueState) {
  const allStates = getStorage<Record<string, ClinicQueueState>>(CLINIC_STATE_KEY, {});
  allStates[state.doctorId] = state;
  setStorage(CLINIC_STATE_KEY, allStates);
}

export function advanceDoctorToken(doctorId: string = INITIAL_DOCTOR_ID): { currentToken: number; nextPatientName?: string } {
  const entries = getStorage<QueueEntry[]>(QUEUE_KEY, SEED_QUEUE);
  const state = getClinicState(doctorId);
  const nextVal = state.currentToken + 1;

  const updatedEntries = entries.map(p => {
    if (p.doctorId === doctorId || !p.doctorId) {
      if (p.tokenNumber === state.currentToken) return { ...p, status: 'completed' as const };
      if (p.tokenNumber === nextVal) return { ...p, status: 'in_consultation' as const };
    }
    return p;
  });

  setStorage(QUEUE_KEY, updatedEntries);

  const updatedState: ClinicQueueState = {
    ...state,
    currentToken: nextVal,
    totalIssued: Math.max(state.totalIssued, nextVal),
  };
  saveClinicState(updatedState);

  const nextPatient = updatedEntries.find(p => p.tokenNumber === nextVal && (p.doctorId === doctorId || !p.doctorId));

  return { currentToken: nextVal, nextPatientName: nextPatient?.patientName };
}

export function toggleQueueStatus(doctorId: string = INITIAL_DOCTOR_ID): 'active' | 'paused' {
  const state = getClinicState(doctorId);
  const nextStatus = state.status === 'active' ? 'paused' : 'active';
  const updatedState: ClinicQueueState = { ...state, status: nextStatus };
  saveClinicState(updatedState);
  return nextStatus;
}

export function resetQueue(doctorId: string = INITIAL_DOCTOR_ID) {
  const state = getClinicState(doctorId);
  const updatedState: ClinicQueueState = { ...state, currentToken: 1 };
  saveClinicState(updatedState);
}

export function updateQueueEntryStatus(entryId: string, newStatus: QueueEntry['status']) {
  const entries = getStorage<QueueEntry[]>(QUEUE_KEY, SEED_QUEUE);
  const updated = entries.map(e => e.id === entryId ? { ...e, status: newStatus } : e);
  setStorage(QUEUE_KEY, updated);
}

export function addWalkInPatient(
  doctorId: string = INITIAL_DOCTOR_ID,
  patientName: string,
  patientPhone: string = ''
): QueueEntry {
  const entries = getStorage<QueueEntry[]>(QUEUE_KEY, SEED_QUEUE);
  const docEntries = entries.filter(e => e.doctorId === doctorId || !e.doctorId);
  const maxToken = docEntries.length > 0 ? Math.max(...docEntries.map(e => e.tokenNumber)) : 0;
  const newToken = maxToken + 1;

  const newEntry: QueueEntry = {
    id: `q-off-${Date.now()}`,
    doctorId,
    tokenNumber: newToken,
    patientName,
    patientPhone: patientPhone || 'N/A',
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    status: 'waiting',
    source: 'walk_in',
    ageGender: 'Adult',
    paidStatus: 'paid',
    paymentMode: 'Cash at Counter',
    totalAmount: 300,
    date: new Date().toISOString().split('T')[0],
  };

  const updatedEntries = [...entries, newEntry];
  setStorage(QUEUE_KEY, updatedEntries);

  const state = getClinicState(doctorId);
  saveClinicState({
    ...state,
    totalIssued: Math.max(state.totalIssued, newToken),
  });

  return newEntry;
}

// --- Booking Engine ---

export interface BookAppointmentInput {
  doctorId: string;
  doctorName: string;
  specialty: string;
  clinicName: string;
  address: string;
  date: string;
  slot: string;
  patientName: string;
  patientPhone: string;
  patientEmail: string;
  patientAge: string;
  patientGender: string;
  allergies?: string;
  paymentMode: 'online_upi' | 'pay_at_clinic';
  consultationFee: number;
  platformFee: number;
}

export function bookAppointment(input: BookAppointmentInput): {
  appointment: AppointmentRecord;
  queueEntry: QueueEntry;
} {
  const entries = getStorage<QueueEntry[]>(QUEUE_KEY, SEED_QUEUE);
  const docEntries = entries.filter(e => e.doctorId === input.doctorId || !e.doctorId);
  const maxToken = docEntries.length > 0 ? Math.max(...docEntries.map(e => e.tokenNumber)) : 0;
  const newToken = maxToken + 1;

  const totalAmount = input.consultationFee + (input.paymentMode === 'online_upi' ? input.platformFee : 0);
  const paidStatus = input.paymentMode === 'online_upi' ? 'paid' : 'unpaid_counter';
  const paymentModeLabel = input.paymentMode === 'online_upi' ? 'Online UPI (Razorpay)' : 'Pay at Clinic Counter (Cash/UPI)';

  // 1. Create Queue Entry for Doctor Screen & TV
  const newQueueEntry: QueueEntry = {
    id: `q-on-${Date.now()}`,
    doctorId: input.doctorId,
    tokenNumber: newToken,
    patientName: input.patientName,
    patientPhone: input.patientPhone,
    time: input.slot.includes('Morning') ? '11:00 AM' : '05:30 PM',
    status: 'waiting',
    source: 'online',
    ageGender: `${input.patientAge} / ${input.patientGender}`,
    allergies: input.allergies && input.allergies !== 'None' ? [input.allergies] : undefined,
    notes: `Online booking via drugs.systems. Slot: ${input.slot}`,
    paidStatus,
    paymentMode: paymentModeLabel,
    totalAmount,
    date: input.date,
  };

  const updatedEntries = [...entries, newQueueEntry];
  setStorage(QUEUE_KEY, updatedEntries);

  const state = getClinicState(input.doctorId);
  saveClinicState({
    ...state,
    totalIssued: Math.max(state.totalIssued, newToken),
  });

  // 2. Create Appointment Record for Patient History
  const appointments = getStorage<AppointmentRecord[]>(APT_KEY, []);
  const newAppointment: AppointmentRecord = {
    id: `apt-${Date.now()}`,
    doctorId: input.doctorId,
    doctorName: input.doctorName,
    specialty: input.specialty,
    clinicName: input.clinicName,
    address: input.address,
    date: input.date,
    slot: input.slot,
    tokenNumber: newToken,
    patientName: input.patientName,
    patientPhone: input.patientPhone,
    patientEmail: input.patientEmail,
    status: 'confirmed',
    paidAmount: totalAmount,
    paymentMode: paymentModeLabel,
    paymentStatus: paidStatus,
    hasPrescription: false,
    createdAt: new Date().toISOString(),
  };

  setStorage(APT_KEY, [newAppointment, ...appointments]);

  // Try saving to Supabase asynchronously if online
  if (typeof window !== 'undefined') {
    (async () => {
      try {
        await supabase.from('appointments').insert([{
          doctor_id: input.doctorId,
          patient_name: input.patientName,
          patient_phone: input.patientPhone,
          appointment_date: input.date,
          token_number: newToken,
          status: 'confirmed',
          fee: totalAmount,
        }]);
      } catch (e) {}
    })();
  }

  return { appointment: newAppointment, queueEntry: newQueueEntry };
}

export function getPatientAppointments(phone?: string): AppointmentRecord[] {
  const list = getStorage<AppointmentRecord[]>(APT_KEY, []);
  if (!phone) return list;
  const clean = phone.replace(/\D/g, '');
  return list.filter(a => a.patientPhone.replace(/\D/g, '').includes(clean));
}

// --- Prescriptions & Pharmacy Pipeline ---

export function savePrescription(prescription: Omit<PrescriptionRecord, 'id' | 'createdAt' | 'status' | 'totalBill'>): PrescriptionRecord {
  const allRx = getStorage<PrescriptionRecord[]>(RX_KEY, SEED_PRESCRIPTIONS);

  const calculatedBill = prescription.medicines.reduce((sum, m) => sum + (m.price || 95), 0);

  const newRecord: PrescriptionRecord = {
    ...prescription,
    id: `rx-${Date.now()}`,
    totalBill: calculatedBill,
    status: 'pending',
    createdAt: new Date().toISOString(),
  };

  const updated = [newRecord, ...allRx];
  setStorage(RX_KEY, updated);

  // Update appointment record to reflect hasPrescription = true
  const appointments = getStorage<AppointmentRecord[]>(APT_KEY, []);
  const updatedApts = appointments.map(a => {
    if (a.tokenNumber === prescription.tokenNumber || a.patientName === prescription.patientName) {
      return { ...a, hasPrescription: true, status: 'completed' as const };
    }
    return a;
  });
  setStorage(APT_KEY, updatedApts);

  return newRecord;
}

export function getPrescriptionsForPharmacy(): PrescriptionRecord[] {
  return getStorage<PrescriptionRecord[]>(RX_KEY, SEED_PRESCRIPTIONS);
}

export function markPrescriptionDispensed(rxId: string): PrescriptionRecord[] {
  const allRx = getStorage<PrescriptionRecord[]>(RX_KEY, SEED_PRESCRIPTIONS);
  const updated = allRx.map(rx => rx.id === rxId ? { ...rx, status: 'dispensed' as const } : rx);
  setStorage(RX_KEY, updated);
  return updated;
}
