'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';
import { Tv, Volume2, Clock, VolumeX } from 'lucide-react';

export default function DoctorTvPage() {
  const [currentToken, setCurrentToken] = useState(1);
  const [clinicName] = useState('Gupta Clinic & Joint Care Center');
  const [doctorName] = useState('Dr. Amit Kumar (MS Ortho)');
  const [currentTime, setCurrentTime] = useState('');
  const [voiceEnabled, setVoiceEnabled] = useState(true);

  // Live Digital Clock
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);
    setCurrentTime(new Date().toLocaleTimeString());
    return () => clearInterval(timer);
  }, []);

  // Realtime Supabase Sync & Voice Announcement
  useEffect(() => {
    const speakTokenCallout = (tokenNum: number) => {
      if (!voiceEnabled || typeof window === 'undefined' || !('speechSynthesis' in window)) return;
      try {
        window.speechSynthesis.cancel();
        const text = `Token number ${tokenNum}. टोकन नंबर ${tokenNum}, डॉक्टर कक्ष में पधारें।`;
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 0.9;
        utterance.pitch = 1.0;
        window.speechSynthesis.speak(utterance);
      } catch (e) {
        console.log('TV voice callout error:', e);
      }
    };

    const channel = supabase.channel('opd-live-queue')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'clinic_queues' }, (payload: any) => {
        if (payload.new?.current_token !== undefined) {
          setCurrentToken(payload.new.current_token);
          speakTokenCallout(payload.new.current_token);
        }
      })
      .on('broadcast', { event: 'token-update' }, (payload: any) => {
        if (payload.payload?.currentToken) {
          setCurrentToken(payload.payload.currentToken);
          speakTokenCallout(payload.payload.currentToken);
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [voiceEnabled]);

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col justify-between p-6 md:p-10 font-['Plus_Jakarta_Sans',sans-serif] relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />

      {/* TV Header */}
      <header className="flex flex-wrap justify-between items-center border-b border-slate-800 pb-6 relative z-10 gap-4">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-700 text-white rounded-2xl flex items-center justify-center text-3xl shadow-lg shadow-emerald-950">
            🏥
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight">{clinicName}</h1>
            <p className="text-emerald-400 font-semibold text-lg">{doctorName} — OPD Waiting Room Display</p>
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
          <div className="bg-emerald-500/10 border border-emerald-500/30 px-4 py-2.5 rounded-full text-emerald-300 font-bold text-sm flex items-center space-x-2">
            <span className="w-3 h-3 rounded-full bg-emerald-400 animate-ping" />
            <span>REALTIME LIVE</span>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="my-auto py-8 relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
        {/* Main Big Token Display */}
        <div className="lg:col-span-2 flex flex-col items-center justify-center text-center space-y-6">
          <p className="text-xl md:text-2xl font-extrabold uppercase tracking-widest text-slate-400">
            Now Serving Token / वर्तमान टोकन नंबर
          </p>
          <div className="bg-gradient-to-b from-emerald-950 via-slate-900 to-slate-950 border-4 border-emerald-500/40 rounded-3xl p-12 md:p-16 shadow-2xl min-w-[320px] md:min-w-[480px] text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl" />
            <span className="text-8xl md:text-[140px] font-black text-emerald-400 font-mono tracking-tight drop-shadow-2xl leading-none">
              #{currentToken}
            </span>
          </div>
          <p className="text-lg text-emerald-200/90 font-medium bg-slate-900/60 border border-slate-800 px-6 py-2 rounded-full">
            कृपया अपने टोकन नंबर का इंतजार करें • Please wait for your token to be called
          </p>
        </div>

        {/* Next Tokens Queue Preview Box */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
            <span>Next In Line (अगले नंबर)</span>
            <span className="text-emerald-400 text-xs">Waiting</span>
          </h3>

          <div className="space-y-2">
            {[1, 2, 3].map((offset) => {
              const nextToken = currentToken + offset;
              return (
                <div key={offset} className="bg-slate-950 border border-slate-800/80 rounded-2xl p-4 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="w-8 h-8 rounded-full bg-slate-800 text-slate-300 font-bold text-xs flex items-center justify-center">
                      {offset}
                    </span>
                    <span className="font-mono font-extrabold text-2xl text-white">#{nextToken}</span>
                  </div>
                  <span className="text-xs text-slate-400 font-medium">Estimated ~{offset * 5} min</span>
                </div>
              );
            })}
          </div>
        </div>
      </main>

      {/* Footer Ticker */}
      <footer className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex items-center space-x-4 overflow-hidden relative z-10">
        <div className="bg-emerald-500 text-slate-950 font-black text-xs px-3 py-1.5 rounded-lg flex items-center space-x-1.5 flex-shrink-0">
          <Volume2 className="w-4 h-4" />
          <span>ANNOUNCEMENT</span>
        </div>
        <div className="overflow-hidden whitespace-nowrap text-sm text-slate-300 font-semibold tracking-wide">
          <span>कृपया शांति बनाए रखें • आपातकालीन मरीज सीधे संपर्क करें • QR कोड से मोबाइल पर टोकन देखें • DocNest Healthcare Platform</span>
        </div>
      </footer>
    </div>
  );
}
