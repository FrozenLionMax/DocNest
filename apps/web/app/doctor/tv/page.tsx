'use client';

import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../../../lib/supabase';
import { Tv, Volume2, Clock, VolumeX, AlertTriangle, ShieldAlert, Users, QrCode } from 'lucide-react';
import NavControls from '../../../components/NavControls';
import { getClinicState, getQueueEntries, subscribeToClinicalEvents, QueueEntry } from '../../../lib/clinical-store';

export default function DoctorTvPage() {
  const [currentToken, setCurrentToken] = useState(1);
  const [totalIssued, setTotalIssued] = useState(1);
  const [currentPatientName, setCurrentPatientName] = useState('Rahul Sharma');
  const [queueEntries, setQueueEntries] = useState<QueueEntry[]>([]);
  const [clinicName] = useState('Gupta Clinic & Joint Care Center');
  const [doctorName] = useState('Dr. Amit Kumar (MS Ortho)');
  const [currentTime, setCurrentTime] = useState('');
  const [voiceEnabled, setVoiceEnabled] = useState(true);

  // Emergency Pause State
  const [emergency, setEmergency] = useState<{
    active: boolean;
    reason: string;
    delay: string;
  } | null>(null);

  // Live Digital Clock
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);
    setCurrentTime(new Date().toLocaleTimeString());
    return () => clearInterval(timer);
  }, []);

  const playChimeRing = () => {
    if (!voiceEnabled || typeof window === 'undefined') return;
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const now = audioCtx.currentTime;

      const osc1 = audioCtx.createOscillator();
      const gain1 = audioCtx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(587.33, now);
      osc1.frequency.exponentialRampToValueAtTime(880, now + 0.12);
      gain1.gain.setValueAtTime(0.35, now);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
      osc1.connect(gain1);
      gain1.connect(audioCtx.destination);
      osc1.start(now);
      osc1.stop(now + 0.4);

      const osc2 = audioCtx.createOscillator();
      const gain2 = audioCtx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(659.25, now + 0.15);
      osc2.frequency.exponentialRampToValueAtTime(1046.5, now + 0.28);
      gain2.gain.setValueAtTime(0.4, now + 0.15);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
      osc2.connect(gain2);
      gain2.connect(audioCtx.destination);
      osc2.start(now + 0.15);
      osc2.stop(now + 0.6);
    } catch (e) {
      console.log('TV chime ring error:', e);
    }
  };

  const speakTokenAnnouncement = (token: number, patientNameStr?: string) => {
    if (!voiceEnabled || typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();
      const announcement = `टोकन नंबर ${token}, ${patientNameStr || ''}, कृपया डॉक्टर कक्ष में आएं। Token number ${token}, please proceed to the doctor consultation room.`;
      const utterance = new SpeechSynthesisUtterance(announcement);
      utterance.rate = 0.95;
      utterance.pitch = 1.05;
      window.speechSynthesis.speak(utterance);
    } catch (e) {}
  };

  const syncTvState = () => {
    const state = getClinicState('doc-001');
    const entries = getQueueEntries('doc-001');
    setCurrentToken(state.currentToken);
    setTotalIssued(state.totalIssued);
    setQueueEntries(entries);

    const activePatient = entries.find(e => e.tokenNumber === state.currentToken);
    if (activePatient) {
      setCurrentPatientName(activePatient.patientName);
    }

    if (state.status === 'paused') {
      setEmergency({
        active: true,
        reason: state.pauseReason || 'Urgent ICU Emergency Call / आपातकालीन रोक',
        delay: '30 mins',
      });
    } else {
      setEmergency(null);
    }
  };

  useEffect(() => {
    syncTvState();

    // 1. Central Clinical Store Event Subscription
    const unsubscribe = subscribeToClinicalEvents((data) => {
      syncTvState();
      playChimeRing();

      if (data.type === 'docnest_clinical_state') {
        const payload = data.payload;
        if (payload?.currentToken) {
          const entries = getQueueEntries('doc-001');
          const p = entries.find(e => e.tokenNumber === payload.currentToken);
          speakTokenAnnouncement(payload.currentToken, p?.patientName);
        }
      }
    });

    // 2. Supabase Realtime Channel
    const channel = supabase.channel('opd-live-queue')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'clinic_queues' }, (payload: any) => {
        if (payload.new?.current_token !== undefined) {
          setCurrentToken(payload.new.current_token);
          playChimeRing();
          speakTokenAnnouncement(payload.new.current_token);
        }
        if (payload.new?.status === 'paused') {
          setEmergency({
            active: true,
            reason: payload.new.pause_reason || 'Urgent ICU Emergency Call / आपातकालीन रोक',
            delay: '30 mins',
          });
          playChimeRing();
        } else if (payload.new?.status === 'active') {
          setEmergency(null);
          playChimeRing();
        }
      })
      .on('broadcast', { event: 'token-update' }, (payload: any) => {
        if (payload.payload?.currentToken) {
          setCurrentToken(payload.payload.currentToken);
          playChimeRing();
          speakTokenAnnouncement(payload.payload.currentToken);
        }
      })
      .on('broadcast', { event: 'emergency-pause' }, (payload: any) => {
        const reason = payload.payload?.reason || 'Urgent ICU Emergency Call';
        const delay = payload.payload?.delay || '30 mins';
        setEmergency({ active: true, reason, delay });
        playChimeRing();
      })
      .on('broadcast', { event: 'emergency-resume' }, () => {
        setEmergency(null);
        playChimeRing();
      })
      .subscribe();

    return () => {
      unsubscribe();
      supabase.removeChannel(channel);
    };
  }, [voiceEnabled]);

  // Compute next 3 upcoming patients
  const upcomingPatients = queueEntries
    .filter(e => e.tokenNumber > currentToken && e.status === 'waiting')
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col justify-between p-6 md:p-10 font-['Plus_Jakarta_Sans',sans-serif] relative overflow-hidden select-none">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-emerald-500/10 rounded-full blur-[140px] pointer-events-none" />

      {/* TV Header */}
      <header className="flex flex-wrap justify-between items-center border-b border-slate-800 pb-6 relative z-10 gap-4">
        <div className="flex items-center space-x-4">
          <NavControls fallbackBackUrl="/doctor/dashboard" showHome={true} showLogout={true} />
          <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-700 text-white rounded-2xl flex items-center justify-center text-3xl shadow-lg shadow-emerald-950">
            🩺
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">{clinicName}</h1>
            <p className="text-emerald-400 font-semibold text-sm md:text-base">{doctorName} — Smart TV Waiting Room Display</p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <button
            onClick={() => setVoiceEnabled(!voiceEnabled)}
            className="p-3 bg-slate-900 border border-slate-800 text-slate-300 hover:text-emerald-400 rounded-xl transition"
            title="Toggle Voice Callout"
          >
            {voiceEnabled ? <Volume2 className="w-6 h-6 text-emerald-400" /> : <VolumeX className="w-6 h-6 text-slate-500" />}
          </button>
          <div className="bg-slate-900 border border-slate-800 text-slate-300 px-4 py-2 rounded-2xl font-mono text-lg font-bold flex items-center space-x-2">
            <Clock className="w-5 h-5 text-emerald-400" />
            <span>{currentTime || '10:00:00 AM'}</span>
          </div>
          <div className={`px-4 py-2.5 rounded-full font-bold text-sm flex items-center space-x-2 border ${
            emergency?.active ? 'bg-rose-500/20 text-rose-300 border-rose-500/40' : 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
          }`}>
            <span className={`w-3 h-3 rounded-full animate-ping ${emergency?.active ? 'bg-rose-500' : 'bg-emerald-400'}`} />
            <span>{emergency?.active ? '🚨 EMERGENCY PAUSE' : 'REALTIME OPD LIVE'}</span>
          </div>
        </div>
      </header>

      {/* EMERGENCY BANNER OVERLAY (If active) */}
      {emergency?.active && (
        <div className="my-4 p-6 bg-gradient-to-r from-rose-950 via-slate-900 to-amber-950 border-4 border-rose-500 rounded-3xl shadow-2xl relative z-20 space-y-2 text-center animate-pulse">
          <div className="inline-flex items-center space-x-2 bg-rose-500 text-slate-950 font-black px-4 py-1 rounded-full text-xs uppercase tracking-widest">
            <AlertTriangle className="w-4 h-4 fill-slate-950" />
            <span>EMERGENCY PAUSE NOTICE / आपातकालीन सूचना</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-black text-rose-200">{emergency.reason}</h2>
          <p className="text-base text-amber-300 font-bold">
            Doctor is attending an emergency case • Expected delay: ~{emergency.delay} • OPD will resume shortly
          </p>
        </div>
      )}

      {/* Main TV Layout */}
      <main className="my-auto py-8 relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
        {/* Main Big Token Display */}
        <div className="lg:col-span-2 flex flex-col items-center justify-center text-center space-y-6">
          <div className="inline-flex items-center space-x-2 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-5 py-1.5 rounded-full text-sm font-extrabold tracking-widest uppercase">
            <span>Now Serving Token / वर्तमान टोकन नंबर</span>
          </div>

          <div className={`border-4 rounded-3xl p-12 md:p-16 shadow-2xl min-w-[320px] md:min-w-[500px] text-center relative overflow-hidden transition-all ${
            emergency?.active ? 'bg-slate-900 border-rose-500/60' : 'bg-gradient-to-b from-emerald-950 via-slate-900 to-slate-950 border-emerald-500/40'
          }`}>
            <div className="absolute top-0 right-0 w-40 h-40 bg-emerald-500/10 rounded-full blur-3xl" />
            <span className={`text-9xl md:text-[160px] font-black font-mono tracking-tight drop-shadow-2xl leading-none ${
              emergency?.active ? 'text-rose-400' : 'text-emerald-400'
            }`}>
              #{currentToken}
            </span>
            <div className="mt-4 pt-4 border-t border-white/10">
              <p className="text-xs uppercase tracking-wider text-slate-400 font-semibold">Patient Name</p>
              <h2 className="text-3xl md:text-4xl font-black text-white mt-1">
                {currentPatientName}
              </h2>
            </div>
          </div>

          <p className="text-base text-emerald-200/90 font-medium bg-slate-900/60 border border-slate-800 px-6 py-2.5 rounded-full">
            {emergency?.active ? '🚨 OPD temporarily paused for emergency • ओपीडी आपातकालीन रोक पर है' : 'कृपया अपने टोकन नंबर का इंतजार करें • Please proceed when your token is called'}
          </p>
        </div>

        {/* Next Tokens Queue Preview Box & Mobile Token QR */}
        <div className="space-y-6">
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
              <span className="flex items-center space-x-1.5">
                <Users className="w-4 h-4 text-emerald-400" />
                <span>Next In Line (अगले नंबर)</span>
              </span>
              <span className="text-emerald-400 text-xs font-mono font-bold">Total: #{totalIssued}</span>
            </h3>

            <div className="space-y-3">
              {upcomingPatients.length > 0 ? (
                upcomingPatients.map((entry, idx) => (
                  <div key={entry.id} className="bg-slate-950 border border-slate-800/80 rounded-2xl p-4 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="w-8 h-8 rounded-full bg-slate-800 text-slate-300 font-bold text-xs flex items-center justify-center font-mono">
                        {idx + 1}
                      </span>
                      <div>
                        <span className="font-mono font-extrabold text-xl text-emerald-400">#{entry.tokenNumber}</span>
                        <p className="text-xs font-bold text-white truncate max-w-[140px]">{entry.patientName}</p>
                      </div>
                    </div>
                    <span className="text-[11px] text-slate-400 font-mono">
                      ~{(idx + 1) * 8} min
                    </span>
                  </div>
                ))
              ) : (
                [1, 2, 3].map((offset) => (
                  <div key={offset} className="bg-slate-950 border border-slate-800/80 rounded-2xl p-4 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="w-8 h-8 rounded-full bg-slate-800 text-slate-300 font-bold text-xs flex items-center justify-center font-mono">
                        {offset}
                      </span>
                      <span className="font-mono font-extrabold text-2xl text-white">#{currentToken + offset}</span>
                    </div>
                    <span className="text-xs text-slate-400 font-medium">Estimated ~{offset * 8} min</span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Quick Mobile QR Box */}
          <div className="bg-slate-900/70 border border-slate-800 rounded-3xl p-5 flex items-center space-x-4">
            <div className="w-16 h-16 bg-white p-1 rounded-xl flex items-center justify-center flex-shrink-0 shadow">
              <QrCode className="w-14 h-14 text-slate-900" />
            </div>
            <div className="text-xs space-y-1">
              <p className="font-bold text-white">Track on Mobile / फोन पर देखें</p>
              <p className="text-slate-400 text-[11px]">Scan QR or visit <span className="text-emerald-400 font-mono font-bold">drugs.systems/patient</span> to check live queue.</p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer Ticker */}
      <footer className={`border rounded-2xl p-4 flex items-center space-x-4 overflow-hidden relative z-10 transition-colors ${
        emergency?.active ? 'bg-rose-950/80 border-rose-800' : 'bg-slate-900 border-slate-800'
      }`}>
        <div className={`font-black text-xs px-3 py-1.5 rounded-lg flex items-center space-x-1.5 flex-shrink-0 ${
          emergency?.active ? 'bg-rose-500 text-slate-950' : 'bg-emerald-500 text-slate-950'
        }`}>
          <Volume2 className="w-4 h-4" />
          <span>{emergency?.active ? 'EMERGENCY NOTICE' : 'ANNOUNCEMENT'}</span>
        </div>
        <div className="overflow-hidden whitespace-nowrap text-sm font-semibold tracking-wide text-slate-200">
          {emergency?.active ? (
            <span className="text-rose-200 font-bold">
              🚨 आपातकालीन सूचना: डॉक्टर आईसीयू/ओटी इमरजेंसी कॉल पर हैं ({emergency.reason}) • अनुमानित रोक: ~{emergency.delay} • ओपीडी जल्द पुनः चालू होगी
            </span>
          ) : (
            <span>
              कृपया शांति बनाए रखें • आपातकालीन मरीज सीधे संपर्क करें • QR कोड से मोबाइल पर टोकन देखें • DocNest Healthcare Platform • drugs.systems
            </span>
          )}
        </div>
      </footer>
    </div>
  );
}
