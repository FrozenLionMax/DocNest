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
          <p className="text-xs text-slate-400 font-medium">Active Compounders</p>
          <p className="text-3xl font-extrabold text-blue-400">18</p>
          <span className="text-[10px] text-slate-400">Pharmacy Staff</span>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-1">
          <p className="text-xs text-slate-400 font-medium">System Health</p>
          <p className="text-3xl font-extrabold text-purple-400">99.9%</p>
          <span className="text-[10px] text-emerald-400 font-semibold">Supabase Realtime Sync OK</span>
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
