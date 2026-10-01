'use client';

import React, { useState } from 'react';
import {
  CreditCard,
  Search,
  Filter,
  DollarSign,
  Download,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Landmark,
  ShieldCheck
} from 'lucide-react';

export default function DistrictPaymentsPage() {
  const [filterMode, setFilterMode] = useState<'all' | 'online' | 'cash'>('all');

  const payments = [
    { id: 'PAY-891', date: '01 Oct 2026', patient: 'Rahul Sharma', doctor: 'Dr. Amit Kumar', agent: 'Online App', gross: 375, docShare: 300, platformShare: 75, mode: 'Razorpay UPI', status: 'Settled' },
    { id: 'PAY-892', date: '01 Oct 2026', patient: 'Ramadhar Yadav', doctor: 'Dr. Amit Kumar', agent: 'Suresh (Rampur)', gross: 375, docShare: 300, platformShare: 75, mode: 'Cash Collected', status: 'Reconciled' },
    { id: 'PAY-893', date: '01 Oct 2026', patient: 'Kanti Devi', doctor: 'Dr. Rajesh Pandey', agent: 'Suresh (Rampur)', gross: 240, docShare: 200, platformShare: 40, mode: 'Cash Collected', status: 'Reconciled' },
    { id: 'PAY-894', date: '01 Oct 2026', patient: 'Priya Singh', doctor: 'Dr. Sunita Mishra', agent: 'Online App', gross: 437, docShare: 350, platformShare: 87, mode: 'Razorpay Card', status: 'Settled' },
    { id: 'PAY-895', date: '01 Oct 2026', patient: 'Shyam Sunder', doctor: 'Dr. Priya Verma', agent: 'Mohan (Khariya)', gross: 312, docShare: 250, platformShare: 62, mode: 'UPI Link', status: 'Settled' },
    { id: 'PAY-896', date: '30 Sep 2026', patient: 'Sunita Devi', doctor: 'Dr. Amit Kumar', agent: 'Pooja (Bhatni)', gross: 375, docShare: 300, platformShare: 75, mode: 'Cash Collected', status: 'Reconciled' },
  ];

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-6xl mx-auto w-full font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Header */}
      <div className="flex flex-wrap justify-between items-center gap-4 bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-xl">
        <div>
          <h1 className="text-xl md:text-2xl font-black text-white tracking-tight flex items-center space-x-2">
            <CreditCard className="w-7 h-7 text-rose-400" />
            <span>District Financial Reconciliation & Platform Revenue</span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">End-to-end ledger of patient fees, doctor payouts & DocNest 20-30% platform margin</p>
        </div>

        <button className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold px-4 py-2.5 rounded-xl text-xs flex items-center space-x-2 border border-slate-700 transition">
          <Download className="w-3.5 h-3.5" />
          <span>Export Monthly Financial Audit (CSV)</span>
        </button>
      </div>

      {/* Summary 4 Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Total Online Payments</span>
          <p className="text-2xl font-black font-mono text-emerald-400">₹45,200</p>
          <span className="text-[10px] text-slate-400">Via Razorpay Gateway</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Offline Cash Collection</span>
          <p className="text-2xl font-black font-mono text-amber-400">₹8,800</p>
          <span className="text-[10px] text-slate-400">Via Field Agents</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Doctor Net Payout</span>
          <p className="text-2xl font-black font-mono text-blue-400">₹40,500</p>
          <span className="text-[10px] text-slate-400">Direct NEFT Transfers</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-1">
          <span className="text-[11px] font-bold text-rose-400 uppercase tracking-wider block">DocNest Margin (25%)</span>
          <p className="text-2xl font-black font-mono text-rose-400">₹13,500</p>
          <span className="text-[10px] text-slate-400">Platform Retained Profit</span>
        </div>
      </div>

      {/* Transactions Audit Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-base font-black text-white flex items-center space-x-2">
            <Landmark className="w-5 h-5 text-rose-400" />
            <span>District Master Payment Ledger</span>
          </h3>
          <span className="text-xs text-slate-400 font-mono">Audited by District HQ</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase font-black tracking-wider">
                <th className="py-3 px-3">Transaction ID</th>
                <th className="py-3 px-3">Patient</th>
                <th className="py-3 px-3">Doctor</th>
                <th className="py-3 px-3">Booking Channel</th>
                <th className="py-3 px-3">Total Paid</th>
                <th className="py-3 px-3">Doctor Share</th>
                <th className="py-3 px-3">DocNest Margin</th>
                <th className="py-3 px-3 text-right">Reconciliation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {payments.map((p) => (
                <tr key={p.id} className="hover:bg-slate-800/40 transition">
                  <td className="py-3.5 px-3 font-mono font-bold text-slate-400">{p.id}</td>
                  <td className="py-3.5 px-3 font-bold text-white">{p.patient}</td>
                  <td className="py-3.5 px-3 text-slate-300">{p.doctor}</td>
                  <td className="py-3.5 px-3 text-slate-400">{p.agent}</td>
                  <td className="py-3.5 px-3 font-mono font-bold text-white">₹{p.gross}</td>
                  <td className="py-3.5 px-3 font-mono text-blue-400 font-bold">₹{p.docShare}</td>
                  <td className="py-3.5 px-3 font-mono text-rose-300 font-bold">₹{p.platformShare}</td>
                  <td className="py-3.5 px-3 text-right">
                    <span className="inline-block text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                      {p.status} ✓
                    </span>
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
