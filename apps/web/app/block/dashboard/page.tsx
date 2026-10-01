'use client';

import React from 'react';
import {
  Building2,
  Users,
  DollarSign,
  TrendingUp,
  Stethoscope,
  Activity,
  UserCheck,
  Calendar,
  Clock,
  ArrowUpRight
} from 'lucide-react';
import { getSession } from '../../../lib/auth';

export default function BlockDashboardPage() {
  const session = getSession();
  const blockName = session?.block || 'Salempur';

  const villageAgents = [
    { id: 'va-1', name: 'Suresh Kumar', village: 'Rampur', phone: '9988776655', todayBookings: 12, collection: 3600, status: 'Active ●' },
    { id: 'va-2', name: 'Mohan Lal', village: 'Khariya', phone: '9988776611', todayBookings: 8, collection: 2400, status: 'Active ●' },
    { id: 'va-3', name: 'Ramesh Bind', village: 'Nawalpur', phone: '9988776622', todayBookings: 9, collection: 2700, status: 'Active ●' },
    { id: 'va-4', name: 'Pooja Tiwari', village: 'Bhatni Road', phone: '9988776633', todayBookings: 11, collection: 3300, status: 'Active ●' },
    { id: 'va-5', name: 'Dharmendra Yadav', village: 'Majhauli Raj', phone: '9988776644', todayBookings: 5, collection: 1500, status: 'Offline ○' },
  ];

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-6xl mx-auto w-full font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Header */}
      <div className="flex flex-wrap justify-between items-center gap-4 bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-xl">
        <div>
          <div className="inline-flex items-center space-x-2 bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 px-3 py-1 rounded-full text-xs font-bold mb-2">
            <span>🏢 BLOCK LEVEL COORDINATOR / ब्लॉक समन्वयक</span>
          </div>
          <h1 className="text-xl md:text-2xl font-black text-white tracking-tight">
            {blockName} Block Operations Hub — Deoria District
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Coordinator: <strong className="text-white">{session?.name || 'Vijay Singh'}</strong> • Reporting to District Collector HQ
          </p>
        </div>

        <div className="bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 px-4 py-2 rounded-2xl text-xs font-mono font-bold">
          All Villages Synchronized
        </div>
      </div>

      {/* Top 4 Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-2">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Village Agents</span>
          <p className="text-3xl font-black font-mono text-cyan-400">8 Agents</p>
          <span className="text-[11px] text-slate-400">4 Active in field right now</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-2">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Today's Bookings</span>
          <p className="text-3xl font-black font-mono text-emerald-400">45 Patients</p>
          <span className="text-[11px] text-emerald-300 font-semibold flex items-center space-x-1">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>+18% compared to yesterday</span>
          </span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-2">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Today's Cash Flow</span>
          <p className="text-3xl font-black font-mono text-amber-400">₹13,500</p>
          <span className="text-[11px] text-slate-400">Collected across 5 villages</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-2">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Active Clinics</span>
          <p className="text-3xl font-black font-mono text-purple-400">3 OPDs</p>
          <span className="text-[11px] text-slate-400">Serving {blockName} block</span>
        </div>
      </div>

      {/* Village Agents Activity Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-base font-black text-white flex items-center space-x-2">
            <UserCheck className="w-5 h-5 text-cyan-400" />
            <span>Village Agent Daily Performance & Cash Collection</span>
          </h3>
          <span className="text-xs text-slate-400 font-mono">Live Sync</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase font-black tracking-wider">
                <th className="py-3 px-3">Field Agent</th>
                <th className="py-3 px-3">Assigned Village</th>
                <th className="py-3 px-3">Mobile</th>
                <th className="py-3 px-3">Today's Bookings</th>
                <th className="py-3 px-3">Cash Collected</th>
                <th className="py-3 px-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {villageAgents.map((agent) => (
                <tr key={agent.id} className="hover:bg-slate-800/40 transition">
                  <td className="py-3.5 px-3 font-bold text-white">{agent.name}</td>
                  <td className="py-3.5 px-3 text-cyan-300 font-semibold">{agent.village}</td>
                  <td className="py-3.5 px-3 font-mono text-slate-400">{agent.phone}</td>
                  <td className="py-3.5 px-3 font-mono font-bold text-emerald-400">{agent.todayBookings} Bookings</td>
                  <td className="py-3.5 px-3 font-mono font-black text-white">₹{agent.collection.toLocaleString()}</td>
                  <td className="py-3.5 px-3 text-right">
                    <span className={`inline-block text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${
                      agent.status.includes('Active')
                        ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                        : 'bg-slate-800 text-slate-400 border-slate-700'
                    }`}>
                      {agent.status}
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
