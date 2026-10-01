'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  User,
  ArrowRight,
  Loader2,
  AlertCircle,
  ShieldCheck,
  Building2,
  Lock,
  ChevronDown
} from 'lucide-react';
import { loginWithPassword, saveSession, UserRole } from '../lib/auth';

const ROLE_OPTIONS: { id: UserRole; label: string; placeholder: string }[] = [
  { id: 'patient', label: 'Patient / Customer (मरीज / नागरिक)', placeholder: 'Enter mobile number (e.g. 9999888877)' },
  { id: 'doctor', label: 'Doctor / Specialist (डॉक्टर)', placeholder: 'Enter doctor email or mobile' },
  { id: 'field_agent', label: 'Village Field Agent (ग्राम स्तरीय ऑपरेटर)', placeholder: 'Enter agent ID or mobile' },
  { id: 'block_coordinator', label: 'Block Coordinator (ब्लॉक समन्वयक)', placeholder: 'Enter block official ID' },
  { id: 'district_admin', label: 'District Operations Head / MD (जिला मुख्य प्रबंधक)', placeholder: 'Enter district HQ ID' },
  { id: 'compounder', label: 'Pharmacy / Compounder (फार्मेसी)', placeholder: 'Enter pharmacy ID' },
  { id: 'admin', label: 'Platform Administrator (सिस्टम एडमिन)', placeholder: 'Enter admin email' },
];

export default function UnifiedLoginPage() {
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState<UserRole>('patient');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const currentRoleOption = ROLE_OPTIONS.find((r) => r.id === selectedRole) || ROLE_OPTIONS[0];

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setLoading(true);

    try {
      // If the user left the input blank, pass their selected role directly
      const input = username.trim() || selectedRole;
      const { user, error } = await loginWithPassword(input, password);

      if (error || !user) {
        setErrorMessage(error || 'Login failed. Please verify user credentials.');
        setLoading(false);
        return;
      }

      // Enforce the chosen role if a blank or generic identifier was provided
      if (!username.trim() || (user.role === 'patient' && selectedRole !== 'patient')) {
        user.role = selectedRole;
      }

      saveSession(user);

      // Route based on user role
      const routes: Record<UserRole, string> = {
        doctor: '/doctor/dashboard',
        compounder: '/compounder/dashboard',
        admin: '/admin/dashboard',
        patient: '/patient',
        field_agent: '/agent/dashboard',
        block_coordinator: '/block/dashboard',
        district_admin: '/district/dashboard',
      };

      router.push(routes[user.role] || '/patient');
    } catch (err: any) {
      setErrorMessage(err.message || 'Login failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Background Gradient Accents */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 bg-slate-900/85 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-6 my-6">
        {/* Logo & Clean Corporate Header */}
        <div className="text-center space-y-2">
          <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center mx-auto text-white text-3xl shadow-lg shadow-emerald-900/50">
            🏥
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">DocNest Healthcare</h1>
          <p className="text-xs text-slate-400 font-medium">District OPD & Clinical Care Platform</p>
        </div>

        {/* Error Notification */}
        {errorMessage && (
          <div className="p-3.5 bg-rose-950/50 border border-rose-800/80 rounded-xl text-xs text-rose-300 flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Clean, Professional Login Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          {/* User Role Dropdown (Defaults to Patient / Customer) */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">Portal Access Role (उपयोगकर्ता प्रकार)</label>
            <div className="relative">
              <select
                value={selectedRole}
                onChange={(e) => {
                  setSelectedRole(e.target.value as UserRole);
                  setUsername('');
                }}
                className="w-full appearance-none bg-slate-800/90 border border-slate-700 text-white font-semibold rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-emerald-500 transition pr-10 cursor-pointer"
              >
                {ROLE_OPTIONS.map((opt) => (
                  <option key={opt.id} value={opt.id} className="bg-slate-900 text-white py-2">
                    {opt.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3.5 top-3.5 pointer-events-none" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">Mobile Number / User Identifier</label>
            <div className="relative">
              <User className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-500" />
              <input
                type="text"
                placeholder={currentRoleOption.placeholder}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-800/90 border border-slate-700 text-white rounded-xl text-sm focus:outline-none focus:border-emerald-500 transition placeholder:text-slate-500 font-medium"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="block text-xs font-bold text-slate-300">Security Password</label>
              <span className="text-[10px] text-slate-500">Optional for test</span>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-500" />
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-800/90 border border-slate-700 text-white rounded-xl text-sm focus:outline-none focus:border-emerald-500 transition placeholder:text-slate-600"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-600 hover:bg-emerald-500 active:scale-[0.99] text-white font-black py-3.5 rounded-xl text-sm shadow-xl shadow-emerald-950 flex items-center justify-center space-x-2 transition disabled:opacity-60 cursor-pointer pt-3"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <span>Sign In to Portal (प्रवेश करें)</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Subtle Security & Compliance Tag */}
        <div className="pt-3 border-t border-slate-800 flex items-center justify-center space-x-2 text-[11px] text-slate-500">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
          <span>256-Bit Encrypted Healthcare Architecture</span>
        </div>

        <p className="text-center text-[10px] text-slate-600">DocNest Platform • All Rights Reserved</p>
      </div>
    </div>
  );
}
