import { supabase } from './supabase';

export type UserRole = 'doctor' | 'compounder' | 'admin';

export interface DocNestUser {
  id: string;
  email?: string;
  phone?: string;
  name: string;
  role: UserRole;
  specialty?: string;
  clinic?: string;
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
      // Demo fallback for development
      const demoUsers: Record<string, DocNestUser> = {
        'doctor': { id: 'doc-001', name: 'Dr. Amit Kumar', role: 'doctor', specialty: 'Orthopedic Surgeon', clinic: 'Gupta Clinic & Joint Care Center — Deoria Sadar', phone: '9876543210' },
        'compounder': { id: 'comp-001', name: 'Rajesh Pharmacist', role: 'compounder', clinic: 'Gupta Clinic Pharmacy — Deoria Sadar', phone: '9876543211' },
        'admin': { id: 'admin-001', name: 'Deoria Master Admin', role: 'admin', email: 'admin@docnest.in' },
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

      return { user: null, error: error.message };
    }

    // Fetch profile with role
    const { data: profile } = await supabase
      .from('profiles')
      .select('role, full_name')
      .eq('id', data.user.id)
      .single();

    const role = (profile?.role || 'doctor') as UserRole;
    const user: DocNestUser = {
      id: data.user.id,
      email: data.user.email || undefined,
      phone: data.user.phone || undefined,
      name: profile?.full_name || data.user.email || 'User',
      role,
    };

    return { user, error: null };
  } catch (err: any) {
    return { user: null, error: err.message || 'Login failed' };
  }
}

export function saveSession(user: DocNestUser) {
  sessionStorage.setItem('docnest_session', JSON.stringify(user));
}

export function getSession(): DocNestUser | null {
  if (typeof window === 'undefined') return null;
  const str = sessionStorage.getItem('docnest_session');
  if (!str) return null;
  try {
    return JSON.parse(str) as DocNestUser;
  } catch {
    return null;
  }
}

export async function logout() {
  await supabase.auth.signOut().catch(() => null);
  sessionStorage.removeItem('docnest_session');
}
