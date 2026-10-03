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

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-1">
          <p className="text-xs text-slate-400 font-medium">Total Registered Doctors</p>
          <p className="text-3xl font-extrabold text-white">12</p>
          <span className="text-[10px] text-emerald-400 font-semibold">● All Clinics Operational</span>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-1">
          <p className="text-xs text-slate-400 font-medium">Today's OPD Patients</p>
          <p className="text-3xl font-extrabold text-emerald-400">248</p>
          <span className="text-[10px] text-slate-400">Across 8 Specialties</span>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-1">
          <p className="text-xs text-slate-400 font-medium">Today's Gross Bookings</p>
          <p className="text-3xl font-extrabold text-amber-400 font-mono">₹74,400</p>
          <span className="text-[10px] text-amber-300 font-semibold">Razorpay Online + Field Cash</span>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-1">
          <p className="text-xs text-rose-400 font-medium font-bold">DocNest Platform Net (25%)</p>
          <p className="text-3xl font-extrabold text-rose-400 font-mono">₹18,600</p>
          <span className="text-[10px] text-slate-400">Direct Company Commission</span>
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
