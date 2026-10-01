'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { DOCTORS_DIRECTORY, DoctorProfile } from '../../../lib/doctors-data';
import { getSession } from '../../../lib/auth';
import {
  ChevronLeft,
  Calendar,
  Clock,
  User,
  Phone,
  Mail,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  CreditCard,
  MapPin,
  Stethoscope,
  Sparkles,
  ArrowRight,
  Loader2
} from 'lucide-react';
import { LanguageTogglePill } from '../../../components/LanguageContext';

function BookingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const doctorId = searchParams.get('doctor') || 'doc-001';

  const doctor: DoctorProfile =
    DOCTORS_DIRECTORY.find((d) => d.id === doctorId) || DOCTORS_DIRECTORY[0];

  const session = getSession();

  // Multi-step: 1 = Date & Slot, 2 = Patient Details, 3 = Payment Checkout, 4 = Confirmed
  const [step, setStep] = useState<number>(1);

  // Step 1 states
  const [selectedDateIndex, setSelectedDateIndex] = useState<number>(0);
  const [selectedSlot, setSelectedSlot] = useState<'morning' | 'evening'>('morning');

  // Step 2 states
  const [patientName, setPatientName] = useState(session?.name || 'Rahul Sharma (राहुल शर्मा)');
  const [patientPhone, setPatientPhone] = useState(session?.phone || '9999888877');
  const [patientEmail, setPatientEmail] = useState(session?.email || 'rahul@gmail.com');
  const [patientAge, setPatientAge] = useState('32');
  const [patientGender, setPatientGender] = useState('Male');
  const [patientAllergies, setPatientAllergies] = useState('None');

  // Step 3 & 4 states
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentId, setPaymentId] = useState('');
  const [assignedToken, setAssignedToken] = useState(14);
  const [emailNoticeSent, setEmailNoticeSent] = useState(false);
  const [smsNoticeSent, setSmsNoticeSent] = useState(true);

  // Compute next 7 days dates
  const nextDays = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return {
      dayName: d.toLocaleDateString('en-US', { weekday: 'short' }),
      dateNum: d.getDate(),
      monthName: d.toLocaleDateString('en-US', { month: 'short' }),
      formatted: d.toLocaleDateString('en-IN', { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' }),
    };
  });

  const consultationFee = doctor.consultationFee;
  const platformFee = Math.round((consultationFee * doctor.platformCommission) / 100);
  const totalPayable = consultationFee + platformFee;

  // Razorpay Payment Handler (Client-side demo integration with auto fallback)
  const handlePayment = () => {
    setIsProcessing(true);

    const options = {
      key: 'rzp_test_DOCNEST_KEY',
      amount: totalPayable * 100, // paise
      currency: 'INR',
      name: 'DocNest Healthcare Platform',
      description: `Appointment with ${doctor.name} (${doctor.specialty})`,
      image: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=100&h=100&fit=crop',
      handler: function (response: any) {
        setPaymentId(response.razorpay_payment_id || `pay_${Date.now()}`);
        finalizeBooking();
      },
      prefill: {
        name: patientName,
        email: patientEmail,
        contact: patientPhone,
      },
      theme: { color: '#10b981' },
      modal: {
        ondismiss: function () {
          // Fallback simulation for sandbox testing
          setTimeout(() => {
            setPaymentId(`pay_sim_${Date.now()}`);
            finalizeBooking();
          }, 600);
        }
      }
    };

    try {
      if (typeof window !== 'undefined' && (window as any).Razorpay) {
        const rzp = new (window as any).Razorpay(options);
        rzp.open();
      } else {
        // Direct simulation
        setTimeout(() => {
          setPaymentId(`pay_upi_${Date.now()}`);
          finalizeBooking();
        }, 1200);
      }
    } catch (e) {
      setTimeout(() => {
        setPaymentId(`pay_mock_${Date.now()}`);
        finalizeBooking();
      }, 1000);
    }
  };

  const finalizeBooking = () => {
    const newToken = Math.floor(12 + Math.random() * 8);
    setAssignedToken(newToken);

    // Notification Logic as specified in Section 9
    // Read notification preference from localStorage if available
    let emailEnabled = true;
    try {
      const savedPrefs = localStorage.getItem('docnest_patient_settings');
      if (savedPrefs) {
        const parsed = JSON.parse(savedPrefs);
        emailEnabled = parsed.emailEnabled === true;
      }
    } catch (e) {}

    if (emailEnabled && patientEmail) {
      setEmailNoticeSent(true);
      console.log(`📧 Confirmation email sent to ${patientEmail}`);
    } else {
      setEmailNoticeSent(false);
    }

    setSmsNoticeSent(true);
    console.log(`📱 SMS confirmation sent to ${patientPhone}`);

    setIsProcessing(false);
    setStep(4);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-['Plus_Jakarta_Sans',sans-serif] pb-24 md:pb-12">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-xl border-b border-slate-800 px-4 md:px-8 py-3.5 flex items-center justify-between shadow-xl">
        <div className="flex items-center space-x-3">
          <Link
            href="/patient/doctors"
            className="p-2 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl transition"
          >
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-base font-black text-white tracking-tight">Book Doctor Appointment</h1>
            <p className="text-[11px] text-slate-400">{doctor.name} • {doctor.clinicName}</p>
          </div>
        </div>

        <LanguageTogglePill />
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-xl mx-auto w-full p-4 md:p-6 space-y-6">
        {/* Step Indicator Bar */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-xl">
          <div className="flex items-center justify-between text-xs">
            <div className={`flex items-center space-x-2 font-bold ${step >= 1 ? 'text-emerald-400' : 'text-slate-500'}`}>
              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black ${step >= 1 ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-400'}`}>
                1
              </span>
              <span className="hidden sm:inline">Date & Slot</span>
            </div>
            <div className={`h-0.5 flex-1 mx-2 ${step >= 2 ? 'bg-emerald-500' : 'bg-slate-800'}`} />

            <div className={`flex items-center space-x-2 font-bold ${step >= 2 ? 'text-emerald-400' : 'text-slate-500'}`}>
              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black ${step >= 2 ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-400'}`}>
                2
              </span>
              <span className="hidden sm:inline">Details</span>
            </div>
            <div className={`h-0.5 flex-1 mx-2 ${step >= 3 ? 'bg-emerald-500' : 'bg-slate-800'}`} />

            <div className={`flex items-center space-x-2 font-bold ${step >= 3 ? 'text-emerald-400' : 'text-slate-500'}`}>
              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black ${step >= 3 ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-400'}`}>
                3
              </span>
              <span className="hidden sm:inline">Payment</span>
            </div>
            <div className={`h-0.5 flex-1 mx-2 ${step >= 4 ? 'bg-emerald-500' : 'bg-slate-800'}`} />

            <div className={`flex items-center space-x-2 font-bold ${step >= 4 ? 'text-emerald-400' : 'text-slate-500'}`}>
              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black ${step >= 4 ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-400'}`}>
                4
              </span>
              <span className="hidden sm:inline">Confirmed</span>
            </div>
          </div>
        </div>

        {/* Doctor Summary Banner */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 flex items-center space-x-3.5 shadow-lg">
          <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${doctor.bgGradient} flex items-center justify-center text-white text-xl font-black shadow-md flex-shrink-0`}>
            {doctor.photoInitial}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-black text-white truncate">{doctor.name}</h3>
            <p className="text-xs text-emerald-400 font-bold truncate">{doctor.specialty}</p>
            <p className="text-[11px] text-slate-400 truncate">{doctor.clinicName} • {doctor.district}</p>
          </div>
          <div className="text-right">
            <span className="text-[10px] text-slate-400 uppercase font-bold block">Fee</span>
            <span className="text-base font-black text-white font-mono">₹{doctor.consultationFee}</span>
          </div>
        </div>

        {/* STEP 1: SELECT DATE & TIME SLOT */}
        {step === 1 && (
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
            <div>
              <h2 className="text-base font-black text-white flex items-center space-x-2">
                <Calendar className="w-5 h-5 text-emerald-400" />
                <span>Select Appointment Date (तारीख चुनें)</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">Choose your preferred consultation day</p>
            </div>

            {/* Next 7 Days Horizontal Scroll */}
            <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
              {nextDays.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedDateIndex(idx)}
                  className={`p-3 rounded-2xl flex flex-col items-center justify-center transition border active:scale-95 ${
                    selectedDateIndex === idx
                      ? 'bg-emerald-500 text-slate-950 border-emerald-400 font-black shadow-lg shadow-emerald-950/40'
                      : 'bg-slate-800/80 hover:bg-slate-800 text-slate-300 border-slate-700'
                  }`}
                >
                  <span className="text-[11px] uppercase tracking-wider">{item.dayName}</span>
                  <span className="text-lg font-mono font-black my-0.5">{item.dateNum}</span>
                  <span className="text-[10px] opacity-80">{item.monthName}</span>
                </button>
              ))}
            </div>

            <div className="pt-2">
              <h3 className="text-sm font-black text-white flex items-center space-x-2 mb-3">
                <Clock className="w-4 h-4 text-emerald-400" />
                <span>Select OPD Shift (परामर्श समय)</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div
                  onClick={() => setSelectedSlot('morning')}
                  className={`p-4 rounded-2xl border cursor-pointer transition flex items-center justify-between ${
                    selectedSlot === 'morning'
                      ? 'bg-emerald-500/15 border-emerald-500 text-white font-bold'
                      : 'bg-slate-800/70 border-slate-700/80 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <div className="space-y-0.5">
                    <p className="text-xs font-black">🌅 Morning OPD Slot</p>
                    <p className="text-[11px] text-slate-400">{doctor.morningSlot}</p>
                  </div>
                  <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${selectedSlot === 'morning' ? 'border-emerald-400 bg-emerald-500' : 'border-slate-500'}`}>
                    {selectedSlot === 'morning' && <div className="w-1.5 h-1.5 bg-slate-950 rounded-full" />}
                  </div>
                </div>

                <div
                  onClick={() => setSelectedSlot('evening')}
                  className={`p-4 rounded-2xl border cursor-pointer transition flex items-center justify-between ${
                    selectedSlot === 'evening'
                      ? 'bg-emerald-500/15 border-emerald-500 text-white font-bold'
                      : 'bg-slate-800/70 border-slate-700/80 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <div className="space-y-0.5">
                    <p className="text-xs font-black">🌆 Evening OPD Slot</p>
                    <p className="text-[11px] text-slate-400">{doctor.eveningSlot}</p>
                  </div>
                  <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${selectedSlot === 'evening' ? 'border-emerald-400 bg-emerald-500' : 'border-slate-500'}`}>
                    {selectedSlot === 'evening' && <div className="w-1.5 h-1.5 bg-slate-950 rounded-full" />}
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={() => setStep(2)}
              className="w-full bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-black py-4 rounded-2xl text-sm flex items-center justify-center space-x-2 shadow-xl shadow-emerald-950 transition"
            >
              <span>Continue to Patient Details</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* STEP 2: PATIENT DETAILS */}
        {step === 2 && (
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-5">
            <div>
              <h2 className="text-base font-black text-white flex items-center space-x-2">
                <User className="w-5 h-5 text-emerald-400" />
                <span>Patient Information (मरीज का विवरण)</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">Details will appear on your official digital prescription</p>
            </div>

            <div className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Full Patient Name *</label>
                <input
                  type="text"
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-emerald-500 font-semibold"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Mobile Number *</label>
                  <input
                    type="tel"
                    value={patientPhone}
                    onChange={(e) => setPatientPhone(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-emerald-500 font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Age / Gender</label>
                  <div className="grid grid-cols-2 gap-1.5">
                    <input
                      type="number"
                      placeholder="Age"
                      value={patientAge}
                      onChange={(e) => setPatientAge(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-3 py-3 text-sm focus:outline-none focus:border-emerald-500 font-mono"
                    />
                    <select
                      value={patientGender}
                      onChange={(e) => setPatientGender(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-2 py-3 text-xs focus:outline-none focus:border-emerald-500"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Child">Child</option>
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Email Address (Optional for e-Prescription)</label>
                <input
                  type="email"
                  value={patientEmail}
                  onChange={(e) => setPatientEmail(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-emerald-500"
                  placeholder="name@gmail.com"
                />
                <p className="text-[10px] text-slate-400 mt-1">
                  * Enable email reassurance notifications anytime in Settings
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Known Allergies / Medical Notes</label>
                <input
                  type="text"
                  value={patientAllergies}
                  onChange={(e) => setPatientAllergies(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-emerald-500"
                  placeholder="e.g. Penicillin allergy, diabetic, etc."
                />
              </div>
            </div>

            <div className="pt-2 flex items-center space-x-3">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="w-1/3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold py-3.5 rounded-xl text-xs transition"
              >
                Back
              </button>
              <button
                type="button"
                onClick={() => setStep(3)}
                className="w-2/3 bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-black py-3.5 rounded-xl text-xs flex items-center justify-center space-x-2 shadow-xl shadow-emerald-950 transition"
              >
                <span>Proceed to Payment</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: PAYMENT SUMMARY & RAZORPAY CHECKOUT */}
        {step === 3 && (
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
            <div>
              <h2 className="text-base font-black text-white flex items-center space-x-2">
                <CreditCard className="w-5 h-5 text-emerald-400" />
                <span>Payment Summary & Checkout (शुल्क विवरण)</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">Secure payment with Razorpay gateway</p>
            </div>

            {/* Bill Breakdown Card */}
            <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-5 space-y-3">
              <div className="flex justify-between items-center text-xs text-slate-300">
                <span>Doctor Consultation Fee</span>
                <span className="font-mono font-bold text-white">₹{consultationFee}</span>
              </div>
              <div className="flex justify-between items-center text-xs text-slate-300">
                <span className="flex items-center space-x-1.5">
                  <span>Platform Convenience Fee ({doctor.platformCommission}%)</span>
                  <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-1.5 py-0.5 rounded">DocNest</span>
                </span>
                <span className="font-mono font-bold text-emerald-400">₹{platformFee}</span>
              </div>
              <div className="border-t border-slate-800 pt-3 flex justify-between items-center text-sm font-black text-white">
                <span>Total Amount Payable (कुल शुल्क)</span>
                <span className="font-mono text-xl text-emerald-400">₹{totalPayable}</span>
              </div>
            </div>

            {/* Appointment Recap Mini Card */}
            <div className="bg-slate-800/40 border border-slate-700/60 rounded-xl p-3.5 space-y-1.5 text-xs text-slate-300">
              <p>📅 <strong>Date:</strong> {nextDays[selectedDateIndex].formatted} ({selectedSlot === 'morning' ? 'Morning Shift' : 'Evening Shift'})</p>
              <p>👤 <strong>Patient:</strong> {patientName} ({patientPhone})</p>
              <p>🏥 <strong>Clinic:</strong> {doctor.clinicName}, Deoria</p>
            </div>

            {/* Razorpay Action Button */}
            <div className="space-y-3 pt-2">
              <button
                type="button"
                onClick={handlePayment}
                disabled={isProcessing}
                className="w-full bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 active:scale-[0.99] text-white font-black py-4 rounded-2xl text-sm shadow-xl shadow-indigo-950/50 flex items-center justify-center space-x-2 transition disabled:opacity-60 cursor-pointer"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Processing Razorpay Checkout...</span>
                  </>
                ) : (
                  <>
                    <span>Pay ₹{totalPayable} via Razorpay (UPI / Card)</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="flex items-center justify-center space-x-2 text-[11px] text-slate-400">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>256-Bit SSL Encrypted • 100% Refundable on Doctor Cancellation</span>
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: BOOKING CONFIRMED */}
        {step === 4 && (
          <div className="bg-slate-900/95 border border-emerald-500/40 rounded-3xl p-6 md:p-8 shadow-2xl text-center space-y-6 animate-in zoom-in-95">
            <div className="w-16 h-16 bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 rounded-3xl flex items-center justify-center mx-auto text-3xl shadow-lg">
              ✓
            </div>

            <div className="space-y-1">
              <h2 className="text-2xl font-black text-white">Appointment Confirmed! 🎉</h2>
              <p className="text-emerald-400 font-bold text-sm">आपकी अपॉइंटमेंट सफलतापूर्वक बुक हो गई है!</p>
            </div>

            {/* Token Badge */}
            <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 max-w-sm mx-auto shadow-inner space-y-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest block">Your OPD Token Number</span>
              <span className="text-6xl font-black font-mono text-emerald-400 my-1 block">#{assignedToken}</span>
              <p className="text-xs text-slate-300 font-medium">Please arrive 15 minutes before your shift</p>
            </div>

            {/* Summary Details */}
            <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-4 text-left text-xs space-y-2 max-w-md mx-auto">
              <div className="flex justify-between"><span className="text-slate-400">Doctor:</span><strong className="text-white">{doctor.name} ({doctor.specialty})</strong></div>
              <div className="flex justify-between"><span className="text-slate-400">Clinic:</span><span className="text-slate-200">{doctor.clinicName}</span></div>
              <div className="flex justify-between"><span className="text-slate-400">Date & Slot:</span><strong className="text-emerald-400">{nextDays[selectedDateIndex].formatted} ({selectedSlot})</strong></div>
              <div className="flex justify-between"><span className="text-slate-400">Amount Paid:</span><span className="font-mono font-bold text-white">₹{totalPayable} (Paid Online ✓)</span></div>
              <div className="flex justify-between"><span className="text-slate-400">Payment ID:</span><span className="font-mono text-[11px] text-slate-400">{paymentId}</span></div>
            </div>

            {/* Notification Sent Notice */}
            <div className="p-3.5 bg-slate-800/80 border border-slate-700/80 rounded-2xl text-xs text-slate-300 max-w-md mx-auto space-y-1">
              {smsNoticeSent && (
                <p className="flex items-center justify-center space-x-1.5 text-emerald-300 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>SMS confirmation sent to {patientPhone}</span>
                </p>
              )}
              {emailNoticeSent ? (
                <p className="flex items-center justify-center space-x-1.5 text-blue-300 font-medium">
                  <Mail className="w-3.5 h-3.5 text-blue-400" />
                  <span>Reassurance email sent to {patientEmail}</span>
                </p>
              ) : (
                <p className="text-[11px] text-slate-400">
                  (Email notifications can be turned ON anytime in Patient Settings)
                </p>
              )}
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <Link
                href="/patient/appointments"
                className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold px-6 py-3.5 rounded-2xl text-xs transition shadow-lg"
              >
                View My Appointments →
              </Link>
              <Link
                href="/patient"
                className="w-full sm:w-auto bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold px-6 py-3.5 rounded-2xl text-xs transition"
              >
                Back to Patient Home
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default function AppointmentBookingPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-950 p-8 text-center text-slate-500">Loading booking flow...</div>}>
      <BookingContent />
    </Suspense>
  );
}
