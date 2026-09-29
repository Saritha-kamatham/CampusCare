import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { issueService } from '../../services/issueService';
import { useAuth } from '../../context/AuthContext';
import { IssueTimeline } from '../../components/issues/IssueTimeline';
import { IssueHistoryTable } from '../../components/issues/IssueHistoryTable';
import { CommentSection } from '../../components/issues/CommentSection';
import { AssignStaffModal } from '../../components/issues/AssignStaffModal';
import { StatusChangeModal } from '../../components/issues/StatusChangeModal';
import { StatusBadge, PriorityBadge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { Card, CardHeader, CardContent } from '../../components/common/Card';
import { Loader } from '../../components/common/Loader';
import { formatDate } from '../../utils/formatters';
import {
  MapPin,
  Calendar,
  User,
  Shield,
  UserCheck,
  CheckCircle2,
  Clock,
  ArrowLeft,
  Wrench,
  AlertTriangle,
  Image as ImageIcon,
  Check,
  Lock,
} from 'lucide-react';

export const IssueDetailsPage = () => {
  const { id } = useParams();
  const { user, isStudent, isStaff, isAdmin } = useAuth();
  const navigate = useNavigate();

  const [issue, setIssue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [accepting, setAccepting] = useState(false);

  useEffect(() => {
    fetchIssue();
  }, [id]);

  const fetchIssue = async () => {
    setLoading(true);
    try {
      const data = await issueService.getIssueDetail(id);
      setIssue(data);
    } catch (err) {
      console.error('Failed to load issue details:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAssignSuccess = async (staffId, note) => {
    await issueService.assignIssue(issue.id, staffId, note);
    await fetchIssue();
  };

  const handleAccept = async () => {
    setAccepting(true);
    try {
      await issueService.acceptIssue(issue.id);
      await fetchIssue();
    } catch (err) {
      console.error('Failed to accept issue:', err);
    } finally {
      setAccepting(false);
    }
  };

  const handleClaim = async () => {
    setAccepting(true);
    try {
      await issueService.claimIssue(issue.id);
      await fetchIssue();
    } catch (err) {
      console.error('Failed to claim issue:', err);
    } finally {
      setAccepting(false);
    }
  };

  const handleStatusUpdateSuccess = async (newStatus, notes, resolutionImageUrl) => {
    await issueService.updateStatus(issue.id, newStatus, notes, resolutionImageUrl);
    await fetchIssue();
  };

  const handleAddComment = async (content) => {
    await issueService.addComment(issue.id, content);
    await fetchIssue();
  };

  const handlePriorityChange = async (e) => {
    const newPriority = e.target.value;
    try {
      await issueService.updatePriority(issue.id, newPriority);
      await fetchIssue();
    } catch (err) {
      console.error('Failed to update priority:', err);
    }
  };

  if (loading) {
    return <Loader message="Loading ticket details..." />;
  }

  if (!issue) {
    return (
      <Card className="p-12 text-center">
        <h3 className="text-base font-bold text-white">Issue Not Found</h3>
        <p className="text-xs text-slate-400 mt-1">The requested ticket does not exist.</p>
        <Button variant="outline" size="sm" onClick={() => navigate(-1)} className="mt-4">
          Go Back
        </Button>
      </Card>
    );
  }

  const isAssignedToMe = isStaff && issue.assignedStaffId === user?.id;
  const isMyReportedIssue = isStudent && issue.createdById === user?.id;

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Back button and Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-xl text-slate-400 hover:bg-slate-800 hover:text-white border border-slate-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-brand-400 bg-brand-500/10 border border-brand-500/20 px-2 py-0.5 rounded-md">
                #{issue.issueCode}
              </span>
              <span className="text-xs text-slate-500">•</span>
              <span className="text-xs text-slate-400 font-medium">{issue.categoryDisplayName || issue.category}</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-white mt-0.5">{issue.title}</h1>
          </div>
        </div>

        {/* Action Buttons based on Role */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Admin Assign Button */}
          {isAdmin && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setAssignModalOpen(true)}
              icon={UserCheck}
            >
              {issue.assignedStaffId ? 'Reassign Staff' : 'Assign to Staff'}
            </Button>
          )}

          {/* Staff Claim Unassigned Button */}
          {isStaff && !issue.assignedStaffId && (
            <Button
              variant="primary"
              size="sm"
              loading={accepting}
              onClick={handleClaim}
              icon={Wrench}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold"
            >
              Claim & Start Work
            </Button>
          )}

          {/* Staff Accept Button */}
          {isAssignedToMe && issue.status === 'ASSIGNED' && (
            <Button
              variant="primary"
              size="sm"
              loading={accepting}
              onClick={handleAccept}
              icon={Check}
            >
              Accept & Start Work
            </Button>
          )}

          {/* Staff Resolve Button */}
          {isAssignedToMe && issue.status === 'IN_PROGRESS' && (
            <Button
              variant="success"
              size="sm"
              onClick={() => setStatusModalOpen(true)}
              icon={CheckCircle2}
            >
              Mark Resolved
            </Button>
          )}

          {/* Student Close Ticket */}
          {isMyReportedIssue && issue.status === 'RESOLVED' && (
            <Button
              variant="primary"
              size="sm"
              onClick={() => setStatusModalOpen(true)}
              icon={Lock}
            >
              Confirm & Close Ticket
            </Button>
          )}
        </div>
      </div>

      {/* Visual Step Timeline */}
      <Card className="p-6">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
          Status Progression Lifecycle
        </h3>
        <IssueTimeline issue={issue} />
      </Card>

      {/* Main Grid: Details + Sidebar Info */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Description, Photos, Comments, History */}
        <div className="lg:col-span-2 space-y-6">
          {/* Issue Description Card */}
          <Card className="p-6 space-y-4">
            <div>
              <h3 className="text-sm font-bold text-white mb-2">Description</h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed whitespace-pre-wrap">
                {issue.description}
              </p>
            </div>

            {/* Attached Photo */}
            {issue.imageUrl && (
              <div className="pt-2">
                <span className="text-xs font-semibold text-slate-400 block mb-2">Attached Photo</span>
                <div className="rounded-2xl overflow-hidden border border-slate-800 inline-block max-w-md">
                  <img
                    src={issue.imageUrl}
                    alt="Issue attachment"
                    className="w-full max-h-80 object-cover"
                  />
                </div>
              </div>
            )}

            {/* Resolution Section if Resolved */}
            {issue.resolutionNotes && (
              <div className="mt-4 p-4 rounded-2xl bg-emerald-950/40 border border-emerald-800/80">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs mb-1">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Resolution Notes
                </div>
                <p className="text-xs text-emerald-100 leading-relaxed whitespace-pre-wrap">
                  {issue.resolutionNotes}
                </p>
                {issue.resolutionImageUrl && (
                  <div className="mt-3">
                    <img
                      src={issue.resolutionImageUrl}
                      alt="Resolution verification"
                      className="h-44 object-cover rounded-xl border border-emerald-800 shadow-sm"
                    />
                  </div>
                )}
              </div>
            )}
          </Card>

          {/* Audit History Log */}
          <Card className="p-6">
            <h3 className="text-sm font-bold text-white mb-4">Complete Audit Trail</h3>
            <IssueHistoryTable history={issue.history} />
          </Card>

          {/* Interactive Comments Stream */}
          <Card className="p-6">
            <CommentSection
              comments={issue.comments}
              onAddComment={handleAddComment}
              currentUserId={user?.id}
            />
          </Card>
        </div>

        {/* Right 1 Col: Metadata & Assignment sidebar */}
        <div className="space-y-6">
          <Card className="p-6 space-y-5">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Ticket Details
            </h3>

            {/* Status & Priority */}
            <div className="space-y-3 pb-4 border-b border-slate-800">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400">Current Status</span>
                <StatusBadge status={issue.status} />
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400">Priority Level</span>
                {isAdmin ? (
                  <select
                    value={issue.priority}
                    onChange={handlePriorityChange}
                    className="text-xs font-semibold px-2 py-1 rounded-md border border-slate-700 bg-slate-950 text-white"
                  >
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                    <option value="CRITICAL">Critical</option>
                  </select>
                ) : (
                  <PriorityBadge priority={issue.priority} />
                )}
              </div>
            </div>

            {/* Location */}
            <div className="pb-4 border-b border-slate-800">
              <span className="text-xs text-slate-400 block mb-1">Campus Location</span>
              <p className="text-xs font-semibold text-white flex items-start gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-brand-400 shrink-0 mt-0.5" />
                <span>{issue.location}</span>
              </p>
            </div>

            {/* Reporter info */}
            <div className="pb-4 border-b border-slate-800">
              <span className="text-xs text-slate-400 block mb-1">Reported By</span>
              <p className="text-xs font-semibold text-white">{issue.createdByName}</p>
              <p className="text-[11px] text-slate-400">{issue.createdByDepartment || issue.createdByEmail}</p>
              <p className="text-[11px] text-slate-500 mt-1">{formatDate(issue.createdAt)}</p>
            </div>

            {/* Assigned Staff */}
            <div>
              <span className="text-xs text-slate-400 block mb-1">Assigned Maintenance Staff</span>
              {issue.assignedStaffName ? (
                <div>
                  <p className="text-xs font-semibold text-white flex items-center gap-1.5">
                    <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
                    {issue.assignedStaffName}
                  </p>
                  <p className="text-[11px] text-slate-400">{issue.assignedStaffDepartment}</p>
                  <p className="text-[11px] text-slate-400">{issue.assignedStaffEmail}</p>
                </div>
              ) : (
                <span className="inline-flex items-center gap-1 text-amber-400 font-semibold bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20 text-xs">
                  Pending Staff Triage
                </span>
              )}
            </div>
          </Card>
        </div>
      </div>

      {/* Staff Assignment Modal */}
      {assignModalOpen && (
        <AssignStaffModal
          isOpen={assignModalOpen}
          onClose={() => setAssignModalOpen(false)}
          issue={issue}
          onAssignSuccess={handleAssignSuccess}
        />
      )}

      {/* Status Change Modal */}
      {statusModalOpen && (
        <StatusChangeModal
          isOpen={statusModalOpen}
          onClose={() => setStatusModalOpen(false)}
          issue={issue}
          availableStatuses={
            isAdmin
              ? ['REPORTED', 'ASSIGNED', 'IN_PROGRESS', 'RESOLVED', 'CLOSED']
              : isStaff
              ? ['IN_PROGRESS', 'RESOLVED']
              : ['CLOSED']
          }
          onStatusUpdateSuccess={handleStatusUpdateSuccess}
        />
      )}
    </div>
  );
};
