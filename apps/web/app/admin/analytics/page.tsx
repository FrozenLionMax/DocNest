'use client';

import React from 'react';
import { BarChart3, TrendingUp, Users, Calendar, Sparkles, AlertTriangle, ShieldCheck, DollarSign, Clock } from 'lucide-react';

export default function AdminAnalyticsPage() {
  const weeklyForecast = [
    { day: 'Mon (सोम)', expected: 145, peak: '10:30 AM - 12:30 PM', level: 'High Rush 🔥' },
    { day: 'Tue (मंगल)', expected: 95, peak: '11:00 AM - 01:00 PM', level: 'Normal' },
    { day: 'Wed (बुध)', expected: 110, peak: '10:30 AM - 12:30 PM', level: 'Moderate' },
    { day: 'Thu (गुरु)', expected: 88, peak: '11:30 AM - 01:30 PM', level: 'Normal' },
    { day: 'Fri (शुक्र)', expected: 130, peak: '10:00 AM - 12:00 PM', level: 'High Rush 🔥' },
    { day: 'Sat (शनि)', expected: 160, peak: '10:00 AM - 01:30 PM', level: 'Peak Surge ⚡' },
  ];

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto w-full font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Page Header */}
      <div className="flex flex-wrap justify-between items-center gap-4 bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-xl">
        <div>
          <h1 className="text-xl md:text-2xl font-black text-white tracking-tight flex items-center space-x-2">
            <BarChart3 className="w-7 h-7 text-emerald-400" />
            <span>AI Platform Analytics & Footfall Forecaster</span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">AI-driven predictive traffic modeling, OPD wait time analysis, and revenue anomaly auditing</p>
        </div>

        <div className="flex items-center space-x-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-3.5 py-2 rounded-2xl text-xs font-extrabold">
          <Sparkles className="w-4 h-4 animate-pulse" />
          <span>AI Model Active (Realtime Sync)</span>
        </div>
      </div>

      {/* AI REVENUE & FEE COLLECTION ANOMALY AUDITOR BANNER */}
      <div className="bg-gradient-to-r from-rose-950 via-slate-900 to-amber-950 border border-rose-500/40 p-5 rounded-3xl shadow-2xl space-y-3">
        <div className="flex items-center space-x-3">
          <AlertTriangle className="w-6 h-6 text-rose-400 flex-shrink-0 animate-bounce" />
          <div>
            <h3 className="text-sm font-black text-white flex items-center space-x-2">
              <span>AI Revenue Collection Anomaly Alert (शुल्क विसंगति जांच)</span>
              <span className="bg-rose-500 text-slate-950 px-2 py-0.5 rounded text-[10px] uppercase font-black">Audit Warning</span>
            </h3>
            <p className="text-xs text-rose-200/90 mt-0.5">
              AI Auditor detected <span className="font-bold text-amber-300">3 uncollected offline OPD tokens (Token #14, #19, #22)</span> without consultation fee logs. Total uncollected: <span className="font-mono font-bold text-emerald-300">₹1,500</span>.
            </p>
          </div>
        </div>
      </div>

      {/* Top 3 Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-3 shadow-xl">
          <div className="flex justify-between items-center text-slate-400 text-xs font-bold uppercase tracking-wider">
            <span>Peak OPD Hours</span>
            <Clock className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-3xl font-black text-emerald-400 font-mono">10:30 AM - 12:30 PM</p>
          <p className="text-xs text-slate-400">Highest patient check-ins recorded in morning sessions.</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-3 shadow-xl">
          <div className="flex justify-between items-center text-slate-400 text-xs font-bold uppercase tracking-wider">
            <span>Avg Consultation Time</span>
            <TrendingUp className="w-4 h-4 text-purple-400" />
          </div>
          <p className="text-3xl font-black text-purple-400 font-mono">6.4 Minutes</p>
          <p className="text-xs text-slate-400">Turnaround per patient boosted by digital Rx auto-complete.</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-3 shadow-xl">
          <div className="flex justify-between items-center text-slate-400 text-xs font-bold uppercase tracking-wider">
            <span>Digital Rx Adoption Rate</span>
            <ShieldCheck className="w-4 h-4 text-blue-400" />
          </div>
          <p className="text-3xl font-black text-blue-400 font-mono">98.4%</p>
          <p className="text-xs text-slate-400">Prescriptions generated electronically with WhatsApp sharing.</p>
        </div>
      </div>

      {/* AI OPD FOOTFALL FORECAST TABLE */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-black text-white flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-emerald-400" />
              <span>AI Weekly OPD Footfall & Rush Forecaster</span>
            </h3>
            <p className="text-xs text-slate-400">Predictive staffing recommendation based on historical token patterns</p>
          </div>
          <span className="text-xs bg-slate-800 text-slate-300 px-3 py-1.5 rounded-xl border border-slate-700 font-mono font-bold">
            Model Accuracy: 96.2%
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-xs font-extrabold text-slate-400 uppercase tracking-wider">
                <th className="py-3 px-4">Day (दिन)</th>
                <th className="py-3 px-4">Expected Token Volume</th>
                <th className="py-3 px-4">Predicted Peak Hours</th>
                <th className="py-3 px-4">Rush Index</th>
                <th className="py-3 px-4 text-right">AI Recommendation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 text-sm">
              {weeklyForecast.map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-800/50 transition">
                  <td className="py-3.5 px-4 font-bold text-white">{item.day}</td>
                  <td className="py-3.5 px-4 font-mono font-black text-emerald-400">~{item.expected} Patients</td>
                  <td className="py-3.5 px-4 text-xs font-mono text-slate-300">{item.peak}</td>
                  <td className="py-3.5 px-4">
                    <span className={`inline-block text-xs font-bold px-3 py-1 rounded-full border ${
                      item.level.includes('Surge') || item.level.includes('Rush')
                        ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                        : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                    }`}>
                      {item.level}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right text-xs font-medium text-slate-300">
                    {item.expected > 130 ? 'Open 2 Registration Counters' : 'Standard 1 Counter Staffing'}
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
