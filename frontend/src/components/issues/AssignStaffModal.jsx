import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { adminService } from '../../services/adminService';
import { UserCheck, ShieldAlert, Briefcase } from 'lucide-react';

export const AssignStaffModal = ({ isOpen, onClose, issue, onAssignSuccess }) => {
  const [staffList, setStaffList] = useState([]);
  const [selectedStaffId, setSelectedStaffId] = useState('');
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetchingStaff, setFetchingStaff] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadStaff();
      setSelectedStaffId(issue?.assignedStaffId ? String(issue.assignedStaffId) : '');
      setNote('');
    }
  }, [isOpen, issue]);

  const loadStaff = async () => {
    setFetchingStaff(true);
    try {
      const data = await adminService.getStaffList();
      setStaffList(data);
    } catch (err) {
      console.error('Failed to load staff list:', err);
    } finally {
      setFetchingStaff(false);
    }
  };

  const handleAssign = async (e) => {
    e.preventDefault();
    if (!selectedStaffId) return;

    setLoading(true);
    try {
      await onAssignSuccess(Number(selectedStaffId), note);
      onClose();
    } catch (err) {
      console.error('Failed to assign issue:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Assign Issue to Staff">
      <form onSubmit={handleAssign} className="space-y-4">
        {issue && (
          <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 text-xs">
            <span className="font-bold text-white block truncate">
              Ticket #{issue.issueCode}: {issue.title}
            </span>
            <span className="text-slate-400 mt-0.5 block">
              Location: {issue.location} • Category: {issue.categoryDisplayName || issue.category}
            </span>
          </div>
        )}

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">
            Select Staff Member *
          </label>
          {fetchingStaff ? (
            <div className="text-xs text-slate-400 py-2">Loading staff roster...</div>
          ) : (
            <select
              value={selectedStaffId}
              onChange={(e) => setSelectedStaffId(e.target.value)}
              required
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-700 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 bg-slate-950 text-white"
            >
              <option value="">-- Choose Staff Personnel --</option>
              {staffList.map((staff) => (
                <option key={staff.id} value={staff.id}>
                  {staff.name} — {staff.department || 'General'} (Active tasks: {staff.assignedIssueCount || 0})
                </option>
              ))}
            </select>
          )}
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">
            Assignment Instructions or Notes
          </label>
          <textarea
            rows="3"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Provide specific directions or priority context for the assigned staff member..."
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-700 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 bg-slate-950 text-white placeholder-slate-500"
          />
        </div>

        <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-800">
          <Button type="button" variant="outline" size="sm" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            size="sm"
            loading={loading}
            disabled={!selectedStaffId || loading}
            icon={UserCheck}
          >
            Confirm Assignment
          </Button>
        </div>
      </form>
    </Modal>
  );
};
