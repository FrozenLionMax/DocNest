'use client';

import React, { useState, useEffect } from 'react';
import { DOCTORS_DIRECTORY, DoctorProfile } from '../../../lib/doctors-data';
import { getSession } from '../../../lib/auth';
import {
  UserPlus,
  Calendar,
  Clock,
  Phone,
  User,
  CheckCircle2,
  AlertTriangle,
  Stethoscope,
  DollarSign,
  FileText,
  MapPin,
  TrendingUp,
  CreditCard
} from 'lucide-react';

export default function AgentDashboardPage() {
  const [session, setSession] = useState<any>(null);
  useEffect(() => { setSession(getSession()); }, []);

  // Agent location context
  const agentDistrict = session?.district || 'Deoria';
  const agentBlock = session?.block || 'Salempur';
  const agentVillage = session?.village || 'Rampur';

  // Quick booking states
  const [selectedDoctorId, setSelectedDoctorId] = useState('doc-001');
  const [patientName, setPatientName] = useState('');
  const [patientPhone, setPatientPhone] = useState('');
  const [patientAge, setPatientAge] = useState('');
  const [patientGender, setPatientGender] = useState('Male');
  const [selectedDate, setSelectedDate] = useState('Today');
  const [selectedSlot, setSelectedSlot] = useState<'morning' | 'evening'>('morning');
  const [paymentMode, setPaymentMode] = useState<'cash_collected' | 'online_link'>('cash_collected');

  const [bookingSuccess, setBookingSuccess] = useState<any>(null);

  const selectedDoctor: DoctorProfile =
    DOCTORS_DIRECTORY.find((d) => d.id === selectedDoctorId) || DOCTORS_DIRECTORY[0];

  const totalFee = selectedDoctor.consultationFee + Math.round((selectedDoctor.consultationFee * selectedDoctor.platformCommission) / 100);

  // Today's Bookings by this agent
  const [recentBookings, setRecentBookings] = useState([
    {
      id: 'ag-1',
      token: 15,
      patient: 'Ramadhar Yadav (रामाधार यादव)',
      phone: '9876123456',
      doc: 'Dr. Amit Kumar (Ortho)',
      time: '10:45 AM',
      mode: 'Cash Collected (₹375)',
      status: 'confirmed',
    },
    {
      id: 'ag-2',
      token: 16,
      patient: 'Kanti Devi (कांती देवी)',
      phone: '9812349876',
      doc: 'Dr. Rajesh Pandey (Pediatrics)',
      time: '11:15 AM',
      mode: 'Cash Collected (₹240)',
      status: 'confirmed',
    },
    {
      id: 'ag-3',
      token: 17,
      patient: 'Shyam Sunder (श्याम सुंदर)',
      phone: '9789012345',
      doc: 'Dr. Priya Verma (Medicine)',
      time: '11:30 AM',
      mode: 'Online Pay Link (₹312)',
      status: 'confirmed',
    },
  ]);

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientName || !patientPhone) return;

    const assignedToken = Math.floor(18 + Math.random() * 5);
    const newEntry = {
      id: `ag-${Date.now()}`,
      token: assignedToken,
      patient: `${patientName} (${patientPhone})`,
      phone: patientPhone,
      doc: `${selectedDoctor.name} (${selectedDoctor.specialty})`,
      time: 'Just now',
      mode: paymentMode === 'cash_collected' ? `Cash Collected (₹${totalFee})` : `Online Link (₹${totalFee})`,
      status: 'confirmed',
    };

    setRecentBookings([newEntry, ...recentBookings]);
    setBookingSuccess({
      patientName,
      patientPhone,
      token: assignedToken,
      doctor: selectedDoctor.name,
      clinic: selectedDoctor.clinicName,
      totalFee,
      mode: paymentMode,
    });

    // Reset inputs
    setPatientName('');
    setPatientPhone('');
    setPatientAge('');
  };

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-6xl mx-auto w-full font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Header Banner */}
      <div className="flex flex-wrap justify-between items-center gap-4 bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-xl">
        <div>
          <div className="inline-flex items-center space-x-2 bg-amber-500/15 text-amber-300 border border-amber-500/30 px-3 py-1 rounded-full text-xs font-bold mb-2">
            <span>👤 FIELD AGENT TERMINAL / ग्राम स्तरीय ऑपरेटर</span>
          </div>
          <h1 className="text-xl md:text-2xl font-black text-white tracking-tight">
            {session?.name || 'Suresh Kumar'} — {agentVillage} Village (ग्राम {agentVillage})
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Block: <strong className="text-white">{agentBlock}</strong> • District: <strong className="text-white">{agentDistrict}</strong>
          </p>
        </div>

        <div className="text-right bg-slate-950 p-4 rounded-2xl border border-slate-800">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Today's Collection</span>
          <span className="text-2xl font-black font-mono text-emerald-400">₹3,600</span>
          <span className="text-[10px] text-slate-400 block">12 Bookings Handled</span>
        </div>
      </div>

      {/* Success Notification Alert */}
      {bookingSuccess && (
        <div className="p-5 bg-gradient-to-r from-emerald-950 via-slate-900 to-emerald-950 border-2 border-emerald-500/50 rounded-3xl text-xs space-y-2 shadow-2xl animate-in zoom-in-95">
          <div className="flex justify-between items-center">
            <span className="font-black text-emerald-400 text-sm flex items-center space-x-1.5">
              <CheckCircle2 className="w-4 h-4" />
              <span>Offline Booking Confirmed! Token #{bookingSuccess.token}</span>
            </span>
            <button
              onClick={() => setBookingSuccess(null)}
              className="text-slate-400 hover:text-white"
            >
              ✕
            </button>
          </div>
          <p className="text-white font-bold">
            Patient: {bookingSuccess.patientName} ({bookingSuccess.patientPhone}) booked with {bookingSuccess.doctor} at {bookingSuccess.clinic}.
          </p>
          <p className="text-slate-300">
            Payment Mode: <strong className="text-emerald-400">{bookingSuccess.mode === 'cash_collected' ? 'Cash Collected at Counter' : 'Online Payment Link Sent'}</strong>.
            SMS confirmation sent to patient.
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Offline Booking Form (2 cols) */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-xl space-y-6">
          <div>
            <h2 className="text-lg font-black text-white flex items-center space-x-2">
              <UserPlus className="w-5 h-5 text-emerald-400" />
              <span>Instant Offline Walk-in Booking Form</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">Quickly register rural patients who do not have smartphones</p>
          </div>

          <form onSubmit={handleBookingSubmit} className="space-y-4">
            {/* Select Doctor */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Select Doctor & Clinic *</label>
              <select
                value={selectedDoctorId}
                onChange={(e) => setSelectedDoctorId(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-emerald-500 font-semibold"
              >
                {DOCTORS_DIRECTORY.map((doc) => (
                  <option key={doc.id} value={doc.id}>
                    {doc.name} — {doc.specialty} ({doc.clinicName}, ₹{doc.consultationFee})
                  </option>
                ))}
              </select>
            </div>

            {/* Patient Name & Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Patient Full Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Ramu Paswan"
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Patient Mobile (Key Identifier) *</label>
                <input
                  type="tel"
                  placeholder="9876543210"
                  value={patientPhone}
                  onChange={(e) => setPatientPhone(e.target.value)}
                  maxLength={10}
                  className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-emerald-500 font-mono"
                  required
                />
              </div>
            </div>

            {/* Age, Gender & Shift */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Age (वर्ष)</label>
                <input
                  type="number"
                  placeholder="e.g. 45"
                  value={patientAge}
                  onChange={(e) => setPatientAge(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-emerald-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Gender</label>
                <select
                  value={patientGender}
                  onChange={(e) => setPatientGender(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-3 py-3 text-sm focus:outline-none focus:border-emerald-500"
                >
                  <option value="Male">Male (पुरुष)</option>
                  <option value="Female">Female (महिला)</option>
                  <option value="Child">Child (बच्चा)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">OPD Shift</label>
                <select
                  value={selectedSlot}
                  onChange={(e) => setSelectedSlot(e.target.value as any)}
                  className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-3 py-3 text-sm focus:outline-none focus:border-emerald-500 font-semibold"
                >
                  <option value="morning">Morning (सुबह)</option>
                  <option value="evening">Evening (शाम)</option>
                </select>
              </div>
            </div>

            {/* Payment Collection Selector */}
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
              <label className="block text-xs font-bold text-emerald-400 uppercase tracking-wider">
                Payment Collection Mode (शुल्क संग्रह)
              </label>

              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setPaymentMode('cash_collected')}
                  className={`p-3 rounded-xl border text-xs font-bold flex items-center justify-center space-x-2 transition ${
                    paymentMode === 'cash_collected'
                      ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                      : 'bg-slate-900 border-slate-800 text-slate-400'
                  }`}
                >
                  <DollarSign className="w-4 h-4" />
                  <span>💵 Cash Collected (₹{totalFee})</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMode('online_link')}
                  className={`p-3 rounded-xl border text-xs font-bold flex items-center justify-center space-x-2 transition ${
                    paymentMode === 'online_link'
                      ? 'bg-blue-500/20 border-blue-500 text-blue-300'
                      : 'bg-slate-900 border-slate-800 text-slate-400'
                  }`}
                >
                  <CreditCard className="w-4 h-4" />
                  <span>📱 Send UPI SMS Link</span>
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-black py-4 rounded-2xl text-sm shadow-xl shadow-emerald-950 transition flex items-center justify-center space-x-2"
            >
              <UserPlus className="w-5 h-5" />
              <span>Issue Immediate OPD Token (पर्ची जारी करें)</span>
            </button>
          </form>
        </div>

        {/* Today's Agent Activity (1 col) */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-3">
              <h3 className="text-sm font-black text-white flex items-center space-x-2">
                <Clock className="w-4 h-4 text-emerald-400" />
                <span>Today's Registrations</span>
              </h3>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full font-bold">
                {recentBookings.length} Today
              </span>
            </div>

            <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
              {recentBookings.map((b) => (
                <div key={b.id} className="p-3.5 bg-slate-950 rounded-2xl border border-slate-800 text-xs space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="font-mono font-black text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md">
                      Token #{b.token}
                    </span>
                    <span className="text-[10px] text-slate-400">{b.time}</span>
                  </div>
                  <p className="font-bold text-white text-sm">{b.patient}</p>
                  <p className="text-[11px] text-slate-400">{b.doc}</p>
                  <p className="text-[11px] font-mono font-semibold text-emerald-300">{b.mode}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800 text-center">
            <p className="text-[11px] text-slate-400">Offline bookings automatically synchronize to District Collector & Doctor Queue.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
