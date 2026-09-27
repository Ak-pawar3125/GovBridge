import React, { useState } from 'react';
import { 
  Activity, 
  RefreshCw, 
  CheckCircle2, 
  ExternalLink, 
  ShieldCheck, 
  Database, 
  Server,
  Zap,
  Cpu
} from 'lucide-react';
import { VerificationConnector } from '../types';

interface ConnectorsPanelProps {
  connectors: VerificationConnector[];
  onTriggerSyncAll: () => void;
  onPingConnector: (id: string) => void;
}

export const ConnectorsPanel: React.FC<ConnectorsPanelProps> = ({
  connectors,
  onTriggerSyncAll,
  onPingConnector
}) => {
  const [isSyncing, setIsSyncing] = useState(false);

  const handleSync = () => {
    setIsSyncing(true);
    onTriggerSyncAll();
    setTimeout(() => {
      setIsSyncing(false);
    }, 800);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></div>
            <h3 className="font-bold text-slate-900 text-base">
              National Digital Verification Connectors (Interoperability Bus)
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Real-time API integrations powering instant eligibility verification without physical visits or notarized documents.
          </p>
        </div>

        <button
          onClick={handleSync}
          disabled={isSyncing}
          className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold shadow-xs transition-all cursor-pointer disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
          {isSyncing ? 'Synchronizing Connectors...' : 'Sync All Live Connectors'}
        </button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mt-5">
        {connectors.map((c) => (
          <div
            key={c.id}
            className="p-4 rounded-xl border border-slate-200/90 bg-slate-50/50 hover:bg-white hover:border-amber-300 hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <span className="font-mono text-[11px] font-bold text-slate-600 bg-white px-2 py-0.5 rounded border border-slate-200">
                  {c.type}
                </span>
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                  {c.status.toUpperCase()}
                </span>
              </div>

              <h4 className="font-bold text-sm text-slate-900 leading-snug">
                {c.name}
              </h4>
              <p className="text-xs text-slate-500 mt-0.5">{c.authority}</p>

              <div className="mt-4 grid grid-cols-2 gap-2 pt-3 border-t border-slate-200/70 text-xs">
                <div>
                  <span className="text-slate-400 block text-[11px]">API Latency</span>
                  <span className="font-mono font-bold text-slate-700 flex items-center gap-1">
                    <Zap className="w-3 h-3 text-amber-500" /> {c.latencyMs} ms
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Daily Invocations</span>
                  <span className="font-mono font-bold text-slate-700">
                    {c.recordsVerifiedToday.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] text-slate-500 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Uptime: {c.uptime}
              </span>
              <button
                onClick={() => onPingConnector(c.id)}
                className="text-[11px] font-semibold text-amber-700 hover:text-amber-800 bg-amber-50 hover:bg-amber-100/80 px-2.5 py-1 rounded-md border border-amber-200/60 transition-colors cursor-pointer"
              >
                Send Ping Test
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
