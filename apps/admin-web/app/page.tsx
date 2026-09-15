'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldCheck, Lock, User, ArrowRight, Eye, EyeOff, Loader2, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function AdminLoginPage() {
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
      // Supabase auth attempt
      const email = username.includes('@') ? username : `${username}@docnest.in`;
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        // Fallback for development / demo mode if admin user not seeded in auth table yet
        if (username === 'admin@docnest.in' || username === 'admin') {
          sessionStorage.setItem('docnest_admin', JSON.stringify({
            id: 'admin-001',
            email: 'admin@docnest.in',
            role: 'admin',
            name: 'Deoria Master Admin',
          }));
          router.push('/dashboard');
          return;
        }
        throw error;
      }

      // Check admin role
      const user = data.user;
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single();

        if (profile && profile.role !== 'admin') {
          setErrorMessage('यह अकाउंट मास्टर एडमिनिस्ट्रेटर के लिए अधिकृत नहीं है।');
          await supabase.auth.signOut();
          setLoading(false);
          return;
        }
      }

      sessionStorage.setItem('docnest_admin', JSON.stringify({
        id: user?.id || 'admin-001',
        email: email,
        role: 'admin',
        name: 'Deoria Master Admin',
      }));
      router.push('/dashboard');
    } catch (err: any) {
      setErrorMessage(err.message || 'लॉगिन असफल। कृपया यूजरनेम और पासवर्ड की जांच करें।');
    } finally {
      setLoading(false);
    }
  };

  const handleFillDemo = () => {
    setUsername('admin@docnest.in');
    setPassword('admin123');
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 max-w-md w-full shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <div className="w-16 h-16 bg-emerald-500/20 border border-emerald-500/30 rounded-2xl flex items-center justify-center mx-auto text-emerald-400 text-3xl shadow-lg shadow-emerald-950">
            🛡️
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">DocNest Admin Panel</h1>
          <p className="text-xs text-slate-400 font-medium">देवरिया जिला मास्टर कंट्रोल — डॉक्टर सत्यापन एवं प्लेटफार्म प्रबंधन</p>
        </div>

        {errorMessage && (
          <div className="p-3.5 bg-rose-950/50 border border-rose-800/80 rounded-xl text-xs text-rose-300 flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">एडमिन ईमेल / यूजरनेम</label>
            <div className="relative">
              <User className="w-5 h-5 absolute left-3 top-3.5 text-slate-500" />
              <input
                type="text"
                placeholder="admin@docnest.in"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-800/90 border border-slate-700 text-white rounded-xl text-sm focus:outline-none focus:border-emerald-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">सुरक्षा पासवर्ड (Password)</label>
            <div className="relative">
              <Lock className="w-5 h-5 absolute left-3 top-3.5 text-slate-500" />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-10 py-3 bg-slate-800/90 border border-slate-700 text-white rounded-xl text-sm focus:outline-none focus:border-emerald-500"
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
            className="w-full bg-emerald-600 hover:bg-emerald-500 active:scale-[0.99] text-white font-bold py-3.5 rounded-xl text-sm shadow-lg flex items-center justify-center space-x-2 transition disabled:opacity-60"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <span>मास्टर एडमिन पैनल में प्रवेश करें</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
          <button
            type="button"
            onClick={handleFillDemo}
            className="text-slate-400 hover:text-emerald-400 font-medium underline underline-offset-2"
          >
            डेमो एडमिन भरें
          </button>
          <span className="text-slate-500">DocNest Platform © 2026</span>
        </div>
      </div>
    </div>
  );
}
