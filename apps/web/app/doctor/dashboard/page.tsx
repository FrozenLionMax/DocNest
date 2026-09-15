'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '../../../lib/supabase';
import { getSession } from '../../../lib/auth';
import {
  Users, Play, Pause, RotateCcw, Plus, Phone, Stethoscope, FileText, Tv,
  CheckCircle2, XCircle, SkipForward, Search, Volume2, VolumeX, Loader2,
  Calendar, AlertCircle, QrCode
} from 'lucide-react';

interface PatientEntry {
  id: string;
  token: number;
  name: string;
  phone: string;
  time: string;
  status: 'waiting' | 'in_consultation' | 'completed' | 'skipped' | 'cancelled';
  type: 'Online Booking' | 'Offline पर्चा';
}

export default function DoctorDashboard() {
  const router = useRouter();
  const session = getSession();

  const [currentToken, setCurrentToken] = useState(1);
  const [totalIssued, setTotalIssued] = useState(0);
  const [queueStatus, setQueueStatus] = useState<'active' | 'paused' | 'closed'>('active');
  const [offlineName, setOfflineName] = useState('');
  const [offlinePhone, setOfflinePhone] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [loading, setLoading] = useState(true);
  const [addingPatient, setAddingPatient] = useState(false);

  const [patients, setPatients] = useState<PatientEntry[]>([
    { id: 'q-1', token: 1, name: 'Rahul Sharma (राहुल शर्मा)', phone: '9876543210', time: '10:00 AM', status: 'in_consultation', type: 'Online Booking' },
    { id: 'q-2', token: 2, name: 'Priya Singh (प्रिया सिंह)', phone: '9812345678', time: '10:15 AM', status: 'waiting', type: 'Online Booking' },
    { id: 'q-3', token: 3, name: 'Amitabh Mishra (अमिताभ मिश्रा)', phone: '9988776655', time: '10:30 AM', status: 'waiting', type: 'Offline पर्चा' },
    { id: 'q-4', token: 4, name: 'Sunita Devi (सुनीता देवी)', phone: '9765432109', time: '10:45 AM', status: 'waiting', type: 'Offline पर्चा' },
  ]);

  useEffect(() => {
    async function loadQueueData() {
      setLoading(true);
      try {
        const doctorId = session?.id || 'doc-001';
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
            return [...prev, { id: payload.new.id, token: payload.new.token_number, name: payload.new.patient_name, phone: payload.new.patient_phone || '', time: 'Just now', status: payload.new.status, type: payload.new.source === 'online' ? 'Online Booking' : 'Offline पर्चा' }];
          });
        }
      }).subscribe();
    return () => { supabase.removeChannel(channel); };
  }, []);

  const playChimeSound = () => {
    if (!soundEnabled) return;
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator(); const gain = audioCtx.createGain();
      osc.type = 'sine'; osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.15);
      gain.gain.setValueAtTime(0.3, audioCtx.currentTime); gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);
      osc.connect(gain); gain.connect(audioCtx.destination); osc.start(); osc.stop(audioCtx.currentTime + 0.3);
    } catch (e) { console.log('Audio chime error:', e); }
  };

  const speakTokenCallout = (tokenNum: number) => {
    if (!soundEnabled || typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();
      const text = `Token number ${tokenNum}. टोकन नंबर ${tokenNum}, डॉक्टर कक्ष में पधारें।`;
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1.0;
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.log('Voice speech error:', e);
    }
  };

  const handleNextToken = async () => {
    const nextVal = currentToken + 1;
    if (nextVal > totalIssued && patients.length > 0) setTotalIssued(nextVal);
    setCurrentToken(nextVal);
    playChimeSound();
    speakTokenCallout(nextVal);
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
    const newPatient: PatientEntry = { id: `q-off-${Date.now()}`, token: newToken, name: offlineName, phone: offlinePhone || 'N/A', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), status: 'waiting', type: 'Offline पर्चा' };
    setPatients((prev) => [...prev, newPatient]); setTotalIssued((prev) => Math.max(prev, newToken));
    setOfflineName(''); setOfflinePhone('');
    try { await supabase.from('queue_entries').insert([{ token_number: newToken, patient_name: offlineName, patient_phone: offlinePhone, source: 'walk_in', status: 'waiting' }]); } catch (err) {}
    finally { setAddingPatient(false); }
  };

  const updatePatientStatus = async (patientId: string, newStatus: PatientEntry['status']) => {
    setPatients((prev) => prev.map((p) => (p.id === patientId ? { ...p, status: newStatus } : p)));
    try { await supabase.from('queue_entries').update({ status: newStatus }).eq('id', patientId); } catch (e) {}
  };

  const filteredPatients = patients.filter((p) => p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.token.toString().includes(searchQuery) || p.phone.includes(searchQuery));

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-7xl mx-auto w-full">
      {/* Top Header Bar */}
      <div className="flex flex-wrap justify-between items-center gap-4 bg-slate-900 border border-slate-800 p-5 rounded-2xl">
        <div>
          <h1 className="text-xl md:text-2xl font-black text-white tracking-tight flex items-center space-x-2">
            <span>OPD Live Queue Controller</span>
          </h1>
          <p className="text-xs text-slate-400 font-medium mt-0.5">{session?.clinic || 'Gupta Clinic & Joint Care Center — Deoria'}</p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl border border-slate-700 transition"
            title="Toggle Audio & Voice Callouts"
          >
            {soundEnabled ? <Volume2 className="w-5 h-5 text-emerald-400" /> : <VolumeX className="w-5 h-5 text-slate-500" />}
          </button>
          <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 px-3.5 py-2 rounded-xl text-xs font-bold flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>{session?.name || 'Dr. Amit Kumar'}</span>
          </div>
        </div>
      </div>

      {/* LIVE QUEUE HERO CARD */}
      <section className="bg-gradient-to-br from-emerald-950 via-slate-900 to-slate-950 text-white border border-emerald-500/20 rounded-3xl p-6 md:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 relative z-10">
          <div>
            <div className="inline-flex items-center space-x-2 bg-emerald-500/20 text-emerald-300 px-3 py-1 rounded-full text-xs font-semibold mb-3 border border-emerald-500/30">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>OPD TOKEN CONTROLLER</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">क्लिनिक टोकन काउंटर</h2>
            <p className="text-emerald-200/80 text-xs md:text-sm mt-1">Realtime Supabase Sync & Voice Announcements</p>
          </div>
          
          <div className="bg-slate-950/80 backdrop-blur border border-emerald-500/30 rounded-2xl p-5 text-center min-w-[220px] w-full lg:w-auto shadow-xl">
            <p className="text-xs text-emerald-400 uppercase tracking-wider font-extrabold">Now Serving</p>
            <p className="text-5xl md:text-6xl font-black text-emerald-400 my-1 font-mono">#{currentToken}</p>
            <p className="text-xs text-slate-400 font-semibold">Total Issued: #{totalIssued}</p>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-800 flex flex-wrap items-center justify-between gap-4 relative z-10">
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleNextToken}
              className="bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-slate-950 font-black px-6 py-3.5 rounded-xl text-sm flex items-center space-x-2 shadow-lg transition"
            >
              <Play className="w-5 h-5 fill-slate-950" />
              <span>Next Patient (अगला टोकन)</span>
            </button>
            <button
              onClick={handleToggleQueueStatus}
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold px-4 py-3.5 rounded-xl text-sm border border-slate-700 flex items-center space-x-2 transition"
            >
              <Pause className="w-4 h-4" />
              <span>{queueStatus === 'active' ? 'Pause OPD' : 'Resume OPD'}</span>
            </button>
            <button
              onClick={handleResetQueue}
              className="bg-slate-900 hover:bg-slate-800 text-slate-400 font-medium px-4 py-3.5 rounded-xl text-xs border border-slate-800 flex items-center space-x-2 transition"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reset Token #1</span>
            </button>
          </div>

          <span className={`px-3 py-1.5 rounded-xl text-xs font-bold border ${
            queueStatus === 'active' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
          }`}>
            {queueStatus === 'active' ? '● OPD ACTIVE' : 'PAUSED'}
          </span>
        </div>
      </section>

      {/* TWO COLUMN GRID / RESPONSIVE */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Walk-in Registration Form */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 h-fit space-y-4">
          <h3 className="text-lg font-bold text-white flex items-center space-x-2">
            <Plus className="w-5 h-5 text-emerald-400" />
            <span>Add Walk-in Patient</span>
          </h3>
          <form onSubmit={handleAddOfflinePatient} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Patient Name *</label>
              <input
                type="text"
                placeholder="Enter patient name"
                value={offlineName}
                onChange={(e) => setOfflineName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-emerald-500 transition"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Mobile Number (Optional)</label>
              <input
                type="tel"
                placeholder="9876543210"
                value={offlinePhone}
                onChange={(e) => setOfflinePhone(e.target.value)}
                maxLength={10}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-emerald-500 font-mono transition"
              />
            </div>
            <button
              type="submit"
              disabled={addingPatient}
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-xl text-sm shadow transition flex items-center justify-center space-x-2 disabled:opacity-60"
            >
              {addingPatient ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>+ Add Token #{(patients.length > 0 ? Math.max(...patients.map((p) => p.token)) : 0) + 1}</span>}
            </button>
          </form>
        </div>

        {/* Right Column: Patient List Table (Responsive) */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
            <h3 className="text-lg font-bold text-white">Today's Patient Queue</h3>
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
                <input
                  type="text"
                  placeholder="Search name or token..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 pr-3 py-1.5 text-xs rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-emerald-500 w-44"
                />
              </div>
              <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-xl">
                {patients.length} Total
              </span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm min-w-[500px]">
              <thead>
                <tr className="border-b border-slate-800 text-xs font-bold text-slate-400 uppercase tracking-wider">
                  <th className="py-3 px-3">Token</th>
                  <th className="py-3 px-3">Patient Name</th>
                  <th className="py-3 px-3">Type</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredPatients.map((p) => {
                  const isCurrent = p.token === currentToken;
                  return (
                    <tr key={p.id} className={isCurrent ? 'bg-emerald-500/10 font-bold' : 'hover:bg-slate-800/40'}>
                      <td className="py-3.5 px-3 font-mono font-black text-emerald-400">#{p.token}</td>
                      <td className="py-3.5 px-3">
                        <div className="text-white font-semibold">{p.name}</div>
                        {p.phone !== 'N/A' && <div className="text-[11px] text-slate-400 font-mono">{p.phone}</div>}
                      </td>
                      <td className="py-3.5 px-3">
                        <span className={`inline-block text-[11px] px-2.5 py-0.5 rounded-md font-semibold ${
                          p.type === 'Online Booking' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                        }`}>
                          {p.type}
                        </span>
                      </td>
                      <td className="py-3.5 px-3">
                        {p.status === 'in_consultation' || isCurrent ? (
                          <span className="inline-flex items-center text-xs text-emerald-400 font-bold bg-emerald-500/20 border border-emerald-500/30 px-2.5 py-1 rounded-full">
                            ● In Consultation
                          </span>
                        ) : p.status === 'completed' ? (
                          <span className="text-xs text-slate-500 font-medium">Completed</span>
                        ) : p.status === 'skipped' ? (
                          <span className="text-xs text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">Skipped</span>
                        ) : p.status === 'cancelled' ? (
                          <span className="text-xs text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">Cancelled</span>
                        ) : (
                          <span className="text-xs text-slate-400">Waiting</span>
                        )}
                      </td>
                      <td className="py-3.5 px-3 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <Link
                            href={`/doctor/prescription?patient=${encodeURIComponent(p.name)}&token=${p.token}`}
                            className="text-xs bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-400 border border-emerald-500/30 px-3 py-1.5 rounded-xl font-bold transition flex items-center space-x-1"
                          >
                            <FileText className="w-3.5 h-3.5" />
                            <span>Rx</span>
                          </Link>
                          {p.status === 'waiting' && (
                            <>
                              <button
                                onClick={() => updatePatientStatus(p.id, 'skipped')}
                                className="p-1.5 text-slate-400 hover:text-amber-400 bg-slate-800 rounded-lg transition"
                                title="Skip Patient"
                              >
                                <SkipForward className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => updatePatientStatus(p.id, 'cancelled')}
                                className="p-1.5 text-slate-400 hover:text-rose-400 bg-slate-800 rounded-lg transition"
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
    </div>
  );
}
