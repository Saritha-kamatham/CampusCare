import React from 'react';

export const Card = ({ children, className = '', hover = false, ...props }) => {
  return (
    <div
      className={`bg-slate-900/90 rounded-2xl border border-slate-800/80 shadow-xl shadow-slate-950/40 text-slate-100 ${
        hover ? 'transition-all duration-200 hover:shadow-2xl hover:border-slate-700/80' : ''
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardHeader = ({ title, subtitle, action, className = '' }) => {
  return (
    <div className={`p-5 sm:p-6 border-b border-slate-800/80 flex items-center justify-between gap-4 ${className}`}>
      <div>
        {title && <h3 className="text-base font-bold text-white tracking-tight">{title}</h3>}
        {subtitle && <p className="text-xs sm:text-sm text-slate-400 mt-0.5">{subtitle}</p>}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
};

export const CardContent = ({ children, className = '' }) => {
  return <div className={`p-5 sm:p-6 text-slate-200 ${className}`}>{children}</div>;
};
