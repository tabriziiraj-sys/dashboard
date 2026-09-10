export interface Employee {
  id: string;
  employeeCode: string;
  firstName: string;
  lastName: string;
  fullName: string;
  nationalId: string;
  gender: 'male' | 'female';
  birthDate: string;
  age: number;
  maritalStatus: 'single' | 'married';
  mobile: string;
  email: string;
  province: string;
  city: string;
  address: string;
  avatar: string;
  departmentId: string;
  department: string;
  jobTitle: string;
  managerId: string | null;
  managerName: string;
  branch: string;
  location: string;
  hireDate: string;
  tenure: number;
  employmentType: 'permanent' | 'contract' | 'partTime';
  employmentStatus: 'active' | 'inactive' | 'terminated';
  workMode: 'onsite' | 'remote' | 'hybrid';
  baseSalary: number;
  allowances: number;
  bonus: number;
  overtimePay: number;
  deductions: number;
  netSalary: number;
  remainingLeave: number;
  usedLeave: number;
  totalLeaveEntitlement: number;
  attendanceRate: number;
  absenceDays: number;
  lateMinutes: number;
  earlyLeaves: number;
  overtimeHours: number;
  performanceScore: number;
  trainingHours: number;
  education: string;
  degree: string;
  exitDate: string | null;
  exitReason: string | null;
}

export interface Department {
  id: string;
  name: string;
  managerId: string;
  managerName: string;
  parentId: string | null;
  headcount: number;
}

export interface AttendanceRecord {
  employeeId: string;
  date: string;
  status: 'present' | 'absent' | 'leave' | 'mission' | 'holiday';
  clockIn: string | null;
  clockOut: string | null;
  workHours: number;
  overtimeHours: number;
  lateMinutes: number;
  earlyLeaveMinutes: number;
}

export interface LeaveRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  type: 'annual' | 'sick' | 'unpaid' | 'hourly' | 'mission' | 'other';
  startDate: string;
  endDate: string;
  days: number;
  status: 'pending' | 'approved' | 'rejected';
  description: string;
}

export interface RecruitmentPosition {
  id: string;
  title: string;
  department: string;
  status: 'open' | 'closed' | 'onHold';
  postedDate: string;
  applicants: number;
  screened: number;
  interviewed: number;
  offered: number;
  hired: number;
  source: string;
}

export interface PerformanceReview {
  employeeId: string;
  employeeName: string;
  department: string;
  period: string;
  score: number;
  goals: string[];
  feedback: string;
  reviewer: string;
}

export interface TrainingCourse {
  id: string;
  title: string;
  department: string;
  instructor: string;
  hours: number;
  cost: number;
  participants: number;
  completionRate: number;
  averageScore: number;
  startDate: string;
  endDate: string;
  status: 'active' | 'completed' | 'upcoming';
}

export interface Alert {
  id: string;
  type: 'warning' | 'danger' | 'info' | 'success';
  title: string;
  message: string;
  date: string;
  read: boolean;
  category: string;
}

export interface Notification {
  id: string;
  type: 'info' | 'warning' | 'success' | 'error';
  title: string;
  message: string;
  date: string;
  read: boolean;
}

export interface FilterState {
  year: string;
  month: string;
  department: string;
  branch: string;
  city: string;
  gender: string;
  employmentType: string;
  employmentStatus: string;
  ageGroup: string;
  tenure: string;
  jobTitle: string;
  workMode: string;
}

export type ThemeMode = 'light' | 'dark';
