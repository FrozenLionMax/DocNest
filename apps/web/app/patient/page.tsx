'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import {
  MessageSquare, Clock, Search, Stethoscope, AlertTriangle, ShieldCheck,
  Send, Sparkles, User, Calendar, MapPin, Phone, HelpCircle, CheckCircle2, Bot, ArrowRight, Globe
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  time: string;
}

export default function PatientAppPage() {
  const [lang, setLang] = useState<'en' | 'hi'>('hi');
  const [searchToken, setSearchToken] = useState('1');
  const [currentToken, setCurrentToken] = useState(1);
  const [opdStatus, setOpdStatus] = useState<'active' | 'paused'>('active');
  const [pauseReason, setPauseReason] = useState('');
  
  // Chatbot state
  const [inputMsg, setInputMsg] = useState('');
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([
    {
      id: '1',
      sender: 'ai',
      text: 'नमस्ते! मैं DocNest AI सहायक हूँ। मैं आपकी क्या मदद कर सकता हूँ? आप लाइव टोकन, ओपीडी समय या बीमारी के विभाग के बारे में पूछ सकते हैं।',
      time: 'Just now'
    }
  ]);

  // Symptom Triage state
  const [selectedSymptom, setSelectedSymptom] = useState<string | null>(null);

  // Sync Live Queue Status from Supabase
  useEffect(() => {
    async function loadQueueData() {
      try {
        const { data } = await supabase.from('clinic_queues').select('*').eq('doctor_id', 'doc-001').single();
        if (data) {
          setCurrentToken(data.current_token || 1);
          setOpdStatus(data.status || 'active');
          if (data.status === 'paused') {
            setPauseReason(data.pause_reason || 'Urgent Emergency Call / आपातकालीन रोक');
          }
        }
      } catch (e) {}
    }
    loadQueueData();

    const channel = supabase.channel('patient-live-queue')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'clinic_queues' }, (payload: any) => {
        if (payload.new?.current_token !== undefined) setCurrentToken(payload.new.current_token);
        if (payload.new?.status === 'paused') {
          setOpdStatus('paused');
          setPauseReason(payload.new.pause_reason || 'Urgent Emergency Call');
        } else if (payload.new?.status === 'active') {
          setOpdStatus('active');
        }
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  const handleSendMessage = (e?: React.FormEvent, customText?: string) => {
    if (e) e.preventDefault();
    const textToSend = customText || inputMsg;
    if (!textToSend.trim()) return;

    const userMessage: ChatMessage = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatHistory((prev) => [...prev, userMessage]);
    if (!customText) setInputMsg('');

    // AI Response logic (Fast localized assistant)
    setTimeout(() => {
      let aiText = 'DocNest AI Assistant: डॉक्टर रोजाना सुबह 10:00 AM से दोपहर 02:00 PM और शाम 05:00 PM से 08:00 PM तक गुप्ता क्लिनिक, देवरिया में परामर्श देते हैं।';
      const query = textToSend.toLowerCase();

      if (query.includes('token') || query.includes('टोकन') || query.includes('wait') || query.includes('नंबर')) {
        aiText = `वर्तमान में **टोकन #${currentToken}** चल रहा है। ${
          opdStatus === 'paused'
            ? `🚨 **आपातकालीन रोक**: ${pauseReason}। ओपीडी जल्द पुनः शुरू होगी।`
            : `यदि आपका टोकन #${Number(searchToken) || 2} है, तो अनुमानित प्रतीक्षा समय लगभग ${(Math.max(0, Number(searchToken) - currentToken)) * 5} मिनट है।`
        }`;
      } else if (query.includes('fever') || query.includes('बुखार') || query.includes('pain') || query.includes('दर्द')) {
        aiText = 'लक्षणों के आधार पर: यदि कमर या जोड़ों में दर्द है, तो **ऑर्थोपेडिक (डॉ. अमित कुमार)** विभाग चुनें। यदि बुखार या खांसी है, तो **जनरल मेडिसिन** ओपीडी में दिखाएं।';
      } else if (query.includes('timing') || query.includes('समय') || query.includes('टाइम')) {
        aiText = '📅 **ओपीडी समय (Consultation Hours)**:\n- सुबह: 10:00 AM – 02:00 PM\n- शाम: 05:00 PM – 08:00 PM\n- इमरजेंसी सर्विस: 24x7 उपलब्ध।';
      } else if (query.includes('prescription') || query.includes('दवा') || query.includes('पर्चा')) {
        aiText = '📋 **दवा नियम मार्गदर्शिका**:\n- **1-0-1**: सुबह व शाम खाने के बाद\n- **1-0-0 (खाली पेट)**: सुबह उठकर खाली पेट\n- **0-0-1**: रात को सोते समय\nकिसी भी संशय में क्लिनिक संपर्क करें: +91 98765 43210';
      }

      const aiMessage: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: aiText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setChatHistory((prev) => [...prev, aiMessage]);
    }, 400);
  };

  const symptomSpecialists = [
    { title: '🦴 जोड़ों व कमर में दर्द (Joint/Back Pain)', dept: 'Orthopedics / ऑर्थोपेडिक', doctor: 'Dr. Amit Kumar (MS Ortho)' },
    { title: '🌡️ बुखार, सर्दी व बदन दर्द (Fever & Cold)', dept: 'General Medicine / सामान्य चिकित्सा', doctor: 'Dr. Amit Kumar' },
    { title: '🧪 पेट में जलन व गैस (Acidity & GERD)', dept: 'Gastroenterology / गैस्ट्रो', doctor: 'Dr. Amit Kumar' },
    { title: '🫁 खांसी, सांस में तकलीफ (Cough & Asthma)', dept: 'Chest & Pulmonology / चेस्ट', doctor: 'Dr. Amit Kumar' },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center p-4 md:p-8 font-['Plus_Jakarta_Sans',sans-serif] relative overflow-hidden">
      {/* Background Accent Gradients */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-4xl space-y-6">
        {/* Top Header */}
        <header className="bg-slate-900/90 border border-slate-800 backdrop-blur-xl rounded-3xl p-6 flex flex-wrap items-center justify-between gap-4 shadow-xl">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center text-white text-2xl font-black shadow-lg shadow-emerald-950">
              🏥
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-black text-white tracking-tight">DocNest Patient App</h1>
              <p className="text-xs text-emerald-400 font-bold">Gupta Clinic & Joint Care Center — Deoria</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => setLang(lang === 'hi' ? 'en' : 'hi')}
              className="px-3.5 py-2 bg-slate-800 border border-slate-700 hover:border-emerald-500 text-emerald-400 rounded-full text-xs font-extrabold flex items-center space-x-1.5 transition"
            >
              <Globe className="w-4 h-4" />
              <span>{lang === 'hi' ? 'हिंदी (Hindi)' : 'English'}</span>
            </button>
          </div>
        </header>

        {/* LIVE TOKEN STATUS TRACKER BANNER */}
        <section className={`p-6 rounded-3xl border shadow-2xl relative overflow-hidden transition-all ${
          opdStatus === 'paused'
            ? 'bg-gradient-to-br from-rose-950 via-slate-900 to-amber-950 border-rose-500/50'
            : 'bg-gradient-to-br from-emerald-950 via-slate-900 to-slate-950 border-emerald-500/40'
        }`}>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="space-y-2">
              <div className={`inline-flex items-center space-x-2 px-3.5 py-1 rounded-full text-xs font-extrabold border ${
                opdStatus === 'paused' ? 'bg-rose-500/20 text-rose-300 border-rose-500/30' : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
              }`}>
                <span className={`w-2.5 h-2.5 rounded-full animate-ping ${opdStatus === 'paused' ? 'bg-rose-400' : 'bg-emerald-400'}`} />
                <span>{opdStatus === 'paused' ? '🚨 EMERGENCY OPD PAUSE' : '● LIVE OPD QUEUE COUNTER'}</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-black text-white">
                {opdStatus === 'paused' ? 'ओपीडी आपातकालीन स्थगन' : 'लाइव टोकन काउंटर status'}
              </h2>
              {opdStatus === 'paused' ? (
                <p className="text-xs text-rose-200 font-bold bg-rose-950/60 p-2.5 rounded-xl border border-rose-500/30">
                  {pauseReason} • अनुमानित समय: ~30 मिनट
                </p>
              ) : (
                <p className="text-xs text-slate-300">
                  अपना टोकन नंबर दर्ज करें या नीचे AI सहायक से लाइव समय पूछें।
                </p>
              )}
            </div>

            {/* Token Counter Box */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 text-center min-w-[200px] shadow-inner">
              <p className="text-[11px] text-emerald-400 uppercase font-bold tracking-wider">Now Serving (वर्तमान टोकन)</p>
              <p className="text-5xl font-black text-white font-mono my-1">#{currentToken}</p>
              <p className="text-[10px] text-slate-400">Dr. Amit Kumar (Orthopedic)</p>
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* AI SAHAYAK BILINGUAL CHATBOT */}
          <div className="lg:col-span-2 bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col h-[520px]">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-emerald-500/20 border border-emerald-500/30 rounded-xl flex items-center justify-center text-emerald-400">
                  <Bot className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-white flex items-center space-x-2">
                    <span>DocNest AI सहायक (Bilingual AI)</span>
                    <Sparkles className="w-4 h-4 text-emerald-400 animate-pulse" />
                  </h3>
                  <p className="text-[11px] text-slate-400">Ask in Hindi or English about tokens, OPD & symptoms</p>
                </div>
              </div>
              <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-1 rounded-full font-bold">
                Online 24x7
              </span>
            </div>

            {/* Chat Messages Body */}
            <div className="flex-1 overflow-y-auto space-y-3 pr-2 scrollbar-thin">
              {chatHistory.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl p-3.5 text-xs space-y-1 ${
                      msg.sender === 'user'
                        ? 'bg-emerald-600 text-white rounded-br-none shadow'
                        : 'bg-slate-800 text-slate-200 border border-slate-700/80 rounded-bl-none'
                    }`}
                  >
                    <p className="whitespace-pre-line leading-relaxed">{msg.text}</p>
                    <p className={`text-[9px] text-right font-mono ${msg.sender === 'user' ? 'text-emerald-200' : 'text-slate-400'}`}>
                      {msg.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Action Prompt Pills */}
            <div className="pt-3 pb-2 flex flex-wrap gap-2">
              <button
                onClick={() => handleSendMessage(undefined, 'मेरा टोकन कब आएगा? (Live Token Status)')}
                className="text-[11px] bg-slate-800 hover:bg-slate-700 text-emerald-300 border border-slate-700 px-3 py-1.5 rounded-full transition"
              >
                🎫 मेरा टोकन स्टेटस?
              </button>
              <button
                onClick={() => handleSendMessage(undefined, 'ओपीडी का समय क्या है? (OPD Timings)')}
                className="text-[11px] bg-slate-800 hover:bg-slate-700 text-blue-300 border border-slate-700 px-3 py-1.5 rounded-full transition"
              >
                ⏰ ओपीडी का समय?
              </button>
              <button
                onClick={() => handleSendMessage(undefined, 'दवाएं कैसे लेनी हैं? (Prescription Guide)')}
                className="text-[11px] bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700 px-3 py-1.5 rounded-full transition"
              >
                📋 दवा नियम गाइड?
              </button>
            </div>

            {/* Input Bar */}
            <form onSubmit={handleSendMessage} className="pt-2 flex items-center space-x-2">
              <input
                type="text"
                placeholder="यहाँ सवाल लिखें... (Type question in Hindi/English)"
                value={inputMsg}
                onChange={(e) => setInputMsg(e.target.value)}
                className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-emerald-500"
              />
              <button
                type="submit"
                className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold p-3 rounded-xl transition shadow"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>

          {/* AI SYMPTOM TRIAGE & CLINIC DETAILS */}
          <div className="space-y-6">
            {/* Symptom Triage */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
              <h3 className="text-sm font-black text-white flex items-center space-x-2">
                <Stethoscope className="w-4 h-4 text-emerald-400" />
                <span>AI लक्षण व विभाग गाइड (Symptom Triage)</span>
              </h3>
              <p className="text-xs text-slate-400">अपनी समस्या चुनें और सही ओपीडी विभाग जानें:</p>

              <div className="space-y-2">
                {symptomSpecialists.map((item, idx) => {
                  const isSelected = selectedSymptom === item.title;
                  return (
                    <div
                      key={idx}
                      onClick={() => setSelectedSymptom(isSelected ? null : item.title)}
                      className={`p-3 rounded-2xl border cursor-pointer transition ${
                        isSelected
                          ? 'bg-emerald-500/15 border-emerald-500/50 text-white font-bold'
                          : 'bg-slate-800/60 border-slate-700/60 text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      <p className="text-xs">{item.title}</p>
                      {isSelected && (
                        <div className="mt-2 pt-2 border-t border-emerald-500/20 text-[11px] text-emerald-300 space-y-0.5">
                          <p><strong>विभाग:</strong> {item.dept}</p>
                          <p><strong>विशेषज्ञ:</strong> {item.doctor}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Clinic Info Card */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-3 text-xs">
              <h4 className="font-bold text-white flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-emerald-400" />
                <span>क्लिनिक पता व संपर्क (Clinic Info)</span>
              </h4>
              <p className="text-slate-300">गुप्ता क्लिनिक व ज्वाइंट केयर सेंटर, देवरिया ओवरब्रिज के पास, देवरिया (उ.प्र.)</p>
              <div className="pt-2 border-t border-slate-800 space-y-1 text-slate-400">
                <p className="flex items-center space-x-2">
                  <Phone className="w-3.5 h-3.5 text-emerald-400" />
                  <span>हेल्पलाइन: +91 98765 43210</span>
                </p>
                <p className="flex items-center space-x-2">
                  <Clock className="w-3.5 h-3.5 text-emerald-400" />
                  <span>प्रातः 10 AM - 02 PM | सायंकाल 05 PM - 08 PM</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
