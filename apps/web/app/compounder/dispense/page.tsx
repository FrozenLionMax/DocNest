'use client';

import React, { useState } from 'react';
import { Pill, CheckCircle2, Search, Printer, AlertTriangle, Sparkles, Box, RefreshCw } from 'lucide-react';

interface PrescriptionItem {
  id: string;
  token: number;
  patient: string;
  phone: string;
  doc: string;
  time: string;
  medicines: Array<{ name: string; dosage: string; stock: number; reorder: boolean }>;
}

export default function CompounderDispensePage() {
  const [dispensed, setDispensed] = useState<Record<string, boolean>>({});
  const [searchQuery, setSearchQuery] = useState('');

  const rxList: PrescriptionItem[] = [
    {
      id: 'rx-1',
      token: 1,
      patient: 'Rahul Sharma (राहुल शर्मा)',
      phone: '9876543210',
      doc: 'Dr. Amit Kumar (Orthopedics)',
      time: '10:15 AM',
      medicines: [
        { name: 'Tab. Dolo 650mg (Paracetamol)', dosage: '1-0-1 (3 Days)', stock: 450, reorder: false },
        { name: 'Tab. Pantocid 40mg (Pantoprazole)', dosage: '1-0-0 (7 Days)', stock: 12, reorder: true },
        { name: 'Tab. Zerodol-SP (Aceclofenac + Serratiopeptidase)', dosage: '1-0-1 (5 Days)', stock: 210, reorder: false },
      ]
    },
    {
      id: 'rx-2',
      token: 2,
      patient: 'Priya Singh (प्रिया सिंह)',
      phone: '9812345678',
      doc: 'Dr. Amit Kumar (Orthopedics)',
      time: '10:30 AM',
      medicines: [
        { name: 'Tab. Augmentin 625mg (Amoxicillin + Clavulanate)', dosage: '1-0-1 (5 Days)', stock: 8, reorder: true },
        { name: 'Tab. Montair-LC (Montelukast + Levocetirizine)', dosage: '0-0-1 (10 Days)', stock: 180, reorder: false },
      ]
    },
    {
      id: 'rx-3',
      token: 3,
      patient: 'Amitabh Mishra (अमिताभ मिश्रा)',
      phone: '9988776655',
      doc: 'Dr. Amit Kumar (Orthopedics)',
      time: '10:45 AM',
      medicines: [
        { name: 'Tab. Telmikind 40mg (Telmisartan)', dosage: '1-0-0 (30 Days)', stock: 320, reorder: false },
        { name: 'Cap. Shelcal 500 (Calcium + Vit D3)', dosage: '0-0-1 (30 Days)', stock: 500, reorder: false },
      ]
    }
  ];

  const toggleDispense = (id: string) => {
    setDispensed((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const filteredRx = rxList.filter((r) =>
    r.patient.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.token.toString().includes(searchQuery) ||
    r.phone.includes(searchQuery)
  );

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto w-full font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Header */}
      <div className="flex flex-wrap justify-between items-center gap-4 bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-xl">
        <div>
          <h1 className="text-xl md:text-2xl font-black text-white tracking-tight flex items-center space-x-2">
            <Pill className="w-7 h-7 text-emerald-400" />
            <span>Compounder Pharmacy & Rx Dispensing</span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">Realtime doctor digital prescription verification & AI inventory stock monitoring</p>
        </div>

        <div className="flex items-center space-x-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Search token # or patient..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500 w-60"
            />
          </div>
        </div>
      </div>

      {/* AI SMART INVENTORY DEPLETION ALERTS BANNER */}
      <div className="bg-gradient-to-r from-amber-950 via-slate-900 to-amber-950 border border-amber-500/40 p-4.5 rounded-2xl flex flex-wrap items-center justify-between gap-4 text-xs text-amber-200 shadow-lg">
        <div className="flex items-center space-x-3">
          <AlertTriangle className="w-5 h-5 text-amber-400 animate-bounce flex-shrink-0" />
          <div>
            <p className="font-bold text-white flex items-center space-x-1.5">
              <span>AI Inventory Depletion Warning / स्टॉक चेतावनी</span>
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            </p>
            <p className="text-[11px] text-amber-200/80">
              Based on today's OPD prescription velocity: <span className="font-bold text-amber-300">Pantocid 40mg (12 left)</span> and <span className="font-bold text-amber-300">Augmentin 625mg (8 left)</span> will run out before evening.
            </p>
          </div>
        </div>
        <button className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-black px-4 py-2 rounded-xl text-xs shadow flex items-center space-x-1.5 transition">
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Auto-Reorder Stock</span>
        </button>
      </div>

      {/* Prescription Dispense List */}
      <div className="space-y-4">
        {filteredRx.map((rx) => {
          const isDone = dispensed[rx.id];
          return (
            <div
              key={rx.id}
              className={`p-6 rounded-3xl border transition-all shadow-xl ${
                isDone ? 'bg-slate-900/40 border-slate-800/80 opacity-65' : 'bg-slate-900 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex flex-wrap justify-between items-start gap-4 mb-4">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-mono font-black text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 rounded-lg">
                      Token #{rx.token}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">{rx.time}</span>
                  </div>
                  <h3 className="text-lg font-black text-white">{rx.patient}</h3>
                  <p className="text-xs text-slate-400">Prescribed by <span className="text-emerald-400 font-semibold">{rx.doc}</span> • Mobile: {rx.phone}</p>
                </div>

                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => toggleDispense(rx.id)}
                    className={`px-5 py-2.5 rounded-xl text-xs font-extrabold transition flex items-center space-x-2 shadow ${
                      isDone
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                        : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{isDone ? 'Dispensed ✓' : 'Mark Prescribed Medicines Dispensed'}</span>
                  </button>
                </div>
              </div>

              {/* AI Auto-Digitized Medicine Verification Table */}
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800/90 space-y-3">
                <div className="flex justify-between items-center text-xs font-extrabold text-slate-400 uppercase tracking-wider">
                  <span className="flex items-center space-x-1.5">
                    <Box className="w-4 h-4 text-emerald-400" />
                    <span>AI Digitized Dispensing Checklist ({rx.medicines.length} Items)</span>
                  </span>
                  <span className="text-emerald-400 text-[11px]">Stock Verified</span>
                </div>

                <div className="divide-y divide-slate-800/80">
                  {rx.medicines.map((m, idx) => (
                    <div key={idx} className="py-2.5 flex flex-wrap justify-between items-center text-xs gap-2">
                      <div className="flex items-center space-x-2.5">
                        <span className="w-6 h-6 rounded-full bg-slate-800 text-slate-300 font-bold text-[10px] flex items-center justify-center">
                          {idx + 1}
                        </span>
                        <div>
                          <p className="font-bold text-white text-sm">{m.name}</p>
                          <p className="text-slate-400 text-[11px]">Dosage: <span className="text-emerald-400 font-mono font-bold">{m.dosage}</span></p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3">
                        <span className={`text-[11px] font-mono px-2.5 py-1 rounded-lg border font-bold ${
                          m.reorder ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' : 'bg-slate-800 text-slate-300 border-slate-700'
                        }`}>
                          Stock: {m.stock} {m.reorder && '⚠️ Low Stock'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
