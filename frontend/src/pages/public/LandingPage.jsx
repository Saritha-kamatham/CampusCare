import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/common/Button';
import {
  Compass,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Zap,
  Wifi,
  Users,
  Clock,
  Sparkles,
  BarChart3,
  BellRing,
  HelpCircle,
  FileCheck,
} from 'lucide-react';

export const LandingPage = () => {
  const navigate = useNavigate();

  const handleDemoLogin = (role) => {
    navigate(`/login?role=${role}`);
  };

  return (
    <div className="relative overflow-hidden">
      {/* Background radial gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-brand-500/10 blur-[120px] rounded-full pointer-events-none -z-0" />
      <div className="absolute top-40 right-10 w-80 h-80 bg-indigo-500/10 blur-[100px] rounded-full pointer-events-none -z-0" />

      {/* Hero Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24 text-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-800/80 border border-slate-700/80 text-xs font-medium text-brand-400 mb-8 backdrop-blur-md">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Next-Generation Smart Campus Operations Platform</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight leading-tight sm:leading-tight max-w-4xl mx-auto">
          Centralized Campus Service & <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-brand-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
            Real-Time Issue Management
          </span>
        </h1>

        <p className="mt-6 text-base sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Say goodbye to lost WhatsApp messages and untracked complaints. Report campus issues in seconds, monitor live status milestones, and ensure staff accountability with real-time WebSocket notifications.
        </p>

        {/* CTA Buttons */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Button
            variant="primary"
            size="lg"
            onClick={() => navigate('/login')}
            icon={ArrowRight}
          >
            Launch Platform
          </Button>

          <Button
            variant="secondary"
            size="lg"
            onClick={() => handleDemoLogin('admin')}
            className="bg-slate-800 text-slate-200 hover:bg-slate-700 border border-slate-700"
          >
            Explore Live Demo
          </Button>
        </div>

        {/* Demo Quick-Pills */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-2 text-xs text-slate-400">
          <span className="text-slate-500 font-semibold mr-1">One-Click Demos:</span>
          <button
            onClick={() => handleDemoLogin('admin')}
            className="px-2.5 py-1 rounded-lg bg-slate-800/70 hover:bg-slate-700 border border-slate-700 text-slate-300 font-medium transition-colors"
          >
            Admin (Evelyn)
          </button>
          <button
            onClick={() => handleDemoLogin('staff')}
            className="px-2.5 py-1 rounded-lg bg-slate-800/70 hover:bg-slate-700 border border-slate-700 text-slate-300 font-medium transition-colors"
          >
            Staff (Priya)
          </button>
          <button
            onClick={() => handleDemoLogin('student')}
            className="px-2.5 py-1 rounded-lg bg-slate-800/70 hover:bg-slate-700 border border-slate-700 text-slate-300 font-medium transition-colors"
          >
            Student (Alex)
          </button>
        </div>
      </section>

      {/* Problem vs Solution Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Problem */}
          <div className="p-8 rounded-3xl bg-slate-800/40 border border-rose-500/20 backdrop-blur-md">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-400">The Problem</span>
            <h3 className="text-xl font-bold text-white mt-2">Chaos of Informal Communication</h3>
            <p className="text-sm text-slate-400 mt-2">
              Issues reported via WhatsApp, stray phone calls, or verbal hallway remarks get lost, forgotten, and lack accountability.
            </p>
            <ul className="mt-6 space-y-3 text-xs sm:text-sm text-slate-300">
              <li className="flex items-center gap-2.5 text-rose-300">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500" /> Wi-Fi and projector failures halt classes without triage
              </li>
              <li className="flex items-center gap-2.5 text-rose-300">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500" /> Students left in the dark with no status updates
              </li>
              <li className="flex items-center gap-2.5 text-rose-300">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500" /> Administrators cannot measure staff workload or turnaround time
              </li>
            </ul>
          </div>

          {/* Solution */}
          <div className="p-8 rounded-3xl bg-slate-800/40 border border-brand-500/30 backdrop-blur-md">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-400">The Solution</span>
            <h3 className="text-xl font-bold text-white mt-2">CampusCare Single-Pane Operations</h3>
            <p className="text-sm text-slate-400 mt-2">
              A unified system linking Students, Staff, and Administrators in a verified audit lifecycle with real-time push events.
            </p>
            <ul className="mt-6 space-y-3 text-xs sm:text-sm text-slate-300">
              <li className="flex items-center gap-2.5 text-brand-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> Immediate ticket generation and automated admin triage
              </li>
              <li className="flex items-center gap-2.5 text-brand-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> Live WebSocket alerts for assignments & resolution steps
              </li>
              <li className="flex items-center gap-2.5 text-brand-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> Data-backed Recharts analytics and staff performance metrics
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-400">Complete Lifecycle</span>
          <h2 className="text-2xl sm:text-3xl font-bold text-white mt-2">
            How CampusCare Works
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              step: '01',
              title: 'Student Reports',
              desc: 'Selects category, location, priority, and attaches photo proof.',
              icon: FileCheck,
            },
            {
              step: '02',
              title: 'Admin Triages',
              desc: 'Assigns issue to the specialized staff department based on workload.',
              icon: Users,
            },
            {
              step: '03',
              title: 'Staff Resolves',
              desc: 'Accepts ticket, initiates repair work, and submits resolution notes.',
              icon: Zap,
            },
            {
              step: '04',
              title: 'Instant Sync',
              desc: 'Real-time WebSocket alerts notify student and update historical audit log.',
              icon: BellRing,
            },
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-slate-800/30 border border-slate-700/60 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-black text-slate-600">{item.step}</span>
                    <div className="p-2 rounded-xl bg-brand-500/10 text-brand-400 border border-brand-500/20">
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>
                  <h4 className="text-base font-bold text-white">{item.title}</h4>
                  <p className="text-xs text-slate-400 mt-2 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Role Feature Tabs */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="p-8 sm:p-12 rounded-3xl bg-slate-800/50 border border-slate-700/80">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800">
              <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-semibold">
                Student Role
              </span>
              <h4 className="text-lg font-bold text-white mt-4">Transparent Reporting</h4>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Log issues effortlessly with location tagging and image uploads. Track ticket milestones from Reported through Resolved with live alerts.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800">
              <span className="px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-400 text-xs font-semibold">
                Staff Role
              </span>
              <h4 className="text-lg font-bold text-white mt-4">Action-Oriented Workflow</h4>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Receive instant assignment alerts on desktop and mobile. Accept tasks, update progress in real time, and log resolution notes with verification photos.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800">
              <span className="px-2.5 py-1 rounded-full bg-purple-500/10 text-purple-400 text-xs font-semibold">
                Admin Role
              </span>
              <h4 className="text-lg font-bold text-white mt-4">Centralized Command</h4>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Inspect campus-wide KPIs, view staff capacity, balance assignment queues, and monitor live Recharts analytics across all departments.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
