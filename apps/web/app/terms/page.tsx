'use client';

import React from 'react';
import Link from 'next/link';
import { FileText, ShieldAlert, CheckCircle2, ArrowLeft, Mail, AlertTriangle } from 'lucide-react';
import NavControls from '../../components/NavControls';

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Top Header */}
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-md sticky top-0 z-50 px-6 py-4">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <NavControls fallbackBackUrl="/" showHome={true} showLogout={false} />
            <div className="flex items-center space-x-2">
              <div className="w-9 h-9 bg-emerald-500 rounded-xl flex items-center justify-center text-white font-bold">
                ⚖️
              </div>
              <div>
                <h1 className="text-base font-extrabold text-white">DocNest Healthcare</h1>
                <p className="text-[10px] text-emerald-400 font-mono">drugs.systems • Terms of Service</p>
              </div>
            </div>
          </div>
          <Link
            href="/patient"
            className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-3 py-1.5 rounded-xl font-bold transition"
          >
            Patient Portal
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-12 space-y-8">
        <div className="space-y-3 text-center md:text-left">
          <div className="inline-flex items-center space-x-2 bg-blue-500/10 border border-blue-500/30 text-blue-300 px-3 py-1 rounded-full text-xs font-bold">
            <FileText className="w-4 h-4 text-blue-400" />
            <span>Telemedicine Practice Guidelines (NMC / MoHFW) Compliant</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight">
            Terms of Service
          </h1>
          <p className="text-xs text-slate-400 font-mono">
            Last Updated: November 1, 2026 • Effective Date: Immediate
          </p>
        </div>

        {/* Emergency Notice */}
        <div className="bg-rose-950/40 border-2 border-rose-600/60 rounded-3xl p-6 space-y-2 shadow-xl">
          <div className="flex items-center space-x-2 text-rose-400 font-bold text-sm">
            <AlertTriangle className="w-5 h-5 flex-shrink-0" />
            <span>CRITICAL MEDICAL EMERGENCY NOTICE</span>
          </div>
          <p className="text-xs md:text-sm text-rose-200 leading-relaxed">
            DocNest is an OPD scheduling and digital consultation facilitation platform. It is <strong>NOT</strong> an emergency response service. If you are experiencing a life-threatening medical emergency, trauma, chest pain, or acute respiratory distress, please immediately dial <strong>108 / 112</strong> or proceed to the nearest emergency hospital.
          </p>
        </div>

        {/* Section 1 */}
        <section className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 md:p-8 space-y-4">
          <h2 className="text-lg font-bold text-white flex items-center space-x-2">
            <span className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs font-black">1</span>
            <span>Platform Overview & Scope</span>
          </h2>
          <div className="text-xs md:text-sm text-slate-300 space-y-2 leading-relaxed">
            <p>
              DocNest (hosted at <span className="text-emerald-400 font-mono">https://www.drugs.systems</span>) provides software infrastructure enabling:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-slate-400">
              <li>Patients to view verified doctors, real-time OPD waiting room tokens, and reserve consultation slots.</li>
              <li>Medical practitioners to issue computer-generated digital prescriptions with QR verification.</li>
              <li>Licensed clinic pharmacies to verify prescriptions, monitor stock depletion, and dispense prescribed medications with itemized receipts.</li>
            </ul>
          </div>
        </section>

        {/* Section 2 */}
        <section className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 md:p-8 space-y-4">
          <h2 className="text-lg font-bold text-white flex items-center space-x-2">
            <span className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs font-black">2</span>
            <span>Doctor-Patient Relationship & Clinical Independence</span>
          </h2>
          <div className="text-xs md:text-sm text-slate-300 space-y-2 leading-relaxed">
            <p>
              DocNest acts solely as a technology intermediary under Section 79 of the Information Technology Act, 2000. All clinical diagnoses, medication choices, dosage determinations, and treatment advice are issued solely by independent Registered Medical Practitioners (RMPs). DocNest does not practice medicine or influence professional clinical judgment.
            </p>
          </div>
        </section>

        {/* Section 3 */}
        <section className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 md:p-8 space-y-4">
          <h2 className="text-lg font-bold text-white flex items-center space-x-2">
            <span className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs font-black">3</span>
            <span>Appointment Booking & Fees</span>
          </h2>
          <div className="text-xs md:text-sm text-slate-300 space-y-2 leading-relaxed">
            <p>
              Patients may choose between two transparent payment modes:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                <p className="font-bold text-white mb-1">Pay at Clinic Counter</p>
                <p className="text-slate-400 text-xs">Patients pay directly in cash or UPI upon arrival. Zero convenience fee applies.</p>
              </div>
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                <p className="font-bold text-white mb-1">Pay Online (Razorpay)</p>
                <p className="text-slate-400 text-xs">Instant token confirmation via verified online UPI payment gateway. If a doctor cancels an OPD session, full online fee refunds are processed within 3-5 business days.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Section 4 */}
        <section className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 md:p-8 space-y-4">
          <h2 className="text-lg font-bold text-white flex items-center space-x-2">
            <span className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs font-black">4</span>
            <span>Pharmacy Dispensing & Medicine Safety</span>
          </h2>
          <div className="text-xs md:text-sm text-slate-300 space-y-2 leading-relaxed">
            <p>
              Prescription medicines (Schedule H / H1 / X drugs) are dispensed strictly in accordance with Drugs and Cosmetics Act regulations. Medicines will not be handed over without a valid, verifiable digital prescription signed or approved by an authorized medical practitioner.
            </p>
          </div>
        </section>

        {/* Section 5 */}
        <section className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 space-y-3">
          <h2 className="text-base font-bold text-white flex items-center space-x-2">
            <Mail className="w-5 h-5 text-emerald-400" />
            <span>Support & Legal Queries</span>
          </h2>
          <p className="text-xs md:text-sm text-slate-300">
            For operational queries, billing discrepancies, or legal concerns:
          </p>
          <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 text-xs space-y-1 text-slate-300">
            <p><strong className="text-white">Email:</strong> <a href="mailto:support@drugs.systems" className="text-emerald-400 underline font-mono">support@drugs.systems</a></p>
            <p><strong className="text-white">Domain:</strong> <a href="https://www.drugs.systems" className="text-emerald-400 font-mono">https://www.drugs.systems</a></p>
            <p><strong className="text-white">Jurisdiction:</strong> Courts of Deoria / Gorakhpur, Uttar Pradesh, India</p>
          </div>
        </section>

        {/* Footer links */}
        <div className="pt-6 border-t border-slate-800 text-center text-xs text-slate-500 flex flex-wrap justify-center gap-6">
          <Link href="/privacy" className="hover:text-emerald-400 transition">Privacy Policy</Link>
          <Link href="/patient" className="hover:text-emerald-400 transition">Patient Portal</Link>
          <Link href="/doctor/dashboard" className="hover:text-emerald-400 transition">Doctor Portal</Link>
          <Link href="/compounder/dispense" className="hover:text-emerald-400 transition">Pharmacy Dispensing</Link>
        </div>
      </main>
    </div>
  );
}
