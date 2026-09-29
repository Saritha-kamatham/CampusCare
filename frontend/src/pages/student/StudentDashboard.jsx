import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { StatCard } from '../../components/analytics/StatCard';
import { Button } from '../../components/common/Button';
import { Card, CardHeader, CardContent } from '../../components/common/Card';
import { StatusBadge, PriorityBadge } from '../../components/common/Badge';
import { Loader } from '../../components/common/Loader';
import { formatDate } from '../../utils/formatters';
import {
  PlusCircle,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
  ArrowRight,
  ListFilter,
  Sparkles,
  MapPin,
  User,
} from 'lucide-react';

export const StudentDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const response = await api.get('/student/dashboard');
      setStats(response.data);
    } catch (err) {
      console.error('Failed to load student dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loader message="Loading your dashboard..." />;
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-brand-600 via-brand-700 to-indigo-800 p-6 sm:p-8 text-white shadow-lg">
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-xs font-semibold backdrop-blur-md mb-3">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" /> Student Operations Center
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Campus Service Management
            </h2>
            <p className="text-xs sm:text-sm text-brand-100 mt-1 max-w-xl">
              Report equipment defects, classroom issues, hostel problems, or campus Wi-Fi interruptions with live real-time milestone tracking.
            </p>
          </div>

          <Button
            variant="secondary"
            size="lg"
            onClick={() => navigate('/report-issue')}
            icon={PlusCircle}
            className="bg-white text-brand-700 hover:bg-brand-50 shadow-md font-bold shrink-0"
          >
            Report New Issue
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        <StatCard
          title="Total Reported"
          value={stats?.totalIssues}
          icon={FileText}
          color="blue"
          onClick={() => navigate('/my-issues')}
        />
        <StatCard
          title="Under Review"
          value={stats?.reportedIssues}
          icon={Clock}
          color="amber"
          onClick={() => navigate('/my-issues?status=REPORTED')}
        />
        <StatCard
          title="Assigned"
          value={stats?.assignedIssues}
          icon={User}
          color="indigo"
          onClick={() => navigate('/my-issues?status=ASSIGNED')}
        />
        <StatCard
          title="In Progress"
          value={stats?.inProgressIssues}
          icon={AlertCircle}
          color="purple"
          onClick={() => navigate('/my-issues?status=IN_PROGRESS')}
        />
        <StatCard
          title="Resolved"
          value={stats?.resolvedIssues}
          icon={CheckCircle2}
          color="emerald"
          onClick={() => navigate('/my-issues?status=RESOLVED')}
        />
      </div>

      {/* Recent Issues Table */}
      <Card>
        <CardHeader
          title="Recent Issues Reported by You"
          subtitle="Real-time status updates of your submitted campus service requests"
          action={
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/my-issues')}
              icon={ArrowRight}
            >
              View All
            </Button>
          }
        />

        <div className="overflow-x-auto">
          {stats?.recentIssues && stats.recentIssues.length > 0 ? (
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-950/80 border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="px-6 py-3.5">Ticket ID</th>
                  <th className="px-6 py-3.5">Title & Location</th>
                  <th className="px-6 py-3.5">Category</th>
                  <th className="px-6 py-3.5">Priority</th>
                  <th className="px-6 py-3.5">Status</th>
                  <th className="px-6 py-3.5">Assigned Staff</th>
                  <th className="px-6 py-3.5">Reported</th>
                  <th className="px-6 py-3.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {stats.recentIssues.map((issue) => (
                  <tr
                    key={issue.id}
                    onClick={() => navigate(`/issues/${issue.id}`)}
                    className="hover:bg-slate-800/50 cursor-pointer transition-colors"
                  >
                    <td className="px-6 py-4 font-mono font-bold text-brand-400 whitespace-nowrap">
                      #{issue.issueCode}
                    </td>
                    <td className="px-6 py-4 max-w-xs">
                      <p className="font-semibold text-white truncate">{issue.title}</p>
                      <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5 truncate">
                        <MapPin className="w-3 h-3 shrink-0 text-slate-500" /> {issue.location}
                      </p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-slate-300">
                      {issue.categoryDisplayName || issue.category}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <PriorityBadge priority={issue.priority} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge status={issue.status} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-slate-300">
                      {issue.assignedStaffName || (
                        <span className="text-amber-400 italic">Pending assignment</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-slate-400 text-xs">
                      {formatDate(issue.createdAt)}
                    </td>
                    <td className="px-6 py-4 text-right whitespace-nowrap">
                      <span className="text-xs font-semibold text-brand-400 hover:text-brand-300">
                        Details →
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="py-12 text-center text-slate-400 text-xs sm:text-sm">
              You haven't reported any issues yet.{' '}
              <button
                onClick={() => navigate('/report-issue')}
                className="text-brand-400 hover:underline font-semibold"
              >
                Report your first issue now.
              </button>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};
