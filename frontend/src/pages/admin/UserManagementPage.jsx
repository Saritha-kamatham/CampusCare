import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { Loader } from '../../components/common/Loader';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { formatDate } from '../../utils/formatters';
import {
  Search,
  Users,
  Shield,
  UserCheck,
  GraduationCap,
  ChevronLeft,
  ChevronRight,
  Power,
  CheckCircle,
  XCircle,
} from 'lucide-react';

export const UserManagementPage = () => {
  const [users, setUsers] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(true);

  const [role, setRole] = useState('');
  const [search, setSearch] = useState('');
  const [toggleConfirmUser, setToggleConfirmUser] = useState(null);
  const [toggling, setToggling] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, [page, role]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const params = {
        role: role || undefined,
        search: search.trim() || undefined,
        page,
        size: 10,
        sortBy: 'createdAt',
        direction: 'desc',
      };
      const res = await adminService.getUsers(params);
      setUsers(res.content || []);
      setTotalPages(res.totalPages || 0);
      setTotalElements(res.totalElements || 0);
    } catch (err) {
      console.error('Failed to load users:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(0);
    fetchUsers();
  };

  const handleToggleActive = async () => {
    if (!toggleConfirmUser) return;
    setToggling(true);
    try {
      await adminService.toggleUserActive(toggleConfirmUser.id);
      setToggleConfirmUser(null);
      await fetchUsers();
    } catch (err) {
      console.error('Failed to toggle user:', err);
    } finally {
      setToggling(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div>
        <h2 className="text-2xl font-bold text-white tracking-tight">User Directory & Access Control</h2>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Manage {totalElements} registered institutional accounts across students, staff, and administrators
        </p>
      </div>

      {/* Filter Bar */}
      <Card className="p-4">
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, email, or department..."
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-700/80 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 bg-slate-950/80 text-white placeholder-slate-500"
            />
          </div>

          <select
            value={role}
            onChange={(e) => {
              setRole(e.target.value);
              setPage(0);
            }}
            className="px-3 py-2 rounded-xl border border-slate-700/80 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 bg-slate-900 text-slate-200"
          >
            <option value="">All Roles</option>
            <option value="ROLE_STUDENT">Students</option>
            <option value="ROLE_STAFF">Staff Members</option>
            <option value="ROLE_ADMIN">Administrators</option>
          </select>

          <Button type="submit" variant="primary" size="sm">
            Search
          </Button>
        </form>
      </Card>

      {/* Users Table */}
      {loading ? (
        <Loader message="Loading directory..." />
      ) : users.length === 0 ? (
        <Card className="p-12 text-center text-slate-400 text-sm">
          No users found matching your search criteria.
        </Card>
      ) : (
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-900/90 border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="px-6 py-3.5">User</th>
                  <th className="px-6 py-3.5">Role</th>
                  <th className="px-6 py-3.5">Department</th>
                  <th className="px-6 py-3.5">Phone</th>
                  <th className="px-6 py-3.5">Status</th>
                  <th className="px-6 py-3.5">Joined</th>
                  <th className="px-6 py-3.5 text-right">Account Access</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {users.map((u) => {
                  let RoleIcon = GraduationCap;
                  let roleBadge = 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20';
                  if (u.role === 'ROLE_ADMIN') {
                    RoleIcon = Shield;
                    roleBadge = 'bg-purple-500/10 text-purple-300 border-purple-500/20';
                  } else if (u.role === 'ROLE_STAFF') {
                    RoleIcon = UserCheck;
                    roleBadge = 'bg-blue-500/10 text-blue-300 border-blue-500/20';
                  }

                  return (
                    <tr key={u.id} className="hover:bg-slate-800/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-xs text-slate-200">
                            {u.name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-semibold text-white">{u.name}</p>
                            <p className="text-xs text-slate-400">{u.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${roleBadge}`}
                        >
                          <RoleIcon className="w-3.5 h-3.5" />
                          {u.role.replace('ROLE_', '')}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-300 whitespace-nowrap">
                        {u.department || '—'}
                      </td>
                      <td className="px-6 py-4 text-slate-400 whitespace-nowrap">
                        {u.phone || '—'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {u.active ? (
                          <span className="inline-flex items-center gap-1 text-xs text-emerald-400 font-medium">
                            <CheckCircle className="w-3.5 h-3.5 text-emerald-400" /> Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-xs text-rose-400 font-medium">
                            <XCircle className="w-3.5 h-3.5 text-rose-400" /> Suspended
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-slate-400 text-xs whitespace-nowrap">
                        {formatDate(u.createdAt)}
                      </td>
                      <td className="px-6 py-4 text-right whitespace-nowrap">
                        {u.role !== 'ROLE_ADMIN' ? (
                          <Button
                            variant={u.active ? 'outline' : 'success'}
                            size="sm"
                            onClick={() => setToggleConfirmUser(u)}
                            icon={Power}
                          >
                            {u.active ? 'Deactivate' : 'Reactivate'}
                          </Button>
                        ) : (
                          <span className="text-xs text-slate-500 italic">Protected</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
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

      {/* Confirm Toggle Dialog */}
      {toggleConfirmUser && (
        <ConfirmDialog
          isOpen={!!toggleConfirmUser}
          onClose={() => setToggleConfirmUser(null)}
          onConfirm={handleToggleActive}
          loading={toggling}
          title={toggleConfirmUser.active ? 'Deactivate User Account' : 'Reactivate User Account'}
          message={`Are you sure you want to ${
            toggleConfirmUser.active ? 'suspend login access for' : 'restore access for'
          } ${toggleConfirmUser.name}?`}
          confirmText={toggleConfirmUser.active ? 'Deactivate' : 'Activate'}
          variant={toggleConfirmUser.active ? 'danger' : 'success'}
        />
      )}
    </div>
  );
};
