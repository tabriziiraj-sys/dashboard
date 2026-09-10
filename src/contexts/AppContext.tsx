import React, { createContext, useContext, useState, useCallback, useMemo, ReactNode } from 'react';
import { Employee, Department, LeaveRecord, RecruitmentPosition, TrainingCourse, Alert, Notification, FilterState, ThemeMode } from '../data/types';
import { generateEmployees, generateDepartments, generateLeaveRecords, generateRecruitmentPositions, generateTrainingCourses, generateAlerts, generateNotifications, generatePerformanceReviews } from '../data/seedData';
import { PerformanceReview } from '../data/types';

interface AppContextType {
  // Auth
  isAuthenticated: boolean;
  user: { username: string; role: string } | null;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  // Data
  employees: Employee[];
  departments: Department[];
  leaveRecords: LeaveRecord[];
  recruitmentPositions: RecruitmentPosition[];
  performanceReviews: PerformanceReview[];
  trainingCourses: TrainingCourse[];
  alerts: Alert[];
  notifications: Notification[];
  // CRUD
  addEmployee: (emp: Employee) => void;
  updateEmployee: (emp: Employee) => void;
  deleteEmployee: (id: string) => void;
  importEmployees: (emps: Employee[]) => { success: number; failed: number; duplicate: number };
  // Filters
  filters: FilterState;
  setFilters: (f: Partial<FilterState>) => void;
  clearFilters: () => void;
  filteredEmployees: Employee[];
  // Theme
  theme: ThemeMode;
  toggleTheme: () => void;
  // Notifications
  markNotificationRead: (id: string) => void;
  markAlertRead: (id: string) => void;
}

const defaultFilters: FilterState = {
  year: '', month: '', department: '', branch: '', city: '',
  gender: '', employmentType: '', employmentStatus: '',
  ageGroup: '', tenure: '', jobTitle: '', workMode: '',
};

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return sessionStorage.getItem('hr_auth') === 'true';
  });
  const [user, setUser] = useState<{ username: string; role: string } | null>(() => {
    if (sessionStorage.getItem('hr_auth') === 'true') {
      return { username: 'admin', role: 'admin' };
    }
    return null;
  });

  const [employees, setEmployees] = useState<Employee[]>(() => generateEmployees());
  const [departments] = useState<Department[]>(() => {
    const depts = generateDepartments();
    const emps = generateEmployees();
    return depts.map(d => ({ ...d, headcount: emps.filter(e => e.departmentId === d.id && e.employmentStatus === 'active').length }));
  });
  const [leaveRecords] = useState<LeaveRecord[]>(() => generateLeaveRecords(generateEmployees()));
  const [recruitmentPositions] = useState<RecruitmentPosition[]>(() => generateRecruitmentPositions());
  const [performanceReviews] = useState<PerformanceReview[]>(() => generatePerformanceReviews(generateEmployees()));
  const [trainingCourses] = useState<TrainingCourse[]>(() => generateTrainingCourses());
  const [alerts, setAlerts] = useState<Alert[]>(() => generateAlerts());
  const [notifications, setNotifications] = useState<Notification[]>(() => generateNotifications());
  const [filters, setFiltersState] = useState<FilterState>(defaultFilters);
  const [theme, setTheme] = useState<ThemeMode>('light');

  const login = useCallback((username: string, password: string): boolean => {
    if (username === 'admin' && password === '12345') {
      setIsAuthenticated(true);
      setUser({ username: 'admin', role: 'admin' });
      sessionStorage.setItem('hr_auth', 'true');
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    setIsAuthenticated(false);
    setUser(null);
    sessionStorage.removeItem('hr_auth');
  }, []);

  const addEmployee = useCallback((emp: Employee) => {
    setEmployees(prev => [...prev, emp]);
  }, []);

  const updateEmployee = useCallback((emp: Employee) => {
    setEmployees(prev => prev.map(e => e.id === emp.id ? emp : e));
  }, []);

  const deleteEmployee = useCallback((id: string) => {
    setEmployees(prev => prev.filter(e => e.id !== id));
  }, []);

  const importEmployees = useCallback((newEmps: Employee[]) => {
    let success = 0, failed = 0, duplicate = 0;
    const existingCodes = new Set(employees.map(e => e.employeeCode));
    const toAdd: Employee[] = [];
    
    newEmps.forEach(emp => {
      if (!emp.firstName || !emp.lastName) { failed++; return; }
      if (existingCodes.has(emp.employeeCode)) { duplicate++; return; }
      toAdd.push(emp);
      existingCodes.add(emp.employeeCode);
      success++;
    });
    
    setEmployees(prev => [...prev, ...toAdd]);
    return { success, failed, duplicate };
  }, [employees]);

  const setFilters = useCallback((f: Partial<FilterState>) => {
    setFiltersState(prev => ({ ...prev, ...f }));
  }, []);

  const clearFilters = useCallback(() => {
    setFiltersState(defaultFilters);
  }, []);

  const filteredEmployees = useMemo(() => {
    return employees.filter(emp => {
      if (filters.department && emp.department !== filters.department) return false;
      if (filters.branch && emp.branch !== filters.branch) return false;
      if (filters.city && emp.city !== filters.city) return false;
      if (filters.gender && emp.gender !== filters.gender) return false;
      if (filters.employmentType && emp.employmentType !== filters.employmentType) return false;
      if (filters.employmentStatus && emp.employmentStatus !== filters.employmentStatus) return false;
      if (filters.workMode && emp.workMode !== filters.workMode) return false;
      if (filters.ageGroup) {
        const [min, max] = filters.ageGroup.split('-').map(Number);
        if (max && (emp.age < min || emp.age > max)) return false;
        if (!max && emp.age < min) return false;
      }
      if (filters.tenure) {
        if (filters.tenure === 'lt1' && emp.tenure >= 1) return false;
        if (filters.tenure === '1-3' && (emp.tenure < 1 || emp.tenure >= 3)) return false;
        if (filters.tenure === '3-5' && (emp.tenure < 3 || emp.tenure >= 5)) return false;
        if (filters.tenure === '5-10' && (emp.tenure < 5 || emp.tenure >= 10)) return false;
        if (filters.tenure === 'gt10' && emp.tenure < 10) return false;
      }
      return true;
    });
  }, [employees, filters]);

  const toggleTheme = useCallback(() => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  }, []);

  const markNotificationRead = useCallback((id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  }, []);

  const markAlertRead = useCallback((id: string) => {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, read: true } : a));
  }, []);

  const value = useMemo(() => ({
    isAuthenticated, user, login, logout,
    employees, departments, leaveRecords, recruitmentPositions,
    performanceReviews, trainingCourses, alerts, notifications,
    addEmployee, updateEmployee, deleteEmployee, importEmployees,
    filters, setFilters, clearFilters, filteredEmployees,
    theme, toggleTheme,
    markNotificationRead, markAlertRead,
  }), [isAuthenticated, user, login, logout, employees, departments,
    leaveRecords, recruitmentPositions, performanceReviews, trainingCourses,
    alerts, notifications, addEmployee, updateEmployee, deleteEmployee,
    importEmployees, filters, setFilters, clearFilters, filteredEmployees,
    theme, toggleTheme, markNotificationRead, markAlertRead]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
