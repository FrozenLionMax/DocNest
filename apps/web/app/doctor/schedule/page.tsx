'use client';

import React from 'react';
import { Calendar, Clock, Save } from 'lucide-react';

export default function DoctorSchedulePage() {
  return (
    <div className="p-8 space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center space-x-2">
          <Calendar className="w-7 h-7 text-emerald-400" />
          <span>OPD Schedule & Consultation Hours</span>
        </h1>
        <p className="text-xs text-slate-400">Configure clinic timings for online patient token bookings</p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Morning OPD Start Time</label>
            <input type="time" defaultValue="10:00" className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-4 py-2.5 text-sm" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Morning OPD End Time</label>
            <input type="time" defaultValue="14:00" className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-4 py-2.5 text-sm" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 pt-2">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Evening OPD Start Time</label>
            <input type="time" defaultValue="17:00" className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-4 py-2.5 text-sm" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Evening OPD End Time</label>
            <input type="time" defaultValue="20:00" className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-4 py-2.5 text-sm" />
          </div>
        </div>

        <div className="pt-4">
          <button className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-6 py-3 rounded-xl text-xs flex items-center space-x-2 transition">
            <Save className="w-4 h-4" />
            <span>Save Schedule Settings</span>
          </button>
        </div>
      </div>
    </div>
  );
}
