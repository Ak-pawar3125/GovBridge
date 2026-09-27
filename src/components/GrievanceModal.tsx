import React, { useState } from 'react';
import { 
  AlertTriangle, 
  Building, 
  HelpCircle, 
  Paperclip, 
  Send, 
  X,
  FileText
} from 'lucide-react';
import { Grievance } from '../types';

interface GrievanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (grievanceData: Omit<Grievance, 'id' | 'submittedAt' | 'updatedAt' | 'status'>) => void;
  defaultCitizen?: {
    name: string;
    govId: string;
    phone: string;
  };
}

export const GrievanceModal: React.FC<GrievanceModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  defaultCitizen
}) => {
  if (!isOpen) return null;

  const [title, setTitle] = useState('');
  const [department, setDepartment] = useState('Ministry of Agriculture & Farmers Welfare');
  const [category, setCategory] = useState('Direct Benefit Transfer / Payment Discrepancy');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<Grievance['priority']>('medium');
  const [citizenName, setCitizenName] = useState(defaultCitizen?.name || '');
  const [citizenGovId, setCitizenGovId] = useState(defaultCitizen?.govId || '');
  const [citizenPhone, setCitizenPhone] = useState(defaultCitizen?.phone || '');

  React.useEffect(() => {
    if (defaultCitizen) {
      setCitizenName(defaultCitizen.name || '');
      setCitizenGovId(defaultCitizen.govId || '');
      setCitizenPhone(defaultCitizen.phone || '');
    }
  }, [defaultCitizen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      alert("Please provide both grievance subject and detailed description.");
      return;
    }

    onSubmit({
      title: title.trim(),
      department,
      category,
      description: description.trim(),
      priority,
      citizenName,
      citizenGovId,
      citizenPhone
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-xl max-h-[90vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-red-50/50 to-amber-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Lodge Official Citizen Grievance</h2>
              <p className="text-xs text-slate-500">Centralized Public Grievance Redress and Monitoring (CPGRAMS Bridge)</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Grievance Subject / Short Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="E.g., Discrepancy in PM-Kisan 3rd installment or delay in certificate"
              className="w-full text-sm px-3.5 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none"
              required
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Target Department / Ministry *
              </label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none bg-white"
              >
                <option value="Ministry of Agriculture & Farmers Welfare">Ministry of Agriculture & Farmers Welfare</option>
                <option value="National Health Authority (NHA)">National Health Authority (NHA)</option>
                <option value="Ministry of New and Renewable Energy">Ministry of New and Renewable Energy</option>
                <option value="Ministry of Social Justice & Empowerment">Ministry of Social Justice & Empowerment</option>
                <option value="Revenue & District Administration">Revenue & District Administration</option>
                <option value="Ministry of Finance & Banking">Ministry of Finance & Banking</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Grievance Category *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none bg-white"
              >
                <option value="Direct Benefit Transfer / Payment Discrepancy">Direct Benefit Transfer / Payment</option>
                <option value="Certificate Correction / e-District Registry">Certificate / Document Error</option>
                <option value="Application Delayed Past Statutory SLA">Delay Beyond Citizen Charter SLA</option>
                <option value="Harassment or Demand for Unofficial Fees">Administrative Redressal / Integrity</option>
                <option value="Portal Sync & Technical Interoperability">Technical / DigiLocker Sync Issue</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Priority Escalation Level
            </label>
            <div className="grid grid-cols-4 gap-2">
              {(['low', 'medium', 'high', 'urgent'] as const).map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPriority(p)}
                  className={`py-1.5 px-2 rounded-lg font-semibold capitalize border text-center transition-all cursor-pointer ${
                    priority === p
                      ? 'bg-amber-600 text-white border-amber-600 shadow-xs'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Factual Narrative / Grievance Details *
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide specific details, application reference number if any, dates, and what resolution you require..."
              rows={4}
              className="w-full text-xs px-3.5 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none leading-relaxed"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3 pt-1 border-t border-slate-100">
            <div>
              <label className="block font-semibold text-slate-600 mb-1">Applicant Name</label>
              <input
                type="text"
                value={citizenName}
                onChange={(e) => setCitizenName(e.target.value)}
                className="w-full text-xs px-3 py-1.5 border border-slate-200 rounded-lg bg-slate-50"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-600 mb-1">Contact Phone</label>
              <input
                type="text"
                value={citizenPhone}
                onChange={(e) => setCitizenPhone(e.target.value)}
                className="w-full text-xs px-3 py-1.5 border border-slate-200 rounded-lg bg-slate-50"
              />
            </div>
          </div>

          <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl text-[11px] text-amber-900 leading-normal">
            <strong>SLA Commitment:</strong> Under the GovBridge Automated Escalation Matrix, urgent grievances are flagged directly to the District Magistrate or Department Joint Secretary if unaddressed within 72 hours.
          </div>

          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 rounded-lg cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" /> Submit Grievance Record
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
