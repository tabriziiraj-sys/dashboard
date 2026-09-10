import React, { useMemo } from 'react';
import { useApp } from '../contexts/AppContext';
import { KPICard, SectionCard, Badge, Avatar } from '../components/UIComponents';
import { formatNumber } from '../utils/helpers';
import { Clock, UserCheck, UserX, CalendarDays, AlertTriangle, TrendingUp } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend, AreaChart, Area } from 'recharts';
import { attendanceTrendData } from '../data/seedData';

export default function Attendance() {
  const { filteredEmployees } = useApp();
  const active = filteredEmployees.filter(e => e.employmentStatus === 'active');

  const stats = useMemo(() => {
    const present = Math.round(active.length * 0.88);
    const absent = Math.round(active.length * 0.04);
    const onLeave = Math.round(active.length * 0.06);
    const onMission = Math.round(active.length * 0.02);
    const late = Math.round(active.length * 0.08);
    const avgOvertime = active.reduce((s, e) => s + e.overtimeHours, 0) / (active.length || 1);
    const avgClockIn = '08:05';
    const avgClockOut = '16:45';
    return { present, absent, onLeave, onMission, late, avgOvertime: Math.round(avgOvertime * 10) / 10, avgClockIn, avgClockOut };
  }, [active]);

  const deptAttendance = useMemo(() => {
    const depts: Record<string, { present: number; late: number; absent: number }> = {};
    active.forEach(e => {
      if (!depts[e.department]) depts[e.department] = { present: 0, late: 0, absent: 0 };
      depts[e.department].present++;
      if (e.lateMinutes > 30) depts[e.department].late++;
      if (e.absenceDays > 3) depts[e.department].absent++;
    });
    return Object.entries(depts).map(([name, data]) => ({ name, ...data }));
  }, [active]);

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold">حضور و غیاب</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
        <KPICard title="حاضر امروز" value={stats.present} icon={<UserCheck className="w-5 h-5" />} color="green" />
        <KPICard title="غایب" value={stats.absent} icon={<UserX className="w-5 h-5" />} color="red" />
        <KPICard title="مرخصی" value={stats.onLeave} icon={<CalendarDays className="w-5 h-5" />} color="orange" />
        <KPICard title="مأموریت" value={stats.onMission} icon={<Clock className="w-5 h-5" />} color="blue" />
        <KPICard title="تأخیر" value={stats.late} icon={<AlertTriangle className="w-5 h-5" />} color="orange" />
        <KPICard title="میانگین اضافه‌کاری" value={`${stats.avgOvertime} ساعت`} icon={<TrendingUp className="w-5 h-5" />} color="purple" />
        <KPICard title="میانگین ورود" value={stats.avgClockIn} icon={<Clock className="w-5 h-5" />} color="teal" />
        <KPICard title="میانگین خروج" value={stats.avgClockOut} icon={<Clock className="w-5 h-5" />} color="indigo" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SectionCard title="روند حضور ماهانه">
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={attendanceTrendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Legend />
              <Area type="monotone" dataKey="present" stackId="1" fill="#10B981" stroke="#10B981" name="حاضر" />
              <Area type="monotone" dataKey="leave" stackId="1" fill="#F59E0B" stroke="#F59E0B" name="مرخصی" />
              <Area type="monotone" dataKey="absent" stackId="1" fill="#EF4444" stroke="#EF4444" name="غایب" />
            </AreaChart>
          </ResponsiveContainer>
        </SectionCard>

        <SectionCard title="وضعیت حضور واحدها">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={deptAttendance}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Legend />
              <Bar dataKey="present" fill="#10B981" name="حاضر" radius={[2, 2, 0, 0]} />
              <Bar dataKey="late" fill="#F59E0B" name="تأخیر" radius={[2, 2, 0, 0]} />
              <Bar dataKey="absent" fill="#EF4444" name="غیبت زیاد" radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </SectionCard>
      </div>

      <SectionCard title="جزئیات حضور کارکنان">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50"><tr><th className="p-3 text-right">کارمند</th><th className="p-3 text-right">واحد</th><th className="p-3 text-right">نرخ حضور</th><th className="p-3 text-right">غیبت</th><th className="p-3 text-right">تأخیر (دقیقه)</th><th className="p-3 text-right">اضافه‌کاری</th></tr></thead>
            <tbody>
              {active.slice(0, 15).map(emp => (
                <tr key={emp.id} className="border-t hover:bg-gray-50">
                  <td className="p-3"><div className="flex items-center gap-2"><Avatar name={emp.fullName} size="sm" /><span>{emp.fullName}</span></div></td>
                  <td className="p-3">{emp.department}</td>
                  <td className="p-3"><Badge variant={emp.attendanceRate >= 95 ? 'success' : emp.attendanceRate >= 85 ? 'warning' : 'danger'}>{emp.attendanceRate}%</Badge></td>
                  <td className="p-3">{emp.absenceDays}</td>
                  <td className="p-3">{emp.lateMinutes}</td>
                  <td className="p-3">{Math.round(emp.overtimeHours)} ساعت</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>
    </div>
  );
}
