'use client';

import React from 'react';
import {
  Users,
  Landmark,
  Building2,
  ChevronRight,
  ShieldCheck,
  MapPin,
  Phone,
  Calendar,
  DollarSign
} from 'lucide-react';

export default function DistrictAgentsHierarchyPage() {
  const hierarchyTree = [
    {
      block: 'Deoria Sadar Block (सदर ब्लॉक)',
      coordinator: 'Vijay Singh',
      phone: '9977665544',
      agents: [
        { name: 'Suresh Kumar', village: 'Rampur', phone: '9988776655', todayBookings: 12, collection: 3600 },
        { name: 'Mohan Lal', village: 'Khariya', phone: '9988776611', todayBookings: 8, collection: 2400 },
        { name: 'Pankaj Dubey', village: 'Barhaj Road', phone: '9988776699', todayBookings: 15, collection: 4500 },
      ],
    },
    {
      block: 'Salempur Block (सलेमपुर ब्लॉक)',
      coordinator: 'Ram Kumar',
      phone: '9977665533',
      agents: [
        { name: 'Ramesh Bind', village: 'Nawalpur', phone: '9988776622', todayBookings: 9, collection: 2700 },
        { name: 'Pooja Tiwari', village: 'Bhatni Road', phone: '9988776633', todayBookings: 11, collection: 3300 },
      ],
    },
    {
      block: 'Bhatpar Rani Block (भाटपार रानी ब्लॉक)',
      coordinator: 'Anil Mishra',
      phone: '9977665522',
      agents: [
        { name: 'Dharmendra Yadav', village: 'Majhauli Raj', phone: '9988776644', todayBookings: 5, collection: 1500 },
        { name: 'Anuradha Devi', village: 'Khampar', phone: '9988776677', todayBookings: 7, collection: 2100 },
      ],
    },
  ];

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-6xl mx-auto w-full font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Header */}
      <div className="flex flex-wrap justify-between items-center gap-4 bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-xl">
        <div>
          <h1 className="text-xl md:text-2xl font-black text-white tracking-tight flex items-center space-x-2">
            <Users className="w-7 h-7 text-rose-400" />
            <span>District Operational Hierarchy Tree</span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">District Collector (Apex) ➔ Block Coordinators ➔ Village Field Agents</p>
        </div>

        <span className="text-xs font-mono font-bold text-rose-300 bg-rose-500/10 border border-rose-500/30 px-3.5 py-1.5 rounded-full">
          3-Tier Administrative Link
        </span>
      </div>

      {/* Visual Hierarchy Tree */}
      <div className="space-y-6">
        {/* Level 1: DC Apex */}
        <div className="bg-gradient-to-r from-rose-950 via-slate-900 to-rose-950 border-2 border-rose-500/50 p-6 rounded-3xl shadow-2xl flex items-center space-x-4">
          <div className="w-14 h-14 rounded-2xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-3xl">
            🏛️
          </div>
          <div>
            <span className="text-xs font-black text-rose-400 uppercase tracking-widest block">Level 1: District Apex Head</span>
            <h2 className="text-xl font-black text-white">Collector Office Deoria (District Magistrate / DC)</h2>
            <p className="text-xs text-slate-300">Oversees entire public health appointment logistics & revenue audit</p>
          </div>
        </div>

        {/* Level 2 & 3: Blocks and Village Agents */}
        <div className="space-y-4 pl-4 md:pl-8 border-l-2 border-slate-800">
          {hierarchyTree.map((blk, idx) => (
            <div key={idx} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
              {/* Block Header */}
              <div className="flex flex-wrap justify-between items-center gap-3 border-b border-slate-800 pb-3">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-xl">
                    🏢
                  </div>
                  <div>
                    <h3 className="text-base font-black text-white">{blk.block}</h3>
                    <p className="text-xs text-cyan-400 font-bold">
                      Coordinator: {blk.coordinator} • Phone: {blk.phone}
                    </p>
                  </div>
                </div>

                <span className="text-xs font-mono font-bold text-slate-400 bg-slate-950 px-3 py-1 rounded-xl border border-slate-800">
                  {blk.agents.length} Gram Agents
                </span>
              </div>

              {/* Village Agents Under This Block */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {blk.agents.map((ag, aIdx) => (
                  <div key={aIdx} className="bg-slate-950 p-4 rounded-2xl border border-slate-800/80 space-y-1.5 text-xs">
                    <div className="flex justify-between items-center">
                      <span className="font-black text-white text-sm">{ag.name}</span>
                      <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded font-bold">Gram Agent</span>
                    </div>
                    <p className="text-cyan-300 font-bold flex items-center space-x-1">
                      <MapPin className="w-3 h-3" />
                      <span>Gram: {ag.village}</span>
                    </p>
                    <p className="text-slate-400 font-mono text-[11px]">{ag.phone}</p>
                    <div className="pt-2 border-t border-slate-800 flex justify-between font-mono">
                      <span className="text-slate-400">Today: {ag.todayBookings} Bookings</span>
                      <strong className="text-emerald-400">₹{ag.collection}</strong>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
