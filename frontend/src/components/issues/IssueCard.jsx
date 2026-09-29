import React from 'react';
import { useNavigate } from 'react-router-dom';
import { StatusBadge, PriorityBadge } from '../common/Badge';
import { formatDate } from '../../utils/formatters';
import { MapPin, User, Clock, ArrowRight } from 'lucide-react';

export const IssueCard = ({ issue }) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/issues/${issue.id}`)}
      className="group bg-slate-900/90 rounded-2xl border border-slate-800 p-5 shadow-xl shadow-slate-950/40 hover:shadow-2xl hover:border-brand-500/50 hover:bg-slate-850/80 transition-all duration-200 cursor-pointer flex flex-col justify-between"
    >
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="text-xs font-mono font-semibold text-brand-400 bg-brand-500/10 border border-brand-500/20 px-2 py-0.5 rounded-md">
            #{issue.issueCode}
          </span>
          <div className="flex items-center gap-1.5">
            <PriorityBadge priority={issue.priority} />
            <StatusBadge status={issue.status} />
          </div>
        </div>

        <h3 className="text-sm sm:text-base font-semibold text-white group-hover:text-brand-400 transition-colors line-clamp-1">
          {issue.title}
        </h3>

        <p className="text-xs text-slate-400 mt-1.5 line-clamp-2 leading-relaxed">
          {issue.description}
        </p>
      </div>

      <div className="mt-4 pt-4 border-t border-slate-800 flex flex-col gap-2">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-1.5 truncate">
            <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
            <span className="truncate">{issue.location}</span>
          </div>
          <span className="text-slate-400 shrink-0">{issue.categoryDisplayName || issue.category}</span>
        </div>

        <div className="flex items-center justify-between text-xs pt-1">
          <div className="flex items-center gap-1.5 text-slate-400">
            <User className="w-3.5 h-3.5 text-slate-500" />
            <span className="truncate">{issue.assignedStaffName ? `Assigned: ${issue.assignedStaffName}` : 'Unassigned'}</span>
          </div>
          <div className="flex items-center gap-1 text-brand-400 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
            View <ArrowRight className="w-3 h-3" />
          </div>
        </div>
      </div>
    </div>
  );
};
