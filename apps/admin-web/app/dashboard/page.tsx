'use client';

import React, { useState } from 'react';
import {
  Users,
  ShieldCheck,
  Building,
  Activity,
  Pill,
  Plus,
  Search,
  CheckCircle,
  XCircle,
  BarChart3,
  LogOut,
  MapPin,
  Stethoscope,
} from 'lucide-react';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'doctors' | 'specialties' | 'orders'>('doctors');

  const [doctors, setDoctors] = useState([
    { id: '1', name: 'Dr. Amit Kumar', spec: 'Orthopedic Surgeon', clinic: 'Gupta Clinic, Station Road', phone: '+919876543210', regNo: 'UP-MC-48201', verified: true, fee: 300 },
    { id: '2', name: 'Dr. Sunita Rai', spec: 'Gynecologist & Obstetrician', clinic: 'Rai Hospital, Malviya Road', phone: '+919876543211', regNo: 'UP-MC-59302', verified: true, fee: 400 },
    { id: '3', name: 'Dr. Rajesh Verma', spec: 'General Physician', clinic: 'Verma Clinic, Civil Lines', phone: '+919876543212', regNo: 'UP-MC-31204', verified: true, fee: 250 },
    { id: '4', name: 'Dr. Manoj Tripathi', spec: 'Pediatrician (बाल रोग)', clinic: 'Children Care Center, Salempur Road', phone: '+919876543213', regNo: 'UP-MC-88401', verified: false, fee: 300 },
  ]);

  const [showAddDoctorModal, setShowAddDoctorModal] = useState(false);
  const [newDocName, setNewDocName] = useState('');
  const [newDocSpec, setNewDocSpec] = useState('General Physician');
  const [newDocClinic, setNewDocClinic] = useState('');
  const [newDocFee, setNewDocFee] = useState('300');

  const toggleVerification = (id: string) => {
    setDoctors(doctors.map((d) => (d.id === id ? { ...d, verified: !d.verified } : d)));
  };

  const handleAddDoctor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDocName) return;
    setDoctors([
      ...doctors,
      {
        id: String(doctors.length + 1),
        name: newDocName,
        spec: newDocSpec,
        clinic: newDocClinic || 'Deoria Clinic',
        phone: '+919876543299',
        regNo: `UP-MC-${Math.floor(10000 + Math.random() * 90000)}`,
        verified: true,
        fee: Number(newDocFee) || 300,
      },
    ]);
    setShowAddDoctorModal(false);
    setNewDocName('');
    setNewDocClinic('');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Navbar */}
      <header className="bg-slate-900 border-b border-slate-800 px-8 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-extrabold text-xl">
            🩺
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-white">DocNest Admin Control Panel</h1>
            <p className="text-xs text-slate-400">Deoria District Healthcare Platform Master Management</p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <span className="bg-slate-800 text-slate-300 text-xs px-3 py-1.5 rounded-lg border border-slate-700">
            📍 Deoria Master Admin
          </span>
          <button className="text-slate-400 hover:text-white p-2">
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </header>

      <main className="flex-1 p-8 max-w-7xl mx-auto w-full space-y-8">
        {/* STATS OVERVIEW CARDS */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <div className="flex justify-between items-center">
              <span className="text-xs font-semibold text-slate-400 uppercase">कुल रजिस्टर्ड मरीज</span>
              <Users className="w-5 h-5 text-emerald-400" />
            </div>
            <p className="text-3xl font-black text-white mt-2">1,248</p>
            <p className="text-xs text-emerald-400 mt-1">देवरिया जिला (+12% इस सप्ताह)</p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <div className="flex justify-between items-center">
              <span className="text-xs font-semibold text-slate-400 uppercase">कुल डॉक्टर</span>
              <Stethoscope className="w-5 h-5 text-blue-400" />
            </div>
            <p className="text-3xl font-black text-white mt-2">{doctors.length}</p>
            <p className="text-xs text-blue-400 mt-1">{doctors.filter((d) => d.verified).length} सत्यापित (Verified)</p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <div className="flex justify-between items-center">
              <span className="text-xs font-semibold text-slate-400 uppercase">आज की बुकिंग्स</span>
              <Activity className="w-5 h-5 text-purple-400" />
            </div>
            <p className="text-3xl font-black text-white mt-2">142</p>
            <p className="text-xs text-purple-400 mt-1">लाइव टोकन काउंटर एक्टिव</p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <div className="flex justify-between items-center">
              <span className="text-xs font-semibold text-slate-400 uppercase">Medicave दवा ऑर्डर</span>
              <Pill className="w-5 h-5 text-orange-400" />
            </div>
            <p className="text-3xl font-black text-white mt-2">89</p>
            <p className="text-xs text-orange-400 mt-1">व्हाट्सएप ऑर्डर ट्रांसमिशन्स</p>
          </div>
        </section>

        {/* CONTROLS HEADER & NAVIGATION */}
        <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div className="flex space-x-2">
              <button
                onClick={() => setActiveTab('doctors')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                  activeTab === 'doctors' ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                डॉक्टर प्रबंधन (Doctors)
              </button>

              <button
                onClick={() => setActiveTab('specialties')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                  activeTab === 'specialties' ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                विशेषज्ञता (15 Specialties)
              </button>
            </div>

            <button
              onClick={() => setShowAddDoctorModal(true)}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-4 py-2.5 rounded-xl text-xs flex items-center space-x-2 shadow transition"
            >
              <Plus className="w-4 h-4" />
              <span>+ नया डॉक्टर जोड़ें (Add Doctor)</span>
            </button>
          </div>

          {/* DOCTORS TABLE */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  <th className="py-3 px-4">डॉक्टर का नाम</th>
                  <th className="py-3 px-4">विशेषज्ञता</th>
                  <th className="py-3 px-4">क्लिनिक का पता</th>
                  <th className="py-3 px-4">रजिस्ट्रेशन #</th>
                  <th className="py-3 px-4">फीस</th>
                  <th className="py-3 px-4">सत्यापन (Status)</th>
                  <th className="py-3 px-4 text-right">एक्शन</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-sm">
                {doctors.map((d) => (
                  <tr key={d.id} className="hover:bg-slate-800/40 transition">
                    <td className="py-4 px-4 font-bold text-white flex items-center space-x-2">
                      <span>{d.name}</span>
                      {d.verified && <ShieldCheck className="w-4 h-4 text-emerald-400" />}
                    </td>
                    <td className="py-4 px-4 text-emerald-300 text-xs font-semibold">{d.spec}</td>
                    <td className="py-4 px-4 text-slate-300 text-xs">{d.clinic}</td>
                    <td className="py-4 px-4 text-slate-400 text-xs font-mono">{d.regNo}</td>
                    <td className="py-4 px-4 font-bold text-emerald-400">₹{d.fee}</td>
                    <td className="py-4 px-4">
                      {d.verified ? (
                        <span className="inline-flex items-center text-xs text-emerald-400 font-bold bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                          ✓ Verified Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center text-xs text-amber-400 font-bold bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/20">
                          ● Pending Review
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-4 text-right">
                      <button
                        onClick={() => toggleVerification(d.id)}
                        className={`text-xs px-3 py-1.5 rounded-lg font-bold transition ${
                          d.verified
                            ? 'bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/30'
                            : 'bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 border border-emerald-500/40'
                        }`}
                      >
                        {d.verified ? 'डीएक्टिवेट (Deactivate)' : 'सत्यापित करें (Verify)'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>

      {/* ADD DOCTOR MODAL */}
      {showAddDoctorModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 max-w-md w-full shadow-2xl space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold text-white">नया डॉक्टर पंजीकृत करें</h3>
              <button onClick={() => setShowAddDoctorModal(false)} className="text-slate-400 hover:text-white">
                ✕
              </button>
            </div>

            <form onSubmit={handleAddDoctor} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">डॉक्टर का नाम (Full Name) *</label>
                <input
                  type="text"
                  placeholder="उदा. Dr. Amit Kumar"
                  value={newDocName}
                  onChange={(e) => setNewDocName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 text-white rounded-xl text-sm focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">विशेषज्ञता (Specialty)</label>
                <input
                  type="text"
                  placeholder="Orthopedic / General Physician / Gynecologist"
                  value={newDocSpec}
                  onChange={(e) => setNewDocSpec(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 text-white rounded-xl text-sm focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">देवरिया में क्लिनिक का पता</label>
                <input
                  type="text"
                  placeholder="Station Road, Deoria Sadar"
                  value={newDocClinic}
                  onChange={(e) => setNewDocClinic(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 text-white rounded-xl text-sm focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">परामर्श फीस (Consultation Fee ₹)</label>
                <input
                  type="number"
                  placeholder="300"
                  value={newDocFee}
                  onChange={(e) => setNewDocFee(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 text-white rounded-xl text-sm focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddDoctorModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700"
                >
                  रद्द करें
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow"
                >
                  डॉक्टर जोड़ें
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
