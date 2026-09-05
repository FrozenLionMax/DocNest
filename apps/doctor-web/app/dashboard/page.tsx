'use client';

import React, { useState } from 'react';
import {
  Users,
  Play,
  Pause,
  RotateCcw,
  CheckCircle,
  Plus,
  Clock,
  Phone,
  Stethoscope,
  LogOut,
  Calendar,
  ChevronRight,
  Sparkles,
} from 'lucide-react';

export default function DoctorDashboard() {
  const [currentToken, setCurrentToken] = useState(14);
  const [totalIssued, setTotalIssued] = useState(25);
  const [queueStatus, setQueueStatus] = useState<'active' | 'paused' | 'closed'>('active');
  const [offlineName, setOfflineName] = useState('');
  const [offlinePhone, setOfflinePhone] = useState('');

  const [patients, setPatients] = useState([
    { token: 14, name: 'Rahul Sharma (राहुल शर्मा)', time: '10:00 AM', status: 'In Clinic', type: 'Online Booking' },
    { token: 15, name: 'Priya Singh (प्रिया सिंह)', time: '10:15 AM', status: 'Waiting', type: 'Online Booking' },
    { token: 16, name: 'Amitabh Mishra (अमिताभ मिश्रा)', time: '10:30 AM', status: 'Waiting', type: 'Offline पर्चा' },
    { token: 17, name: 'Sunita Devi (सुनीता देवी)', time: '10:45 AM', status: 'Waiting', type: 'Offline पर्चा' },
  ]);

  const handleNextToken = () => {
    if (currentToken < totalIssued) {
      setCurrentToken((prev) => prev + 1);
    }
  };

  const handleResetQueue = () => {
    setCurrentToken(1);
  };

  const handleAddOfflinePatient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!offlineName) return;
    const newToken = totalIssued + 1;
    setTotalIssued(newToken);
    setPatients([
      ...patients,
      {
        token: newToken,
        name: `${offlineName} (${offlinePhone || 'No Phone'})`,
        time: 'Walk-in OPD',
        status: 'Waiting',
        type: 'Offline पर्चा',
      },
    ]);
    setOfflineName('');
    setOfflinePhone('');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Top Professional Navbar */}
      <header className="bg-white border-b border-slate-200 px-8 py-4 flex justify-between items-center shadow-sm">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold text-xl">
            🩺
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900">DocNest Doctor Portal</h1>
            <p className="text-xs text-slate-500">Gupta Clinic & Joint Care Center — Deoria Sadar</p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-3 py-1.5 rounded-full text-xs font-semibold flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Dr. Amit Kumar (Orthopedic)</span>
          </div>
          <button className="text-slate-400 hover:text-slate-600 p-2">
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </header>

      <main className="flex-1 p-8 max-w-7xl mx-auto w-full space-y-8">
        {/* LIVE QUEUE CONTROLLER HERO PANEL */}
        <section className="bg-gradient-to-br from-emerald-900 to-slate-900 text-white rounded-3xl p-8 shadow-xl relative overflow-hidden">
          <div className="absolute right-0 top-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
            <div>
              <div className="inline-flex items-center space-x-2 bg-emerald-500/20 text-emerald-300 px-3 py-1 rounded-full text-xs font-semibold mb-3 border border-emerald-500/30">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                <span>OPD LIVE TOKEN CONTROLLER</span>
              </div>
              <h2 className="text-3xl font-extrabold tracking-tight">क्लिनिक पर्ची / टोकन काउंटर</h2>
              <p className="text-emerald-200/80 text-sm mt-1">
                देवरिया मरीजों के मोबाइल ऐप पर यह नंबर रियल-टाइम लाइव अपडेट होगा
              </p>
            </div>

            {/* Current Token Counter */}
            <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-6 text-center min-w-[240px]">
              <p className="text-xs text-emerald-200 uppercase tracking-wider font-semibold">चालू टोकन नंबर (Now Serving)</p>
              <p className="text-6xl font-black text-emerald-400 my-1">#{currentToken}</p>
              <p className="text-xs text-slate-300">कुल जारी पर्ची: #{totalIssued}</p>
            </div>
          </div>

          {/* Controller Action Buttons */}
          <div className="mt-8 pt-6 border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center space-x-3">
              <button
                onClick={handleNextToken}
                className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold px-6 py-3.5 rounded-xl flex items-center space-x-2 shadow-lg transition active:scale-95"
              >
                <Play className="w-5 h-5 fill-slate-950" />
                <span>अगला मरीज / Next Patient</span>
              </button>

              <button
                onClick={() => setQueueStatus(queueStatus === 'active' ? 'paused' : 'active')}
                className="bg-white/10 hover:bg-white/20 text-white font-semibold px-4 py-3.5 rounded-xl flex items-center space-x-2 transition"
              >
                <Pause className="w-4 h-4" />
                <span>{queueStatus === 'active' ? 'रोकें (Pause)' : 'चालू करें (Resume)'}</span>
              </button>

              <button
                onClick={handleResetQueue}
                className="bg-white/5 hover:bg-white/10 text-slate-300 font-medium px-4 py-3.5 rounded-xl flex items-center space-x-2 transition text-xs"
              >
                <RotateCcw className="w-4 h-4" />
                <span>रीसेट (#1)</span>
              </button>
            </div>

            <div className="flex items-center space-x-2 text-sm text-slate-300">
              <span className="font-semibold text-white">स्थिति:</span>
              <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 rounded-lg text-xs font-bold border border-emerald-500/30">
                {queueStatus === 'active' ? '● OPD ACTIVE (चालू)' : 'PAUSED (रोका हुआ)'}
              </span>
            </div>
          </div>
        </section>

        {/* TWO COLUMN GRID: Walk-in Entry & Patient Table */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* OFFLINE WALK-IN TOKEN ENTRY FORM */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm h-fit">
            <h3 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
              <Plus className="w-5 h-5 text-emerald-600" />
              <span>ऑफलाइन मरीज का टोकन काटें</span>
            </h3>
            <p className="text-xs text-slate-500 mt-1 mb-4">
              क्लिनिक पर आए ऑफलाइन मरीजों का नाम दर्ज कर नया पर्ची नंबर बनाएं
            </p>

            <form onSubmit={handleAddOfflinePatient} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">मरीज का नाम (Full Name) *</label>
                <input
                  type="text"
                  placeholder="उदा. राम सिंह"
                  value={offlineName}
                  onChange={(e) => setOfflineName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">मोबाइल नंबर (Optional)</label>
                <input
                  type="tel"
                  placeholder="9876543210"
                  value={offlinePhone}
                  onChange={(e) => setOfflinePhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-emerald-500"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl text-sm shadow transition"
              >
                + टोकन नंबर #{totalIssued + 1} जारी करें
              </button>
            </form>
          </div>

          {/* PATIENT QUEUE & APPOINTMENTS TABLE */}
          <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-lg font-bold text-slate-900">आज के मरीज (Today's Patients)</h3>
                <p className="text-xs text-slate-500">ऑनलाइन ऐप बुकिंग एवं क्लिनिक के पर्चे की लाइव लिस्ट</p>
              </div>
              <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-lg">
                कुल: {patients.length} मरीज
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    <th className="py-3 px-4">टोकन #</th>
                    <th className="py-3 px-4">मरीज का नाम</th>
                    <th className="py-3 px-4">बुकिंग प्रकार</th>
                    <th className="py-3 px-4">समय</th>
                    <th className="py-3 px-4">स्थिति</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {patients.map((p) => (
                    <tr
                      key={p.token}
                      className={p.token === currentToken ? 'bg-emerald-50/60 font-semibold' : 'hover:bg-slate-50'}
                    >
                      <td className="py-3.5 px-4 font-extrabold text-emerald-700">#{p.token}</td>
                      <td className="py-3.5 px-4 text-slate-900">{p.name}</td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-block text-xs px-2.5 py-1 rounded-md font-semibold ${
                            p.type === 'Online Booking'
                              ? 'bg-blue-50 text-blue-700 border border-blue-200'
                              : 'bg-amber-50 text-amber-700 border border-amber-200'
                          }`}
                        >
                          {p.type}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-500">{p.time}</td>
                      <td className="py-3.5 px-4">
                        {p.token === currentToken ? (
                          <span className="inline-flex items-center text-xs text-emerald-700 font-bold bg-emerald-100 px-2.5 py-1 rounded-full">
                            ● अभी अंदर हैं (In Consultation)
                          </span>
                        ) : p.token < currentToken ? (
                          <span className="text-xs text-slate-400">संपन्न (Completed)</span>
                        ) : (
                          <span className="text-xs text-slate-500">इंतज़ार (Waiting)</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
