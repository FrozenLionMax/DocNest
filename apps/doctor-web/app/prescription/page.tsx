'use client';

import React, { useState } from 'react';
import {
  FileText,
  Plus,
  Trash2,
  Share2,
  Printer,
  ChevronLeft,
  Search,
  CheckCircle,
  Stethoscope,
} from 'lucide-react';
import Link from 'next/link';

export default function DigitalPrescriptionBuilder() {
  const [patientName, setPatientName] = useState('Rahul Sharma');
  const [patientAge, setPatientAge] = useState('32');
  const [diagnosis, setDiagnosis] = useState('Acute Knee Joint Pain & Stiffness');

  const [medicines, setMedicines] = useState([
    { id: 1, name: 'Tab Zerodol-SP', dosage: '1-0-1 (सुबह - शाम)', duration: '5 दिन' },
    { id: 2, name: 'Tab Pan-40', dosage: '1-0-0 (खाली पेट)', duration: '7 दिन' },
    { id: 3, name: 'Sachet Cholecalciferol (60k UI)', dosage: 'दूध के साथ हफ्ते में एक बार', duration: '4 हफ्ते' },
  ]);

  const [newMedName, setNewMedName] = useState('');
  const [newMedDosage, setNewMedDosage] = useState('');
  const [newMedDuration, setNewMedDuration] = useState('');

  const handleAddMedicine = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMedName) return;
    setMedicines([
      ...medicines,
      {
        id: Date.now(),
        name: newMedName,
        dosage: newMedDosage || '1-0-1',
        duration: newMedDuration || '5 दिन',
      },
    ]);
    setNewMedName('');
    setNewMedDosage('');
    setNewMedDuration('');
  };

  const handleRemoveMedicine = (id: number) => {
    setMedicines(medicines.filter((m) => m.id !== id));
  };

  const handleWhatsAppMedicave = () => {
    const medText = medicines.map((m) => `• ${m.name} (${m.dosage})`).join('\n');
    const msg = `🧾 *DocNest डिजिटल पर्चा*\n\n*मरीज:* ${patientName} (${patientAge} वर्ष)\n*निदान (Diagnosis):* ${diagnosis}\n\n*दवाइयां (Prescribed Medicines):*\n${medText}\n\n*डॉक्टर:* Dr. Amit Kumar (Gupta Clinic, Deoria)`;
    window.open(`https://wa.me/919876543210?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-8 py-4 flex justify-between items-center shadow-sm">
        <div className="flex items-center space-x-4">
          <Link href="/dashboard" className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100">
            <ChevronLeft className="w-6 h-6" />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-slate-900">डिजिटल पर्चा जनरेटर (Digital Prescription)</h1>
            <p className="text-xs text-slate-500">Gupta Clinic & Joint Care Center — Deoria Sadar</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={handleWhatsAppMedicave}
            className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl flex items-center space-x-2 shadow transition"
          >
            <Share2 className="w-4 h-4" />
            <span>व्हाट्सएप पर्चा भेजें (Medicave Store)</span>
          </button>
        </div>
      </header>

      <main className="flex-1 p-8 max-w-5xl mx-auto w-full space-y-6">
        {/* PATIENT BASIC INFO CARD */}
        <section className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-slate-900 flex items-center space-x-2">
            <Stethoscope className="w-5 h-5 text-emerald-600" />
            <span>मरीज की जानकारी (Patient Details)</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">मरीज का नाम *</label>
              <input
                type="text"
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">उम्र (Age)</label>
              <input
                type="text"
                value={patientAge}
                onChange={(e) => setPatientAge(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">बीमारी / लक्षण (Diagnosis)</label>
              <input
                type="text"
                value={diagnosis}
                onChange={(e) => setDiagnosis(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>
        </section>

        {/* PRESCRIPTION MEDICINES BUILDER */}
        <section className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-base font-bold text-slate-900 flex items-center space-x-2">
              <FileText className="w-5 h-5 text-emerald-600" />
              <span>दवाइयों की सूची (Prescribed Medicines Rx)</span>
            </h2>
            <span className="text-xs bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full font-semibold border border-emerald-200">
              Rx {medicines.length} दवाएं
            </span>
          </div>

          {/* Add Medicine Form */}
          <form onSubmit={handleAddMedicine} className="grid grid-cols-1 md:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div className="md:col-span-2">
              <input
                type="text"
                placeholder="दवाई का नाम (उदा. Tab Zerodol-SP)"
                value={newMedName}
                onChange={(e) => setNewMedName(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <input
                type="text"
                placeholder="खुराक (उदा. 1-0-1)"
                value={newMedDosage}
                onChange={(e) => setNewMedDosage(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <button
                type="submit"
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 rounded-xl text-sm shadow transition"
              >
                + जोड़ें (Add Rx)
              </button>
            </div>
          </form>

          {/* Medicines List Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-xs font-semibold text-slate-400 uppercase">
                  <th className="py-2.5 px-4">क्र.सं.</th>
                  <th className="py-2.5 px-4">दवाई का नाम</th>
                  <th className="py-2.5 px-4">खुराक (Dosage)</th>
                  <th className="py-2.5 px-4">अवधि (Duration)</th>
                  <th className="py-2.5 px-4 text-right">हटाएं</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {medicines.map((m, idx) => (
                  <tr key={m.id} className="hover:bg-slate-50">
                    <td className="py-3 px-4 font-bold text-slate-400">#{idx + 1}</td>
                    <td className="py-3 px-4 font-semibold text-slate-900">{m.name}</td>
                    <td className="py-3 px-4 text-emerald-700 font-medium">{m.dosage}</td>
                    <td className="py-3 px-4 text-slate-500">{m.duration}</td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => handleRemoveMedicine(m.id)}
                        className="text-slate-400 hover:text-red-600 p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* PRINT / SEND ACTIONS */}
        <div className="flex justify-end space-x-4">
          <button
            onClick={handleWhatsAppMedicave}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-3 rounded-xl text-sm shadow-md flex items-center space-x-2 transition"
          >
            <Share2 className="w-4 h-4" />
            <span>Medicave फार्मेसी व्हाट्सएप शेयर</span>
          </button>
        </div>
      </main>
    </div>
  );
}
