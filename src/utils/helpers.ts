import * as jalaali from 'jalaali-js';

export function toJalaali(dateStr: string): string {
  if (!dateStr) return '';
  const parts = dateStr.split('/');
  if (parts.length === 3 && parts[0].length === 4) return dateStr; // Already Jalaali
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  const j = jalaali.toJalaali(d.getFullYear(), d.getMonth() + 1, d.getDate());
  return `${j.jy}/${String(j.jm).padStart(2, '0')}/${String(j.jd).padStart(2, '0')}`;
}

export function toGregorian(jalaaliDate: string): Date {
  const [jy, jm, jd] = jalaaliDate.split('/').map(Number);
  const g = jalaali.toGregorian(jy, jm, jd);
  return new Date(g.gy, g.gm - 1, g.gd);
}

export function formatNumber(num: number): string {
  return new Intl.NumberFormat('fa-IR').format(num);
}

export function formatCurrency(num: number): string {
  if (num >= 1000000000) return `${(num / 1000000000).toFixed(1)} میلیارد`;
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)} میلیون`;
  if (num >= 1000) return `${(num / 1000).toFixed(0)} هزار`;
  return formatNumber(num);
}

export function formatSalary(num: number): string {
  return new Intl.NumberFormat('fa-IR') + ' ریال';
}

export function getMonthName(monthIndex: number): string {
  const months = ['فروردین','اردیبهشت','خرداد','تیر','مرداد','شهریور','مهر','آبان','آذر','دی','بهمن','اسفند'];
  return months[monthIndex - 1] || '';
}

export function getCurrentJalaaliDate(): string {
  const now = new Date();
  const j = jalaali.toJalaali(now.getFullYear(), now.getMonth() + 1, now.getDate());
  return `${j.jy}/${String(j.jm).padStart(2, '0')}/${String(j.jd).padStart(2, '0')}`;
}

export function getCurrentJalaaliMonth(): number {
  const now = new Date();
  const j = jalaali.toJalaali(now.getFullYear(), now.getMonth() + 1, now.getDate());
  return j.jm;
}

export function getCurrentJalaaliYear(): number {
  const now = new Date();
  const j = jalaali.toJalaali(now.getFullYear(), now.getMonth() + 1, now.getDate());
  return j.jy;
}

export function getAgeGroup(age: number): string {
  if (age < 25) return 'زیر ۲۵';
  if (age < 30) return '۲۵-۲۹';
  if (age < 35) return '۳۰-۳۴';
  if (age < 40) return '۳۵-۳۹';
  if (age < 45) return '۴۰-۴۴';
  if (age < 50) return '۴۵-۴۹';
  return '۵۰ و بالاتر';
}

export function getTenureGroup(tenure: number): string {
  if (tenure < 1) return 'کمتر از ۱ سال';
  if (tenure < 3) return '۱-۳ سال';
  if (tenure < 5) return '۳-۵ سال';
  if (tenure < 10) return '۵-۱۰ سال';
  return 'بیش از ۱۰ سال';
}

export function getPerformanceCategory(score: number): string {
  if (score >= 4.5) return 'عالی';
  if (score >= 3.5) return 'خوب';
  if (score >= 2.5) return 'متوسط';
  return 'نیازمند بهبود';
}

export function getPerformanceColor(score: number): string {
  if (score >= 4.5) return 'text-emerald-600';
  if (score >= 3.5) return 'text-blue-600';
  if (score >= 2.5) return 'text-amber-600';
  return 'text-red-600';
}

export function getLeaveTypeName(type: string): string {
  const types: Record<string, string> = {
    annual: 'استحقاقی',
    sick: 'استعلاجی',
    unpaid: 'بدون حقوق',
    hourly: 'ساعتی',
    mission: 'مأموریت',
    other: 'سایر',
  };
  return types[type] || type;
}

export function getEmploymentTypeName(type: string): string {
  const types: Record<string, string> = {
    permanent: 'رسمی',
    contract: 'قراردادی',
    partTime: 'پاره‌وقت',
  };
  return types[type] || type;
}

export function getStatusName(status: string): string {
  const types: Record<string, string> = {
    active: 'فعال',
    inactive: 'غیرفعال',
    terminated: 'خارج شده',
  };
  return types[status] || status;
}

export function getGenderName(gender: string): string {
  return gender === 'male' ? 'مرد' : 'زن';
}

export function getMaritalName(status: string): string {
  return status === 'married' ? 'متأهل' : 'مجرد';
}

export function getWorkModeName(mode: string): string {
  const types: Record<string, string> = {
    onsite: 'حضوری',
    remote: 'دورکار',
    hybrid: 'ترکیبی',
  };
  return types[mode] || mode;
}

export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}

export function calculatePercentageChange(current: number, previous: number): number {
  if (previous === 0) return current > 0 ? 100 : 0;
  return Math.round(((current - previous) / previous) * 1000) / 10;
}
