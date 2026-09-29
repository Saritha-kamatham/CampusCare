import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import { NotificationBell } from '../components/notifications/NotificationBell';
import { Menu, LogOut, User as UserIcon, Shield, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Navbar = ({ onMobileMenuToggle }) => {
  const { user, logout, isStudent, isStaff, isAdmin } = useAuth();
  const { connected } = useNotifications();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getRoleBadge = () => {
    if (isAdmin) {
      return <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-950/80 text-purple-300 border border-purple-800/70">Admin</span>;
    }
    if (isStaff) {
      return <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-950/80 text-blue-300 border border-blue-800/70">Staff</span>;
    }
    return <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-800/70">Student</span>;
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between glass-nav px-4 sm:px-6">
      <div className="flex items-center gap-3">
        <button
          onClick={onMobileMenuToggle}
          className="lg:hidden p-2 rounded-xl text-slate-400 hover:bg-slate-800 focus:outline-none"
          aria-label="Toggle Navigation"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-900/90 text-xs font-medium text-slate-300 border border-slate-800">
            <span
              className={`w-2 h-2 rounded-full ${
                connected ? 'bg-emerald-500 animate-pulse' : 'bg-slate-500'
              }`}
            />
            <span className="hidden sm:inline">
              {connected ? 'Real-Time Sync Active' : 'Connecting Sync...'}
            </span>
            <span className="sm:hidden">{connected ? 'Live' : 'Sync'}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 sm:gap-4">
        <NotificationBell />

        <div className="h-6 w-px bg-slate-800 hidden sm:block" />

        {/* User Pill */}
        <div
          onClick={() => navigate('/profile')}
          className="flex items-center gap-3 p-1.5 sm:px-3 sm:py-1.5 rounded-xl hover:bg-slate-800/80 cursor-pointer transition-colors"
        >
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-brand-600 to-indigo-600 flex items-center justify-center text-white font-semibold text-xs shadow-sm">
            {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <div className="hidden sm:block text-left">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-white leading-none">{user?.name}</span>
              {getRoleBadge()}
            </div>
            <p className="text-[11px] text-slate-400 mt-1 leading-none">{user?.department || user?.email}</p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          title="Sign out"
          className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-950/50 transition-colors"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
