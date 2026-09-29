import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { issueService } from '../../services/issueService';
import { CATEGORIES, STATUSES, PRIORITIES } from '../../utils/constants';
import { IssueCard } from '../../components/issues/IssueCard';
import { StatusBadge, PriorityBadge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { Loader } from '../../components/common/Loader';
import { formatDate } from '../../utils/formatters';
import {
  Search,
  Filter,
  X,
  PlusCircle,
  LayoutGrid,
  List,
  MapPin,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

export const MyIssuesPage = () => {
  const [issues, setIssues] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'table'

  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [category, setCategory] = useState(searchParams.get('category') || '');
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
        size: 9,
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

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(0);
    fetchIssues();
  };

  const clearFilters = () => {
    setSearch('');
    setCategory('');
    setPriority('');
    setStatus('');
    setPage(0);
  };

  const hasActiveFilters = !!(search || category || priority || status);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">My Reported Issues</h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Tracking {totalElements} campus maintenance tickets registered by you
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* View Toggle */}
          <div className="flex items-center bg-slate-900 border border-slate-800 p-1 rounded-xl">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === 'grid' ? 'bg-slate-800 shadow-sm text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Grid view"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === 'table' ? 'bg-slate-800 shadow-sm text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Table view"
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          <Button
            variant="primary"
            size="sm"
            onClick={() => navigate('/report-issue')}
            icon={PlusCircle}
          >
            New Issue
          </Button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <Card className="p-4">
        <form onSubmit={handleSearchSubmit} className="flex flex-col lg:flex-row items-stretch lg:items-center gap-3">
          {/* Search box */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by ticket ID, title, keyword or location..."
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-700/80 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 bg-slate-950/80 text-white placeholder-slate-500"
            />
          </div>

          {/* Category Filter */}
          <select
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
              setPage(0);
            }}
            className="px-3 py-2 rounded-xl border border-slate-700/80 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 bg-slate-900 text-slate-200"
          >
            <option value="">All Categories</option>
            {CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>

          {/* Priority Filter */}
          <select
            value={priority}
            onChange={(e) => {
              setPriority(e.target.value);
              setPage(0);
            }}
            className="px-3 py-2 rounded-xl border border-slate-700/80 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 bg-slate-900 text-slate-200"
          >
            <option value="">All Priorities</option>
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
            <option value="CRITICAL">Critical</option>
          </select>

          {/* Status Filter */}
          <select
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              setPage(0);
            }}
            className="px-3 py-2 rounded-xl border border-slate-700/80 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 bg-slate-900 text-slate-200"
          >
            <option value="">All Statuses</option>
            <option value="REPORTED">Reported</option>
            <option value="ASSIGNED">Assigned</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="RESOLVED">Resolved</option>
            <option value="CLOSED">Closed</option>
          </select>

          <Button type="submit" variant="primary" size="sm">
            Search
          </Button>

          {hasActiveFilters && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              icon={X}
              className="text-slate-400 hover:text-slate-200"
            >
              Clear
            </Button>
          )}
        </form>
      </Card>

      {/* Issues Display */}
      {loading ? (
        <Loader message="Loading issues..." />
      ) : issues.length === 0 ? (
        <Card className="p-12 text-center">
          <p className="text-slate-300 text-sm font-medium">No matching issues found</p>
          <p className="text-xs text-slate-500 mt-1">
            Try adjusting your search terms or filters above.
          </p>
          {hasActiveFilters && (
            <Button variant="outline" size="sm" onClick={clearFilters} className="mt-4">
              Clear All Filters
            </Button>
          )}
        </Card>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {issues.map((issue) => (
            <IssueCard key={issue.id} issue={issue} />
          ))}
        </div>
      ) : (
        /* Table View */
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-900/90 border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="px-6 py-3.5">Ticket ID</th>
                  <th className="px-6 py-3.5">Title & Location</th>
                  <th className="px-6 py-3.5">Category</th>
                  <th className="px-6 py-3.5">Priority</th>
                  <th className="px-6 py-3.5">Status</th>
                  <th className="px-6 py-3.5">Assigned Staff</th>
                  <th className="px-6 py-3.5">Created</th>
                  <th className="px-6 py-3.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
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
                      {issue.assignedStaffName || (
                        <span className="text-slate-500 italic">Unassigned</span>
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
          </div>
        </Card>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-4 border-t border-slate-800 text-xs">
          <p className="text-slate-400">
            Showing Page <span className="font-bold text-white">{page + 1}</span> of{' '}
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
    </div>
  );
};
