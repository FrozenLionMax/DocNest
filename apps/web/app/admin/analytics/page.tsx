'use client';

import React from 'react';
import { BarChart3, TrendingUp, Users, Calendar } from 'lucide-react';

export default function AdminAnalyticsPage() {
  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center space-x-2">
          <BarChart3 className="w-7 h-7 text-emerald-400" />
          <span>Platform Analytics & OPD Insights</span>
        </h1>
        <p className="text-xs text-slate-400">Footfall trends and consultation statistics across clinics</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-3">
          <h3 className="text-sm font-bold text-slate-300">Peak OPD Hours</h3>
          <p className="text-2xl font-extrabold text-emerald-400">10:30 AM - 12:30 PM</p>
          <p className="text-xs text-slate-400">Highest patient check-ins recorded in morning sessions.</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-3">
          <h3 className="text-sm font-bold text-slate-300">Average Consultation Time</h3>
          <p className="text-2xl font-extrabold text-purple-400">8.5 Minutes</p>
          <p className="text-xs text-slate-400">Per patient consultation turnaround.</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-3">
          <h3 className="text-sm font-bold text-slate-300">Digital Rx Adoption</h3>
          <p className="text-2xl font-extrabold text-blue-400">94.2%</p>
          <p className="text-xs text-slate-400">Prescriptions generated electronically.</p>
        </div>
      </div>
    </div>
  );
}
