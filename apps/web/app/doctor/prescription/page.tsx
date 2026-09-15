'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { getSession } from '../../../lib/auth';
import {
  Printer, Plus, Trash2, Save, Download, Stethoscope,
  User, Calendar, Pill, CheckCircle2, FileText, ArrowLeft
} from 'lucide-react';
import Link from 'next/link';

interface RxMedicine {
  id: string;
  name: string;
  dosage: string; // e.g. 1-0-1
  duration: string; // e.g. 5 days
  timing: string; // e.g. After Food (खाना खाने के बाद)
}

export default function DigitalPrescriptionPage() {
  const searchParams = useSearchParams();
  const session = getSession();

  const [patientName, setPatientName] = useState(searchParams.get('patient') || 'Rahul Sharma');
  const [patientAgeGender, setPatientAgeGender] = useState('32 / Male');
  const [patientPhone, setPatientPhone] = useState('9876543210');
  const [tokenNumber, setTokenNumber] = useState(searchParams.get('token') || '1');
  const [vitals, setVitals] = useState({ bp: '120/80', pulse: '72 bpm', weight: '68 kg', temp: '98.6 °F' });
  const [diagnosis, setDiagnosis] = useState('Acute Lumbar Strain / LBA (कमर दर्द)');
  const [advice, setAdvice] = useState('1. 5 दिनों तक वजन न उठाएं।\n2. गर्म पानी की सिकाई करें।\n3. Review after 5 days.');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const [medicines, setMedicines] = useState<RxMedicine[]>([
    { id: 'm-1', name: 'Tab. Paracetamol 650mg', dosage: '1-0-1', duration: '5 Days', timing: 'After Food (खाने के बाद)' },
    { id: 'm-2', name: 'Tab. Pantoprazole 40mg', dosage: '1-0-0', duration: '7 Days', timing: 'Empty Stomach (खाली पेट)' },
    { id: 'm-3', name: 'Cap. Calcium & Vit D3', dosage: '0-0-1', duration: '15 Days', timing: 'After Food' },
  ]);

  const [newMed, setNewMed] = useState({ name: '', dosage: '1-0-1', duration: '5 Days', timing: 'After Food' });

  const handleAddMedicine = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMed.name) return;
    setMedicines((prev) => [
      ...prev,
      { id: `med-${Date.now()}`, ...newMed }
    ]);
    setNewMed({ name: '', dosage: '1-0-1', duration: '5 Days', timing: 'After Food' });
  };

  const handleRemoveMedicine = (id: string) => {
    setMedicines((prev) => prev.filter((m) => m.id !== id));
  };

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  const handleSaveRx = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="min-h-screen bg-slate-100 p-4 md:p-8 flex flex-col items-center">
      {/* Action Header - Hidden when printing */}
      <div className="print:hidden w-full max-w-4xl bg-slate-900 text-white p-4 rounded-2xl mb-6 flex flex-wrap items-center justify-between shadow-lg gap-4">
        <div className="flex items-center space-x-3">
          <Link href="/doctor/dashboard" className="p-2 bg-slate-800 hover:bg-slate-700 rounded-xl transition text-slate-300">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-lg font-bold flex items-center space-x-2">
              <FileText className="w-5 h-5 text-emerald-400" />
              <span>Digital Rx Creator (डिजिटल पर्चा)</span>
            </h1>
            <p className="text-xs text-slate-400">Token #{tokenNumber} — {patientName}</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={handleSaveRx}
            className="bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-slate-700 px-4 py-2 rounded-xl text-xs font-bold flex items-center space-x-2 transition"
          >
            <Save className="w-4 h-4" />
            <span>{savedSuccess ? 'Saved ✓' : 'Save Prescription'}</span>
          </button>
          <button
            onClick={handlePrint}
            className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-extrabold px-5 py-2 rounded-xl text-xs shadow-md flex items-center space-x-2 transition"
          >
            <Printer className="w-4 h-4 fill-slate-950" />
            <span>Print / PDF (प्रिंट)</span>
          </button>
        </div>
      </div>

      {/* PRINTABLE RX SHEET CONTAINER */}
      <div className="w-full max-w-4xl bg-white text-slate-900 rounded-2xl shadow-xl border border-slate-200 overflow-hidden print:shadow-none print:border-none print:rounded-none">
        {/* Printable Header */}
        <div className="p-8 bg-gradient-to-r from-emerald-900 to-slate-900 text-white print:bg-none print:text-slate-900 print:p-0 print:border-b-2 print:border-slate-800">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center text-white text-2xl print:hidden">
                  🩺
                </div>
                <h2 className="text-2xl font-black tracking-tight print:text-xl print:text-emerald-800">
                  {session?.clinic || 'Gupta Clinic & Joint Care Center'}
                </h2>
              </div>
              <p className="text-xs text-emerald-200 print:text-slate-600 font-medium">
                Deoria Sadar, Near Overbridge, Deoria, Uttar Pradesh • Contact: +91 98765 43210
              </p>
            </div>
            <div className="text-right">
              <h3 className="text-lg font-extrabold text-emerald-400 print:text-slate-900">
                {session?.name || 'Dr. Amit Kumar'}
              </h3>
              <p className="text-xs text-slate-300 print:text-slate-600">MS (Orthopedics) • Senior Consultant</p>
              <p className="text-[11px] text-emerald-300 print:text-slate-500">Reg. No: UP-MED-84920</p>
            </div>
          </div>
        </div>

        {/* Patient Bar */}
        <div className="bg-slate-50 border-y border-slate-200 px-8 py-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-xs font-semibold print:px-0">
          <div>
            <span className="text-slate-400 block uppercase text-[10px]">Patient Name</span>
            <input
              type="text"
              value={patientName}
              onChange={(e) => setPatientName(e.target.value)}
              className="bg-transparent font-bold text-slate-900 border-b border-dashed border-slate-300 focus:outline-none focus:border-emerald-500 w-full"
            />
          </div>
          <div>
            <span className="text-slate-400 block uppercase text-[10px]">Age / Gender</span>
            <input
              type="text"
              value={patientAgeGender}
              onChange={(e) => setPatientAgeGender(e.target.value)}
              className="bg-transparent text-slate-800 border-b border-dashed border-slate-300 focus:outline-none focus:border-emerald-500 w-full"
            />
          </div>
          <div>
            <span className="text-slate-400 block uppercase text-[10px]">Date & Token</span>
            <span className="font-extrabold text-emerald-700">Token #{tokenNumber} • {new Date().toLocaleDateString()}</span>
          </div>
          <div>
            <span className="text-slate-400 block uppercase text-[10px]">Mobile</span>
            <input
              type="text"
              value={patientPhone}
              onChange={(e) => setPatientPhone(e.target.value)}
              className="bg-transparent text-slate-800 border-b border-dashed border-slate-300 focus:outline-none focus:border-emerald-500 w-full font-mono"
            />
          </div>
        </div>

        {/* Vitals & Diagnosis section */}
        <div className="p-8 space-y-6">
          {/* Vitals row */}
          <div className="grid grid-cols-4 gap-4 p-3 bg-emerald-50/60 rounded-xl border border-emerald-100 text-xs">
            <div><span className="text-slate-500">BP:</span> <input type="text" value={vitals.bp} onChange={(e) => setVitals({...vitals, bp: e.target.value})} className="bg-transparent font-bold w-16 focus:outline-none" /></div>
            <div><span className="text-slate-500">Pulse:</span> <input type="text" value={vitals.pulse} onChange={(e) => setVitals({...vitals, pulse: e.target.value})} className="bg-transparent font-bold w-16 focus:outline-none" /></div>
            <div><span className="text-slate-500">Weight:</span> <input type="text" value={vitals.weight} onChange={(e) => setVitals({...vitals, weight: e.target.value})} className="bg-transparent font-bold w-16 focus:outline-none" /></div>
            <div><span className="text-slate-500">Temp:</span> <input type="text" value={vitals.temp} onChange={(e) => setVitals({...vitals, temp: e.target.value})} className="bg-transparent font-bold w-16 focus:outline-none" /></div>
          </div>

          {/* Diagnosis */}
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Clinical Diagnosis (रोग लक्षण)</label>
            <input
              type="text"
              value={diagnosis}
              onChange={(e) => setDiagnosis(e.target.value)}
              className="w-full text-sm font-bold text-slate-900 border-b border-slate-200 py-1 focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Rx Symbol */}
          <div className="text-3xl font-serif font-black text-emerald-700">Rx</div>

          {/* Medicines Table */}
          <div>
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b-2 border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-2">#</th>
                  <th className="py-2">Medicine Name (दवा का नाम)</th>
                  <th className="py-2">Dosage (खुराक)</th>
                  <th className="py-2">Duration</th>
                  <th className="py-2">Instructions</th>
                  <th className="py-2 print:hidden text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {medicines.map((m, idx) => (
                  <tr key={m.id} className="hover:bg-slate-50/50">
                    <td className="py-3 text-xs font-bold text-slate-400">{idx + 1}</td>
                    <td className="py-3 font-bold text-slate-900">{m.name}</td>
                    <td className="py-3 font-mono font-extrabold text-emerald-700">{m.dosage}</td>
                    <td className="py-3 text-xs font-medium text-slate-600">{m.duration}</td>
                    <td className="py-3 text-xs text-slate-600">{m.timing}</td>
                    <td className="py-3 print:hidden text-right">
                      <button
                        onClick={() => handleRemoveMedicine(m.id)}
                        className="p-1 text-slate-400 hover:text-rose-600 transition rounded"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Quick Add Form - Hidden in print */}
            <form onSubmit={handleAddMedicine} className="mt-4 print:hidden p-4 bg-slate-50 border border-dashed border-slate-300 rounded-xl grid grid-cols-1 md:grid-cols-5 gap-3">
              <input
                type="text"
                placeholder="Medicine name (e.g. Tab. PCM 650)"
                value={newMed.name}
                onChange={(e) => setNewMed({ ...newMed, name: e.target.value })}
                className="md:col-span-2 px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:border-emerald-500"
              />
              <input
                type="text"
                placeholder="Dosage (1-0-1)"
                value={newMed.dosage}
                onChange={(e) => setNewMed({ ...newMed, dosage: e.target.value })}
                className="px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:border-emerald-500 font-mono"
              />
              <input
                type="text"
                placeholder="Duration (5 Days)"
                value={newMed.duration}
                onChange={(e) => setNewMed({ ...newMed, duration: e.target.value })}
                className="px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:border-emerald-500"
              />
              <button
                type="submit"
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 rounded-lg text-xs transition flex items-center justify-center space-x-1"
              >
                <Plus className="w-4 h-4" />
                <span>Add Medicine</span>
              </button>
            </form>
          </div>

          {/* Advice / Instructions */}
          <div className="pt-4 border-t border-slate-200">
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Doctor Advice & Remarks (सलाह)</label>
            <textarea
              rows={3}
              value={advice}
              onChange={(e) => setAdvice(e.target.value)}
              className="w-full text-xs font-medium text-slate-800 border border-slate-200 rounded-xl p-3 focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Footer Signature & Verification QR */}
          <div className="pt-8 border-t-2 border-slate-800 flex justify-between items-end">
            <div className="text-[10px] text-slate-400 space-y-1">
              <p className="font-bold text-slate-600">DocNest Verified Digital Prescription</p>
              <p>Scan QR code on mobile app to view digitally authenticated copy.</p>
              <p className="font-mono">DocNest-Rx-ID: {`DN-2026-${tokenNumber}-9481`}</p>
            </div>
            <div className="text-center">
              <div className="font-serif italic text-lg font-bold text-emerald-900 border-b border-slate-400 pb-1 px-4">
                Dr. Amit Kumar
              </div>
              <p className="text-[10px] font-bold text-slate-500 uppercase mt-1">Doctor Signature</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
