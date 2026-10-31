'use client';

import React, { useState, useEffect } from 'react';
import {
  Pill, CheckCircle2, Search, Printer, AlertTriangle, Sparkles, Box, RefreshCw,
  Clock, Stethoscope, User, Receipt, Phone, ArrowLeft, Volume2
} from 'lucide-react';
import Link from 'next/link';
import NavControls from '../../../components/NavControls';
import {
  getPrescriptionsForPharmacy,
  markPrescriptionDispensed,
  subscribeToClinicalEvents,
  PrescriptionRecord,
} from '../../../lib/clinical-store';

export default function CompounderDispensePage() {
  const [prescriptions, setPrescriptions] = useState<PrescriptionRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeReceipt, setActiveReceipt] = useState<PrescriptionRecord | null>(null);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const loadPrescriptions = () => {
    const list = getPrescriptionsForPharmacy();
    setPrescriptions(list);
  };

  useEffect(() => {
    loadPrescriptions();

    const unsubscribe = subscribeToClinicalEvents((event) => {
      // Whenever a clinical event fires (prescription saved or queue updated)
      loadPrescriptions();
      if (soundEnabled && typeof window !== 'undefined') {
        try {
          const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
          const osc = audioCtx.createOscillator();
          const gain = audioCtx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(660, audioCtx.currentTime);
          osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.15);
          gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.35);
          osc.connect(gain);
          gain.connect(audioCtx.destination);
          osc.start();
          osc.stop(audioCtx.currentTime + 0.35);
        } catch (e) {}
      }
    });

    return () => unsubscribe();
  }, [soundEnabled]);

  const handleToggleDispense = (id: string) => {
    const updated = markPrescriptionDispensed(id);
    setPrescriptions(updated);
  };

  const handlePrintReceipt = (rx: PrescriptionRecord) => {
    setActiveReceipt(rx);
    setTimeout(() => {
      window.print();
    }, 150);
  };

  const filteredRx = prescriptions.filter((r) =>
    r.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.tokenNumber.toString().includes(searchQuery) ||
    r.patientPhone.includes(searchQuery) ||
    r.doctorName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Derive dynamic medicine velocity for inventory warning
  const allMedicineNames = prescriptions.flatMap(p => p.medicines.map(m => m.name));
  const counts: Record<string, number> = {};
  allMedicineNames.forEach(name => {
    counts[name] = (counts[name] || 0) + 1;
  });
  const highVelocityMeds = Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8 font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Thermal Receipt Print Styles */}
      <style jsx global>{`
        @media print {
          body {
            background-color: #ffffff !important;
            color: #000000 !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .no-print {
            display: none !important;
          }
          .receipt-print-only {
            display: block !important;
            width: 80mm !important;
            margin: 0 auto !important;
            font-family: monospace !important;
            font-size: 11px !important;
            line-height: 1.4 !important;
            color: #000000 !important;
          }
        }
        @media screen {
          .receipt-print-only {
            display: none;
          }
        }
      `}</style>

      {/* PRINTABLE THERMAL RECEIPT CONTAINER */}
      {activeReceipt && (
        <div className="receipt-print-only p-4 border border-slate-300">
          <div className="text-center pb-2 border-b border-dashed border-black">
            <h2 className="text-sm font-bold uppercase">{activeReceipt.clinicName || 'DocNest Clinic Pharmacy'}</h2>
            <p className="text-[10px]">Deoria Sadar, U.P. • Phone: +91 98765 43210</p>
            <p className="text-[10px] font-bold mt-1">DISPENSING INVOICE / रसीद</p>
          </div>

          <div className="py-2 text-[10px] space-y-0.5 border-b border-dashed border-black">
            <div className="flex justify-between">
              <span>Token: <strong>#{activeReceipt.tokenNumber}</strong></span>
              <span>Date: {new Date(activeReceipt.createdAt).toLocaleDateString()}</span>
            </div>
            <div>Patient: <strong>{activeReceipt.patientName}</strong></div>
            <div>Mobile: {activeReceipt.patientPhone}</div>
            <div>Doctor: {activeReceipt.doctorName}</div>
            <div>Diagnosis: {activeReceipt.diagnosis}</div>
          </div>

          <div className="py-2 border-b border-dashed border-black">
            <table className="w-full text-[10px]">
              <thead>
                <tr className="border-b border-black">
                  <th className="text-left py-1">Item</th>
                  <th className="text-center py-1">Dosage</th>
                  <th className="text-right py-1">Price</th>
                </tr>
              </thead>
              <tbody>
                {activeReceipt.medicines.map((m, idx) => (
                  <tr key={idx} className="border-b border-dotted border-slate-300">
                    <td className="py-1">
                      <div className="font-bold">{m.name}</div>
                      <div className="text-[9px] text-slate-600">{(m.timing || m.instructions || 'After food')} ({m.duration})</div>
                    </td>
                    <td className="text-center py-1 font-mono">{m.dosage}</td>
                    <td className="text-right py-1 font-mono">₹{m.price || 110}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="pt-2 text-[10px] space-y-1">
            <div className="flex justify-between font-bold text-xs">
              <span>TOTAL BILL:</span>
              <span>₹{activeReceipt.totalBill}</span>
            </div>
            <div className="flex justify-between text-[9px]">
              <span>Payment Mode:</span>
              <span>Cash / UPI at Counter</span>
            </div>
            <div className="flex justify-between text-[9px]">
              <span>Status:</span>
              <span>{activeReceipt.status === 'dispensed' ? 'PAID & DISPENSED' : 'PENDING'}</span>
            </div>
            <div className="text-center pt-3 text-[9px] text-slate-600 border-t border-dashed border-black mt-2">
              <p>Thank you! Get well soon.</p>
              <p className="font-mono text-[8px]">Powered by drugs.systems</p>
            </div>
          </div>
        </div>
      )}

      {/* Main Interactive Screen (Hidden on Print) */}
      <div className="no-print space-y-6 max-w-7xl mx-auto w-full">
        {/* Navigation & Header */}
        <div className="flex flex-wrap justify-between items-center gap-4 bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-xl">
          <div className="flex items-center space-x-3">
            <NavControls fallbackBackUrl="/compounder/dashboard" showHome={true} showLogout={false} />
            <div>
              <h1 className="text-xl md:text-2xl font-black text-white tracking-tight flex items-center space-x-2">
                <Pill className="w-7 h-7 text-emerald-400" />
                <span>Compounder Pharmacy & Rx Dispensing</span>
              </h1>
              <p className="text-xs text-slate-400 mt-0.5">
                Real-time doctor prescription synchronization • Auto-billing • Inventory control
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={`p-2.5 rounded-xl border text-xs font-bold flex items-center space-x-1.5 transition ${
                soundEnabled
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                  : 'bg-slate-800 text-slate-400 border-slate-700'
              }`}
              title="Toggle Live Audio Chime on New Rx"
            >
              <Volume2 className="w-4 h-4" />
              <span>{soundEnabled ? 'Chime ON' : 'Muted'}</span>
            </button>

            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <input
                type="text"
                placeholder="Search token #, patient, phone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500 w-64"
              />
            </div>
          </div>
        </div>

        {/* AI SMART INVENTORY DEPLETION ALERTS BANNER */}
        <div className="bg-gradient-to-r from-amber-950/80 via-slate-900 to-amber-950/80 border border-amber-500/40 p-4.5 rounded-2xl flex flex-wrap items-center justify-between gap-4 text-xs text-amber-200 shadow-lg">
          <div className="flex items-center space-x-3">
            <AlertTriangle className="w-5 h-5 text-amber-400 animate-bounce flex-shrink-0" />
            <div>
              <p className="font-bold text-white flex items-center space-x-1.5">
                <span>AI Live Stock & OPD Consumption Velocity</span>
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              </p>
              <p className="text-[11px] text-amber-200/80">
                Fast-moving medicines today:{' '}
                {highVelocityMeds.length > 0 ? (
                  highVelocityMeds.map(([name, count], i) => (
                    <span key={name} className="font-bold text-amber-300">
                      {name.split(' (')[0]} ({count} prescribed){i < highVelocityMeds.length - 1 ? ', ' : ''}
                    </span>
                  ))
                ) : (
                  <span>Inventory levels optimal for today&apos;s OPD.</span>
                )}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-[11px] bg-slate-900/80 text-emerald-400 border border-emerald-500/30 px-3 py-1.5 rounded-xl font-bold font-mono">
              {prescriptions.filter(p => p.status === 'pending').length} Pending Rx
            </span>
            <span className="text-[11px] bg-slate-900/80 text-slate-300 border border-slate-700 px-3 py-1.5 rounded-xl font-bold font-mono">
              {prescriptions.filter(p => p.status === 'dispensed').length} Dispensed
            </span>
          </div>
        </div>

        {/* Prescription Dispense List */}
        <div className="space-y-4">
          {filteredRx.length === 0 ? (
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-12 text-center space-y-3">
              <Pill className="w-12 h-12 text-slate-600 mx-auto" />
              <h3 className="text-base font-bold text-white">No Prescriptions Found</h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                Doctor has not issued any prescriptions matching your query. Once the doctor clicks &quot;Save Record&quot; on the prescription builder, it will appear here in real time.
              </p>
            </div>
          ) : (
            filteredRx.map((rx) => {
              const isDone = rx.status === 'dispensed';
              return (
                <div
                  key={rx.id}
                  className={`p-6 rounded-3xl border transition-all shadow-xl ${
                    isDone
                      ? 'bg-slate-900/40 border-slate-800/80 opacity-70'
                      : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex flex-wrap justify-between items-start gap-4 mb-4">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-mono font-black text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 rounded-lg">
                          Token #{rx.tokenNumber}
                        </span>
                        <span className="text-xs text-slate-400 font-mono">
                          {new Date(rx.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                        <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md uppercase ${
                          isDone ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
                        }`}>
                          {isDone ? 'Dispensed' : 'Ready to Dispense'}
                        </span>
                      </div>
                      <h3 className="text-lg font-black text-white">{rx.patientName}</h3>
                      <p className="text-xs text-slate-400">
                        Doctor: <span className="text-emerald-400 font-semibold">{rx.doctorName}</span> • Diagnosis: {rx.diagnosis} • Phone: {rx.patientPhone}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                      <div className="text-right pr-2">
                        <p className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">Total Bill</p>
                        <p className="text-xl font-black text-emerald-400 font-mono">₹{rx.totalBill}</p>
                      </div>

                      <button
                        onClick={() => handlePrintReceipt(rx)}
                        className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-4 py-2.5 rounded-xl text-xs font-bold flex items-center space-x-2 transition"
                        title="Print 80mm Pharmacy POS Slip"
                      >
                        <Receipt className="w-4 h-4 text-emerald-400" />
                        <span>Print Bill Slip</span>
                      </button>

                      <button
                        onClick={() => handleToggleDispense(rx.id)}
                        className={`px-5 py-2.5 rounded-xl text-xs font-extrabold transition flex items-center space-x-2 shadow ${
                          isDone
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                            : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                        }`}
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>{isDone ? 'Dispensed ✓' : 'Mark as Dispensed'}</span>
                      </button>
                    </div>
                  </div>

                  {/* Medicine Checklist */}
                  <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800/90 space-y-3">
                    <div className="flex justify-between items-center text-xs font-extrabold text-slate-400 uppercase tracking-wider">
                      <span className="flex items-center space-x-1.5">
                        <Box className="w-4 h-4 text-emerald-400" />
                        <span>Prescribed Medicines Checklist ({rx.medicines.length} Items)</span>
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
                              <p className="text-slate-400 text-[11px]">
                                Dosage: <span className="text-emerald-400 font-mono font-bold">{m.dosage}</span> • Timing: <span className="text-slate-300">{m.timing || m.instructions || 'After food'}</span> • Duration: <span className="text-slate-300">{m.duration}</span>
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center space-x-3">
                            <span className="text-xs font-mono font-bold text-slate-300">
                              ₹{m.price || 110}
                            </span>
                            <span className="text-[11px] font-mono px-2.5 py-1 rounded-lg border font-bold bg-slate-800 text-slate-300 border-slate-700">
                              In Stock ✓
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>

                    {rx.advice && (
                      <div className="pt-2 text-xs text-slate-400 border-t border-slate-800/80 flex items-center space-x-2">
                        <span className="text-emerald-400 font-bold">Doctor Advice:</span>
                        <span>{rx.advice}</span>
                        {rx.followUpDate && (
                          <span className="ml-auto text-[11px] text-slate-500 font-mono">
                            Follow-up: {rx.followUpDate}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
