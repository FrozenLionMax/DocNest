'use client';

import React from 'react';
import { getSession } from '../../../lib/auth';
import { Printer, QrCode, ArrowLeft, Smartphone, CheckCircle, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

export default function QrFlyerPage() {
  const session = getSession();

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 p-4 md:p-8 flex flex-col items-center">
      {/* Action Header - Hidden when printing */}
      <div className="print:hidden w-full max-w-2xl bg-slate-900 text-white p-4 rounded-2xl mb-6 flex items-center justify-between shadow-lg">
        <div className="flex items-center space-x-3">
          <Link href="/doctor/dashboard" className="p-2 bg-slate-800 hover:bg-slate-700 rounded-xl transition text-slate-300">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-lg font-bold flex items-center space-x-2">
              <QrCode className="w-5 h-5 text-emerald-400" />
              <span>Clinic Printable QR Poster</span>
            </h1>
            <p className="text-xs text-slate-400">Print & display at clinic entrance for walk-in patients</p>
          </div>
        </div>

        <button
          onClick={handlePrint}
          className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-extrabold px-5 py-2 rounded-xl text-xs shadow-md flex items-center space-x-2 transition"
        >
          <Printer className="w-4 h-4 fill-slate-950" />
          <span>Print Poster (पोस्टर प्रिंट करें)</span>
        </button>
      </div>

      {/* PRINTABLE POSTER CONTAINER (A4 sizing) */}
      <div className="w-full max-w-2xl bg-white text-slate-900 rounded-3xl shadow-2xl border border-slate-200 overflow-hidden text-center p-8 md:p-12 space-y-8 print:shadow-none print:border-none print:rounded-none print:p-0">
        {/* Clinic Header */}
        <div className="space-y-3">
          <div className="w-16 h-16 bg-gradient-to-br from-emerald-600 to-teal-700 rounded-2xl flex items-center justify-center text-white text-3xl mx-auto shadow-lg shadow-emerald-900/20">
            🏥
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            {session?.clinic || 'Gupta Clinic & Joint Care Center'}
          </h1>
          <p className="text-base font-extrabold text-emerald-700">
            {session?.name || 'Dr. Amit Kumar'} — MS (Orthopedics)
          </p>
          <p className="text-xs text-slate-500">Deoria Sadar • OPD Timings: 10:00 AM - 02:00 PM</p>
        </div>

        {/* Large Prominent QR Section */}
        <div className="bg-gradient-to-b from-emerald-50 to-slate-50 p-8 rounded-3xl border-2 border-emerald-500/20 inline-block mx-auto max-w-sm w-full space-y-4 shadow-inner">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-md inline-block">
            {/* SVG QR Code graphic placeholder */}
            <svg className="w-56 h-56 mx-auto text-slate-900" viewBox="0 0 100 100" fill="currentColor">
              <rect x="0" y="0" width="30" height="30" rx="4" fill="#065f46" />
              <rect x="5" y="5" width="20" height="20" fill="white" />
              <rect x="10" y="10" width="10" height="10" fill="#065f46" />
              
              <rect x="70" y="0" width="30" height="30" rx="4" fill="#065f46" />
              <rect x="75" y="5" width="20" height="20" fill="white" />
              <rect x="80" y="10" width="10" height="10" fill="#065f46" />

              <rect x="0" y="70" width="30" height="30" rx="4" fill="#065f46" />
              <rect x="5" y="75" width="20" height="20" fill="white" />
              <rect x="10" y="80" width="10" height="10" fill="#065f46" />

              <rect x="35" y="10" width="10" height="10" fill="#0f172a" />
              <rect x="50" y="10" width="10" height="10" fill="#0f172a" />
              <rect x="35" y="35" width="30" height="10" fill="#0f172a" />
              <rect x="70" y="35" width="10" height="25" fill="#0f172a" />
              <rect x="35" y="50" width="10" height="40" fill="#0f172a" />
              <rect x="50" y="70" width="20" height="10" fill="#0f172a" />
              <rect x="75" y="75" width="15" height="15" fill="#065f46" />
            </svg>
          </div>
          <div className="space-y-1">
            <span className="inline-block bg-emerald-600 text-white font-black text-sm px-4 py-1 rounded-full uppercase tracking-wider">
              Scan to Book OPD Token
            </span>
            <p className="text-xs text-slate-600 font-semibold pt-1">क्यूआर स्कैन करके टोकन प्राप्त करें</p>
          </div>
        </div>

        {/* 3 Step Instructions */}
        <div className="grid grid-cols-3 gap-4 text-left pt-4 border-t border-slate-200">
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 font-bold text-sm flex items-center justify-center flex-shrink-0">
              1
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900">Scan QR Code</p>
              <p className="text-[11px] text-slate-500">Use Phone Camera / DocNest App</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 font-bold text-sm flex items-center justify-center flex-shrink-0">
              2
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900">Get Live Token</p>
              <p className="text-[11px] text-slate-500">Enter Name & Mobile</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 font-bold text-sm flex items-center justify-center flex-shrink-0">
              3
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900">Track Live Queue</p>
              <p className="text-[11px] text-slate-500">Wait comfortably anywhere</p>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="pt-4 border-t border-slate-200 text-center text-xs text-slate-400 font-medium">
          <p>Powered by DocNest Healthcare Platform • www.docnest.in</p>
        </div>
      </div>
    </div>
  );
}
