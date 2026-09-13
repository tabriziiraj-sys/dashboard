import React, { useState, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import { Avatar, Modal, Badge, FilterChip } from '../components/UIComponents';
import { formatNumber, formatCurrency, getEmploymentTypeName, getStatusName, getGenderName, getWorkModeName, getPerformanceColor } from '../utils/helpers';
import { Search, Plus, Download, Upload, Filter, Edit2, Trash2, Eye, X, ChevronLeft, ChevronRight } from 'lucide-react';
import * as XLSX from 'xlsx';

export default function Employees() {
  const { filteredEmployees, addEmployee, updateEmployee, deleteEmployee, importEmployees, filters, setFilters, clearFilters, departments } = useApp();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState<string>('fullName');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState<string | null>(null);
  const [showImportModal, setShowImportModal] = useState(false);
  const [importData, setImportData] = useState<Record<string, string>[]>([]);
  const [importResult, setImportResult] = useState<{ success: number; failed: number; duplicate: number } | null>(null);
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Filter & Search
  const data = useMemo(() => {
    let result = [...filteredEmployees];
    if (searchQuery) {
      result = result.filter(e =>
        e.fullName.includes(searchQuery) || e.employeeCode.includes(searchQuery) ||
        e.department.includes(searchQuery) || e.jobTitle.includes(searchQuery) || e.nationalId.includes(searchQuery)
      );
    }
    result.sort((a, b) => {
      const aVal = (a as any)[sortField];
      const bVal = (b as any)[sortField];
      if (typeof aVal === 'number') return sortDir === 'asc' ? aVal - bVal : bVal - aVal;
      return sortDir === 'asc' ? String(aVal).localeCompare(String(bVal)) : String(bVal).localeCompare(String(aVal));
    });
    return result;
  }, [filteredEmployees, searchQuery, sortField, sortDir]);

  const totalPages = Math.ceil(data.length / pageSize);
  const pagedData = data.slice((page - 1) * pageSize, page * pageSize);

  const handleSort = (field: string) => {
    if (sortField === field) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortField(field); setSortDir('asc'); }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
  };

  const toggleAll = () => {
    if (selectedIds.size === pagedData.length) setSelectedIds(new Set());
    else setSelectedIds(new Set(pagedData.map(e => e.id)));
  };

  const handleExport = (scope: 'all' | 'filtered' | 'selected') => {
    let exportData = scope === 'selected' ? data.filter(e => selectedIds.has(e.id)) :
                     scope === 'filtered' ? data : filteredEmployees;
    const wsData = exportData.map(e => ({
      'کد پرسنلی': e.employeeCode, 'نام': e.firstName, 'نام خانوادگی': e.lastName,
      'کد ملی': e.nationalId, 'جنسیت': getGenderName(e.gender), 'تاریخ تولد': e.birthDate,
      'موبایل': e.mobile, 'ایمیل': e.email, 'واحد': e.department, 'سمت': e.jobTitle,
      'مدیر': e.managerName, 'تاریخ استخدام': e.hireDate, 'نوع قرارداد': getEmploymentTypeName(e.employmentType),
      'وضعیت': getStatusName(e.employmentStatus), 'شعبه': e.branch, 'حقوق پایه': e.baseSalary,
      'دریافتی': e.netSalary, 'امتیاز عملکرد': e.performanceScore,
    }));
    const ws = XLSX.utils.json_to_sheet(wsData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'کارکنان');
    XLSX.writeFile(wb, 'employees-export.xlsx');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      const wb = XLSX.read(evt.target?.result, { type: 'binary' });
      const ws = wb.Sheets[wb.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json<Record<string, string>>(ws);
      setImportData(jsonData);
      setShowImportModal(true);
    };
    reader.readAsBinaryString(file);
  };

  const handleImport = () => {
    const newEmps: any[] = importData.map((row, i) => ({
      id: `imp-${Date.now()}-${i}`,
      employeeCode: row['کد پرسنلی'] || row['employeeCode'] || `IMP${1000 + i}`,
      firstName: row['نام'] || row['firstName'] || '',
      lastName: row['نام خانوادگی'] || row['lastName'] || '',
      fullName: `${row['نام'] || ''} ${row['نام خانوادگی'] || ''}`.trim(),
      nationalId: row['کد ملی'] || row['nationalId'] || '',
      gender: (row['جنسیت'] === 'زن' ? 'female' : 'male') as 'male' | 'female',
      birthDate: row['تاریخ تولد'] || '1370/01/01',
      age: 30, mobile: row['موبایل'] || '', email: row['ایمیل'] || '',
      province: 'تهران', city: 'تهران', address: '',
      avatar: '', departmentId: 'd1', department: row['واحد'] || 'فناوری اطلاعات',
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
    const result = importEmployees(newEmps as any);
    setImportResult(result);
  };

  const activeFilters = Object.entries(filters).filter(([, v]) => v).length;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-xl font-bold">مدیریت کارکنان</h1>
        <div className="flex items-center gap-2">
          <button onClick={() => setShowAddModal(true)} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">
            <Plus className="w-4 h-4" /> افزودن کارمند
          </button>
          <button onClick={() => fileInputRef.current?.click()} className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm hover:bg-emerald-700">
            <Upload className="w-4 h-4" /> ورود از Excel
          </button>
          <div className="relative group">
            <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200">
              <Download className="w-4 h-4" /> خروجی Excel
            </button>
            <div className="absolute top-full mt-1 left-0 bg-white border rounded-lg shadow-lg hidden group-hover:block z-10 w-40">
              <button onClick={() => handleExport('all')} className="w-full text-right px-4 py-2 text-sm hover:bg-gray-50">همه داده‌ها</button>
              <button onClick={() => handleExport('filtered')} className="w-full text-right px-4 py-2 text-sm hover:bg-gray-50">داده‌های فیلترشده</button>
              <button onClick={() => handleExport('selected')} className="w-full text-right px-4 py-2 text-sm hover:bg-gray-50">سطرهای انتخاب‌شده</button>
            </div>
          </div>
          <input ref={fileInputRef} type="file" accept=".xlsx,.xls" onChange={handleFileUpload} className="hidden" />
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 bg-white border rounded-lg px-3 py-2 flex-1 min-w-[200px] max-w-md">
          <Search className="w-4 h-4 text-gray-400" />
          <input type="text" value={searchQuery} onChange={e => { setSearchQuery(e.target.value); setPage(1); }} placeholder="جستجو..." className="outline-none text-sm w-full" />
        </div>
        <button onClick={() => setShowFilterPanel(!showFilterPanel)} className={`flex items-center gap-2 px-3 py-2 border rounded-lg text-sm ${showFilterPanel ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-white'}`}>
          <Filter className="w-4 h-4" /> فیلتر {activeFilters > 0 && `(${activeFilters})`}
        </button>
        {activeFilters > 0 && <button onClick={clearFilters} className="text-sm text-red-600 hover:underline">حذف همه فیلترها</button>}
      </div>

      {/* Active Filter Chips */}
      {activeFilters > 0 && (
        <div className="flex flex-wrap gap-2">
          {filters.department && <FilterChip label={`واحد: ${filters.department}`} onRemove={() => setFilters({ department: '' })} />}
          {filters.branch && <FilterChip label={`شعبه: ${filters.branch}`} onRemove={() => setFilters({ branch: '' })} />}
          {filters.gender && <FilterChip label={`جنسیت: ${getGenderName(filters.gender)}`} onRemove={() => setFilters({ gender: '' })} />}
          {filters.employmentType && <FilterChip label={`نوع: ${getEmploymentTypeName(filters.employmentType)}`} onRemove={() => setFilters({ employmentType: '' })} />}
          {filters.employmentStatus && <FilterChip label={`وضعیت: ${getStatusName(filters.employmentStatus)}`} onRemove={() => setFilters({ employmentStatus: '' })} />}
        </div>
      )}

      {/* Filter Panel */}
      {showFilterPanel && (
        <div className="bg-white border rounded-xl p-4 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
          <select value={filters.department} onChange={e => setFilters({ department: e.target.value })} className="border rounded-lg px-3 py-2 text-sm">
            <option value="">همه واحدها</option>
            {departments.map(d => <option key={d.id} value={d.name}>{d.name}</option>)}
          </select>
          <select value={filters.gender} onChange={e => setFilters({ gender: e.target.value })} className="border rounded-lg px-3 py-2 text-sm">
            <option value="">همه جنسیت‌ها</option>
            <option value="male">مرد</option>
            <option value="female">زن</option>
          </select>
          <select value={filters.employmentType} onChange={e => setFilters({ employmentType: e.target.value })} className="border rounded-lg px-3 py-2 text-sm">
            <option value="">همه قراردادها</option>
            <option value="permanent">رسمی</option>
            <option value="contract">قراردادی</option>
            <option value="partTime">پاره‌وقت</option>
          </select>
          <select value={filters.employmentStatus} onChange={e => setFilters({ employmentStatus: e.target.value })} className="border rounded-lg px-3 py-2 text-sm">
            <option value="">همه وضعیت‌ها</option>
            <option value="active">فعال</option>
            <option value="inactive">غیرفعال</option>
            <option value="terminated">خارج شده</option>
          </select>
          <select value={filters.workMode} onChange={e => setFilters({ workMode: e.target.value })} className="border rounded-lg px-3 py-2 text-sm">
            <option value="">همه modes</option>
            <option value="onsite">حضوری</option>
            <option value="remote">دورکار</option>
            <option value="hybrid">ترکیبی</option>
          </select>
          <select value={filters.branch} onChange={e => setFilters({ branch: e.target.value })} className="border rounded-lg px-3 py-2 text-sm">
            <option value="">همه شعب</option>
            <option value="تهران - مرکزی">تهران - مرکزی</option>
            <option value="تهران - شمال">تهران - شمال</option>
            <option value="اصفهان">اصفهان</option>
            <option value="شیراز">شیراز</option>
            <option value="مشهد">مشهد</option>
          </select>
        </div>
      )}

      {/* Table */}
      <div className="bg-white border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="p-3 w-10"><input type="checkbox" checked={selectedIds.size === pagedData.length && pagedData.length > 0} onChange={toggleAll} /></th>
                <th className="p-3 text-right cursor-pointer hover:text-blue-600" onClick={() => handleSort('employeeCode')}>کد پرسنلی</th>
                <th className="p-3 text-right cursor-pointer hover:text-blue-600" onClick={() => handleSort('fullName')}>نام</th>
                <th className="p-3 text-right">واحد</th>
                <th className="p-3 text-right cursor-pointer hover:text-blue-600" onClick={() => handleSort('jobTitle')}>سمت</th>
                <th className="p-3 text-right">نوع قرارداد</th>
                <th className="p-3 text-right">وضعیت</th>
                <th className="p-3 text-right cursor-pointer hover:text-blue-600" onClick={() => handleSort('performanceScore')}>عملکرد</th>
                <th className="p-3 text-right cursor-pointer hover:text-blue-600" onClick={() => handleSort('netSalary')}>حقوق</th>
                <th className="p-3 text-center">عملیات</th>
              </tr>
            </thead>
            <tbody>
              {pagedData.map(emp => (
                <tr key={emp.id} className="border-b hover:bg-gray-50 transition-colors">
                  <td className="p-3"><input type="checkbox" checked={selectedIds.has(emp.id)} onChange={() => toggleSelect(emp.id)} /></td>
                  <td className="p-3 font-mono text-xs">{emp.employeeCode}</td>
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <Avatar name={emp.fullName} size="sm" />
                      <div>
                        <div className="font-medium">{emp.fullName}</div>
                        <div className="text-xs text-gray-500">{emp.gender === 'male' ? 'مرد' : 'زن'} • {emp.age} سال</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-3">{emp.department}</td>
                  <td className="p-3">{emp.jobTitle}</td>
                  <td className="p-3"><Badge variant={emp.employmentType === 'permanent' ? 'success' : emp.employmentType === 'contract' ? 'warning' : 'info'}>{getEmploymentTypeName(emp.employmentType)}</Badge></td>
                  <td className="p-3"><Badge variant={emp.employmentStatus === 'active' ? 'success' : emp.employmentStatus === 'inactive' ? 'warning' : 'danger'}>{getStatusName(emp.employmentStatus)}</Badge></td>
                  <td className="p-3"><span className={`font-bold ${getPerformanceColor(emp.performanceScore)}`}>{emp.performanceScore}</span></td>
                  <td className="p-3">{formatCurrency(emp.netSalary)}</td>
                  <td className="p-3">
                    <div className="flex items-center justify-center gap-1">
                      <button onClick={() => navigate(`/employees/${emp.id}`)} className="p-1.5 rounded hover:bg-blue-50 text-blue-600"><Eye className="w-4 h-4" /></button>
                      <button onClick={() => setShowAddModal(true)} className="p-1.5 rounded hover:bg-amber-50 text-amber-600"><Edit2 className="w-4 h-4" /></button>
                      <button onClick={() => setShowDeleteModal(emp.id)} className="p-1.5 rounded hover:bg-red-50 text-red-600"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between p-4 border-t">
          <div className="flex items-center gap-3 text-sm text-gray-500">
            <span>نمایش {(page - 1) * pageSize + 1} تا {Math.min(page * pageSize, data.length)} از {formatNumber(data.length)}</span>
            <select value={pageSize} onChange={e => { setPageSize(Number(e.target.value)); setPage(1); }} className="border rounded px-2 py-1 text-sm">
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </div>
          <div className="flex items-center gap-1">
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="p-2 rounded hover:bg-gray-100 disabled:opacity-50"><ChevronRight className="w-4 h-4" /></button>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const p = page <= 3 ? i + 1 : page + i - 2;
              if (p > totalPages || p < 1) return null;
              return <button key={p} onClick={() => setPage(p)} className={`w-8 h-8 rounded text-sm ${p === page ? 'bg-blue-600 text-white' : 'hover:bg-gray-100'}`}>{p}</button>;
            })}
            <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="p-2 rounded hover:bg-gray-100 disabled:opacity-50"><ChevronLeft className="w-4 h-4" /></button>
          </div>
        </div>
      </div>

      {/* Import Modal */}
      <Modal isOpen={showImportModal} onClose={() => { setShowImportModal(false); setImportData([]); setImportResult(null); }} title="ورود اطلاعات از Excel" size="xl">
        {importResult ? (
          <div className="text-center py-8">
            <div className="text-4xl mb-4">✅</div>
            <h3 className="text-lg font-bold mb-4">نتیجه ورود اطلاعات</h3>
            <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
              <div className="bg-emerald-50 rounded-lg p-4"><div className="text-2xl font-bold text-emerald-600">{importResult.success}</div><div className="text-sm text-gray-600">موفق</div></div>
              <div className="bg-red-50 rounded-lg p-4"><div className="text-2xl font-bold text-red-600">{importResult.failed}</div><div className="text-sm text-gray-600">ناموفق</div></div>
              <div className="bg-amber-50 rounded-lg p-4"><div className="text-2xl font-bold text-amber-600">{importResult.duplicate}</div><div className="text-sm text-gray-600">تکراری</div></div>
            </div>
            <button onClick={() => { setShowImportModal(false); setImportData([]); setImportResult(null); }} className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-lg">بستن</button>
          </div>
        ) : (
          <div>
            <p className="text-sm text-gray-600 mb-4">{importData.length} رکورد شناسایی شد. ستون‌ها: {importData.length > 0 ? Object.keys(importData[0]).join('، ') : '-'}</p>
            <div className="max-h-64 overflow-y-auto border rounded-lg mb-4">
              <table className="w-full text-xs">
                <thead className="bg-gray-50 sticky top-0">
                  <tr>{importData.length > 0 && Object.keys(importData[0]).map(k => <th key={k} className="p-2 text-right">{k}</th>)}</tr>
                </thead>
                <tbody>
                  {importData.slice(0, 10).map((row, i) => (
                    <tr key={i} className="border-t">{Object.values(row).map((v, j) => <td key={j} className="p-2">{String(v).slice(0, 20)}</td>)}</tr>
                  ))}
                </tbody>
              </table>
              {importData.length > 10 && <p className="text-center text-xs text-gray-500 py-2">و {importData.length - 10} رکورد دیگر...</p>}
            </div>
            <button onClick={handleImport} className="w-full py-3 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700">تأیید و ورود اطلاعات</button>
          </div>
        )}
      </Modal>

      {/* Delete Confirmation */}
      <Modal isOpen={!!showDeleteModal} onClose={() => setShowDeleteModal(null)} title="تأیید حذف" size="sm">
        <p className="text-sm text-gray-600 mb-6">آیا از حذف این کارمند اطمینان دارید؟ این عمل قابل بازگشت نیست.</p>
        <div className="flex gap-3">
          <button onClick={() => { if (showDeleteModal) { deleteEmployee(showDeleteModal); setShowDeleteModal(null); } }} className="flex-1 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700">حذف</button>
          <button onClick={() => setShowDeleteModal(null)} className="flex-1 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200">انصراف</button>
        </div>
      </Modal>

      {/* Add Employee Modal */}
      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="افزودن کارمند جدید" size="lg">
        <AddEmployeeForm onAdd={(emp) => { addEmployee(emp); setShowAddModal(false); }} onCancel={() => setShowAddModal(false)} />
      </Modal>
    </div>
  );
}

function AddEmployeeForm({ onAdd, onCancel }: { onAdd: (emp: any) => void; onCancel: () => void }) {
  const [form, setForm] = useState({
    firstName: '', lastName: '', nationalId: '', gender: 'male' as const,
    mobile: '', email: '', department: 'فناوری اطلاعات', jobTitle: '',
    employmentType: 'contract' as const, branch: 'تهران - مرکزی',
    baseSalary: 20000000, city: 'تهران',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const id = `emp-${Date.now()}`;
    onAdd({
      id, employeeCode: `EMP${Date.now().toString().slice(-5)}`,
      ...form, fullName: `${form.firstName} ${form.lastName}`,
      birthDate: '1370/01/01', age: 30, maritalStatus: 'single',
      province: 'تهران', address: '', avatar: '',
      departmentId: 'd1', managerId: null, managerName: '',
      location: form.branch, hireDate: '1403/01/01', tenure: 0,
      employmentStatus: 'active', workMode: 'onsite',
      allowances: 5000000, bonus: 0, overtimePay: 0, deductions: 1500000,
      netSalary: form.baseSalary + 3500000,
      remainingLeave: 26, usedLeave: 0, totalLeaveEntitlement: 26,
      attendanceRate: 100, absenceDays: 0, lateMinutes: 0, earlyLeaves: 0,
      overtimeHours: 0, performanceScore: 3.0, trainingHours: 0,
      education: '', degree: '', exitDate: null, exitReason: null,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div><label className="block text-sm mb-1">نام *</label><input required value={form.firstName} onChange={e => setForm({ ...form, firstName: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-sm" /></div>
        <div><label className="block text-sm mb-1">نام خانوادگی *</label><input required value={form.lastName} onChange={e => setForm({ ...form, lastName: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-sm" /></div>
        <div><label className="block text-sm mb-1">کد ملی</label><input value={form.nationalId} onChange={e => setForm({ ...form, nationalId: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-sm" /></div>
        <div><label className="block text-sm mb-1">موبایل</label><input value={form.mobile} onChange={e => setForm({ ...form, mobile: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-sm" /></div>
        <div><label className="block text-sm mb-1">واحد</label><select value={form.department} onChange={e => setForm({ ...form, department: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-sm"><option>فناوری اطلاعات</option><option>منابع انسانی</option><option>مالی</option><option>فروش</option><option>بازاریابی</option><option>عملیات</option><option>پشتیبانی</option><option>محصول</option></select></div>
        <div><label className="block text-sm mb-1">سمت</label><input value={form.jobTitle} onChange={e => setForm({ ...form, jobTitle: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-sm" /></div>
        <div><label className="block text-sm mb-1">جنسیت</label><select value={form.gender} onChange={e => setForm({ ...form, gender: e.target.value as any })} className="w-full border rounded-lg px-3 py-2 text-sm"><option value="male">مرد</option><option value="female">زن</option></select></div>
        <div><label className="block text-sm mb-1">نوع قرارداد</label><select value={form.employmentType} onChange={e => setForm({ ...form, employmentType: e.target.value as any })} className="w-full border rounded-lg px-3 py-2 text-sm"><option value="permanent">رسمی</option><option value="contract">قراردادی</option><option value="partTime">پاره‌وقت</option></select></div>
      </div>
      <div className="flex gap-3 pt-4">
        <button type="submit" className="flex-1 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">ذخیره</button>
        <button type="button" onClick={onCancel} className="flex-1 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200">انصراف</button>
      </div>
    </form>
  );
}
