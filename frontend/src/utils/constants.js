export const CATEGORIES = [
  { value: 'WIFI_INTERNET', label: 'Wi-Fi / Internet', color: 'blue', icon: 'Wifi' },
  { value: 'ELECTRICAL', label: 'Electrical', color: 'amber', icon: 'Zap' },
  { value: 'CLASSROOM', label: 'Classroom', color: 'indigo', icon: 'Presentation' },
  { value: 'LABORATORY', label: 'Laboratory', color: 'purple', icon: 'FlaskConical' },
  { value: 'HOSTEL', label: 'Hostel', color: 'emerald', icon: 'Home' },
  { value: 'CLEANING', label: 'Cleaning', color: 'teal', icon: 'Sparkles' },
  { value: 'LIBRARY', label: 'Library', color: 'cyan', icon: 'BookOpen' },
  { value: 'TRANSPORT', label: 'Transport', color: 'orange', icon: 'Bus' },
  { value: 'SECURITY', label: 'Security', color: 'rose', icon: 'ShieldAlert' },
  { value: 'OTHER', label: 'Other', color: 'slate', icon: 'HelpCircle' },
];

export const PRIORITIES = {
  LOW: { label: 'Low', badgeClass: 'bg-slate-800/80 text-slate-300 border-slate-700' },
  MEDIUM: { label: 'Medium', badgeClass: 'bg-blue-500/15 text-blue-300 border-blue-500/30' },
  HIGH: { label: 'High', badgeClass: 'bg-amber-500/15 text-amber-300 border-amber-500/30' },
  CRITICAL: { label: 'Critical', badgeClass: 'bg-rose-500/20 text-rose-300 border-rose-500/40 font-bold' },
};

export const STATUSES = {
  REPORTED: { step: 1, label: 'Reported', badgeClass: 'bg-amber-500/15 text-amber-300 border-amber-500/30' },
  ASSIGNED: { step: 2, label: 'Assigned', badgeClass: 'bg-blue-500/15 text-blue-300 border-blue-500/30' },
  IN_PROGRESS: { step: 3, label: 'In Progress', badgeClass: 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30' },
  RESOLVED: { step: 4, label: 'Resolved', badgeClass: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30' },
  CLOSED: { step: 5, label: 'Closed', badgeClass: 'bg-slate-800/80 text-slate-400 border-slate-700' },
};

export const ROLES = {
  ROLE_STUDENT: 'Student',
  ROLE_STAFF: 'Staff Member',
  ROLE_ADMIN: 'Administrator',
};
