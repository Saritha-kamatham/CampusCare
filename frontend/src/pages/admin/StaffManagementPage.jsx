import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import { Button } from '../../components/common/Button';
import { Card, CardHeader, CardContent } from '../../components/common/Card';
import { Modal } from '../../components/common/Modal';
import { Loader } from '../../components/common/Loader';
import {
  UserCheck,
  UserPlus,
  Mail,
  Lock,
  Phone,
  BookOpen,
  User,
  Wrench,
  CheckCircle,
  Briefcase,
} from 'lucide-react';

export const StaffManagementPage = () => {
  const [staffList, setStaffList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    department: 'Electrical & Hardware Maintenance',
    phone: '',
  });

  useEffect(() => {
    fetchStaff();
  }, []);

  const fetchStaff = async () => {
    setLoading(true);
    try {
      const data = await adminService.getStaffList();
      setStaffList(data);
    } catch (err) {
      console.error('Failed to load staff list:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCreateStaff = async (e) => {
    e.preventDefault();
    setError('');
    setCreating(true);

    try {
      await adminService.createStaff(formData);
      setModalOpen(false);
      setFormData({
        name: '',
        email: '',
        password: '',
        department: 'Electrical & Hardware Maintenance',
        phone: '',
      });
      await fetchStaff();
    } catch (err) {
      console.error('Failed to create staff:', err);
      const msg = err.response?.data?.message || 'Failed to register staff account.';
      setError(msg);
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Staff Roster & Workload</h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Departmental maintenance personnel capacity and task assignments
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={() => setModalOpen(true)}
          icon={UserPlus}
        >
          Add Staff Member
        </Button>
      </div>

      {loading ? (
        <Loader message="Loading staff personnel..." />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {staffList.map((staff) => (
            <Card key={staff.id} className="p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-brand-500/10 border border-brand-500/30 flex items-center justify-center font-bold text-base text-brand-400">
                    {staff.name.charAt(0)}
                  </div>
                  <span className="text-[11px] font-semibold text-emerald-300 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                    Active Personnel
                  </span>
                </div>

                <h3 className="text-base font-bold text-white mt-4">{staff.name}</h3>
                <p className="text-xs text-brand-400 font-medium">{staff.department || 'General Support'}</p>
                <p className="text-xs text-slate-400 mt-0.5">{staff.email}</p>
                {staff.phone && <p className="text-xs text-slate-400 mt-0.5">{staff.phone}</p>}
              </div>

              <div className="mt-6 pt-4 border-t border-slate-800">
                <div className="grid grid-cols-2 gap-3 text-center">
                  <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
                    <span className="text-xs text-slate-400 block">Active Tasks</span>
                    <span className="text-lg font-bold text-brand-400">
                      {staff.assignedIssueCount || 0}
                    </span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
                    <span className="text-xs text-slate-400 block">Resolved</span>
                    <span className="text-lg font-bold text-emerald-400">
                      {staff.resolvedIssueCount || 0}
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Add Staff Modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Register New Staff Member">
        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleCreateStaff} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name *</label>
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleInputChange}
              placeholder="e.g. Samuel Green"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Email *</label>
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleInputChange}
              placeholder="staff@campuscare.com"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Initial Password *</label>
            <input
              type="password"
              name="password"
              required
              minLength={6}
              value={formData.password}
              onChange={handleInputChange}
              placeholder="••••••••"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Department Specialization</label>
            <select
              name="department"
              value={formData.department}
              onChange={handleInputChange}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs sm:text-sm text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              <option value="Electrical & Hardware Maintenance">Electrical & Hardware Maintenance</option>
              <option value="IT Infrastructure & Networks">IT Infrastructure & Networks</option>
              <option value="Facilities & Hostel Operations">Facilities & Hostel Operations</option>
              <option value="Laboratories & Specialized Gear">Laboratories & Specialized Gear</option>
              <option value="Campus Transport & Shuttles">Campus Transport & Shuttles</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Contact Phone</label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder="+1 (555) 000-0000"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-800">
            <Button type="button" variant="outline" size="sm" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm" loading={creating} icon={UserPlus}>
              Create Account
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
