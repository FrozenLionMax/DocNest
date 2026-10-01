'use client';

import React from 'react';
import {
  Landmark,
  Building2,
  Users,
  Stethoscope,
  TrendingUp,
  CreditCard,
  AlertTriangle,
  ShieldCheck,
  Calendar,
  CheckCircle2,
  DollarSign,
  ArrowUpRight
} from 'lucide-react';
import { getSession } from '../../../lib/auth';

export default function DistrictDashboardPage() {
  const session = getSession();
  const districtName = session?.district || 'Deoria';

  const blockPerformance = [
    { block: 'Deoria Sadar (सदर)', coordinator: 'Vijay Singh', agents: 10, todayBookings: 85, revenue: 25500, commission: 6375, status: 'Peak Rush 🔥' },
    { block: 'Salempur (सलेमपुर)', coordinator: 'Ram Kumar', agents: 8, todayBookings: 55, revenue: 16500, commission: 4125, status: 'Normal' },
    { block: 'Bhatpar Rani (भाटपार रानी)', coordinator: 'Anil Mishra', agents: 6, todayBookings: 40, revenue: 12000, commission: 3000, status: 'Normal' },
  ];

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-6xl mx-auto w-full font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Header Banner */}
      <div className="flex flex-wrap justify-between items-center gap-4 bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-xl">
        <div>
          <div className="inline-flex items-center space-x-2 bg-rose-500/15 text-rose-300 border border-rose-500/30 px-3 py-1 rounded-full text-xs font-bold mb-2">
            <span>🏛️ DISTRICT OPERATIONS HEAD / जिला मुख्य समन्वयक (MD / Lead)</span>
          </div>
          <h1 className="text-xl md:text-2xl font-black text-white tracking-tight">
            {districtName} District Healthcare Operations & Revenue Oversight
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Company Leadership Hub • Direct oversight across 3 Blocks, 24 Village Agents, and Partner Clinics
          </p>
        </div>

        <div className="bg-rose-500/10 border border-rose-500/30 text-rose-300 px-4 py-2 rounded-2xl text-xs font-mono font-bold flex items-center space-x-2">
          <span>District Operations Active</span>
          <ShieldCheck className="w-4 h-4 text-rose-400" />
        </div>
      </div>

      {/* Top 5 Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-1.5">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Registered Doctors</span>
          <p className="text-2xl font-black font-mono text-emerald-400">6 Doctors</p>
          <span className="text-[10px] text-slate-400">All OPDs Verified</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-1.5">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Active Field Agents</span>
          <p className="text-2xl font-black font-mono text-cyan-400">24 Agents</p>
          <span className="text-[10px] text-slate-400">Across 3 Blocks</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-1.5">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Today's Total Bookings</span>
          <p className="text-2xl font-black font-mono text-blue-400">180 Patients</p>
          <span className="text-[10px] text-blue-300 font-semibold flex items-center space-x-1">
            <ArrowUpRight className="w-3 h-3" />
            <span>+24% vs last week</span>
          </span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-1.5">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Gross District OPD Flow</span>
          <p className="text-2xl font-black font-mono text-white">₹54,000</p>
          <span className="text-[10px] text-slate-400">Today's Transactions</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-1.5">
          <span className="text-[11px] font-bold text-rose-400 uppercase tracking-wider block">DocNest Net Commission</span>
          <p className="text-2xl font-black font-mono text-rose-400">₹13,500</p>
          <span className="text-[10px] text-slate-400 font-medium">25% Platform Share</span>
        </div>
      </div>

      {/* Quick Alerts Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gradient-to-r from-amber-950/60 to-slate-900 border border-amber-500/30 p-4.5 rounded-2xl flex items-center space-x-3 text-xs text-amber-200">
          <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 animate-bounce" />
          <p>
            <strong>Agent Field Alert:</strong> 3 village agents in Majhauli Raj have not synced offline cash registers in the last 2 hours.
          </p>
        </div>

        <div className="bg-gradient-to-r from-emerald-950/60 to-slate-900 border border-emerald-500/30 p-4.5 rounded-2xl flex items-center space-x-3 text-xs text-emerald-200">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
          <p>
            <strong>Payment Reconciliation:</strong> ₹40,500 successfully released to doctor accounts for today's morning OPD slots.
          </p>
        </div>
      </div>

      {/* Block-wise Performance Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-base font-black text-white flex items-center space-x-2">
            <Building2 className="w-5 h-5 text-rose-400" />
            <span>Block-wise Operational Performance & Commission Split</span>
          </h3>
          <span className="text-xs text-slate-400 font-mono">Live District Feed</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase font-black tracking-wider">
                <th className="py-3 px-3">Block Name</th>
                <th className="py-3 px-3">Coordinator</th>
                <th className="py-3 px-3">Agents</th>
                <th className="py-3 px-3">Today's Bookings</th>
                <th className="py-3 px-3">Gross Collection</th>
                <th className="py-3 px-3">Platform Share (25%)</th>
                <th className="py-3 px-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {blockPerformance.map((bp, idx) => (
                <tr key={idx} className="hover:bg-slate-800/40 transition">
                  <td className="py-3.5 px-3 font-bold text-white text-sm">{bp.block}</td>
                  <td className="py-3.5 px-3 text-slate-300">{bp.coordinator}</td>
                  <td className="py-3.5 px-3 font-mono text-cyan-400 font-bold">{bp.agents} Field Agents</td>
                  <td className="py-3.5 px-3 font-mono font-bold text-white">{bp.todayBookings} Patients</td>
                  <td className="py-3.5 px-3 font-mono font-black text-emerald-400 text-sm">₹{bp.revenue.toLocaleString()}</td>
                  <td className="py-3.5 px-3 font-mono font-bold text-rose-300">₹{bp.commission.toLocaleString()}</td>
                  <td className="py-3.5 px-3 text-right">
                    <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                      {bp.status}
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
