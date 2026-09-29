import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/common/Button';
import {
  Compass,
  Lock,
  Mail,
  User,
  Phone,
  BookOpen,
  AlertCircle,
  ArrowRight,
  GraduationCap,
  Wrench,
  Shield,
  Briefcase,
} from 'lucide-react';

const STUDENT_DEPTS = [
  'Computer Science & Engineering',
  'Electrical & Electronics Engineering',
  'Mechanical Engineering',
  'Civil & Environmental Engineering',
  'Biotechnology & Chemical Sciences',
  'Business & Management Studies',
];

const STAFF_DEPTS = [
  'IT Infrastructure & Networks',
  'Electrical & Hardware Maintenance',
  'Facilities & Hostel Operations',
  'Laboratories & Specialized Gear',
  'Campus Transport & Shuttles',
  'Campus Security & Safety',
];

const ADMIN_DEPTS = [
  'Campus Administration & Operations',
  'Dean of Student Affairs',
  'Estate & Infrastructure Management',
];

export const RegisterPage = () => {
  const [role, setRole] = useState('ROLE_STUDENT');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    department: STUDENT_DEPTS[0],
    phone: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleRoleSelect = (selectedRole) => {
    setRole(selectedRole);
    let defaultDept = STUDENT_DEPTS[0];
    if (selectedRole === 'ROLE_STAFF') {
      defaultDept = STAFF_DEPTS[0];
    } else if (selectedRole === 'ROLE_ADMIN') {
      defaultDept = ADMIN_DEPTS[0];
    }
    setFormData((prev) => ({
      ...prev,
      department: defaultDept,
    }));
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await register({
        ...formData,
        role,
      });

      if (response.role === 'ROLE_ADMIN') {
        navigate('/admin-dashboard');
      } else if (response.role === 'ROLE_STAFF') {
        navigate('/staff-dashboard');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      console.error('Registration failed:', err);
      const msg = err.response?.data?.message || 'Failed to create account. Please verify details.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const currentDepts = role === 'ROLE_ADMIN' ? ADMIN_DEPTS : role === 'ROLE_STAFF' ? STAFF_DEPTS : STUDENT_DEPTS;

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg">
        <div className="bg-slate-900/90 border border-slate-800 backdrop-blur-xl rounded-3xl p-6 sm:p-8 shadow-2xl">
          <div className="text-center mb-6">
            <div className="inline-flex w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-600 to-indigo-500 items-center justify-center text-white mb-3 shadow-glow-sm">
              <Compass className="w-6 h-6 stroke-[2.5]" />
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight">Create Institutional Account</h2>
            <p className="text-xs text-slate-400 mt-1">
              Select your university role and join the CampusCare operations network
            </p>
          </div>

          {/* Role Selection Tabs */}
          <div className="grid grid-cols-3 gap-2 mb-6">
            <button
              type="button"
              onClick={() => handleRoleSelect('ROLE_STUDENT')}
              className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center gap-1.5 ${
                role === 'ROLE_STUDENT'
                  ? 'bg-brand-500/15 border-brand-500 text-white shadow-glow-sm'
                  : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
              }`}
            >
              <GraduationCap className={`w-5 h-5 ${role === 'ROLE_STUDENT' ? 'text-brand-400' : 'text-slate-500'}`} />
              <span className="text-xs font-bold">Student</span>
            </button>

            <button
              type="button"
              onClick={() => handleRoleSelect('ROLE_STAFF')}
              className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center gap-1.5 ${
                role === 'ROLE_STAFF'
                  ? 'bg-blue-500/15 border-blue-500 text-white shadow-glow-sm'
                  : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
              }`}
            >
              <Wrench className={`w-5 h-5 ${role === 'ROLE_STAFF' ? 'text-blue-400' : 'text-slate-500'}`} />
              <span className="text-xs font-bold">Staff</span>
            </button>

            <button
              type="button"
              onClick={() => handleRoleSelect('ROLE_ADMIN')}
              className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center gap-1.5 ${
                role === 'ROLE_ADMIN'
                  ? 'bg-purple-500/15 border-purple-500 text-white shadow-glow-sm'
                  : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
              }`}
            >
              <Shield className={`w-5 h-5 ${role === 'ROLE_ADMIN' ? 'text-purple-400' : 'text-slate-500'}`} />
              <span className="text-xs font-bold">Admin</span>
            </button>
          </div>

          {error && (
            <div className="mb-6 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Full Name *
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder={role === 'ROLE_ADMIN' ? 'Dr. Sarah Connor' : role === 'ROLE_STAFF' ? 'Marcus Vance' : 'Alex Rivera'}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-700 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Institutional Email *
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder={role === 'ROLE_ADMIN' ? 'admin@campuscare.com' : role === 'ROLE_STAFF' ? 'staff@campuscare.com' : 'student@campuscare.com'}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-700 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                {role === 'ROLE_STAFF' ? 'Specialization / Maintenance Department *' : role === 'ROLE_ADMIN' ? 'Administrative Division *' : 'Academic Department *'}
              </label>
              <div className="relative">
                <Briefcase className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                <select
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs sm:text-sm text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                >
                  {currentDepts.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>
              {role === 'ROLE_STAFF' && (
                <p className="text-[11px] text-brand-400 mt-1">
                  You will automatically receive live push notifications for issues reported in this department!
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Phone Number (Optional)
              </label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+1 (555) 000-0000"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-700 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Password *
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                <input
                  type="password"
                  name="password"
                  required
                  minLength={6}
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="At least 6 characters"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-700 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              loading={loading}
              className="w-full mt-2"
              icon={ArrowRight}
            >
              Complete Registration as {role === 'ROLE_ADMIN' ? 'Admin' : role === 'ROLE_STAFF' ? 'Staff' : 'Student'}
            </Button>
          </form>

          <p className="mt-6 text-center text-xs text-slate-400">
            Already have an account?{' '}
            <Link to="/login" className="text-brand-400 hover:text-brand-300 font-semibold">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
