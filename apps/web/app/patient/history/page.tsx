'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { getSession } from '../../../lib/auth';
import {
  ChevronLeft,
  FileText,
  User,
  Heart,
  AlertTriangle,
  Calendar,
  Pill,
  ChevronDown,
  ChevronUp,
  Activity,
  Stethoscope,
  Settings,
  Printer,
  Sparkles
} from 'lucide-react';
import { LanguageTogglePill } from '../../../components/LanguageContext';
import { ThemeTogglePill } from '../../../components/ThemeContext';
import NavControls from '../../../components/NavControls';

export default function PatientHistoryPage() {
  const [expandedVisitId, setExpandedVisitId] = useState<string | null>('v-1');
  const [session, setSession] = useState<any>(null);
  useEffect(() => { setSession(getSession()); }, []);
  const phone = session?.phone || '9999888877';

  const patientProfile = {
    name: session?.name || 'Rahul Sharma (राहुल शर्मा)',
    phone: phone,
    age: '32',
    gender: 'Male',
    bloodGroup: 'B+',
    allergies: ['Penicillin (पेनिसिलिन)', 'Dust / Pollen'],
    chronicConditions: ['Type-2 Diabetes (Controlled)', 'Occasional Lumbar Sprain'],
  };

  const initialVisits = [
    {
      id: 'v-1',
      date: '24 Sep 2026',
      doctor: 'Dr. Priya Verma (General Medicine)',
      clinic: 'Verma Health Clinic, Civil Lines',
      diagnosis: 'Acute Viral Cold & Body Pain (वायरल बुखार व शरीर दर्द)',
      vitals: 'BP: 124/82 mmHg • Pulse: 76 bpm • Temp: 99.4 °F',
      advice: 'Drink warm water. Rest for 3 days. Light diet.',
      followUp: '01 Oct 2026',
      medicines: [
        { name: 'Tab. Dolo 650mg (Paracetamol)', dosage: '1-0-1', duration: '3 Days', timing: 'After Food' },
        { name: 'Tab. Pantocid 40mg (Pantoprazole)', dosage: '1-0-0', duration: '5 Days', timing: 'Empty Stomach' },
        { name: 'Tab. Allegra 120mg (Fexofenadine)', dosage: '0-0-1', duration: '5 Days', timing: 'Night' },
      ],
    },
    {
      id: 'v-2',
      date: '10 Aug 2026',
      doctor: 'Dr. Amit Kumar (Orthopedic Surgeon)',
      clinic: 'Gupta Clinic & Joint Care Center',
      diagnosis: 'Acute Lumbar Muscle Sprain (कमर की मांसपेशियों में खिंचाव)',
      vitals: 'BP: 120/80 mmHg • Pulse: 72 bpm • Weight: 68 kg',
      advice: 'Avoid lifting heavy objects. Apply warm compress morning & evening.',
      followUp: '17 Aug 2026',
      medicines: [
        { name: 'Tab. Zerodol-SP (Aceclofenac + Serratiopeptidase)', dosage: '1-0-1', duration: '5 Days', timing: 'After Food' },
        { name: 'Tab. Pan-D (Pantoprazole + Domperidone)', dosage: '1-0-0', duration: '7 Days', timing: 'Empty Stomach' },
        { name: 'Cap. Shelcal 500 (Calcium + Vit D3)', dosage: '0-0-1', duration: '30 Days', timing: 'After Dinner' },
      ],
    },
  ];

  const [visits, setVisits] = useState(initialVisits);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const cleanPhone = phone.replace(/\D/g, '');
      const savedRx = localStorage.getItem(`docnest_rx_${cleanPhone}`);
      if (savedRx) {
        try {
          const parsed = JSON.parse(savedRx);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setVisits([...parsed, ...initialVisits]);
            setExpandedVisitId(parsed[0].id);
          }
        } catch (e) {}
      }
    }
  }, [phone]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-['Plus_Jakarta_Sans',sans-serif] pb-24 md:pb-12">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-xl border-b border-slate-800 px-4 md:px-8 py-3.5 flex flex-wrap items-center justify-between shadow-xl gap-3">
        <div className="flex items-center space-x-3">
          <NavControls fallbackBackUrl="/patient" showHome={true} showLogout={false} />
          <div>
            <h1 className="text-base font-black text-white tracking-tight">Digital Medical History</h1>
            <p className="text-[11px] text-slate-400">Lifelong encrypted patient records tied to {patientProfile.phone}</p>
          </div>
        </div>

        <div className="flex items-center space-x-2.5">
          <ThemeTogglePill />
          <LanguageTogglePill />
          <NavControls showHome={false} showLogout={true} />
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-4xl mx-auto w-full p-4 md:p-8 space-y-6">
        {/* Patient Health Summary Card */}
        <section className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-emerald-500/15 border border-emerald-500/30 rounded-2xl flex items-center justify-center text-emerald-400 font-black text-lg">
                RS
              </div>
              <div>
                <h2 className="text-lg font-black text-white">{patientProfile.name}</h2>
                <p className="text-xs text-slate-400 font-mono">Mobile: {patientProfile.phone} • Blood: <span className="text-rose-400 font-bold">{patientProfile.bloodGroup}</span></p>
              </div>
            </div>

            <div className="text-right text-xs text-slate-400">
              <span className="font-bold text-white">{patientProfile.age} Yrs / {patientProfile.gender}</span>
              <p className="text-[11px] text-emerald-400 font-semibold">Deoria Resident</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
            {/* Allergies */}
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
              <span className="text-xs font-bold text-rose-400 uppercase tracking-wider flex items-center space-x-1.5">
                <AlertTriangle className="w-4 h-4" />
                <span>Known Allergies (एलर्जी)</span>
              </span>
              <div className="flex flex-wrap gap-2">
                {patientProfile.allergies.map((al, idx) => (
                  <span key={idx} className="bg-rose-500/15 border border-rose-500/30 text-rose-300 px-2.5 py-1 rounded-lg text-xs font-bold">
                    {al}
                  </span>
                ))}
              </div>
            </div>

            {/* Chronic Conditions */}
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center space-x-1.5">
                <Heart className="w-4 h-4" />
                <span>Chronic Conditions (दीर्घकालिक स्थिति)</span>
              </span>
              <div className="flex flex-wrap gap-2">
                {patientProfile.chronicConditions.map((con, idx) => (
                  <span key={idx} className="bg-amber-500/15 border border-amber-500/30 text-amber-300 px-2.5 py-1 rounded-lg text-xs font-bold">
                    {con}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Visit History Timeline */}
        <div className="space-y-4">
          <h3 className="text-base font-black text-white flex items-center space-x-2">
            <Calendar className="w-5 h-5 text-emerald-400" />
            <span>Consultation Timeline ({visits.length} Visits)</span>
          </h3>

          {visits.map((visit) => {
            const isExpanded = expandedVisitId === visit.id;
            return (
              <div
                key={visit.id}
                className="bg-slate-900/90 border border-slate-800 rounded-3xl shadow-xl overflow-hidden transition"
              >
                {/* Header Row */}
                <div
                  onClick={() => setExpandedVisitId(isExpanded ? null : visit.id)}
                  className="p-6 cursor-pointer hover:bg-slate-800/40 transition flex items-center justify-between"
                >
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-bold text-emerald-400 font-mono bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-0.5 rounded-lg">
                        {visit.date}
                      </span>
                      <span className="text-sm font-black text-white">{visit.doctor}</span>
                    </div>
                    <p className="text-xs text-slate-400">{visit.clinic}</p>
                    <p className="text-xs font-semibold text-slate-300 pt-0.5">
                      Diagnosis: <strong className="text-white">{visit.diagnosis}</strong>
                    </p>
                  </div>

                  <div className="flex items-center space-x-3">
                    <span className="text-xs text-slate-500 hidden sm:inline">Click to {isExpanded ? 'collapse' : 'view Rx'}</span>
                    <button className="p-2 text-slate-400 hover:text-white bg-slate-800 rounded-xl">
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Expanded Details Accordion */}
                {isExpanded && (
                  <div className="px-6 pb-6 pt-2 border-t border-slate-800 space-y-4 bg-slate-950/40">
                    <div className="text-xs text-slate-400 font-mono bg-slate-950 p-3 rounded-xl border border-slate-800">
                      📊 Vitals Recorded: {visit.vitals}
                    </div>

                    <div className="space-y-2">
                      <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center space-x-1.5">
                        <Pill className="w-4 h-4 text-emerald-400" />
                        <span>Prescribed Medicines (दवाएं)</span>
                      </span>

                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs border-collapse">
                          <thead>
                            <tr className="border-b border-slate-800 text-slate-500 uppercase">
                              <th className="py-2 px-3">Medicine</th>
                              <th className="py-2 px-3">Dosage</th>
                              <th className="py-2 px-3">Duration</th>
                              <th className="py-2 px-3">Instructions</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-800/80">
                            {visit.medicines.map((m, mIdx) => (
                              <tr key={mIdx}>
                                <td className="py-2.5 px-3 font-bold text-white">{m.name}</td>
                                <td className="py-2.5 px-3 text-emerald-400 font-mono font-bold">{m.dosage}</td>
                                <td className="py-2.5 px-3 text-slate-400">{m.duration}</td>
                                <td className="py-2.5 px-3 text-slate-400">{m.timing}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs text-slate-300 space-y-1">
                      <p>📝 <strong>Doctor Advice:</strong> {visit.advice}</p>
                      <p>📅 <strong>Follow-up Return Date:</strong> <span className="text-emerald-400 font-bold">{visit.followUp}</span></p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </main>

      {/* Mobile Nav */}
      <nav className="fixed md:hidden bottom-0 left-0 right-0 z-50 bg-slate-900/95 backdrop-blur-xl border-t border-slate-800 px-3 py-2 flex items-center justify-around shadow-2xl">
        <Link href="/patient" className="flex flex-col items-center text-slate-400 hover:text-white py-1">
          <Activity className="w-5 h-5" />
          <span className="text-[10px] font-medium mt-1">Home</span>
        </Link>
        <Link href="/patient/doctors" className="flex flex-col items-center text-slate-400 hover:text-white py-1">
          <Stethoscope className="w-5 h-5" />
          <span className="text-[10px] font-medium mt-1">Doctors</span>
        </Link>
        <Link href="/patient/appointments" className="flex flex-col items-center text-slate-400 hover:text-white py-1">
          <Calendar className="w-5 h-5" />
          <span className="text-[10px] font-medium mt-1">Bookings</span>
        </Link>
        <Link href="/patient/history" className="flex flex-col items-center text-emerald-400 py-1">
          <FileText className="w-5 h-5" />
          <span className="text-[10px] font-bold mt-1">History</span>
        </Link>
        <Link href="/patient/settings" className="flex flex-col items-center text-slate-400 hover:text-white py-1">
          <Settings className="w-5 h-5" />
          <span className="text-[10px] font-medium mt-1">Settings</span>
        </Link>
      </nav>
    </div>
  );
}
