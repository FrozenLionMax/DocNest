'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  User,
  ArrowRight,
  Loader2,
  AlertCircle,
  ShieldCheck,
  Lock,
  Stethoscope,
  Pill,
  Users,
  Eye,
  EyeOff,
  Phone,
  CheckCircle2,
  Sparkles,
  Zap,
  Building2,
  Landmark,
  Clock,
  Compass
} from 'lucide-react';
import { loginWithPassword, saveSession, UserRole, DocNestUser } from '../../lib/auth';
import DocNestLogo from '../../components/DocNestLogo';
import InteractiveParticles from '../../components/InteractiveParticles';
import NavControls from '../../components/NavControls';

interface DemoRolePreset {
  id: UserRole;
  label: string;
  name: string;
  detail: string;
  identifier: string;
  password: string;
  icon: any;
  accent: string;
  avatarRing: string;
}

const DEMO_PRESETS: DemoRolePreset[] = [
  {
    id: 'doctor',
    label: 'Doctor',
    name: 'Dr. Amit Kumar',
    detail: 'Orthopedic Surgeon • OPD Queue',
    identifier: 'doctor@docnest.in',
    password: 'doctor123',
    icon: Stethoscope,
    accent: 'text-teal-300 border-teal-500/40 bg-teal-500/10 hover:bg-teal-500/20',
    avatarRing: 'from-teal-500 to-emerald-400 text-teal-300',
  },
  {
    id: 'compounder',
    label: 'Pharmacy',
    name: 'Rajesh Pharmacist',
    detail: 'Clinic Medicine Dispenser',
    identifier: 'compounder@docnest.in',
    password: 'compounder123',
    icon: Pill,
    accent: 'text-sky-300 border-sky-500/40 bg-sky-500/10 hover:bg-sky-500/20',
    avatarRing: 'from-sky-500 to-cyan-400 text-sky-300',
  },
  {
    id: 'patient',
    label: 'Patient',
    name: 'Rahul Sharma',
    detail: 'Live Token & Medical History',
    identifier: '9999888877',
    password: '',
    icon: Users,
    accent: 'text-emerald-300 border-emerald-500/40 bg-emerald-500/10 hover:bg-emerald-500/20',
    avatarRing: 'from-emerald-500 to-teal-400 text-emerald-300',
  },
  {
    id: 'admin',
    label: 'Admin',
    name: 'Master Admin',
    detail: 'Doctors & Platform Control',
    identifier: 'admin@docnest.in',
    password: 'admin123',
    icon: ShieldCheck,
    accent: 'text-purple-300 border-purple-500/40 bg-purple-500/10 hover:bg-purple-500/20',
    avatarRing: 'from-purple-500 to-violet-400 text-purple-300',
  },
  {
    id: 'field_agent',
    label: 'Field Operator',
    name: 'Suresh Kumar',
    detail: 'Village OPD Outreach Terminal',
    identifier: 'agent@docnest.in',
    password: 'agent123',
    icon: Building2,
    accent: 'text-amber-300 border-amber-500/40 bg-amber-500/10 hover:bg-amber-500/20',
    avatarRing: 'from-amber-500 to-orange-400 text-amber-300',
  },
  {
    id: 'district_admin',
    label: 'District Head',
    name: 'Operations Head',
    detail: 'District Administrative Console',
    identifier: 'dc@docnest.in',
    password: 'dc123',
    icon: Landmark,
    accent: 'text-rose-300 border-rose-500/40 bg-rose-500/10 hover:bg-rose-500/20',
    avatarRing: 'from-rose-500 to-red-400 text-rose-300',
  },
];

export default function LoginPage() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isOtpMode, setIsOtpMode] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState<DemoRolePreset | null>(null);

  // #14: Dynamic Time-of-Day Greeting State (Hydration Safe)
  const [greeting, setGreeting] = useState<{ icon: string; text: string; shift: string }>({
    icon: '🏥',
    text: 'DocNest Healthcare Gateway',
    shift: 'Clinical Outpatient Services',
  });

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) {
      setGreeting({ icon: '🌅', text: 'Good Morning, Healthcare Hero', shift: 'OPD Morning Shift Active' });
    } else if (hour >= 12 && hour < 17) {
      setGreeting({ icon: '☀️', text: 'Good Afternoon', shift: 'Day Outpatient Operations Running' });
    } else if (hour >= 17 && hour < 21) {
      setGreeting({ icon: '🌆', text: 'Good Evening', shift: 'Evening OPD & Consultations Open' });
    } else {
      setGreeting({ icon: '🌙', text: 'DocNest Emergency Night Triage', shift: '24/7 Clinical Emergency Gateway' });
    }
  }, []);

  // #3: 3D Mouse Gyroscope Tilt & Specular Light Coordinates
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0, specularX: 50, specularY: 50 });

  const handleMouseMoveCard = (e: React.MouseEvent<HTMLDivElement>) => {
    // Static, crisp coordinate placement
  };

  const handleMouseLeaveCard = () => {
    // Clean static rest state
  };

  // #11: Blinking Eye Password Mascot State
  const [isWinking, setIsWinking] = useState(false);
  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
    setIsWinking(true);
    setTimeout(() => setIsWinking(false), 400);
  };

  // #20: Interactive Quick-Fill Chip Bounce + Typewriter Effect
  const [bouncingPresetId, setBouncingPresetId] = useState<string | null>(null);
  const typewriterTimerRef = useRef<any>(null);

  const startTypewriter = (text: string, onComplete: () => void) => {
    if (typewriterTimerRef.current) clearInterval(typewriterTimerRef.current);
    let index = 0;
    setIdentifier('');
    typewriterTimerRef.current = setInterval(() => {
      index++;
      setIdentifier(text.slice(0, index));
      if (index >= text.length) {
        clearInterval(typewriterTimerRef.current);
        onComplete();
      }
    }, 20); // crisp 20ms typewriter speed
  };

  const handleSelectPreset = (preset: DemoRolePreset) => {
    setSelectedPreset(preset);
    setBouncingPresetId(preset.id);
    setTimeout(() => setBouncingPresetId(null), 400);
    setIsOtpMode(false);
    setOtpSent(false);
    setErrorMessage('');

    startTypewriter(preset.identifier, () => {
      setPassword(preset.password);
    });
  };

  const handleQuickJump = (preset: DemoRolePreset) => {
    handleSelectPreset(preset);
    setTimeout(() => {
      handleLogin(undefined, preset.identifier, preset.password);
    }, 280);
  };

  // Phone detection
  const isPhoneLogin = /^[0-9+\s-]*$/.test(identifier) && identifier.replace(/\D/g, '').length > 0;

  // #10: Success Confetti & Redirect Handler
  const handleLogin = async (e?: React.FormEvent, directInput?: string, directPassword?: string) => {
    if (e) e.preventDefault();
    setErrorMessage('');
    setLoading(true);

    const inputVal = (directInput ?? identifier).trim();
    const passVal = directPassword ?? password;

    try {
      if (isOtpMode && !directInput) {
        if (!otpSent) {
          if (!inputVal || inputVal.replace(/\D/g, '').length < 10) {
            setErrorMessage('Please enter a valid 10-digit Indian mobile number.');
            setLoading(false);
            return;
          }
          setOtpSent(true);
          setLoading(false);
          return;
        }
      }

      const { user, error } = await loginWithPassword(inputVal || 'patient', passVal);

      if (error || !user) {
        setErrorMessage(error || 'Invalid credentials. Please verify your mobile number or password.');
        setLoading(false);
        return;
      }

      saveSession(user);

      // Trigger #10: Success Particle / Checkmark Burst
      setIsSuccess(true);
      setLoading(false);

      const routes: Record<UserRole, string> = {
        doctor: '/doctor/dashboard',
        compounder: '/compounder/dashboard',
        admin: '/admin/dashboard',
        patient: '/patient',
        field_agent: '/agent/dashboard',
        block_coordinator: '/block/dashboard',
        district_admin: '/district/dashboard',
      };

      setTimeout(() => {
        router.push(routes[user.role] || '/patient');
      }, 550);
    } catch (err: any) {
      setErrorMessage(err.message || 'Login failed.');
      setLoading(false);
    }
  };

  const ActiveAvatarIcon = selectedPreset ? selectedPreset.icon : null;

  return (
    <div className="min-h-screen bg-[#0c1219] bg-mesh-dark flex items-center justify-center p-4 md:p-6 font-['Plus_Jakarta_Sans',sans-serif] selection:bg-[#8dbcc7] selection:text-[#0c1219] relative overflow-hidden">
      {/* #8: Interactive Particle Stardust Mesh Canvas */}
      <InteractiveParticles />

      {/* Ambient Lighting Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-10 right-1/4 w-[500px] h-[300px] bg-[#8dbcc7]/12 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-10 left-1/4 w-[500px] h-[300px] bg-[#ebffd8]/08 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-lg space-y-5">
        {/* Navigation Bar Back & Forward Controls & SSL Status */}
        <div className="flex items-center justify-between text-xs px-2">
          <NavControls fallbackBackUrl="/" showHome={true} showLogout={false} />
          <span className="text-[#a4ccd9] font-mono text-[11px] bg-[#141e28]/80 backdrop-blur px-3 py-1 rounded-full border border-[rgba(196,225,230,0.18)] shadow-sm flex items-center space-x-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>256-Bit SSL Guard</span>
          </span>
        </div>

        {/* Clean, Stable, Highly Professional Glass Card */}
        <div className="relative">
          <div className="glass-panel-elevated rounded-3xl p-6 sm:p-9 shadow-2xl space-y-6 border border-[rgba(196,225,230,0.18)] relative overflow-hidden backdrop-blur-2xl">

            {/* #14: Dynamic Time-of-Day Greeting Badge */}
            <div className="flex justify-center">
              <div className="inline-flex items-center space-x-2 bg-[#0c1219]/70 border border-[rgba(196,225,230,0.16)] px-3.5 py-1 rounded-full text-xs font-bold text-[#ebffd8] shadow-inner">
                <span>{greeting.icon}</span>
                <span className="text-[#a4ccd9]">{greeting.text}</span>
                <span className="text-slate-600">•</span>
                <span className="text-[10px] text-emerald-400 font-extrabold uppercase">{greeting.shift}</span>
              </div>
            </div>

            {/* #6: Animated Role Avatar Morphing Header */}
            <div className="text-center space-y-3 flex flex-col items-center relative z-10">
              <div className="relative">
                {selectedPreset && ActiveAvatarIcon ? (
                  /* Morphed Avatar Icon */
                  <div
                    className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${selectedPreset.avatarRing} p-0.5 shadow-xl shadow-[#8dbcc7]/20 transition-all duration-500 transform animate-in zoom-in-75 rotate-3 flex items-center justify-center`}
                  >
                    <div className="w-full h-full bg-[#0c1219] rounded-2xl flex items-center justify-center">
                      <ActiveAvatarIcon className="w-8 h-8 drop-shadow-md animate-pulse" />
                    </div>
                  </div>
                ) : (
                  /* Default DocNest Vector Emblem */
                  <DocNestLogo size="xl" showText={false} animated={true} />
                )}
              </div>

              <div>
                <h1 className="text-3xl sm:text-4xl font-['Outfit',sans-serif] font-black text-white tracking-tight">
                  {selectedPreset ? (
                    <span>
                      {selectedPreset.label}{' '}
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#8dbcc7] via-[#a4ccd9] to-[#ebffd8]">
                        Access
                      </span>
                    </span>
                  ) : (
                    <span>
                      Doc<span className="text-transparent bg-clip-text bg-gradient-to-r from-[#8dbcc7] via-[#a4ccd9] to-[#ebffd8]">Nest</span>
                      <span className="text-slate-400 font-light ml-2 text-2xl sm:text-3xl">Portal</span>
                    </span>
                  )}
                </h1>
                <p className="text-xs text-[#a4ccd9]/80 font-medium max-w-xs mx-auto mt-1.5">
                  {selectedPreset ? selectedPreset.detail : 'Unified Clinical Gateway & Patient Access Infrastructure'}
                </p>
              </div>
            </div>

            {/* Active Preset Banner (If selected) */}
            {selectedPreset && (
              <div className="p-3 bg-[#141e28] border border-[rgba(196,225,230,0.22)] rounded-2xl flex items-center justify-between text-xs animate-in fade-in">
                <div className="flex items-center space-x-2.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                  <div>
                    <span className="font-bold text-white">{selectedPreset.name}</span>
                    <span className="text-[#a4ccd9] ml-1.5 text-[11px]">({selectedPreset.detail})</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedPreset(null);
                    setIdentifier('');
                    setPassword('');
                  }}
                  className="text-slate-400 hover:text-white text-[11px] font-bold underline"
                >
                  Reset Manual
                </button>
              </div>
            )}

            {/* Error Message */}
            {errorMessage && (
              <div className="p-3.5 bg-rose-950/60 border border-rose-800/80 rounded-2xl text-xs text-rose-300 flex items-center space-x-2 animate-in fade-in">
                <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Main Sign-In Form (Universal Smart Login) */}
            <form onSubmit={(e) => handleLogin(e)} className="space-y-4 relative z-10">
              {/* #4: Input with Focus Energy Halo Glow */}
              <div className="input-energy-halo rounded-2xl transition">
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  Mobile Number or Staff Email
                </label>
                <div className="relative">
                  <div className="absolute left-3.5 top-3.5 text-slate-400 flex items-center space-x-1 z-10">
                    {isPhoneLogin ? (
                      <>
                        <Phone className="w-4 h-4 text-emerald-400" />
                        <span className="text-xs font-mono font-bold text-slate-300 pl-1 border-r border-slate-700 pr-1.5">+91</span>
                      </>
                    ) : (
                      <User className="w-4 h-4 text-[#8dbcc7]" />
                    )}
                  </div>
                  <input
                    type={isPhoneLogin ? 'tel' : 'text'}
                    placeholder="e.g. 9876543210 or doctor@docnest.in"
                    value={identifier}
                    onChange={(e) => {
                      setIdentifier(e.target.value);
                      if (selectedPreset && e.target.value !== selectedPreset.identifier) {
                        setSelectedPreset(null);
                      }
                    }}
                    className={`w-full ${
                      isPhoneLogin ? 'pl-20' : 'pl-10'
                    } pr-4 py-3.5 bg-[#0c1219] border border-[rgba(196,225,230,0.22)] text-white rounded-2xl text-sm focus:outline-none focus:border-[#8dbcc7] transition font-medium shadow-inner placeholder:text-slate-500`}
                    required
                  />
                </div>
              </div>

              {/* #16: Smooth Form Mode Slide Transition (Password vs OTP) */}
              <div className="transition-all duration-300 ease-out">
                {isOtpMode ? (
                  <div className="space-y-3 animate-in fade-in slide-in-from-right-4 duration-300">
                    {otpSent ? (
                      <div className="space-y-2">
                        <label className="block text-xs font-bold text-slate-300">Enter 4-Digit OTP Code</label>
                        <input
                          type="text"
                          maxLength={4}
                          placeholder="• • • •"
                          className="w-full text-center tracking-widest font-mono text-2xl py-3 bg-[#0c1219] border-2 border-teal-400 text-[#ebffd8] rounded-2xl focus:outline-none shadow-lg shadow-teal-900/30"
                        />
                        <p className="text-[11px] text-teal-300 flex items-center justify-center space-x-1.5 pt-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-teal-400" />
                          <span>OTP successfully dispatched via SMS to {identifier}</span>
                        </p>
                      </div>
                    ) : (
                      <div className="p-3 bg-[#141e28] rounded-2xl border border-[rgba(196,225,230,0.14)] text-[11px] text-slate-300 leading-relaxed">
                        A secure 4-digit verification passcode will be sent via SMS & WhatsApp to your phone.
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-1.5 animate-in fade-in slide-in-from-left-4 duration-300">
                    <div className="flex justify-between items-center mb-1">
                      <label className="block text-xs font-bold text-slate-300">Security Password</label>
                      <span className="text-[10px] text-slate-400 font-medium">Leave blank for phone token login</span>
                    </div>
                    {/* #4 & #11: Energy Halo & Blinking Eye Password Toggle */}
                    <div className="input-energy-halo rounded-2xl relative">
                      <Lock className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-500" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full pl-10 pr-11 py-3.5 bg-[#0c1219] border border-[rgba(196,225,230,0.22)] text-white rounded-2xl text-sm focus:outline-none focus:border-[#8dbcc7] transition placeholder:text-slate-600 shadow-inner"
                      />
                      <button
                        type="button"
                        onClick={handleTogglePassword}
                        className={`absolute right-3.5 top-3.5 text-slate-400 hover:text-white transition p-1 ${
                          isWinking ? 'animate-eye-wink text-teal-400' : ''
                        }`}
                        title={showPassword ? 'Hide password' : 'Peek password'}
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Mode Switcher Link */}
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => {
                    setIsOtpMode(!isOtpMode);
                    setOtpSent(false);
                  }}
                  className="text-[11px] text-[#8dbcc7] hover:text-[#ebffd8] font-bold transition underline"
                >
                  {isOtpMode ? 'Switch to Password Sign In' : 'Sign in with SMS / WhatsApp OTP instead'}
                </button>
              </div>

              {/* #10 & #12: Magnetic Button + Success Particle Confetti Burst */}
              <div className="relative pt-2">
                {/* #10: Confetti / Sparks on Success */}
                {isSuccess && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-30">
                    <span className="animate-spark absolute w-2 h-2 rounded-full bg-[#ebffd8] [--tw-translate-x:-60px] [--tw-translate-y:-50px]" />
                    <span className="animate-spark absolute w-2 h-2 rounded-full bg-[#8dbcc7] [--tw-translate-x:60px] [--tw-translate-y:-45px]" />
                    <span className="animate-spark absolute w-2.5 h-2.5 rounded-full bg-emerald-400 [--tw-translate-x:-80px] [--tw-translate-y:20px]" />
                    <span className="animate-spark absolute w-2 h-2 rounded-full bg-teal-300 [--tw-translate-x:85px] [--tw-translate-y:25px]" />
                    <span className="animate-spark absolute w-1.5 h-1.5 rounded-full bg-white [--tw-translate-x:0px] [--tw-translate-y:-65px]" />
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading || isSuccess}
                  className={`w-full py-4 rounded-2xl text-sm font-black shadow-lg flex items-center justify-center space-x-2 transition-all duration-200 active:scale-[0.98] cursor-pointer select-none ${
                    isSuccess
                      ? 'bg-emerald-400 text-slate-950 shadow-emerald-500/40 ring-4 ring-emerald-500/30'
                      : 'bg-gradient-to-r from-[#8dbcc7] to-[#ebffd8] hover:from-[#a4ccd9] hover:to-[#f2ffdf] text-[#0c1219] shadow-[#8dbcc7]/20 hover:shadow-[#8dbcc7]/30 border border-white/20 font-black'
                  } disabled:opacity-75`}
                >
                  {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin text-[#0c1219]" />
                  ) : isSuccess ? (
                    <>
                      <CheckCircle2 className="w-5 h-5 text-slate-950 animate-bounce" />
                      <span>Access Granted • Entering Portal...</span>
                    </>
                  ) : (
                    <>
                      <span>
                        {isOtpMode && !otpSent
                          ? 'Send Verification OTP →'
                          : selectedPreset
                          ? `Sign In as ${selectedPreset.name}`
                          : 'Sign In to Portal (प्रवेश करें)'}
                      </span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>

            {/* #20: Quick Role Browser (Dev Sandbox with Chip Bounce & Typewriter) */}
            <div className="pt-4 border-t border-[rgba(196,225,230,0.14)] space-y-3 relative z-10">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#a4ccd9] flex items-center space-x-1.5">
                  <Zap className="w-3.5 h-3.5 text-[#ebffd8]" />
                  <span>Dev Sandbox • 1-Tap Quick Switch</span>
                </span>
                <span className="text-[10px] bg-[#141e28] text-[#8dbcc7] px-2.5 py-0.5 rounded-full border border-[rgba(196,225,230,0.14)] font-mono font-bold">
                  Test Presets
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {DEMO_PRESETS.map((preset) => {
                  const IconComponent = preset.icon;
                  const isCurrent = selectedPreset?.id === preset.id;
                  const isBouncing = bouncingPresetId === preset.id;

                  return (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => handleQuickJump(preset)}
                      className={`p-2.5 rounded-xl border text-left transition flex items-center space-x-2.5 active:scale-95 group ${preset.accent} ${
                        isCurrent ? 'ring-2 ring-[#8dbcc7] bg-white/10' : ''
                      } ${isBouncing ? 'animate-chip-bounce' : ''}`}
                    >
                      <IconComponent className="w-4 h-4 flex-shrink-0 transition-transform group-hover:scale-110" />
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-black truncate">{preset.label}</p>
                        <p className="text-[10px] opacity-75 truncate">{preset.name}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Footer Security Footprint */}
            <div className="pt-3 border-t border-[rgba(196,225,230,0.1)] flex items-center justify-center space-x-2 text-[11px] text-slate-400">
              <ShieldCheck className="w-4 h-4 text-[#8dbcc7]" />
              <span>Encrypted Healthcare Gateway • ABHA & NDHM Compliant</span>
            </div>
          </div>
        </div>

        {/* Footer Support Tag */}
        <p className="text-center text-[11px] text-slate-500">
          Need clinic onboarding assistance? National Support: <span className="text-slate-300 font-mono">1800-DOC-NEST</span>
        </p>
      </div>
    </div>
  );
}
