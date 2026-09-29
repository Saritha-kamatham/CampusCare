import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNotifications } from '../../context/NotificationContext';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { formatTimeAgo, formatDate } from '../../utils/formatters';
import {
  Bell,
  CheckCheck,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Inbox,
} from 'lucide-react';

export const NotificationsPage = () => {
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const [filter, setFilter] = useState('ALL'); // 'ALL' | 'UNREAD'
  const navigate = useNavigate();

  const filtered = notifications.filter((n) => (filter === 'UNREAD' ? !n.read : true));

  const handleNotificationClick = (notif) => {
    if (!notif.read) {
      markAsRead(notif.id);
    }
    if (notif.issueId) {
      navigate(`/issues/${notif.issueId}`);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Notification Center</h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Real-time push alerts, issue updates, and assignment notifications
          </p>
        </div>

        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={markAllAsRead}
              icon={CheckCheck}
            >
              Mark all read
            </Button>
          )}
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2 text-xs font-semibold">
        <button
          onClick={() => setFilter('ALL')}
          className={`px-3 py-1.5 rounded-lg transition-colors ${
            filter === 'ALL'
              ? 'bg-brand-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          All ({notifications.length})
        </button>
        <button
          onClick={() => setFilter('UNREAD')}
          className={`px-3 py-1.5 rounded-lg transition-colors ${
            filter === 'UNREAD'
              ? 'bg-brand-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Unread ({unreadCount})
        </button>
      </div>

      {/* Notification List */}
      <Card>
        {filtered.length === 0 ? (
          <div className="py-16 text-center text-slate-400">
            <Inbox className="w-10 h-10 mx-auto text-slate-600 mb-2 stroke-1" />
            <p className="text-sm font-semibold text-slate-300">No notifications found</p>
            <p className="text-xs text-slate-500 mt-0.5">
              {filter === 'UNREAD'
                ? 'You are all caught up on your alerts!'
                : 'Activity and updates will appear here automatically in real time.'}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-800">
            {filtered.map((notif) => {
              let Icon = Bell;
              let iconColor = 'text-brand-400 bg-brand-500/10 border border-brand-500/20';
              if (notif.type === 'ISSUE_RESOLVED') {
                Icon = CheckCircle2;
                iconColor = 'text-emerald-400 bg-emerald-500/10 border border-emerald-500/20';
              } else if (notif.type === 'NEW_ISSUE' || notif.type === 'STATUS_CHANGED') {
                Icon = AlertTriangle;
                iconColor = 'text-amber-400 bg-amber-500/10 border border-amber-500/20';
              }

              return (
                <div
                  key={notif.id}
                  onClick={() => handleNotificationClick(notif)}
                  className={`p-4 sm:p-5 flex items-start gap-4 hover:bg-slate-800/50 cursor-pointer transition-colors ${
                    !notif.read ? 'bg-brand-500/10' : ''
                  }`}
                >
                  <div className={`p-2.5 rounded-2xl shrink-0 ${iconColor}`}>
                    <Icon className="w-5 h-5" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center justify-between gap-1 mb-1">
                      <div className="flex items-center gap-2">
                        <h4 className="text-xs sm:text-sm font-bold text-white">
                          {notif.title}
                        </h4>
                        {!notif.read && (
                          <span className="w-2 h-2 rounded-full bg-brand-500 animate-pulse" />
                        )}
                      </div>
                      <span className="text-[11px] text-slate-400">
                        {formatTimeAgo(notif.createdAt)}
                      </span>
                    </div>

                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                      {notif.message}
                    </p>

                    {notif.issueCode && (
                      <div className="mt-2 flex items-center gap-1 text-xs font-semibold text-brand-400">
                        <span>View Ticket #{notif.issueCode}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Card>
    </div>
  );
};
