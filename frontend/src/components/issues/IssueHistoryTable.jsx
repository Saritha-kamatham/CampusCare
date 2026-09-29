import React from 'react';
import { formatDate } from '../../utils/formatters';
import { StatusBadge } from '../common/Badge';
import { ArrowRight, UserCheck, Shield, GraduationCap, History } from 'lucide-react';

export const IssueHistoryTable = ({ history = [] }) => {
  if (!history || history.length === 0) {
    return (
      <div className="text-center py-8 text-slate-400 text-sm">
        No history records found for this issue.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-800">
        {history.map((entry, idx) => {
          let RoleIcon = GraduationCap;
          if (entry.changedByRole === 'ROLE_ADMIN') RoleIcon = Shield;
          if (entry.changedByRole === 'ROLE_STAFF') RoleIcon = UserCheck;

          return (
            <div key={entry.id || idx} className="relative flex items-start gap-4">
              {/* Dot */}
              <div className="absolute -left-6 top-1 w-4 h-4 rounded-full bg-slate-950 border-2 border-brand-500 shadow-sm flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-brand-500" />
              </div>

              <div className="flex-1 bg-slate-950/70 rounded-xl p-4 border border-slate-800">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="p-1 rounded-md bg-slate-800 border border-slate-700 text-slate-300">
                      <RoleIcon className="w-3.5 h-3.5" />
                    </span>
                    <span className="text-xs font-bold text-white">
                      {entry.changedByName || 'System'}
                    </span>
                    <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                      {entry.changedByRole ? entry.changedByRole.replace('ROLE_', '') : 'SYSTEM'}
                    </span>
                  </div>

                  <span className="text-xs text-slate-400">
                    {formatDate(entry.changedAt)}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-xs font-medium text-slate-300 my-1">
                  {entry.oldStatus && (
                    <>
                      <StatusBadge status={entry.oldStatus} />
                      <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
                    </>
                  )}
                  <StatusBadge status={entry.newStatus} />
                </div>

                {entry.note && (
                  <p className="text-xs text-slate-300 mt-2 bg-slate-900/90 p-2.5 rounded-lg border border-slate-800">
                    {entry.note}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
