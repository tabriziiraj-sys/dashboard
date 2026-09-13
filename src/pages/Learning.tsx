import React, { useMemo } from 'react';
import { useApp } from '../contexts/AppContext';
import { KPICard, SectionCard, Badge, ProgressBar } from '../components/UIComponents';
import { formatNumber, formatCurrency } from '../utils/helpers';
import { GraduationCap, Clock, DollarSign, Users, CheckCircle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

const COLORS = ['#3B82F6','#10B981','#F59E0B','#EF4444','#8B5CF6','#EC4899'];

export default function Learning() {
  const { trainingCourses, filteredEmployees } = useApp();
  const active = filteredEmployees.filter(e => e.employmentStatus === 'active');

  const stats = useMemo(() => {
    const totalCourses = trainingCourses.length;
    const totalParticipants = trainingCourses.reduce((s, c) => s + c.participants, 0);
    const totalHours = trainingCourses.reduce((s, c) => s + c.hours, 0);
    const totalCost = trainingCourses.reduce((s, c) => s + c.cost, 0);
    const avgCompletion = trainingCourses.length ? Math.round(trainingCourses.reduce((s, c) => s + c.completionRate, 0) / trainingCourses.length) : 0;
    const avgScore = trainingCourses.filter(c => c.averageScore > 0).length ? Math.round(trainingCourses.filter(c => c.averageScore > 0).reduce((s, c) => s + c.averageScore, 0) / trainingCourses.filter(c => c.averageScore > 0).length * 10) / 10 : 0;
    const trainedEmployees = active.reduce((s, e) => s + (e.trainingHours > 0 ? 1 : 0), 0);
    const trainingROI = 145;
    return { totalCourses, totalParticipants, totalHours, totalCost, avgCompletion, avgScore, trainedEmployees, trainingROI };
  }, [trainingCourses, active]);

  const courseByDept = useMemo(() => {
    const depts: Record<string, number> = {};
    trainingCourses.forEach(c => { depts[c.department] = (depts[c.department] || 0) + 1; });
    return Object.entries(depts).map(([name, value]) => ({ name, value }));
  }, [trainingCourses]);

  const statusData = [
    { name: 'تکمیل‌شده', value: trainingCourses.filter(c => c.status === 'completed').length },
    { name: 'در حال برگزاری', value: trainingCourses.filter(c => c.status === 'active').length },
    { name: 'برنامه‌ریزی‌شده', value: trainingCourses.filter(c => c.status === 'upcoming').length },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold">آموزش و توسعه</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
        <KPICard title="تعداد دوره‌ها" value={stats.totalCourses} icon={<GraduationCap className="w-5 h-5" />} color="blue" />
        <KPICard title="کل شرکت‌کنندگان" value={stats.totalParticipants} icon={<Users className="w-5 h-5" />} color="purple" />
        <KPICard title="ساعات آموزش" value={stats.totalHours} icon={<Clock className="w-5 h-5" />} color="teal" />
        <KPICard title="هزینه آموزش" value={formatCurrency(stats.totalCost)} icon={<DollarSign className="w-5 h-5" />} color="orange" />
        <KPICard title="نرخ تکمیل" value={`${stats.avgCompletion}%`} icon={<CheckCircle className="w-5 h-5" />} color="green" />
        <KPICard title="میانگین نمره" value={stats.avgScore} icon={<GraduationCap className="w-5 h-5" />} color="indigo" />
        <KPICard title="کارکنان آموزش‌دیده" value={stats.trainedEmployees} icon={<Users className="w-5 h-5" />} color="blue" />
        <KPICard title="ROI آموزش" value={`${stats.trainingROI}%`} icon={<DollarSign className="w-5 h-5" />} color="green" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SectionCard title="دوره‌ها بر اساس واحد">
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={courseByDept} cx="50%" cy="50%" outerRadius={100} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                {courseByDept.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </SectionCard>

        <SectionCard title="وضعیت دوره‌ها">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={statusData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                {statusData.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </SectionCard>
      </div>

      <SectionCard title="لیست دوره‌ها">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50"><tr><th className="p-3 text-right">عنوان</th><th className="p-3 text-right">واحد</th><th className="p-3 text-right">ساعات</th><th className="p-3 text-right">هزینه</th><th className="p-3 text-right">شرکت‌کننده</th><th className="p-3 text-right">نرخ تکمیل</th><th className="p-3 text-right">نمره</th><th className="p-3 text-right">وضعیت</th></tr></thead>
            <tbody>
              {trainingCourses.map(c => (
                <tr key={c.id} className="border-t hover:bg-gray-50">
                  <td className="p-3 font-medium">{c.title}</td>
                  <td className="p-3">{c.department}</td>
                  <td className="p-3">{c.hours}</td>
                  <td className="p-3">{formatCurrency(c.cost)}</td>
                  <td className="p-3">{c.participants}</td>
                  <td className="p-3"><ProgressBar value={c.completionRate} max={100} color={c.completionRate >= 80 ? 'green' : c.completionRate >= 50 ? 'blue' : 'orange'} /></td>
                  <td className="p-3">{c.averageScore > 0 ? c.averageScore : '—'}</td>
                  <td className="p-3"><Badge variant={c.status === 'completed' ? 'success' : c.status === 'active' ? 'info' : 'warning'}>{c.status === 'completed' ? 'تکمیل' : c.status === 'active' ? 'فعال' : 'آینده'}</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>
    </div>
  );
}
