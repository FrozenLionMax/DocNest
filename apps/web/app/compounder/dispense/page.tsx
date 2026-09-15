'use client';

import React, { useState } from 'react';
import { Pill, CheckCircle2, Search, Printer } from 'lucide-react';

export default function CompounderDispensePage() {
  const [dispensed, setDispensed] = useState<Record<string, boolean>>({});

  const rxList = [
    { id: 'rx-1', token: 1, patient: 'Rahul Sharma', doc: 'Dr. Amit Kumar', medicines: ['Tab. Paracetamol 650mg (1-0-1)', 'Tab. Pantoprazole 40mg (1-0-0)', 'Cap. Calcium & Vit D3 (0-0-1)'] },
    { id: 'rx-2', token: 2, patient: 'Priya Singh', doc: 'Dr. Amit Kumar', medicines: ['Tab. Amoxicillin 500mg (1-0-1)', 'Tab. Cetirizine 10mg (0-0-1)'] },
  ];

  const toggleDispense = (id: string) => {
    setDispensed((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center space-x-2">
          <Pill className="w-7 h-7 text-emerald-400" />
          <span>Medicine Dispensing & Verification</span>
        </h1>
        <p className="text-xs text-slate-400">Verify doctor digital prescriptions and dispense prescribed medicines</p>
      </div>

      <div className="space-y-4">
        {rxList.map((rx) => {
          const isDone = dispensed[rx.id];
          return (
            <div key={rx.id} className={`p-6 rounded-2xl border transition ${isDone ? 'bg-slate-900/40 border-slate-800 opacity-60' : 'bg-slate-900 border-slate-800'}`}>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <span className="text-xs font-mono font-extrabold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-md">Token #{rx.token}</span>
                  <h3 className="text-lg font-bold text-white mt-2">{rx.patient}</h3>
                  <p className="text-xs text-slate-400">Prescribed by {rx.doc}</p>
                </div>
                <button
                  onClick={() => toggleDispense(rx.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 ${isDone ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow'}`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{isDone ? 'Dispensed ✓' : 'Mark as Dispensed'}</span>
                </button>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Prescribed Medicines</p>
                <ul className="space-y-1 text-sm text-slate-200">
                  {rx.medicines.map((m, idx) => (
                    <li key={idx} className="flex items-center space-x-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      <span>{m}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
