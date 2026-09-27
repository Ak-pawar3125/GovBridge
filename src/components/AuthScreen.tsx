import React, { useState } from 'react';
import { 
  Building2, 
  ShieldCheck, 
  UserCheck, 
  KeyRound, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles,
  Phone,
  FileCheck2,
  Lock,
  Smartphone,
  ChevronRight,
  UserPlus,
  LogIn,
  Check,
  Building,
  Layers,
  Award,
  Vote
} from 'lucide-react';
import { UserSession } from '../types';

interface AuthScreenProps {
  onLogin: (session: UserSession) => void;
  onContinueAsGuest: () => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({ onLogin, onContinueAsGuest }) => {
  // Mode: 'login' or 'signup' (separate windows/screens)
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  
  // Role: 'citizen' or 'official'
  const [role, setRole] = useState<'citizen' | 'official'>('citizen');

  // Citizen Login state
  const [citizenLoginId, setCitizenLoginId] = useState('AADHAAR-8942-5510');
  const [citizenLoginPhone, setCitizenLoginPhone] = useState('+91 98765 43210');
  const [citizenLoginName, setCitizenLoginName] = useState('Rameshwar Kumar Patel');
  const [loginOtpStep, setLoginOtpStep] = useState(false);
  const [loginOtp, setLoginOtp] = useState('');
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);

  // Citizen Sign Up state
  const [signUpName, setSignUpName] = useState('');
  const [signUpAadhaar, setSignUpAadhaar] = useState('');
  const [signUpPhone, setSignUpPhone] = useState('');
  const [signUpCategory, setSignUpCategory] = useState('Farmer / Agriculture');
  const [signUpState, setSignUpState] = useState('Uttar Pradesh');
  const [signUpConsent, setSignUpConsent] = useState(true);
  const [signUpOtpStep, setSignUpOtpStep] = useState(false);
  const [signUpOtp, setSignUpOtp] = useState('');
  const [isSigningUp, setIsSigningUp] = useState(false);

  // Official Login state
  const [officialEmail, setOfficialEmail] = useState('anita.roy@nic.in');
  const [officialPin, setOfficialPin] = useState('9988');
  const [officialLoggingIn, setOfficialLoggingIn] = useState(false);

  // Official Sign Up state
  const [officialRegName, setOfficialRegName] = useState('');
  const [officialRegEmail, setOfficialRegEmail] = useState('');
  const [officialRegDept, setOfficialRegDept] = useState('Ministry of Agriculture & Farmers Welfare');
  const [officialRegDesignation, setOfficialRegDesignation] = useState('District Adjudication Officer');
  const [officialRegPin, setOfficialRegPin] = useState('');
  const [isRegisteringOfficial, setIsRegisteringOfficial] = useState(false);

  // In-UI validation error state (avoids window.alert)
  const [authError, setAuthError] = useState<string | null>(null);

  // Quick Demo Access for Judges
  const handleQuickDemoCitizen = () => {
    setAuthError(null);
    onLogin({
      id: 'user_aadhaar_8942_5510',
      role: 'citizen',
      name: 'Rameshwar Kumar Patel',
      govId: 'AADHAAR-8942-5510',
      phone: '+91 98765 43210',
      token: 'jwt-demo-citizen-sih2026'
    });
  };

  const handleQuickDemoCitizenB = () => {
    setAuthError(null);
    onLogin({
      id: 'user_aadhaar_2244_6688',
      role: 'citizen',
      name: 'Pooja Sharma',
      govId: 'AADHAAR-2244-6688',
      phone: '+91 98111 22334',
      token: 'jwt-demo-citizen-b-sih2026'
    });
  };

  const handleQuickDemoOfficial = () => {
    setAuthError(null);
    onLogin({
      id: 'official_emp_98214',
      role: 'official',
      name: 'Dr. Anita Roy, IAS',
      govId: 'OFFICIAL-EMP-98214',
      phone: '+91 99112 00192',
      designation: 'Joint Commissioner & Nodal Adjudicator',
      department: 'Central Public Grievance & DBT Cell',
      token: 'jwt-demo-official-sih2026'
    });
  };

  // Citizen Login: Send OTP
  const handleCitizenSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    if (!citizenLoginId.trim() || !citizenLoginPhone.trim()) {
      setAuthError("Please provide your Aadhaar / GovID and Mobile number.");
      return;
    }
    setIsSendingOtp(true);
    setTimeout(() => {
      setIsSendingOtp(false);
      setLoginOtpStep(true);
      setLoginOtp('123456'); // Pre-fill test OTP for easy demonstration
    }, 300);
  };

  // Citizen Login: Verify OTP
  const handleCitizenVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    if (loginOtp.trim() !== '123456' && loginOtp.trim().length !== 6) {
      setAuthError("Invalid OTP. For demonstration, please enter test OTP: 123456");
      return;
    }
    setIsVerifyingOtp(true);
    const cleanId = citizenLoginId.trim().toLowerCase().replace(/[^a-z0-9]/g, '_');
    const userId = `user_${cleanId}`;
    setTimeout(() => {
      onLogin({
        id: userId,
        role: 'citizen',
        name: citizenLoginName.trim() || 'Citizen Beneficiary',
        govId: citizenLoginId.trim(),
        phone: citizenLoginPhone.trim(),
        token: 'auth-jwt-cit-' + Date.now()
      });
    }, 150);
  };

  // Citizen Sign Up: Request Registration OTP
  const handleCitizenSignUpOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    if (!signUpName.trim() || !signUpAadhaar.trim() || !signUpPhone.trim()) {
      setAuthError("Please enter full name, Aadhaar number, and phone number.");
      return;
    }
    if (!signUpConsent) {
      setAuthError("Please grant consent for DigiLocker & Aadhaar verification to create an interoperable account.");
      return;
    }
    setIsSendingOtp(true);
    setTimeout(() => {
      setIsSendingOtp(false);
      setSignUpOtpStep(true);
      setSignUpOtp('123456');
    }, 300);
  };

  // Citizen Sign Up: Complete Registration
  const handleCitizenCompleteSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    if (signUpOtp.trim() !== '123456' && signUpOtp.trim().length !== 6) {
      setAuthError("Invalid OTP. For demonstration, please enter test OTP: 123456");
      return;
    }
    setIsSigningUp(true);
    const cleanId = signUpAadhaar.trim().toLowerCase().replace(/[^a-z0-9]/g, '_');
    const userId = `user_${cleanId}`;
    setTimeout(() => {
      onLogin({
        id: userId,
        role: 'citizen',
        name: signUpName.trim(),
        govId: signUpAadhaar.trim(),
        phone: signUpPhone.trim(),
        token: 'auth-jwt-cit-new-' + Date.now()
      });
    }, 150);
  };

  // Official Login
  const handleOfficialLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    if (!officialEmail.trim() || !officialPin.trim()) {
      setAuthError("Please enter official email and security PIN (use test PIN: 9988)");
      return;
    }
    setOfficialLoggingIn(true);
    setTimeout(() => {
      onLogin({
        id: 'official_emp_98214',
        role: 'official',
        name: 'Dr. Anita Roy, IAS',
        govId: 'OFFICIAL-EMP-98214',
        phone: '+91 99112 00192',
        designation: 'Joint Commissioner & Nodal Adjudicator',
        department: 'Central Public Grievance & DBT Cell',
        token: 'auth-jwt-off-' + Date.now()
      });
    }, 200);
  };

  // Official Sign Up
  const handleOfficialRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    if (!officialRegName.trim() || !officialRegEmail.trim() || !officialRegPin.trim()) {
      setAuthError("Please fill all official registration fields.");
      return;
    }
    setIsRegisteringOfficial(true);
    const cleanEmail = officialRegEmail.trim().toLowerCase().replace(/[^a-z0-9]/g, '_');
    const officialId = `official_${cleanEmail}`;
    setTimeout(() => {
      onLogin({
        id: officialId,
        role: 'official',
        name: officialRegName.trim(),
        govId: 'OFFICIAL-REG-' + Math.floor(10000 + Math.random() * 90000),
        phone: '+91 98110 55432',
        designation: officialRegDesignation,
        department: officialRegDept,
        token: 'auth-jwt-off-new-' + Date.now()
      });
    }, 300);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-amber-500 selection:text-slate-950">
      
      {/* Top Banner Header */}
      <header className="border-b border-slate-800 bg-slate-900/90 backdrop-blur-md px-6 py-3.5">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-600 to-orange-500 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-orange-500/20">
              GB
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base tracking-tight text-white">GovBridge</span>
                <span className="text-[10px] font-mono uppercase bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded-full font-bold">
                  SIH 2026
                </span>
                <span className="text-[10px] text-slate-400 font-mono hidden sm:inline">PS ID: 26129</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Team DevCrew — System Integration & Interoperability Across Government Digital Platforms
              </p>
            </div>
          </div>

          {/* Quick Judge Action Bar */}
          <div className="flex items-center gap-2 flex-wrap justify-end">
            <span className="text-xs text-amber-400/90 font-medium hidden md:inline">Judge 1-Click Access:</span>
            <button
              onClick={handleQuickDemoCitizen}
              className="px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
              title="Demo Citizen A with existing applications"
            >
              <UserCheck className="w-3.5 h-3.5" />
              Demo Citizen A (Rameshwar)
            </button>
            <button
              onClick={handleQuickDemoCitizenB}
              className="px-3 py-1.5 rounded-lg bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 border border-indigo-500/40 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
              title="Citizen B with 0 applications"
            >
              <UserPlus className="w-3.5 h-3.5" />
              Citizen B (Fresh / 0 Apps)
            </button>
            <button
              onClick={handleQuickDemoOfficial}
              className="px-3 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
              title="Official Adjudicator review queue"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              Demo Official
            </button>
          </div>
        </div>
      </header>

      {/* Main Authentication Section */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-8">
        <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Hero & Architecture Information (5 Cols) */}
          <div className="lg:col-span-5 space-y-6 text-slate-300">
            <div className="space-y-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <Sparkles className="w-3.5 h-3.5" /> "One Consent. Every Department Connected."
              </span>
              <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight leading-tight">
                Federated Identity & Universal Government Gateway
              </h1>
              <p className="text-sm text-slate-400 leading-relaxed">
                GovBridge eliminates repeated document submissions, fragmented logins, and siloed portals. Verified once via Aadhaar e-KYC & DigiLocker, accessible to every ministry.
              </p>
            </div>

            {/* Architecture Highlights from SIH 2026 PPT */}
            <div className="grid grid-cols-1 gap-3 text-xs">
              <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 shrink-0">
                  <KeyRound className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-white">Federated SSO & Aadhaar e-KYC</h4>
                  <p className="text-slate-400 text-[11px] mt-0.5">
                    One single sign-on replaces departmental login fragmentation with biometric & OTP certainty.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 shrink-0">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-white">DEPA-Compliant Consent Manager</h4>
                  <p className="text-slate-400 text-[11px] mt-0.5">
                    Citizen grants time-bounded consent; documents are verified without manual re-uploads.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400 shrink-0">
                  <Lock className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-white">Immutable Hyperledger Fabric Audit</h4>
                  <p className="text-slate-400 text-[11px] mt-0.5">
                    Complete end-to-end transparency for status transitions, verifications, and DBT grants.
                  </p>
                </div>
              </div>
            </div>

            {/* Live Connectors Indicator */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-[11px] text-slate-400">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>Interoperability Connectors:</span>
              </div>
              <span className="font-mono text-emerald-400 font-bold">5 Active (DigiLocker, UIDAI, PFMS, Bhulekh, AA)</span>
            </div>
          </div>

          {/* Right Dedicated Auth Card (7 Cols) */}
          <div className="lg:col-span-7">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
              
              {/* Subtle accent glow */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

              {/* Top Navigation: Separate Login vs Sign Up Windows */}
              <div className="flex items-center p-1 bg-slate-950/80 rounded-2xl border border-slate-800 mb-6">
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('login');
                    setLoginOtpStep(false);
                  }}
                  className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    authMode === 'login'
                      ? 'bg-amber-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <LogIn className="w-4 h-4" />
                  Sign In (Login)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('signup');
                    setSignUpOtpStep(false);
                  }}
                  className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    authMode === 'signup'
                      ? 'bg-amber-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <UserPlus className="w-4 h-4" />
                  New Registration (Sign Up)
                </button>
              </div>

              {/* Role Switcher (Citizen vs Official) */}
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800">
                <span className="text-xs text-slate-400 font-medium">Select Portal Category:</span>
                <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
                  <button
                    type="button"
                    onClick={() => {
                      setRole('citizen');
                      setLoginOtpStep(false);
                      setSignUpOtpStep(false);
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                      role === 'citizen' ? 'bg-amber-500 text-slate-950 shadow-xs' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Citizen Persona
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setRole('official');
                      setLoginOtpStep(false);
                      setSignUpOtpStep(false);
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                      role === 'official' ? 'bg-emerald-500 text-slate-950 shadow-xs' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Department Official
                  </button>
                </div>
              </div>

              {/* Validation / Notice message display */}
              {authError && (
                <div className="mb-4 p-3 rounded-xl bg-rose-950/80 border border-rose-700/80 text-rose-200 text-xs flex items-center justify-between animate-in fade-in duration-150">
                  <span>{authError}</span>
                  <button 
                    type="button" 
                    onClick={() => setAuthError(null)}
                    className="text-rose-400 hover:text-white font-bold ml-2 cursor-pointer"
                  >
                    ✕
                  </button>
                </div>
              )}

              {/* ========================================================================= */}
              {/* WINDOW 1: LOGIN (CITIZEN & OFFICIAL) */}
              {/* ========================================================================= */}
              {authMode === 'login' && (
                <div>
                  {role === 'citizen' ? (
                    <div>
                      <div className="mb-4">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <h3 className="text-lg font-bold text-white flex items-center gap-2">
                            Citizen Authentication
                            <span className="text-[10px] text-amber-400 font-mono bg-amber-950 border border-amber-800 px-2 py-0.5 rounded">
                              Aadhaar e-KYC
                            </span>
                          </h3>
                        </div>
                        <p className="text-xs text-slate-400 mt-1">
                          Every citizen has strictly isolated data. Log in as User A or User B to inspect separate records.
                        </p>

                        {/* Quick Presets for Judge testing */}
                        <div className="mt-3 flex items-center gap-1.5 flex-wrap">
                          <span className="text-[11px] text-slate-400 font-medium">Quick Autofill:</span>
                          <button
                            type="button"
                            onClick={() => {
                              setCitizenLoginName('Rameshwar Kumar Patel');
                              setCitizenLoginId('AADHAAR-8942-5510');
                              setCitizenLoginPhone('+91 98765 43210');
                              setLoginOtpStep(false);
                              setAuthError(null);
                            }}
                            className="px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30 cursor-pointer"
                          >
                            User A (Rameshwar)
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setCitizenLoginName('Pooja Sharma');
                              setCitizenLoginId('AADHAAR-2244-6688');
                              setCitizenLoginPhone('+91 98111 22334');
                              setLoginOtpStep(false);
                              setAuthError(null);
                            }}
                            className="px-2 py-0.5 rounded text-[11px] font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 hover:bg-indigo-500/30 cursor-pointer"
                          >
                            User B (Pooja - 0 Apps)
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setCitizenLoginName('');
                              setCitizenLoginId('');
                              setCitizenLoginPhone('');
                              setLoginOtpStep(false);
                              setAuthError(null);
                            }}
                            className="px-2 py-0.5 rounded text-[11px] font-medium bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
                          >
                            Clear
                          </button>
                        </div>
                      </div>

                      {!loginOtpStep ? (
                        <form onSubmit={handleCitizenSendOtp} className="space-y-4">
                          <div>
                            <label className="block text-xs font-semibold text-slate-300 mb-1">
                              Full Name (As on Aadhaar / National ID)
                            </label>
                            <input
                              type="text"
                              value={citizenLoginName}
                              onChange={(e) => setCitizenLoginName(e.target.value)}
                              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-amber-500"
                              placeholder="e.g. Rameshwar Kumar Patel or Pooja Sharma"
                              required
                            />
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                              <label className="block text-xs font-semibold text-slate-300 mb-1">
                                Aadhaar / GovID Number
                              </label>
                              <input
                                type="text"
                                value={citizenLoginId}
                                onChange={(e) => setCitizenLoginId(e.target.value)}
                                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono text-xs focus:outline-none focus:border-amber-500"
                                placeholder="AADHAAR-XXXX-XXXX"
                                required
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-semibold text-slate-300 mb-1">
                                Linked Mobile Number
                              </label>
                              <input
                                type="text"
                                value={citizenLoginPhone}
                                onChange={(e) => setCitizenLoginPhone(e.target.value)}
                                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-amber-500"
                                placeholder="+91 98765 43210"
                                required
                              />
                            </div>
                          </div>

                          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
                            <span className="flex items-center gap-1.5">
                              <Smartphone className="w-3.5 h-3.5 text-amber-400" />
                              OTP will be dispatched via UIDAI SMS Bridge
                            </span>
                            <span className="font-mono text-amber-400 font-bold">Mock OTP: 123456</span>
                          </div>

                          <button
                            type="submit"
                            disabled={isSendingOtp}
                            className="w-full py-3 px-4 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-xl shadow-lg shadow-amber-600/20 transition-all flex items-center justify-center gap-2 text-xs cursor-pointer disabled:opacity-50"
                          >
                            {isSendingOtp ? (
                              <span>Dispatching Secure OTP...</span>
                            ) : (
                              <>
                                <span>Send OTP to Linked Mobile</span>
                                <ArrowRight className="w-4 h-4" />
                              </>
                            )}
                          </button>
                        </form>
                      ) : (
                        <form onSubmit={handleCitizenVerifyOtp} className="space-y-4 animate-in fade-in duration-200">
                          <div className="p-3.5 rounded-xl bg-amber-950/40 border border-amber-800/60 text-xs">
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-bold text-amber-300">OTP Sent Successfully</span>
                              <button
                                type="button"
                                onClick={() => setLoginOtpStep(false)}
                                className="text-[11px] text-amber-400 hover:underline cursor-pointer"
                              >
                                Edit Details
                              </button>
                            </div>
                            <p className="text-[11px] text-slate-300">
                              Dispatched 6-digit OTP to {citizenLoginPhone} for {citizenLoginId}.
                            </p>
                          </div>

                          <div>
                            <div className="flex items-center justify-between mb-1">
                              <label className="text-xs font-semibold text-slate-300">
                                Enter 6-Digit Verification OTP
                              </label>
                              <button
                                type="button"
                                onClick={() => setLoginOtp('123456')}
                                className="text-[11px] text-amber-400 hover:underline cursor-pointer font-bold"
                              >
                                Autofill Test OTP (123456)
                              </button>
                            </div>
                            <input
                              type="text"
                              value={loginOtp}
                              onChange={(e) => setLoginOtp(e.target.value)}
                              className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-amber-500/50 text-white font-mono text-center tracking-widest text-lg font-bold focus:outline-none focus:ring-2 focus:ring-amber-500"
                              placeholder="123456"
                              maxLength={6}
                              autoFocus
                              required
                            />
                          </div>

                          <button
                            type="submit"
                            disabled={isVerifyingOtp}
                            className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-lg shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 text-xs cursor-pointer disabled:opacity-50"
                          >
                            {isVerifyingOtp ? (
                              <span>Verifying Aadhaar e-KYC...</span>
                            ) : (
                              <>
                                <CheckCircle2 className="w-4 h-4" />
                                <span>Verify & Enter GovBridge Portal</span>
                              </>
                            )}
                          </button>
                        </form>
                      )}
                    </div>
                  ) : (
                    /* Official Login */
                    <form onSubmit={handleOfficialLogin} className="space-y-4">
                      <div>
                        <h3 className="text-lg font-bold text-white flex items-center gap-2">
                          Official Adjudication Desk
                          <span className="text-[10px] text-emerald-400 font-mono bg-emerald-950 border border-emerald-800 px-2 py-0.5 rounded">
                            NIC SSO
                          </span>
                        </h3>
                        <p className="text-xs text-slate-400 mt-1">
                          Restricted to authorized departmental officers, nodal sanctioners, and magistrates.
                        </p>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">
                          Official NIC Email ID
                        </label>
                        <input
                          type="email"
                          value={officialEmail}
                          onChange={(e) => setOfficialEmail(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-emerald-500"
                          placeholder="officer@nic.in"
                          required
                        />
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="text-xs font-semibold text-slate-300">
                            4-Digit Security Passcode / PIN
                          </label>
                          <span className="text-[10px] text-slate-400 font-mono">Test PIN: 9988</span>
                        </div>
                        <input
                          type="password"
                          value={officialPin}
                          onChange={(e) => setOfficialPin(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono text-xs focus:outline-none focus:border-emerald-500"
                          placeholder="••••"
                          maxLength={4}
                          required
                        />
                      </div>

                      <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-900/60 text-xs text-slate-300 space-y-1">
                        <div className="flex items-center gap-1.5 font-bold text-emerald-400 text-[11px]">
                          <ShieldCheck className="w-3.5 h-3.5" /> Demo Credentials Pre-loaded
                        </div>
                        <p className="text-[11px] text-slate-400">
                          Logging in as: <strong>Dr. Anita Roy, IAS</strong> (Joint Commissioner, Public Grievances & DBT Cell).
                        </p>
                      </div>

                      <button
                        type="submit"
                        disabled={officialLoggingIn}
                        className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-lg shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 text-xs cursor-pointer disabled:opacity-50"
                      >
                        {officialLoggingIn ? (
                          <span>Authenticating Official Credentials...</span>
                        ) : (
                          <>
                            <KeyRound className="w-4 h-4" />
                            <span>Sign In to Review & Sanction Desk</span>
                          </>
                        )}
                      </button>
                    </form>
                  )}
                </div>
              )}

              {/* ========================================================================= */}
              {/* WINDOW 2: NEW REGISTRATION (SIGN UP) */}
              {/* ========================================================================= */}
              {authMode === 'signup' && (
                <div>
                  {role === 'citizen' ? (
                    <div>
                      <div className="mb-4">
                        <h3 className="text-lg font-bold text-white flex items-center gap-2">
                          Citizen e-KYC Registration
                          <span className="text-[10px] text-amber-400 font-mono bg-amber-950 border border-amber-800 px-2 py-0.5 rounded">
                            New Account
                          </span>
                        </h3>
                        <p className="text-xs text-slate-400 mt-1">
                          Register your citizen identity once to unlock one-click applications across all ministries.
                        </p>
                      </div>

                      {!signUpOtpStep ? (
                        <form onSubmit={handleCitizenSignUpOtp} className="space-y-3.5">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                              <label className="block text-xs font-semibold text-slate-300 mb-1">
                                Full Name (as on Identity)
                              </label>
                              <input
                                type="text"
                                value={signUpName}
                                onChange={(e) => setSignUpName(e.target.value)}
                                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-amber-500"
                                placeholder="e.g. Vikramaditya Verma"
                                required
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-semibold text-slate-300 mb-1">
                                Aadhaar / National ID
                              </label>
                              <input
                                type="text"
                                value={signUpAadhaar}
                                onChange={(e) => setSignUpAadhaar(e.target.value)}
                                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono text-xs focus:outline-none focus:border-amber-500"
                                placeholder="AADHAAR-XXXX-XXXX"
                                required
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                              <label className="block text-xs font-semibold text-slate-300 mb-1">
                                Mobile Number (Aadhaar linked)
                              </label>
                              <input
                                type="text"
                                value={signUpPhone}
                                onChange={(e) => setSignUpPhone(e.target.value)}
                                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-amber-500"
                                placeholder="+91 94150 99881"
                                required
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-semibold text-slate-300 mb-1">
                                Beneficiary Primary Category
                              </label>
                              <select
                                value={signUpCategory}
                                onChange={(e) => setSignUpCategory(e.target.value)}
                                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-amber-500"
                              >
                                <option>Farmer / Agriculture</option>
                                <option>Student / Higher Education</option>
                                <option>MSME / Small Business Entrepreneur</option>
                                <option>Healthcare & Jan Arogya</option>
                                <option>General Citizen</option>
                              </select>
                            </div>
                          </div>

                          {/* DEPA Consent Checkbox */}
                          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300">
                            <label className="flex items-start gap-2.5 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={signUpConsent}
                                onChange={(e) => setSignUpConsent(e.target.checked)}
                                className="mt-0.5 w-4 h-4 rounded text-amber-500 bg-slate-900 border-slate-700 focus:ring-amber-500"
                              />
                              <span className="text-[11px] leading-relaxed text-slate-300">
                                <strong>DEPA Consent Mandate:</strong> I authorize GovBridge to federate my DigiLocker and UIDAI demographics token for automated cross-departmental verification without repeated paper submissions.
                              </span>
                            </label>
                          </div>

                          <button
                            type="submit"
                            disabled={isSendingOtp}
                            className="w-full py-3 px-4 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-xl shadow-lg shadow-amber-600/20 transition-all flex items-center justify-center gap-2 text-xs cursor-pointer disabled:opacity-50"
                          >
                            {isSendingOtp ? (
                              <span>Dispatching OTP via UIDAI...</span>
                            ) : (
                              <>
                                <span>Proceed to Aadhaar OTP Verification</span>
                                <ArrowRight className="w-4 h-4" />
                              </>
                            )}
                          </button>
                        </form>
                      ) : (
                        <form onSubmit={handleCitizenCompleteSignUp} className="space-y-4 animate-in fade-in duration-200">
                          <div className="p-3.5 rounded-xl bg-amber-950/40 border border-amber-800/60 text-xs">
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-bold text-amber-300">Registration OTP Dispatched</span>
                              <button
                                type="button"
                                onClick={() => setSignUpOtpStep(false)}
                                className="text-[11px] text-amber-400 hover:underline cursor-pointer"
                              >
                                Edit Profile
                              </button>
                            </div>
                            <p className="text-[11px] text-slate-300">
                              Sent to {signUpPhone} for new citizen profile: <strong>{signUpName}</strong>.
                            </p>
                          </div>

                          <div>
                            <div className="flex items-center justify-between mb-1">
                              <label className="text-xs font-semibold text-slate-300">
                                Enter 6-Digit OTP
                              </label>
                              <button
                                type="button"
                                onClick={() => setSignUpOtp('123456')}
                                className="text-[11px] text-amber-400 hover:underline cursor-pointer font-bold"
                              >
                                Autofill Test OTP (123456)
                              </button>
                            </div>
                            <input
                              type="text"
                              value={signUpOtp}
                              onChange={(e) => setSignUpOtp(e.target.value)}
                              className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-amber-500/50 text-white font-mono text-center tracking-widest text-lg font-bold focus:outline-none focus:ring-2 focus:ring-amber-500"
                              placeholder="123456"
                              maxLength={6}
                              autoFocus
                              required
                            />
                          </div>

                          <button
                            type="submit"
                            disabled={isSigningUp}
                            className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-lg shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 text-xs cursor-pointer disabled:opacity-50"
                          >
                            {isSigningUp ? (
                              <span>Creating Interoperable Profile...</span>
                            ) : (
                              <>
                                <CheckCircle2 className="w-4 h-4" />
                                <span>Complete Sign Up & Launch Dashboard</span>
                              </>
                            )}
                          </button>
                        </form>
                      )}
                    </div>
                  ) : (
                    /* Official Registration / Provisioning */
                    <form onSubmit={handleOfficialRegister} className="space-y-3.5">
                      <div>
                        <h3 className="text-lg font-bold text-white flex items-center gap-2">
                          Official Adjudicator Registration
                          <span className="text-[10px] text-emerald-400 font-mono bg-emerald-950 border border-emerald-800 px-2 py-0.5 rounded">
                            NIC Provisioning
                          </span>
                        </h3>
                        <p className="text-xs text-slate-400 mt-1">
                          Register a new departmental officer profile for sanctioning applications and resolving grievances.
                        </p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-semibold text-slate-300 mb-1">
                            Officer Name & Title
                          </label>
                          <input
                            type="text"
                            value={officialRegName}
                            onChange={(e) => setOfficialRegName(e.target.value)}
                            className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-emerald-500"
                            placeholder="e.g. Shri Rajesh Sharma, IAS"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-slate-300 mb-1">
                            Official NIC Email
                          </label>
                          <input
                            type="email"
                            value={officialRegEmail}
                            onChange={(e) => setOfficialRegEmail(e.target.value)}
                            className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-emerald-500"
                            placeholder="officer.dept@nic.in"
                            required
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-semibold text-slate-300 mb-1">
                            Nodal Department
                          </label>
                          <select
                            value={officialRegDept}
                            onChange={(e) => setOfficialRegDept(e.target.value)}
                            className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-emerald-500"
                          >
                            <option>Ministry of Agriculture & Farmers Welfare</option>
                            <option>National Health Authority (NHA)</option>
                            <option>Ministry of New and Renewable Energy</option>
                            <option>Revenue & District Administration</option>
                            <option>Social Justice & Empowerment</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-slate-300 mb-1">
                            Security PIN / Passcode
                          </label>
                          <input
                            type="password"
                            value={officialRegPin}
                            onChange={(e) => setOfficialRegPin(e.target.value)}
                            className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono text-xs focus:outline-none focus:border-emerald-500"
                            placeholder="e.g. 9988"
                            required
                          />
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={isRegisteringOfficial}
                        className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-lg shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 text-xs cursor-pointer disabled:opacity-50"
                      >
                        {isRegisteringOfficial ? (
                          <span>Provisioning Officer Credentials...</span>
                        ) : (
                          <>
                            <UserPlus className="w-4 h-4" />
                            <span>Complete Registration & Open Desk</span>
                          </>
                        )}
                      </button>
                    </form>
                  )}
                </div>
              )}

              {/* Guest Explore Option */}
              <div className="mt-6 pt-4 border-t border-slate-800 text-center">
                <button
                  type="button"
                  onClick={onContinueAsGuest}
                  className="text-xs text-slate-400 hover:text-amber-400 font-medium hover:underline cursor-pointer inline-flex items-center gap-1.5"
                >
                  <span>Explore Public Welfare Schemes & Connectors as Guest Visitor</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-950/80 px-6 py-3.5 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>Smart India Hackathon 2026 — DevCrew (PS 26129)</span>
          <div className="flex items-center gap-3 text-[11px] text-slate-400">
            <span>TLS 1.3 / AES-256</span>
            <span>•</span>
            <span>DEPA Consent Layer</span>
            <span>•</span>
            <span>Hyperledger Fabric Audit</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
