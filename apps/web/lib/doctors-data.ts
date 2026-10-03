export interface DoctorProfile {
  id: string;
  name: string;
  specialty: string;
  qualifications: string;
  clinicName: string;
  clinicAddress: string;
  district: string;
  block: string;
  consultationFee: number;       // in ₹
  platformCommission: number;    // percentage (e.g. 25)
  morningSlot: string;           // "10:00 AM - 02:00 PM"
  eveningSlot: string;           // "05:00 PM - 08:00 PM"
  rating: number;                // 1-5
  totalPatients: number;
  isActive: boolean;
  phone: string;
  photoInitial: string;          // first letter for avatar
  bgGradient: string;            // color accent for avatar
  dailyTokenCap?: number;        // max tokens per shift
  offDays?: number[];            // 0=Sun, 1=Mon, etc.
  leaveDates?: string[];         // 'YYYY-MM-DD'
}

export const DOCTORS_DIRECTORY: DoctorProfile[] = [
  {
    id: 'doc-001',
    name: 'Dr. Amit Kumar',
    specialty: 'Orthopedic Surgeon',
    qualifications: 'M.B.B.S., M.S. (Ortho)',
    clinicName: 'Gupta Clinic & Joint Care Center',
    clinicAddress: 'Near Railway Overbridge, Deoria Sadar, U.P.',
    district: 'Deoria',
    block: 'Sadar',
    consultationFee: 300,
    platformCommission: 25,
    morningSlot: '10:00 AM - 02:00 PM',
    eveningSlot: '05:00 PM - 08:00 PM',
    rating: 4.8,
    totalPatients: 12400,
    isActive: true,
    phone: '9876543210',
    photoInitial: 'A',
    bgGradient: 'from-emerald-500 to-teal-700',
    dailyTokenCap: 35,
    offDays: [0], // Sunday closed
    leaveDates: [],
  },
  {
    id: 'doc-002',
    name: 'Dr. Priya Verma',
    specialty: 'General Medicine & Diabetes',
    qualifications: 'M.B.B.S., M.D. (Medicine)',
    clinicName: 'Verma Health Clinic',
    clinicAddress: 'Civil Lines, Deoria, U.P.',
    district: 'Deoria',
    block: 'Sadar',
    consultationFee: 250,
    platformCommission: 25,
    morningSlot: '09:00 AM - 01:00 PM',
    eveningSlot: '04:00 PM - 07:00 PM',
    rating: 4.6,
    totalPatients: 8900,
    isActive: true,
    phone: '9876543220',
    photoInitial: 'P',
    bgGradient: 'from-blue-500 to-indigo-700',
    dailyTokenCap: 40,
    offDays: [0],
    leaveDates: [],
  },
  {
    id: 'doc-003',
    name: 'Dr. Rajesh Pandey',
    specialty: 'Pediatrician (Child Specialist)',
    qualifications: 'M.B.B.S., D.C.H., D.N.B. (Pediatrics)',
    clinicName: 'Vatsalya Children Hospital',
    clinicAddress: 'Station Road, Deoria, U.P.',
    district: 'Deoria',
    block: 'Sadar',
    consultationFee: 300,
    platformCommission: 20,
    morningSlot: '10:00 AM - 01:30 PM',
    eveningSlot: '05:00 PM - 08:30 PM',
    rating: 4.9,
    totalPatients: 15200,
    isActive: true,
    phone: '9876543230',
    photoInitial: 'R',
    bgGradient: 'from-purple-500 to-violet-700',
    dailyTokenCap: 50,
    offDays: [],
    leaveDates: [],
  },
  {
    id: 'doc-004',
    name: 'Dr. Sunita Mishra',
    specialty: 'Gynecologist & Obstetrician',
    qualifications: 'M.B.B.S., M.S. (Obs & Gynae)',
    clinicName: 'Matritva Maternity Clinic',
    clinicAddress: 'Malviya Road, Deoria, U.P.',
    district: 'Deoria',
    block: 'Sadar',
    consultationFee: 400,
    platformCommission: 20,
    morningSlot: '11:00 AM - 02:00 PM',
    eveningSlot: '05:00 PM - 07:30 PM',
    rating: 4.7,
    totalPatients: 9800,
    isActive: true,
    phone: '9876543240',
    photoInitial: 'S',
    bgGradient: 'from-rose-500 to-pink-700',
    dailyTokenCap: 30,
    offDays: [0],
    leaveDates: [],
  },
  {
    id: 'doc-005',
    name: 'Dr. Alok Srivastava',
    specialty: 'ENT Specialist (Ear, Nose, Throat)',
    qualifications: 'M.B.B.S., M.S. (ENT)',
    clinicName: 'Srivastava ENT Care Center',
    clinicAddress: 'Salempur Road, Deoria, U.P.',
    district: 'Deoria',
    block: 'Salempur',
    consultationFee: 200,
    platformCommission: 25,
    morningSlot: '10:00 AM - 01:00 PM',
    eveningSlot: '04:30 PM - 07:30 PM',
    rating: 4.5,
    totalPatients: 6400,
    isActive: true,
    phone: '9876543250',
    photoInitial: 'A',
    bgGradient: 'from-cyan-500 to-teal-700',
    dailyTokenCap: 45,
    offDays: [2], // Tuesday closed
    leaveDates: [],
  },
  {
    id: 'doc-006',
    name: 'Dr. Neeraj Tripathi',
    specialty: 'Cardiologist & Heart Specialist',
    qualifications: 'M.B.B.S., M.D., D.M. (Cardiology)',
    clinicName: 'Hridayam Heart & Chest Clinic',
    clinicAddress: 'Civil Lines, Near Subhash Chowk, Deoria',
    district: 'Deoria',
    block: 'Sadar',
    consultationFee: 500,
    platformCommission: 20,
    morningSlot: '11:00 AM - 03:00 PM',
    eveningSlot: '06:00 PM - 09:00 PM',
    rating: 4.9,
    totalPatients: 11100,
    isActive: true,
    phone: '9876543260',
    photoInitial: 'N',
    bgGradient: 'from-amber-500 to-orange-700',
    dailyTokenCap: 25,
    offDays: [0],
    leaveDates: [],
  },
];
