import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { issueService } from '../../services/issueService';
import { CATEGORIES } from '../../utils/constants';
import { StatusBadge, PriorityBadge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { Loader } from '../../components/common/Loader';
import { AssignStaffModal } from '../../components/issues/AssignStaffModal';
import { formatDate } from '../../utils/formatters';
import {
  Search,
  Filter,
  X,
  UserCheck,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Clock,
  ArrowUpDown,
  AlertTriangle,
} from 'lucide-react';

export const AllIssuesPage = () => {
  const [issues, setIssues] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [assignModalIssue, setAssignModalIssue] = useState(null);

  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [priority, setPriority] = useState(searchParams.get('priority') || '');
  const [status, setStatus] = useState(searchParams.get('status') || '');

  useEffect(() => {
    fetchIssues();
  }, [page, category, priority, status]);

  const fetchIssues = async () => {
    setLoading(true);
    try {
      const params = {
        page,
        size: 10,
        search: search.trim() || undefined,
        category: category || undefined,
        priority: priority || undefined,
        status: status || undefined,
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

  const handleQuickFilter = (newStatus, newPriority = '') => {
    setStatus(newStatus);
    setPriority(newPriority);
    setPage(0);
  };

  const handleAssignSuccess = async (staffId, note) => {
    if (!assignModalIssue) return;
    await issueService.assignIssue(assignModalIssue.id, staffId, note);
    setAssignModalIssue(null);
    await fetchIssues();
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight">All Campus Issues</h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Global repository of {totalElements} campus maintenance, technical, and facility tickets
          </p>
        </div>
      </div>

      {/* Quick Filter Pills */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={() => handleQuickFilter('', '')}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
            !status && !priority
              ? 'bg-brand-600 text-white'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          All Tickets
        </button>

        <button
          onClick={() => handleQuickFilter('REPORTED', '')}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
            status === 'REPORTED'
              ? 'bg-amber-500 text-slate-950 font-bold'
              : 'bg-slate-900 text-amber-400 hover:text-amber-300 border border-amber-500/30'
          }`}
        >
          <Clock className="w-3.5 h-3.5" /> Needs Assignment
        </button>

        <button
          onClick={() => handleQuickFilter('', 'CRITICAL')}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
            priority === 'CRITICAL'
              ? 'bg-rose-600 text-white'
              : 'bg-slate-900 text-rose-400 hover:text-rose-300 border border-rose-500/30'
          }`}
        >
          <AlertTriangle className="w-3.5 h-3.5" /> Critical Priority
        </button>

        <button
          onClick={() => handleQuickFilter('IN_PROGRESS', '')}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
            status === 'IN_PROGRESS'
              ? 'bg-indigo-600 text-white'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          In Progress
        </button>

        <button
          onClick={() => handleQuickFilter('RESOLVED', '')}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
            status === 'RESOLVED'
              ? 'bg-emerald-600 text-white'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          Resolved
        </button>
      </div>

      {/* Filter and Search Bar */}
      <Card className="p-4">
        <form onSubmit={handleSearch} className="flex flex-col lg:flex-row items-stretch lg:items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by code, title, student, or location..."
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-700 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 bg-slate-950 text-white placeholder-slate-500"
            />
          </div>

          <select
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              setPage(0);
            }}
            className="px-3 py-2 rounded-xl border border-slate-700 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-brand-500 bg-slate-950 text-white"
          >
            <option value="">All Statuses</option>
            <option value="REPORTED">Reported</option>
            <option value="ASSIGNED">Assigned</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="RESOLVED">Resolved</option>
            <option value="CLOSED">Closed</option>
          </select>

          <select
            value={priority}
            onChange={(e) => {
              setPriority(e.target.value);
              setPage(0);
            }}
            className="px-3 py-2 rounded-xl border border-slate-700 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-brand-500 bg-slate-950 text-white"
          >
            <option value="">All Priorities</option>
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
            <option value="CRITICAL">Critical</option>
          </select>

          <select
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
              setPage(0);
            }}
            className="px-3 py-2 rounded-xl border border-slate-700 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-brand-500 bg-slate-950 text-white"
          >
            <option value="">All Categories</option>
            {CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>

          <Button type="submit" variant="primary" size="sm">
            Search
          </Button>
        </form>
      </Card>

      {/* Table */}
      {loading ? (
        <Loader message="Loading issues..." />
      ) : issues.length === 0 ? (
        <Card className="p-12 text-center text-slate-400 text-sm">
          No issues found matching your query.
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
                  <th className="px-6 py-3.5">Reported By</th>
                  <th className="px-6 py-3.5">Assigned Staff</th>
                  <th className="px-6 py-3.5 text-right">Dispatch</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {issues.map((issue) => (
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
                      {issue.createdByName}
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
                        {issue.assignedStaffName ? 'Reassign' : 'Assign'}
                      </Button>
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
