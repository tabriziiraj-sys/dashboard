import React, { useMemo } from 'react';
import { useApp } from '../contexts/AppContext';
import { KPICard, SectionCard } from '../components/UIComponents';
import { formatNumber, formatCurrency } from '../utils/helpers';
import { DollarSign, TrendingUp, Users } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend, AreaChart, Area } from 'recharts';
import { payrollTrendData } from '../data/seedData';

export default function Payroll() {
  const { filteredEmployees } = useApp();
  const active = filteredEmployees.filter(e => e.employmentStatus === 'active');

  const stats = useMemo(() => {
    const totalPayroll = active.reduce((s, e) => s + e.netSalary, 0);
    const avgSalary = active.length ? Math.round(active.reduce((s, e) => s + e.netSalary, 0) / active.length) : 0;
    const salaries = active.map(e => e.netSalary).sort((a, b) => a - b);
    const median = salaries.length ? salaries[Math.floor(salaries.length / 2)] : 0;
    const totalBonus = active.reduce((s, e) => s + e.bonus, 0);
    const totalBenefits = active.reduce((s, e) => s + e.allowances, 0);
    const totalOvertime = active.reduce((s, e) => s + e.overtimePay, 0);
    const totalDeductions = active.reduce((s, e) => s + e.deductions, 0);
    const payrollGrowth = 5.8;
    return { totalPayroll, avgSalary, median, totalBonus, totalBenefits, totalOvertime, totalDeductions, payrollGrowth };
  }, [active]);

  const deptSalary = useMemo(() => {
    const depts: Record<string, { total: number; count: number }> = {};
    active.forEach(e => {
      if (!depts[e.department]) depts[e.department] = { total: 0, count: 0 };
      depts[e.department].total += e.netSalary;
      depts[e.department].count++;
    });
    return Object.entries(depts).map(([name, d]) => ({ name, average: Math.round(d.total / d.count / 1000000), total: Math.round(d.total / 10000000) }));
  }, [active]);

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold">تحلیل حقوق و مزایا</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
        <KPICard title="مجموع Payroll" value={formatCurrency(stats.totalPayroll)} icon={<DollarSign className="w-5 h-5" />} color="blue" change={5.8} />
        <KPICard title="میانگین حقوق" value={formatCurrency(stats.avgSalary)} icon={<DollarSign className="w-5 h-5" />} color="green" change={3.2} />
        <KPICard title="میانه حقوق" value={formatCurrency(stats.median)} icon={<DollarSign className="w-5 h-5" />} color="purple" />
        <KPICard title="مجموع پاداش" value={formatCurrency(stats.totalBonus)} icon={<TrendingUp className="w-5 h-5" />} color="teal" />
        <KPICard title="مجموع مزایا" value={formatCurrency(stats.totalBenefits)} icon={<DollarSign className="w-5 h-5" />} color="indigo" />
        <KPICard title="مجموع اضافه‌کاری" value={formatCurrency(stats.totalOvertime)} icon={<DollarSign className="w-5 h-5" />} color="orange" />
        <KPICard title="مجموع کسورات" value={formatCurrency(stats.totalDeductions)} icon={<DollarSign className="w-5 h-5" />} color="red" />
        <KPICard title="رشد Payroll" value={`${stats.payrollGrowth}%`} icon={<TrendingUp className="w-5 h-5" />} color="green" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SectionCard title="روند هزینه حقوق (میلیون تومان)">
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={payrollTrendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Area type="monotone" dataKey="total" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.1} name="مجموع (میلیون)" />
            </AreaChart>
          </ResponsiveContainer>
        </SectionCard>

        <SectionCard title="مقایسه میانگین حقوق واحدها (میلیون تومان)">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={deptSalary}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Legend />
              <Bar dataKey="average" fill="#10B981" radius={[4, 4, 0, 0]} name="میانگین" />
              <Bar dataKey="total" fill="#3B82F6" radius={[4, 4, 0, 0]} name="مجموع (×۱۰M)" />
            </BarChart>
          </ResponsiveContainer>
        </SectionCard>
      </div>

      <SectionCard title="توزیع حقوق کارکنان">
        <div className="grid grid-cols-5 gap-4 mt-4">
          {[
            { range: 'زیر ۲۰M', count: active.filter(e => e.netSalary < 20000000).length },
            { range: '۲۰-۳۰M', count: active.filter(e => e.netSalary >= 20000000 && e.netSalary < 30000000).length },
            { range: '۳۰-۵۰M', count: active.filter(e => e.netSalary >= 30000000 && e.netSalary < 50000000).length },
            { range: '۵۰-۸۰M', count: active.filter(e => e.netSalary >= 50000000 && e.netSalary < 80000000).length },
            { range: 'بالای ۸۰M', count: active.filter(e => e.netSalary >= 80000000).length },
          ].map((item, i) => (
            <div key={i} className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{item.count}</div>
              <div className="text-xs text-gray-600 mt-1">{item.range}</div>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}
