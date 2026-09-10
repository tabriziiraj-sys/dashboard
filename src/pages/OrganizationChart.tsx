import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import { KPICard, SectionCard, Avatar, Badge } from '../components/UIComponents';
import { formatNumber, formatCurrency } from '../utils/helpers';
import { Users, Building2, ChevronDown, ChevronUp } from 'lucide-react';

export default function OrganizationChart() {
  const { departments, filteredEmployees } = useApp();
  const [expandedDepts, setExpandedDepts] = useState<Set<string>>(new Set(['all']));
  const navigate = useNavigate();

  const deptData = useMemo(() => {
    return departments.map(d => {
      const emps = filteredEmployees.filter(e => e.department === d.name && e.employmentStatus === 'active');
      return { ...d, employees: emps, headcount: emps.length };
    });
  }, [departments, filteredEmployees]);

  const toggleDept = (id: string) => {
    setExpandedDepts(prev => {
      const n = new Set(prev);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });
  };

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold">ساختار سازمانی</h1>

      {/* CEO Node */}
      <div className="flex justify-center mb-8">
        <div className="bg-gradient-to-l from-blue-600 to-indigo-700 text-white rounded-xl px-8 py-4 text-center shadow-lg">
          <div className="text-lg font-bold">مدیرعامل</div>
          <div className="text-sm opacity-80 mt-1">{formatNumber(filteredEmployees.filter(e => e.employmentStatus === 'active').length)} نفر زیرمجموعه</div>
        </div>
      </div>

      {/* Connection Line */}
      <div className="flex justify-center mb-4">
        <div className="w-0.5 h-8 bg-gray-300" />
      </div>
      <div className="w-full h-0.5 bg-gray-300 mx-8" />

      {/* Departments Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
        {deptData.map(dept => (
          <div key={dept.id} className="bg-white border rounded-xl overflow-hidden hover:shadow-md transition-shadow">
            <div className="bg-gradient-to-l from-gray-50 to-white p-4 border-b cursor-pointer" onClick={() => toggleDept(dept.id)}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Building2 className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-bold text-sm">{dept.name}</div>
                    <div className="text-xs text-gray-500">مدیر: {dept.managerName}</div>
                  </div>
                </div>
                <div className="text-left">
                  <div className="text-lg font-bold text-blue-600">{dept.headcount}</div>
                  <div className="text-xs text-gray-500">نفر</div>
                </div>
              </div>
            </div>
            {expandedDepts.has(dept.id) && (
              <div className="p-3 max-h-48 overflow-y-auto space-y-2">
                {dept.employees.slice(0, 10).map(emp => (
                  <button key={emp.id} onClick={() => navigate(`/employees/${emp.id}`)} className="w-full flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50 text-right text-sm">
                    <Avatar name={emp.fullName} size="sm" />
                    <div className="flex-1 min-w-0">
                      <div className="truncate font-medium">{emp.fullName}</div>
                      <div className="text-xs text-gray-500 truncate">{emp.jobTitle}</div>
                    </div>
                  </button>
                ))}
                {dept.employees.length > 10 && <p className="text-xs text-center text-gray-400">و {dept.employees.length - 10} نفر دیگر...</p>}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
