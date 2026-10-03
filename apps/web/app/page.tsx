'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Stethoscope,
  Calendar,
  Clock,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Tv,
  MessageSquare,
  Users,
  ChevronRight,
  MapPin,
  Heart,
  Phone,
  FileText,
  Activity,
  Play,
  Zap,
  Globe,
  LogIn
} from 'lucide-react';
import { LanguageTogglePill, useLanguage } from '../components/LanguageContext';
import DocNestLogo from '../components/DocNestLogo';
import InteractiveParticles from '../components/InteractiveParticles';
import NavControls from '../components/NavControls';
import { getSession, logout, DocNestUser } from '../lib/auth';

export default function LandingPage() {
  const { lang } = useLanguage();
  const [activeTab, setActiveTab] = useState<'patient' | 'doctor'>('patient');
  const [loggedInUser, setLoggedInUser] = useState<DocNestUser | null>(null);

  React.useEffect(() => {
    setLoggedInUser(getSession());
  }, []);

  const handleLogout = async () => {
    await logout();
    setLoggedInUser(null);
  };

  // Interactive Live Demo Token State for Landing Page
  const [demoToken, setDemoToken] = useState(14);
  const [demoQueueStatus, setDemoQueueStatus] = useState<'Active' | 'Paused'>('Active');

  const specialties = [
    { name: 'Orthopedic Surgeon', nameHi: 'हड्डी एवं जोड़ रोग विशेषज्ञ', icon: '🦴', doctors: 4, fee: '₹300' },
    { name: 'General Physician', nameHi: 'सामान्य चिकित्सक', icon: '🩺', doctors: 6, fee: '₹250' },
    { name: 'Gynecologist', nameHi: 'स्त्री एवं प्रसूति रोग विशेषज्ञ', icon: '👶', doctors: 3, fee: '₹350' },
    { name: 'Pediatrician', nameHi: 'बाल रोग विशेषज्ञ', icon: '🍼', doctors: 3, fee: '₹300' },
    { name: 'Cardiologist', nameHi: 'हृदय रोग विशेषज्ञ', icon: '❤️', doctors: 2, fee: '₹500' },
    { name: 'Dermatologist', nameHi: 'त्वचा एवं सौंदर्य विशेषज्ञ', icon: '✨', doctors: 2, fee: '₹300' },
  ];

  const features = [
    {
      icon: Tv,
      title: 'Real-Time OPD Queue',
      titleHi: 'लाइव टोकन काउंटर',
      desc: 'Patients monitor their live appointment token on their phones or clinic TV screens. Zero waiting room crowding.',
      badge: 'Live Sync',
    },
    {
      icon: MessageSquare,
      title: '1-Click WhatsApp Prescriptions',
      titleHi: 'व्हाट्सएप डिजिटल पर्चा',
      desc: 'Doctors generate verified digital Rx and send complete dosages, diet instructions, and follow-up dates directly to WhatsApp.',
      badge: 'Instant Rx',
    },
    {
      icon: Zap,
      title: 'Emergency Delay Broadcasting',
      titleHi: 'इमरजेंसी विलंब अलर्ट',
      desc: 'When critical surgeries or emergency ICU cases arise, clinics broadcast estimated delay notices directly to patient devices.',
      badge: 'Realtime Alert',
    },
    {
      icon: ShieldCheck,
      title: 'District Healthcare Security',
      titleHi: 'सुरक्षित स्वास्थ्य रिकॉर्ड',
      desc: 'Role-based access separating Doctors, Compounders, and Patients with 256-bit encryption and complete privacy.',
      badge: 'ABHA Ready',
    },
  ];

  const faqs = [
    {
      q: 'How do patients book an appointment without internet at home?',
      a: 'Village Field Agents equipped with DocNest mobile terminals visit local panchayats to book tokens, collect digital vitals, and issue printed slips.',
    },
    {
      q: 'Can a clinic use DocNest for both online and walk-in patients?',
      a: 'Yes! The doctor and compounder dashboard merges walk-in offline slips with pre-booked digital appointments into a single numbered token sequence.',
    },
    {
      q: 'Does DocNest support bilingual usage (Hindi and English)?',
      a: 'Yes, full bilingual toggling is built into every screen, patient prescription, and SMS notification for seamless adoption across rural and semi-urban districts.',
    },
  ];

  return (
    <div className="min-h-screen bg-[#0c1219] bg-mesh-dark text-slate-100 flex flex-col font-['Plus_Jakarta_Sans',sans-serif] selection:bg-[#8dbcc7] selection:text-[#0c1219] relative overflow-hidden">
      {/* Interactive Particle Stardust Mesh */}
      <InteractiveParticles />
      
      {/* 1. STICKY GLASS NAVBAR */}
      <header className="sticky top-0 z-50 bg-[#0c1219]/80 backdrop-blur-2xl border-b border-[rgba(196,225,230,0.14)] px-4 md:px-8 py-4 shadow-xl">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <DocNestLogo size="md" subtitle="Pan-India Clinical Cloud & OPD" />
          </Link>

          {/* Center Links (Chronologically Ordered by Page Layout from Left to Right) */}
          <nav className="hidden lg:flex items-center space-x-1 p-1 bg-[#141e28]/70 border border-[rgba(196,225,230,0.12)] rounded-2xl text-xs font-bold text-slate-300">
            <a
              href="#live-demo"
              className="px-3.5 py-1.5 rounded-xl hover:text-white hover:bg-white/5 text-slate-300 transition"
            >
              Live OPD Demo
            </a>
            <a
              href="#specialties"
              className="px-3.5 py-1.5 rounded-xl hover:text-white hover:bg-white/5 text-slate-300 transition"
            >
              Specialties
            </a>
            <a
              href="#features"
              className="px-3.5 py-1.5 rounded-xl hover:text-white hover:bg-white/5 text-slate-300 transition"
            >
              Features
            </a>
            <a
              href="#how-it-works"
              className="px-3.5 py-1.5 rounded-xl hover:text-white hover:bg-white/5 text-slate-300 transition"
            >
              How It Works
            </a>
            <a
              href="#faqs"
              className="px-3.5 py-1.5 rounded-xl hover:text-white hover:bg-white/5 text-slate-300 transition"
            >
              FAQs
            </a>
          </nav>

          {/* Action Buttons, NavControls & Language Switcher */}
          <div className="flex items-center space-x-2.5">
            <NavControls showHome={false} showLogout={false} />
            <LanguageTogglePill />

            {loggedInUser ? (
              <div className="flex items-center space-x-2">
                <Link
                  href={
                    loggedInUser.role === 'doctor'
                      ? '/doctor/dashboard'
                      : loggedInUser.role === 'patient'
                      ? '/patient'
                      : loggedInUser.role === 'compounder'
                      ? '/compounder/dashboard'
                      : `/${loggedInUser.role}/dashboard`
                  }
                  className="btn-primary-tactile text-[#0c1219] font-black text-xs px-4 py-2 rounded-xl shadow-lg flex items-center space-x-1.5 transition active:scale-95 cursor-pointer"
                >
                  <span>My Portal ({loggedInUser.name.split(' ')[0]})</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#0c1219]" />
                </Link>
                <NavControls showHome={false} showLogout={true} />
              </div>
            ) : (
              <Link
                href="/login"
                className="btn-primary-tactile text-[#0c1219] font-black text-xs px-5 py-2.5 rounded-xl shadow-lg flex items-center space-x-2 transition active:scale-95 cursor-pointer"
              >
                <LogIn className="w-3.5 h-3.5 text-[#0c1219]" />
                <span>Sign In</span>
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* 2. IMPACTFUL HERO SECTION */}
      <section className="relative pt-12 md:pt-20 pb-16 md:pb-24 px-4 md:px-8 overflow-hidden">
        {/* Ambient Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-gradient-to-br from-[#8dbcc7]/15 to-[#ebffd8]/08 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center space-y-6 relative z-10">
          {/* Trust Metric Pill */}
          <div className="inline-flex items-center space-x-2 bg-[#141e28] border border-[rgba(196,225,230,0.22)] px-4 py-1.5 rounded-full text-xs font-bold text-[#ebffd8] shadow-md animate-in fade-in zoom-in-95">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Serving Clinics, Hospitals & Outpatient Centers Across India</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-white tracking-tight leading-[1.15]">
            Next-Generation <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#8dbcc7] via-[#a4ccd9] to-[#ebffd8]">Live OPD Queue</span> & Clinical Care Platform
          </h1>

          {/* Subtitle */}
          <p className="text-sm md:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Eliminate waiting room chaos. DocNest synchronizes live clinic tokens, one-click WhatsApp digital prescriptions, and instant emergency ICU broadcasts for doctors, pharmacies, and patients.
          </p>

          {/* Single Primary Sign In CTA */}
          <div className="flex items-center justify-center pt-4">
            <Link
              href="/login"
              className="w-full sm:w-auto btn-primary-tactile text-[#0c1219] font-black px-9 py-4 rounded-2xl text-base shadow-xl shadow-[#8dbcc7]/20 flex items-center justify-center space-x-3 transition active:scale-95 cursor-pointer hover:scale-[1.02]"
            >
              <LogIn className="w-5 h-5 text-[#0c1219]" />
              <span>Sign In to DocNest Portal</span>
              <ArrowRight className="w-5 h-5 text-[#0c1219]" />
            </Link>
          </div>

          {/* Live Trust Metrics Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 pt-12 max-w-4xl mx-auto text-left">
            <div className="bg-[#141e28]/80 border border-[rgba(196,225,230,0.14)] p-4 rounded-2xl">
              <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider block">Total Consultations</span>
              <p className="text-2xl md:text-3xl font-black font-mono text-[#ebffd8] mt-0.5">14,280+</p>
            </div>
            <div className="bg-[#141e28]/80 border border-[rgba(196,225,230,0.14)] p-4 rounded-2xl">
              <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider block">Average Consultation</span>
              <p className="text-2xl md:text-3xl font-black font-mono text-[#8dbcc7] mt-0.5">7.5 mins</p>
            </div>
            <div className="bg-[#141e28]/80 border border-[rgba(196,225,230,0.14)] p-4 rounded-2xl">
              <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider block">Active Clinics</span>
              <p className="text-2xl md:text-3xl font-black font-mono text-[#a4ccd9] mt-0.5">18+ Centers</p>
            </div>
            <div className="bg-[#141e28]/80 border border-[rgba(196,225,230,0.14)] p-4 rounded-2xl">
              <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider block">Patient Rating</span>
              <p className="text-2xl md:text-3xl font-black font-mono text-amber-300 mt-0.5">4.9 ★</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. INTERACTIVE LIVE OPD DEMO WIDGET */}
      <section id="live-demo" className="scroll-mt-24 py-12 px-4 md:px-8 border-y border-[rgba(196,225,230,0.1)] bg-[#0c1219]/60">
        <div className="max-w-5xl mx-auto space-y-8">
          <div className="text-center space-y-2">
            <span className="text-xs font-bold text-[#8dbcc7] uppercase tracking-wider">Try Interactive OPD Preview</span>
            <h2 className="text-2xl md:text-4xl font-black text-white tracking-tight">Experience Live Queue Management</h2>
            <p className="text-xs md:text-sm text-slate-400 max-w-xl mx-auto">
              Click below to simulate calling the next patient token or pausing the clinic queue in real time.
            </p>
          </div>

          {/* Interactive Demo Card */}
          <div className="bg-gradient-to-br from-teal-900/90 via-[#141e28] to-[#0c1219] border border-[rgba(196,225,230,0.25)] rounded-3xl p-6 md:p-8 shadow-2xl space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-[rgba(196,225,230,0.12)] pb-6">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-xs font-black text-[#ebffd8] uppercase tracking-wider">Gupta Clinic & Joint Care Center</span>
                </div>
                <h3 className="text-lg md:text-xl font-black text-white">Dr. Amit Kumar (Senior Orthopedic Surgeon)</h3>
                <p className="text-xs text-slate-400">Apollo Joint Care & Sports Medicine OPD</p>
              </div>

              {/* Token Display Box */}
              <div className="bg-white text-slate-900 rounded-2xl p-5 text-center min-w-[180px] shadow-2xl border-2 border-emerald-400/40">
                <span className="text-[10px] font-black uppercase text-emerald-800 tracking-wider block">Now Serving</span>
                <span className="text-5xl font-black font-mono text-emerald-700 my-0.5 block tabular-numbers">
                  #{demoToken}
                </span>
                <span className="text-[10px] font-bold text-slate-500">Status: {demoQueueStatus}</span>
              </div>
            </div>

            {/* Interactive Control Buttons */}
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => setDemoToken((prev) => prev + 1)}
                  className="bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-black px-5 py-3 rounded-xl text-xs flex items-center space-x-2 transition active:scale-95 shadow-md cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5 fill-slate-950" />
                  <span>Call Next Token (#{demoToken + 1})</span>
                </button>

                <button
                  type="button"
                  onClick={() => setDemoQueueStatus(demoQueueStatus === 'Active' ? 'Paused' : 'Active')}
                  className="bg-[#1c2a38] hover:bg-[#243546] text-white font-bold px-4 py-3 rounded-xl text-xs border border-[rgba(196,225,230,0.2)] transition active:scale-95 cursor-pointer"
                >
                  <span>{demoQueueStatus === 'Active' ? 'Pause OPD' : 'Resume OPD'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setDemoToken(1)}
                  className="text-xs text-slate-400 hover:text-white px-3 py-3 transition underline cursor-pointer"
                >
                  Reset Demo
                </button>
              </div>

              <div className="text-xs text-[#a4ccd9] flex items-center space-x-1.5 font-medium">
                <Tv className="w-4 h-4 text-[#8dbcc7]" />
                <span>Simulates live TV screen & mobile notification update</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. SPECIALTIES DIRECTORY CAROUSEL / GRID */}
      <section id="specialties" className="scroll-mt-24 py-16 md:py-24 px-4 md:px-8 max-w-7xl mx-auto w-full space-y-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div className="space-y-2">
            <span className="text-xs font-bold text-[#8dbcc7] uppercase tracking-wider">Top Medical Disciplines</span>
            <h2 className="text-2xl md:text-4xl font-black text-white tracking-tight">Consult Verified Doctors</h2>
            <p className="text-xs md:text-sm text-slate-400">Available for OPD walk-in and priority online slot booking across network clinics.</p>
          </div>

          <Link
            href="/patient/doctors"
            className="text-xs font-bold text-[#ebffd8] hover:text-white flex items-center space-x-1 transition"
          >
            <span>View All Doctors ({specialties.length})</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {specialties.map((item, idx) => (
            <Link
              key={idx}
              href="/patient/doctors"
              className="bg-[#141e28] hover:bg-[#1c2a38] border border-[rgba(196,225,230,0.14)] hover:border-[#8dbcc7]/60 p-5 rounded-2xl transition group flex items-center justify-between"
            >
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-2xl bg-[#0c1219] flex items-center justify-center text-2xl border border-[rgba(196,225,230,0.12)] group-hover:scale-110 transition">
                  {item.icon}
                </div>
                <div>
                  <h3 className="text-sm font-black text-white group-hover:text-[#ebffd8] transition">{item.name}</h3>
                  <p className="text-[11px] text-[#a4ccd9]/70">{item.nameHi}</p>
                  <p className="text-[10px] text-slate-400 mt-1">{item.doctors} Doctors • From {item.fee}</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-[#8dbcc7] transition" />
            </Link>
          ))}
        </div>
      </section>

      {/* 5. 4-PILLAR FEATURE GRID */}
      <section id="features" className="scroll-mt-24 py-16 md:py-24 px-4 md:px-8 bg-[#0c1219]/80 border-t border-[rgba(196,225,230,0.1)]">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center space-y-2">
            <span className="text-xs font-bold text-[#8dbcc7] uppercase tracking-wider">Engineered for District Healthcare</span>
            <h2 className="text-2xl md:text-4xl font-black text-white tracking-tight">Built to End Waiting Room Chaos</h2>
            <p className="text-xs md:text-sm text-slate-400 max-w-2xl mx-auto">
              Everything needed to run smooth outpatient departments without expensive infrastructure.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feat, idx) => (
              <div
                key={idx}
                className="bg-[#141e28] border border-[rgba(196,225,230,0.14)] p-6 rounded-3xl space-y-4 hover:border-[#8dbcc7]/50 transition group"
              >
                <div className="flex justify-between items-start">
                  <div className="w-12 h-12 rounded-2xl bg-teal-900/40 border border-teal-500/30 text-[#8dbcc7] flex items-center justify-center group-hover:bg-[#8dbcc7] group-hover:text-[#0c1219] transition">
                    <feat.icon className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-bold bg-[#0c1219] text-[#ebffd8] border border-[rgba(196,225,230,0.15)] px-2.5 py-1 rounded-full">
                    {feat.badge}
                  </span>
                </div>
                <div>
                  <h3 className="text-base font-black text-white">{feat.title}</h3>
                  <p className="text-[11px] text-[#a4ccd9]/70 font-semibold">{feat.titleHi}</p>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. HOW IT WORKS (PATIENTS & DOCTORS) */}
      <section id="how-it-works" className="scroll-mt-24 py-16 md:py-24 px-4 md:px-8 max-w-6xl mx-auto w-full space-y-10">
        <div className="text-center space-y-2">
          <span className="text-xs font-bold text-[#8dbcc7] uppercase tracking-wider">Simplified Workflow</span>
          <h2 className="text-2xl md:text-4xl font-black text-white tracking-tight">How DocNest Works</h2>
        </div>

        {/* Tab Switcher */}
        <div className="flex justify-center">
          <div className="bg-[#141e28] p-1.5 rounded-2xl border border-[rgba(196,225,230,0.14)] flex space-x-2">
            <button
              onClick={() => setActiveTab('patient')}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                activeTab === 'patient'
                  ? 'bg-gradient-to-r from-teal-600 to-emerald-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              For Patients (मरीजों के लिए)
            </button>
            <button
              onClick={() => setActiveTab('doctor')}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                activeTab === 'doctor'
                  ? 'bg-gradient-to-r from-teal-600 to-emerald-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              For Doctors & Clinics (डॉक्टरों के लिए)
            </button>
          </div>
        </div>

        {/* Stepped Cards */}
        {activeTab === 'patient' ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[#141e28] border border-[rgba(196,225,230,0.14)] p-6 rounded-3xl space-y-3">
              <span className="w-8 h-8 rounded-full bg-teal-900/60 text-[#ebffd8] font-mono font-black flex items-center justify-center text-sm border border-teal-500/30">1</span>
              <h3 className="text-base font-black text-white">Find Doctor & Select Slot</h3>
              <p className="text-xs text-slate-400 leading-relaxed">Search by specialist, clinic location, and choose a preferred morning or evening shift.</p>
            </div>
            <div className="bg-[#141e28] border border-[rgba(196,225,230,0.14)] p-6 rounded-3xl space-y-3">
              <span className="w-8 h-8 rounded-full bg-teal-900/60 text-[#ebffd8] font-mono font-black flex items-center justify-center text-sm border border-teal-500/30">2</span>
              <h3 className="text-base font-black text-white">Receive Live Digital Token</h3>
              <p className="text-xs text-slate-400 leading-relaxed">Get an instant token number sent via SMS and WhatsApp. Arrive just 15 minutes before your turn.</p>
            </div>
            <div className="bg-[#141e28] border border-[rgba(196,225,230,0.14)] p-6 rounded-3xl space-y-3">
              <span className="w-8 h-8 rounded-full bg-teal-900/60 text-[#ebffd8] font-mono font-black flex items-center justify-center text-sm border border-teal-500/30">3</span>
              <h3 className="text-base font-black text-white">Digital Rx on Phone</h3>
              <p className="text-xs text-slate-400 leading-relaxed">Doctor issues paperless digital prescription with automatic dosage alerts and pharmacy fulfillment.</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[#141e28] border border-[rgba(196,225,230,0.14)] p-6 rounded-3xl space-y-3">
              <span className="w-8 h-8 rounded-full bg-teal-900/60 text-[#ebffd8] font-mono font-black flex items-center justify-center text-sm border border-teal-500/30">1</span>
              <h3 className="text-base font-black text-white">1-Click Sign In</h3>
              <p className="text-xs text-slate-400 leading-relaxed">Access the OPD controller with multi-doctor clinic support and sound bell alerts.</p>
            </div>
            <div className="bg-[#141e28] border border-[rgba(196,225,230,0.14)] p-6 rounded-3xl space-y-3">
              <span className="w-8 h-8 rounded-full bg-teal-900/60 text-[#ebffd8] font-mono font-black flex items-center justify-center text-sm border border-teal-500/30">2</span>
              <h3 className="text-base font-black text-white">Seamless Call Next Token</h3>
              <p className="text-xs text-slate-400 leading-relaxed">Call patients sequentially. TV screen in the waiting hall chimes and updates simultaneously.</p>
            </div>
            <div className="bg-[#141e28] border border-[rgba(196,225,230,0.14)] p-6 rounded-3xl space-y-3">
              <span className="w-8 h-8 rounded-full bg-teal-900/60 text-[#ebffd8] font-mono font-black flex items-center justify-center text-sm border border-teal-500/30">3</span>
              <h3 className="text-base font-black text-white">Generate Rx & Dispense</h3>
              <p className="text-xs text-slate-400 leading-relaxed">Pre-filled disease drug templates allow rapid 30-second prescription issuance synced with compounder.</p>
            </div>
          </div>
        )}
      </section>

      {/* 7. FREQUENTLY ASKED QUESTIONS */}
      <section id="faqs" className="scroll-mt-24 py-16 md:py-24 px-4 md:px-8 bg-[#0c1219]/90 border-t border-[rgba(196,225,230,0.1)]">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center space-y-2">
            <span className="text-xs font-bold text-[#8dbcc7] uppercase tracking-wider">Have Questions?</span>
            <h2 className="text-2xl md:text-4xl font-black text-white tracking-tight">Frequently Asked Questions</h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div key={idx} className="bg-[#141e28] border border-[rgba(196,225,230,0.14)] p-6 rounded-2xl space-y-2">
                <h3 className="text-sm md:text-base font-bold text-white flex items-center space-x-2">
                  <span className="text-[#8dbcc7]">Q:</span>
                  <span>{faq.q}</span>
                </h3>
                <p className="text-xs md:text-sm text-slate-400 pl-6 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. FOOTER */}
      <footer className="mt-auto bg-[#070b10] border-t border-[rgba(196,225,230,0.12)] py-14 px-4 md:px-8 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="space-y-3.5">
            <DocNestLogo size="md" subtitle="Digital Outpatient Cloud" />
            <p className="text-[12px] leading-relaxed text-slate-400">
              Pan-India digital outpatient cloud connecting specialist doctors, multi-specialty clinics, and patients with real-time queue synchronization and verifiable e-Prescriptions.
            </p>
            <div className="flex items-center space-x-2 text-[11px] text-[#8dbcc7] font-semibold">
              <Globe className="w-3.5 h-3.5" />
              <span>National Health Stack & ABHA Compatible</span>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Quick Portals</h4>
            <ul className="space-y-2 text-[12px]">
              <li>
                <Link href="/login" className="hover:text-white transition flex items-center space-x-1.5">
                  <span className="text-[#8dbcc7]">›</span>
                  <span>DocNest Unified Sign In</span>
                </Link>
              </li>
              <li>
                <Link href="/patient" className="hover:text-white transition flex items-center space-x-1.5">
                  <span className="text-[#8dbcc7]">›</span>
                  <span>Patient Medical Records</span>
                </Link>
              </li>
              <li>
                <Link href="/doctor/dashboard" className="hover:text-white transition flex items-center space-x-1.5">
                  <span className="text-[#8dbcc7]">›</span>
                  <span>Doctor Live OPD Console</span>
                </Link>
              </li>
              <li>
                <Link href="/compounder/dashboard" className="hover:text-white transition flex items-center space-x-1.5">
                  <span className="text-[#8dbcc7]">›</span>
                  <span>Digital Pharmacy Dispenser</span>
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">National Helplines & Emergency</h4>
            <ul className="space-y-2 text-[12px]">
              <li className="flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                <span className="text-rose-400 font-bold">National Ambulance: 108</span>
              </li>
              <li className="text-slate-300">Emergency Response: 112</li>
              <li className="text-slate-300">Women & Child Helpline: 1090 / 1098</li>
              <li className="text-[#ebffd8] font-mono text-[11px]">Clinic Support: 1800-DOC-NEST</li>
            </ul>
          </div>

          <div className="space-y-3.5">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Security & Standards</h4>
            <p className="text-[12px] leading-relaxed text-slate-400">
              ISO 27001 Certified Infrastructure • 256-Bit SSL End-to-End Encryption • Redundant Automated Cloud Backups
            </p>
            <div>
              <Link
                href="/login"
                className="inline-flex items-center space-x-1.5 bg-[#141e28] hover:bg-[#1c2a38] text-[#ebffd8] border border-[rgba(196,225,230,0.22)] px-4 py-2.5 rounded-xl font-bold text-xs transition shadow-md"
              >
                <span>Portal Sign In</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#8dbcc7]" />
              </Link>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto pt-8 mt-10 border-t border-[rgba(196,225,230,0.1)] flex flex-col sm:flex-row justify-between items-center text-[11px] text-slate-500 gap-3">
          <span>© 2026 DocNest Healthcare Technologies India Ltd. All rights reserved.</span>
          <div className="flex items-center space-x-6">
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
            <span>Clinical Data Security</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
