'use client';

import React, { useState } from 'react';
import {
  Stethoscope,
  Plus,
  CheckCircle2,
  Search,
  MapPin,
  Phone,
  Star,
  Users,
  ShieldCheck,
  X,
  Clock,
  Sparkles,
  Award,
  DollarSign
} from 'lucide-react';
import { DOCTORS_DIRECTORY, DoctorProfile } from '../../../lib/doctors-data';

export default function AdminDoctorsPage() {
  const [doctorsList, setDoctorsList] = useState<DoctorProfile[]>(DOCTORS_DIRECTORY);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('All');
  const [showAddModal, setShowAddModal] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // New Doctor Form State
  const [newDoctor, setNewDoctor] = useState({
    name: '',
    specialty: 'General Medicine & Diabetes',
    qualifications: 'M.B.B.S.',
    clinicName: '',
    clinicAddress: '',
    phone: '',
    fee: '300',
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleToggleStatus = (id: string) => {
    setDoctorsList((prev) =>
      prev.map((d) => (d.id === id ? { ...d, isActive: !d.isActive } : d))
    );
    showToast('Doctor status updated successfully');
  };

  const handleAddDoctorSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDoctor.name || !newDoctor.clinicName) return;

    const created: DoctorProfile = {
      id: `doc-${Date.now()}`,
      name: newDoctor.name.startsWith('Dr.') ? newDoctor.name : `Dr. ${newDoctor.name}`,
      specialty: newDoctor.specialty,
      qualifications: newDoctor.qualifications,
      clinicName: newDoctor.clinicName,
      clinicAddress: newDoctor.clinicAddress || 'Deoria Sadar, U.P.',
      district: 'Deoria',
      block: 'Sadar',
      consultationFee: parseInt(newDoctor.fee) || 300,
      platformCommission: 25,
      morningSlot: '10:00 AM - 02:00 PM',
      eveningSlot: '05:00 PM - 08:00 PM',
      rating: 5.0,
      totalPatients: 0,
      isActive: true,
      phone: newDoctor.phone || '9876543210',
      photoInitial: newDoctor.name.replace(/^Dr\.\s*/, '').charAt(0).toUpperCase() || 'D',
      bgGradient: 'from-teal-600 to-emerald-700',
    };

    setDoctorsList([created, ...doctorsList]);
    setShowAddModal(false);
    setNewDoctor({
      name: '',
      specialty: 'General Medicine & Diabetes',
      qualifications: 'M.B.B.S.',
      clinicName: '',
      clinicAddress: '',
      phone: '',
      fee: '300',
    });
    showToast(`Registered ${created.name} to platform!`);
  };

  const specialtiesList = ['All', ...Array.from(new Set(doctorsList.map((d) => d.specialty)))];

  const filteredDoctors = doctorsList.filter((doc) => {
    const matchesSearch =
      doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.clinicName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.phone.includes(searchQuery);
    const matchesSpecialty = selectedSpecialty === 'All' || doc.specialty === selectedSpecialty;
    return matchesSearch && matchesSpecialty;
  });

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-7xl mx-auto w-full font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-emerald-500 text-slate-950 font-black px-4 py-2.5 rounded-2xl shadow-2xl flex items-center space-x-2 animate-in fade-in slide-in-from-top-4 duration-200">
          <CheckCircle2 className="w-5 h-5" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-xl">
        <div>
          <h1 className="text-xl md:text-2xl font-black text-white flex items-center space-x-2">
            <Stethoscope className="w-7 h-7 text-purple-400" />
            <span>Doctor & Clinic Management</span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Registered medical practitioners, clinic locations, fee structures, and NMC license verification
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="w-full sm:w-auto bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-black px-5 py-3 rounded-2xl text-xs flex items-center justify-center space-x-2 shadow-lg transition active:scale-95 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>+ Add New Doctor</span>
        </button>
      </div>

      {/* Quick KPI Stat Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="glass-panel-elevated p-4 rounded-2xl border border-[rgba(196,225,230,0.14)] space-y-1">
          <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Total Doctors</p>
          <p className="text-2xl font-black text-white font-mono">{doctorsList.length}</p>
        </div>
        <div className="glass-panel-elevated p-4 rounded-2xl border border-[rgba(196,225,230,0.14)] space-y-1">
          <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Active & Available</p>
          <p className="text-2xl font-black text-emerald-400 font-mono">
            {doctorsList.filter((d) => d.isActive).length}
          </p>
        </div>
        <div className="glass-panel-elevated p-4 rounded-2xl border border-[rgba(196,225,230,0.14)] space-y-1">
          <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Specialties</p>
          <p className="text-2xl font-black text-teal-300 font-mono">{specialtiesList.length - 1}</p>
        </div>
        <div className="glass-panel-elevated p-4 rounded-2xl border border-[rgba(196,225,230,0.14)] space-y-1">
          <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Total Consultations</p>
          <p className="text-2xl font-black text-purple-300 font-mono">
            {doctorsList.reduce((acc, d) => acc + d.totalPatients, 0).toLocaleString()}
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-900/90 border border-slate-800 p-3.5 rounded-2xl shadow-md">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-500" />
          <input
            type="text"
            placeholder="Search by doctor name, specialty, clinic, or phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-800/80 border border-slate-700/80 text-white rounded-xl text-xs focus:outline-none focus:border-purple-500 transition placeholder:text-slate-500"
          />
        </div>

        <div className="flex items-center space-x-2 overflow-x-auto pb-1 sm:pb-0">
          <span className="text-[11px] text-slate-400 font-semibold whitespace-nowrap pl-1">Specialty:</span>
          <select
            value={selectedSpecialty}
            onChange={(e) => setSelectedSpecialty(e.target.value)}
            className="bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-purple-500"
          >
            {specialtiesList.map((spec) => (
              <option key={spec} value={spec}>
                {spec}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Mobile-Friendly Doctor Cards (Phone View: md:hidden) */}
      <div className="md:hidden space-y-3">
        {filteredDoctors.map((doc) => (
          <div
            key={doc.id}
            className="glass-panel-elevated p-4 rounded-3xl border border-slate-800/80 space-y-3.5 shadow-lg relative overflow-hidden"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-3">
                <div
                  className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${doc.bgGradient} text-white font-black text-lg flex items-center justify-center shadow-md`}
                >
                  {doc.photoInitial}
                </div>
                <div>
                  <h3 className="text-sm font-black text-white flex items-center space-x-1.5">
                    <span>{doc.name}</span>
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  </h3>
                  <p className="text-xs text-teal-400 font-semibold">{doc.specialty}</p>
                  <p className="text-[10px] text-slate-400">{doc.qualifications}</p>
                </div>
              </div>

              <span
                className={`text-[10px] px-2.5 py-1 rounded-full font-bold flex items-center space-x-1 ${
                  doc.isActive
                    ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                    : 'bg-rose-500/15 text-rose-300 border border-rose-500/30'
                }`}
              >
                <span>{doc.isActive ? '● Active' : '● Inactive'}</span>
              </span>
            </div>

            <div className="bg-slate-950/60 p-3 rounded-2xl border border-slate-800/60 space-y-1.5 text-xs text-slate-300">
              <div className="flex items-center space-x-1.5 text-slate-300 font-semibold">
                <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                <span className="truncate">{doc.clinicName}</span>
              </div>
              <div className="flex items-center justify-between text-[11px] pt-1 border-t border-slate-800/50">
                <span className="text-slate-400 flex items-center space-x-1">
                  <Phone className="w-3 h-3" />
                  <span>{doc.phone}</span>
                </span>
                <span className="text-emerald-400 font-black font-mono">₹{doc.consultationFee} / OPD</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center space-x-1 text-amber-400 text-xs font-bold">
                <Star className="w-3.5 h-3.5 fill-amber-400" />
                <span>{doc.rating}</span>
                <span className="text-[10px] text-slate-500 font-normal">
                  ({doc.totalPatients.toLocaleString()} patients)
                </span>
              </div>

              <button
                type="button"
                onClick={() => handleToggleStatus(doc.id)}
                className={`text-[11px] font-bold px-3 py-1.5 rounded-xl border transition ${
                  doc.isActive
                    ? 'border-rose-500/40 text-rose-400 hover:bg-rose-950/30'
                    : 'border-emerald-500/40 text-emerald-400 hover:bg-emerald-950/30'
                }`}
              >
                {doc.isActive ? 'Pause OPD' : 'Activate OPD'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop Doctor Table (Tablet/Desktop View: hidden md:table) */}
      <div className="hidden md:block bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
        <table className="w-full text-left text-sm border-collapse">
          <thead className="bg-slate-950 text-slate-400 uppercase text-xs border-b border-slate-800">
            <tr>
              <th className="py-4 px-6">Doctor Details</th>
              <th className="py-4 px-6">Specialty & Degrees</th>
              <th className="py-4 px-6">Clinic & Location</th>
              <th className="py-4 px-6">Consultation Fee</th>
              <th className="py-4 px-6">Rating & Footfall</th>
              <th className="py-4 px-6 text-right">OPD Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/80">
            {filteredDoctors.map((doc) => (
              <tr key={doc.id} className="hover:bg-slate-800/40 transition">
                <td className="py-4 px-6">
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-10 h-10 rounded-2xl bg-gradient-to-tr ${doc.bgGradient} text-white font-black flex items-center justify-center shadow`}
                    >
                      {doc.photoInitial}
                    </div>
                    <div>
                      <p className="font-extrabold text-white flex items-center space-x-1.5">
                        <span>{doc.name}</span>
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                      </p>
                      <p className="text-[11px] text-slate-400 font-mono">{doc.phone}</p>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-6">
                  <p className="text-xs font-bold text-teal-300">{doc.specialty}</p>
                  <p className="text-[11px] text-slate-400">{doc.qualifications}</p>
                </td>
                <td className="py-4 px-6">
                  <p className="text-xs font-semibold text-slate-200">{doc.clinicName}</p>
                  <p className="text-[11px] text-slate-400 truncate max-w-[220px]">{doc.clinicAddress}</p>
                </td>
                <td className="py-4 px-6">
                  <span className="font-extrabold text-emerald-400 font-mono text-sm">₹{doc.consultationFee}</span>
                  <span className="text-[10px] text-slate-500 block">Net: ₹{Math.round(doc.consultationFee * 0.75)}</span>
                </td>
                <td className="py-4 px-6">
                  <div className="flex items-center space-x-1 text-amber-400 text-xs font-bold">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    <span>{doc.rating}</span>
                  </div>
                  <span className="text-[10px] text-slate-400">{doc.totalPatients.toLocaleString()} OPD visits</span>
                </td>
                <td className="py-4 px-6 text-right">
                  <button
                    type="button"
                    onClick={() => handleToggleStatus(doc.id)}
                    className={`text-xs px-3 py-1.5 rounded-xl font-bold transition border ${
                      doc.isActive
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20'
                        : 'bg-rose-500/10 text-rose-400 border-rose-500/30 hover:bg-rose-500/20'
                    }`}
                  >
                    {doc.isActive ? 'Active' : 'Paused'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Doctor Modal Drawer */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center border-b border-slate-800 pb-4">
              <h3 className="text-lg font-black text-white flex items-center space-x-2">
                <Stethoscope className="w-5 h-5 text-purple-400" />
                <span>Onboard New Doctor / Clinic</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddDoctorSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Doctor Full Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Dr. Ramesh Chandra"
                  value={newDoctor.name}
                  onChange={(e) => setNewDoctor({ ...newDoctor, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 text-white rounded-xl text-sm focus:outline-none focus:border-purple-500"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Specialty</label>
                  <select
                    value={newDoctor.specialty}
                    onChange={(e) => setNewDoctor({ ...newDoctor, specialty: e.target.value })}
                    className="w-full px-3 py-2.5 bg-slate-800 border border-slate-700 text-white rounded-xl text-xs focus:outline-none focus:border-purple-500"
                  >
                    <option value="General Medicine & Diabetes">General Medicine</option>
                    <option value="Orthopedic Surgeon">Orthopedic Surgeon</option>
                    <option value="Pediatrician">Pediatrician</option>
                    <option value="Gynecologist & Obstetrician">Gynecologist</option>
                    <option value="Cardiologist">Cardiologist</option>
                    <option value="Dermatologist">Dermatologist</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Degrees</label>
                  <input
                    type="text"
                    placeholder="M.B.B.S., M.D."
                    value={newDoctor.qualifications}
                    onChange={(e) => setNewDoctor({ ...newDoctor, qualifications: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 text-white rounded-xl text-sm focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Clinic Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Chandra Clinic & Diagnostics"
                  value={newDoctor.clinicName}
                  onChange={(e) => setNewDoctor({ ...newDoctor, clinicName: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 text-white rounded-xl text-sm focus:outline-none focus:border-purple-500"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Consultation Fee (₹)</label>
                  <input
                    type="number"
                    value={newDoctor.fee}
                    onChange={(e) => setNewDoctor({ ...newDoctor, fee: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 text-white rounded-xl text-sm font-mono focus:outline-none focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Mobile Number</label>
                  <input
                    type="tel"
                    placeholder="9876543210"
                    maxLength={10}
                    value={newDoctor.phone}
                    onChange={(e) => setNewDoctor({ ...newDoctor, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 text-white rounded-xl text-sm font-mono focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-400 hover:text-white transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-purple-600 hover:bg-purple-500 text-white font-black px-5 py-2.5 rounded-xl text-xs shadow-lg transition active:scale-95"
                >
                  Save & Onboard Doctor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
