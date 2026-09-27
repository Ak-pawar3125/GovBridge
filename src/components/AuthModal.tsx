import React, { useState } from 'react';
import { 
  Building, 
  Shield, 
  UserCheck, 
  KeyRound, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles,
  Phone,
  FileCheck2,
  Lock,
  Smartphone,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { UserSession } from '../types';

interface AuthModalProps {
  onLogin: (session: UserSession) => void;
  onContinueAsGuest: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ onLogin, onContinueAsGuest }) => {
  const [activeTab, setActiveTab] = useState<'citizen' | 'official'>('citizen');

  // Citizen Form state
  const [citizenName, setCitizenName] = useState('Rameshwar Kumar Patel');
  const [citizenGovId, setCitizenGovId] = useState('AADHAAR-8942-5510');
  const [citizenPhone, setCitizenPhone] = useState('+91 98765 43210');
  const [citizenOtpStep, setCitizenOtpStep] = useState(false);
  const [citizenOtp, setCitizenOtp] = useState('');
  const [citizenOtpSending, setCitizenOtpSending] = useState(false);
  const [citizenOtpVerifying, setCitizenOtpVerifying] = useState(false);

  // Official Form state
  const [officialEmail, setOfficialEmail] = useState('anita.roy@nic.in');
  const [officialDesignation, setOfficialDesignation] = useState('Joint Commissioner & Nodal Adjudicator');
  const [officialDept, setOfficialDept] = useState('Central Public Grievance & DBT Cell');
  const [officialPin, setOfficialPin] = useState('');
  const [officialLoggingIn, setOfficialLoggingIn] = useState(false);

  // Quick fill demo accounts
  const handleQuickDemoCitizen = () => {
    setActiveTab('citizen');
    setCitizenName('Rameshwar Kumar Patel');
    setCitizenGovId('AADHAAR-8942-5510');
    setCitizenPhone('+91 98765 43210');
    setCitizenOtpStep(true);
    setCitizenOtp('123456');
  };

  const handleQuickDemoOfficial = () => {
    setActiveTab('official');
    setOfficialEmail('anita.roy@nic.in');
    setOfficialDesignation('Joint Commissioner & Nodal Adjudicator');
    setOfficialDept('Central Public Grievance & DBT Cell');
    setOfficialPin('9988');
  };

  // Citizen Send OTP
  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!citizenName.trim() || !citizenGovId.trim() || !citizenPhone.trim()) {
      alert("Please enter Name, GovID/Aadhaar and Phone");
      return;
    }
    setCitizenOtpSending(true);
    setTimeout(() => {
      setCitizenOtpSending(false);
      setCitizenOtpStep(true);
      // Pre-fill demo OTP hint
      setCitizenOtp('123456');
    }, 400);
  };

  // Citizen Verify OTP and Login
  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (citizenOtp.trim() !== '123456' && citizenOtp.trim().length !== 6) {
      alert("Please enter the 6-digit test OTP: 123456");
      return;
    }
    setCitizenOtpVerifying(true);
    const cleanId = citizenGovId.trim().toLowerCase().replace(/[^a-z0-9]/g, '_');
    const userId = `user_${cleanId}`;
    // Safe immediate transition
    setTimeout(() => {
      onLogin({
        id: userId,
        role: 'citizen',
        name: citizenName.trim(),
        govId: citizenGovId.trim(),
        phone: citizenPhone.trim(),
        token: 'auth-jwt-citizen-' + Date.now()
      });
    }, 200);
  };

  // Official Login
  const handleOfficialLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setOfficialLoggingIn(true);
    setTimeout(() => {
      onLogin({
        id: 'official_emp_98214',
        role: 'official',
        name: 'Dr. Anita Roy, IAS',
        govId: 'OFFICIAL-EMP-98214',
        phone: '+91 99112 00192',
        designation: officialDesignation,
        department: officialDept,
        token: 'auth-jwt-official-' + Date.now()
      });
    }, 200);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-950 to-amber-950 text-slate-100 flex flex-col items-center justify-center p-4">
      {/* Background graphic styling */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(217,119,6,0.15),rgba(255,255,255,0))] pointer-events-none" />

      {/* Main card */}
      <div className="w-full max-w-xl bg-white text-slate-900 rounded-3xl shadow-2xl border border-slate-200 overflow-hidden relative z-10">
        
        {/* Header Branding */}
        <div className="p-6 md:p-8 bg-gradient-to-b from-amber-50 to-orange-50/40 border-b border-amber-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-600 to-orange-500 text-white flex items-center justify-center font-extrabold text-xl shadow-md">
                GB
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-black tracking-tight text-slate-900">GovBridge</h1>
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-600 text-white px-2 py-0.5 rounded-full">
                    SIH 2026
                  </span>
                </div>
                <p className="text-xs text-slate-600 font-medium">
                  Unified Citizen Services & Administrative Adjudication Gateway
                </p>
              </div>
            </div>

            <div className="hidden sm:flex flex-col items-end text-right">
              <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-300">
                ● Live Interoperability Bus
              </span>
              <span className="text-[10px] text-slate-400 mt-1">DigiLocker • UIDAI • PFMS</span>
            </div>
          </div>

          {/* Role selector tabs */}
          <div className="grid grid-cols-2 gap-2 mt-6 p-1 bg-slate-200/80 rounded-2xl">
            <button
              type="button"
              onClick={() => setActiveTab('citizen')}
              className={`py-2.5 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer ${
                activeTab === 'citizen'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <UserCheck className="w-4 h-4 text-amber-600" /> Citizen Portal Login
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('official')}
              className={`py-2.5 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer ${
                activeTab === 'official'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Shield className="w-4 h-4 text-emerald-600" /> Officer & Admin Console
            </button>
          </div>
        </div>

        {/* Tab Body */}
        <div className="p-6 md:p-8">
          {activeTab === 'citizen' ? (
            <div>
              <div className="mb-5">
                <h3 className="text-base font-bold text-slate-900">
                  {citizenOtpStep ? 'Verify OTP Authentication' : 'Citizen Direct Login'}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  {citizenOtpStep 
                    ? `Enter the 6-digit OTP dispatched to ${citizenPhone}. Demo code: 123456`
                    : 'Instant Aadhaar/GovID authentication with zero paperwork.'}
                </p>
              </div>

              {!citizenOtpStep ? (
                <form onSubmit={handleSendOtp} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Citizen Full Name
                    </label>
                    <input
                      type="text"
                      value={citizenName}
                      onChange={(e) => setCitizenName(e.target.value)}
                      placeholder="E.g., Rameshwar Kumar Patel"
                      className="w-full text-sm px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        GovID / Aadhaar Number
                      </label>
                      <input
                        type="text"
                        value={citizenGovId}
                        onChange={(e) => setCitizenGovId(e.target.value)}
                        placeholder="AADHAAR-8942-5510"
                        className="w-full text-sm font-mono px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Aadhaar-Linked Mobile
                      </label>
                      <input
                        type="text"
                        value={citizenPhone}
                        onChange={(e) => setCitizenPhone(e.target.value)}
                        placeholder="+91 98765 43210"
                        className="w-full text-sm px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none"
                        required
                      />
                    </div>
                  </div>

                  <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-start gap-2">
                    <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <span>
                      Demo credentials are populated. Clicking <strong>Send OTP</strong> will generate an instant OTP verification challenge.
                    </span>
                  </div>

                  <button
                    type="submit"
                    disabled={citizenOtpSending}
                    className="w-full py-3 px-4 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 text-sm cursor-pointer disabled:opacity-50"
                  >
                    {citizenOtpSending ? (
                      'Sending OTP...'
                    ) : (
                      <>
                        Send Aadhaar OTP <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              ) : (
                <form onSubmit={handleVerifyOtp} className="space-y-4">
                  <div className="bg-emerald-50 border border-emerald-200 p-3.5 rounded-xl text-xs text-emerald-900">
                    <p className="font-semibold flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" /> OTP Dispatched via UIDAI SMS Gateway
                    </p>
                    <p className="text-emerald-800 mt-1">
                      For testing this SIH prototype, enter the universal test OTP: <strong className="font-mono text-sm text-emerald-900">123456</strong>
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Enter 6-Digit Verification OTP
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        maxLength={6}
                        value={citizenOtp}
                        onChange={(e) => setCitizenOtp(e.target.value)}
                        placeholder="123456"
                        className="w-full text-center tracking-[0.5em] text-xl font-mono font-bold px-4 py-3 border-2 border-amber-400 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none"
                        required
                        autoFocus
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span>Didn't receive SMS?</span>
                    <button
                      type="button"
                      onClick={() => setCitizenOtp('123456')}
                      className="text-amber-700 font-semibold hover:underline cursor-pointer"
                    >
                      Autofill Test OTP (123456)
                    </button>
                  </div>

                  <div className="pt-2 flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setCitizenOtpStep(false)}
                      className="w-1/3 py-2.5 px-3 border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-bold rounded-xl transition-all cursor-pointer"
                    >
                      Change Details
                    </button>
                    <button
                      type="submit"
                      disabled={citizenOtpVerifying}
                      className="w-2/3 py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 text-sm cursor-pointer disabled:opacity-50"
                    >
                      {citizenOtpVerifying ? (
                        'Verifying...'
                      ) : (
                        <>
                          <CheckCircle2 className="w-4 h-4" /> Verify & Continue
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          ) : (
            <form onSubmit={handleOfficialLogin} className="space-y-4">
              <div className="mb-4">
                <h3 className="text-base font-bold text-slate-900">
                  Government Officer & Adjudicator Login
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Review citizen applications, verify inter-departmental documents, and resolve public grievances.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Official NIC / Gov Email
                </label>
                <input
                  type="email"
                  value={officialEmail}
                  onChange={(e) => setOfficialEmail(e.target.value)}
                  className="w-full text-sm px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Designation & Posting
                </label>
                <input
                  type="text"
                  value={officialDesignation}
                  onChange={(e) => setOfficialDesignation(e.target.value)}
                  className="w-full text-sm px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Security PIN / Token Passcode
                </label>
                <input
                  type="password"
                  value={officialPin}
                  onChange={(e) => setOfficialPin(e.target.value)}
                  placeholder="Enter 4-digit token PIN (e.g. 9988)"
                  className="w-full text-sm font-mono px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  required
                />
              </div>

              <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-xl text-xs text-emerald-900 flex items-start gap-2">
                <Shield className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  Official role gives access to adjudicate applications, trigger automated connector audits, and update grievance status.
                </span>
              </div>

              <button
                type="submit"
                disabled={officialLoggingIn}
                className="w-full py-3 px-4 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 text-sm cursor-pointer disabled:opacity-50"
              >
                {officialLoggingIn ? (
                  'Authenticating Official Credentials...'
                ) : (
                  <>
                    <KeyRound className="w-4 h-4" /> Enter Official Adjudication Portal
                  </>
                )}
              </button>
            </form>
          )}

          {/* Judge Quick Action bar */}
          <div className="mt-6 pt-5 border-t border-slate-200">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2 text-center">
              SIH 2026 Judge Demo One-Click Access
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={handleQuickDemoCitizen}
                className="p-2.5 text-xs font-semibold rounded-xl border border-amber-200 bg-amber-50 hover:bg-amber-100/80 text-amber-900 transition-colors flex items-center justify-between cursor-pointer"
              >
                <span>Demo as Citizen</span>
                <ChevronRight className="w-3.5 h-3.5 text-amber-600" />
              </button>
              <button
                type="button"
                onClick={handleQuickDemoOfficial}
                className="p-2.5 text-xs font-semibold rounded-xl border border-emerald-200 bg-emerald-50 hover:bg-emerald-100/80 text-emerald-900 transition-colors flex items-center justify-between cursor-pointer"
              >
                <span>Demo as Official</span>
                <ChevronRight className="w-3.5 h-3.5 text-emerald-600" />
              </button>
            </div>

            <div className="mt-3 text-center">
              <button
                type="button"
                onClick={onContinueAsGuest}
                className="text-xs text-slate-500 hover:text-slate-800 font-medium hover:underline cursor-pointer"
              >
                Explore Public Portal & Available Welfare Schemes without logging in →
              </button>
            </div>
          </div>
        </div>

        {/* Footer info banner */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-100 text-center text-[11px] text-slate-500">
          GovBridge prototype built for Smart India Hackathon (SIH 2026). Direct state transitions prevent race conditions.
        </div>
      </div>
    </div>
  );
};
