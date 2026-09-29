import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminService } from '../../services/adminService';
import { issueService } from '../../services/issueService';
import { StatCard } from '../../components/analytics/StatCard';
import { Button } from '../../components/common/Button';
import { Card, CardHeader, CardContent } from '../../components/common/Card';
import { StatusBadge, PriorityBadge } from '../../components/common/Badge';
import { AssignStaffModal } from '../../components/issues/AssignStaffModal';
import { Loader } from '../../components/common/Loader';
import { formatDate } from '../../utils/formatters';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  CartesianGrid,
} from 'recharts';
import {
  Users,
  AlertTriangle,
  FileText,
  UserCheck,
  CheckCircle2,
  Clock,
  ArrowRight,
  Shield,
  Layers,
  Sparkles,
  MapPin,
  TrendingUp,
} from 'lucide-react';

const PRIORITY_COLORS = {
  LOW: '#94a3b8',
  MEDIUM: '#3b82f6',
  HIGH: '#f59e0b',
  CRITICAL: '#ef4444',
};

const CATEGORY_COLORS = ['#3b82f6', '#f59e0b', '#6366f1', '#a855f7', '#10b981', '#14b8a6', '#06b6d4', '#f97316', '#f43f5e', '#64748b'];

export const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [assignModalIssue, setAssignModalIssue] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [statsData, analyticsData] = await Promise.all([
        adminService.getDashboardStats(),
        adminService.getAnalytics(),
      ]);
      setStats(statsData);
      setAnalytics(analyticsData);
    } catch (err) {
      console.error('Failed to load admin dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAssignSuccess = async (staffId, note) => {
    if (!assignModalIssue) return;
    await issueService.assignIssue(assignModalIssue.id, staffId, note);
    setAssignModalIssue(null);
    await loadData();
  };

  if (loading) {
    return <Loader message="Loading administrative intelligence..." />;
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 p-6 sm:p-8 text-white shadow-xl border border-purple-800/40">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs font-semibold mb-3 border border-purple-500/30">
              <Shield className="w-3.5 h-3.5" /> Campus Operations Command Center
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Executive Administration Dashboard
            </h2>
            <p className="text-xs sm:text-sm text-purple-200 mt-1 max-w-xl">
              Real-time issue telemetry, staff workload distribution, and campus service resolution metrics.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="md"
              onClick={() => navigate('/admin/analytics')}
              icon={TrendingUp}
              className="bg-white/10 hover:bg-white/20 text-white border border-white/20"
            >
              Full Analytics
            </Button>
            <Button
              variant="primary"
              size="md"
              onClick={() => navigate('/admin/issues')}
              icon={ArrowRight}
            >
              Manage Issues
            </Button>
          </div>
        </div>
      </div>

      {/* KPI Counters */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        <StatCard
          title="Total Issues"
          value={stats?.totalIssues}
          icon={FileText}
          color="blue"
          onClick={() => navigate('/admin/issues')}
        />
        <StatCard
          title="Critical Issues"
          value={stats?.criticalIssues}
          icon={AlertTriangle}
          color="rose"
          critical={(stats?.criticalIssues || 0) > 0}
          onClick={() => navigate('/admin/issues?priority=CRITICAL')}
        />
        <StatCard
          title="Pending Triage"
          value={stats?.reportedIssues}
          icon={Clock}
          color="amber"
          onClick={() => navigate('/admin/issues?status=REPORTED')}
        />
        <StatCard
          title="In Progress"
          value={stats?.inProgressIssues}
          icon={Layers}
          color="indigo"
          onClick={() => navigate('/admin/issues?status=IN_PROGRESS')}
        />
        <StatCard
          title="Resolved"
          value={(stats?.resolvedIssues || 0) + (stats?.closedIssues || 0)}
          icon={CheckCircle2}
          color="emerald"
          subtitle={`${analytics?.resolutionRate || 0}% rate`}
          onClick={() => navigate('/admin/issues?status=RESOLVED')}
        />
        <StatCard
          title="Total Users"
          value={stats?.totalUsers}
          icon={Users}
          color="purple"
          subtitle={`${stats?.totalStudents || 0} st / ${stats?.totalStaff || 0} stf`}
          onClick={() => navigate('/admin/users')}
        />
      </div>

      {/* Newly Reported Tickets Requiring Administrative Triage */}
      {stats?.unassignedIssues && stats.unassignedIssues.length > 0 && (
        <div className="rounded-2xl border border-amber-500/40 bg-gradient-to-r from-amber-950/30 via-slate-900 to-slate-900 p-5 shadow-xl shadow-amber-950/20">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-2.5">
              <span className="flex h-3 w-3 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
              </span>
              <div>
                <h3 className="text-sm font-bold text-amber-200 uppercase tracking-wider">
                  Action Required: {stats.unassignedIssues.length} Newly Reported Ticket{stats.unassignedIssues.length > 1 ? 's' : ''} Awaiting Staff Assignment
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Recent tickets submitted by students that need immediate assignment to a maintenance staff member.
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/admin/issues?status=REPORTED')}
              className="border-amber-500/40 text-amber-300 hover:bg-amber-500/10 shrink-0"
            >
              View All Unassigned
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {stats.unassignedIssues.map((issue) => (
              <div
                key={issue.id}
                onClick={() => navigate(`/issues/${issue.id}`)}
                className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-amber-500/50 cursor-pointer transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-xs font-mono font-bold text-brand-400">#{issue.issueCode}</span>
                    <PriorityBadge priority={issue.priority} />
                  </div>
                  <h4 className="text-sm font-bold text-white line-clamp-1">{issue.title}</h4>
                  <p className="text-xs text-slate-400 flex items-center gap-1 mt-1 truncate">
                    <MapPin className="w-3.5 h-3.5 shrink-0 text-slate-500" /> {issue.location}
                  </p>
                  <p className="text-[11px] text-slate-400 mt-1">Reported by: <span className="text-slate-300 font-medium">{issue.createdByName}</span></p>
                </div>

                <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between">
                  <span className="text-[11px] text-amber-400 font-semibold flex items-center gap-1">
                    <Clock className="w-3 h-3" /> Needs Staff
                  </span>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      setAssignModalIssue(issue);
                    }}
                    icon={UserCheck}
                    className="py-1 px-2.5 text-xs bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold border-none"
                  >
                    Assign Staff
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Breakdown */}
        <Card className="p-6">
          <h3 className="text-sm font-bold text-white mb-1">Issues by Campus Category</h3>
          <p className="text-xs text-slate-400 mb-4">Distribution of reported maintenance tickets</p>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analytics?.categoryDistribution || []} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fontSize: 10 }} interval={0} angle={-35} textAnchor="end" />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1e293b', borderRadius: '12px', border: 'none', color: '#fff', fontSize: '12px' }}
                />
                <Bar dataKey="count" fill="#0c87eb" radius={[6, 6, 0, 0]}>
                  {(analytics?.categoryDistribution || []).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={CATEGORY_COLORS[index % CATEGORY_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Priority Breakdown (Donut) */}
        <Card className="p-6">
          <h3 className="text-sm font-semibold text-slate-900 mb-1">Issues by Priority</h3>
          <p className="text-xs text-slate-400 mb-4">Urgency levels across open and closed campus tickets</p>
          <div className="h-64 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={analytics?.priorityDistribution || []}
                  dataKey="count"
                  nameKey="priority"
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={85}
                  paddingAngle={4}
                  label={({ priority, count }) => `${priority}: ${count}`}
                >
                  {(analytics?.priorityDistribution || []).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={PRIORITY_COLORS[entry.priority] || '#3b82f6'} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#1e293b', borderRadius: '12px', border: 'none', color: '#fff', fontSize: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* 7-Day Trend */}
        <Card className="p-6">
          <h3 className="text-sm font-semibold text-slate-900 mb-1">Issue Activity Over Time</h3>
          <p className="text-xs text-slate-400 mb-4">Reported vs. Resolved ticket trends over past 7 days</p>
          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={analytics?.trendData || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1e293b', borderRadius: '12px', border: 'none', color: '#fff', fontSize: '12px' }}
                />
                <Line type="monotone" dataKey="reported" stroke="#ef4444" strokeWidth={2} dot={{ r: 3 }} name="Reported" />
                <Line type="monotone" dataKey="resolved" stroke="#10b981" strokeWidth={2} dot={{ r: 3 }} name="Resolved" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Staff Workload */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-slate-900">Staff Workload Distribution</h3>
              <p className="text-xs text-slate-400 mt-0.5">Active tasks assigned per staff personnel</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/admin/staff')}
            >
              Roster
            </Button>
          </div>

          <div className="space-y-3.5">
            {(analytics?.staffWorkload || []).map((staff) => (
              <div key={staff.staffId} className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <div>
                    <span className="font-bold text-slate-900">{staff.name}</span>
                    <span className="text-slate-400 ml-2">({staff.department})</span>
                  </div>
                  <span className="font-mono font-semibold text-brand-600">
                    {staff.active} active / {staff.resolved} resolved
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
                  <div
                    className="h-full bg-brand-600 rounded-full transition-all duration-300"
                    style={{
                      width: `${Math.min(100, Math.max(10, (staff.active / (staff.total || 1)) * 100))}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Recent Issues with Direct Assignment */}
      <Card>
        <CardHeader
          title="Recent Campus Tickets"
          subtitle="Latest submissions requiring administrative triage or monitoring"
          action={
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/admin/issues')}
              icon={ArrowRight}
            >
              View All Tickets
            </Button>
          }
        />

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-950/80 border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="px-6 py-3.5">Ticket ID</th>
                <th className="px-6 py-3.5">Title & Location</th>
                <th className="px-6 py-3.5">Category</th>
                <th className="px-6 py-3.5">Priority</th>
                <th className="px-6 py-3.5">Status</th>
                <th className="px-6 py-3.5">Assigned Staff</th>
                <th className="px-6 py-3.5 text-right">Triage Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {(stats?.recentIssues || []).map((issue) => (
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
                      <span className="inline-flex items-center gap-1 text-amber-400 font-semibold bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20 text-xs">
                        Needs Staff
                      </span>
                    )}
                  </td>
                  <td
                    className="px-6 py-4 text-right whitespace-nowrap"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Button
                      variant={issue.assignedStaffName ? 'outline' : 'primary'}
                      size="sm"
                      onClick={() => setAssignModalIssue(issue)}
                      icon={UserCheck}
                    >
                      {issue.assignedStaffName ? 'Reassign' : 'Assign Staff'}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Staff Assignment Modal */}
      {assignModalIssue && (
        <AssignStaffModal
          isOpen={!!assignModalIssue}
          onClose={() => setAssignModalIssue(null)}
          issue={assignModalIssue}
          onAssignSuccess={handleAssignSuccess}
        />
      )}
    </div>
  );
};
