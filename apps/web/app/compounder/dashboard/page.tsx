'use client';

import React, { useState, useEffect } from 'react';
import { Pill, CheckCircle2, Clock, IndianRupee, ArrowRight, Stethoscope, AlertCircle, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import NavControls from '../../../components/NavControls';
import { getPrescriptionsForPharmacy, getClinicState, subscribeToClinicalEvents, PrescriptionRecord } from '../../../lib/clinical-store';
import { getSession } from '../../../lib/auth';

export default function CompounderDashboardPage() {
  const session = getSession();
  const [prescriptions, setPrescriptions] = useState<PrescriptionRecord[]>([]);
  const [clinicState, setClinicState] = useState(() => getClinicState('doc-001'));

  const refreshData = () => {
    setPrescriptions(getPrescriptionsForPharmacy());
    setClinicState(getClinicState('doc-001'));
  };

  useEffect(() => {
    refreshData();
    const unsubscribe = subscribeToClinicalEvents(() => {
      refreshData();
    });
    return () => unsubscribe();
  }, []);

  const pending = prescriptions.filter(p => p.status === 'pending');
  const dispensed = prescriptions.filter(p => p.status === 'dispensed');
  const totalRevenue = dispensed.reduce((sum, p) => sum + (p.totalBill || 0), 0);

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto w-full font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Top Banner */}
      <div className="flex flex-wrap justify-between items-center gap-4 bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-xl">
        <div className="flex items-center space-x-3">
          <NavControls fallbackBackUrl="/" showHome={true} showLogout={true} />
          <div>
            <h1 className="text-xl md:text-2xl font-black text-white flex items-center space-x-2">
              <Pill className="w-7 h-7 text-emerald-400" />
              <span>Pharmacy & Dispensing Counter</span>
            </h1>
            <p className="text-xs text-slate-400">{session?.clinic || 'Gupta Clinic Pharmacy — Deoria Sadar'}</p>
          </div>
        </div>

        <Link
          href="/compounder/dispense"
          className="inline-flex items-center space-x-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-black px-6 py-3 rounded-xl text-xs shadow-lg transition active:scale-95"
        >
          <Pill className="w-4 h-4 fill-slate-950" />
          <span>Go to Live Dispensing Station</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Real-time KPI Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-2 shadow-lg">
          <div className="flex justify-between items-center">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Pending Rx</span>
            <Clock className="w-5 h-5 text-amber-400" />
          </div>
          <p className="text-3xl font-black text-amber-400 font-mono">{pending.length} Rx</p>
          <span className="text-[11px] text-slate-400">Waiting for medicine pack</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-2 shadow-lg">
          <div className="flex justify-between items-center">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Dispensed Today</span>
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          </div>
          <p className="text-3xl font-black text-emerald-400 font-mono">{dispensed.length} Rx</p>
          <span className="text-[11px] text-slate-400">Completed pharmacy orders</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-2 shadow-lg">
          <div className="flex justify-between items-center">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Pharmacy Revenue</span>
            <IndianRupee className="w-5 h-5 text-blue-400" />
          </div>
          <p className="text-3xl font-black text-blue-400 font-mono">₹{totalRevenue.toLocaleString()}</p>
          <span className="text-[11px] text-slate-400">Cash / UPI Counter Sales</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-2 shadow-lg">
          <div className="flex justify-between items-center">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Current Token</span>
            <Stethoscope className="w-5 h-5 text-purple-400" />
          </div>
          <p className="text-3xl font-black text-purple-300 font-mono">#{clinicState.currentToken}</p>
          <span className="text-[11px] text-emerald-400">Doctor OPD Active</span>
        </div>
      </div>

      {/* Recent Prescriptions Queue */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
        <div className="flex justify-between items-center">
          <h2 className="text-base font-extrabold text-white flex items-center space-x-2">
            <span>Recent Clinical Prescriptions</span>
          </h2>
          <Link href="/compounder/dispense" className="text-xs text-emerald-400 hover:underline font-bold">
            View All ({prescriptions.length}) →
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-semibold uppercase">
                <th className="py-3 px-3">Token #</th>
                <th className="py-3 px-3">Patient</th>
                <th className="py-3 px-3">Doctor</th>
                <th className="py-3 px-3">Medicines</th>
                <th className="py-3 px-3">Amount</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-200">
              {prescriptions.slice(0, 5).map((rx) => (
                <tr key={rx.id} className="hover:bg-slate-800/40">
                  <td className="py-3.5 px-3 font-mono font-bold text-emerald-400">#{rx.tokenNumber}</td>
                  <td className="py-3.5 px-3 font-bold text-white">{rx.patientName}</td>
                  <td className="py-3.5 px-3 text-slate-300">{rx.doctorName}</td>
                  <td className="py-3.5 px-3 text-slate-400">{rx.medicines.map(m => m.name.split(' (')[0]).join(', ')}</td>
                  <td className="py-3.5 px-3 font-mono font-bold text-emerald-400">₹{rx.totalBill}</td>
                  <td className="py-3.5 px-3">
                    <span className={`px-2 py-0.5 rounded-md font-bold uppercase text-[10px] ${
                      rx.status === 'dispensed' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'
                    }`}>
                      {rx.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-3 text-right">
                    <Link
                      href="/compounder/dispense"
                      className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1.5 rounded-lg font-bold"
                    >
                      Open Rx
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
