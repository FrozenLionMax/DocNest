'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '../../../lib/supabase';
import { getSession } from '../../../lib/auth';
import { DOCTORS_DIRECTORY, DoctorProfile } from '../../../lib/doctors-data';
import {
  Users, Play, Pause, RotateCcw, Plus, Phone, Stethoscope, FileText, Tv,
  CheckCircle2, XCircle, SkipForward, Search, Volume2, VolumeX, Loader2,
  Calendar, AlertCircle, QrCode, Filter, Clock, Activity, History, X, User, ChevronDown
} from 'lucide-react';

interface PatientEntry {
  id: string;
  token: number;
  name: string;
  phone: string;
  time: string;
  status: 'waiting' | 'in_consultation' | 'completed' | 'skipped' | 'cancelled';
  type: 'Online Booking' | 'Offline पर्चा';
  ageGender?: string;
  allergies?: string[];
  lastVisit?: string;
  notes?: string;
}

export default function DoctorDashboard() {
  const router = useRouter();
  const [session, setSession] = useState<any>(null);
  const [selectedDoctorId, setSelectedDoctorId] = useState<string>('doc-001');

  useEffect(() => {
    const s = getSession();
    if (s) {
      setSession(s);
      if (s.id) setSelectedDoctorId(s.id);
    }
  }, []);
  const currentDoctorProfile = DOCTORS_DIRECTORY.find(d => d.id === selectedDoctorId) || DOCTORS_DIRECTORY[0];

  const [currentToken, setCurrentToken] = useState(1);
  const [totalIssued, setTotalIssued] = useState(0);
  const [queueStatus, setQueueStatus] = useState<'active' | 'paused' | 'closed'>('active');
  const [offlineName, setOfflineName] = useState('');
  const [offlinePhone, setOfflinePhone] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [loading, setLoading] = useState(true);
  const [addingPatient, setAddingPatient] = useState(false);
  const [selectedPatientForDrawer, setSelectedPatientForDrawer] = useState<PatientEntry | null>(null);

  const [patients, setPatients] = useState<PatientEntry[]>([
    { id: 'q-1', token: 1, name: 'Rahul Sharma (राहुल शर्मा)', phone: '9876543210', time: '10:00 AM', status: 'in_consultation', type: 'Online Booking', ageGender: '32 / Male', allergies: ['Penicillin (पेनिसिलिन एलर्जी)'], lastVisit: '14 Aug 2026', notes: 'Chronic low back pain. Follow up after physiotherapy.' },
    { id: 'q-2', token: 2, name: 'Priya Singh (प्रिया सिंह)', phone: '9812345678', time: '10:15 AM', status: 'waiting', type: 'Online Booking', ageGender: '28 / Female', allergies: ['Dust / Pollen'], lastVisit: '02 Jul 2026', notes: 'Right knee stiffness during stairs.' },
    { id: 'q-3', token: 3, name: 'Amitabh Mishra (अमिताभ मिश्रा)', phone: '9988776655', time: '10:30 AM', status: 'waiting', type: 'Offline पर्चा', ageGender: '45 / Male', allergies: ['None (कोई नहीं)'], lastVisit: 'First Visit', notes: 'New walk-in patient with shoulder joint pain.' },
    { id: 'q-4', token: 4, name: 'Sunita Devi (सुनीता देवी)', phone: '9765432109', time: '10:45 AM', status: 'waiting', type: 'Offline पर्चा', ageGender: '52 / Female', allergies: ['Sulfa drugs'], lastVisit: '20 Jun 2026', notes: 'Hypertension checkup and cervical spondylosis.' },
  ]);

  useEffect(() => {
    async function loadQueueData() {
      setLoading(true);
      try {
        const doctorId = selectedDoctorId;
        const { data: queueData } = await supabase.from('clinic_queues').select('*').eq('doctor_id', doctorId).single();
        if (queueData) {
          setCurrentToken(queueData.current_token || 1);
          setTotalIssued(queueData.total_issued || 4);
          setQueueStatus(queueData.status || 'active');
        }
        const { data: entries } = await supabase.from('queue_entries').select('*').order('token_number', { ascending: true });
        if (entries && entries.length > 0) {
          setPatients(entries.map((item: any) => ({
            id: item.id, token: item.token_number, name: item.patient_name,
            phone: item.patient_phone || '', time: item.created_at ? new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '10:00 AM',
            status: item.status, type: item.source === 'online' ? 'Online Booking' : 'Offline पर्चा',
            ageGender: '35 / M', allergies: ['None'], lastVisit: '10 Aug 2026', notes: 'Routine OPD checkup.'
          })));
          setTotalIssued(Math.max(entries.length, queueData?.total_issued || 0));
        }
      } catch (err: any) { console.warn('Using local queue cache:', err.message); }
      finally { setLoading(false); }
    }
    loadQueueData();
  }, [session?.id]);

  useEffect(() => {
    const channel = supabase.channel('opd-live-queue')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'clinic_queues' }, (payload: any) => {
        if (payload.new?.current_token !== undefined) setCurrentToken(payload.new.current_token);
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'queue_entries' }, (payload: any) => {
        if (payload.new) {
          setPatients((prev) => {
            const index = prev.findIndex((p) => p.id === payload.new.id);
            if (index !== -1) { const updated = [...prev]; updated[index] = { ...updated[index], status: payload.new.status }; return updated; }
            return [...prev, { id: payload.new.id, token: payload.new.token_number, name: payload.new.patient_name, phone: payload.new.patient_phone || '', time: 'Just now', status: payload.new.status, type: payload.new.source === 'online' ? 'Online Booking' : 'Offline पर्चा', ageGender: '30 / M', allergies: ['None'], notes: 'Walk-in' }];
          });
        }
      }).subscribe();
    return () => { supabase.removeChannel(channel); };
  }, []);

  const playChimeSound = () => {
    if (!soundEnabled || typeof window === 'undefined') return;
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const now = audioCtx.currentTime;

      const osc1 = audioCtx.createOscillator(); const gain1 = audioCtx.createGain();
      osc1.type = 'sine'; osc1.frequency.setValueAtTime(587.33, now); osc1.frequency.exponentialRampToValueAtTime(880, now + 0.12);
      gain1.gain.setValueAtTime(0.35, now); gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
      osc1.connect(gain1); gain1.connect(audioCtx.destination); osc1.start(now); osc1.stop(now + 0.4);

      const osc2 = audioCtx.createOscillator(); const gain2 = audioCtx.createGain();
      osc2.type = 'sine'; osc2.frequency.setValueAtTime(659.25, now + 0.15); osc2.frequency.exponentialRampToValueAtTime(1046.5, now + 0.28);
      gain2.gain.setValueAtTime(0.4, now + 0.15); gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
      osc2.connect(gain2); gain2.connect(audioCtx.destination); osc2.start(now + 0.15); osc2.stop(now + 0.6);
    } catch (e) { console.log('Chime ring audio error:', e); }
  };

  const handleNextToken = async () => {
    const nextVal = currentToken + 1;
    if (nextVal > totalIssued && patients.length > 0) setTotalIssued(nextVal);
    setCurrentToken(nextVal);
    playChimeSound();
    setPatients((prev) => prev.map((p) => {
      if (p.token === currentToken) return { ...p, status: 'completed' };
      if (p.token === nextVal) return { ...p, status: 'in_consultation' };
      return p;
    }));
    try {
      const doctorId = session?.id || 'doc-001';
      await supabase.from('clinic_queues').update({ current_token: nextVal, updated_at: new Date().toISOString() }).eq('doctor_id', doctorId);
      await supabase.channel('opd-live-queue').send({ type: 'broadcast', event: 'token-update', payload: { currentToken: nextVal, doctorId } });
    } catch (e) { console.log('Token update warning:', e); }
  };

  const handleToggleQueueStatus = async () => {
    const newStatus = queueStatus === 'active' ? 'paused' : 'active';
    setQueueStatus(newStatus);
    try { await supabase.from('clinic_queues').update({ status: newStatus }).eq('doctor_id', session?.id || 'doc-001'); } catch (e) {}
  };

  const handleResetQueue = async () => {
    setCurrentToken(1);
    try { await supabase.from('clinic_queues').update({ current_token: 1 }).eq('doctor_id', session?.id || 'doc-001'); } catch (e) {}
  };

  const handleAddOfflinePatient = async (e: React.FormEvent) => {
    e.preventDefault(); if (!offlineName) return;
    setAddingPatient(true);
    const newToken = (patients.length > 0 ? Math.max(...patients.map((p) => p.token)) : 0) + 1;
    const newPatient: PatientEntry = { id: `q-off-${Date.now()}`, token: newToken, name: offlineName, phone: offlinePhone || 'N/A', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), status: 'waiting', type: 'Offline पर्चा', ageGender: '30 / M', allergies: ['None'], notes: 'Walk-in' };
    setPatients((prev) => [...prev, newPatient]); setTotalIssued((prev) => Math.max(prev, newToken));
    setOfflineName(''); setOfflinePhone('');
    try { await supabase.from('queue_entries').insert([{ token_number: newToken, patient_name: offlineName, patient_phone: offlinePhone, source: 'walk_in', status: 'waiting' }]); } catch (err) {}
    finally { setAddingPatient(false); }
  };

  const updatePatientStatus = async (patientId: string, newStatus: PatientEntry['status']) => {
    setPatients((prev) => prev.map((p) => (p.id === patientId ? { ...p, status: newStatus } : p)));
    try { await supabase.from('queue_entries').update({ status: newStatus }).eq('id', patientId); } catch (e) {}
  };

  // Filter patients by search query & tab status
  const filteredPatients = patients.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.token.toString().includes(searchQuery) || p.phone.includes(searchQuery);
    if (statusFilter === 'all') return matchesSearch;
    return matchesSearch && p.status === statusFilter;
  });

  // Calculate OPD Performance Stats
  const completedCount = patients.filter((p) => p.status === 'completed').length;
  const waitingCount = patients.filter((p) => p.status === 'waiting').length;

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-7xl mx-auto w-full font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Top Header Bar */}
      <div className="flex flex-wrap justify-between items-center gap-4 bg-white/95 dark:bg-[#141e28] border border-teal-100 dark:border-teal-900/40 p-5 rounded-3xl shadow-sm hover:shadow-md transition">
        <div className="flex-1 min-w-[280px]">
          <div className="flex items-center space-x-2">
            <h1 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center space-x-2">
              <span>OPD Live Queue Controller</span>
            </h1>
            <span className="text-[11px] bg-teal-50 dark:bg-teal-950/60 text-teal-800 dark:text-teal-300 border border-teal-200/80 dark:border-teal-800/40 px-3 py-1 rounded-full font-extrabold shadow-sm">
              Dynamic Multi-Doctor
            </span>
          </div>
          
          {/* Dynamic Doctor & Clinic Switcher */}
          <div className="mt-2.5 relative max-w-md">
            <select
              value={selectedDoctorId}
              onChange={(e) => {
                setSelectedDoctorId(e.target.value);
                setCurrentToken(1);
              }}
              className="w-full appearance-none bg-slate-50 hover:bg-white dark:bg-[#0c1219] border-2 border-teal-100 hover:border-teal-400 dark:border-teal-900/60 text-slate-800 dark:text-slate-100 font-bold text-xs rounded-2xl pl-4 pr-10 py-2.5 focus:outline-none focus:ring-2 focus:ring-teal-400/40 transition cursor-pointer shadow-sm"
            >
              {DOCTORS_DIRECTORY.map((doc) => (
                <option key={doc.id} value={doc.id} className="bg-white dark:bg-[#141e28] text-slate-900 dark:text-white py-1">
                  {doc.name} ({doc.specialty}) — {doc.clinicName}
                </option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 text-teal-600 dark:text-teal-400 absolute right-3.5 top-3.5 pointer-events-none" />
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-3 bg-slate-50 hover:bg-teal-50 dark:bg-[#1c2a38] border border-slate-200 hover:border-teal-300 dark:border-slate-700 text-teal-700 dark:text-teal-400 rounded-2xl transition active:scale-95 shadow-sm"
            title="Toggle Acoustic Bell Ring Chime"
          >
            {soundEnabled ? <Volume2 className="w-5 h-5 text-teal-600" /> : <VolumeX className="w-5 h-5 text-slate-400" />}
          </button>
          <div className="bg-gradient-to-r from-teal-50 to-emerald-50 dark:from-teal-950/60 dark:to-emerald-950/60 border border-teal-200/90 dark:border-teal-800/40 text-teal-900 dark:text-teal-200 px-4 py-2.5 rounded-2xl text-xs font-black flex items-center space-x-2.5 shadow-sm">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>{currentDoctorProfile.name}</span>
          </div>
        </div>
      </div>

      {/* OPD PERFORMANCE ANALYTICS SUMMARY BAR */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Total Today */}
        <div className="bg-gradient-to-br from-indigo-50/90 via-purple-50/60 to-white dark:from-indigo-950/40 dark:to-[#141e28] border border-indigo-100/90 dark:border-indigo-900/40 rounded-3xl p-5 flex items-center justify-between shadow-sm hover:shadow-md transition transform hover:-translate-y-0.5">
          <div>
            <p className="text-[11px] text-indigo-900/70 dark:text-indigo-300 font-extrabold uppercase tracking-wider">Total Today</p>
            <p className="text-3xl font-black tabular-numbers text-indigo-950 dark:text-white mt-1">{patients.length}</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-indigo-100 dark:bg-indigo-900/50 border border-indigo-200/80 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 flex items-center justify-center text-xl font-bold shadow-sm">
            👥
          </div>
        </div>

        {/* Completed */}
        <div className="bg-gradient-to-br from-emerald-50/90 via-teal-50/60 to-white dark:from-emerald-950/40 dark:to-[#141e28] border border-emerald-100/90 dark:border-emerald-900/40 rounded-3xl p-5 flex items-center justify-between shadow-sm hover:shadow-md transition transform hover:-translate-y-0.5">
          <div>
            <p className="text-[11px] text-emerald-900/70 dark:text-emerald-300 font-extrabold uppercase tracking-wider">Completed</p>
            <p className="text-3xl font-black tabular-numbers text-emerald-950 dark:text-emerald-400 mt-1">{completedCount}</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-900/50 border border-emerald-200/80 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 flex items-center justify-center text-xl font-black shadow-sm">
            ✓
          </div>
        </div>

        {/* Waiting */}
        <div className="bg-gradient-to-br from-sky-50/90 via-cyan-50/60 to-white dark:from-sky-950/40 dark:to-[#141e28] border border-sky-100/90 dark:border-sky-900/40 rounded-3xl p-5 flex items-center justify-between shadow-sm hover:shadow-md transition transform hover:-translate-y-0.5">
          <div>
            <p className="text-[11px] text-sky-900/70 dark:text-sky-300 font-extrabold uppercase tracking-wider">Waiting</p>
            <p className="text-3xl font-black tabular-numbers text-sky-950 dark:text-sky-400 mt-1">{waitingCount}</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-sky-100 dark:bg-sky-900/50 border border-sky-200/80 dark:border-sky-800 text-sky-700 dark:text-sky-300 flex items-center justify-center text-xl shadow-sm">
            ⏳
          </div>
        </div>

        {/* Avg Speed */}
        <div className="bg-gradient-to-br from-amber-50/90 via-orange-50/60 to-white dark:from-amber-950/40 dark:to-[#141e28] border border-amber-100/90 dark:border-amber-900/40 rounded-3xl p-5 flex items-center justify-between shadow-sm hover:shadow-md transition transform hover:-translate-y-0.5">
          <div>
            <p className="text-[11px] text-amber-900/70 dark:text-amber-300 font-extrabold uppercase tracking-wider">Avg Speed</p>
            <p className="text-3xl font-black tabular-numbers text-amber-950 dark:text-amber-400 mt-1">7.5m</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-900/50 border border-amber-200/80 dark:border-amber-800 text-amber-700 dark:text-amber-300 flex items-center justify-center text-xl shadow-sm">
            ⚡
          </div>
        </div>
      </div>

      {/* LIVE QUEUE HERO CARD */}
      <section className="bg-gradient-to-br from-teal-800 via-emerald-800 to-teal-950 text-white rounded-3xl p-6 md:p-8 shadow-2xl relative overflow-hidden space-y-6 border border-teal-700/50">
        <div className="absolute right-0 top-0 w-96 h-96 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute left-0 bottom-0 w-64 h-64 bg-teal-300/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 relative z-10">
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-2 bg-emerald-400/20 text-emerald-200 px-3.5 py-1.5 rounded-full text-xs font-bold border border-emerald-400/30 shadow-inner">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
              <span>LIVE OPD TOKEN CONTROLLER</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-black tracking-tight text-white">क्लिनिक टोकन काउंटर</h2>
            <p className="text-emerald-100/90 text-xs md:text-sm">Realtime Supabase Sync & Acoustic Bell Ring Chimes</p>
          </div>
          
          {/* The Glorious High-Contrast Token Box */}
          <div className="bg-white text-slate-900 rounded-3xl p-6 md:p-7 text-center min-w-[260px] w-full lg:w-auto shadow-2xl border-2 border-emerald-400/40 relative">
            <div className="inline-block bg-emerald-50 text-emerald-800 border border-emerald-200 text-[11px] font-black uppercase tracking-widest px-3 py-1 rounded-full mb-1">
              Now Serving
            </div>
            <p className="text-6xl md:text-7xl font-black text-emerald-700 my-1 font-mono tabular-numbers drop-shadow-sm">
              #{currentToken}
            </p>
            <p className="text-xs text-slate-500 font-bold tabular-numbers mt-1">Total Issued: #{totalIssued}</p>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-white/15 flex flex-wrap items-center justify-between gap-4 relative z-10">
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleNextToken}
              className="bg-emerald-400 hover:bg-emerald-300 text-emerald-950 font-black px-6 py-3.5 rounded-2xl text-sm flex items-center space-x-2 shadow-lg shadow-emerald-900/30 transition transform hover:-translate-y-0.5 active:scale-95 cursor-pointer"
            >
              <Play className="w-4 h-4 fill-emerald-950" />
              <span>Next Patient (अगला टोकन)</span>
            </button>
            <button
              onClick={handleToggleQueueStatus}
              className="bg-white/15 hover:bg-white/25 text-white font-bold px-5 py-3.5 rounded-2xl text-sm flex items-center space-x-2 border border-white/20 transition active:scale-95 cursor-pointer"
            >
              <Pause className="w-4 h-4" />
              <span>{queueStatus === 'active' ? 'Pause OPD' : 'Resume OPD'}</span>
            </button>
            <button
              onClick={handleResetQueue}
              className="bg-white/10 hover:bg-white/20 text-emerald-100 font-bold px-4 py-3.5 rounded-2xl text-xs border border-white/15 flex items-center space-x-2 transition active:scale-95 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reset Token #1</span>
            </button>
          </div>

          <span className={`px-4 py-2 rounded-2xl text-xs font-black flex items-center space-x-2 border shadow-sm ${
            queueStatus === 'active'
              ? 'bg-emerald-400/20 text-emerald-200 border-emerald-400/40'
              : 'bg-amber-400/20 text-amber-200 border-amber-400/40'
          }`}>
            <span className={`w-2 h-2 rounded-full ${queueStatus === 'active' ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
            <span>{queueStatus === 'active' ? 'OPD ACTIVE' : 'PAUSED'}</span>
          </span>
        </div>
      </section>

      {/* TWO COLUMN GRID / RESPONSIVE */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Walk-in Registration Form */}
        <div className="bg-white dark:bg-[#141e28] rounded-3xl p-6 border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-4 h-fit">
          <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center space-x-2 border-b border-slate-100 dark:border-slate-800 pb-3.5">
            <div className="w-7 h-7 rounded-lg bg-teal-100 dark:bg-teal-900/50 text-teal-700 dark:text-teal-300 flex items-center justify-center">
              <Plus className="w-4 h-4" />
            </div>
            <span>Add Walk-in Patient (पर्ची बनाएं)</span>
          </h3>
          <form onSubmit={handleAddOfflinePatient} className="space-y-4">
            <div>
              <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300 mb-1.5">Patient Name *</label>
              <input
                type="text"
                placeholder="Enter patient name"
                value={offlineName}
                onChange={(e) => setOfflineName(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-[#0c1219] border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:bg-white focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition font-semibold"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300 mb-1.5">Mobile Number (Optional)</label>
              <input
                type="tel"
                placeholder="9876543210"
                value={offlinePhone}
                onChange={(e) => setOfflinePhone(e.target.value)}
                maxLength={10}
                className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-[#0c1219] border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:bg-white focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 font-mono transition"
              />
            </div>
            <button
              type="submit"
              disabled={addingPatient}
              className="w-full bg-gradient-to-r from-teal-600 via-teal-700 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white font-black py-3.5 rounded-2xl text-xs shadow-md hover:shadow-lg transition transform hover:-translate-y-0.5 active:scale-95 flex items-center justify-center space-x-2 disabled:opacity-60 cursor-pointer"
            >
              {addingPatient ? <Loader2 className="w-4 h-4 animate-spin text-white" /> : <span>+ Issue Token #{(patients.length > 0 ? Math.max(...patients.map((p) => p.token)) : 0) + 1}</span>}
            </button>
          </form>
        </div>

        {/* Right Column: Patient List Table (Responsive + Item 5 Status Tabs) */}
        <div className="lg:col-span-2 bg-white dark:bg-[#141e28] rounded-3xl p-6 border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-100 dark:border-slate-800">
            <h3 className="text-base font-black text-slate-900 dark:text-white">Today's Patient Queue</h3>
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search name or token..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 pr-4 py-2 text-xs rounded-2xl bg-slate-50 dark:bg-[#0c1219] border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:bg-white focus:border-teal-500 transition w-52 shadow-inner"
                />
              </div>
            </div>
          </div>

          {/* QUEUE STATUS FILTER TABS */}
          <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 text-xs border-b border-slate-100 dark:border-slate-800">
            {[
              { id: 'all', label: `All (${patients.length})` },
              { id: 'waiting', label: `Waiting (${patients.filter(p => p.status === 'waiting').length})` },
              { id: 'in_consultation', label: `In Consultation (${patients.filter(p => p.status === 'in_consultation').length})` },
              { id: 'completed', label: `Completed (${patients.filter(p => p.status === 'completed').length})` },
              { id: 'skipped', label: `Skipped (${patients.filter(p => p.status === 'skipped').length})` },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setStatusFilter(tab.id)}
                className={`px-3.5 py-2 rounded-xl font-bold transition whitespace-nowrap cursor-pointer ${
                  statusFilter === tab.id
                    ? 'bg-teal-600 text-white shadow-md'
                    : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 hover:text-slate-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Patient Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm min-w-[500px]">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-700 bg-slate-50/80 dark:bg-slate-800/40 text-[11px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  <th className="py-3 px-3.5 rounded-l-xl">Token</th>
                  <th className="py-3 px-3">Patient Name</th>
                  <th className="py-3 px-3">Type</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3.5 text-right rounded-r-xl">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredPatients.map((p) => {
                  const isCurrent = p.token === currentToken;
                  return (
                    <tr
                      key={p.id}
                      onClick={() => setSelectedPatientForDrawer(p)}
                      className={`cursor-pointer transition-all duration-200 group ${
                        isCurrent
                          ? 'bg-gradient-to-r from-emerald-500/15 via-teal-500/10 to-transparent border-l-4 border-l-emerald-400 font-bold shadow-sm'
                          : 'hover:bg-[#141e28]/70 hover:translate-x-0.5'
                      }`}
                    >
                      <td className="py-4 px-3.5 font-mono font-black">
                        <span className={`inline-flex items-center justify-center px-2.5 py-1 rounded-xl text-xs font-black shadow-sm ${
                          isCurrent
                            ? 'bg-emerald-400 text-slate-950 ring-2 ring-emerald-400/40 animate-pulse'
                            : 'bg-[#0c1219] text-[#8dbcc7] border border-[rgba(196,225,230,0.16)]'
                        }`}>
                          #{p.token}
                        </span>
                      </td>
                      <td className="py-4 px-3">
                        <div className="text-slate-900 dark:text-white font-bold flex items-center space-x-2">
                          <span className="group-hover:text-[#8dbcc7] transition-colors">{p.name}</span>
                          <span className="text-[10px] text-teal-700 dark:text-teal-300 bg-teal-50 dark:bg-teal-950/60 border border-teal-200/80 dark:border-teal-800 px-2 py-0.5 rounded-lg font-semibold">
                            History 📋
                          </span>
                        </div>
                        <div className="flex items-center space-x-2 text-[11px] text-slate-400 font-mono mt-0.5">
                          {p.phone !== 'N/A' && <span>{p.phone}</span>}
                          <span>•</span>
                          <span className="text-slate-500">Wait: ~{(p.token - currentToken) > 0 ? (p.token - currentToken) * 6 : 0} min</span>
                        </div>
                      </td>
                      <td className="py-4 px-3">
                        <span className={`inline-block text-[11px] px-2.5 py-0.5 rounded-full font-extrabold border ${
                          p.type === 'Online Booking'
                            ? 'bg-sky-500/10 text-sky-300 border-sky-500/30'
                            : 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                        }`}>
                          {p.type}
                        </span>
                      </td>
                      <td className="py-4 px-3">
                        {p.status === 'in_consultation' || isCurrent ? (
                          <span className="inline-flex items-center space-x-1.5 text-xs text-emerald-300 font-extrabold bg-emerald-950/70 border border-emerald-500/50 px-3 py-1 rounded-full shadow-sm animate-pulse">
                            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                            <span>In Consultation</span>
                          </span>
                        ) : p.status === 'completed' ? (
                          <span className="text-xs text-slate-400 font-medium bg-slate-900/60 border border-slate-800 px-2.5 py-0.5 rounded-full">Completed</span>
                        ) : p.status === 'skipped' ? (
                          <span className="text-xs text-amber-300 bg-amber-950/50 border border-amber-800/40 px-2 py-0.5 rounded-full font-bold">Skipped</span>
                        ) : p.status === 'cancelled' ? (
                          <span className="text-xs text-rose-300 bg-rose-950/50 border border-rose-800/40 px-2 py-0.5 rounded-full font-bold">Cancelled</span>
                        ) : (
                          <span className="text-xs text-teal-300 bg-teal-950/50 border border-teal-800/40 px-2.5 py-0.5 rounded-full font-bold">Waiting</span>
                        )}
                      </td>
                      <td className="py-3.5 px-3.5 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end space-x-2">
                          <Link
                            href={`/doctor/prescription?patient=${encodeURIComponent(p.name)}&token=${p.token}`}
                            className="text-xs bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200/90 px-3 py-1.5 rounded-xl font-black transition flex items-center space-x-1 shadow-sm"
                          >
                            <FileText className="w-3.5 h-3.5" />
                            <span>Rx</span>
                          </Link>
                          {p.status === 'waiting' && (
                            <>
                              <button
                                onClick={() => updatePatientStatus(p.id, 'skipped')}
                                className="p-1.5 text-slate-400 hover:text-amber-600 bg-slate-100 hover:bg-amber-50 border border-slate-200 rounded-lg transition"
                                title="Skip Patient"
                              >
                                <SkipForward className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => updatePatientStatus(p.id, 'cancelled')}
                                className="p-1.5 text-slate-400 hover:text-rose-600 bg-slate-100 hover:bg-rose-50 border border-slate-200 rounded-lg transition"
                                title="Cancel Token"
                              >
                                <XCircle className="w-4 h-4" />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* QUICK PATIENT HISTORY & VITALS SIDE DRAWER */}
      {selectedPatientForDrawer && (
        <div className="fixed inset-0 bg-slate-950/50 backdrop-blur-sm z-50 flex justify-end">
          <div className="w-full max-w-md bg-white dark:bg-[#141e28] border-l border-slate-200 dark:border-slate-800 h-full p-6 space-y-6 overflow-y-auto animate-in slide-in-from-right duration-200 shadow-2xl">
            {/* Header */}
            <div className="flex justify-between items-start border-b border-slate-100 dark:border-slate-800 pb-4">
              <div className="space-y-1">
                <div className="inline-flex items-center space-x-1.5 bg-teal-50 text-teal-800 border border-teal-200 px-3 py-0.5 rounded-full text-xs font-black">
                  <User className="w-3 h-3" />
                  <span>Token #{selectedPatientForDrawer.token}</span>
                </div>
                <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">{selectedPatientForDrawer.name}</h3>
                <p className="text-xs text-slate-500 font-mono">Mobile: {selectedPatientForDrawer.phone}</p>
              </div>
              <button
                onClick={() => setSelectedPatientForDrawer(null)}
                className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-xl bg-slate-100 dark:bg-slate-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Demographics & Allergy Warning */}
            <div className="space-y-3">
              <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-2xl flex items-center space-x-2 text-rose-800 text-xs font-bold">
                <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
                <span>Allergies: {selectedPatientForDrawer.allergies?.join(', ') || 'None recorded'}</span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="bg-slate-50 dark:bg-[#0c1219] p-3.5 rounded-2xl border border-slate-200/80 dark:border-slate-800">
                  <span className="text-slate-500 block text-[10px] uppercase font-extrabold">Age / Gender</span>
                  <span className="font-extrabold text-slate-900 dark:text-white">{selectedPatientForDrawer.ageGender || '32 / Male'}</span>
                </div>
                <div className="bg-slate-50 dark:bg-[#0c1219] p-3.5 rounded-2xl border border-slate-200/80 dark:border-slate-800">
                  <span className="text-slate-500 block text-[10px] uppercase font-extrabold">Last Visit</span>
                  <span className="font-extrabold text-teal-700 dark:text-teal-400">{selectedPatientForDrawer.lastVisit || '14 Aug 2026'}</span>
                </div>
              </div>
            </div>

            {/* Consultation History Notes */}
            <div className="space-y-2">
              <h4 className="text-xs font-extrabold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center space-x-1.5">
                <History className="w-4 h-4 text-teal-600" />
                <span>Clinical Notes & Complaints</span>
              </h4>
              <div className="bg-slate-50 dark:bg-[#0c1219] border border-slate-200/80 dark:border-slate-800 p-4 rounded-2xl text-xs text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                {selectedPatientForDrawer.notes || 'No previous complaints logged.'}
              </div>
            </div>

            {/* Vitals History */}
            <div className="space-y-2">
              <h4 className="text-xs font-extrabold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center space-x-1.5">
                <Activity className="w-4 h-4 text-teal-600" />
                <span>Last Vitals Reading</span>
              </h4>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-slate-50 dark:bg-[#0c1219] p-3 rounded-xl border border-slate-200/80 dark:border-slate-800 flex justify-between">
                  <span className="text-slate-500">B.P.:</span>
                  <span className="font-bold text-slate-900 dark:text-white">120/80 mmHg</span>
                </div>
                <div className="bg-slate-50 dark:bg-[#0c1219] p-3 rounded-xl border border-slate-200/80 dark:border-slate-800 flex justify-between">
                  <span className="text-slate-500">Pulse:</span>
                  <span className="font-bold text-slate-900 dark:text-white">72 bpm</span>
                </div>
                <div className="bg-slate-50 dark:bg-[#0c1219] p-3 rounded-xl border border-slate-200/80 dark:border-slate-800 flex justify-between">
                  <span className="text-slate-500">Weight:</span>
                  <span className="font-bold text-slate-900 dark:text-white">68 kg</span>
                </div>
                <div className="bg-slate-50 dark:bg-[#0c1219] p-3 rounded-xl border border-slate-200/80 dark:border-slate-800 flex justify-between">
                  <span className="text-slate-500">Temp:</span>
                  <span className="font-bold text-slate-900 dark:text-white">98.6 °F</span>
                </div>
              </div>
            </div>

            {/* Quick Action Button */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
              <Link
                href={`/doctor/prescription?patient=${encodeURIComponent(selectedPatientForDrawer.name)}&token=${selectedPatientForDrawer.token}`}
                className="w-full bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white font-black py-3.5 rounded-2xl text-xs flex items-center justify-center space-x-2 transition shadow-md hover:shadow-lg"
              >
                <FileText className="w-4 h-4" />
                <span>Create Digital Prescription for {selectedPatientForDrawer.name}</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
