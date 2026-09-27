import React from 'react';
import { 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  User, 
  Phone, 
  Building, 
  MessageSquareReply,
  ShieldAlert
} from 'lucide-react';
import { Grievance } from '../types';

interface GrievanceCardProps {
  grievance: Grievance;
  showAdminActions?: boolean;
  onResolve?: (id: string, note: string) => void;
  onEscalate?: (id: string) => void;
}

export const GrievanceCard: React.FC<GrievanceCardProps> = ({
  grievance,
  showAdminActions = false,
  onResolve,
  onEscalate
}) => {
  const [resolutionInput, setResolutionInput] = React.useState('');
  const [isResolving, setIsResolving] = React.useState(false);

  const getPriorityBadge = (priority: Grievance['priority']) => {
    switch (priority) {
      case 'urgent':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-800 border border-red-300">
            <AlertTriangle className="w-3 h-3 text-red-600" /> Urgent SLA
          </span>
        );
      case 'high':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-orange-100 text-orange-800 border border-orange-300">
            High Priority
          </span>
        );
      case 'medium':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 border border-blue-200">
            Medium
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
            Standard
          </span>
        );
    }
  };

  const getStatusBadge = (status: Grievance['status']) => {
    switch (status) {
      case 'resolved':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
            <CheckCircle2 className="w-3.5 h-3.5" /> Resolved
          </span>
        );
      case 'escalated':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-rose-100 text-rose-800 border border-rose-300">
            <ShieldAlert className="w-3.5 h-3.5" /> Escalated to Secy
          </span>
        );
      case 'in_progress':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 border border-amber-300">
            <Clock className="w-3.5 h-3.5" /> In Redressal
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-800 border border-slate-300">
            Lodged
          </span>
        );
    }
  };

  const handleResolveSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resolutionInput.trim()) return;
    if (onResolve) {
      onResolve(grievance.id, resolutionInput.trim());
    }
    setIsResolving(false);
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 flex flex-col justify-between">
      <div>
        <div className="flex items-start justify-between gap-3 mb-2">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="font-mono text-xs font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                {grievance.id}
              </span>
              {getPriorityBadge(grievance.priority)}
            </div>
            <h3 className="font-bold text-slate-900 text-base leading-snug">
              {grievance.title}
            </h3>
            <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
              <Building className="w-3.5 h-3.5 text-slate-400" />
              <span>{grievance.department}</span>
              <span className="text-slate-300">•</span>
              <span className="font-medium text-slate-600">{grievance.category}</span>
            </div>
          </div>
          <div className="shrink-0">{getStatusBadge(grievance.status)}</div>
        </div>

        <p className="text-sm text-slate-600 mt-3 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-100">
          "{grievance.description}"
        </p>

        {/* Citizen details */}
        <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-slate-500 pt-2 border-t border-slate-100">
          <div className="flex items-center gap-1.5 truncate">
            <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate">{grievance.citizenName} ({grievance.citizenGovId})</span>
          </div>
          <div className="flex items-center gap-1.5 text-right justify-end">
            <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>{grievance.citizenPhone}</span>
          </div>
        </div>

        {grievance.assignedOfficer && (
          <div className="mt-2 text-xs text-slate-600 flex items-center gap-1.5 bg-blue-50/60 p-2 rounded border border-blue-100">
            <span className="font-semibold text-blue-900">Assigned Officer:</span>
            <span className="text-blue-800">{grievance.assignedOfficer}</span>
          </div>
        )}

        {grievance.resolutionNote && (
          <div className="mt-3 text-xs bg-emerald-50 border border-emerald-200 rounded-lg p-3 text-emerald-900">
            <span className="font-bold block text-[11px] text-emerald-800 uppercase tracking-wider mb-1 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Resolution Action & Closing Note:
            </span>
            <p className="text-emerald-800">{grievance.resolutionNote}</p>
          </div>
        )}
      </div>

      {/* Admin Actions */}
      {showAdminActions && grievance.status !== 'resolved' && (
        <div className="mt-4 pt-3 border-t border-slate-100">
          {isResolving ? (
            <form onSubmit={handleResolveSubmit} className="space-y-2">
              <label className="text-xs font-semibold text-slate-700 block">
                Provide Official Action / Redressal Note:
              </label>
              <textarea
                value={resolutionInput}
                onChange={(e) => setResolutionInput(e.target.value)}
                placeholder="E.g., Verified with Discom nodal engineer. Subsidy cleared in batch #891..."
                className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none"
                rows={2}
                required
              />
              <div className="flex items-center gap-2 justify-end">
                <button
                  type="button"
                  onClick={() => setIsResolving(false)}
                  className="px-3 py-1 text-xs text-slate-600 hover:text-slate-900 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors cursor-pointer"
                >
                  Confirm & Mark Resolved
                </button>
              </div>
            </form>
          ) : (
            <div className="flex items-center justify-between gap-2">
              <button
                onClick={() => onEscalate && onEscalate(grievance.id)}
                className="text-xs font-semibold text-amber-800 hover:text-amber-900 hover:bg-amber-50 px-2.5 py-1.5 rounded-lg border border-amber-300 transition-colors cursor-pointer"
              >
                Escalate SLA
              </button>
              <button
                onClick={() => setIsResolving(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors cursor-pointer ml-auto shadow-sm"
              >
                <MessageSquareReply className="w-3.5 h-3.5" /> Close Grievance
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
