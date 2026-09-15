'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronLeft, Printer, QrCode, Stethoscope, MapPin, Phone, Sparkles } from 'lucide-react';

export default function ClinicQrFlyerPage() {
  const [clinicName, setClinicName] = useState('Gupta Clinic & Joint Care Center');
  const [doctorName, setDoctorName] = useState('Dr. Amit Kumar (Orthopedic Surgeon)');
  const [address, setAddress] = useState('कचहरी चौराहा, देवरिया सदर, उ.प्र.');
  const [phone, setPhone] = useState('+91 98765 43210');

  useEffect(() => {
    const sessionStr = sessionStorage.getItem('docnest_doctor');
    if (sessionStr) {
      try {
        const doc = JSON.parse(sessionStr);
        if (doc.clinic) setClinicName(doc.clinic);
        if (doc.name) setDoctorName(doc.name);
      } catch (e) {}
    }
  }, []);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Top Navbar (Hidden on print) */}
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center shadow-sm print:hidden">
        <div className="flex items-center space-x-4">
          <Link href="/dashboard" className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100">
            <ChevronLeft className="w-6 h-6" />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">क्लिनिक QR कोड पोस्टर (Print Reception Poster)</h1>
            <p className="text-xs text-slate-500">रिसेप्शन डेस्क पर लगाने हेतु A4 साइज प्रिंट पोस्टर</p>
          </div>
        </div>

        <button
          onClick={handlePrint}
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl flex items-center space-x-2 shadow transition"
        >
          <Printer className="w-4 h-4" />
          <span>पोस्टर प्रिंट करें (Print Poster)</span>
        </button>
      </header>

      {/* Main Printable A4 Poster Sheet */}
      <main className="flex-1 p-8 flex justify-center items-center">
        <div className="bg-white w-full max-w-2xl border-4 border-emerald-600 rounded-3xl p-10 shadow-2xl space-y-8 print:shadow-none print:border-4 print:w-full print:max-w-none text-slate-900 text-center relative overflow-hidden">
          
          {/* Header Banner */}
          <div className="space-y-2 border-b-2 border-slate-100 pb-6">
            <div className="inline-flex items-center space-x-2 bg-emerald-100 text-emerald-800 px-4 py-1.5 rounded-full text-sm font-extrabold uppercase tracking-wider">
              <span>🩺 DocNest Deoria Live OPD Queue</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight pt-2">{clinicName}</h1>
            <p className="text-lg font-bold text-emerald-700">{doctorName}</p>
            <p className="text-xs text-slate-500 flex items-center justify-center space-x-1">
              <MapPin className="w-3.5 h-3.5 text-emerald-600" />
              <span>{address}</span>
            </p>
          </div>

          {/* Call to Action */}
          <div className="space-y-2">
            <h2 className="text-2xl font-black text-slate-900">
              क्यूआर कोड स्कैन करें और लाइव पर्ची नंबर देखें!
            </h2>
            <p className="text-sm text-slate-600">
              बार-बार रिसेप्शन पर जाने की आवश्यकता नहीं — सीधे अपने मोबाइल पर लाइव टोकन देखें
            </p>
          </div>

          {/* Giant QR Code Display Box */}
          <div className="flex justify-center my-6">
            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border-4 border-emerald-500 rounded-3xl p-8 shadow-xl inline-block">
              {/* Simulated HD SVG QR Code */}
              <div className="w-64 h-64 bg-white p-4 rounded-2xl border border-slate-200 flex flex-col items-center justify-center space-y-3 mx-auto shadow-inner">
                <QrCode className="w-48 h-48 text-slate-900" />
                <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest">scan to view live opd token</span>
              </div>
            </div>
          </div>

          {/* 3 Step Instruction Row */}
          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-100 text-center">
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
              <span className="w-8 h-8 rounded-full bg-emerald-600 text-white font-bold text-sm inline-flex items-center justify-center mb-1">1</span>
              <p className="text-xs font-bold text-slate-800">कैमरा खोलें</p>
              <p className="text-[11px] text-slate-500">QR कोड स्कैन करें</p>
            </div>

            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
              <span className="w-8 h-8 rounded-full bg-emerald-600 text-white font-bold text-sm inline-flex items-center justify-center mb-1">2</span>
              <p className="text-xs font-bold text-slate-800">टोकन देखें</p>
              <p className="text-[11px] text-slate-500">चालू नंबर मोबाइल पर</p>
            </div>

            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
              <span className="w-8 h-8 rounded-full bg-emerald-600 text-white font-bold text-sm inline-flex items-center justify-center mb-1">3</span>
              <p className="text-xs font-bold text-slate-800">आराम से बैठें</p>
              <p className="text-[11px] text-slate-500">बारी आने पर अंदर जाएं</p>
            </div>
          </div>

          {/* Footer */}
          <div className="pt-6 text-xs text-slate-400 border-t border-slate-100 flex justify-between items-center">
            <span>संपर्क: {phone}</span>
            <span className="font-bold text-emerald-700">Powered by DocNest Healthcare Deoria</span>
          </div>

        </div>
      </main>
    </div>
  );
}
