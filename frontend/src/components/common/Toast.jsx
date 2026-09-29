import React from 'react';
import { useNotifications } from '../../context/NotificationContext';
import { Bell, X, CheckCircle, AlertTriangle, Info } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const ToastContainer = () => {
  const { toasts, dismissToast } = useNotifications();
  const navigate = useNavigate();

  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        let Icon = Bell;
        let iconBg = 'bg-brand-500/10 text-brand-400 border border-brand-500/20';
        if (toast.type === 'ISSUE_RESOLVED') {
          Icon = CheckCircle;
          iconBg = 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20';
        } else if (toast.type === 'NEW_ISSUE' || toast.type === 'STATUS_CHANGED') {
          Icon = AlertTriangle;
          iconBg = 'bg-amber-500/10 text-amber-400 border border-amber-500/20';
        }

        return (
          <div
            key={toast.toastId}
            className="pointer-events-auto flex items-start gap-3 p-4 bg-slate-900/95 backdrop-blur-md rounded-2xl shadow-2xl border border-slate-700/80 transform transition-all duration-300 hover:scale-[1.02] cursor-pointer"
            onClick={() => {
              if (toast.issueId) {
                navigate(`/issues/${toast.issueId}`);
              }
              dismissToast(toast.toastId);
            }}
          >
            <div className={`p-2 rounded-xl shrink-0 ${iconBg}`}>
              <Icon className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <h4 className="text-xs font-semibold text-white truncate">
                  {toast.title || 'Notification'}
                </h4>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    dismissToast(toast.toastId);
                  }}
                  className="text-slate-400 hover:text-slate-200 p-0.5"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
              <p className="text-xs text-slate-300 mt-0.5 line-clamp-2">{toast.message}</p>
              {toast.issueCode && (
                <span className="inline-block mt-1 text-[11px] font-semibold text-brand-400">
                  Ticket #{toast.issueCode}
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
