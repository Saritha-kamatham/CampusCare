import React from 'react';
import { PRIORITIES, STATUSES } from '../../utils/constants';

export const StatusBadge = ({ status }) => {
  const config = STATUSES[status] || { label: status, badgeClass: 'bg-slate-100 text-slate-800 border-slate-200' };

  let dotColor = 'bg-slate-400';
  if (status === 'REPORTED') dotColor = 'bg-amber-500 animate-pulse';
  if (status === 'ASSIGNED') dotColor = 'bg-blue-500';
  if (status === 'IN_PROGRESS') dotColor = 'bg-indigo-500 animate-pulse';
  if (status === 'RESOLVED') dotColor = 'bg-emerald-500';
  if (status === 'CLOSED') dotColor = 'bg-slate-400';

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${config.badgeClass}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />
      {config.label}
    </span>
  );
};

export const PriorityBadge = ({ priority }) => {
  const config = PRIORITIES[priority] || { label: priority, badgeClass: 'bg-slate-100 text-slate-700' };

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold border ${config.badgeClass}`}
    >
      {priority === 'CRITICAL' && (
        <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mr-1.5 animate-ping" />
      )}
      {config.label}
    </span>
  );
};

export const CategoryBadge = ({ category, name }) => {
  return (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-slate-800/90 text-slate-300 border border-slate-700/80">
      {name || category}
    </span>
  );
};
