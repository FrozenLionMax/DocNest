'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Lock,
  User,
  ArrowRight,
  Eye,
  EyeOff,
  Loader2,
  AlertCircle,
  Stethoscope,
  Pill,
  ShieldCheck,
  UserCheck,
  Building2,
  Landmark,
  UserPlus,
  Sparkles
} from 'lucide-react';
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
        patient: '/patient',
        field_agent: '/agent/dashboard',
        block_coordinator: '/block/dashboard',
        district_admin: '/district/dashboard',
      };

      router.push(routes[user.role] || '/');
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
      patient: { username: 'patient@docnest.in', password: 'patient123' },
      field_agent: { username: 'agent@docnest.in', password: 'agent123' },
      block_coordinator: { username: 'block@docnest.in', password: 'block123' },
      district_admin: { username: 'dc@docnest.in', password: 'dc123' },
    };
    setUsername(demoCredentials[role].username);
    setPassword(demoCredentials[role].password);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Background Gradient Accents */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 bg-slate-900/85 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-xl w-full shadow-2xl space-y-6 my-6">
        {/* Logo & Title */}
        <div className="text-center space-y-2">
          <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center mx-auto text-white text-3xl shadow-lg shadow-emerald-900/50">
            🏥
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">DocNest Healthcare Network</h1>
          <p className="text-xs text-slate-400 font-medium">District Healthcare Platform • Single Unified Login</p>
        </div>

        {/* Direct Patient App Entry Button */}
        <div className="p-4 bg-gradient-to-r from-emerald-950/60 to-slate-900 border border-emerald-500/30 rounded-2xl flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-white flex items-center space-x-1.5">
              <span>Looking to Book a Doctor?</span>
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            </p>
            <p className="text-[11px] text-slate-400">Search clinics & book appointments without password</p>
          </div>
          <button
            type="button"
            onClick={() => router.push('/patient/doctors')}
            className="bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-black px-4 py-2 rounded-xl text-xs transition shadow-lg whitespace-nowrap"
          >
            Find Doctors →
          </button>
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
            <label className="block text-xs font-bold text-slate-300 mb-1">Email or Mobile Number</label>
            <div className="relative">
              <User className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-500" />
              <input
                type="text"
                placeholder="doctor@docnest.in, agent@docnest.in, or phone"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-800/90 border border-slate-700 text-white rounded-xl text-sm focus:outline-none focus:border-emerald-500 transition"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-500" />
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
                className="absolute right-3.5 top-3.5 text-slate-500 hover:text-slate-300"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-600 hover:bg-emerald-500 active:scale-[0.99] text-white font-black py-3.5 rounded-xl text-sm shadow-xl shadow-emerald-950 flex items-center justify-center space-x-2 transition disabled:opacity-60 cursor-pointer"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <span>Secure Login (पोर्टल में प्रवेश करें)</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Section 7 Quick Demo Logins Grid (Row 1 & Row 2) */}
        <div className="pt-4 border-t border-slate-800 space-y-3">
          <p className="text-xs text-slate-400 font-bold text-center">One-Click Hierarchy Demo Switcher</p>

          {/* Row 1: Doctor, Compounder, Admin */}
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => handleDemoLogin('doctor')}
              className="flex flex-col items-center space-y-1 p-2.5 rounded-xl bg-slate-800/70 hover:bg-emerald-500/10 border border-slate-700 hover:border-emerald-500/30 transition group"
            >
              <Stethoscope className="w-4 h-4 text-slate-400 group-hover:text-emerald-400" />
              <span className="text-[10px] font-bold text-slate-400 group-hover:text-emerald-300">Doctor</span>
            </button>
            <button
              type="button"
              onClick={() => handleDemoLogin('compounder')}
              className="flex flex-col items-center space-y-1 p-2.5 rounded-xl bg-slate-800/70 hover:bg-blue-500/10 border border-slate-700 hover:border-blue-500/30 transition group"
            >
              <Pill className="w-4 h-4 text-slate-400 group-hover:text-blue-400" />
              <span className="text-[10px] font-bold text-slate-400 group-hover:text-blue-300">Pharmacy</span>
            </button>
            <button
              type="button"
              onClick={() => handleDemoLogin('admin')}
              className="flex flex-col items-center space-y-1 p-2.5 rounded-xl bg-slate-800/70 hover:bg-purple-500/10 border border-slate-700 hover:border-purple-500/30 transition group"
            >
              <ShieldCheck className="w-4 h-4 text-slate-400 group-hover:text-purple-400" />
              <span className="text-[10px] font-bold text-slate-400 group-hover:text-purple-300">Admin</span>
            </button>
          </div>

          {/* Row 2: Patient, Field Agent, Block Coordinator, District Admin */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <button
              type="button"
              onClick={() => handleDemoLogin('patient')}
              className="flex flex-col items-center space-y-1 p-2.5 rounded-xl bg-slate-800/70 hover:bg-emerald-500/10 border border-slate-700 hover:border-emerald-500/30 transition group"
            >
              <User className="w-4 h-4 text-slate-400 group-hover:text-emerald-400" />
              <span className="text-[10px] font-bold text-slate-400 group-hover:text-emerald-300">Patient</span>
            </button>
            <button
              type="button"
              onClick={() => handleDemoLogin('field_agent')}
              className="flex flex-col items-center space-y-1 p-2.5 rounded-xl bg-slate-800/70 hover:bg-amber-500/10 border border-slate-700 hover:border-amber-500/30 transition group"
            >
              <UserPlus className="w-4 h-4 text-slate-400 group-hover:text-amber-400" />
              <span className="text-[10px] font-bold text-slate-400 group-hover:text-amber-300">Field Agent</span>
            </button>
            <button
              type="button"
              onClick={() => handleDemoLogin('block_coordinator')}
              className="flex flex-col items-center space-y-1 p-2.5 rounded-xl bg-slate-800/70 hover:bg-cyan-500/10 border border-slate-700 hover:border-cyan-500/30 transition group"
            >
              <Building2 className="w-4 h-4 text-slate-400 group-hover:text-cyan-400" />
              <span className="text-[10px] font-bold text-slate-400 group-hover:text-cyan-300">Block Head</span>
            </button>
            <button
              type="button"
              onClick={() => handleDemoLogin('district_admin')}
              className="flex flex-col items-center space-y-1 p-2.5 rounded-xl bg-slate-800/70 hover:bg-rose-500/10 border border-slate-700 hover:border-rose-500/30 transition group"
            >
              <Landmark className="w-4 h-4 text-slate-400 group-hover:text-rose-400" />
              <span className="text-[10px] font-bold text-slate-400 group-hover:text-rose-300">District DC</span>
            </button>
          </div>
        </div>

        <p className="text-center text-[10px] text-slate-500 pt-2">DocNest District Health Platform © 2026</p>
      </div>
    </div>
  );
}
