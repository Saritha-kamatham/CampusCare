import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  PlusCircle,
  ListTodo,
  BarChart3,
  Users,
  UserCheck,
  Bell,
  User,
  Shield,
  LifeBuoy,
  X,
  Compass,
} from 'lucide-react';

export const Sidebar = ({ mobileOpen, onClose }) => {
  const { isStudent, isStaff, isAdmin, user } = useAuth();

  const studentLinks = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/report-issue', label: 'Report Issue', icon: PlusCircle, highlight: true },
    { to: '/my-issues', label: 'My Issues', icon: ListTodo },
    { to: '/notifications', label: 'Notifications', icon: Bell },
    { to: '/profile', label: 'Profile', icon: User },
  ];

  const staffLinks = [
    { to: '/staff-dashboard', label: 'Staff Dashboard', icon: LayoutDashboard },
    { to: '/assigned-issues', label: 'Assigned Issues', icon: ListTodo },
    { to: '/notifications', label: 'Notifications', icon: Bell },
    { to: '/profile', label: 'Profile', icon: User },
  ];

  const adminLinks = [
    { to: '/admin-dashboard', label: 'Overview', icon: LayoutDashboard },
    { to: '/admin/issues', label: 'All Issues', icon: ListTodo },
    { to: '/admin/analytics', label: 'Analytics Studio', icon: BarChart3 },
    { to: '/admin/users', label: 'User Directory', icon: Users },
    { to: '/admin/staff', label: 'Staff Workload', icon: UserCheck },
    { to: '/notifications', label: 'Notifications', icon: Bell },
    { to: '/profile', label: 'Profile', icon: User },
  ];

  const links = isAdmin ? adminLinks : isStaff ? staffLinks : studentLinks;

  const content = (
    <div className="flex flex-col h-full bg-slate-900 text-slate-300 w-64 border-r border-slate-800 selection:bg-brand-500 selection:text-white">
      {/* Brand Header */}
      <div className="flex items-center justify-between h-16 px-6 border-b border-slate-800">
        <NavLink to="/" className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-500 flex items-center justify-center text-white shadow-glow-sm">
            <Compass className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div>
            <h1 className="text-base font-bold text-white tracking-tight leading-none">
              Campus<span className="text-brand-400">Care</span>
            </h1>
            <p className="text-[10px] text-slate-400 tracking-wider uppercase mt-1 leading-none">
              Operations Platform
            </p>
          </div>
        </NavLink>
        {mobileOpen && (
          <button
            onClick={onClose}
            className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Nav List */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-1.5">
        <p className="px-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
          {isAdmin ? 'Administration' : isStaff ? 'Staff Portal' : 'Student Portal'}
        </p>

        {links.map((link) => {
          const Icon = link.icon;
          return (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all duration-150 ${
                  isActive
                    ? 'bg-brand-600 text-white shadow-sm shadow-brand-500/30'
                    : link.highlight
                    ? 'bg-brand-500/10 text-brand-400 hover:bg-brand-500/20'
                    : 'text-slate-400 hover:bg-slate-800/80 hover:text-slate-100'
                }`
              }
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{link.label}</span>
            </NavLink>
          );
        })}
      </div>

      {/* Footer Info Box */}
      <div className="p-4 border-t border-slate-800">
        <div className="p-3.5 rounded-xl bg-slate-800/50 border border-slate-700/50">
          <div className="flex items-center gap-2 text-slate-200 text-xs font-semibold">
            <LifeBuoy className="w-4 h-4 text-brand-400" />
            <span>24/7 Campus Dispatch</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
            Emergency hotline: Ext. 4400 or Facilities HQ
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop static sidebar */}
      <aside className="hidden lg:block fixed inset-y-0 left-0 z-40">
        {content}
      </aside>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
            onClick={onClose}
          />
          <div className="fixed inset-y-0 left-0 z-50 flex">
            {content}
          </div>
        </div>
      )}
    </>
  );
};
