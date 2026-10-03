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
  Radio
} from 'lucide-react';
import { LanguageTogglePill } from '../../components/LanguageContext';
import { ThemeTogglePill } from '../../components/ThemeContext';

export default function PatientHomePage() {
  const router = useRouter();
  const [user, setUser] = useState<DocNestUser | null>(null);

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
  }, []);

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-mesh-dark text-slate-100 flex flex-col font-['Plus_Jakarta_Sans',sans-serif] pb-24 md:pb-12">
      {/* Top Header with ColorHunt Accents */}
      <header className="sticky top-0 z-40 bg-[#0c1219]/80 backdrop-blur-2xl border-b border-[rgba(196,225,230,0.12)] px-4 md:px-8 py-3.5 flex items-center justify-between shadow-xl">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-[#8dbcc7] to-[#5a939f] rounded-2xl flex items-center justify-center text-[#0c1219] text-xl font-black shadow-lg shadow-[#8dbcc7]/20 border border-[rgba(235,255,216,0.3)]">
            🏥
          </div>
          <div>
            <span className="text-base font-black text-white tracking-tight flex items-center space-x-1.5">
              <span>DocNest</span>
              <span className="text-[10px] bg-[#8dbcc7]/15 text-[#c4e1e6] border border-[#8dbcc7]/30 px-2 py-0.5 rounded-full font-bold">
                Patient Portal
              </span>
            </span>
            <p className="text-[11px] text-[#a4ccd9]/70">Deoria District Healthcare Network</p>
          </div>
        </div>

        <div className="flex items-center space-x-2.5">
          <ThemeTogglePill />
          <LanguageTogglePill />
          <button
            onClick={handleLogout}
            className="p-2 text-slate-400 hover:text-rose-400 bg-[#141e28] hover:bg-[#1c2a38] rounded-xl transition border border-[rgba(196,225,230,0.1)] active:scale-95"
            title="Logout"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Body */}
      <main className="flex-1 max-w-4xl mx-auto w-full p-4 md:p-8 space-y-6">
        {/* Welcome Hero Banner: Deep Surface with #8DBCC7 & #EBFFD8 Gradients */}
        <section className="glass-panel-elevated rounded-3xl p-6 md:p-8 relative overflow-hidden space-y-4">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#8dbcc7]/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#ebffd8]/08 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 space-y-4">
            <div className="inline-flex items-center space-x-2 bg-[#8dbcc7]/15 text-[#ebffd8] border border-[#8dbcc7]/30 px-3.5 py-1.5 rounded-full text-xs font-bold shadow-inner">
              <span className="w-2 h-2 rounded-full bg-[#8dbcc7] animate-ping" />
              <span>Verified Patient Account • Deoria Sadar</span>
            </div>

            <div>
              <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">
                नमस्ते {user?.name || 'Rahul Sharma'}! 🙏
              </h1>
              <p className="text-sm text-[#c4e1e6] mt-1 max-w-xl leading-relaxed">
                Book verified specialists across Deoria Sadar, Salempur & Bhatpar Rani. Track your OPD token live & access lifelong digital prescriptions.
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

        {/* Quick Stats Row: Lighter Surface Elevation */}
        <section className="grid grid-cols-3 gap-3 md:gap-4">
          <div className="glass-panel rounded-2xl p-4 text-center">
            <span className="text-[10px] font-black text-[#a4ccd9] uppercase tracking-widest block">Upcoming</span>
            <span className="text-2xl md:text-3xl font-black tabular-numbers text-[#ebffd8] my-1 block">1</span>
            <span className="text-[10px] text-slate-400 font-medium">Token #14 (Today)</span>
          </div>
          <div className="glass-panel rounded-2xl p-4 text-center">
            <span className="text-[10px] font-black text-[#a4ccd9] uppercase tracking-widest block">Total Visits</span>
            <span className="text-2xl md:text-3xl font-black tabular-numbers text-[#8dbcc7] my-1 block">4</span>
            <span className="text-[10px] text-slate-400 font-medium">Past Checkups</span>
          </div>
          <div className="glass-panel rounded-2xl p-4 text-center">
            <span className="text-[10px] font-black text-[#a4ccd9] uppercase tracking-widest block">Digital Rx</span>
            <span className="text-2xl md:text-3xl font-black tabular-numbers text-[#c4e1e6] my-1 block">3</span>
            <span className="text-[10px] text-slate-400 font-medium">Prescriptions</span>
          </div>
        </section>

        {/* Active Live Token Card with ColorHunt Accent Palette */}
        <section className="glass-panel rounded-3xl p-6 md:p-7 space-y-4 relative overflow-hidden">
          <div className="flex items-center justify-between border-b border-[rgba(196,225,230,0.12)] pb-3.5">
            <div className="flex items-center space-x-2.5">
              <Calendar className="w-5 h-5 text-[#8dbcc7]" />
              <h2 className="text-base font-black text-white">Next Upcoming Consultation (आगामी परामर्श)</h2>
            </div>
            <span className="bg-[#8dbcc7]/15 text-[#ebffd8] border border-[#8dbcc7]/35 px-3 py-1 rounded-full text-xs font-bold flex items-center space-x-1.5 shadow-sm">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#8dbcc7]" />
              <span>Confirmed & Paid ✓</span>
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-center">
            <div className="md:col-span-2 space-y-2.5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-lg font-black text-white">Dr. Amit Kumar</span>
                <span className="text-xs text-[#8dbcc7] font-bold bg-[#141e28] px-2.5 py-0.5 rounded-lg border border-[#8dbcc7]/30">
                  Orthopedic Surgeon
                </span>
              </div>
              <p className="text-xs text-slate-300 flex items-center space-x-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#a4ccd9] flex-shrink-0" />
                <span>Gupta Clinic & Joint Care Center — Near Railway Overbridge, Deoria Sadar</span>
              </p>
              <div className="flex flex-wrap gap-4 text-xs font-medium text-slate-400 pt-1">
                <span>📅 Date: <strong className="text-white">Today, Morning Shift</strong></span>
                <span>💳 Paid: <strong className="text-[#ebffd8] tabular-numbers">₹375 (Online UPI)</strong></span>
              </div>
            </div>

            {/* Live Token Number with Glowing #8DBCC7 Ripple */}
            <div className="bg-[#0c1219] border border-[rgba(196,225,230,0.15)] rounded-2xl p-4 text-center relative shadow-inner">
              <span className="text-[10px] font-black text-[#a4ccd9] uppercase tracking-widest block">Your OPD Token</span>
              <div className="inline-block relative my-1">
                <span className="text-4xl md:text-5xl font-black tabular-numbers text-[#ebffd8] block drop-shadow-[0_0_14px_rgba(141,188,199,0.45)]">
                  #14
                </span>
              </div>
              <div className="flex items-center justify-center space-x-1.5 text-[11px] text-[#8dbcc7] font-semibold">
                <span className="w-2 h-2 rounded-full bg-[#8dbcc7] opd-live-badge" />
                <span>Live in Queue (~11:30 AM)</span>
              </div>
            </div>
          </div>

          <div className="pt-2 flex justify-end space-x-3 border-t border-[rgba(196,225,230,0.12)]">
            <Link
              href="/patient/appointments"
              className="text-xs text-[#c4e1e6] hover:text-white font-bold px-4 py-2.5 rounded-xl glass-panel transition active:scale-95"
            >
              View Full Details →
            </Link>
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
