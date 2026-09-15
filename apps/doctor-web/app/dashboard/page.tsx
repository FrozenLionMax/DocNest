'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabase';
import { LanguageTogglePill } from '../../components/LanguageContext';
import {
  Users,
  Play,
  Pause,
  RotateCcw,
  Plus,
  Phone,
  Stethoscope,
  LogOut,
  FileText,
  Tv,
  CheckCircle2,
  XCircle,
  SkipForward,
  Search,
  Volume2,
  VolumeX,
  Loader2,
  Calendar,
  AlertCircle,
  QrCode
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
  const [doctorSession, setDoctorSession] = useState<{
    id: string;
    name: string;
    specialty: string;
    clinic: string;
    phone: string;
  } | null>(null);

  const [currentToken, setCurrentToken] = useState(1);
  const [totalIssued, setTotalIssued] = useState(0);
  const [queueStatus, setQueueStatus] = useState<'active' | 'paused' | 'closed'>('active');
  const [offlineName, setOfflineName] = useState('');
  const [offlinePhone, setOfflinePhone] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [loading, setLoading] = useState(true);
  const [addingPatient, setAddingPatient] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const [patients, setPatients] = useState<PatientEntry[]>([
    { id: 'q-1', token: 1, name: 'Rahul Sharma (राहुल शर्मा)', phone: '9876543210', time: '10:00 AM', status: 'in_consultation', type: 'Online Booking' },
    { id: 'q-2', token: 2, name: 'Priya Singh (प्रिया सिंह)', phone: '9812345678', time: '10:15 AM', status: 'waiting', type: 'Online Booking' },
    { id: 'q-3', token: 3, name: 'Amitabh Mishra (अमिताभ मिश्रा)', phone: '9988776655', time: '10:30 AM', status: 'waiting', type: 'Offline पर्चा' },
    { id: 'q-4', token: 4, name: 'Sunita Devi (सुनीता देवी)', phone: '9765432109', time: '10:45 AM', status: 'waiting', type: 'Offline पर्चा' },
  ]);

  // Load session from storage or auth
  useEffect(() => {
    const sessionStr = sessionStorage.getItem('docnest_doctor');
    if (sessionStr) {
      try {
        setDoctorSession(JSON.parse(sessionStr));
      } catch (e) {
        console.error(e);
      }
    } else {
      // Default demo doctor context
      setDoctorSession({
        id: 'doc-001',
        name: 'Dr. Amit Kumar',
        specialty: 'Orthopedic Surgeon',
        clinic: 'Gupta Clinic & Joint Care Center — Deoria Sadar',
        phone: '9876543210',
      });
    }
  }, []);

  // Fetch initial queue state from Supabase
  useEffect(() => {
    async function loadQueueData() {
      setLoading(true);
      try {
        const doctorId = doctorSession?.id || 'doc-001';

        // 1. Fetch clinic queue status
        const { data: queueData, error: qErr } = await supabase
          .from('clinic_queues')
          .select('*')
          .eq('doctor_id', doctorId)
          .single();

        if (queueData) {
          setCurrentToken(queueData.current_token || 1);
          setTotalIssued(queueData.total_issued || 4);
          setQueueStatus(queueData.status || 'active');
        }

        // 2. Fetch queue entries
        const { data: entries, error: eErr } = await supabase
          .from('queue_entries')
          .select('*')
          .order('token_number', { ascending: true });

        if (entries && entries.length > 0) {
          const mapped = entries.map((item: any) => ({
            id: item.id,
            token: item.token_number,
            name: item.patient_name,
            phone: item.patient_phone || '',
            time: item.created_at ? new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '10:00 AM',
            status: item.status as any,
            type: (item.source === 'online' ? 'Online Booking' : 'Offline पर्चा') as any,
          }));
          setPatients(mapped);
          setTotalIssued(Math.max(mapped.length, queueData?.total_issued || 0));
        }
      } catch (err: any) {
        console.warn('Using local queue cache:', err.message);
      } finally {
        setLoading(false);
      }
    }

    loadQueueData();
  }, [doctorSession?.id]);

  // Realtime subscription setup
  useEffect(() => {
    const channel = supabase
      .channel('opd-live-queue')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'clinic_queues' }, (payload: any) => {
        if (payload.new && payload.new.current_token !== undefined) {
          setCurrentToken(payload.new.current_token);
        }
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'queue_entries' }, (payload: any) => {
        if (payload.new) {
          setPatients((prev) => {
            const index = prev.findIndex((p) => p.id === payload.new.id);
            if (index !== -1) {
              const updated = [...prev];
              updated[index] = {
                ...updated[index],
                status: payload.new.status,
              };
              return updated;
            } else {
              return [
                ...prev,
                {
                  id: payload.new.id,
                  token: payload.new.token_number,
                  name: payload.new.patient_name,
                  phone: payload.new.patient_phone || '',
                  time: 'Just now',
                  status: payload.new.status,
                  type: payload.new.source === 'online' ? 'Online Booking' : 'Offline पर्चा',
                },
              ];
            }
          });
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const playChimeSound = () => {
    if (!soundEnabled) return;
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.15); // A5
      gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.3);
    } catch (e) {
      console.log('Audio chime error:', e);
    }
  };

  const handleNextToken = async () => {
    const nextVal = currentToken + 1;
    if (nextVal > totalIssued && patients.length > 0) {
      setTotalIssued(nextVal);
    }

    setCurrentToken(nextVal);
    playChimeSound();

    // Mark previous patient completed and next patient in_consultation
    setPatients((prev) =>
      prev.map((p) => {
        if (p.token === currentToken) return { ...p, status: 'completed' };
        if (p.token === nextVal) return { ...p, status: 'in_consultation' };
        return p;
      })
    );

    // Call Supabase DB & Broadcast
    try {
      const doctorId = doctorSession?.id || 'doc-001';
      try {
        await supabase.rpc('increment_doctor_token', { p_doctor_id: doctorId });
      } catch (err) {
        // RPC fallback
      }

      try {
        await supabase
          .from('clinic_queues')
          .update({ current_token: nextVal, updated_at: new Date().toISOString() })
          .eq('doctor_id', doctorId);
      } catch (err) {
        // DB update fallback
      }

      await supabase.channel('opd-live-queue').send({
        type: 'broadcast',
        event: 'token-update',
        payload: { currentToken: nextVal, doctorId: doctorId },
      });
    } catch (e) {
      console.log('Token update broadcast warning:', e);
    }
  };

  const handleToggleQueueStatus = async () => {
    const newStatus = queueStatus === 'active' ? 'paused' : 'active';
    setQueueStatus(newStatus);
    try {
      const doctorId = doctorSession?.id || 'doc-001';
      await supabase
        .from('clinic_queues')
        .update({ status: newStatus })
        .eq('doctor_id', doctorId);
    } catch (e) {
      console.log(e);
    }
  };

  const handleResetQueue = async () => {
    setCurrentToken(1);
    try {
      const doctorId = doctorSession?.id || 'doc-001';
      await supabase
        .from('clinic_queues')
        .update({ current_token: 1 })
        .eq('doctor_id', doctorId);
    } catch (e) {
      console.log(e);
    }
  };

  const handleAddOfflinePatient = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!offlineName) return;

    setAddingPatient(true);
    const newToken = (patients.length > 0 ? Math.max(...patients.map((p) => p.token)) : 0) + 1;
    const newPatient: PatientEntry = {
      id: `q-off-${Date.now()}`,
      token: newToken,
      name: offlineName,
      phone: offlinePhone || 'N/A',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: newToken === currentToken ? 'in_consultation' : 'waiting',
      type: 'Offline पर्चा',
    };

    setPatients((prev) => [...prev, newPatient]);
    setTotalIssued((prev) => Math.max(prev, newToken));
    setOfflineName('');
    setOfflinePhone('');

    // Save to database
    try {
      await supabase.from('queue_entries').insert([
        {
          token_number: newToken,
          patient_name: offlineName,
          patient_phone: offlinePhone,
          source: 'walk_in',
          status: 'waiting',
        },
      ]);
    } catch (err) {
      console.log('Saved to local state fallback');
    } finally {
      setAddingPatient(false);
    }
  };

  const updatePatientStatus = async (patientId: string, newStatus: PatientEntry['status']) => {
    setPatients((prev) =>
      prev.map((p) => (p.id === patientId ? { ...p, status: newStatus } : p))
    );

    try {
      await supabase
        .from('queue_entries')
        .update({ status: newStatus })
        .eq('id', patientId);
    } catch (e) {
      console.log('Updated patient status locally');
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut().catch(() => null);
    sessionStorage.removeItem('docnest_doctor');
    router.push('/');
  };

  const filteredPatients = patients.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.token.toString().includes(searchQuery) ||
      p.phone.includes(searchQuery)
  );

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Top Professional Navbar */}
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex flex-wrap justify-between items-center shadow-sm gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold text-xl shadow-sm">
            🩺
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">DocNest Doctor Portal</h1>
            <p className="text-xs text-slate-500 font-medium">
              {doctorSession?.clinic || 'Gupta Clinic & Joint Care Center — Deoria Sadar'}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          {/* Language Switcher Pill */}
          <LanguageTogglePill />

          {/* Schedule & Leave Link */}
          <Link
            href="/schedule"
            className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs px-3.5 py-2 rounded-xl flex items-center space-x-1.5 transition"
          >
            <Calendar className="w-4 h-4 text-emerald-600" />
            <span>OPD टाइमिंग एवं छुट्टी</span>
          </Link>

          {/* QR Poster Link */}
          <Link
            href="/qr-flyer"
            target="_blank"
            className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs px-3.5 py-2 rounded-xl flex items-center space-x-1.5 transition"
          >
            <QrCode className="w-4 h-4 text-emerald-600" />
            <span>रिसेप्शन QR पोस्टर</span>
          </Link>

          {/* Waiting Room TV Display Link */}
          <Link
            href="/tv"
            target="_blank"
            className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs px-3.5 py-2 rounded-xl flex items-center space-x-1.5 transition"
          >
            <Tv className="w-4 h-4 text-emerald-600" />
            <span>वेटिंग रूम TV स्क्रीन</span>
          </Link>

          <Link
            href="/prescription"
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2 rounded-xl flex items-center space-x-1.5 shadow transition"
          >
            <FileText className="w-4 h-4" />
            <span>+ डिजिटल पर्चा (Rx)</span>
          </Link>

          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-2 text-slate-400 hover:text-slate-600 rounded-lg"
            title={soundEnabled ? 'साउंड अलर्ट बंद करें' : 'साउंड अलर्ट चालू करें'}
          >
            {soundEnabled ? <Volume2 className="w-5 h-5 text-emerald-600" /> : <VolumeX className="w-5 h-5 text-slate-400" />}
          </button>

          <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-3 py-1.5 rounded-full text-xs font-semibold flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>{doctorSession?.name || 'Dr. Amit Kumar'}</span>
          </div>

          <button
            onClick={handleLogout}
            className="text-slate-400 hover:text-rose-600 p-2 rounded-lg transition"
            title="लॉगआउट"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </header>

      <main className="flex-1 p-6 md:p-8 max-w-7xl mx-auto w-full space-y-8">
        {/* LIVE QUEUE CONTROLLER HERO PANEL */}
        <section className="bg-gradient-to-br from-emerald-900 via-slate-900 to-slate-950 text-white rounded-3xl p-6 md:p-8 shadow-xl relative overflow-hidden">
          <div className="absolute right-0 top-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
            <div>
              <div className="inline-flex items-center space-x-2 bg-emerald-500/20 text-emerald-300 px-3 py-1 rounded-full text-xs font-semibold mb-3 border border-emerald-500/30">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                <span>OPD LIVE TOKEN CONTROLLER</span>
              </div>
              <h2 className="text-3xl font-extrabold tracking-tight">क्लिनिक पर्ची / टोकन काउंटर</h2>
              <p className="text-emerald-200/80 text-sm mt-1">
                देवरिया मरीजों के मोबाइल ऐप पर लाइव अपडेट: <span className="font-semibold text-white font-mono">Realtime Supabase Sync</span>
              </p>
            </div>

            {/* Current Token Counter */}
            <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-6 text-center min-w-[240px] shadow-inner">
              <p className="text-xs text-emerald-200 uppercase tracking-wider font-semibold">चालू टोकन नंबर (Now Serving)</p>
              <p className="text-6xl font-black text-emerald-400 my-1 font-mono">#{currentToken}</p>
              <p className="text-xs text-slate-300">कुल जारी पर्ची: #{totalIssued}</p>
            </div>
          </div>

          {/* Controller Action Buttons */}
          <div className="mt-8 pt-6 border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center space-x-3">
              <button
                onClick={handleNextToken}
                className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold px-6 py-3.5 rounded-xl flex items-center space-x-2 shadow-lg transition active:scale-95"
              >
                <Play className="w-5 h-5 fill-slate-950" />
                <span>अगला मरीज / Next Patient</span>
              </button>

              <button
                onClick={handleToggleQueueStatus}
                className="bg-white/10 hover:bg-white/20 text-white font-semibold px-4 py-3.5 rounded-xl flex items-center space-x-2 transition"
              >
                <Pause className="w-4 h-4" />
                <span>{queueStatus === 'active' ? 'रोकें (Pause)' : 'चालू करें (Resume)'}</span>
              </button>

              <button
                onClick={handleResetQueue}
                className="bg-white/5 hover:bg-white/10 text-slate-300 font-medium px-4 py-3.5 rounded-xl flex items-center space-x-2 transition text-xs"
              >
                <RotateCcw className="w-4 h-4" />
                <span>रीसेट (#1)</span>
              </button>
            </div>

            <div className="flex items-center space-x-2 text-sm text-slate-300">
              <span className="font-semibold text-white">स्थिति:</span>
              <span className={`px-3 py-1 rounded-lg text-xs font-bold border ${queueStatus === 'active' ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' : 'bg-amber-500/20 text-amber-300 border-amber-500/30'}`}>
                {queueStatus === 'active' ? '● OPD ACTIVE (चालू)' : 'PAUSED (रोका हुआ)'}
              </span>
            </div>
          </div>
        </section>

        {/* TWO COLUMN GRID: Walk-in Entry & Patient Table */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* OFFLINE WALK-IN TOKEN ENTRY FORM */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm h-fit space-y-4">
            <div>
              <h3 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
                <Plus className="w-5 h-5 text-emerald-600" />
                <span>ऑफलाइन मरीज का टोकन काटें</span>
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                क्लिनिक पर आए ऑफलाइन मरीजों का नाम दर्ज कर नया पर्ची नंबर बनाएं
              </p>
            </div>

            <form onSubmit={handleAddOfflinePatient} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">मरीज का नाम (Full Name) *</label>
                <input
                  type="text"
                  placeholder="उदा. राम सिंह"
                  value={offlineName}
                  onChange={(e) => setOfflineName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">मोबाइल नंबर (Optional)</label>
                <input
                  type="tel"
                  placeholder="9876543210"
                  value={offlinePhone}
                  onChange={(e) => setOfflinePhone(e.target.value)}
                  maxLength={10}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-emerald-500 font-mono"
                />
              </div>

              <button
                type="submit"
                disabled={addingPatient}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl text-sm shadow transition flex items-center justify-center space-x-2 disabled:opacity-60"
              >
                {addingPatient ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <span>+ टोकन नंबर #{(patients.length > 0 ? Math.max(...patients.map((p) => p.token)) : 0) + 1} जारी करें</span>
                )}
              </button>
            </form>

            <div className="pt-4 border-t border-slate-100 text-xs text-slate-500 space-y-2">
              <p className="font-semibold text-slate-700">टोकन स्थिति गाइड:</p>
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                <span>अभी अंदर (In Consultation)</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-300"></span>
                <span>संपन्न (Completed)</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
                <span>नो शो (Skipped)</span>
              </div>
            </div>
          </div>

          {/* PATIENT QUEUE & APPOINTMENTS TABLE */}
          <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900">आज के मरीज (Today's Patients)</h3>
                <p className="text-xs text-slate-500">ऑनलाइन ऐप बुकिंग एवं क्लिनिक के पर्चे की लाइव लिस्ट</p>
              </div>

              <div className="flex items-center space-x-3">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="खोजें (नाम/टोकन)..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500 w-44"
                  />
                </div>
                <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-3 py-1.5 rounded-lg whitespace-nowrap">
                  कुल: {patients.length} मरीज
                </span>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    <th className="py-3 px-3">टोकन #</th>
                    <th className="py-3 px-3">मरीज का नाम</th>
                    <th className="py-3 px-3">प्रकार</th>
                    <th className="py-3 px-3">समय</th>
                    <th className="py-3 px-3">स्थिति</th>
                    <th className="py-3 px-3 text-right">कार्रवाई</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {filteredPatients.map((p) => {
                    const isCurrent = p.token === currentToken;
                    return (
                      <tr
                        key={p.id}
                        className={isCurrent ? 'bg-emerald-50/70 font-semibold' : 'hover:bg-slate-50'}
                      >
                        <td className="py-3.5 px-3 font-extrabold text-emerald-700 font-mono">#{p.token}</td>
                        <td className="py-3.5 px-3">
                          <div className="text-slate-900">{p.name}</div>
                          {p.phone && p.phone !== 'N/A' && (
                            <div className="text-[11px] text-slate-400 font-mono">{p.phone}</div>
                          )}
                        </td>
                        <td className="py-3.5 px-3">
                          <span
                            className={`inline-block text-[11px] px-2 py-0.5 rounded-md font-semibold ${
                              p.type === 'Online Booking'
                                ? 'bg-blue-50 text-blue-700 border border-blue-200'
                                : 'bg-amber-50 text-amber-700 border border-amber-200'
                            }`}
                          >
                            {p.type}
                          </span>
                        </td>
                        <td className="py-3.5 px-3 text-xs text-slate-500">{p.time}</td>
                        <td className="py-3.5 px-3">
                          {p.status === 'in_consultation' || isCurrent ? (
                            <span className="inline-flex items-center text-xs text-emerald-700 font-bold bg-emerald-100 px-2.5 py-1 rounded-full">
                              ● अभी अंदर हैं
                            </span>
                          ) : p.status === 'completed' ? (
                            <span className="text-xs text-slate-400">संपन्न (Completed)</span>
                          ) : p.status === 'skipped' ? (
                            <span className="text-xs text-amber-600 bg-amber-50 px-2 py-0.5 rounded">नो शो (Skipped)</span>
                          ) : p.status === 'cancelled' ? (
                            <span className="text-xs text-rose-500 bg-rose-50 px-2 py-0.5 rounded">रद्द (Cancelled)</span>
                          ) : (
                            <span className="text-xs text-slate-500">इंतज़ार (Waiting)</span>
                          )}
                        </td>
                        <td className="py-3.5 px-3 text-right">
                          <div className="flex items-center justify-end space-x-1.5">
                            <Link
                              href={`/prescription?patient=${encodeURIComponent(p.name)}&token=${p.token}`}
                              className="text-xs bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 px-2.5 py-1 rounded-lg font-semibold transition flex items-center space-x-1"
                              title="डिजिटल पर्चा बनाएं"
                            >
                              <FileText className="w-3.5 h-3.5" />
                              <span>Rx</span>
                            </Link>

                            {p.status === 'waiting' && (
                              <>
                                <button
                                  onClick={() => updatePatientStatus(p.id, 'skipped')}
                                  className="p-1 text-slate-400 hover:text-amber-600 rounded"
                                  title="नो शो (Skip)"
                                >
                                  <SkipForward className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => updatePatientStatus(p.id, 'cancelled')}
                                  className="p-1 text-slate-400 hover:text-rose-600 rounded"
                                  title="कैंसल"
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
      </main>
    </div>
  );
}
