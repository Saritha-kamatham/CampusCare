import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { issueService } from '../../services/issueService';
import { useAuth } from '../../context/AuthContext';
import { CATEGORIES } from '../../utils/constants';
import { StatusBadge, PriorityBadge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { Loader } from '../../components/common/Loader';
import { StatusChangeModal } from '../../components/issues/StatusChangeModal';
import { formatDate } from '../../utils/formatters';
import {
  Search,
  Check,
  CheckCircle2,
  MapPin,
  ChevronLeft,
  ChevronRight,
  User,
  Wrench,
  Clock,
  ListTodo,
  Sparkles,
} from 'lucide-react';

export const AssignedIssuesPage = () => {
  const { user } = useAuth();
  const [issues, setIssues] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [acceptingId, setAcceptingId] = useState(null);
  const [statusModalIssue, setStatusModalIssue] = useState(null);
  const [deptOnly, setDeptOnly] = useState(false);

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState(
    searchParams.get('tab') === 'unassigned' ? 'unassigned' : 'assigned'
  );
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [priority, setPriority] = useState('');
  const [status, setStatus] = useState(searchParams.get('status') || '');

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
    fetchIssues();
  }, [page, category, priority, status, activeTab]);

  const fetchIssues = async () => {
    setLoading(true);
    try {
      const params = {
        staffId: activeTab === 'assigned' ? user?.id : undefined,
        status: activeTab === 'unassigned' ? (status || 'REPORTED') : (status || undefined),
        page,
        size: 10,
        search: search.trim() || undefined,
        category: category || undefined,
        priority: priority || undefined,
        sortBy: 'createdAt',
        direction: 'desc',
      };
      const res = await issueService.getIssues(params);
      setIssues(res.content || []);
      setTotalPages(res.totalPages || 0);
      setTotalElements(res.totalElements || 0);
    } catch (err) {
      console.error('Failed to load issues:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(0);
    fetchIssues();
  };

  const handleAccept = async (e, issueId) => {
    e.stopPropagation();
    setAcceptingId(issueId);
    try {
      await issueService.acceptIssue(issueId);
      await fetchIssues();
    } catch (err) {
      console.error('Failed to accept:', err);
    } finally {
      setAcceptingId(null);
    }
  };

  const handleClaim = async (e, issueId) => {
    e.stopPropagation();
    setAcceptingId(issueId);
    try {
      await issueService.claimIssue(issueId);
      await fetchIssues();
    } catch (err) {
      console.error('Failed to claim:', err);
    } finally {
      setAcceptingId(null);
    }
  };

  const handleStatusUpdate = async (newStatus, notes, resolutionImageUrl) => {
    if (!statusModalIssue) return;
    try {
      await issueService.updateStatus(statusModalIssue.id, newStatus, notes, resolutionImageUrl);
      setStatusModalIssue(null);
      await fetchIssues();
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight">Staff Service Queue</h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            {activeTab === 'assigned'
              ? `Showing ${totalElements} active tickets assigned to your queue`
              : `Showing ${totalElements} open campus tickets awaiting response and pickup`}
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setActiveTab('assigned');
              setPage(0);
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeTab === 'assigned'
                ? 'bg-brand-600 text-white shadow-lg shadow-brand-600/30'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <ListTodo className="w-4 h-4" />
            My Assigned Work
          </button>

          <button
            onClick={() => {
              setActiveTab('unassigned');
              setPage(0);
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeTab === 'unassigned'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <Wrench className="w-4 h-4" />
            Open Campus Queue (Unassigned)
          </button>
        </div>

        {activeTab === 'unassigned' && (
          <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 p-1 rounded-xl">
            <button
              type="button"
              onClick={() => setDeptOnly(false)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                !deptOnly
                  ? 'bg-slate-800 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              All Open
            </button>
            <button
              type="button"
              onClick={() => setDeptOnly(true)}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                deptOnly
                  ? 'bg-brand-600/30 text-brand-300 border border-brand-500/50'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-brand-400" />
              My Specialization Only
            </button>
          </div>
        )}
      </div>

      {/* Filter Bar */}
      <Card className="p-4">
        <form onSubmit={handleSearch} className="flex flex-col lg:flex-row items-stretch lg:items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search tickets by code, title, or room..."
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-700 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 bg-slate-950 text-white placeholder-slate-500"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <select
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
                setPage(0);
              }}
              className="px-3 py-2 rounded-xl border border-slate-700 text-xs font-medium bg-slate-950 text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              <option value="">All Categories</option>
              {CATEGORIES.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>

            <select
              value={priority}
              onChange={(e) => {
                setPriority(e.target.value);
                setPage(0);
              }}
              className="px-3 py-2 rounded-xl border border-slate-700 text-xs font-medium bg-slate-950 text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              <option value="">All Priorities</option>
              <option value="CRITICAL">Critical</option>
              <option value="HIGH">High</option>
              <option value="MEDIUM">Medium</option>
              <option value="LOW">Low</option>
            </select>

            {activeTab === 'assigned' && (
              <select
                value={status}
                onChange={(e) => {
                  setStatus(e.target.value);
                  setPage(0);
                }}
                className="px-3 py-2 rounded-xl border border-slate-700 text-xs font-medium bg-slate-950 text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
              >
                <option value="">All Statuses</option>
                <option value="ASSIGNED">Assigned (Awaiting Accept)</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="RESOLVED">Resolved</option>
                <option value="CLOSED">Closed</option>
              </select>
            )}

            <Button type="submit" variant="primary" size="sm">
              Filter
            </Button>
          </div>
        </form>
      </Card>

      {/* Issues Table */}
      {loading ? (
        <Loader message="Loading service queue..." />
      ) : issues.length === 0 ? (
        <Card className="p-12 text-center">
          <div className="w-12 h-12 rounded-2xl bg-slate-850 flex items-center justify-center text-slate-500 mx-auto mb-3">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-white">No Tickets in this Queue</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            {activeTab === 'assigned'
              ? 'You have resolved all assigned tickets! Check the Open Campus Queue to pick up newly reported student issues.'
              : 'There are no open unassigned tickets at this moment.'}
          </p>
        </Card>
      ) : (
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-950/80 border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="px-6 py-3.5">Ticket ID</th>
                  <th className="px-6 py-3.5">Title & Location</th>
                  <th className="px-6 py-3.5">Category</th>
                  <th className="px-6 py-3.5">Priority</th>
                  <th className="px-6 py-3.5">Status</th>
                  <th className="px-6 py-3.5">Student</th>
                  <th className="px-6 py-3.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {(activeTab === 'unassigned' && deptOnly
                  ? issues.filter((i) => checkMatchesDepartment(i.category, user?.department))
                  : issues
                ).map((issue) => (
                  <tr
                    key={issue.id}
                    onClick={() => navigate(`/issues/${issue.id}`)}
                    className="hover:bg-slate-800/50 cursor-pointer transition-colors"
                  >
                    <td className="px-6 py-4 font-mono font-bold text-brand-400 whitespace-nowrap">
                      #{issue.issueCode}
                    </td>
                    <td className="px-6 py-4 max-w-xs">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <p className="font-semibold text-white truncate">{issue.title}</p>
                        {checkMatchesDepartment(issue.category, user?.department) && (
                          <span className="shrink-0 inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-brand-500/20 text-brand-300 border border-brand-500/40">
                            🎯 Matches Dept
                          </span>
                        )}
                      </div>
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
                      {issue.createdByName}
                    </td>
                    <td
                      className="px-6 py-4 text-right whitespace-nowrap"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {activeTab === 'unassigned' || !issue.assignedStaffId ? (
                        <Button
                          variant="primary"
                          size="sm"
                          loading={acceptingId === issue.id}
                          onClick={(e) => handleClaim(e, issue.id)}
                          icon={Wrench}
                          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold border-none"
                        >
                          Claim Issue
                        </Button>
                      ) : issue.status === 'ASSIGNED' ? (
                        <Button
                          variant="primary"
                          size="sm"
                          loading={acceptingId === issue.id}
                          onClick={(e) => handleAccept(e, issue.id)}
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
                        <span className="text-xs text-slate-400 font-medium">Done</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-4 border-t border-slate-800 text-xs">
          <p className="text-slate-400">
            Page <span className="font-bold text-white">{page + 1}</span> of{' '}
            <span className="font-bold text-white">{totalPages}</span>
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page === 0}
              onClick={() => setPage(page - 1)}
              icon={ChevronLeft}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={page >= totalPages - 1}
              onClick={() => setPage(page + 1)}
            >
              Next <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>
      )}

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
