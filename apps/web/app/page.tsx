'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, User, ArrowRight, Eye, EyeOff, Loader2, AlertCircle, Stethoscope, Pill, ShieldCheck } from 'lucide-react';
import { loginWithPassword, saveSession, UserRole } from '../lib/auth';

export default function UnifiedLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setLoading(true);

    try {
      const { user, error } = await loginWithPassword(username, password);

      if (error || !user) {
        setErrorMessage(error || 'Login failed. Please check credentials.');
        setLoading(false);
        return;
      }

      saveSession(user);

      // Route based on role
      const routes: Record<UserRole, string> = {
        doctor: '/doctor/dashboard',
        compounder: '/compounder/dashboard',
        admin: '/admin/dashboard',
      };

      router.push(routes[user.role]);
    } catch (err: any) {
      setErrorMessage(err.message || 'Login failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = (role: UserRole) => {
    const demoCredentials: Record<UserRole, { username: string; password: string }> = {
      doctor: { username: 'doctor@docnest.in', password: 'doctor123' },
      compounder: { username: 'compounder@docnest.in', password: 'compounder123' },
      admin: { username: 'admin@docnest.in', password: 'admin123' },
    };
    setUsername(demoCredentials[role].username);
    setPassword(demoCredentials[role].password);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      {/* Background Gradient Accents */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 max-w-md w-full shadow-2xl space-y-6">
        {/* Logo & Title */}
        <div className="text-center space-y-3">
          <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center mx-auto text-white text-3xl shadow-lg shadow-emerald-900/50">
            🏥
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">DocNest Portal</h1>
          <p className="text-xs text-slate-400 font-medium">Doctors • Compounders • Admins — एक ही लॉगिन</p>
        </div>

        {/* Error */}
        {errorMessage && (
          <div className="p-3.5 bg-rose-950/50 border border-rose-800/80 rounded-xl text-xs text-rose-300 flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Email or Mobile Number</label>
            <div className="relative">
              <User className="w-5 h-5 absolute left-3 top-3.5 text-slate-500" />
              <input
                type="text"
                placeholder="doctor@docnest.in or 9876543210"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-800/90 border border-slate-700 text-white rounded-xl text-sm focus:outline-none focus:border-emerald-500 transition"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Password</label>
            <div className="relative">
              <Lock className="w-5 h-5 absolute left-3 top-3.5 text-slate-500" />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-10 py-3 bg-slate-800/90 border border-slate-700 text-white rounded-xl text-sm focus:outline-none focus:border-emerald-500 transition"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3.5 text-slate-500 hover:text-slate-300"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 active:scale-[0.99] text-white font-bold py-3.5 rounded-xl text-sm shadow-lg shadow-emerald-900/30 flex items-center justify-center space-x-2 transition disabled:opacity-60"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <span>Portal में प्रवेश करें (Login)</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Quick Demo Logins */}
        <div className="pt-4 border-t border-slate-800 space-y-2">
          <p className="text-xs text-slate-500 font-semibold text-center mb-3">Quick Demo Login</p>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => handleDemoLogin('doctor')}
              className="flex flex-col items-center space-y-1.5 p-3 rounded-xl bg-slate-800/60 hover:bg-emerald-500/10 border border-slate-700/60 hover:border-emerald-500/30 transition group"
            >
              <Stethoscope className="w-5 h-5 text-slate-400 group-hover:text-emerald-400" />
              <span className="text-[10px] font-semibold text-slate-400 group-hover:text-emerald-300">Doctor</span>
            </button>
            <button
              type="button"
              onClick={() => handleDemoLogin('compounder')}
              className="flex flex-col items-center space-y-1.5 p-3 rounded-xl bg-slate-800/60 hover:bg-blue-500/10 border border-slate-700/60 hover:border-blue-500/30 transition group"
            >
              <Pill className="w-5 h-5 text-slate-400 group-hover:text-blue-400" />
              <span className="text-[10px] font-semibold text-slate-400 group-hover:text-blue-300">Compounder</span>
            </button>
            <button
              type="button"
              onClick={() => handleDemoLogin('admin')}
              className="flex flex-col items-center space-y-1.5 p-3 rounded-xl bg-slate-800/60 hover:bg-purple-500/10 border border-slate-700/60 hover:border-purple-500/30 transition group"
            >
              <ShieldCheck className="w-5 h-5 text-slate-400 group-hover:text-purple-400" />
              <span className="text-[10px] font-semibold text-slate-400 group-hover:text-purple-300">Admin</span>
            </button>
          </div>
        </div>

        {/* Patient App Portal Direct Link */}
        <div className="pt-2">
          <button
            type="button"
            onClick={() => router.push('/patient')}
            className="w-full bg-slate-800/80 hover:bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 hover:text-emerald-300 font-bold py-3 rounded-xl text-xs flex items-center justify-center space-x-2 transition"
          >
            <span>📱 Open Patient App & AI Sahayak (मरीजों के लिए)</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <p className="text-center text-[10px] text-slate-600 pt-2">DocNest Healthcare Platform © 2026</p>
      </div>
    </div>
  );
}
