import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { issueService } from '../../services/issueService';
import { StatCard } from '../../components/analytics/StatCard';
import { Button } from '../../components/common/Button';
import { Card, CardHeader, CardContent } from '../../components/common/Card';
import { StatusBadge, PriorityBadge } from '../../components/common/Badge';
import { Loader } from '../../components/common/Loader';
import { StatusChangeModal } from '../../components/issues/StatusChangeModal';
import { formatDate } from '../../utils/formatters';
import {
  ListTodo,
  Clock,
  PlayCircle,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  MapPin,
  Check,
  Wrench,
  Sparkles,
} from 'lucide-react';

export const StaffDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [statusModalIssue, setStatusModalIssue] = useState(null);
  const [acceptingId, setAcceptingId] = useState(null);

  const navigate = useNavigate();

  const checkMatchesDepartment = (category, userDepartment) => {
    if (!userDepartment || !category) return false;
    const dept = userDepartment.toLowerCase();
    const cat = category.toUpperCase();
    if (cat.includes('WIFI') || cat.includes('INTERNET')) {
      return /\b(it|network|networks|infrastructure|computer|internet|wifi)\b/i.test(dept) || dept.includes('information technology');
    }
    if (cat.includes('ELECTRICAL')) {
      return /\b(electrical|power|wiring|ac|hardware)\b/i.test(dept);
    }
    if (cat.includes('CLASSROOM')) {
      return /\b(classroom|media|projector|av)\b/i.test(dept) || /\b(it|network|infrastructure)\b/i.test(dept) || dept.includes('electrical');
    }
    if (cat.includes('LABORATORY')) {
      return /\b(lab|laboratory|equipment|gear|instrument)\b/i.test(dept);
    }
    if (cat.includes('HOSTEL') || cat.includes('CLEANING')) {
      return /\b(facilities|hostel|dorm|cleaning|maintenance|hygiene|sanitation|operations)\b/i.test(dept);
    }
    if (cat.includes('LIBRARY')) {
      return /\b(library|information services|books)\b/i.test(dept);
    }
    if (cat.includes('TRANSPORT')) {
      return /\b(transport|shuttle|fleet|bus|vehicle)\b/i.test(dept);
    }
    if (cat.includes('SECURITY')) {
      return /\b(security|safety|guard|patrol)\b/i.test(dept);
    }
    return false;
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const response = await api.get('/staff/dashboard');
      setStats(response.data);
    } catch (err) {
      console.error('Failed to load staff dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptIssue = async (e, issueId) => {
    e.stopPropagation();
    setAcceptingId(issueId);
    try {
      await issueService.acceptIssue(issueId);
      await loadDashboardData();
    } catch (err) {
      console.error('Failed to accept issue:', err);
    } finally {
      setAcceptingId(null);
    }
  };

  const handleClaimIssue = async (e, issueId) => {
    e.stopPropagation();
    setAcceptingId(issueId);
    try {
      await issueService.claimIssue(issueId);
      await loadDashboardData();
    } catch (err) {
      console.error('Failed to claim issue:', err);
    } finally {
      setAcceptingId(null);
    }
  };

  const handleStatusUpdate = async (status, notes, resolutionImageUrl) => {
    if (!statusModalIssue) return;
    try {
      await issueService.updateStatus(statusModalIssue.id, status, notes, resolutionImageUrl);
      setStatusModalIssue(null);
      await loadDashboardData();
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  if (loading) {
    return <Loader message="Loading staff workspace..." />;
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 p-6 sm:p-8 text-white shadow-lg border border-slate-800">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-500/20 text-brand-300 text-xs font-semibold mb-3 border border-brand-500/30">
              <Wrench className="w-3.5 h-3.5" /> Maintenance & Support Operations
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Staff Dispatch Queue
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
              Inspect assignments dispatched by administration, initiate troubleshooting, and record resolution notes for students.
            </p>
          </div>

          <Button
            variant="primary"
            size="md"
            onClick={() => navigate('/assigned-issues')}
            icon={ArrowRight}
          >
            View Work Queue
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard
          title="Assigned to Me"
          value={stats?.totalIssues}
          icon={ListTodo}
          color="blue"
          onClick={() => navigate('/assigned-issues')}
        />
        <StatCard
          title="Pending Acceptance"
          value={stats?.pendingAcceptance}
          icon={Clock}
          color="amber"
          critical={(stats?.pendingAcceptance || 0) > 0}
          onClick={() => navigate('/assigned-issues?status=ASSIGNED')}
        />
        <StatCard
          title="Active In-Progress"
          value={stats?.inProgressIssues}
          icon={PlayCircle}
          color="indigo"
          onClick={() => navigate('/assigned-issues?status=IN_PROGRESS')}
        />
        <StatCard
          title="Resolved by Me"
          value={(stats?.resolvedIssues || 0) + (stats?.closedIssues || 0)}
          icon={CheckCircle2}
          color="emerald"
          onClick={() => navigate('/assigned-issues?status=RESOLVED')}
        />
      </div>

      {/* Open Unassigned Tickets available for pickup */}
      {stats?.unassignedIssues && stats.unassignedIssues.length > 0 && (
        <div className="rounded-2xl border border-indigo-500/40 bg-gradient-to-r from-indigo-950/40 via-slate-900 to-slate-900 p-5 shadow-xl shadow-indigo-950/20">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-2.5">
              <span className="flex h-3 w-3 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-indigo-500"></span>
              </span>
              <div>
                <h3 className="text-sm font-bold text-indigo-200 uppercase tracking-wider">
                  ⚡ Open Campus Queue: {stats.unassignedIssues.length} Unassigned Ticket{stats.unassignedIssues.length > 1 ? 's' : ''} Available
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Newly reported campus issues awaiting response. Issues matching your department ({user?.department || 'Specialization'}) are prioritized.
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/assigned-issues?tab=unassigned')}
              className="border-indigo-500/40 text-indigo-300 hover:bg-indigo-500/10 shrink-0"
            >
              View All Open
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {[...stats.unassignedIssues]
              .sort((a, b) => {
                const aMatch = checkMatchesDepartment(a.category, user?.department) ? 1 : 0;
                const bMatch = checkMatchesDepartment(b.category, user?.department) ? 1 : 0;
                return bMatch - aMatch;
              })
              .map((issue) => {
                const isMatch = checkMatchesDepartment(issue.category, user?.department);
                return (
                  <div
                    key={issue.id}
                    onClick={() => navigate(`/issues/${issue.id}`)}
                    className={`p-4 rounded-xl bg-slate-950/80 border transition-all flex flex-col justify-between cursor-pointer ${
                      isMatch
                        ? 'border-brand-500/60 shadow-lg shadow-brand-500/10 hover:border-brand-400'
                        : 'border-slate-800 hover:border-indigo-500/50'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="text-xs font-mono font-bold text-brand-400">#{issue.issueCode}</span>
                        <div className="flex items-center gap-1.5">
                          <PriorityBadge priority={issue.priority} />
                        </div>
                      </div>

                      {isMatch && (
                        <div className="mb-2">
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-brand-500/20 text-brand-300 border border-brand-500/40">
                            <Sparkles className="w-2.5 h-2.5" /> Matches Your Department
                          </span>
                        </div>
                      )}

                      <h4 className="text-sm font-bold text-white line-clamp-1">{issue.title}</h4>
                      <p className="text-xs text-slate-400 flex items-center gap-1 mt-1 truncate">
                        <MapPin className="w-3.5 h-3.5 shrink-0 text-slate-500" /> {issue.location}
                      </p>
                      <p className="text-[11px] text-slate-400 mt-1">
                        Domain: <span className="text-slate-300 font-medium">{issue.categoryDisplayName || issue.category}</span>
                      </p>
                    </div>

                    <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between">
                      <span className="text-[11px] text-amber-400 font-medium">Unassigned</span>
                      <Button
                        variant="primary"
                        size="sm"
                        loading={acceptingId === issue.id}
                        onClick={(e) => handleClaimIssue(e, issue.id)}
                        icon={Wrench}
                        className={`py-1 px-3 text-xs font-bold border-none ${
                          isMatch ? 'bg-brand-600 hover:bg-brand-500 text-white' : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                        }`}
                      >
                        Claim & Start
                      </Button>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* Recent Assigned Issues Table */}
      <Card>
        <CardHeader
          title="Assigned Service Tickets"
          subtitle="Tickets dispatched to your queue requiring maintenance or technical resolution"
          action={
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/assigned-issues')}
              icon={ArrowRight}
            >
              All Assignments
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
                  <th className="px-6 py-3.5">Reported</th>
                  <th className="px-6 py-3.5 text-right">Quick Action</th>
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
                    <td className="px-6 py-4 whitespace-nowrap text-slate-400 text-xs">
                      {formatDate(issue.createdAt)}
                    </td>
                    <td className="px-6 py-4 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                      {issue.status === 'ASSIGNED' ? (
                        <Button
                          variant="primary"
                          size="sm"
                          loading={acceptingId === issue.id}
                          onClick={(e) => handleAcceptIssue(e, issue.id)}
                          icon={Check}
                        >
                          Accept
                        </Button>
                      ) : issue.status === 'IN_PROGRESS' ? (
                        <Button
                          variant="success"
                          size="sm"
                          onClick={() => setStatusModalIssue(issue)}
                          icon={CheckCircle2}
                        >
                          Resolve
                        </Button>
                      ) : (
                        <span className="text-xs text-slate-400 font-medium">Completed</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="py-12 text-center text-slate-400 text-xs sm:text-sm">
              Your assignment queue is currently clear!
            </div>
          )}
        </div>
      </Card>

      {/* Resolution Modal */}
      {statusModalIssue && (
        <StatusChangeModal
          isOpen={!!statusModalIssue}
          onClose={() => setStatusModalIssue(null)}
          issue={statusModalIssue}
          availableStatuses={['RESOLVED']}
          onStatusUpdateSuccess={handleStatusUpdate}
        />
      )}
    </div>
  );
};
