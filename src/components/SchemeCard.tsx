import React from 'react';
import { 
  Building2, 
  Sprout, 
  HeartPulse, 
  GraduationCap, 
  Sun, 
  FileCheck, 
  ArrowRight, 
  CheckCircle2,
  FileSignature
} from 'lucide-react';
import { SchemeInfo } from '../types';

interface SchemeCardProps {
  scheme: SchemeInfo;
  onOpenDetails: (scheme: SchemeInfo) => void;
  onQuickApply: (scheme: SchemeInfo) => void;
}

export const SchemeCard: React.FC<SchemeCardProps> = ({
  scheme,
  onOpenDetails,
  onQuickApply
}) => {
  const getSchemeIcon = (name: string) => {
    switch (name) {
      case 'Sprout': return <Sprout className="w-5 h-5 text-emerald-600" />;
      case 'HeartPulse': return <HeartPulse className="w-5 h-5 text-rose-600" />;
      case 'Building2': return <Building2 className="w-5 h-5 text-blue-600" />;
      case 'GraduationCap': return <GraduationCap className="w-5 h-5 text-purple-600" />;
      case 'Sun': return <Sun className="w-5 h-5 text-amber-500" />;
      default: return <FileCheck className="w-5 h-5 text-indigo-600" />;
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md transition-all p-5 flex flex-col justify-between group">
      <div>
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            {getSchemeIcon(scheme.iconName)}
          </div>
          <div className="flex items-center gap-1.5 flex-wrap justify-end">
            <span className="font-mono text-[10px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
              {scheme.code}
            </span>
            <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              {scheme.badge}
            </span>
          </div>
        </div>

        <h3 className="font-bold text-slate-900 text-base leading-snug group-hover:text-amber-700 transition-colors">
          {scheme.title}
        </h3>
        <p className="text-xs text-slate-500 mt-1">{scheme.department}</p>

        <p className="text-xs text-slate-600 mt-3 line-clamp-2 leading-relaxed">
          {scheme.description}
        </p>

        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
          <div className="flex flex-col">
            <span className="text-[10px] text-slate-400 font-medium">Statutory Entitlement</span>
            <span className="font-bold text-emerald-700">
              {scheme.maxGrant ? `Up to ₹${scheme.maxGrant.toLocaleString('en-IN')}` : 'Certificate / License'}
            </span>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-[10px] text-slate-400 font-medium">Docs Required</span>
            <span className="font-semibold text-slate-700">{scheme.requiredDocs.length} Digital Verifiable</span>
          </div>
        </div>
      </div>

      <div className="mt-5 pt-3 border-t border-slate-100 grid grid-cols-2 gap-2">
        <button
          onClick={() => onOpenDetails(scheme)}
          className="w-full py-2 px-3 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer text-center"
        >
          View Criteria
        </button>
        <button
          onClick={() => onQuickApply(scheme)}
          className="w-full py-2 px-3 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer text-center"
        >
          <FileSignature className="w-3.5 h-3.5" /> Apply Now
        </button>
      </div>
    </div>
  );
};
