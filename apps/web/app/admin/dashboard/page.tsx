'use client';

import React from 'react';
import { LayoutDashboard, Users, Stethoscope, BarChart3, TrendingUp, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

export default function AdminDashboardPage() {
  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center space-x-2">
          <ShieldCheck className="w-7 h-7 text-purple-400" />
          <span>Admin Master Dashboard</span>
        </h1>
        <p className="text-xs text-slate-400">Deoria Healthcare Platform — Central Management</p>
      </div>

      {/* Item #4: Apple Health-Style Glass Stat Rings & Metric Sparklines */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Registered Doctors */}
        <div className="glass-panel-elevated rounded-3xl p-5 border border-[rgba(196,225,230,0.18)] space-y-3 relative overflow-hidden group hover:border-[#8dbcc7]/40 transition shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-[#a4ccd9] font-extrabold uppercase tracking-wider">Registered Doctors</span>
            <div className="w-8 h-8 rounded-xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-300">
              <Stethoscope className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <p className="text-3xl font-black text-white font-mono">12</p>
            <span className="text-[11px] font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-800/40 px-2 py-0.5 rounded-full">
              +2 this week
            </span>
          </div>
          {/* Progress Ring Bar & Subtext */}
          <div className="space-y-1.5 pt-1">
            <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-teal-400 to-emerald-400 rounded-full" style={{ width: '92%' }} />
            </div>
            <p className="text-[10px] text-slate-400 font-semibold flex items-center justify-between">
              <span>Operational Clinics</span>
              <span className="text-[#ebffd8]">100% active</span>
            </p>
          </div>
        </div>

        {/* Card 2: Today's OPD Patients */}
        <div className="glass-panel-elevated rounded-3xl p-5 border border-[rgba(196,225,230,0.18)] space-y-3 relative overflow-hidden group hover:border-[#8dbcc7]/40 transition shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-[#a4ccd9] font-extrabold uppercase tracking-wider">Today&apos;s OPD Queue</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-300">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <p className="text-3xl font-black text-emerald-400 font-mono">248</p>
            <span className="text-[11px] font-bold text-teal-300 bg-teal-950/60 border border-teal-800/40 px-2 py-0.5 rounded-full">
              8 Specialties
            </span>
          </div>
          <div className="space-y-1.5 pt-1">
            <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-emerald-400 to-[#ebffd8] rounded-full" style={{ width: '78%' }} />
            </div>
            <p className="text-[10px] text-slate-400 font-semibold flex items-center justify-between">
              <span>Token Clearance Pace</span>
              <span className="text-[#ebffd8]">~18 min avg</span>
            </p>
          </div>
        </div>

        {/* Card 3: Today's Gross Bookings */}
        <div className="glass-panel-elevated rounded-3xl p-5 border border-[rgba(196,225,230,0.18)] space-y-3 relative overflow-hidden group hover:border-[#8dbcc7]/40 transition shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-[#a4ccd9] font-extrabold uppercase tracking-wider">Gross Booking</span>
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-300">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <p className="text-3xl font-black text-amber-300 font-mono">₹74,400</p>
            <span className="text-[11px] font-bold text-amber-300 bg-amber-950/60 border border-amber-800/40 px-2 py-0.5 rounded-full">
              +14.8%
            </span>
          </div>
          <div className="space-y-1.5 pt-1">
            <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-amber-400 to-orange-400 rounded-full" style={{ width: '84%' }} />
            </div>
            <p className="text-[10px] text-slate-400 font-semibold flex items-center justify-between">
              <span>Razorpay + Cash Field</span>
              <span className="text-amber-200">Reconciled</span>
            </p>
          </div>
        </div>

        {/* Card 4: Platform Net Margin */}
        <div className="glass-panel-elevated rounded-3xl p-5 border border-[rgba(196,225,230,0.18)] space-y-3 relative overflow-hidden group hover:border-[#8dbcc7]/40 transition shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-rose-300 font-extrabold uppercase tracking-wider">Platform Net (25%)</span>
            <div className="w-8 h-8 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-300">
              <BarChart3 className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <p className="text-3xl font-black text-rose-300 font-mono">₹18,600</p>
            <span className="text-[11px] font-bold text-rose-300 bg-rose-950/60 border border-rose-800/40 px-2 py-0.5 rounded-full">
              Company Net
            </span>
          </div>
          <div className="space-y-1.5 pt-1">
            <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-rose-400 to-pink-500 rounded-full" style={{ width: '65%' }} />
            </div>
            <p className="text-[10px] text-slate-400 font-semibold flex items-center justify-between">
              <span>Settlement Scheduled</span>
              <span className="text-rose-200">Daily T+1</span>
            </p>
          </div>
        </div>
      </div>

      {/* ADMIN REVENUE ANALYTICS BAR */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-emerald-950/40 border border-emerald-500/20 p-6 rounded-3xl shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-widest block">Executive Financial Overview</span>
          <h2 className="text-xl font-black text-white pt-0.5">Monthly Revenue & Settlement Breakdown</h2>
          <p className="text-xs text-slate-400 mt-1">Real-time reconciliation of online Razorpay collections, agent cash deposits & doctor settlements</p>
        </div>

        <div className="flex flex-wrap gap-4 text-xs font-mono">
          <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800">
            <span className="text-slate-400 block text-[10px] uppercase">This Month Gross</span>
            <span className="text-white font-black text-base">₹14,82,000</span>
          </div>
          <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800">
            <span className="text-slate-400 block text-[10px] uppercase">Doctor Payouts (75-80%)</span>
            <span className="text-emerald-400 font-black text-base">₹11,48,500</span>
          </div>
          <div className="bg-slate-950 p-3 rounded-2xl border border-rose-500/30">
            <span className="text-rose-400 block text-[10px] uppercase font-bold">DocNest Net Margin</span>
            <span className="text-rose-300 font-black text-base">₹3,33,500</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link href="/admin/doctors" className="bg-slate-900 hover:bg-slate-800/80 border border-slate-800 rounded-2xl p-6 transition space-y-3 group">
          <div className="w-12 h-12 bg-purple-500/20 text-purple-400 rounded-xl flex items-center justify-center text-xl group-hover:scale-105 transition">
            🩺
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Doctor Management</h3>
            <p className="text-xs text-slate-400 mt-1">Add, approve, or edit clinic doctors and schedules.</p>
          </div>
        </Link>

        <Link href="/admin/analytics" className="bg-slate-900 hover:bg-slate-800/80 border border-slate-800 rounded-2xl p-6 transition space-y-3 group">
          <div className="w-12 h-12 bg-emerald-500/20 text-emerald-400 rounded-xl flex items-center justify-center text-xl group-hover:scale-105 transition">
            📈
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">OPD Analytics</h3>
            <p className="text-xs text-slate-400 mt-1">View patient footfall, peak hours, and clinic reports.</p>
          </div>
        </Link>

        <Link href="/admin/settings" className="bg-slate-900 hover:bg-slate-800/80 border border-slate-800 rounded-2xl p-6 transition space-y-3 group">
          <div className="w-12 h-12 bg-blue-500/20 text-blue-400 rounded-xl flex items-center justify-center text-xl group-hover:scale-105 transition">
            ⚙️
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Platform Settings</h3>
            <p className="text-xs text-slate-400 mt-1">Manage database keys, SMS gateway, and system rules.</p>
          </div>
        </Link>
      </div>
    </div>
  );
}
