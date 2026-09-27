import React from 'react';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';
import { NotificationToast } from '../types';

interface ToastContainerProps {
  toasts: NotificationToast[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onDismiss }) => {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        let bgStyle = 'bg-white border-slate-200 text-slate-800 shadow-xl';
        let icon = <Info className="w-5 h-5 text-blue-600" />;

        if (toast.type === 'success') {
          bgStyle = 'bg-emerald-950 text-emerald-50 border-emerald-800 shadow-2xl';
          icon = <CheckCircle2 className="w-5 h-5 text-emerald-400" />;
        } else if (toast.type === 'error') {
          bgStyle = 'bg-rose-950 text-rose-50 border-rose-800 shadow-2xl';
          icon = <AlertCircle className="w-5 h-5 text-rose-400" />;
        } else if (toast.type === 'warning') {
          bgStyle = 'bg-amber-950 text-amber-50 border-amber-800 shadow-2xl';
          icon = <AlertTriangle className="w-5 h-5 text-amber-400" />;
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-2xl border transition-all duration-300 animate-in slide-in-from-bottom-5 ${bgStyle}`}
          >
            <div className="shrink-0 mt-0.5">{icon}</div>
            <div className="flex-1 pr-1">
              <h5 className="text-xs font-bold leading-tight">{toast.title}</h5>
              <p className="text-xs opacity-90 mt-0.5 leading-snug">{toast.message}</p>
            </div>
            <button
              onClick={() => onDismiss(toast.id)}
              className="shrink-0 text-current opacity-60 hover:opacity-100 p-0.5 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
