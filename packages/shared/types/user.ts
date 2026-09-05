export type UserRole = 'patient' | 'doctor' | 'admin';
export type Gender = 'male' | 'female' | 'other';
export type LanguagePreference = 'hi' | 'en';

export interface Profile {
  id: string;
  full_name: string;
  phone: string;
  gender: Gender | null;
  date_of_birth: string | null;
  address: string | null;
  city: string | null;
  avatar_url: string | null;
  language_pref: LanguagePreference;
  role: UserRole;
  fcm_token: string | null;
  created_at: string;
  updated_at: string;
}

export interface FamilyMember {
  id: string;
  user_id: string;
  full_name: string;
  relation: string;
  gender: Gender;
  date_of_birth: string | null;
  phone: string | null;
  created_at: string;
}
