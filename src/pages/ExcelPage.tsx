import React, { useRef, useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { SectionCard } from '../components/UIComponents';
import { Upload, Download, FileSpreadsheet, CheckCircle, AlertCircle } from 'lucide-react';
import * as XLSX from 'xlsx';

export default function ExcelPage() {
  const { filteredEmployees, importEmployees } = useApp();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importPreview, setImportPreview] = useState<Record<string, string>[]>([]);
  const [importResult, setImportResult] = useState<{ success: number; failed: number; duplicate: number } | null>(null);
  const [columnMapping, setColumnMapping] = useState<Record<string, string>>({});

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      const wb = XLSX.read(evt.target?.result, { type: 'binary' });
      const ws = wb.Sheets[wb.SheetNames[0]];
      const data = XLSX.utils.sheet_to_json<Record<string, string>>(ws);
      setImportPreview(data);
      setImportResult(null);
      // Auto-map columns
      const cols = data.length > 0 ? Object.keys(data[0]) : [];
      const mapping: Record<string, string> = {};
      cols.forEach(c => {
        if (c.includes('نام') && !c.includes('خانوادگی')) mapping[c] = 'firstName';
        else if (c.includes('خانوادگی')) mapping[c] = 'lastName';
        else if (c.includes('کد پرسنلی') || c.includes('employeeCode')) mapping[c] = 'employeeCode';
        else if (c.includes('کد ملی')) mapping[c] = 'nationalId';
        else if (c.includes('واحد')) mapping[c] = 'department';
        else if (c.includes('سمت')) mapping[c] = 'jobTitle';
        else if (c.includes('موبایل')) mapping[c] = 'mobile';
        else if (c.includes('ایمیل')) mapping[c] = 'email';
        else mapping[c] = c;
      });
      setColumnMapping(mapping);
    };
    reader.readAsBinaryString(file);
  };

  const handleImport = () => {
    const newEmps: any[] = importPreview.map((row, i) => ({
      id: `imp-${Date.now()}-${i}`,
      employeeCode: row['کد پرسنلی'] || row['employeeCode'] || `IMP${1000 + i}`,
      firstName: row['نام'] || row['firstName'] || '',
      lastName: row['نام خانوادگی'] || row['lastName'] || '',
      fullName: `${row['نام'] || ''} ${row['نام خانوادگی'] || ''}`.trim(),
      nationalId: row['کد ملی'] || '',
      gender: 'male' as const, birthDate: '1370/01/01', age: 30,
      maritalStatus: 'single' as const, mobile: row['موبایل'] || '',
      email: row['ایمیل'] || '', province: 'تهران', city: 'تهران',
      address: '', avatar: '', departmentId: 'd1',
      department: row['واحد'] || 'فناوری اطلاعات',
      jobTitle: row['سمت'] || 'کارمند', managerId: null, managerName: '',
      branch: 'تهران - مرکزی', location: 'تهران', hireDate: '1403/01/01',
      tenure: 0, employmentType: 'contract' as const, employmentStatus: 'active' as const,
      workMode: 'onsite' as const, baseSalary: 20000000, allowances: 5000000,
      bonus: 0, overtimePay: 0, deductions: 1500000, netSalary: 23500000,
      remainingLeave: 20, usedLeave: 6, totalLeaveEntitlement: 26,
      attendanceRate: 95, absenceDays: 0, lateMinutes: 0, earlyLeaves: 0,
      overtimeHours: 0, performanceScore: 3.5, trainingHours: 0,
      education: '', degree: '', exitDate: null, exitReason: null,
    }));
    const result = importEmployees(newEmps);
    setImportResult(result);
  };

  const handleExportAll = () => {
    const data = filteredEmployees.map(e => ({
      'کد پرسنلی': e.employeeCode, 'نام': e.firstName, 'نام خانوادگی': e.lastName,
      'کد ملی': e.nationalId, 'جنسیت': e.gender === 'male' ? 'مرد' : 'زن',
      'تاریخ تولد': e.birthDate, 'موبایل': e.mobile, 'ایمیل': e.email,
      'واحد': e.department, 'سمت': e.jobTitle, 'مدیر': e.managerName,
      'تاریخ استخدام': e.hireDate, 'نوع قرارداد': e.employmentType === 'permanent' ? 'رسمی' : e.employmentType === 'contract' ? 'قراردادی' : 'پاره‌وقت',
      'وضعیت': e.employmentStatus === 'active' ? 'فعال' : e.employmentStatus === 'inactive' ? 'غیرفعال' : 'خارج شده',
      'شعبه': e.branch, 'حقوق پایه': e.baseSalary, 'دریافتی': e.netSalary,
      'امتیاز عملکرد': e.performanceScore, 'مانده مرخصی': e.remainingLeave,
    }));
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'کارکنان');
    XLSX.writeFile(wb, 'employees-full-export.xlsx');
  };

  const downloadTemplate = () => {
    const template = [
      { 'کد پرسنلی': 'EMP01001', 'نام': 'علی', 'نام خانوادگی': 'احمدی', 'کد ملی': '0012345678', 'جنسیت': 'مرد', 'موبایل': '09121234567', 'ایمیل': 'ali@test.com', 'واحد': 'فناوری اطلاعات', 'سمت': 'برنامه‌نویس' },
    ];
    const ws = XLSX.utils.json_to_sheet(template);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Template');
    XLSX.writeFile(wb, 'employees-import-template.xlsx');
  };

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold">ورود / خروج Excel</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Import Section */}
        <SectionCard title="📥 ورود اطلاعات از Excel">
          <div className="space-y-4">
            <p className="text-sm text-gray-600">فایل Excel خود را آپلود کنید. فرمت‌های .xlsx و .xls پشتیبانی می‌شوند.</p>
            
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-blue-400 transition-colors">
              <Upload className="w-10 h-10 mx-auto mb-3 text-gray-400" />
              <p className="text-sm text-gray-600 mb-3">فایل را اینجا بکشید یا کلیک کنید</p>
              <button onClick={() => fileInputRef.current?.click()} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">انتخاب فایل</button>
              <input ref={fileInputRef} type="file" accept=".xlsx,.xls" onChange={handleFileUpload} className="hidden" />
            </div>

            <button onClick={downloadTemplate} className="flex items-center gap-2 text-sm text-blue-600 hover:underline">
              <Download className="w-4 h-4" /> دانلود قالب نمونه Excel
            </button>

            {importPreview.length > 0 && !importResult && (
              <div className="space-y-3">
                <p className="text-sm font-medium">{importPreview.length} رکورد شناسایی شد</p>
                <div className="max-h-40 overflow-y-auto border rounded-lg">
                  <table className="w-full text-xs">
                    <thead className="bg-gray-50 sticky top-0">
                      <tr>{Object.keys(importPreview[0]).map(k => <th key={k} className="p-2 text-right">{k} → {columnMapping[k] || k}</th>)}</tr>
                    </thead>
                    <tbody>
                      {importPreview.slice(0, 5).map((row, i) => (
                        <tr key={i} className="border-t">{Object.values(row).map((v, j) => <td key={j} className="p-2">{String(v).slice(0, 15)}</td>)}</tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <button onClick={handleImport} className="w-full py-2 bg-emerald-600 text-white rounded-lg text-sm hover:bg-emerald-700">تأیید و ورود</button>
              </div>
            )}

            {importResult && (
              <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3"><CheckCircle className="w-5 h-5 text-emerald-600" /><span className="font-medium text-emerald-700">ورود اطلاعات انجام شد</span></div>
                <div className="grid grid-cols-3 gap-3 text-center text-sm">
                  <div><span className="font-bold text-emerald-600">{importResult.success}</span><br />موفق</div>
                  <div><span className="font-bold text-red-600">{importResult.failed}</span><br />ناموفق</div>
                  <div><span className="font-bold text-amber-600">{importResult.duplicate}</span><br />تکراری</div>
                </div>
              </div>
            )}
          </div>
        </SectionCard>

        {/* Export Section */}
        <SectionCard title="📤 خروجی Excel">
          <div className="space-y-4">
            <p className="text-sm text-gray-600">اطلاعات کارکنان را به فرمت Excel خروجی بگیرید.</p>
            
            <div className="space-y-3">
              <button onClick={handleExportAll} className="w-full flex items-center gap-3 p-4 border rounded-lg hover:bg-gray-50 text-right">
                <FileSpreadsheet className="w-8 h-8 text-emerald-600" />
                <div>
                  <div className="font-medium text-sm">خروجی کامل کارکنان</div>
                  <div className="text-xs text-gray-500">{filteredEmployees.length} رکورد • شامل تمام اطلاعات</div>
                </div>
              </button>

              <button onClick={() => {
                const data = filteredEmployees.filter(e => e.employmentStatus === 'active').map(e => ({
                  'نام': e.fullName, 'واحد': e.department, 'سمت': e.jobTitle,
                  'حضور': `${e.attendanceRate}%`, 'اضافه‌کاری': e.overtimeHours, 'عملکرد': e.performanceScore,
                }));
                const ws = XLSX.utils.json_to_sheet(data);
                const wb = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(wb, ws, 'حضور');
                XLSX.writeFile(wb, 'attendance-export.xlsx');
              }} className="w-full flex items-center gap-3 p-4 border rounded-lg hover:bg-gray-50 text-right">
                <FileSpreadsheet className="w-8 h-8 text-blue-600" />
                <div>
                  <div className="font-medium text-sm">خروجی حضور و غیاب</div>
                  <div className="text-xs text-gray-500">آمار حضور، غیبت و اضافه‌کاری</div>
                </div>
              </button>

              <button onClick={() => {
                const data = filteredEmployees.filter(e => e.employmentStatus === 'active').map(e => ({
                  'نام': e.fullName, 'واحد': e.department, 'حقوق پایه': e.baseSalary,
                  'مزایا': e.allowances, 'اضافه‌کاری': e.overtimePay, 'پاداش': e.bonus,
                  'کسورات': e.deductions, 'دریافتی': e.netSalary,
                }));
                const ws = XLSX.utils.json_to_sheet(data);
                const wb = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(wb, ws, 'حقوق');
                XLSX.writeFile(wb, 'payroll-export.xlsx');
              }} className="w-full flex items-center gap-3 p-4 border rounded-lg hover:bg-gray-50 text-right">
                <FileSpreadsheet className="w-8 h-8 text-purple-600" />
                <div>
                  <div className="font-medium text-sm">خروجی حقوق و مزایا</div>
                  <div className="text-xs text-gray-500">جزئیات حقوق و دریافتی</div>
                </div>
              </button>

              <button onClick={() => {
                const data = filteredEmployees.filter(e => e.employmentStatus === 'active').map(e => ({
                  'نام': e.fullName, 'واحد': e.department, 'امتیاز': e.performanceScore,
                  'وضعیت': e.performanceScore >= 4 ? 'عالی' : e.performanceScore >= 3 ? 'خوب' : 'نیازمند بهبود',
                }));
                const ws = XLSX.utils.json_to_sheet(data);
                const wb = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(wb, ws, 'عملکرد');
                XLSX.writeFile(wb, 'performance-export.xlsx');
              }} className="w-full flex items-center gap-3 p-4 border rounded-lg hover:bg-gray-50 text-right">
                <FileSpreadsheet className="w-8 h-8 text-amber-600" />
                <div>
                  <div className="font-medium text-sm">خروجی عملکرد</div>
                  <div className="text-xs text-gray-500">امتیاز و وضعیت عملکرد</div>
                </div>
              </button>
            </div>
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
