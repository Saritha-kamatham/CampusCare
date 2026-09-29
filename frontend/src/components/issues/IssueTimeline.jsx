import React from 'react';
import { Check, Clock, CircleDot, AlertCircle } from 'lucide-react';
import { formatDate } from '../../utils/formatters';

const STEPS = [
  { key: 'REPORTED', label: 'Reported', timeKey: 'reportedTime' },
  { key: 'ASSIGNED', label: 'Assigned', timeKey: 'assignedTime' },
  { key: 'IN_PROGRESS', label: 'In Progress', timeKey: 'inProgressTime' },
  { key: 'RESOLVED', label: 'Resolved', timeKey: 'resolvedTime' },
  { key: 'CLOSED', label: 'Closed', timeKey: 'closedTime' },
];

const STATUS_ORDER = {
  REPORTED: 1,
  ASSIGNED: 2,
  IN_PROGRESS: 3,
  RESOLVED: 4,
  CLOSED: 5,
};

export const IssueTimeline = ({ issue }) => {
  if (!issue) return null;

  const currentLevel = STATUS_ORDER[issue.status] || 1;

  return (
    <div className="w-full py-4">
      <div className="relative">
        {/* Horizontal connector line on medium+ screens */}
        <div className="hidden sm:block absolute top-5 left-8 right-8 h-0.5 bg-slate-800 -z-0">
          <div
            className="h-full bg-brand-500 transition-all duration-500"
            style={{
              width: `${Math.min(100, Math.max(0, ((currentLevel - 1) / (STEPS.length - 1)) * 100))}%`,
            }}
          />
        </div>

        {/* Step Nodes */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 sm:gap-2 relative z-10">
          {STEPS.map((step, idx) => {
            const stepLevel = idx + 1;
            const isCompleted = stepLevel < currentLevel;
            const isCurrent = stepLevel === currentLevel;
            const isFuture = stepLevel > currentLevel;

            const timeValue = issue[step.timeKey];

            return (
              <div
                key={step.key}
                className="flex sm:flex-col items-center gap-3 sm:gap-2 sm:text-center w-full sm:w-auto"
              >
                {/* Node icon circle */}
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-xs border-2 transition-all duration-300 ${
                    isCompleted
                      ? 'bg-emerald-600 border-emerald-500 text-white shadow-md shadow-emerald-950/50'
                      : isCurrent
                      ? 'bg-brand-600 border-brand-400 text-white ring-4 ring-brand-500/30 shadow-lg shadow-brand-500/30 animate-pulse'
                      : 'bg-slate-900 border-slate-800 text-slate-500'
                  }`}
                >
                  {isCompleted ? (
                    <Check className="w-5 h-5 stroke-[2.5]" />
                  ) : isCurrent ? (
                    <CircleDot className="w-5 h-5" />
                  ) : (
                    <span>{stepLevel}</span>
                  )}
                </div>

                {/* Node Label & Info */}
                <div className="flex-1 sm:flex-initial">
                  <div className="flex sm:justify-center items-center gap-1.5">
                    <span
                      className={`text-xs sm:text-sm font-semibold ${
                        isCurrent
                          ? 'text-brand-400 font-bold'
                          : isCompleted
                          ? 'text-white'
                          : 'text-slate-500'
                      }`}
                    >
                      {step.label}
                    </span>
                    {isCompleted && (
                      <span className="text-[10px] text-emerald-400 font-bold hidden sm:inline">✓</span>
                    )}
                  </div>

                  <p className="text-[11px] text-slate-400 mt-0.5 whitespace-nowrap">
                    {timeValue ? formatDate(timeValue) : isCurrent ? 'Current stage' : 'Pending'}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
