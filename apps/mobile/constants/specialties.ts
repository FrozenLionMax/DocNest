/**
 * Medical specialties available in Deoria district.
 * Each specialty has English name, Hindi name, and a lucide icon name.
 */
export const SPECIALTIES = [
  { id: 'general', name_en: 'General Physician', name_hi: 'सामान्य चिकित्सक', icon: 'Stethoscope' },
  { id: 'ortho', name_en: 'Orthopedic', name_hi: 'हड्डी रोग विशेषज्ञ', icon: 'Bone' },
  { id: 'gyno', name_en: 'Gynecologist', name_hi: 'स्त्री रोग विशेषज्ञ', icon: 'UserCheck' },
  { id: 'pedia', name_en: 'Pediatrician', name_hi: 'बाल रोग विशेषज्ञ', icon: 'Baby' },
  { id: 'derma', name_en: 'Dermatologist', name_hi: 'त्वचा विशेषज्ञ', icon: 'Sparkles' },
  { id: 'cardio', name_en: 'Cardiologist', name_hi: 'हृदय रोग विशेषज्ञ', icon: 'Heart' },
  { id: 'ent', name_en: 'ENT Specialist', name_hi: 'कान-नाक-गला विशेषज्ञ', icon: 'Ear' },
  { id: 'eye', name_en: 'Ophthalmologist', name_hi: 'नेत्र विशेषज्ञ', icon: 'Eye' },
  { id: 'neuro', name_en: 'Neurologist', name_hi: 'तंत्रिका रोग विशेषज्ञ', icon: 'Activity' },
  { id: 'dentist', name_en: 'Dentist', name_hi: 'दंत चिकित्सक', icon: 'Smile' },
  { id: 'urology', name_en: 'Urologist', name_hi: 'मूत्र रोग विशेषज्ञ', icon: 'Activity' },
  { id: 'ayurveda', name_en: 'Ayurveda', name_hi: 'आयुर्वेदिक चिकित्सक', icon: 'Leaf' },
] as const;

export type SpecialtyId = typeof SPECIALTIES[number]['id'];
