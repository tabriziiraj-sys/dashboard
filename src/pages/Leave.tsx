import React, { useMemo } from 'react';
import { useApp } from '../contexts/AppContext';
import { KPICard, SectionCard, Badge } from '../components/UIComponents';
import { formatNumber } from '../utils/helpers';
import { CalendarDays, Clock, AlertCircle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

const COLORS = ['#3B82F6','#10B981','#F59E0B','#EF4444','#8B5CF6','#EC4899'];

export default function Leave() {
  const { filteredEmployees, leaveRecords } = useApp();
  const active = filteredEmployees.filter(e => e.employmentStatus === 'active');

  const stats = useMemo(() => {
    const totalUsed = active.reduce((s, e) => s + e.usedLeave, 0);
    const totalRemaining = active.reduce((s, e) => s + e.remainingLeave, 0);
    const pending = leaveRecords.filter(r => r.status === 'pending').length;
    const approved = leaveRecords.filter(r => r.status === 'approved').length;
    return { totalUsed, totalRemaining, pending, approved, total: leaveRecords.length };
  }, [active, leaveRecords]);

  const leaveByType = useMemo(() => {
    const types: Record<string, number> = {};
    leaveRecords.forEach(r => { types[r.type] = (types[r.type] || 0) + r.days; });
    const names: Record<string, string> = { annual: 'استحقاقی', sick: 'استعلاجی', unpaid: 'بدون حقوق', hourly: 'ساعتی', mission: 'مأموریت', other: 'سایر' };
    return Object.entries(types).map(([type, days]) => ({ name: names[type] || type, value: Math.round(days) }));
  }, [leaveRecords]);

  const leaveByDept = useMemo(() => {
    const depts: Record<string, number> = {};
    active.forEach(e => { depts[e.department] = (depts[e.department] || 0) + e.usedLeave; });
    return Object.entries(depts).map(([name, days]) => ({ name, days }));
  }, [active]);

  const monthlyLeave = useMemo(() => {
    return ['فروردین','اردیبهشت','خرداد','تیر','مرداد','شهریور','مهر','آبان'].map((m, i) => ({
      month: m, days: Math.round(20 + Math.random() * 40),
    }));
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold">مدیریت مرخصی</h1>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <KPICard title="کل مرخصی استفاده‌شده" value={stats.totalUsed} icon={<CalendarDays className="w-5 h-5" />} color="blue" />
        <KPICard title="مانده مرخصی کل" value={stats.totalRemaining} icon={<Clock className="w-5 h-5" />} color="green" />
        <KPICard title="درخواست‌های در انتظار" value={stats.pending} icon={<AlertCircle className="w-5 h-5" />} color="orange" />
        <KPICard title="تأیید شده" value={stats.approved} icon={<CalendarDays className="w-5 h-5" />} color="teal" />
        <KPICard title="کل درخواست‌ها" value={stats.total} icon={<CalendarDays className="w-5 h-5" />} color="purple" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SectionCard title="مرخصی بر اساس نوع">
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={leaveByType} cx="50%" cy="50%" outerRadius={100} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                {leaveByType.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </SectionCard>

        <SectionCard title="مرخصی بر اساس واحد">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={leaveByDept}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="days" fill="#8B5CF6" radius={[4, 4, 0, 0]} name="روز" />
            </BarChart>
          </ResponsiveContainer>
        </SectionCard>
      </div>

      <SectionCard title="روند مرخصی ماهانه">
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={monthlyLeave}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="month" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip />
            <Bar dataKey="days" fill="#3B82F6" radius={[4, 4, 0, 0]} name="روز مرخصی" />
          </BarChart>
        </ResponsiveContainer>
      </SectionCard>

      <SectionCard title="درخواست‌های اخیر">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50"><tr><th className="p-3 text-right">کارمند</th><th className="p-3 text-right">نوع</th><th className="p-3 text-right">از</th><th className="p-3 text-right">تا</th><th className="p-3 text-right">روز</th><th className="p-3 text-right">وضعیت</th></tr></thead>
            <tbody>
              {leaveRecords.slice(0, 10).map(r => (
                <tr key={r.id} className="border-t hover:bg-gray-50">
                  <td className="p-3">{r.employeeName}</td>
                  <td className="p-3">{r.type === 'annual' ? 'استحقاقی' : r.type === 'sick' ? 'استعلاجی' : r.type}</td>
                  <td className="p-3">{r.startDate}</td>
                  <td className="p-3">{r.endDate}</td>
                  <td className="p-3">{r.days}</td>
                  <td className="p-3"><Badge variant={r.status === 'approved' ? 'success' : r.status === 'pending' ? 'warning' : 'danger'}>{r.status === 'approved' ? 'تأیید' : r.status === 'pending' ? 'در انتظار' : 'رد'}</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>
    </div>
  );
}
