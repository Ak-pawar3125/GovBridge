import React from 'react';
import { 
  CheckCircle2, 
  XCircle, 
  Clock, 
  ShieldCheck, 
  AlertCircle, 
  Send, 
  FileText, 
  IndianRupee,
  Layers,
  ArrowRight
} from 'lucide-react';
import { Application } from '../types';

interface ApplicationCardProps {
  app: Application;
  onSelect?: (app: Application) => void;
  showAdminActions?: boolean;
  onApprove?: (id: string) => void;
  onReject?: (id: string) => void;
  onVerifyDoc?: (appId: string, docIndex: number) => void;
}

export const ApplicationCard: React.FC<ApplicationCardProps> = ({
  app,
  onSelect,
  showAdminActions = false,
  onApprove,
  onReject,
  onVerifyDoc
}) => {
  const getStatusBadge = (status: Application['status']) => {
    switch (status) {
      case 'approved':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300">
            <CheckCircle2 className="w-3.5 h-3.5" /> Approved
          </span>
        );
      case 'verified':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 border border-blue-300">
            <ShieldCheck className="w-3.5 h-3.5" /> Verified
          </span>
        );
      case 'under_review':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-300">
            <Clock className="w-3.5 h-3.5" /> Under Review
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-100 text-rose-800 border border-rose-300">
            <XCircle className="w-3.5 h-3.5" /> Rejected
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-800 border border-slate-300">
            <Send className="w-3.5 h-3.5" /> Submitted
          </span>
        );
    }
  };

  const getDbtBadge = () => {
    if (!app.beneficiaryAmount) return null;
    if (app.dbtStatus === 'credited') {
      return (
        <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
          <IndianRupee className="w-3 h-3" /> ₹{app.beneficiaryAmount.toLocaleString('en-IN')} DBT Credited
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 text-xs font-medium text-slate-600 bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200">
        <IndianRupee className="w-3 h-3" /> ₹{app.beneficiaryAmount.toLocaleString('en-IN')} DBT Pending
      </span>
    );
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all p-5 flex flex-col justify-between group">
      <div>
        <div className="flex items-start justify-between gap-3 mb-2">
          <div className="flex flex-col">
            <span className="font-mono text-xs font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 w-fit mb-1.5">
              {app.id}
            </span>
            <h3 className="font-bold text-slate-900 text-base leading-tight group-hover:text-amber-700 transition-colors">
              {app.schemeTitle}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">{app.department}</p>
          </div>
          <div className="shrink-0">{getStatusBadge(app.status)}</div>
        </div>

        {/* Applicant Meta */}
        <div className="mt-3.5 pt-3 border-t border-slate-100 grid grid-cols-2 gap-2 text-xs">
          <div>
            <span className="text-slate-400 block font-medium">Applicant</span>
            <span className="font-semibold text-slate-700 truncate block">{app.applicantName}</span>
          </div>
          <div>
            <span className="text-slate-400 block font-medium">GovID / Aadhaar</span>
            <span className="font-mono text-slate-700 block truncate">{app.applicantGovId}</span>
          </div>
          <div>
            <span className="text-slate-400 block font-medium">Filed On</span>
            <span className="text-slate-600 block">{app.submittedAt}</span>
          </div>
          <div>
            <span className="text-slate-400 block font-medium">DBT Benefit</span>
            <div>{getDbtBadge()}</div>
          </div>
        </div>

        {/* Documents verification status */}
        <div className="mt-4 bg-slate-50 rounded-lg p-3 border border-slate-100">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-700 mb-2">
            <span className="flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-slate-500" />
              API Verification Matrix
            </span>
            <span className="text-[11px] font-normal text-slate-500">
              {app.verifiedDocuments.filter(d => d.verified).length}/{app.verifiedDocuments.length} Verified
            </span>
          </div>
          <div className="space-y-1.5">
            {app.verifiedDocuments.map((doc, idx) => (
              <div 
                key={idx} 
                className="flex items-center justify-between text-xs py-1 px-2 rounded bg-white border border-slate-200/70"
              >
                <div className="flex items-center gap-2 truncate pr-2">
                  {doc.verified ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  ) : (
                    <AlertCircle className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                  )}
                  <span className="truncate text-slate-700 font-medium">{doc.name}</span>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <span className="text-[10px] text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded font-mono">
                    {doc.source}
                  </span>
                  {showAdminActions && !doc.verified && onVerifyDoc && (
                    <button
                      onClick={() => onVerifyDoc(app.id, idx)}
                      className="text-[10px] bg-blue-600 hover:bg-blue-700 text-white font-medium px-2 py-0.5 rounded transition-colors"
                      title="Trigger automated connector re-verification"
                    >
                      Verify Now
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {app.remarks && (
          <div className="mt-3 text-xs bg-amber-50/60 border border-amber-100 rounded-lg p-2.5 text-amber-900">
            <span className="font-semibold block text-[11px] text-amber-800 uppercase tracking-wider mb-0.5">
              Official Note / Log:
            </span>
            {app.remarks}
          </div>
        )}
      </div>

      {/* Action Footer */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
        {onSelect && (
          <button
            onClick={() => onSelect(app)}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-700 hover:text-amber-800 transition-colors"
          >
            <FileText className="w-3.5 h-3.5" /> View Timeline Details
          </button>
        )}

        {showAdminActions ? (
          <div className="flex items-center gap-2 ml-auto">
            {app.status !== 'rejected' && onReject && (
              <button
                onClick={() => onReject(app.id)}
                className="px-3 py-1.5 text-xs font-semibold text-rose-700 hover:bg-rose-50 border border-rose-300 rounded-lg transition-colors cursor-pointer"
              >
                Reject
              </button>
            )}
            {app.status !== 'approved' && onApprove && (
              <button
                onClick={() => onApprove(app.id)}
                className="px-3.5 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm transition-colors cursor-pointer flex items-center gap-1"
              >
                <CheckCircle2 className="w-3.5 h-3.5" /> Approve & Sanction
              </button>
            )}
          </div>
        ) : (
          <div className="ml-auto">
            <span className="text-[11px] text-slate-400">Last updated: {app.updatedAt}</span>
          </div>
        )}
      </div>
    </div>
  );
};
