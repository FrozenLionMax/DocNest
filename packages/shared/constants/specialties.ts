/**
 * Medical specialties available in Deoria district.
 * Each specialty has English name, Hindi name, and a lucide icon name.
 */
export const SPECIALTIES = [
  { id: 'general', name_en: 'General Physician', name_hi: 'सामान्य चिकित्सक', icon_name: 'stethoscope', sort_order: 1 },
  { id: 'cardio', name_en: 'Cardiologist', name_hi: 'हृदय रोग विशेषज्ञ', icon_name: 'heart-pulse', sort_order: 2 },
  { id: 'ortho', name_en: 'Orthopedic', name_hi: 'हड्डी रोग विशेषज्ञ', icon_name: 'bone', sort_order: 3 },
  { id: 'gynae', name_en: 'Gynecologist', name_hi: 'स्त्री रोग विशेषज्ञ', icon_name: 'baby', sort_order: 4 },
  { id: 'pediatric', name_en: 'Pediatrician', name_hi: 'बाल रोग विशेषज्ञ', icon_name: 'smile', sort_order: 5 },
  { id: 'dental', name_en: 'Dentist', name_hi: 'दंत चिकित्सक', icon_name: 'scan-face', sort_order: 6 },
  { id: 'derma', name_en: 'Dermatologist', name_hi: 'त्वचा विशेषज्ञ', icon_name: 'hand', sort_order: 7 },
  { id: 'ent', name_en: 'ENT Specialist', name_hi: 'कान-नाक-गला विशेषज्ञ', icon_name: 'ear', sort_order: 8 },
  { id: 'eye', name_en: 'Ophthalmologist', name_hi: 'नेत्र विशेषज्ञ', icon_name: 'eye', sort_order: 9 },
  { id: 'neuro', name_en: 'Neurologist', name_hi: 'तंत्रिका विशेषज्ञ', icon_name: 'brain', sort_order: 10 },
  { id: 'uro', name_en: 'Urologist', name_hi: 'मूत्र रोग विशेषज्ञ', icon_name: 'activity', sort_order: 11 },
  { id: 'psych', name_en: 'Psychiatrist', name_hi: 'मनोचिकित्सक', icon_name: 'brain-cog', sort_order: 12 },
  { id: 'pulmo', name_en: 'Pulmonologist', name_hi: 'फेफड़े विशेषज्ञ', icon_name: 'wind', sort_order: 13 },
  { id: 'gastro', name_en: 'Gastroenterologist', name_hi: 'पेट रोग विशेषज्ञ', icon_name: 'pill', sort_order: 14 },
  { id: 'ayurveda', name_en: 'Ayurveda', name_hi: 'आयुर्वेदिक चिकित्सक', icon_name: 'leaf', sort_order: 15 },
] as const;

export type SpecialtyId = typeof SPECIALTIES[number]['id'];
