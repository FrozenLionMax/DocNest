'use client';

import React from 'react';
import { DOCTORS_DIRECTORY } from '../../../lib/doctors-data';
import {
  Stethoscope,
  Star,
  MapPin,
  Clock,
  ShieldCheck,
  ToggleLeft,
  ToggleRight,
  TrendingUp,
  Percent
} from 'lucide-react';

export default function DistrictDoctorsPage() {
  return (
    <div className="p-4 md:p-8 space-y-6 max-w-6xl mx-auto w-full font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Header */}
      <div className="flex flex-wrap justify-between items-center gap-4 bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-xl">
        <div>
          <h1 className="text-xl md:text-2xl font-black text-white tracking-tight flex items-center space-x-2">
            <Stethoscope className="w-7 h-7 text-emerald-400" />
            <span>District Doctor Registry & Commission Configuration</span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">Manage consultation fee caps, platform commission percentages, and hospital affiliations</p>
        </div>

        <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-3.5 py-1.5 rounded-full">
          6 Doctors Verified
        </span>
      </div>

      {/* Doctor Directory Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase font-black tracking-wider">
                <th className="py-3 px-3">Doctor & Specialty</th>
                <th className="py-3 px-3">Clinic & Block</th>
                <th className="py-3 px-3">Consult Fee</th>
                <th className="py-3 px-3">Commission %</th>
                <th className="py-3 px-3">Rating & Patients</th>
                <th className="py-3 px-3">OPD Shifts</th>
                <th className="py-3 px-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {DOCTORS_DIRECTORY.map((doc) => (
                <tr key={doc.id} className="hover:bg-slate-800/40 transition">
                  <td className="py-4 px-3">
                    <p className="font-bold text-white text-sm">{doc.name}</p>
                    <p className="text-emerald-400 font-semibold">{doc.specialty}</p>
                    <p className="text-[11px] text-slate-400">{doc.qualifications}</p>
                  </td>
                  <td className="py-4 px-3">
                    <p className="font-semibold text-slate-200">{doc.clinicName}</p>
                    <p className="text-slate-400 text-[11px]">{doc.block} Block, {doc.district}</p>
                  </td>
                  <td className="py-4 px-3 font-mono font-black text-white text-sm">₹{doc.consultationFee}</td>
                  <td className="py-4 px-3 font-mono font-bold text-rose-300">
                    <span className="bg-rose-500/15 border border-rose-500/30 px-2 py-0.5 rounded text-[11px]">
                      {doc.platformCommission}%
                    </span>
                  </td>
                  <td className="py-4 px-3">
                    <p className="font-bold text-amber-400 flex items-center space-x-1">
                      <Star className="w-3.5 h-3.5 fill-amber-400" />
                      <span>{doc.rating}</span>
                    </p>
                    <p className="text-slate-400 text-[11px]">{doc.totalPatients.toLocaleString()} Total</p>
                  </td>
                  <td className="py-4 px-3 text-slate-400 text-[11px]">
                    <p>{doc.morningSlot}</p>
                    <p>{doc.eveningSlot}</p>
                  </td>
                  <td className="py-4 px-3 text-right">
                    <span className="inline-block text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                      Active ●
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
