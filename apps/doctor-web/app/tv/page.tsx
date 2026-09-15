'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Stethoscope, Volume2, Clock, MapPin, Sparkles } from 'lucide-react';

export default function WaitingRoomTvPage() {
  const [currentToken, setCurrentToken] = useState(14);
  const [totalIssued, setTotalIssued] = useState(25);
  const [currentPatientName, setCurrentPatientName] = useState('Rahul Sharma');
  const [clinicName, setClinicName] = useState('Gupta Clinic & Joint Care Center');
  const [doctorName, setDoctorName] = useState('Dr. Amit Kumar (Orthopedic)');
  const [queueStatus, setQueueStatus] = useState('ACTIVE');
  const [time, setTime] = useState('');

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const channel = supabase
      .channel('opd-live-queue')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'clinic_queues' }, (payload: any) => {
        if (payload.new && payload.new.current_token !== undefined) {
          setCurrentToken(payload.new.current_token);
        }
      })
      .on('broadcast', { event: 'token-update' }, (payload: any) => {
        if (payload.payload && payload.payload.currentToken) {
          setCurrentToken(payload.payload.currentToken);
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col justify-between p-8 font-['Plus_Jakarta_Sans',sans-serif] overflow-hidden select-none">
      {/* Header */}
      <header className="flex justify-between items-center border-b border-slate-800 pb-6">
        <div className="flex items-center space-x-4">
          <div className="w-14 h-14 bg-emerald-500/20 border border-emerald-500/30 rounded-2xl flex items-center justify-center text-emerald-400 text-3xl shadow-lg">
            🩺
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-white tracking-wide">{clinicName}</h1>
            <p className="text-emerald-400 text-base font-semibold">{doctorName} — Sadar, Deoria</p>
          </div>
        </div>

        <div className="text-right">
          <div className="text-3xl font-mono font-bold text-slate-200">{time}</div>
          <div className="inline-flex items-center space-x-2 bg-emerald-500/20 text-emerald-300 px-3 py-1 rounded-full text-xs font-bold border border-emerald-500/30 mt-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            <span>OPD LIVE LOBBY DISPLAY</span>
          </div>
        </div>
      </header>

      {/* Main Display Counter */}
      <main className="my-auto flex flex-col items-center justify-center text-center space-y-8">
        <div className="text-emerald-400 font-bold uppercase tracking-widest text-xl bg-emerald-950/60 border border-emerald-800/80 px-6 py-2 rounded-full">
          कृपया ध्यान दें / Now Serving Token Number
        </div>

        <div className="relative">
          <div className="absolute -inset-4 bg-emerald-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="relative bg-slate-900/90 border-2 border-emerald-500/40 rounded-3xl p-12 min-w-[360px] md:min-w-[480px] shadow-2xl">
            <div className="text-9xl font-black font-mono text-emerald-400 tracking-tighter drop-shadow-lg">
              #{currentToken}
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-slate-400 text-lg">मरीज का नाम (Patient Name):</p>
          <h2 className="text-4xl font-extrabold text-white tracking-tight">{currentPatientName}</h2>
        </div>
      </main>

      {/* Footer Info Banner */}
      <footer className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 flex flex-wrap justify-between items-center text-slate-400 text-sm">
        <div className="flex items-center space-x-3">
          <MapPin className="w-5 h-5 text-emerald-400" />
          <span>देवरिया सदर क्लिनिक परिसर | आपातकालीन हेल्पलाइन: 108</span>
        </div>
        <div className="flex items-center space-x-4 font-semibold">
          <span>कुल जारी टोकन: #{totalIssued}</span>
          <span>|</span>
          <span className="text-emerald-400">DocNest Live Queue System</span>
        </div>
      </footer>
    </div>
  );
}
