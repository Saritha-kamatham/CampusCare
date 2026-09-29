import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';

// Layouts
import { PublicLayout } from './layouts/PublicLayout';
import { DashboardLayout } from './layouts/DashboardLayout';

// Public Pages
import { LandingPage } from './pages/public/LandingPage';
import { LoginPage } from './pages/public/LoginPage';
import { RegisterPage } from './pages/public/RegisterPage';

// Student Pages
import { StudentDashboard } from './pages/student/StudentDashboard';
import { ReportIssuePage } from './pages/student/ReportIssuePage';
import { MyIssuesPage } from './pages/student/MyIssuesPage';

// Staff Pages
import { StaffDashboard } from './pages/staff/StaffDashboard';
import { AssignedIssuesPage } from './pages/staff/AssignedIssuesPage';

// Admin Pages
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AllIssuesPage } from './pages/admin/AllIssuesPage';
import { AnalyticsPage } from './pages/admin/AnalyticsPage';
import { UserManagementPage } from './pages/admin/UserManagementPage';
import { StaffManagementPage } from './pages/admin/StaffManagementPage';

// Shared Pages
import { IssueDetailsPage } from './pages/shared/IssueDetailsPage';
import { ProfilePage } from './pages/shared/ProfilePage';
import { NotificationsPage } from './pages/shared/NotificationsPage';
import { NotFoundPage } from './pages/shared/NotFoundPage';

export function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <NotificationProvider>
          <Routes>
            {/* Public Routes */}
            <Route element={<PublicLayout />}>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
            </Route>

            {/* Student Protected Routes */}
            <Route element={<DashboardLayout allowedRoles={['ROLE_STUDENT', 'ROLE_ADMIN']} />}>
              <Route path="/dashboard" element={<StudentDashboard />} />
              <Route path="/report-issue" element={<ReportIssuePage />} />
              <Route path="/my-issues" element={<MyIssuesPage />} />
            </Route>

            {/* Staff Protected Routes */}
            <Route element={<DashboardLayout allowedRoles={['ROLE_STAFF', 'ROLE_ADMIN']} />}>
              <Route path="/staff-dashboard" element={<StaffDashboard />} />
              <Route path="/assigned-issues" element={<AssignedIssuesPage />} />
            </Route>

            {/* Admin Protected Routes */}
            <Route element={<DashboardLayout allowedRoles={['ROLE_ADMIN']} />}>
              <Route path="/admin-dashboard" element={<AdminDashboard />} />
              <Route path="/admin/issues" element={<AllIssuesPage />} />
              <Route path="/admin/analytics" element={<AnalyticsPage />} />
              <Route path="/admin/users" element={<UserManagementPage />} />
              <Route path="/admin/staff" element={<StaffManagementPage />} />
            </Route>

            {/* Shared Authenticated Routes */}
            <Route element={<DashboardLayout allowedRoles={['ROLE_STUDENT', 'ROLE_STAFF', 'ROLE_ADMIN']} />}>
              <Route path="/issues/:id" element={<IssueDetailsPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/notifications" element={<NotificationsPage />} />
            </Route>

            {/* Catch-all 404 */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </NotificationProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
