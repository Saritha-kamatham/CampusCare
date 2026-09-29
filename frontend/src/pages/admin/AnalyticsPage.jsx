import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import { Card, CardHeader, CardContent } from '../../components/common/Card';
import { Loader } from '../../components/common/Loader';
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
  Legend,
} from 'recharts';
import { BarChart3, TrendingUp, PieChart as PieIcon, CheckCircle2, AlertTriangle } from 'lucide-react';

const PRIORITY_COLORS = {
  LOW: '#94a3b8',
  MEDIUM: '#3b82f6',
  HIGH: '#f59e0b',
  CRITICAL: '#ef4444',
};

const CATEGORY_COLORS = ['#3b82f6', '#f59e0b', '#6366f1', '#a855f7', '#10b981', '#14b8a6', '#06b6d4', '#f97316', '#f43f5e', '#64748b'];

export const AnalyticsPage = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      const data = await adminService.getAnalytics();
      setAnalytics(data);
    } catch (err) {
      console.error('Failed to load analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loader message="Rendering operations intelligence..." />;
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      <div>
        <h2 className="text-2xl font-bold text-white tracking-tight">Analytics & Intelligence Studio</h2>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Quantitative telemetry across campus equipment categories, resolution rates, and team velocity
        </p>
      </div>

      {/* Top Metric Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <Card className="p-6 bg-gradient-to-tr from-brand-600 to-indigo-600 text-white border-brand-500/30">
          <p className="text-xs font-semibold text-brand-200 uppercase tracking-wider">Overall Resolution Rate</p>
          <h3 className="text-4xl font-extrabold mt-2 tracking-tight">{analytics?.resolutionRate || 0}%</h3>
          <p className="text-xs text-brand-200 mt-2">Percentage of reported issues successfully resolved</p>
        </Card>

        <Card className="p-6">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Top Issue Domain</p>
          <h3 className="text-2xl font-bold text-white mt-2">
            {analytics?.categoryDistribution?.[0]?.name || 'Wi-Fi / Internet'}
          </h3>
          <p className="text-xs text-slate-400 mt-2">Represents highest volume of campus tickets</p>
        </Card>

        <Card className="p-6">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Staff Deployment Ratio</p>
          <h3 className="text-2xl font-bold text-white mt-2">
            {analytics?.staffWorkload?.length || 3} Active Specialists
          </h3>
          <p className="text-xs text-slate-400 mt-2">Assigned across academic, hostel, and lab facilities</p>
        </Card>
      </div>

      {/* Chart Rows */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Chart */}
        <Card className="p-6">
          <h3 className="text-sm font-semibold text-white mb-1">Issue Distribution by Domain</h3>
          <p className="text-xs text-slate-400 mb-6">Aggregated volume per campus operational area</p>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analytics?.categoryDistribution || []} margin={{ top: 10, right: 10, left: -20, bottom: 30 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" />
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#94a3b8' }} stroke="#475569" interval={0} angle={-35} textAnchor="end" />
                <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} stroke="#475569" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', border: '1px solid #334155', color: '#fff', fontSize: '12px' }}
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

        {/* Priority Chart */}
        <Card className="p-6">
          <h3 className="text-sm font-semibold text-white mb-1">Priority Classification</h3>
          <p className="text-xs text-slate-400 mb-6">Urgency distribution of tickets</p>
          <div className="h-72 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={analytics?.priorityDistribution || []}
                  dataKey="count"
                  nameKey="priority"
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={95}
                  paddingAngle={5}
                  label={({ priority, count }) => `${priority}: ${count}`}
                >
                  {(analytics?.priorityDistribution || []).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={PRIORITY_COLORS[entry.priority] || '#3b82f6'} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', border: '1px solid #334155', color: '#fff', fontSize: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* 7-Day Trend */}
        <Card className="p-6 lg:col-span-2">
          <h3 className="text-sm font-semibold text-white mb-1">Daily Issue Resolution Velocity</h3>
          <p className="text-xs text-slate-400 mb-6">Comparing reported ticket inflow against completed repairs</p>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={analytics?.trendData || []} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#94a3b8' }} stroke="#475569" />
                <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} stroke="#475569" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', border: '1px solid #334155', color: '#fff', fontSize: '12px' }}
                />
                <Legend />
                <Line type="monotone" dataKey="reported" stroke="#ef4444" strokeWidth={2.5} dot={{ r: 4 }} name="Tickets Reported" />
                <Line type="monotone" dataKey="resolved" stroke="#10b981" strokeWidth={2.5} dot={{ r: 4 }} name="Tickets Resolved" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
};
