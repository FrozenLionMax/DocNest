import { create } from 'zustand';
import { Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

interface Profile {
  id: string;
  full_name: string;
  phone: string | null;
  gender: string | null;
  date_of_birth: string | null;
  address: string | null;
  city: string | null;
  avatar_url: string | null;
  language_pref: 'hi' | 'en';
  role: 'patient' | 'doctor' | 'admin';
  created_at: string;
}

interface AuthState {
  session: Session | null;
  profile: Profile | null;
  isLoading: boolean;
  isProfileComplete: boolean;

  setSession: (session: Session | null) => void;
  setProfile: (profile: Profile | null) => void;
  setLoading: (loading: boolean) => void;
  fetchProfile: () => Promise<Profile | null>;
  updateProfile: (updates: Partial<Profile>) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  session: null,
  profile: null,
  isLoading: true,
  isProfileComplete: false,

  setSession: (session) => set({ session }),

  setProfile: (profile) =>
    set({
      profile,
      isProfileComplete: !!(profile?.full_name && profile.full_name.trim() !== ''),
    }),

  setLoading: (isLoading) => set({ isLoading }),

  fetchProfile: async () => {
    const session = get().session;
    if (!session?.user) return null;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();

      if (data) {
        set({
          profile: data,
          isProfileComplete: !!(data.full_name && data.full_name.trim() !== ''),
        });
        return data;
      }
    } catch (err) {
      console.warn('Profile fetch error:', err);
    }
    return null;
  },

  updateProfile: (updates) => {
    const current = get().profile;
    if (current) {
      const updated = { ...current, ...updates };
      set({
        profile: updated,
        isProfileComplete: !!(updated.full_name && updated.full_name.trim() !== ''),
      });
    }
  },

  logout: () =>
    set({
      session: null,
      profile: null,
      isLoading: false,
      isProfileComplete: false,
    }),
}));
