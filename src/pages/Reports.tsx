import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { SectionCard, Badge } from '../components/UIComponents';
import { formatNumber, formatCurrency } from '../utils/helpers';
import { FileText, Download, Filter } from 'lucide-react';
import * as XLSX from 'xlsx';

const reportTypes = [
  { id: 'headcount', name: 'گزارش تعداد کارکنان', desc: 'تعداد کارکنان بر اساس واحد، جنسیت، نوع قرارداد' },
  { id: 'recruitment', name: 'گزارش جذب', desc: 'وضعیت موقعیت‌های شغلی و فرآیند استخدام' },
  { id: 'turnover', name: 'گزارش خروج', desc: 'آمار ترک خدمت و دلایل خروج' },
  { id: 'attendance', name: 'گزارش حضور', desc: 'آمار حضور، غیبت، تأخیر و اضافه‌کاری' },
  { id: 'leave', name: 'گزارش مرخصی', desc: 'وضعیت مرخصی کارکنان' },
  { id: 'performance', name: 'گزارش عملکرد', desc: 'امتیاز عملکرد کارکنان و واحدها' },
  { id: 'training', name: 'گزارش آموزش', desc: 'دوره‌ها و ساعات آموزش' },
  { id: 'payroll', name: 'گزارش حقوق', desc: 'حقوق و مزایای کارکنان' },
];

export default function Reports() {
  const { filteredEmployees, departments, leaveRecords, trainingCourses, recruitmentPositions } = useApp();
  const [selectedReport, setSelectedReport] = useState('headcount');
  const active = filteredEmployees.filter(e => e.employmentStatus === 'active');

  const handleExport = () => {
    let data: Record<string, any>[] = [];
    let filename = '';

    switch (selectedReport) {
      case 'headcount':
        filename = 'report-headcount';
        data = departments.map(d => ({
          'واحد': d.name,
          'تعداد': filteredEmployees.filter(e => e.department === d.name && e.employmentStatus === 'active').length,
          'مرد': filteredEmployees.filter(e => e.department === d.name && e.gender === 'male' && e.employmentStatus === 'active').length,
          'زن': filteredEmployees.filter(e => e.department === d.name && e.gender === 'female' && e.employmentStatus === 'active').length,
        }));
        break;
      case 'performance':
        filename = 'report-performance';
        data = active.map(e => ({ 'نام': e.fullName, 'واحد': e.department, 'سمت': e.jobTitle, 'امتیاز': e.performanceScore }));
        break;
      case 'payroll':
        filename = 'report-payroll';
        data = active.map(e => ({ 'نام': e.fullName, 'واحد': e.department, 'حقوق پایه': e.baseSalary, 'مزایا': e.allowances, 'دریافتی': e.netSalary }));
        break;
      case 'attendance':
        filename = 'report-attendance';
        data = active.slice(0, 50).map(e => ({ 'نام': e.fullName, 'واحد': e.department, 'نرخ حضور': `${e.attendanceRate}%`, 'غیبت': e.absenceDays, 'تأخیر': e.lateMinutes, 'اضافه‌کاری': e.overtimeHours }));
        break;
      case 'leave':
        filename = 'report-leave';
        data = leaveRecords.map(r => ({ 'کارمند': r.employeeName, 'نوع': r.type, 'از': r.startDate, 'تا': r.endDate, 'روز': r.days, 'وضعیت': r.status }));
        break;
      case 'training':
        filename = 'report-training';
        data = trainingCourses.map(c => ({ 'عنوان': c.title, 'واحد': c.department, 'ساعات': c.hours, 'هزینه': c.cost, 'شرکت‌کننده': c.participants, 'نرخ تکمیل': `${c.completionRate}%` }));
        break;
      case 'recruitment':
        filename = 'report-recruitment';
        data = recruitmentPositions.map(p => ({ 'عنوان': p.title, 'واحد': p.department, 'وضعیت': p.status, 'متقاضی': p.applicants, 'مصاحبه': p.interviewed, 'استخدام': p.hired }));
        break;
      case 'turnover':
        filename = 'report-turnover';
        const exited = filteredEmployees.filter(e => e.employmentStatus === 'terminated');
        data = exited.map(e => ({ 'نام': e.fullName, 'واحد': e.department, 'تاریخ خروج': e.exitDate, 'دلیل': e.exitReason, 'سابقه': e.tenure }));
        break;
    }

    if (data.length > 0) {
      const ws = XLSX.utils.json_to_sheet(data);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'گزارش');
      XLSX.writeFile(wb, `${filename}.xlsx`);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold">گزارش‌ها</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {reportTypes.map(r => (
          <button
            key={r.id}
            onClick={() => setSelectedReport(r.id)}
            className={`p-4 rounded-xl border text-right transition-all ${selectedReport === r.id ? 'border-blue-500 bg-blue-50 shadow-sm' : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'}`}
          >
            <div className="flex items-center gap-3 mb-2">
              <FileText className={`w-5 h-5 ${selectedReport === r.id ? 'text-blue-600' : 'text-gray-400'}`} />
              <span className="font-bold text-sm">{r.name}</span>
            </div>
            <p className="text-xs text-gray-500">{r.desc}</p>
          </button>
        ))}
      </div>

      <div className="flex items-center justify-between">
        <h2 className="font-bold">{reportTypes.find(r => r.id === selectedReport)?.name}</h2>
        <button onClick={handleExport} className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm hover:bg-emerald-700">
          <Download className="w-4 h-4" /> خروجی Excel
        </button>
      </div>

      <div className="bg-white border rounded-xl overflow-hidden">
        {selectedReport === 'headcount' && (
          <table className="w-full text-sm">
            <thead className="bg-gray-50"><tr><th className="p-3 text-right">واحد</th><th className="p-3 text-right">تعداد</th><th className="p-3 text-right">مرد</th><th className="p-3 text-right">زن</th><th className="p-3 text-right">رسمی</th><th className="p-3 text-right">قراردادی</th></tr></thead>
            <tbody>
              {departments.map(d => {
                const emps = filteredEmployees.filter(e => e.department === d.name && e.employmentStatus === 'active');
                return (
                  <tr key={d.id} className="border-t">
                    <td className="p-3 font-medium">{d.name}</td>
                    <td className="p-3">{emps.length}</td>
                    <td className="p-3">{emps.filter(e => e.gender === 'male').length}</td>
                    <td className="p-3">{emps.filter(e => e.gender === 'female').length}</td>
                    <td className="p-3">{emps.filter(e => e.employmentType === 'permanent').length}</td>
                    <td className="p-3">{emps.filter(e => e.employmentType === 'contract').length}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}

        {selectedReport === 'performance' && (
          <table className="w-full text-sm">
            <thead className="bg-gray-50"><tr><th className="p-3 text-right">نام</th><th className="p-3 text-right">واحد</th><th className="p-3 text-right">سمت</th><th className="p-3 text-right">امتیاز</th><th className="p-3 text-right">وضعیت</th></tr></thead>
            <tbody>
              {active.sort((a, b) => b.performanceScore - a.performanceScore).slice(0, 30).map(e => (
                <tr key={e.id} className="border-t">
                  <td className="p-3">{e.fullName}</td>
                  <td className="p-3">{e.department}</td>
                  <td className="p-3">{e.jobTitle}</td>
                  <td className="p-3 font-bold">{e.performanceScore}</td>
                  <td className="p-3"><Badge variant={e.performanceScore >= 4 ? 'success' : e.performanceScore >= 3 ? 'info' : 'warning'}>{e.performanceScore >= 4 ? 'عالی' : e.performanceScore >= 3 ? 'خوب' : 'متوسط'}</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {selectedReport === 'payroll' && (
          <table className="w-full text-sm">
            <thead className="bg-gray-50"><tr><th className="p-3 text-right">نام</th><th className="p-3 text-right">واحد</th><th className="p-3 text-right">حقوق پایه</th><th className="p-3 text-right">مزایا</th><th className="p-3 text-right">اضافه‌کاری</th><th className="p-3 text-right">کسورات</th><th className="p-3 text-right">دریافتی</th></tr></thead>
            <tbody>
              {active.slice(0, 30).map(e => (
                <tr key={e.id} className="border-t">
                  <td className="p-3">{e.fullName}</td>
                  <td className="p-3">{e.department}</td>
                  <td className="p-3">{formatCurrency(e.baseSalary)}</td>
                  <td className="p-3">{formatCurrency(e.allowances)}</td>
                  <td className="p-3">{formatCurrency(e.overtimePay)}</td>
                  <td className="p-3">{formatCurrency(e.deductions)}</td>
                  <td className="p-3 font-bold">{formatCurrency(e.netSalary)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {selectedReport === 'attendance' && (
          <table className="w-full text-sm">
            <thead className="bg-gray-50"><tr><th className="p-3 text-right">نام</th><th className="p-3 text-right">واحد</th><th className="p-3 text-right">نرخ حضور</th><th className="p-3 text-right">غیبت</th><th className="p-3 text-right">تأخیر</th><th className="p-3 text-right">اضافه‌کاری</th></tr></thead>
            <tbody>
              {active.slice(0, 30).map(e => (
                <tr key={e.id} className="border-t">
                  <td className="p-3">{e.fullName}</td>
                  <td className="p-3">{e.department}</td>
                  <td className="p-3"><Badge variant={e.attendanceRate >= 95 ? 'success' : 'warning'}>{e.attendanceRate}%</Badge></td>
                  <td className="p-3">{e.absenceDays}</td>
                  <td className="p-3">{e.lateMinutes} دقیقه</td>
                  <td className="p-3">{Math.round(e.overtimeHours)} ساعت</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {(selectedReport === 'leave' || selectedReport === 'training' || selectedReport === 'recruitment' || selectedReport === 'turnover') && (
          <div className="p-8 text-center text-gray-500">
            <FileText className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p>برای مشاهده و خروجی این گزارش روی دکمه خروجی Excel کلیک کنید</p>
          </div>
        )}
      </div>
    </div>
  );
}
