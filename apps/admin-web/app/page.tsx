'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldCheck, Lock, User, ArrowRight } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 max-w-md w-full shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <div className="w-16 h-16 bg-emerald-500/20 border border-emerald-500/30 rounded-2xl flex items-center justify-center mx-auto text-emerald-400 text-3xl">
            🩺
          </div>
          <h1 className="text-2xl font-extrabold text-white">DocNest Admin Panel</h1>
          <p className="text-xs text-slate-400">देवरिया जिला मास्टर कंट्रोल - डॉक्टर सत्यापन एवं प्लेटफार्म प्रबंधन</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">एडमिन यूजरनेम (Admin Username)</label>
            <div className="relative">
              <User className="w-5 h-5 absolute left-3 top-3 text-slate-500" />
              <input
                type="text"
                placeholder="admin@docnest.in"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-800 border border-slate-700 text-white rounded-xl text-sm focus:outline-none focus:border-emerald-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">सुरक्षा पासवर्ड (Password)</label>
            <div className="relative">
              <Lock className="w-5 h-5 absolute left-3 top-3 text-slate-500" />
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-800 border border-slate-700 text-white rounded-xl text-sm focus:outline-none focus:border-emerald-500"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3.5 rounded-xl text-sm shadow-lg flex items-center justify-center space-x-2 transition"
          >
            <span>मास्टर एडमिन पैनल में प्रवेश करें</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center text-xs text-slate-500">
          DocNest Platform © 2026 Medicave Deoria
        </div>
      </div>
    </div>
  );
}
