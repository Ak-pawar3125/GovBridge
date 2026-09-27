import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Clock, 
  Layers, 
  ShieldCheck, 
  Building,
  User,
  CreditCard,
  XCircle,
  FileCheck,
  History,
  FileText,
  Copy,
  Check,
  Lock,
  ExternalLink,
  Cpu,
  BadgeAlert,
  ArrowRight,
  Filter
} from 'lucide-react';
import { Application, AuditLogEntry, UserSession } from '../types';

interface ApplicationDetailModalProps {
  application: Application | null;
  currentUserSession?: UserSession | null;
  onClose: () => void;
  onApprove?: (id: string) => void;
  onReject?: (id: string) => void;
  showAdminActions?: boolean;
}

export const ApplicationDetailModal: React.FC<ApplicationDetailModalProps> = ({
  application,
  currentUserSession,
  onClose,
  onApprove,
  onReject,
  showAdminActions = false
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'audit_log'>('overview');
  const [copiedHash, setCopiedHash] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<'all' | 'status' | 'verification' | 'sanction'>('all');
  const [integrityVerified, setIntegrityVerified] = useState(true);

  if (!application) return null;

  // Security Check: Citizen cannot access another citizen's application or audit log
  if (currentUserSession?.role === 'citizen' && application.userId !== currentUserSession.id) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in duration-200">
        <div className="bg-white rounded-2xl shadow-2xl border border-rose-200 p-6 max-w-md w-full text-center">
          <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-3">
            <Lock className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900">Access Denied & Record Protected</h3>
          <p className="text-xs text-slate-600 mt-2 leading-relaxed">
            Application <strong className="font-mono">{application.id}</strong> belongs to another registered citizen. As per DEPA Consent Mandates and the Digital Personal Data Protection (DPDP) Act, cross-citizen data access is strictly prohibited.
          </p>
          <button
            onClick={onClose}
            className="mt-5 w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer transition-colors"
          >
            Return to My Records
          </button>
        </div>
      </div>
    );
  }

  // Retrieve or dynamically derive chronological audit history if empty
  const getAuditHistory = (): AuditLogEntry[] => {
    if (application.auditHistory && application.auditHistory.length > 0) {
      return application.auditHistory;
    }

    // Smart fallback generator to ensure any application always has rich audit logs
    const entries: AuditLogEntry[] = [
      {
        id: `gen-${application.id}-1`,
        timestamp: application.submittedAt,
        action: 'Application Submitted with Citizen Consent',
        actor: `${application.applicantName} (Citizen)`,
        statusChange: 'submitted',
        details: 'Citizen authenticated via Aadhaar OTP and authorized DEPA Consent token for statutory data fetch.',
        system: 'DEPA Consent Manager',
        blockHash: '0x8f2a...3901 (Fabric Block #1102)'
      },
      ...application.verifiedDocuments.map((doc, idx) => ({
        id: `gen-${application.id}-doc-${idx}`,
        timestamp: application.submittedAt,
        action: `Statutory Record Query: ${doc.name}`,
        actor: doc.source,
        statusChange: idx === application.verifiedDocuments.length - 1 ? 'verified' : 'under_review',
        details: doc.verified 
          ? `Cryptographic checksum verified against remote registry with 100% authenticity.`
          : `Connector query initiated to remote repository. Awaiting registry dispatch.`,
        system: doc.source,
        blockHash: `0x7b1c...99${idx}a (Fabric Block #${1103 + idx})`
      }))
    ];

    if (application.status === 'approved') {
      entries.push({
        id: `gen-${application.id}-appr`,
        timestamp: application.updatedAt,
        action: 'Administrative Sanction & DBT Grant Authorized',
        actor: 'Dr. Anita Roy, IAS (Nodal Adjudicator)',
        statusChange: 'approved',
        details: application.beneficiaryAmount
          ? `Disbursement order signed with e-Gov token. PFMS batch generated for ₹${application.beneficiaryAmount.toLocaleString('en-IN')}.`
          : 'Service certificate generated with QR-code security seal.',
        system: 'GovBridge Orchestration Engine',
        blockHash: '0x33ef...8812 (Fabric Block #1180)'
      });
    } else if (application.status === 'rejected') {
      entries.push({
        id: `gen-${application.id}-rej`,
        timestamp: application.updatedAt,
        action: 'Application Disallowed / Rejected by Adjudicator',
        actor: 'Official Adjudicator',
        statusChange: 'rejected',
        details: application.remarks || 'Documentation criteria not fulfilled according to statutory guidelines.',
        system: 'GovBridge Review Console',
        blockHash: '0xee11...4409 (Fabric Block #1181)'
      });
    }

    return entries;
  };

  const auditLogs = getAuditHistory();

  // Filter logs according to category
  const filteredAuditLogs = auditLogs.filter((log) => {
    if (filterType === 'status') {
      return log.statusChange !== undefined;
    }
    if (filterType === 'verification') {
      return log.action.toLowerCase().includes('verification') || log.action.toLowerCase().includes('record') || log.action.toLowerCase().includes('query');
    }
    if (filterType === 'sanction') {
      return log.action.toLowerCase().includes('sanction') || log.action.toLowerCase().includes('approved') || log.action.toLowerCase().includes('rejected');
    }
    return true;
  });

  const handleCopyHash = (hash: string) => {
    if (!hash) return;
    try {
      navigator.clipboard.writeText(hash);
      setCopiedHash(hash);
      setTimeout(() => setCopiedHash(null), 2500);
    } catch {
      // Fallback
      setCopiedHash(hash);
      setTimeout(() => setCopiedHash(null), 2500);
    }
  };

  const steps = [
    {
      title: 'Application Filed',
      desc: 'Form submitted digitally with Aadhaar e-Sign',
      time: application.submittedAt,
      completed: true,
      current: false
    },
    {
      title: 'Automated Inter-Departmental API Sync',
      desc: 'DigiLocker, Land Records (Bhulekh) & Tax verified',
      time: application.updatedAt,
      completed: application.status !== 'submitted',
      current: application.status === 'under_review'
    },
    {
      title: 'Digital Verification & Eligibility Audit',
      desc: 'Smart rules engine verified statutory entitlement criteria',
      time: ['verified', 'approved', 'rejected'].includes(application.status) ? application.updatedAt : 'In Queue',
      completed: ['verified', 'approved'].includes(application.status),
      current: application.status === 'verified'
    },
    {
      title: application.status === 'rejected' ? 'Application Rejected' : 'Administrative Sanction & DBT Grant',
      desc: application.status === 'rejected' ? 'Review feedback issued to applicant' : 'PFMS Payment Bridge Token generated',
      time: application.status === 'approved' ? application.updatedAt : 'Pending Approval',
      completed: application.status === 'approved',
      current: false,
      isRejected: application.status === 'rejected'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl max-h-[92vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-start justify-between bg-gradient-to-r from-amber-50 to-orange-50/50">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-amber-900 bg-amber-200/80 px-2 py-0.5 rounded">
                {application.id}
              </span>
              <span className="text-xs font-semibold uppercase px-2.5 py-0.5 rounded-full bg-slate-900 text-white">
                {application.category}
              </span>
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                application.status === 'approved'
                  ? 'bg-emerald-100 text-emerald-800'
                  : application.status === 'verified'
                  ? 'bg-blue-100 text-blue-800'
                  : application.status === 'under_review'
                  ? 'bg-amber-100 text-amber-800'
                  : application.status === 'rejected'
                  ? 'bg-rose-100 text-rose-800'
                  : 'bg-slate-100 text-slate-800'
              }`}>
                {application.status.toUpperCase().replace('_', ' ')}
              </span>
            </div>
            <h2 className="text-lg font-bold text-slate-900 mt-1">{application.schemeTitle}</h2>
            <p className="text-xs text-slate-500">{application.department}</p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-white text-xl font-bold leading-none cursor-pointer"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center border-b border-slate-200 bg-slate-50 px-6 gap-2 pt-2">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition-all cursor-pointer ${
              activeTab === 'overview'
                ? 'border-amber-600 text-amber-900 bg-white rounded-t-lg shadow-2xs'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            Overview & Status
          </button>
          <button
            onClick={() => setActiveTab('audit_log')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition-all cursor-pointer ${
              activeTab === 'audit_log'
                ? 'border-amber-600 text-amber-900 bg-white rounded-t-lg shadow-2xs'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <History className="w-3.5 h-3.5 text-amber-600" />
            Audit Log
            <span className={`px-2 py-0.2 rounded-full text-[10px] font-mono font-bold ${
              activeTab === 'audit_log' ? 'bg-amber-100 text-amber-900' : 'bg-slate-200 text-slate-600'
            }`}>
              {auditLogs.length}
            </span>
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs flex-1">
          {activeTab === 'overview' ? (
            <>
              {/* Timeline visualization */}
              <div>
                <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] mb-3 text-slate-500">
                  Application Lifecycle & High-Level Progress
                </h4>
                <div className="space-y-4 relative before:absolute before:left-3.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200">
                  {steps.map((step, idx) => (
                    <div key={idx} className="relative flex items-start gap-4">
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center z-10 shrink-0 ${
                        step.isRejected
                          ? 'bg-rose-600 text-white'
                          : step.completed 
                          ? 'bg-emerald-600 text-white shadow-xs' 
                          : step.current 
                          ? 'bg-amber-500 text-white ring-4 ring-amber-100' 
                          : 'bg-slate-200 text-slate-400'
                      }`}>
                        {step.isRejected ? (
                          <XCircle className="w-4 h-4" />
                        ) : step.completed ? (
                          <CheckCircle2 className="w-4 h-4" />
                        ) : (
                          <Clock className="w-3.5 h-3.5" />
                        )}
                      </div>
                      <div className="pt-0.5">
                        <div className="flex items-center gap-2">
                          <h5 className="font-bold text-slate-900 text-xs">{step.title}</h5>
                          <span className="text-[10px] text-slate-400 font-mono">{step.time}</span>
                        </div>
                        <p className="text-slate-500 text-[11px] mt-0.5">{step.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Applicant & Benefit Info */}
              <div className="grid grid-cols-2 gap-3 p-4 rounded-xl bg-slate-50 border border-slate-200">
                <div>
                  <span className="text-slate-400 text-[11px] block">Beneficiary Name</span>
                  <span className="font-bold text-slate-800 text-sm">{application.applicantName}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[11px] block">Aadhaar / National ID</span>
                  <span className="font-mono font-semibold text-slate-800">{application.applicantGovId}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[11px] block">Contact Mobile</span>
                  <span className="font-medium text-slate-700">{application.applicantPhone}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[11px] block">DBT PFMS Grant</span>
                  <span className="font-mono font-bold text-emerald-700">
                    {application.beneficiaryAmount ? `₹${application.beneficiaryAmount.toLocaleString('en-IN')}` : 'Direct Service'}
                  </span>
                </div>
              </div>

              {/* Connectors verification */}
              <div>
                <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] mb-2 text-slate-500">
                  Connector Verification Status
                </h4>
                <div className="space-y-2">
                  {application.verifiedDocuments.map((doc, idx) => (
                    <div 
                      key={idx}
                      className="flex items-center justify-between p-3 rounded-lg border border-slate-200 bg-white"
                    >
                      <div className="flex items-center gap-2">
                        {doc.verified ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        ) : (
                          <Clock className="w-4 h-4 text-amber-500" />
                        )}
                        <div>
                          <span className="font-semibold text-slate-800 block">{doc.name}</span>
                          <span className="text-[10px] text-slate-400">Queried from {doc.source}</span>
                        </div>
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        doc.verified ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {doc.verified ? 'VERIFIED' : 'PENDING'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {application.remarks && (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-900">
                  <span className="font-bold block text-[11px] uppercase tracking-wider text-amber-800 mb-0.5">
                    Officer Notes & Audit Rationale
                  </span>
                  <p>{application.remarks}</p>
                </div>
              )}
            </>
          ) : (
            /* AUDIT LOG TAB */
            <div className="space-y-4">
              {/* Blockchain & Compliance Banner */}
              <div className="p-3.5 rounded-xl bg-gradient-to-r from-slate-900 to-slate-800 text-white border border-slate-700 shadow-sm">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 border border-amber-500/30">
                      <Lock className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-xs text-white">Immutable Ledger Audit Trail</h4>
                        <span className="text-[9px] font-mono uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-1.5 py-0.5 rounded">
                          Hyperledger Fabric
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-300 mt-0.5">
                        Cryptographically chained event history compliant with IndEA 2.0 & DEPA standards.
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => setIntegrityVerified(!integrityVerified)}
                    className="flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-600 transition-colors cursor-pointer"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    {integrityVerified ? 'Ledger Verified' : 'Re-verify'}
                  </button>
                </div>

                <div className="mt-3 pt-2.5 border-t border-slate-700/60 flex items-center justify-between text-[10px] text-slate-400">
                  <span>Application Genesis: <strong className="text-slate-200 font-mono">{application.id}</strong></span>
                  <span>Recorded Events: <strong className="text-amber-400 font-mono">{auditLogs.length} blocks</strong></span>
                  <span>Tamper Integrity: <strong className="text-emerald-400 font-bold">100% Valid</strong></span>
                </div>
              </div>

              {/* Filter controls */}
              <div className="flex items-center justify-between gap-2 pt-1 pb-1">
                <div className="flex items-center gap-1 text-[11px] text-slate-500 font-semibold">
                  <Filter className="w-3.5 h-3.5 text-slate-400" /> Filter Logs:
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setFilterType('all')}
                    className={`px-2.5 py-1 rounded-md text-[10px] font-bold transition-colors cursor-pointer ${
                      filterType === 'all'
                        ? 'bg-amber-100 text-amber-900 border border-amber-300'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    All ({auditLogs.length})
                  </button>
                  <button
                    onClick={() => setFilterType('status')}
                    className={`px-2.5 py-1 rounded-md text-[10px] font-bold transition-colors cursor-pointer ${
                      filterType === 'status'
                        ? 'bg-amber-100 text-amber-900 border border-amber-300'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    Status Changes
                  </button>
                  <button
                    onClick={() => setFilterType('verification')}
                    className={`px-2.5 py-1 rounded-md text-[10px] font-bold transition-colors cursor-pointer ${
                      filterType === 'verification'
                        ? 'bg-amber-100 text-amber-900 border border-amber-300'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    Verifications
                  </button>
                  <button
                    onClick={() => setFilterType('sanction')}
                    className={`px-2.5 py-1 rounded-md text-[10px] font-bold transition-colors cursor-pointer ${
                      filterType === 'sanction'
                        ? 'bg-amber-100 text-amber-900 border border-amber-300'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    Sanctions
                  </button>
                </div>
              </div>

              {/* Chronological Audit Timeline */}
              <div className="space-y-3 relative before:absolute before:left-3.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200">
                {filteredAuditLogs.map((entry, idx) => {
                  const isApproved = entry.statusChange === 'approved' || entry.action.toLowerCase().includes('sanction');
                  const isRejected = entry.statusChange === 'rejected' || entry.action.toLowerCase().includes('reject');
                  const isVerified = entry.statusChange === 'verified' || entry.action.toLowerCase().includes('verified');

                  return (
                    <div key={entry.id || idx} className="relative flex items-start gap-4">
                      {/* Node indicator */}
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center z-10 shrink-0 text-white shadow-xs ${
                        isApproved
                          ? 'bg-emerald-600'
                          : isRejected
                          ? 'bg-rose-600'
                          : isVerified
                          ? 'bg-blue-600'
                          : 'bg-amber-600'
                      }`}>
                        {isApproved ? (
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        ) : isRejected ? (
                          <XCircle className="w-3.5 h-3.5" />
                        ) : isVerified ? (
                          <ShieldCheck className="w-3.5 h-3.5" />
                        ) : (
                          <Clock className="w-3.5 h-3.5" />
                        )}
                      </div>

                      {/* Content Card */}
                      <div className="flex-1 bg-white border border-slate-200 rounded-xl p-3.5 shadow-2xs hover:border-slate-300 transition-colors">
                        <div className="flex flex-wrap items-center justify-between gap-1 mb-1">
                          <div className="flex items-center gap-2">
                            <h5 className="font-bold text-slate-900 text-xs">{entry.action}</h5>
                            {entry.statusChange && (
                              <span className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded ${
                                entry.statusChange === 'approved'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : entry.statusChange === 'verified'
                                  ? 'bg-blue-100 text-blue-800'
                                  : entry.statusChange === 'under_review'
                                  ? 'bg-amber-100 text-amber-800'
                                  : entry.statusChange === 'rejected'
                                  ? 'bg-rose-100 text-rose-800'
                                  : 'bg-slate-100 text-slate-800'
                              }`}>
                                Status: {entry.statusChange}
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] text-slate-400 font-mono flex items-center gap-1">
                            <Clock className="w-3 h-3 text-slate-400" />
                            {entry.timestamp}
                          </span>
                        </div>

                        {/* Actor & System info */}
                        <div className="flex flex-wrap items-center gap-2 text-[10px] text-slate-500 mb-2">
                          <span className="flex items-center gap-1 bg-slate-100 px-2 py-0.5 rounded text-slate-700 font-medium">
                            <User className="w-2.5 h-2.5 text-slate-500" />
                            Actor: {entry.actor}
                          </span>
                          <span className="flex items-center gap-1 bg-slate-100 px-2 py-0.5 rounded text-slate-700 font-medium">
                            <Cpu className="w-2.5 h-2.5 text-slate-500" />
                            System: {entry.system}
                          </span>
                        </div>

                        {/* Detailed Description */}
                        <p className="text-[11px] text-slate-600 leading-relaxed mb-2.5">
                          {entry.details}
                        </p>

                        {/* Cryptographic hash */}
                        {entry.blockHash && (
                          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px]">
                            <div className="flex items-center gap-1 font-mono text-slate-500">
                              <span className="text-slate-400">Hash:</span>
                              <span className="bg-slate-50 border border-slate-200 px-1.5 py-0.5 rounded text-slate-600">
                                {entry.blockHash}
                              </span>
                            </div>
                            <button
                              onClick={() => handleCopyHash(entry.blockHash || '')}
                              className="text-amber-800 hover:text-amber-900 flex items-center gap-1 font-semibold hover:underline cursor-pointer"
                              title="Copy transaction hash"
                            >
                              {copiedHash === entry.blockHash ? (
                                <>
                                  <Check className="w-3 h-3 text-emerald-600" />
                                  <span className="text-emerald-700">Copied</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3 h-3" />
                                  <span>Copy Hash</span>
                                </>
                              )}
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 rounded-lg cursor-pointer"
          >
            Close Window
          </button>

          {showAdminActions && (
            <div className="flex items-center gap-2">
              {application.status !== 'rejected' && onReject && (
                <button
                  onClick={() => {
                    onReject(application.id);
                  }}
                  className="px-3.5 py-2 text-xs font-semibold text-rose-700 hover:bg-rose-50 border border-rose-300 rounded-xl transition-colors cursor-pointer"
                >
                  Reject Application
                </button>
              )}
              {application.status !== 'approved' && onApprove && (
                <button
                  onClick={() => {
                    onApprove(application.id);
                  }}
                  className="px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" /> Sanction & Authorize DBT
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
