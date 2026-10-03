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
  ChevronRight
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
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-['Plus_Jakarta_Sans',sans-serif] pb-24 md:pb-8">
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-xl border-b border-slate-800 px-4 md:px-8 py-3.5 flex items-center justify-between shadow-xl">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-700 rounded-xl flex items-center justify-center text-white text-xl font-black shadow-lg shadow-emerald-950">
            🏥
          </div>
          <div>
            <span className="text-base font-black text-white tracking-tight flex items-center space-x-1.5">
              <span>DocNest Patient</span>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full font-bold">
                Online Portal
              </span>
            </span>
            <p className="text-[11px] text-slate-400">Deoria District Healthcare Network</p>
          </div>
        </div>

        <div className="flex items-center space-x-2.5">
          <ThemeTogglePill />
          <LanguageTogglePill />
          <button
            onClick={handleLogout}
            className="p-2 text-slate-400 hover:text-rose-400 bg-slate-800 hover:bg-slate-700 rounded-xl transition"
            title="Logout"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Body */}
      <main className="flex-1 max-w-4xl mx-auto w-full p-4 md:p-8 space-y-6">
        {/* Welcome Banner */}
        <section className="bg-gradient-to-br from-emerald-950 via-slate-900 to-slate-900 border border-emerald-500/30 rounded-3xl p-6 md:p-8 relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 space-y-4">
            <div className="inline-flex items-center space-x-2 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-3.5 py-1 rounded-full text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>Verified Patient Account</span>
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">
                नमस्ते {user?.name || 'Rahul Sharma'}! 🙏
              </h1>
              <p className="text-sm text-slate-300 mt-1 max-w-xl">
                Book verified doctors across Deoria Sadar, Salempur & Bhatpar Rani. Track your OPD token live & view past medical prescriptions.
              </p>
            </div>

            <div className="pt-2 flex flex-wrap gap-3">
              <Link
                href="/patient/doctors"
                className="bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-extrabold px-6 py-3.5 rounded-2xl text-sm flex items-center space-x-2 shadow-xl shadow-emerald-950/50 transition"
              >
                <Stethoscope className="w-4 h-4" />
                <span>Book Doctor Appointment →</span>
              </Link>
              <Link
                href="/patient/appointments"
                className="bg-slate-800/80 hover:bg-slate-700 text-slate-200 font-bold px-5 py-3.5 rounded-2xl text-sm border border-slate-700 flex items-center space-x-2 transition"
              >
                <Calendar className="w-4 h-4 text-emerald-400" />
                <span>My Appointments</span>
              </Link>
            </div>
          </div>
        </section>

        {/* Quick Stats Row */}
        <section className="grid grid-cols-3 gap-3 md:gap-4">
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 text-center shadow-lg">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Upcoming</span>
            <span className="text-2xl md:text-3xl font-black font-mono text-emerald-400 my-1 block">1</span>
            <span className="text-[10px] text-slate-400 font-medium">Token #14 (Today)</span>
          </div>
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 text-center shadow-lg">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Total Visits</span>
            <span className="text-2xl md:text-3xl font-black font-mono text-blue-400 my-1 block">4</span>
            <span className="text-[10px] text-slate-400 font-medium">Past Checkups</span>
          </div>
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 text-center shadow-lg">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Digital Rx</span>
            <span className="text-2xl md:text-3xl font-black font-mono text-purple-400 my-1 block">3</span>
            <span className="text-[10px] text-slate-400 font-medium">Prescriptions</span>
          </div>
        </section>

        {/* Active / Upcoming Appointment Card */}
        <section className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-emerald-400" />
              <h2 className="text-base font-black text-white">Next Upcoming Appointment (आगामी परामर्श)</h2>
            </div>
            <span className="bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 px-3 py-1 rounded-full text-xs font-bold flex items-center space-x-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Confirmed ✓</span>
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
            <div className="md:col-span-2 space-y-2">
              <div className="flex items-center space-x-2">
                <span className="text-lg font-black text-white">Dr. Amit Kumar</span>
                <span className="text-xs text-emerald-400 font-bold bg-emerald-950/60 px-2.5 py-0.5 rounded-lg border border-emerald-800">
                  Orthopedic Surgeon
                </span>
              </div>
              <p className="text-xs text-slate-300 flex items-center space-x-1.5">
                <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                <span>Gupta Clinic & Joint Care Center — Near Railway Overbridge, Deoria Sadar</span>
              </p>
              <div className="flex flex-wrap gap-4 text-xs font-medium text-slate-400 pt-1">
                <span>📅 Date: <strong className="text-white">Today, 10:00 AM - 02:00 PM</strong></span>
                <span>💳 Paid: <strong className="text-emerald-400">₹375 (Online UPI)</strong></span>
              </div>
            </div>

            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 text-center">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Your OPD Token</span>
              <span className="text-4xl font-black font-mono text-emerald-400 my-1 block">#14</span>
              <span className="text-[11px] text-slate-400">Expected time ~11:30 AM</span>
            </div>
          </div>

          <div className="pt-2 flex justify-end space-x-3 border-t border-slate-800/80">
            <Link
              href="/patient/appointments"
              className="text-xs text-slate-400 hover:text-white font-bold px-4 py-2 rounded-xl bg-slate-800 transition"
            >
              View Full Details
            </Link>
          </div>
        </section>

        {/* Quick Actions Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link
            href="/patient/doctors"
            className="group bg-slate-900/70 hover:bg-slate-900 border border-slate-800 hover:border-emerald-500/40 rounded-3xl p-6 transition flex items-center justify-between shadow-lg"
          >
            <div className="space-y-1">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-2">
                <Stethoscope className="w-5 h-5" />
              </div>
              <h3 className="text-base font-black text-white group-hover:text-emerald-400 transition">Find & Book Doctors</h3>
              <p className="text-xs text-slate-400">Search verified doctors by specialty, fees & hospital timing</p>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-500 group-hover:text-emerald-400 transition" />
          </Link>

          <Link
            href="/patient/history"
            className="group bg-slate-900/70 hover:bg-slate-900 border border-slate-800 hover:border-blue-500/40 rounded-3xl p-6 transition flex items-center justify-between shadow-lg"
          >
            <div className="space-y-1">
              <div className="w-10 h-10 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 mb-2">
                <FileText className="w-5 h-5" />
              </div>
              <h3 className="text-base font-black text-white group-hover:text-blue-400 transition">Digital Medical History</h3>
              <p className="text-xs text-slate-400">View your past prescriptions, tests & doctor advice records</p>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-500 group-hover:text-blue-400 transition" />
          </Link>
        </section>
      </main>

      {/* Mobile Fixed Bottom Navigation Bar (5 icons) */}
      <nav className="fixed md:hidden bottom-0 left-0 right-0 z-50 bg-slate-900/95 backdrop-blur-xl border-t border-slate-800 px-3 py-2 flex items-center justify-around shadow-2xl">
        <Link href="/patient" className="flex flex-col items-center text-emerald-400 py-1">
          <Activity className="w-5 h-5" />
          <span className="text-[10px] font-bold mt-1">Home</span>
        </Link>
        <Link href="/patient/doctors" className="flex flex-col items-center text-slate-400 hover:text-white py-1">
          <Stethoscope className="w-5 h-5" />
          <span className="text-[10px] font-medium mt-1">Doctors</span>
        </Link>
        <Link href="/patient/appointments" className="flex flex-col items-center text-slate-400 hover:text-white py-1">
          <Calendar className="w-5 h-5" />
          <span className="text-[10px] font-medium mt-1">Bookings</span>
        </Link>
        <Link href="/patient/history" className="flex flex-col items-center text-slate-400 hover:text-white py-1">
          <FileText className="w-5 h-5" />
          <span className="text-[10px] font-medium mt-1">History</span>
        </Link>
        <Link href="/patient/settings" className="flex flex-col items-center text-slate-400 hover:text-white py-1">
          <Settings className="w-5 h-5" />
          <span className="text-[10px] font-medium mt-1">Settings</span>
        </Link>
      </nav>
    </div>
  );
}
