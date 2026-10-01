'use client';

import React, { useState } from 'react';
import {
  Users,
  Search,
  Phone,
  FileText,
  AlertTriangle,
  Heart,
  Calendar,
  Pill,
  Clock,
  ChevronRight,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';

interface PatientRecord {
  phone: string;
  name: string;
  age: string;
  gender: string;
  bloodGroup: string;
  allergies: string[];
  chronic: string[];
  totalVisits: number;
  lastVisit: string;
  visits: Array<{
    date: string;
    diagnosis: string;
    medicinesSummary: string;
    vitals: string;
    advice: string;
    followUp: string;
  }>;
}

const PATIENTS_DATABASE: Record<string, PatientRecord> = {
  '9999888877': {
    phone: '9999888877',
    name: 'Rahul Sharma (राहुल शर्मा)',
    age: '32',
    gender: 'Male',
    bloodGroup: 'B+',
    allergies: ['Penicillin (पेनिसिलिन)', 'Dust / Pollen'],
    chronic: ['Type-2 Diabetes', 'Occasional Lumbar Sprain'],
    totalVisits: 4,
    lastVisit: '24 Sep 2026',
    visits: [
      {
        date: '24 Sep 2026',
        diagnosis: 'Acute Viral Cold & Body Pain (वायरल बुखार व दर्द)',
        medicinesSummary: 'Tab. Dolo 650, Tab. Pantocid 40, Tab. Allegra 120',
        vitals: 'BP: 124/82 mmHg • Pulse: 76 bpm • Temp: 99.4 °F',
        advice: 'Drink warm water. Rest for 3 days.',
        followUp: '01 Oct 2026',
      },
      {
        date: '10 Aug 2026',
        diagnosis: 'Acute Lumbar Muscle Sprain (कमर दर्द)',
        medicinesSummary: 'Tab. Zerodol-SP, Tab. Pan-D, Cap. Shelcal 500',
        vitals: 'BP: 120/80 mmHg • Pulse: 72 bpm • Weight: 68 kg',
        advice: 'Avoid lifting heavy items. Hot compress.',
        followUp: '17 Aug 2026',
      },
    ],
  },
  '9876543210': {
    phone: '9876543210',
    name: 'Sunita Devi (सुनीता देवी)',
    age: '48',
    gender: 'Female',
    bloodGroup: 'O+',
    allergies: ['Sulfa Drugs'],
    chronic: ['Hypertension (उच्च रक्तचाप)'],
    totalVisits: 6,
    lastVisit: '15 Sep 2026',
    visits: [
      {
        date: '15 Sep 2026',
        diagnosis: 'Knee Osteoarthritis Bilateral (घुटनों में दर्द व सूजन)',
        medicinesSummary: 'Tab. Zerodol-SP, Sachet Cholecalciferol 60k, Volini Gel',
        vitals: 'BP: 138/88 mmHg • Pulse: 78 bpm',
        advice: 'Physiotherapy knee exercises. Avoid sitting cross-legged.',
        followUp: '15 Oct 2026',
      },
    ],
  },
};

export default function DoctorPatientsPage() {
  const [searchPhone, setSearchPhone] = useState('9999888877');
  const [currentPatient, setCurrentPatient] = useState<PatientRecord | null>(
    PATIENTS_DATABASE['9999888877']
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = searchPhone.replace(/\D/g, '');
    if (PATIENTS_DATABASE[clean]) {
      setCurrentPatient(PATIENTS_DATABASE[clean]);
    } else {
      // Create new on-the-fly demo profile
      setCurrentPatient({
        phone: clean,
        name: `Walk-in Patient (${clean})`,
        age: '30',
        gender: 'Male',
        bloodGroup: 'Unknown',
        allergies: ['No known drug allergies reported'],
        chronic: ['None reported'],
        totalVisits: 1,
        lastVisit: 'Today',
        visits: [
          {
            date: 'Today',
            diagnosis: 'First Visit / Walk-in Consultation',
            medicinesSummary: 'Pending Consultation',
            vitals: 'BP: 120/80 mmHg • Pulse: 72 bpm',
            advice: 'Under evaluation',
            followUp: 'To be determined',
          },
        ],
      });
    }
  };

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-6xl mx-auto w-full font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Header */}
      <div className="flex flex-wrap justify-between items-center gap-4 bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-xl">
        <div>
          <h1 className="text-xl md:text-2xl font-black text-white tracking-tight flex items-center space-x-2">
            <Users className="w-7 h-7 text-emerald-400" />
            <span>Patient Medical Records & Lifetime History</span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">Search any patient by mobile number to review past prescriptions & vital charts</p>
        </div>

        <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-3.5 py-1.5 rounded-full">
          Encrypted Electronic Health Record (EHR)
        </span>
      </div>

      {/* Search Bar */}
      <form onSubmit={handleSearch} className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-wrap sm:flex-nowrap items-center gap-3">
        <div className="relative flex-1">
          <Phone className="w-5 h-5 absolute left-4 top-3.5 text-slate-400" />
          <input
            type="text"
            placeholder="Enter patient mobile number (e.g. 9999888877 or 9876543210)..."
            value={searchPhone}
            onChange={(e) => setSearchPhone(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 text-white rounded-2xl pl-12 pr-4 py-3 text-sm focus:outline-none focus:border-emerald-500 font-mono"
            required
          />
        </div>
        <button
          type="submit"
          className="bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold px-6 py-3.5 rounded-2xl text-xs flex items-center space-x-2 transition shadow-lg whitespace-nowrap"
        >
          <Search className="w-4 h-4" />
          <span>Lookup Patient Record</span>
        </button>
      </form>

      {/* Patient Profile Card (if found) */}
      {currentPatient && (
        <div className="space-y-6">
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div className="flex items-center space-x-3.5">
                <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-700 rounded-2xl flex items-center justify-center text-white text-2xl font-black shadow-lg">
                  {currentPatient.name.charAt(0)}
                </div>
                <div>
                  <h2 className="text-xl font-black text-white">{currentPatient.name}</h2>
                  <p className="text-xs text-slate-400 font-mono">
                    Mobile: <strong className="text-emerald-400">{currentPatient.phone}</strong> • Blood Group: <strong className="text-rose-400">{currentPatient.bloodGroup}</strong>
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3 text-xs">
                <div className="bg-slate-950 px-3.5 py-2 rounded-xl border border-slate-800 text-center">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Age / Gender</span>
                  <span className="text-white font-bold">{currentPatient.age} Y / {currentPatient.gender}</span>
                </div>
                <div className="bg-slate-950 px-3.5 py-2 rounded-xl border border-slate-800 text-center">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Total Visits</span>
                  <span className="text-emerald-400 font-bold font-mono">{currentPatient.totalVisits} Times</span>
                </div>
              </div>
            </div>

            {/* Allergies & Chronic Conditions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
                <span className="text-xs font-bold text-rose-400 uppercase tracking-wider flex items-center space-x-1.5">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Documented Drug Allergies (एलर्जी)</span>
                </span>
                <div className="flex flex-wrap gap-2">
                  {currentPatient.allergies.map((al, idx) => (
                    <span key={idx} className="bg-rose-500/15 border border-rose-500/30 text-rose-300 px-3 py-1 rounded-lg text-xs font-bold">
                      {al}
                    </span>
                  ))}
                </div>
              </div>

              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center space-x-1.5">
                  <Heart className="w-4 h-4" />
                  <span>Chronic Co-Morbidities (बीमारी इतिहास)</span>
                </span>
                <div className="flex flex-wrap gap-2">
                  {currentPatient.chronic.map((ch, idx) => (
                    <span key={idx} className="bg-amber-500/15 border border-amber-500/30 text-amber-300 px-3 py-1 rounded-lg text-xs font-bold">
                      {ch}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Past Consultations Table */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
            <h3 className="text-base font-black text-white flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-emerald-400" />
              <span>Prior Clinical Consultations ({currentPatient.visits.length} Records)</span>
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 uppercase font-black tracking-wider">
                    <th className="py-3 px-3">Date</th>
                    <th className="py-3 px-3">Diagnosis</th>
                    <th className="py-3 px-3">Prescribed Medications</th>
                    <th className="py-3 px-3">Vitals</th>
                    <th className="py-3 px-3">Advice & Follow-Up</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80 text-xs">
                  {currentPatient.visits.map((v, idx) => (
                    <tr key={idx} className="hover:bg-slate-800/40 transition">
                      <td className="py-3.5 px-3 font-mono font-bold text-emerald-400 whitespace-nowrap">{v.date}</td>
                      <td className="py-3.5 px-3 font-bold text-white max-w-xs">{v.diagnosis}</td>
                      <td className="py-3.5 px-3 text-slate-300">{v.medicinesSummary}</td>
                      <td className="py-3.5 px-3 font-mono text-slate-400 whitespace-nowrap">{v.vitals}</td>
                      <td className="py-3.5 px-3 text-slate-400">
                        <p>{v.advice}</p>
                        <p className="text-emerald-400 font-semibold mt-0.5">Next: {v.followUp}</p>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
