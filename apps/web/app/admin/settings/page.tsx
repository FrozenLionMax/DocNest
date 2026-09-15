'use client';

import React from 'react';
import { Settings, Save, ShieldCheck } from 'lucide-react';

export default function AdminSettingsPage() {
  return (
    <div className="p-8 space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center space-x-2">
          <Settings className="w-7 h-7 text-blue-400" />
          <span>Platform Settings</span>
        </h1>
        <p className="text-xs text-slate-400">Configure global platform rules and Supabase credentials</p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">Supabase Project URL</label>
          <input
            type="text"
            readOnly
            value="https://demo-docnest.supabase.co"
            className="w-full bg-slate-800 border border-slate-700 text-slate-300 rounded-xl px-4 py-2.5 text-xs font-mono"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">Platform Region</label>
          <input
            type="text"
            readOnly
            value="Asia South (Mumbai / Deoria)"
            className="w-full bg-slate-800 border border-slate-700 text-slate-300 rounded-xl px-4 py-2.5 text-xs font-mono"
          />
        </div>
      </div>
    </div>
  );
}
