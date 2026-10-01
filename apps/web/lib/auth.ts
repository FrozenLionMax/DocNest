import { supabase } from './supabase';

export type UserRole = 
  | 'doctor' 
  | 'compounder' 
  | 'admin' 
  | 'patient' 
  | 'field_agent' 
  | 'block_coordinator' 
  | 'district_admin';

export interface DocNestUser {
  id: string;
  email?: string;
  phone?: string;
  name: string;
  role: UserRole;
  specialty?: string;
  clinic?: string;
  district?: string;
  block?: string;
  village?: string;
}

export async function loginWithPassword(emailOrPhone: string, password?: string): Promise<{ user: DocNestUser | null; error: string | null }> {
  try {
    const input = (emailOrPhone || '').trim().toLowerCase();

    // Default users dictionary
    const demoUsers: Record<string, DocNestUser> = {
      'doctor': { id: 'doc-001', name: 'Dr. Amit Kumar', role: 'doctor', specialty: 'Orthopedic Surgeon', clinic: 'Gupta Clinic & Joint Care Center — Deoria Sadar', phone: '9876543210', email: 'doctor@docnest.in' },
      'compounder': { id: 'comp-001', name: 'Rajesh Pharmacist', role: 'compounder', clinic: 'Gupta Clinic Pharmacy — Deoria Sadar', phone: '9876543211', email: 'compounder@docnest.in' },
      'admin': { id: 'admin-001', name: 'Deoria Master Admin', role: 'admin', email: 'admin@docnest.in' },
      'patient': { id: 'pat-001', name: 'Rahul Sharma (राहुल शर्मा)', role: 'patient', phone: '9999888877', district: 'Deoria', email: 'patient@docnest.in' },
      'agent': { id: 'agent-001', name: 'Suresh Kumar (सुरेश कुमार)', role: 'field_agent', phone: '9988776655', district: 'Deoria', block: 'Salempur', village: 'Rampur', email: 'agent@docnest.in' },
      'block': { id: 'block-001', name: 'Vijay Singh (विजय सिंह)', role: 'block_coordinator', phone: '9977665544', district: 'Deoria', block: 'Salempur', email: 'block@docnest.in' },
      'dc': { id: 'dc-001', name: 'District Operations Head / MD (DocNest)', role: 'district_admin', email: 'dc@docnest.in', district: 'Deoria' },
    };

    // If blank or empty login input, default directly to patient
    if (!input) {
      return { user: demoUsers['patient'], error: null };
    }

    // Direct role keyword matching
    if (demoUsers[input]) {
      return { user: demoUsers[input], error: null };
    }

    // Match by email or phone
    if (input.includes('doctor') || input === '9876543210') return { user: demoUsers['doctor'], error: null };
    if (input.includes('compounder') || input.includes('pharm') || input === '9876543211') return { user: demoUsers['compounder'], error: null };
    if (input.includes('admin') && !input.includes('dc')) return { user: demoUsers['admin'], error: null };
    if (input.includes('agent') || input === '9988776655') return { user: demoUsers['agent'], error: null };
    if (input.includes('block') || input === '9977665544') return { user: demoUsers['block'], error: null };
    if (input.includes('dc') || input.includes('district') || input.includes('coordinator') || input.includes('md') || input.includes('ceo')) return { user: demoUsers['dc'], error: null };
    if (input.includes('patient') || input === '9999888877') return { user: demoUsers['patient'], error: null };

    // Any phone number or other user identifier defaults to verified patient user profile
    const customPatient: DocNestUser = {
      id: `pat-${Date.now()}`,
      name: input.includes('@') ? input.split('@')[0] : `Patient (${input})`,
      role: 'patient',
      phone: input.replace(/\D/g, '') || '9999888877',
      email: input.includes('@') ? input : undefined,
      district: 'Deoria',
    };

    return { user: customPatient, error: null };
  } catch (err: any) {
    return { user: null, error: err.message || 'Login failed' };
  }
}

export function saveSession(user: DocNestUser) {
  if (typeof window !== 'undefined') {
    sessionStorage.setItem('docnest_session', JSON.stringify(user));
    localStorage.setItem('docnest_session', JSON.stringify(user));
  }
}

export function getSession(): DocNestUser | null {
  if (typeof window === 'undefined') return null;
  const str = sessionStorage.getItem('docnest_session') || localStorage.getItem('docnest_session');
  if (!str) return null;
  try {
    return JSON.parse(str) as DocNestUser;
  } catch {
    return null;
  }
}

export async function logout() {
  await supabase.auth.signOut().catch(() => null);
  if (typeof window !== 'undefined') {
    sessionStorage.removeItem('docnest_session');
    localStorage.removeItem('docnest_session');
  }
}
