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
  Settings,
  Star,
  RefreshCw,
  X
} from 'lucide-react';
import { LanguageTogglePill } from '../../../components/LanguageContext';
import { ThemeTogglePill } from '../../../components/ThemeContext';
import NavControls from '../../../components/NavControls';

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
  userRating?: number;
  userReview?: string;
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
      userRating: 5,
      userReview: 'Very attentive doctor. Relieved my fever and knee swelling in 2 days.',
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

  // Reschedule Modal state
  const [rescheduleApt, setRescheduleApt] = useState<PatientAppointment | null>(null);
  const [newDate, setNewDate] = useState('Tomorrow, 02 Oct 2026');
  const [newSlot, setNewSlot] = useState('Morning Slot (10:00 AM - 02:00 PM)');

  // Review Modal state
  const [reviewApt, setReviewApt] = useState<PatientAppointment | null>(null);
  const [ratingStars, setRatingStars] = useState(5);
  const [reviewText, setReviewText] = useState('');
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  const handleCancel = (id: string) => {
    if (confirm('Are you sure you want to cancel this appointment? Full 100% refund of fee will be initiated to your source payment method.')) {
      setAppointments((prev) =>
        prev.map((a) => (a.id === id ? { ...a, status: 'cancelled' } : a))
      );
    }
  };

  const handleConfirmReschedule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rescheduleApt) return;
    setAppointments((prev) =>
      prev.map((a) =>
        a.id === rescheduleApt.id ? { ...a, date: newDate, slot: newSlot } : a
      )
    );
    setRescheduleApt(null);
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewApt) return;
    setAppointments((prev) =>
      prev.map((a) =>
        a.id === reviewApt.id
          ? { ...a, userRating: ratingStars, userReview: reviewText }
          : a
      )
    );
    setReviewSubmitted(true);
    setTimeout(() => {
      setReviewSubmitted(false);
      setReviewApt(null);
      setReviewText('');
    }, 1500);
  };

  const upcomingAppointments = appointments.filter((a) => a.status === 'confirmed');
  const pastAppointments = appointments.filter((a) => a.status === 'completed' || a.status === 'cancelled');

  return (
    <div className="min-h-screen bg-mesh-dark text-slate-100 flex flex-col font-['Plus_Jakarta_Sans',sans-serif] pb-24 md:pb-12">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#0c1219]/85 backdrop-blur-2xl border-b border-[rgba(196,225,230,0.14)] px-4 md:px-8 py-3.5 flex flex-wrap items-center justify-between shadow-xl gap-3">
        <div className="flex items-center space-x-3">
          <NavControls fallbackBackUrl="/patient" showHome={true} showLogout={false} />
          <div>
            <h1 className="text-base font-black text-white tracking-tight">My Doctor Appointments</h1>
            <p className="text-[11px] text-[#a4ccd9]/70">View bookings, OPD token status, reschedule & reviews</p>
          </div>
        </div>

        <div className="flex items-center space-x-2.5">
          <ThemeTogglePill />
          <LanguageTogglePill />
          <NavControls showHome={false} showLogout={true} />
        </div>
      </header>

      {/* Main Body */}
      <main className="flex-1 max-w-4xl mx-auto w-full p-4 md:p-8 space-y-6">
        {/* Tab Switcher */}
        <div className="flex items-center space-x-2 bg-slate-100 dark:bg-[#141e28] p-1.5 rounded-2xl w-fit border border-slate-200/80 dark:border-slate-800">
          <button
            onClick={() => setActiveTab('upcoming')}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
              activeTab === 'upcoming'
                ? 'bg-teal-600 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Upcoming Appointments ({upcomingAppointments.length})
          </button>
          <button
            onClick={() => setActiveTab('past')}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
              activeTab === 'past'
                ? 'bg-teal-600 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Past Consultations ({pastAppointments.length})
          </button>
        </div>

        {/* List of Appointments */}
        {activeTab === 'upcoming' && (
          <div className="space-y-4">
            {upcomingAppointments.length === 0 ? (
              <div className="bg-white dark:bg-[#141e28] rounded-3xl p-12 text-center space-y-3 border border-slate-200/90 dark:border-slate-800 shadow-sm">
                <Calendar className="w-12 h-12 text-slate-400 mx-auto" />
                <h3 className="text-base font-black text-slate-900 dark:text-white">No Upcoming Appointments</h3>
                <p className="text-xs text-slate-500">You don't have any pending doctor consultations.</p>
                <Link
                  href="/patient/doctors"
                  className="bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 inline-block text-white font-extrabold px-6 py-3 rounded-2xl text-xs transition shadow-md"
                >
                  Book Doctor Now →
                </Link>
              </div>
            ) : (
              upcomingAppointments.map((apt) => (
                <div
                  key={apt.id}
                  className="bg-white dark:bg-[#141e28] rounded-3xl p-6 space-y-4 relative overflow-hidden border border-slate-200/90 dark:border-slate-800 shadow-sm hover:shadow-md transition"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-mono font-black text-teal-800 dark:text-teal-300 bg-teal-50 dark:bg-teal-950/60 border border-teal-200/80 dark:border-teal-800 px-3 py-1 rounded-xl">
                          OPD Token #{apt.token}
                        </span>
                        <span className="text-xs font-bold text-slate-500 dark:text-slate-400">{apt.date}</span>
                      </div>
                      <h3 className="text-lg font-black text-slate-900 dark:text-white pt-1">{apt.doctorName}</h3>
                      <p className="text-xs font-bold text-teal-700 dark:text-teal-400">{apt.specialty}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center space-x-1 pt-0.5">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                        <span>{apt.clinicName} — {apt.address}</span>
                      </p>
                    </div>

                    <div className="text-right space-y-1">
                      <span className="inline-flex items-center space-x-1 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 px-3 py-1 rounded-full text-xs font-bold">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                        <span>Confirmed & Paid ✓</span>
                      </span>
                      <p className="text-xs font-mono font-bold text-slate-800 dark:text-slate-200">Paid: ₹{apt.paidAmount}</p>
                      <p className="text-[10px] text-slate-500">{apt.paymentMode}</p>
                    </div>
                  </div>

                  <div className="bg-slate-50 dark:bg-[#0c1219] p-3.5 rounded-2xl border border-slate-200/80 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs">
                    <div className="flex items-center space-x-2 text-slate-700 dark:text-slate-300 font-medium">
                      <Clock className="w-4 h-4 text-teal-600" />
                      <span>{apt.slot}</span>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setRescheduleApt(apt)}
                        className="text-xs text-teal-800 dark:text-teal-300 hover:text-teal-900 bg-teal-50 hover:bg-teal-100 dark:bg-teal-950/60 px-3 py-1.5 rounded-xl font-bold transition border border-teal-200/80 dark:border-teal-800 flex items-center space-x-1 cursor-pointer"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        <span>Reschedule Date</span>
                      </button>

                      <button
                        onClick={() => handleCancel(apt.id)}
                        className="text-xs text-rose-700 dark:text-rose-400 hover:text-rose-800 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/50 px-3 py-1.5 rounded-xl font-bold transition border border-rose-200 dark:border-rose-800 cursor-pointer"
                      >
                        Cancel & Refund
                      </button>
                    </div>
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
                className="glass-panel rounded-3xl p-6 space-y-3"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-mono font-bold text-[#c4e1e6] bg-[#0c1219]/80 border border-[rgba(196,225,230,0.15)] px-2.5 py-0.5 rounded-lg">
                        Token #{apt.token}
                      </span>
                      <span className="text-xs text-slate-400">{apt.date}</span>
                    </div>
                    <h3 className="text-base font-black text-white">{apt.doctorName}</h3>
                    <p className="text-xs text-[#a4ccd9]/70">{apt.specialty} • {apt.clinicName}</p>
                  </div>

                  <div className="text-right">
                    <span className={`inline-block text-xs font-bold px-3 py-1 rounded-full border ${
                      apt.status === 'completed'
                        ? 'bg-[#8dbcc7]/15 text-[#c4e1e6] border-[#8dbcc7]/35'
                        : 'bg-rose-500/15 text-rose-300 border-rose-500/30'
                    }`}>
                      {apt.status === 'completed' ? 'Completed & Paid ✓' : 'Cancelled ✗'}
                    </span>
                  </div>
                </div>

                {/* Rating & Review Section (Only after successful booking/consultation) */}
                {apt.status === 'completed' && (
                  <div className="pt-2 border-t border-[rgba(196,225,230,0.1)] flex flex-wrap items-center justify-between gap-3">
                    {apt.userRating ? (
                      <div className="text-xs text-amber-300 flex items-center space-x-2">
                        <div className="flex items-center">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`w-3.5 h-3.5 ${
                                i < (apt.userRating || 5)
                                  ? 'fill-amber-400 text-amber-400'
                                  : 'text-slate-600'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-slate-300 italic font-medium">"{apt.userReview}"</span>
                      </div>
                    ) : (
                      <button
                        onClick={() => setReviewApt(apt)}
                        className="text-xs text-amber-300 hover:text-white font-bold flex items-center space-x-1.5 bg-amber-400/10 border border-amber-400/30 px-3.5 py-1.5 rounded-xl transition"
                      >
                        <Star className="w-3.5 h-3.5 fill-amber-400" />
                        <span>Rate Doctor & Write Review (रेटिंग दें)</span>
                      </button>
                    )}

                    {apt.hasPrescription && (
                      <Link
                        href="/patient/history"
                        className="text-xs text-[#8dbcc7] hover:text-white font-bold flex items-center space-x-1.5 bg-[#8dbcc7]/10 border border-[#8dbcc7]/25 px-3.5 py-1.5 rounded-xl transition"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>View Digital Prescription (पर्चा देखें)</span>
                      </Link>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>

      {/* RESCHEDULE MODAL */}
      {rescheduleApt && (
        <div className="fixed inset-0 bg-[#0c1219]/80 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="bg-[#141e28] border border-[rgba(196,225,230,0.2)] rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl space-y-5 animate-in zoom-in-95">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-black text-white">Reschedule Appointment</h3>
                <p className="text-xs text-[#a4ccd9]/70">{rescheduleApt.doctorName} • {rescheduleApt.clinicName}</p>
              </div>
              <button
                onClick={() => setRescheduleApt(null)}
                className="p-1.5 text-slate-400 hover:text-white rounded-xl bg-[#0c1219]/80 border border-[rgba(196,225,230,0.1)]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleConfirmReschedule} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Select New Date</label>
                <select
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  className="w-full bg-[#0c1219]/90 border border-[rgba(196,225,230,0.18)] text-white rounded-xl p-3 text-xs focus:outline-none focus:border-[#8dbcc7]"
                >
                  <option value="Tomorrow, 02 Oct 2026">Tomorrow, 02 Oct 2026</option>
                  <option value="Saturday, 03 Oct 2026">Saturday, 03 Oct 2026</option>
                  <option value="Monday, 05 Oct 2026">Monday, 05 Oct 2026</option>
                  <option value="Tuesday, 06 Oct 2026">Tuesday, 06 Oct 2026</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Select Slot</label>
                <select
                  value={newSlot}
                  onChange={(e) => setNewSlot(e.target.value)}
                  className="w-full bg-[#0c1219]/90 border border-[rgba(196,225,230,0.18)] text-white rounded-xl p-3 text-xs focus:outline-none focus:border-[#8dbcc7]"
                >
                  <option value="Morning Slot (10:00 AM - 02:00 PM)">Morning Slot (10:00 AM - 02:00 PM)</option>
                  <option value="Evening Slot (05:00 PM - 08:00 PM)">Evening Slot (05:00 PM - 08:00 PM)</option>
                </select>
              </div>

              <div className="pt-2 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setRescheduleApt(null)}
                  className="px-4 py-2.5 rounded-xl bg-[#0c1219]/80 text-slate-300 text-xs font-bold border border-[rgba(196,225,230,0.1)] hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary-tactile px-5 py-2.5 rounded-xl text-[#0c1219] text-xs font-black"
                >
                  Save Reschedule ✓
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* RATING & REVIEW MODAL */}
      {reviewApt && (
        <div className="fixed inset-0 bg-[#0c1219]/80 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="bg-[#141e28] border border-[rgba(196,225,230,0.2)] rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl space-y-5 animate-in zoom-in-95">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] font-bold text-amber-300 uppercase tracking-widest block">Verified Patient Review</span>
                <h3 className="text-lg font-black text-white pt-0.5">Rate {reviewApt.doctorName}</h3>
                <p className="text-xs text-[#a4ccd9]/70">Available because your consultation was booked & paid via DocNest</p>
              </div>
              <button
                onClick={() => setReviewApt(null)}
                className="p-1.5 text-slate-400 hover:text-white rounded-xl bg-[#0c1219]/80 border border-[rgba(196,225,230,0.1)]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {reviewSubmitted ? (
              <div className="p-6 bg-[#8dbcc7]/15 border border-[#8dbcc7]/35 rounded-2xl text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 text-[#ebffd8] mx-auto" />
                <h4 className="text-sm font-bold text-white">Review Submitted! धन्यवाद!</h4>
                <p className="text-xs text-[#c4e1e6]">Your feedback helps improve healthcare in Deoria district.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmitReview} className="space-y-4">
                {/* 5-Star Selector */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-2">Overall Consultation Rating</label>
                  <div className="flex items-center space-x-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setRatingStars(star)}
                        className="p-1 transition active:scale-125"
                      >
                        <Star
                          className={`w-7 h-7 ${
                            star <= ratingStars
                              ? 'fill-amber-400 text-amber-400'
                              : 'text-slate-600'
                          }`}
                        />
                      </button>
                    ))}
                    <span className="text-xs font-bold text-amber-300 pl-2">{ratingStars} of 5 Stars</span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Your Feedback & Experience (सलाह / अनुभव)</label>
                  <textarea
                    rows={3}
                    placeholder="Tell us about the waiting time, doctor explanation, and medicine effectiveness..."
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    required
                    className="w-full bg-[#0c1219]/90 border border-[rgba(196,225,230,0.18)] text-white rounded-xl p-3 text-xs focus:outline-none focus:border-[#8dbcc7]"
                  />
                </div>

                <div className="pt-2 flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => setReviewApt(null)}
                    className="px-4 py-2.5 rounded-xl bg-[#0c1219]/80 text-slate-300 text-xs font-bold border border-[rgba(196,225,230,0.1)] hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-[#0c1219] font-black text-xs shadow"
                  >
                    Post Verified Review ★
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Floating App-like Mobile Bottom Navigation */}
      <nav className="fixed md:hidden bottom-3 left-3 right-3 z-50 bg-[#0c1219]/90 backdrop-blur-2xl border border-[rgba(196,225,230,0.14)] rounded-2xl px-3 py-2 flex items-center justify-around shadow-[0_12px_32px_rgba(0,0,0,0.6)]">
        <Link href="/patient" className="flex flex-col items-center text-slate-400 hover:text-white py-1 transition active:scale-90">
          <Activity className="w-5 h-5" />
          <span className="text-[10px] font-medium mt-1">Home</span>
        </Link>
        <Link href="/patient/doctors" className="flex flex-col items-center text-slate-400 hover:text-white py-1 transition active:scale-90">
          <Stethoscope className="w-5 h-5" />
          <span className="text-[10px] font-medium mt-1">Doctors</span>
        </Link>
        <Link href="/patient/appointments" className="flex flex-col items-center text-[#8dbcc7] py-1 transition active:scale-90">
          <Calendar className="w-5 h-5" />
          <span className="text-[10px] font-bold mt-1">Bookings</span>
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
