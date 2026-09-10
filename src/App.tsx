import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './contexts/AppContext';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Employees from './pages/Employees';
import EmployeeProfile from './pages/EmployeeProfile';
import OrganizationChart from './pages/OrganizationChart';
import Attendance from './pages/Attendance';
import Leave from './pages/Leave';
import Recruitment from './pages/Recruitment';
import Performance from './pages/Performance';
import Learning from './pages/Learning';
import Payroll from './pages/Payroll';
import Turnover from './pages/Turnover';
import WorkforceAnalytics from './pages/WorkforceAnalytics';
import Reports from './pages/Reports';
import ExcelPage from './pages/ExcelPage';
import SettingsPage from './pages/Settings';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useApp();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

function PublicRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useApp();
  if (isAuthenticated) return <Navigate to="/" replace />;
  return <>{children}</>;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
      <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
        <Route index element={<Dashboard />} />
        <Route path="employees" element={<Employees />} />
        <Route path="employees/:id" element={<EmployeeProfile />} />
        <Route path="organization" element={<OrganizationChart />} />
        <Route path="attendance" element={<Attendance />} />
        <Route path="leave" element={<Leave />} />
        <Route path="recruitment" element={<Recruitment />} />
        <Route path="performance" element={<Performance />} />
        <Route path="learning" element={<Learning />} />
        <Route path="payroll" element={<Payroll />} />
        <Route path="turnover" element={<Turnover />} />
        <Route path="workforce" element={<WorkforceAnalytics />} />
        <Route path="reports" element={<Reports />} />
        <Route path="excel" element={<ExcelPage />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <HashRouter>
      <AppProvider>
        <AppRoutes />
      </AppProvider>
    </HashRouter>
  );
}
