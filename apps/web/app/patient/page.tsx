'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getSession, logout, DocNestUser } from '../../lib/auth';
import {
  Calendar,
  Stethoscope,
  Clock,
  ArrowRight,
  User,
  Activity,
  FileText,
  LogOut,
  MapPin,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Sparkles,
  Phone,
  Settings,
  ChevronRight,
  Radio,
  Pill,
  Search,
  Mic,
  AlertTriangle,
  X,
  Check,
  ShieldCheck,
  Users,
  HeartPulse,
  Flame,
  CheckCheck
} from 'lucide-react';
import { LanguageTogglePill } from '../../components/LanguageContext';
import { ThemeTogglePill } from '../../components/ThemeContext';
import DocNestLogo from '../../components/DocNestLogo';
import NavControls from '../../components/NavControls';
import {
  getQueueEstimatedWaitTime,
  getFamilyMembers,
  FamilyMemberProfile,
  subscribeToClinicalEvents,
  getClinicState
} from '../../lib/clinical-store';
import {
  analyzeSymptomInput,
  COMMON_SYMPTOMS_CATALOG,
  SymptomAnalysisResult
} from '../../lib/symptom-checker';

export default function PatientHomePage() {
  const router = useRouter();
  const [user, setUser] = useState<DocNestUser | null>(null);

  // Dynamic Live Queue & Wait Time Estimator State
  const [waitEstimate, setWaitEstimate] = useState({
    currentToken: 10,
    patientsAhead: 4,
    estimatedMinutes: 24,
    estimatedTimeStr: '11:30 AM',
    isInsideConsultation: false,
    isCompleted: false,
  });

  // Family Members Multi-Profile State
  const [familyMembers, setFamilyMembers] = useState<FamilyMemberProfile[]>([
    { id: 'fam-1', name: 'Rahul Sharma (राहुल शर्मा)', relationship: 'Self', age: 32, gender: 'Male', bloodGroup: 'B+', allergies: 'Penicillin' },
    { id: 'fam-2', name: 'Om Prakash Sharma (पिताजी)', relationship: 'Father', age: 64, gender: 'Male', bloodGroup: 'B+', allergies: 'None', notes: 'Hypertension & Joint Pain' },
    { id: 'fam-3', name: 'Shanti Devi (माताजी)', relationship: 'Mother', age: 60, gender: 'Female', bloodGroup: 'O+', allergies: 'None', notes: 'Type 2 Diabetes' },
    { id: 'fam-4', name: 'Aarav Sharma (बेटा)', relationship: 'Son', age: 6, gender: 'Male', bloodGroup: 'B+', allergies: 'None' },
  ]);
  const [activeProfileId, setActiveProfileId] = useState<string>('fam-1');

  // AI Clinical Symptom Checker State
  const [symptomInput, setSymptomInput] = useState('');
  const [symptomResult, setSymptomResult] = useState<SymptomAnalysisResult | null>(null);
  const [showTriageModal, setShowTriageModal] = useState(false);

  // Daily Pill Schedule Tracker State
  const [pillCompliance, setPillCompliance] = useState<Record<string, { morning: boolean; afternoon: boolean; night: boolean }>>({
    'p-1': { morning: true, afternoon: false, night: false }, // Tab Zerodol-SP
    'p-2': { morning: true, afternoon: false, night: false }, // Tab Pan-40
  });

  useEffect(() => {
    const session = getSession();
    if (session && session.role === 'patient') {
      setUser(session);
    } else if (session) {
      setUser(session);
    } else {
      setUser({
        id: 'pat-001',
        name: 'Rahul Sharma (राहुल शर्मा)',
        role: 'patient',
        phone: '9999888877',
        district: 'Deoria'
      });
    }

    // Load family members
    const members = getFamilyMembers();
    setFamilyMembers(members);

    // Initial Wait Time Estimate
    const updateQueueEstimation = () => {
      const est = getQueueEstimatedWaitTime('doc-001', 14);
      setWaitEstimate(est);
    };
    updateQueueEstimation();

    // Subscribe to real-time events across windows
    const unsubscribe = subscribeToClinicalEvents(() => {
      updateQueueEstimation();
    });

    return unsubscribe;
  }, []);

  const handleTriageSymptom = (text: string) => {
    if (!text.trim()) return;
    const res = analyzeSymptomInput(text);
    setSymptomResult(res);
    setShowTriageModal(true);
  };

  const togglePillDose = (pillId: string, slot: 'morning' | 'afternoon' | 'night') => {
    setPillCompliance((prev) => ({
      ...prev,
      [pillId]: {
        ...prev[pillId],
        [slot]: !prev[pillId]?.[slot]
      }
    }));
  };

  const activeFamilyMember = familyMembers.find(m => m.id === activeProfileId) || familyMembers[0];

  return (
    <div className="min-h-screen bg-mesh-dark text-slate-100 flex flex-col font-['Plus_Jakarta_Sans',sans-serif] pb-24 md:pb-12">
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-[#0c1219]/90 backdrop-blur-2xl border-b border-[rgba(196,225,230,0.12)] px-4 md:px-8 py-2.5 flex items-center justify-between shadow-xl">
        <div className="flex items-center space-x-2 sm:space-x-4">
          <Link href="/patient" className="hover:opacity-95 transition">
            <DocNestLogo size="sm" subtitle="Patient Portal" />
          </Link>
          <NavControls fallbackBackUrl="/" showHome={false} showLogout={false} />
        </div>

        <div className="flex items-center space-x-2">
          <ThemeTogglePill />
          <LanguageTogglePill />
          <NavControls showHome={false} showLogout={true} />
        </div>
      </header>

      {/* Main Body */}
      <main className="flex-1 max-w-4xl mx-auto w-full p-4 md:p-8 space-y-6">
        
        {/* FAMILY MEMBER MULTI-PROFILE BAR */}
        <section className="bg-slate-900/80 border border-slate-800 rounded-2xl p-3.5 flex flex-wrap items-center justify-between gap-3 shadow-md">
          <div className="flex items-center space-x-2 text-xs font-bold text-slate-300">
            <Users className="w-4 h-4 text-emerald-400" />
            <span>Active Health Profile (परिवार सदस्य):</span>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {familyMembers.map((m) => {
              const isSelected = activeProfileId === m.id;
              const icon = m.relationship === 'Self' ? '👤' : m.relationship === 'Father' ? '👴' : m.relationship === 'Mother' ? '👵' : m.relationship === 'Son' || m.relationship === 'Daughter' ? '👶' : '👥';
              return (
                <button
                  key={m.id}
                  onClick={() => setActiveProfileId(m.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 cursor-pointer ${
                    isSelected
                      ? 'bg-emerald-500 text-slate-950 shadow-md font-black ring-2 ring-emerald-400'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
                  }`}
                >
                  <span>{icon}</span>
                  <span>{m.name.split(' (')[0]} ({m.relationship})</span>
                </button>
              );
            })}
          </div>
        </section>

        {/* Welcome Hero Banner */}
        <section className="glass-panel-elevated rounded-3xl p-6 md:p-8 relative overflow-hidden space-y-4">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#8dbcc7]/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#ebffd8]/08 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 space-y-4">
            <div className="inline-flex items-center space-x-2 bg-[#8dbcc7]/15 text-[#ebffd8] border border-[#8dbcc7]/30 px-3.5 py-1.5 rounded-full text-xs font-bold shadow-inner">
              <span className="w-2 h-2 rounded-full bg-[#8dbcc7] animate-ping" />
              <span>Verified Account • {activeFamilyMember?.name || user?.name || 'Rahul Sharma'}</span>
            </div>

            <div>
              <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">
                नमस्ते {(activeFamilyMember?.name || user?.name || 'Rahul Sharma').split(' (')[0]}! 🙏
              </h1>
              <p className="text-sm text-[#c4e1e6] mt-1 max-w-xl leading-relaxed">
                Book verified specialists across Deoria Sadar. Check your real-time live queue wait time & manage digital prescriptions for your entire family.
              </p>
            </div>

            <div className="pt-2 flex flex-wrap gap-3">
              <Link
                href="/patient/doctors"
                className="btn-primary-tactile px-6 py-3.5 rounded-2xl text-sm flex items-center space-x-2 transition"
              >
                <Stethoscope className="w-4 h-4" />
                <span>Book Doctor Appointment →</span>
              </Link>
              <Link
                href="/patient/appointments"
                className="glass-panel text-slate-200 font-bold px-5 py-3.5 rounded-2xl text-sm flex items-center space-x-2 transition active:scale-95"
              >
                <Calendar className="w-4 h-4 text-[#8dbcc7]" />
                <span>My Appointments</span>
              </Link>
            </div>
          </div>
        </section>

        {/* ITEM 1: AI CLINICAL SYMPTOM CHECKER & SPECIALTY RECOMMENDER */}
        <section className="bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950/40 border border-emerald-500/30 rounded-3xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="w-9 h-9 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                <Sparkles className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <h2 className="text-base font-extrabold text-white flex items-center space-x-2">
                  <span>AI Symptom Checker (लक्षण जांच व डॉक्टर सुझाव)</span>
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded-full font-bold">
                    NABH Triage
                  </span>
                </h2>
                <p className="text-xs text-slate-400">Tell us what you are feeling to find the exact verified specialist</p>
              </div>
            </div>
          </div>

          {/* Quick Common Symptom Pills */}
          <div className="flex flex-wrap gap-2 pt-1">
            {COMMON_SYMPTOMS_CATALOG.map((sym) => (
              <button
                key={sym.id}
                onClick={() => handleTriageSymptom(sym.en)}
                className="bg-slate-800/80 hover:bg-emerald-500/20 hover:border-emerald-500/50 text-slate-200 hover:text-white border border-slate-700/80 px-3 py-1.5 rounded-xl text-xs font-semibold transition flex items-center space-x-1.5 cursor-pointer"
              >
                <span>{sym.icon}</span>
                <span>{sym.label}</span>
              </button>
            ))}
          </div>

          {/* Custom Symptom Input Bar */}
          <div className="relative pt-2">
            <Search className="w-4 h-4 absolute left-3.5 top-5.5 text-slate-400" />
            <input
              type="text"
              placeholder="Or describe symptoms in Hindi / English (e.g. कमर में तेज दर्द या बच्चे को उल्टी)..."
              value={symptomInput}
              onChange={(e) => setSymptomInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleTriageSymptom(symptomInput);
              }}
              className="w-full bg-slate-950/90 border border-slate-700 text-white rounded-2xl pl-10 pr-24 py-3 text-xs focus:outline-none focus:border-emerald-500 shadow-inner"
            />
            <button
              onClick={() => handleTriageSymptom(symptomInput)}
              className="absolute right-2 top-3.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-4 py-2 rounded-xl transition cursor-pointer shadow-md"
            >
              Check AI
            </button>
          </div>
        </section>

        {/* AI TRIAGE MODAL RESULT */}
        {showTriageModal && symptomResult && (
          <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-lg w-full shadow-2xl space-y-4 relative">
              <button
                onClick={() => setShowTriageModal(false)}
                className="absolute right-4 top-4 text-slate-400 hover:text-white p-1 rounded-lg transition"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center space-x-2 text-xs font-bold text-emerald-400 uppercase tracking-wider">
                <Sparkles className="w-4 h-4" />
                <span>AI Clinical Triage Assessment</span>
              </div>

              {/* Recommended Specialty Card */}
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400">Recommended Medical Specialty:</span>
                  <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${
                    symptomResult.urgencyLevel.includes('Immediate')
                      ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 animate-pulse'
                      : symptomResult.urgencyLevel.includes('Priority')
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                      : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                  }`}>
                    {symptomResult.urgencyLevel}
                  </span>
                </div>
                <h3 className="text-xl font-black text-white">{symptomResult.recommendedSpecialty}</h3>
                <p className="text-xs text-emerald-300 font-semibold">{symptomResult.summaryHindi}</p>
                <p className="text-[11px] text-slate-400">{symptomResult.summaryEnglish}</p>
              </div>

              {/* First Aid Guidance */}
              <div className="space-y-1.5 bg-slate-950/60 p-3.5 rounded-2xl border border-slate-800/80 text-xs">
                <p className="font-bold text-slate-300">Immediate First-Aid & Precautions (प्राथमिक देखभाल):</p>
                <ul className="space-y-1 text-slate-400 text-[11px] list-disc list-inside">
                  {symptomResult.firstAidAdvice.map((tip, idx) => (
                    <li key={idx}>{tip}</li>
                  ))}
                </ul>
              </div>

              {/* Verified Doctors in Deoria */}
              <div className="space-y-2">
                <p className="text-xs font-bold text-slate-300">Verified Specialists Available in Deoria:</p>
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {symptomResult.suggestedDoctors.map((doc) => (
                    <div
                      key={doc.id}
                      className="p-3 bg-slate-800/80 border border-slate-700/80 rounded-2xl flex items-center justify-between hover:border-emerald-500 transition"
                    >
                      <div>
                        <p className="text-xs font-bold text-white">{doc.name}</p>
                        <p className="text-[10px] text-emerald-400">{doc.specialty} • ₹{doc.consultationFee}</p>
                        <p className="text-[10px] text-slate-400 truncate max-w-[200px]">{doc.clinicName}</p>
                      </div>
                      <Link
                        href={`/patient/book?doctor=${doc.id}`}
                        className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-3 py-1.5 rounded-xl transition shadow"
                      >
                        Book Token
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ITEM 2: DYNAMIC LIVE QUEUE WAIT-TIME ESTIMATOR ON UPCOMING CARD */}
        <section className="bg-white dark:bg-[#141e28] rounded-3xl p-6 md:p-7 space-y-5 relative overflow-hidden border border-slate-200/90 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3.5">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-xl bg-teal-100 dark:bg-teal-900/50 text-teal-700 dark:text-teal-300 flex items-center justify-center">
                <Calendar className="w-4 h-4" />
              </div>
              <h2 className="text-base font-black text-slate-900 dark:text-white">Active OPD Token & Live Queue (लाइव कतार स्थिति)</h2>
            </div>
            <span className="bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 px-3 py-1 rounded-full text-xs font-black flex items-center space-x-1.5 shadow-sm">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>Confirmed ✓</span>
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-center">
            <div className="md:col-span-2 space-y-2.5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-lg font-black text-slate-900 dark:text-white">Dr. Amit Kumar</span>
                <span className="text-xs text-teal-800 dark:text-teal-300 font-bold bg-teal-50 dark:bg-teal-950/60 px-2.5 py-0.5 rounded-lg border border-teal-200 dark:border-teal-800">
                  Orthopedic Surgeon
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 flex items-center space-x-1.5">
                <MapPin className="w-3.5 h-3.5 text-teal-600 flex-shrink-0" />
                <span>Gupta Clinic & Joint Care Center — Near Railway Overbridge, Deoria Sadar</span>
              </p>
              <div className="flex flex-wrap gap-4 text-xs font-medium text-slate-500 dark:text-slate-400 pt-1">
                <span>📅 Date: <strong className="text-slate-900 dark:text-white font-bold">Today, Morning Shift</strong></span>
                <span>👤 Patient: <strong className="text-slate-900 dark:text-white font-bold">{(activeFamilyMember?.name || 'Rahul Sharma').split(' (')[0]}</strong></span>
              </div>
            </div>

            {/* Live Token Number with Dynamic Wait Time Estimation */}
            <div className="bg-slate-50 dark:bg-[#0c1219] border-2 border-teal-200/90 dark:border-teal-800 rounded-3xl p-5 text-center relative shadow-sm">
              <span className="text-[10px] font-black text-teal-800 dark:text-teal-400 uppercase tracking-widest block">Your OPD Token</span>
              <div className="inline-block relative my-1">
                <span className="text-4xl md:text-5xl font-black font-mono tabular-numbers text-teal-700 dark:text-teal-400 block drop-shadow-sm">
                  #14
                </span>
              </div>
              
              <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-2 text-xs space-y-1 mt-2">
                <div className="flex items-center justify-between text-[11px] text-slate-600 dark:text-slate-300">
                  <span>Serving Now:</span>
                  <span className="font-black font-mono text-emerald-700 dark:text-emerald-400">#{waitEstimate.currentToken}</span>
                </div>
                <div className="flex items-center justify-between text-[11px] font-bold text-teal-800 dark:text-teal-300">
                  <span>Ahead of you:</span>
                  <span>{waitEstimate.patientsAhead} patients</span>
                </div>
                <div className="border-t border-emerald-500/20 pt-1 text-[11px] text-slate-500 dark:text-slate-400">
                  Est. time: <strong className="text-slate-900 dark:text-white">{waitEstimate.estimatedTimeStr} (~{waitEstimate.estimatedMinutes}m)</strong>
                </div>
              </div>
            </div>
          </div>

          {/* Real-time 3-Stage Queue Progression Bar */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2">
            <div className="flex justify-between text-[11px] font-bold text-slate-500 dark:text-slate-400">
              <span className="text-emerald-600 dark:text-emerald-400 flex items-center space-x-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Token Confirmed</span>
              </span>
              <span className={waitEstimate.patientsAhead <= 2 ? 'text-amber-500 font-black animate-pulse' : 'text-slate-400'}>
                Next in Line ({waitEstimate.patientsAhead} ahead)
              </span>
              <span className={waitEstimate.isInsideConsultation ? 'text-emerald-500 font-black' : 'text-slate-400'}>
                Inside Consultation Chamber
              </span>
            </div>
            
            <div className="w-full h-2.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden flex">
              <div className="w-1/3 bg-emerald-500 h-full" />
              <div className={`w-1/3 h-full transition-all ${waitEstimate.patientsAhead <= 2 ? 'bg-amber-400 animate-pulse' : 'bg-slate-300 dark:bg-slate-700'}`} />
              <div className={`w-1/3 h-full transition-all ${waitEstimate.isInsideConsultation ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-700'}`} />
            </div>
          </div>

          <div className="pt-1 flex justify-end space-x-3">
            <Link
              href="/patient/appointments"
              className="text-xs text-teal-800 dark:text-teal-300 hover:text-teal-900 font-bold px-4 py-2 rounded-xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200/80 dark:border-teal-800 transition active:scale-95 flex items-center space-x-1"
            >
              <span>View QR Pass & Full Details</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </section>

        {/* ITEM 3: DAILY MEDICATION SCHEDULE & PILL REMINDER WIDGET */}
        <section className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-md space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                <Pill className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-extrabold text-white">Daily Medication Schedule (दवा रिमाइंडर)</h3>
                <p className="text-[11px] text-slate-400">Prescribed by Dr. Amit Kumar • Tap slots as you take your doses</p>
              </div>
            </div>
            <span className="text-xs font-bold text-amber-400 bg-amber-500/10 border border-amber-500/30 px-3 py-1 rounded-full">
              Day 2 of 5
            </span>
          </div>

          <div className="space-y-3">
            {[
              { id: 'p-1', name: 'Tab. Zerodol-SP', dose: '1-0-1', timing: 'After Food (खाने के बाद)', slots: ['morning', 'night'] as const },
              { id: 'p-2', name: 'Tab. Pan-40', dose: '1-0-0', timing: 'Empty Stomach (खाली पेट)', slots: ['morning'] as const },
            ].map((med) => (
              <div
                key={med.id}
                className="p-3.5 bg-slate-950/80 border border-slate-800 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div>
                  <p className="text-xs font-black text-white">{med.name}</p>
                  <p className="text-[11px] text-emerald-400 font-semibold">{med.timing} • Dosage: {med.dose}</p>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => togglePillDose(med.id, 'morning')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center space-x-1 cursor-pointer ${
                      pillCompliance[med.id]?.morning
                        ? 'bg-emerald-500 text-slate-950 font-black'
                        : 'bg-slate-800 text-slate-400 border border-slate-700 hover:text-white'
                    }`}
                  >
                    <span>{pillCompliance[med.id]?.morning ? '✓' : '○'}</span>
                    <span>Morning</span>
                  </button>

                  {med.slots.includes('night' as any) && (
                    <button
                      onClick={() => togglePillDose(med.id, 'night')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center space-x-1 cursor-pointer ${
                        pillCompliance[med.id]?.night
                          ? 'bg-emerald-500 text-slate-950 font-black'
                          : 'bg-slate-800 text-slate-400 border border-slate-700 hover:text-white'
                      }`}
                    >
                      <span>{pillCompliance[med.id]?.night ? '✓' : '○'}</span>
                      <span>Night</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Quick Actions Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link
            href="/patient/doctors"
            className="group glass-panel rounded-3xl p-6 transition flex items-center justify-between shadow-xl"
          >
            <div className="space-y-1">
              <div className="w-11 h-11 rounded-2xl bg-[#8dbcc7]/15 border border-[#8dbcc7]/30 flex items-center justify-center text-[#8dbcc7] mb-2 group-hover:scale-105 transition">
                <Stethoscope className="w-5 h-5" />
              </div>
              <h3 className="text-base font-black text-white group-hover:text-[#8dbcc7] transition">Find & Book Doctors</h3>
              <p className="text-xs text-slate-400">Search verified doctors by specialty, fees & hospital timing</p>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-500 group-hover:text-[#8dbcc7] group-hover:translate-x-1 transition" />
          </Link>

          <Link
            href="/patient/history"
            className="group glass-panel rounded-3xl p-6 transition flex items-center justify-between shadow-xl"
          >
            <div className="space-y-1">
              <div className="w-11 h-11 rounded-2xl bg-[#a4ccd9]/15 border border-[#a4ccd9]/30 flex items-center justify-center text-[#a4ccd9] mb-2 group-hover:scale-105 transition">
                <FileText className="w-5 h-5" />
              </div>
              <h3 className="text-base font-black text-white group-hover:text-[#a4ccd9] transition">Digital Medical History</h3>
              <p className="text-xs text-slate-400">View your past prescriptions, tests & doctor advice records</p>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-500 group-hover:text-[#a4ccd9] group-hover:translate-x-1 transition" />
          </Link>
        </section>

        {/* Global Footer & Store Compliance Links */}
        <footer className="pt-8 pb-16 text-center text-xs text-slate-500 border-t border-slate-800/80 space-y-3">
          <div className="flex flex-wrap justify-center items-center gap-6 text-slate-400 font-semibold">
            <Link href="/privacy" className="hover:text-emerald-400 transition">Privacy Policy (गोपनीयता नीति)</Link>
            <span>•</span>
            <Link href="/terms" className="hover:text-emerald-400 transition">Terms of Service (नियम व शर्तें)</Link>
            <span>•</span>
            <Link href="/doctor/dashboard" className="hover:text-emerald-400 transition">Doctor OPD Queue</Link>
            <span>•</span>
            <Link href="/compounder/dispense" className="hover:text-emerald-400 transition">Pharmacy Dispensing</Link>
          </div>
          <p className="text-[11px] text-slate-600">
            DocNest Healthcare Platform • Operating on <span className="font-mono text-emerald-500/80">https://www.drugs.systems</span> • DPDP & DISHA Compliant
          </p>
        </footer>
      </main>

      {/* Floating App-like Mobile Bottom Navigation */}
      <nav className="fixed md:hidden bottom-3 left-3 right-3 z-50 bg-[#0c1219]/90 backdrop-blur-2xl border border-[rgba(196,225,230,0.15)] rounded-2xl px-3 py-2 flex items-center justify-around shadow-[0_12px_32px_rgba(0,0,0,0.7)]">
        <Link href="/patient" className="flex flex-col items-center text-[#8dbcc7] py-1 transition active:scale-90">
          <Activity className="w-5 h-5" />
          <span className="text-[10px] font-bold mt-1">Home</span>
        </Link>
        <Link href="/patient/doctors" className="flex flex-col items-center text-slate-400 hover:text-white py-1 transition active:scale-90">
          <Stethoscope className="w-5 h-5" />
          <span className="text-[10px] font-medium mt-1">Doctors</span>
        </Link>
        <Link href="/patient/appointments" className="flex flex-col items-center text-slate-400 hover:text-white py-1 transition active:scale-90">
          <Calendar className="w-5 h-5" />
          <span className="text-[10px] font-medium mt-1">Bookings</span>
        </Link>
        <Link href="/patient/history" className="flex flex-col items-center text-slate-400 hover:text-white py-1 transition active:scale-90">
          <FileText className="w-5 h-5" />
          <span className="text-[10px] font-medium mt-1">History</span>
        </Link>
        <Link href="/patient/settings" className="flex flex-col items-center text-slate-400 hover:text-white py-1 transition active:scale-90">
          <Settings className="w-5 h-5" />
          <span className="text-[10px] font-medium mt-1">Settings</span>
        </Link>
      </nav>
    </div>
  );
}
