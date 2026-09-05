/**
 * Deoria district data — blocks, areas, hospitals, emergency numbers.
 */

export const DEORIA_BLOCKS = [
  'Deoria Sadar',
  'Bhatpar Rani',
  'Rudrapur',
  'Salempur',
  'Pathardeva',
  'Barhaj',
  'Lar',
  'Gauri Bazar',
  'Rampur Karkhana',
  'Tarkulwa',
  'Baitalpur',
  'Bhatni Bazar',
  'Desai Deoria',
  'Bhagalpur',
  'Bankata',
  'Bharuhana',
] as const;

export const DEORIA_AREAS = [
  'Civil Lines',
  'Station Road',
  'Sadar Bazar',
  'Gandhi Chowk',
  'Collectorate Road',
  'Jail Road',
  'Kalika Mandir Road',
  'Churia Bazar',
  'Naya Tola',
  'Purani Bazar',
  'Medical College Road',
  'Bus Stand Area',
] as const;

export const EMERGENCY_NUMBERS = {
  ambulance_108: '108',
  police_100: '100',
  emergency_112: '112',
  district_hospital: '05568-222210',
  fire_brigade: '101',
  women_helpline: '181',
  child_helpline: '1098',
} as const;

/** Medicave business details */
export const MEDICAVE = {
  name: 'Medicave',
  whatsapp_number: '919XXXXXXXXX',  // TODO: Replace with real Medicave WhatsApp number
  phone: '9XXXXXXXXX',              // TODO: Replace with real number
  address: 'Deoria, Uttar Pradesh',
  tagline_en: 'Your trusted pharmacy in Deoria',
  tagline_hi: 'देवरिया की भरोसेमंद दवाई की दुकान',
} as const;
