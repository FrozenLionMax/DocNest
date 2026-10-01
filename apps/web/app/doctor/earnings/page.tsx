'use client';

import React, { useState } from 'react';
import {
  CreditCard,
  TrendingUp,
  DollarSign,
  Calendar,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  Download,
  ShieldCheck,
  Building2,
  Users
} from 'lucide-react';

export default function DoctorEarningsPage() {
  const [filterPeriod, setFilterPeriod] = useState<'today' | 'week' | 'month'>('month');

  const earningsList = [
    {
      id: 'tx-1',
      date: '01 Oct 2026',
      patient: 'Rahul Sharma',
      token: '#14',
      grossFee: 300,
      commission: 75,
      netEarned: 225,
      mode: 'Online UPI (Razorpay)',
      status: 'settled',
    },
    {
      id: 'tx-2',
      date: '01 Oct 2026',
      patient: 'Priya Singh',
      token: '#15',
      grossFee: 300,
      commission: 75,
      netEarned: 225,
      mode: 'Cash (Field Agent: Suresh)',
      status: 'pending_reconciliation',
    },
    {
      id: 'tx-3',
      date: '30 Sep 2026',
      patient: 'Amitabh Mishra',
      token: '#11',
      grossFee: 300,
      commission: 75,
      netEarned: 225,
      mode: 'Online UPI',
      status: 'settled',
    },
    {
      id: 'tx-4',
      date: '30 Sep 2026',
      patient: 'Sunita Devi',
      token: '#12',
      grossFee: 300,
      commission: 75,
      netEarned: 225,
      mode: 'Cash Walk-in',
      status: 'settled',
    },
    {
      id: 'tx-5',
      date: '29 Sep 2026',
      patient: 'Manoj Kumar',
      token: '#9',
      grossFee: 300,
      commission: 75,
      netEarned: 225,
      mode: 'Online UPI',
      status: 'settled',
    },
  ];

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-6xl mx-auto w-full font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Header */}
      <div className="flex flex-wrap justify-between items-center gap-4 bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-xl">
        <div>
          <h1 className="text-xl md:text-2xl font-black text-white tracking-tight flex items-center space-x-2">
            <CreditCard className="w-7 h-7 text-emerald-400" />
            <span>Doctor Earnings & Payout Dashboard</span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">Real-time consultation revenue, platform commission deduction & bank payouts</p>
        </div>

        <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-4 py-2 rounded-2xl text-xs font-mono font-bold flex items-center space-x-2">
          <span>Weekly Bank Settlement Active</span>
          <CheckCircle2 className="w-4 h-4" />
        </div>
      </div>

      {/* Top Stats 4 Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-2">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Today's Earnings</span>
          <p className="text-3xl font-black font-mono text-emerald-400">₹4,500</p>
          <span className="text-[11px] text-emerald-300 font-semibold flex items-center space-x-1">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>15 Consultations completed</span>
          </span>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-2">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">This Week's Net</span>
          <p className="text-3xl font-black font-mono text-blue-400">₹28,125</p>
          <span className="text-[11px] text-slate-400">Net of 25% platform fee</span>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-2">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">This Month Net</span>
          <p className="text-3xl font-black font-mono text-purple-400">₹1,12,500</p>
          <span className="text-[11px] text-slate-400">500 Total Patients seen</span>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-2">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">DocNest Platform Fee</span>
          <p className="text-3xl font-black font-mono text-amber-400">₹37,500</p>
          <span className="text-[11px] text-slate-400">25% software & agent share</span>
        </div>
      </div>

      {/* Payout Summary Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-emerald-950/40 to-slate-900 border border-emerald-500/30 p-5 rounded-3xl shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-3.5">
          <Building2 className="w-6 h-6 text-emerald-400 flex-shrink-0" />
          <div>
            <h3 className="text-sm font-black text-white">Next Scheduled Bank Transfer: ₹28,125</h3>
            <p className="text-xs text-slate-300">Direct NEFT to SBI A/C ••••4829 on Friday, 03 Oct 2026</p>
          </div>
        </div>

        <button className="bg-slate-800 hover:bg-slate-700 text-white font-bold px-4 py-2.5 rounded-xl text-xs flex items-center space-x-2 transition border border-slate-700">
          <Download className="w-3.5 h-3.5" />
          <span>Download Tax Invoice (GST)</span>
        </button>
      </div>

      {/* Earnings Breakdown Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-base font-black text-white flex items-center space-x-2">
            <Calendar className="w-5 h-5 text-emerald-400" />
            <span>Consultation Fee Ledger & Transactions</span>
          </h3>
          <span className="text-xs text-slate-400 font-mono">Showing recent 5 entries</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase font-black tracking-wider">
                <th className="py-3 px-3">Date</th>
                <th className="py-3 px-3">Patient</th>
                <th className="py-3 px-3">Token</th>
                <th className="py-3 px-3">Gross Fee</th>
                <th className="py-3 px-3">DocNest Fee (25%)</th>
                <th className="py-3 px-3">Net Earned</th>
                <th className="py-3 px-3">Payment Channel</th>
                <th className="py-3 px-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {earningsList.map((row) => (
                <tr key={row.id} className="hover:bg-slate-800/40 transition">
                  <td className="py-3.5 px-3 font-mono font-bold text-slate-300">{row.date}</td>
                  <td className="py-3.5 px-3 font-bold text-white">{row.patient}</td>
                  <td className="py-3.5 px-3 font-mono font-bold text-emerald-400">{row.token}</td>
                  <td className="py-3.5 px-3 font-mono text-slate-300">₹{row.grossFee}</td>
                  <td className="py-3.5 px-3 font-mono text-amber-400">-₹{row.commission}</td>
                  <td className="py-3.5 px-3 font-mono font-black text-emerald-400 text-sm">₹{row.netEarned}</td>
                  <td className="py-3.5 px-3 text-slate-400">{row.mode}</td>
                  <td className="py-3.5 px-3 text-right">
                    <span className={`inline-block text-[11px] px-2.5 py-0.5 rounded-full font-bold border ${
                      row.status === 'settled'
                        ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                        : 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                    }`}>
                      {row.status === 'settled' ? 'Settled ✓' : 'In Escrow'}
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
