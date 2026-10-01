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

export async function loginWithPassword(emailOrPhone: string, password: string): Promise<{ user: DocNestUser | null; error: string | null }> {
  try {
    const isEmail = emailOrPhone.includes('@');
    const credentials: any = { password };
    if (isEmail) {
      credentials.email = emailOrPhone;
    } else {
      credentials.phone = `+91${emailOrPhone.replace(/\D/g, '')}`;
    }

    const { data, error } = await supabase.auth.signInWithPassword(credentials);

    if (error) {
      // Demo fallback users for development
      const demoUsers: Record<string, DocNestUser> = {
        'doctor': { id: 'doc-001', name: 'Dr. Amit Kumar', role: 'doctor', specialty: 'Orthopedic Surgeon', clinic: 'Gupta Clinic & Joint Care Center — Deoria Sadar', phone: '9876543210' },
        'compounder': { id: 'comp-001', name: 'Rajesh Pharmacist', role: 'compounder', clinic: 'Gupta Clinic Pharmacy — Deoria Sadar', phone: '9876543211' },
        'admin': { id: 'admin-001', name: 'Deoria Master Admin', role: 'admin', email: 'admin@docnest.in' },
        'patient': { id: 'pat-001', name: 'Rahul Sharma (राहुल शर्मा)', role: 'patient', phone: '9999888877', district: 'Deoria' },
        'field_agent': { id: 'agent-001', name: 'Suresh Kumar (सुरेश कुमार)', role: 'field_agent', phone: '9988776655', district: 'Deoria', block: 'Salempur', village: 'Rampur' },
        'block_coordinator': { id: 'block-001', name: 'Vijay Singh (विजय सिंह)', role: 'block_coordinator', phone: '9977665544', district: 'Deoria', block: 'Salempur' },
        'district_admin': { id: 'dc-001', name: 'District Collector HQ Deoria', role: 'district_admin', email: 'dc@docnest.in', district: 'Deoria' },
      };

      // Check demo credentials
      if (emailOrPhone === 'doctor@docnest.in' || emailOrPhone === '9876543210') {
        return { user: demoUsers['doctor'], error: null };
      }
      if (emailOrPhone === 'compounder@docnest.in' || emailOrPhone === '9876543211') {
        return { user: demoUsers['compounder'], error: null };
      }
      if (emailOrPhone === 'admin@docnest.in' || emailOrPhone === 'admin') {
        return { user: demoUsers['admin'], error: null };
      }
      if (emailOrPhone === 'patient@docnest.in' || emailOrPhone === '9999888877') {
        return { user: demoUsers['patient'], error: null };
      }
      if (emailOrPhone === 'agent@docnest.in' || emailOrPhone === '9988776655') {
        return { user: demoUsers['field_agent'], error: null };
      }
      if (emailOrPhone === 'block@docnest.in' || emailOrPhone === '9977665544') {
        return { user: demoUsers['block_coordinator'], error: null };
      }
      if (emailOrPhone === 'dc@docnest.in' || emailOrPhone === 'dc') {
        return { user: demoUsers['district_admin'], error: null };
      }

      return { user: null, error: error.message };
    }

    // Fetch profile with role
    const { data: profile } = await supabase
      .from('profiles')
      .select('role, full_name, district, block, village')
      .eq('id', data.user.id)
      .single();

    const role = (profile?.role || 'patient') as UserRole;
    const user: DocNestUser = {
      id: data.user.id,
      email: data.user.email || undefined,
      phone: data.user.phone || undefined,
      name: profile?.full_name || data.user.email || 'User',
      role,
      district: profile?.district,
      block: profile?.block,
      village: profile?.village,
    };

    return { user, error: null };
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
