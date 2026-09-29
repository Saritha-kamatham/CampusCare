import React from 'react';
import { Card } from '../common/Card';

export const StatCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  color = 'blue',
  critical = false,
  onClick,
}) => {
  const colorMap = {
    blue: 'bg-brand-500/15 text-brand-400 border-brand-500/30',
    amber: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
    indigo: 'bg-indigo-500/15 text-indigo-400 border-indigo-500/30',
    emerald: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
    rose: 'bg-rose-500/15 text-rose-400 border-rose-500/30',
    purple: 'bg-purple-500/15 text-purple-400 border-purple-500/30',
    slate: 'bg-slate-800/80 text-slate-300 border-slate-700',
  };

  return (
    <Card
      onClick={onClick}
      hover={!!onClick}
      className={`p-5 flex items-start justify-between gap-3 ${
        critical ? 'border-rose-500/60 ring-2 ring-rose-500/20' : ''
      } ${onClick ? 'cursor-pointer' : ''}`}
    >
      <div>
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{title}</p>
        <h4 className="text-2xl sm:text-3xl font-extrabold text-white mt-1 tracking-tight">
          {value ?? 0}
        </h4>
        {subtitle && <p className="text-xs text-slate-400 mt-1 font-medium">{subtitle}</p>}
      </div>

      {Icon && (
        <div className={`p-3 rounded-2xl border ${colorMap[color] || colorMap.blue} shrink-0`}>
          <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
        </div>
      )}
    </Card>
  );
};
