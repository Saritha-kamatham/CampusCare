export const COLORS = {
  background: '#020617', // slate-950
  card: '#0f172a',       // slate-900
  cardBorder: '#1e293b', // slate-800
  cardHover: '#1e293b',
  text: '#f8fafc',       // slate-50
  textMuted: '#94a3b8',  // slate-400
  textSubtle: '#64748b', // slate-500
  brand: '#0284c7',      // sky-600
  brandLight: '#38bdf8', // sky-400
  brandDark: '#0369a1',  // sky-700
  success: '#10b981',    // emerald-500
  successDark: '#059669',
  warning: '#f59e0b',    // amber-500
  danger: '#f43f5e',     // rose-500
  purple: '#a855f7',
  indigo: '#6366f1',
};

export const CATEGORIES = [
  { key: 'WIFI_INTERNET', label: 'Wi-Fi / Internet', icon: 'wifi' },
  { key: 'ELECTRICAL', label: 'Electrical & AC', icon: 'zap' },
  { key: 'CLASSROOM', label: 'Classroom & Projector', icon: 'tv' },
  { key: 'LABORATORY', label: 'Laboratory Equipment', icon: 'cpu' },
  { key: 'HOSTEL', label: 'Hostel & Plumbing', icon: 'home' },
  { key: 'CLEANING', label: 'Cleaning & Sanitation', icon: 'trash-2' },
  { key: 'LIBRARY', label: 'Library Facilities', icon: 'book' },
  { key: 'TRANSPORT', label: 'Campus Transport', icon: 'truck' },
  { key: 'SECURITY', label: 'Security & Access', icon: 'shield' },
  { key: 'OTHER', label: 'Other Inquiries', icon: 'help-circle' },
];

export const PRIORITIES = {
  LOW: { label: 'Low', color: '#64748b', bg: 'rgba(100, 116, 139, 0.15)' },
  MEDIUM: { label: 'Medium', color: '#38bdf8', bg: 'rgba(56, 189, 248, 0.15)' },
  HIGH: { label: 'High', color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.15)' },
  CRITICAL: { label: 'Critical', color: '#f43f5e', bg: 'rgba(244, 63, 94, 0.15)' },
};

export const STATUSES = {
  REPORTED: { label: 'Reported', color: '#f59e0b', step: 1 },
  ASSIGNED: { label: 'Assigned', color: '#38bdf8', step: 2 },
  IN_PROGRESS: { label: 'In Progress', color: '#6366f1', step: 3 },
  RESOLVED: { label: 'Resolved', color: '#10b981', step: 4 },
  CLOSED: { label: 'Closed', color: '#64748b', step: 5 },
};
