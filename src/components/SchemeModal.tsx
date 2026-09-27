import React, { useState } from 'react';
import { 
  Building2, 
  Sprout, 
  HeartPulse, 
  GraduationCap, 
  Sun, 
  FileCheck, 
  ArrowRight, 
  CheckCircle,
  Clock,
  ShieldCheck,
  FileQuestion,
  FileSignature
} from 'lucide-react';
import { SchemeInfo } from '../types';

interface SchemeModalProps {
  scheme: SchemeInfo | null;
  onClose: () => void;
  onApply: (scheme: SchemeInfo, formData: {
    applicantName: string;
    applicantGovId: string;
    applicantPhone: string;
    consentGiven: boolean;
  }) => void;
  defaultCitizen?: {
    name: string;
    govId: string;
    phone: string;
  };
}

export const SchemeModal: React.FC<SchemeModalProps> = ({
  scheme,
  onClose,
  onApply,
  defaultCitizen
}) => {
  if (!scheme) return null;

  const [step, setStep] = useState<'details' | 'apply'>('details');
  const [applicantName, setApplicantName] = useState(defaultCitizen?.name || '');
  const [applicantGovId, setApplicantGovId] = useState(defaultCitizen?.govId || '');
  const [applicantPhone, setApplicantPhone] = useState(defaultCitizen?.phone || '');
  const [consentGiven, setConsentGiven] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  React.useEffect(() => {
    if (defaultCitizen) {
      setApplicantName(defaultCitizen.name || '');
      setApplicantGovId(defaultCitizen.govId || '');
      setApplicantPhone(defaultCitizen.phone || '');
    }
  }, [defaultCitizen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    if (!consentGiven) {
      setFormError("Please provide statutory consent for automated DigiLocker & UIDAI verification.");
      return;
    }
    setIsSubmitting(true);
    // Execute state update smoothly
    setTimeout(() => {
      onApply(scheme, {
        applicantName,
        applicantGovId,
        applicantPhone,
        consentGiven
      });
      setIsSubmitting(false);
      onClose();
    }, 300);
  };

  const getSchemeIcon = (name: string) => {
    switch (name) {
      case 'Sprout': return <Sprout className="w-6 h-6 text-emerald-600" />;
      case 'HeartPulse': return <HeartPulse className="w-6 h-6 text-rose-600" />;
      case 'Building2': return <Building2 className="w-6 h-6 text-blue-600" />;
      case 'GraduationCap': return <GraduationCap className="w-6 h-6 text-purple-600" />;
      case 'Sun': return <Sun className="w-6 h-6 text-amber-500" />;
      default: return <FileCheck className="w-6 h-6 text-indigo-600" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-start justify-between bg-gradient-to-r from-amber-50/70 to-orange-50/30">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-white border border-amber-200 shadow-sm flex items-center justify-center">
              {getSchemeIcon(scheme.iconName)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-amber-800 bg-amber-100/80 px-2 py-0.5 rounded">
                  {scheme.code}
                </span>
                <span className="text-xs font-semibold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-full">
                  {scheme.badge}
                </span>
              </div>
              <h2 className="text-lg font-bold text-slate-900 mt-1">{scheme.title}</h2>
              <p className="text-xs text-slate-500">{scheme.department}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-white/80 transition-colors text-xl font-bold leading-none cursor-pointer"
          >
            ×
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-sm">
          {step === 'details' ? (
            <>
              <div>
                <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider text-slate-500 mb-1.5">
                  About the Scheme
                </h4>
                <p className="text-slate-700 leading-relaxed bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                  {scheme.description}
                </p>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="bg-emerald-50/60 border border-emerald-100 p-3.5 rounded-xl">
                  <h4 className="font-bold text-emerald-900 text-xs flex items-center gap-1.5 mb-1">
                    <CheckCircle className="w-4 h-4 text-emerald-600" /> Financial & Social Benefit
                  </h4>
                  <p className="text-emerald-950 text-xs leading-relaxed mt-1">
                    {scheme.benefits}
                  </p>
                  {scheme.maxGrant && (
                    <div className="mt-2 text-xs font-mono font-bold text-emerald-700">
                      Cap: Up to ₹{scheme.maxGrant.toLocaleString('en-IN')}
                    </div>
                  )}
                </div>

                <div className="bg-amber-50/60 border border-amber-100 p-3.5 rounded-xl">
                  <h4 className="font-bold text-amber-900 text-xs flex items-center gap-1.5 mb-1">
                    <ShieldCheck className="w-4 h-4 text-amber-600" /> Eligibility Criteria
                  </h4>
                  <p className="text-amber-950 text-xs leading-relaxed mt-1">
                    {scheme.eligibility}
                  </p>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider text-slate-500 mb-2">
                  Auto-Fetched / Required Documents via DigiLocker Connectors
                </h4>
                <div className="grid sm:grid-cols-3 gap-2">
                  {scheme.requiredDocs.map((doc, idx) => (
                    <div 
                      key={idx}
                      className="p-2.5 rounded-lg border border-slate-200 bg-white text-xs flex items-center gap-2 font-medium text-slate-700 shadow-2xs"
                    >
                      <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-600 text-[10px] font-bold flex items-center justify-center shrink-0">
                        {idx + 1}
                      </span>
                      <span className="truncate">{doc}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-3.5 bg-blue-50/70 border border-blue-200 rounded-xl text-xs text-blue-900 flex items-start gap-2.5">
                <FileQuestion className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">Zero-Paperwork Verification Guarantee:</span>
                  <p className="mt-0.5 text-blue-800">
                    Applying through GovBridge triggers real-time API verification against national identity and land/tax vaults, reducing turnaround time from 21 days to minutes.
                  </p>
                </div>
              </div>
            </>
          ) : (
            <form id="apply-form" onSubmit={handleSubmit} className="space-y-4">
              {formError && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
                  {formError}
                </div>
              )}
              <div className="bg-amber-50/70 border border-amber-200 p-3.5 rounded-xl text-xs text-amber-900">
                <p className="font-semibold">Fast-Track One-Click Citizen Filing</p>
                <p className="text-amber-800 mt-0.5">
                  Confirm your citizen credentials. Your registered DigiLocker documents will be synchronized automatically.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Full Name of Beneficiary / Applicant
                </label>
                <input
                  type="text"
                  value={applicantName}
                  onChange={(e) => setApplicantName(e.target.value)}
                  className="w-full text-sm px-3.5 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Government ID / Aadhaar / PAN
                  </label>
                  <input
                    type="text"
                    value={applicantGovId}
                    onChange={(e) => setApplicantGovId(e.target.value)}
                    className="w-full text-sm font-mono px-3.5 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Aadhaar-Linked Mobile
                  </label>
                  <input
                    type="text"
                    value={applicantPhone}
                    onChange={(e) => setApplicantPhone(e.target.value)}
                    className="w-full text-sm px-3.5 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div className="pt-2">
                <label className="flex items-start gap-2.5 cursor-pointer bg-slate-50 p-3 rounded-xl border border-slate-200 hover:bg-slate-100/60 transition-colors">
                  <input
                    type="checkbox"
                    checked={consentGiven}
                    onChange={(e) => setConsentGiven(e.target.checked)}
                    className="mt-0.5 h-4 w-4 text-amber-600 rounded border-slate-300 focus:ring-amber-500"
                  />
                  <div className="text-xs text-slate-700">
                    <span className="font-semibold block text-slate-900">
                      Digital Consent for Inter-Departmental Data Exchange
                    </span>
                    I hereby authorize GovBridge to query UIDAI, DigiLocker, PFMS, and state registry APIs on my behalf to verify eligibility for {scheme.title}.
                  </div>
                </label>
              </div>
            </form>
          )}
        </div>

        {/* Footer actions */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
          {step === 'details' ? (
            <>
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 rounded-lg cursor-pointer"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => setStep('apply')}
                className="px-5 py-2.5 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-xl shadow-sm transition-all flex items-center gap-2 cursor-pointer"
              >
                Apply for this Scheme <ArrowRight className="w-4 h-4" />
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={() => setStep('details')}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 rounded-lg cursor-pointer"
              >
                Back to Details
              </button>
              <button
                type="submit"
                form="apply-form"
                disabled={isSubmitting}
                className="px-6 py-2.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>Processing Submission...</>
                ) : (
                  <>
                    <FileSignature className="w-4 h-4" /> Confirm & Submit Application
                  </>
                )}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
