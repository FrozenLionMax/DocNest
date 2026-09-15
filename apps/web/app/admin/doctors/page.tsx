'use client';

import React from 'react';
import { Stethoscope, Plus, CheckCircle2 } from 'lucide-react';

export default function AdminDoctorsPage() {
  const doctors = [
    { id: '1', name: 'Dr. Amit Kumar', specialty: 'Orthopedic Surgeon', clinic: 'Gupta Clinic — Deoria', status: 'Active' },
    { id: '2', name: 'Dr. Sunita Sharma', specialty: 'Pediatrician', clinic: 'Child Health Care — Deoria', status: 'Active' },
    { id: '3', name: 'Dr. R. K. Verma', specialty: 'Cardiologist', clinic: 'Heart & Vascular Care', status: 'Active' },
  ];

  return (
    <div className="p-8 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center space-x-2">
            <Stethoscope className="w-7 h-7 text-purple-400" />
            <span>Doctor Management</span>
          </h1>
          <p className="text-xs text-slate-400">Manage doctor profiles, specialties, and clinic settings</p>
        </div>
        <button className="bg-purple-600 hover:bg-purple-500 text-white font-bold px-4 py-2.5 rounded-xl text-xs flex items-center space-x-2 transition">
          <Plus className="w-4 h-4" />
          <span>+ Add New Doctor</span>
        </button>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-950 text-slate-400 uppercase text-xs">
            <tr>
              <th className="py-3 px-6">Doctor Name</th>
              <th className="py-3 px-6">Specialty</th>
              <th className="py-3 px-6">Clinic Name</th>
              <th className="py-3 px-6">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {doctors.map((doc) => (
              <tr key={doc.id} className="hover:bg-slate-800/40">
                <td className="py-4 px-6 font-bold text-white">{doc.name}</td>
                <td className="py-4 px-6 text-slate-300">{doc.specialty}</td>
                <td className="py-4 px-6 text-slate-400">{doc.clinic}</td>
                <td className="py-4 px-6">
                  <span className="inline-flex items-center space-x-1 text-xs text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full font-semibold">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{doc.status}</span>
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
