'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  Mic, MicOff, Video, VideoOff, PhoneOff, MessageSquare, FileText,
  ShieldCheck, RefreshCw, Volume2, User, Stethoscope, Clock, CheckCircle2,
  Send, Sparkles, AlertCircle
} from 'lucide-react';
import Link from 'next/link';

function VideoConsultationRoom() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const room = searchParams.get('room') || 'opd-consult-001';
  const patientName = searchParams.get('patient') || 'Rahul Sharma';
  const doctorName = searchParams.get('doctor') || 'Dr. Amit Kumar (MS Ortho)';
  const tokenNumber = searchParams.get('token') || '14';
  const userRole = searchParams.get('role') || 'patient'; // 'doctor' | 'patient'

  const [micEnabled, setMicEnabled] = useState(true);
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');
  const [callDuration, setCallDuration] = useState(0);
  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState<Array<{ sender: string; text: string; time: string }>>([
    { sender: doctorName, text: 'नमस्ते! कृपया बताएं, आपको कब से दर्द महसूस हो रहा है? (Hello! Since when have you been having pain?)', time: 'Just now' },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [cameraError, setCameraError] = useState<string | null>(null);

  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);

  // Call duration counter
  useEffect(() => {
    const timer = setInterval(() => {
      setCallDuration((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatDuration = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Setup user camera stream
  useEffect(() => {
    async function startCamera() {
      try {
        if (typeof navigator !== 'undefined' && navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          const stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode },
            audio: true
          });
          mediaStreamRef.current = stream;
          if (localVideoRef.current) {
            localVideoRef.current.srcObject = stream;
          }
          setCameraError(null);
        }
      } catch (err: any) {
        console.warn('Camera access fallback (permission or emulator):', err.message);
        setCameraError('Camera stream simulated (hardware access permission denied or in emulator).');
      }
    }
    startCamera();

    return () => {
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, [facingMode]);

  const toggleMic = () => {
    if (mediaStreamRef.current) {
      const audioTrack = mediaStreamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
      }
    }
    setMicEnabled(!micEnabled);
  };

  const toggleVideo = () => {
    if (mediaStreamRef.current) {
      const videoTrack = mediaStreamRef.current.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
      }
    }
    setVideoEnabled(!videoEnabled);
  };

  const flipCamera = () => {
    setFacingMode(prev => prev === 'user' ? 'environment' : 'user');
  };

  const handleEndCall = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
    }
    if (userRole === 'doctor') {
      router.push(`/doctor/prescription?patient=${encodeURIComponent(patientName)}&token=${tokenNumber}`);
    } else {
      router.push('/patient/appointments');
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;
    const newMsg = {
      sender: userRole === 'doctor' ? doctorName : patientName,
      text: inputMessage.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages(prev => [...prev, newMsg]);
    setInputMessage('');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col font-['Plus_Jakarta_Sans',sans-serif] relative overflow-hidden select-none">
      {/* Top Header Bar */}
      <header className="bg-slate-900/90 border-b border-slate-800 px-6 py-3.5 flex flex-wrap justify-between items-center z-20 gap-3">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-emerald-500/20 border border-emerald-500/40 rounded-xl flex items-center justify-center text-emerald-400 font-bold">
            <Stethoscope className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-sm md:text-base font-black text-white flex items-center space-x-2">
              <span>DocNest Tele-Consultation Room</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            </h1>
            <p className="text-xs text-slate-400">
              {userRole === 'doctor' ? `Patient: ${patientName} (Token #${tokenNumber})` : `Consulting: ${doctorName}`}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <div className="bg-slate-950 border border-slate-800 px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold flex items-center space-x-2 text-emerald-400">
            <Clock className="w-4 h-4" />
            <span>{formatDuration(callDuration)}</span>
          </div>

          <div className="hidden sm:inline-flex items-center space-x-1.5 bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 px-3 py-1 rounded-full text-[11px] font-bold">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>End-to-End Encrypted (DISHA Compliant)</span>
          </div>
        </div>
      </header>

      {/* Main Video Canvas Area */}
      <main className="flex-1 p-4 md:p-6 flex flex-col lg:flex-row gap-4 relative z-10 overflow-hidden">
        {/* Remote Video Tile (Main Participant) */}
        <div className="flex-1 bg-slate-900 border border-slate-800 rounded-3xl relative overflow-hidden flex items-center justify-center shadow-2xl">
          {/* Ambient Glow */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80 pointer-events-none" />

          {/* Remote Avatar Simulation / Active Stream */}
          <div className="flex flex-col items-center justify-center space-y-4 text-center p-6 z-10">
            <div className="w-32 h-32 md:w-44 md:h-44 rounded-full bg-gradient-to-br from-emerald-600 via-teal-700 to-slate-800 border-4 border-emerald-400/40 flex items-center justify-center text-5xl md:text-6xl shadow-2xl animate-pulse">
              {userRole === 'doctor' ? '👤' : '🩺'}
            </div>
            <div>
              <h2 className="text-2xl md:text-3xl font-extrabold text-white">
                {userRole === 'doctor' ? patientName : doctorName}
              </h2>
              <p className="text-xs md:text-sm text-emerald-400 font-semibold mt-1">
                {userRole === 'doctor' ? `OPD Token #${tokenNumber} • Waiting in Cabin` : 'Senior Orthopedic Consultant • Gupta Clinic'}
              </p>
            </div>
            <div className="inline-flex items-center space-x-2 bg-slate-950/80 border border-slate-800 px-4 py-1.5 rounded-full text-xs font-mono text-slate-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>HD 1080p • 60 FPS • Audio Live</span>
            </div>
          </div>

          {/* Picture-in-Picture Local User Video Stream */}
          <div className="absolute top-4 right-4 w-36 h-48 md:w-48 md:h-64 bg-slate-950 border-2 border-emerald-500/50 rounded-2xl overflow-hidden shadow-2xl z-20">
            <video
              ref={localVideoRef}
              autoPlay
              playsInline
              muted
              className={`w-full h-full object-cover ${!videoEnabled ? 'hidden' : ''}`}
            />
            {!videoEnabled && (
              <div className="w-full h-full flex flex-col items-center justify-center bg-slate-900 text-slate-500 space-y-2">
                <VideoOff className="w-8 h-8 text-rose-400" />
                <span className="text-[10px] font-bold">Camera Off</span>
              </div>
            )}
            <div className="absolute bottom-2 left-2 bg-slate-900/80 px-2 py-0.5 rounded text-[10px] font-bold text-white border border-slate-700">
              You ({userRole === 'doctor' ? 'Doctor' : 'Patient'})
            </div>
          </div>

          {cameraError && (
            <div className="absolute bottom-4 left-4 bg-slate-950/80 border border-amber-500/40 text-amber-300 text-[11px] px-3 py-1.5 rounded-xl z-20 flex items-center space-x-1.5">
              <AlertCircle className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
              <span>{cameraError}</span>
            </div>
          )}
        </div>

        {/* In-Call Chat Drawer (Toggleable) */}
        {chatOpen && (
          <div className="w-full lg:w-80 bg-slate-900 border border-slate-800 rounded-3xl p-4 flex flex-col justify-between shadow-2xl z-20">
            <div className="border-b border-slate-800 pb-2 flex justify-between items-center">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center space-x-1.5">
                <MessageSquare className="w-4 h-4 text-emerald-400" />
                <span>In-Call Clinical Chat</span>
              </h3>
              <button onClick={() => setChatOpen(false)} className="text-xs text-slate-400 hover:text-white">✕</button>
            </div>

            <div className="flex-1 py-3 space-y-2 overflow-y-auto max-h-[300px]">
              {messages.map((m, idx) => (
                <div key={idx} className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 text-xs space-y-0.5">
                  <div className="flex justify-between text-[10px] text-slate-400 font-bold">
                    <span>{m.sender}</span>
                    <span>{m.time}</span>
                  </div>
                  <p className="text-slate-200">{m.text}</p>
                </div>
              ))}
            </div>

            <form onSubmit={handleSendMessage} className="pt-2 flex items-center space-x-1.5">
              <input
                type="text"
                placeholder="Send medical message..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
              />
              <button type="submit" className="bg-emerald-600 hover:bg-emerald-500 text-white p-2 rounded-xl">
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        )}
      </main>

      {/* Bottom Floating Control Bar */}
      <footer className="p-4 md:pb-6 flex justify-center items-center z-20">
        <div className="bg-slate-900/90 backdrop-blur-2xl border border-slate-800 rounded-3xl px-6 py-3.5 flex flex-wrap items-center justify-center gap-4 shadow-2xl">
          {/* Mute/Unmute */}
          <button
            onClick={toggleMic}
            className={`p-3.5 rounded-2xl transition ${
              micEnabled
                ? 'bg-slate-800 text-white hover:bg-slate-700'
                : 'bg-rose-600 text-white hover:bg-rose-500'
            }`}
            title={micEnabled ? 'Mute Microphone' : 'Unmute Microphone'}
          >
            {micEnabled ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
          </button>

          {/* Camera Toggle */}
          <button
            onClick={toggleVideo}
            className={`p-3.5 rounded-2xl transition ${
              videoEnabled
                ? 'bg-slate-800 text-white hover:bg-slate-700'
                : 'bg-rose-600 text-white hover:bg-rose-500'
            }`}
            title={videoEnabled ? 'Turn Off Camera' : 'Turn On Camera'}
          >
            {videoEnabled ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
          </button>

          {/* Flip Camera (Mobile) */}
          <button
            onClick={flipCamera}
            className="p-3.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-2xl transition"
            title="Switch Front/Rear Camera"
          >
            <RefreshCw className="w-5 h-5" />
          </button>

          {/* In-Call Chat */}
          <button
            onClick={() => setChatOpen(!chatOpen)}
            className={`p-3.5 rounded-2xl transition ${
              chatOpen ? 'bg-emerald-600 text-white' : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
            }`}
            title="Toggle In-Call Chat"
          >
            <MessageSquare className="w-5 h-5" />
          </button>

          {/* Doctor Only: Instant Digital Rx */}
          {userRole === 'doctor' && (
            <Link
              href={`/doctor/prescription?patient=${encodeURIComponent(patientName)}&token=${tokenNumber}`}
              target="_blank"
              className="bg-teal-600 hover:bg-teal-500 text-white font-extrabold px-4 py-3 rounded-2xl text-xs flex items-center space-x-1.5 shadow transition"
              title="Open Digital Prescription Builder in new window"
            >
              <FileText className="w-4 h-4" />
              <span>Write Digital Rx</span>
            </Link>
          )}

          {/* End Call Button */}
          <button
            onClick={handleEndCall}
            className="bg-rose-600 hover:bg-rose-500 text-white font-extrabold px-6 py-3.5 rounded-2xl text-xs flex items-center space-x-2 shadow-lg shadow-rose-950 transition active:scale-95"
            title="End Consultation"
          >
            <PhoneOff className="w-4 h-4 fill-white" />
            <span>End Consultation</span>
          </button>
        </div>
      </footer>
    </div>
  );
}

export default function VideoConsultationPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-950 text-white flex items-center justify-center text-sm font-bold">Connecting to DocNest Telehealth Room...</div>}>
      <VideoConsultationRoom />
    </Suspense>
  );
}
