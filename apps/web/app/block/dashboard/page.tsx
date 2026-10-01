'use client';

import React, { useState } from 'react';
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
  ArrowUpRight,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Download
} from 'lucide-react';
import { getSession } from '../../../lib/auth';

interface VillageAgentItem {
  id: string;
  name: string;
  village: string;
  phone: string;
  todayBookings: number;
  collection: number;
  reconciliationStatus: 'reconciled' | 'pending_handover';
}

export default function BlockDashboardPage() {
  const session = getSession();
  const blockName = session?.block || 'Salempur';

  const [villageAgents, setVillageAgents] = useState<VillageAgentItem[]>([
    { id: 'va-1', name: 'Suresh Kumar', village: 'Rampur', phone: '9988776655', todayBookings: 12, collection: 3600, reconciliationStatus: 'pending_handover' },
    { id: 'va-2', name: 'Mohan Lal', village: 'Khariya', phone: '9988776611', todayBookings: 8, collection: 2400, reconciliationStatus: 'pending_handover' },
    { id: 'va-3', name: 'Ramesh Bind', village: 'Nawalpur', phone: '9988776622', todayBookings: 9, collection: 2700, reconciliationStatus: 'reconciled' },
    { id: 'va-4', name: 'Pooja Tiwari', village: 'Bhatni Road', phone: '9988776633', todayBookings: 11, collection: 3300, reconciliationStatus: 'pending_handover' },
    { id: 'va-5', name: 'Dharmendra Yadav', village: 'Majhauli Raj', phone: '9988776644', todayBookings: 5, collection: 1500, reconciliationStatus: 'reconciled' },
  ]);

  const [successMsg, setSuccessMsg] = useState('');

  const totalCollected = villageAgents.reduce((sum, a) => sum + a.collection, 0);
  const totalReconciled = villageAgents.filter(a => a.reconciliationStatus === 'reconciled').reduce((sum, a) => sum + a.collection, 0);
  const pendingHandover = totalCollected - totalReconciled;

  const handleAcknowledgeCash = (agentId: string, agentName: string, amount: number) => {
    setVillageAgents(prev => prev.map(a => a.id === agentId ? { ...a, reconciliationStatus: 'reconciled' } : a));
    setSuccessMsg(`✓ Cash Handover Confirmed: Received ₹${amount.toLocaleString()} in physical cash from ${agentName}. Deposited to Block Ledger.`);
    setTimeout(() => setSuccessMsg(''), 4500);
  };

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
            Coordinator: <strong className="text-white">{session?.name || 'Vijay Singh'}</strong> • Field Agent Oversight & Cash Reconciliation
          </p>
        </div>

        <div className="bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 px-4 py-2 rounded-2xl text-xs font-mono font-bold flex items-center space-x-1.5">
          <ShieldCheck className="w-4 h-4" />
          <span>Village Cash Audited</span>
        </div>
      </div>

      {/* Success Alert Banner */}
      {successMsg && (
        <div className="p-4 bg-emerald-500/15 border border-emerald-500/30 rounded-2xl text-xs text-emerald-300 font-bold flex items-center space-x-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Top 4 Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-2">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Village Agents</span>
          <p className="text-3xl font-black font-mono text-cyan-400">{villageAgents.length} Agents</p>
          <span className="text-[11px] text-slate-400">Active in {blockName} villages</span>
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
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Total Field Cash</span>
          <p className="text-3xl font-black font-mono text-amber-400">₹{totalCollected.toLocaleString()}</p>
          <span className="text-[11px] text-slate-400">Total collected today</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-2">
          <span className="text-xs font-bold text-rose-400 uppercase tracking-wider block">Pending Handover</span>
          <p className="text-3xl font-black font-mono text-rose-400">₹{pendingHandover.toLocaleString()}</p>
          <span className="text-[11px] text-slate-400">Awaiting agent deposit</span>
        </div>
      </div>

      {/* Village Agent Cash Reconciliation Workflow Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
        <div className="flex flex-wrap justify-between items-center gap-3">
          <div>
            <h3 className="text-base font-black text-white flex items-center space-x-2">
              <UserCheck className="w-5 h-5 text-cyan-400" />
              <span>Village Agent Daily Cash Reconciliation Ledger</span>
            </h3>
            <p className="text-xs text-slate-400">Acknowledge physical cash handed over by village operators</p>
          </div>
          <span className="text-xs text-slate-400 font-mono">End of Day Settlement</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase font-black tracking-wider">
                <th className="py-3 px-3">Field Agent</th>
                <th className="py-3 px-3">Village Location</th>
                <th className="py-3 px-3">Contact</th>
                <th className="py-3 px-3">Bookings</th>
                <th className="py-3 px-3">Cash Collected</th>
                <th className="py-3 px-3">Reconciliation Status</th>
                <th className="py-3 px-3 text-right">Handover Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {villageAgents.map((agent) => (
                <tr key={agent.id} className="hover:bg-slate-800/40 transition">
                  <td className="py-3.5 px-3 font-bold text-white text-sm">{agent.name}</td>
                  <td className="py-3.5 px-3 text-cyan-300 font-semibold">{agent.village}</td>
                  <td className="py-3.5 px-3 font-mono text-slate-400">{agent.phone}</td>
                  <td className="py-3.5 px-3 font-mono font-bold text-emerald-400">{agent.todayBookings} Tokens</td>
                  <td className="py-3.5 px-3 font-mono font-black text-white text-sm">₹{agent.collection.toLocaleString()}</td>
                  <td className="py-3.5 px-3">
                    {agent.reconciliationStatus === 'reconciled' ? (
                      <span className="inline-flex items-center space-x-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Reconciled & Deposited</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center space-x-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30">
                        <Clock className="w-3 h-3" />
                        <span>Cash in Hand (Pending)</span>
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-3 text-right">
                    {agent.reconciliationStatus === 'pending_handover' ? (
                      <button
                        onClick={() => handleAcknowledgeCash(agent.id, agent.name, agent.collection)}
                        className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-3 py-1.5 rounded-xl text-xs transition shadow-md whitespace-nowrap active:scale-95"
                      >
                        Acknowledge ₹{agent.collection} ✓
                      </button>
                    ) : (
                      <span className="text-[11px] text-slate-500 font-semibold">Audited ✓</span>
                    )}
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
