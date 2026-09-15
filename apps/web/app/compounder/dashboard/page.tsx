'use client';

import React from 'react';
import { Pill, LayoutDashboard, CheckCircle2, Clock } from 'lucide-react';
import Link from 'next/link';

export default function CompounderDashboardPage() {
  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center space-x-2">
          <Pill className="w-7 h-7 text-blue-400" />
          <span>Compounder & Pharmacy Dashboard</span>
        </h1>
        <p className="text-xs text-slate-400">Gupta Clinic Pharmacy — Deoria Sadar</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-2">
          <p className="text-xs text-slate-400">Pending Prescriptions</p>
          <p className="text-3xl font-extrabold text-blue-400">4 Rx</p>
          <span className="text-[10px] text-slate-400">Ready for medicine dispensing</span>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-2">
          <p className="text-xs text-slate-400">Dispensed Today</p>
          <p className="text-3xl font-extrabold text-emerald-400">32 Rx</p>
          <span className="text-[10px] text-slate-400 font-medium">Completed pharmacy tokens</span>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-2">
          <p className="text-xs text-slate-400">Active Doctor</p>
          <p className="text-xl font-bold text-white">Dr. Amit Kumar</p>
          <span className="text-[10px] text-emerald-400">OPD Currently Active</span>
        </div>
      </div>

      <div className="pt-4">
        <Link
          href="/compounder/dispense"
          className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold px-6 py-3.5 rounded-xl text-sm shadow-lg transition"
        >
          <Pill className="w-5 h-5" />
          <span>Open Medicine Dispensing Station (दवा वितरण)</span>
        </Link>
      </div>
    </div>
  );
}
