'use client';

import React, { useState } from 'react';
import {
  UserCheck,
  Plus,
  Phone,
  MapPin,
  TrendingUp,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  ToggleLeft,
  ToggleRight
} from 'lucide-react';

export default function BlockAgentsPage() {
  const [agents, setAgents] = useState([
    { id: 'va-1', name: 'Suresh Kumar (सुरेश कुमार)', village: 'Rampur', phone: '9988776655', totalBookings: 320, totalRevenue: 96000, isActive: true },
    { id: 'va-2', name: 'Mohan Lal (मोहन लाल)', village: 'Khariya', phone: '9988776611', totalBookings: 240, totalRevenue: 72000, isActive: true },
    { id: 'va-3', name: 'Ramesh Bind (रमेश बिंद)', village: 'Nawalpur', phone: '9988776622', totalBookings: 195, totalRevenue: 58500, isActive: true },
    { id: 'va-4', name: 'Pooja Tiwari (पूजा तिवारी)', village: 'Bhatni Road', phone: '9988776633', totalBookings: 280, totalRevenue: 84000, isActive: true },
    { id: 'va-5', name: 'Dharmendra Yadav (धर्मेन्द्र यादव)', village: 'Majhauli Raj', phone: '9988776644', totalBookings: 150, totalRevenue: 45000, isActive: false },
  ]);

  const toggleStatus = (id: string) => {
    setAgents((prev) =>
      prev.map((a) => (a.id === id ? { ...a, isActive: !a.isActive } : a))
    );
  };

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-6xl mx-auto w-full font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Header */}
      <div className="flex flex-wrap justify-between items-center gap-4 bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-xl">
        <div>
          <h1 className="text-xl md:text-2xl font-black text-white tracking-tight flex items-center space-x-2">
            <UserCheck className="w-7 h-7 text-cyan-400" />
            <span>Manage Village Field Agents (ग्राम स्तरीय प्रतिनिधि)</span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">Activate or deactivate village health kiosks and offline booking operators</p>
        </div>

        <button className="bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-black px-5 py-3 rounded-2xl text-xs flex items-center space-x-2 transition shadow-lg">
          <Plus className="w-4 h-4" />
          <span>Add New Village Agent</span>
        </button>
      </div>

      {/* Agents Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {agents.map((agent) => (
          <div
            key={agent.id}
            className={`border rounded-3xl p-6 shadow-xl transition-all space-y-4 ${
              agent.isActive
                ? 'bg-slate-900/90 border-slate-800 hover:border-cyan-500/40'
                : 'bg-slate-900/40 border-slate-800/80 opacity-60'
            }`}
          >
            <div className="flex justify-between items-start">
              <div className="space-y-0.5">
                <h3 className="text-base font-black text-white">{agent.name}</h3>
                <p className="text-xs font-bold text-cyan-400 flex items-center space-x-1">
                  <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Gram: {agent.village}</span>
                </p>
                <p className="text-[11px] font-mono text-slate-400 flex items-center space-x-1">
                  <Phone className="w-3 h-3 text-slate-500" />
                  <span>{agent.phone}</span>
                </p>
              </div>

              <button
                onClick={() => toggleStatus(agent.id)}
                className={`p-1.5 rounded-xl border text-xs font-bold transition ${
                  agent.isActive
                    ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300'
                    : 'bg-rose-500/15 border-rose-500/30 text-rose-300'
                }`}
                title="Toggle Active Status"
              >
                {agent.isActive ? 'Active ●' : 'Paused ○'}
              </button>
            </div>

            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800/90 grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-[10px] font-bold text-slate-500 uppercase block">Total Bookings</span>
                <span className="font-mono font-black text-white text-base">{agent.totalBookings} Patients</span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-500 uppercase block">Cash Flow Generated</span>
                <span className="font-mono font-black text-emerald-400 text-base">₹{agent.totalRevenue.toLocaleString()}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
