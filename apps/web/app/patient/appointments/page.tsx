'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ChevronLeft,
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  XCircle,
  FileText,
  AlertTriangle,
  Stethoscope,
  Activity,
  Settings
} from 'lucide-react';
import { LanguageTogglePill } from '../../../components/LanguageContext';

interface PatientAppointment {
  id: string;
  token: number;
  doctorName: string;
  specialty: string;
  clinicName: string;
  address: string;
  date: string;
  slot: string;
  status: 'confirmed' | 'completed' | 'cancelled';
  paidAmount: number;
  paymentMode: string;
  hasPrescription?: boolean;
}

export default function MyAppointmentsPage() {
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');

  const [appointments, setAppointments] = useState<PatientAppointment[]>([
    {
      id: 'apt-001',
      token: 14,
      doctorName: 'Dr. Amit Kumar',
      specialty: 'Orthopedic Surgeon',
      clinicName: 'Gupta Clinic & Joint Care Center',
      address: 'Near Railway Overbridge, Deoria Sadar',
      date: 'Today, 01 Oct 2026',
      slot: 'Morning Slot (10:00 AM - 02:00 PM)',
      status: 'confirmed',
      paidAmount: 375,
      paymentMode: 'Online UPI (Razorpay)',
      hasPrescription: false,
    },
    {
      id: 'apt-002',
      token: 8,
      doctorName: 'Dr. Priya Verma',
      specialty: 'General Medicine & Diabetes',
      clinicName: 'Verma Health Clinic',
      address: 'Civil Lines, Deoria',
      date: '24 Sep 2026',
      slot: 'Morning Slot (09:00 AM - 01:00 PM)',
      status: 'completed',
      paidAmount: 312,
      paymentMode: 'Online UPI',
      hasPrescription: true,
    },
    {
      id: 'apt-003',
      token: 5,
      doctorName: 'Dr. Amit Kumar',
      specialty: 'Orthopedic Surgeon',
      clinicName: 'Gupta Clinic & Joint Care Center',
      address: 'Near Railway Overbridge, Deoria Sadar',
      date: '10 Aug 2026',
      slot: 'Evening Slot (05:00 PM - 08:00 PM)',
      status: 'completed',
      paidAmount: 375,
      paymentMode: 'Cash (Offline Agent)',
      hasPrescription: true,
    },
  ]);

  const handleCancel = (id: string) => {
    if (confirm('Are you sure you want to cancel this appointment? Full refund will be initiated.')) {
      setAppointments((prev) =>
        prev.map((a) => (a.id === id ? { ...a, status: 'cancelled' } : a))
      );
    }
  };

  const upcomingAppointments = appointments.filter((a) => a.status === 'confirmed');
  const pastAppointments = appointments.filter((a) => a.status === 'completed' || a.status === 'cancelled');

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-['Plus_Jakarta_Sans',sans-serif] pb-24 md:pb-12">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-xl border-b border-slate-800 px-4 md:px-8 py-3.5 flex items-center justify-between shadow-xl">
        <div className="flex items-center space-x-3">
          <Link
            href="/patient"
            className="p-2 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl transition"
          >
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-base font-black text-white tracking-tight">My Doctor Appointments</h1>
            <p className="text-[11px] text-slate-400">View bookings, OPD token status & prescriptions</p>
          </div>
        </div>

        <LanguageTogglePill />
      </header>

      {/* Main Body */}
      <main className="flex-1 max-w-4xl mx-auto w-full p-4 md:p-8 space-y-6">
        {/* Tab Switcher */}
        <div className="flex items-center space-x-2 bg-slate-900 border border-slate-800 p-1.5 rounded-2xl w-fit">
          <button
            onClick={() => setActiveTab('upcoming')}
            className={`px-5 py-2.5 rounded-xl text-xs font-black transition ${
              activeTab === 'upcoming'
                ? 'bg-emerald-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Upcoming Appointments ({upcomingAppointments.length})
          </button>
          <button
            onClick={() => setActiveTab('past')}
            className={`px-5 py-2.5 rounded-xl text-xs font-black transition ${
              activeTab === 'past'
                ? 'bg-emerald-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Past Consultations ({pastAppointments.length})
          </button>
        </div>

        {/* List of Appointments */}
        {activeTab === 'upcoming' && (
          <div className="space-y-4">
            {upcomingAppointments.length === 0 ? (
              <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-12 text-center space-y-3">
                <Calendar className="w-12 h-12 text-slate-600 mx-auto" />
                <h3 className="text-base font-bold text-white">No Upcoming Appointments</h3>
                <p className="text-xs text-slate-400">You don't have any pending doctor consultations.</p>
                <Link
                  href="/patient/doctors"
                  className="inline-block bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold px-5 py-2.5 rounded-xl text-xs transition"
                >
                  Book Doctor Now →
                </Link>
              </div>
            ) : (
              upcomingAppointments.map((apt) => (
                <div
                  key={apt.id}
                  className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4 relative overflow-hidden"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-mono font-black text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 rounded-xl">
                          OPD Token #{apt.token}
                        </span>
                        <span className="text-xs font-bold text-slate-400">{apt.date}</span>
                      </div>
                      <h3 className="text-lg font-black text-white pt-1">{apt.doctorName}</h3>
                      <p className="text-xs font-bold text-emerald-400">{apt.specialty}</p>
                      <p className="text-xs text-slate-400 flex items-center space-x-1 pt-0.5">
                        <MapPin className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
                        <span>{apt.clinicName} — {apt.address}</span>
                      </p>
                    </div>

                    <div className="text-right space-y-1">
                      <span className="inline-flex items-center space-x-1 bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 px-3 py-1 rounded-full text-xs font-bold">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Confirmed ✓</span>
                      </span>
                      <p className="text-xs font-mono font-bold text-slate-300">Paid: ₹{apt.paidAmount}</p>
                      <p className="text-[10px] text-slate-500">{apt.paymentMode}</p>
                    </div>
                  </div>

                  <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 flex items-center justify-between text-xs">
                    <div className="flex items-center space-x-2 text-slate-300">
                      <Clock className="w-4 h-4 text-emerald-400" />
                      <span>{apt.slot}</span>
                    </div>

                    <button
                      onClick={() => handleCancel(apt.id)}
                      className="text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 px-3 py-1.5 rounded-xl font-bold transition border border-rose-500/20"
                    >
                      Cancel Appointment
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'past' && (
          <div className="space-y-4">
            {pastAppointments.map((apt) => (
              <div
                key={apt.id}
                className="bg-slate-900/60 border border-slate-800/80 rounded-3xl p-6 shadow-md space-y-3"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-mono font-bold text-slate-400 bg-slate-800 px-2.5 py-0.5 rounded-lg">
                        Token #{apt.token}
                      </span>
                      <span className="text-xs text-slate-400">{apt.date}</span>
                    </div>
                    <h3 className="text-base font-black text-white">{apt.doctorName}</h3>
                    <p className="text-xs text-slate-400">{apt.specialty} • {apt.clinicName}</p>
                  </div>

                  <div className="text-right">
                    <span className={`inline-block text-xs font-bold px-3 py-1 rounded-full border ${
                      apt.status === 'completed'
                        ? 'bg-blue-500/15 text-blue-300 border-blue-500/30'
                        : 'bg-rose-500/15 text-rose-300 border-rose-500/30'
                    }`}>
                      {apt.status === 'completed' ? 'Completed ✓' : 'Cancelled ✗'}
                    </span>
                  </div>
                </div>

                {apt.hasPrescription && (
                  <div className="pt-2 border-t border-slate-800 flex justify-end">
                    <Link
                      href="/patient/history"
                      className="text-xs text-emerald-400 hover:text-emerald-300 font-bold flex items-center space-x-1.5 bg-emerald-500/10 border border-emerald-500/20 px-3.5 py-1.5 rounded-xl transition"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>View Digital Prescription (पर्चा देखें)</span>
                    </Link>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Mobile Nav */}
      <nav className="fixed md:hidden bottom-0 left-0 right-0 z-50 bg-slate-900/95 backdrop-blur-xl border-t border-slate-800 px-3 py-2 flex items-center justify-around shadow-2xl">
        <Link href="/patient" className="flex flex-col items-center text-slate-400 hover:text-white py-1">
          <Activity className="w-5 h-5" />
          <span className="text-[10px] font-medium mt-1">Home</span>
        </Link>
        <Link href="/patient/doctors" className="flex flex-col items-center text-slate-400 hover:text-white py-1">
          <Stethoscope className="w-5 h-5" />
          <span className="text-[10px] font-medium mt-1">Doctors</span>
        </Link>
        <Link href="/patient/appointments" className="flex flex-col items-center text-emerald-400 py-1">
          <Calendar className="w-5 h-5" />
          <span className="text-[10px] font-bold mt-1">Bookings</span>
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
