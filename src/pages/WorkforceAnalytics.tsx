import React, { useMemo } from 'react';
import { useApp } from '../contexts/AppContext';
import { KPICard, SectionCard } from '../components/UIComponents';
import { formatNumber, formatCurrency } from '../utils/helpers';
import { BarChart3, Users, DollarSign, TrendingUp, Target, Award } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend } from 'recharts';

export default function WorkforceAnalytics() {
  const { filteredEmployees } = useApp();
  const active = filteredEmployees.filter(e => e.employmentStatus === 'active');
  const total = filteredEmployees.length;
  const terminated = filteredEmployees.filter(e => e.employmentStatus === 'terminated');

  const stats = useMemo(() => {
    const headcountGrowth = 4.2;
    const totalWorkforceCost = active.reduce((s, e) => s + e.netSalary, 0);
    const revenuePerEmployee = 850000000; // Mock
    const costPerEmployee = active.length ? Math.round(totalWorkforceCost / active.length) : 0;
    const absenteeismRate = Math.round(active.reduce((s, e) => s + e.absenceDays, 0) / (active.length * 22) * 1000) / 10;
    const avgProductivity = 78;
    const engagementScore = 4.1;
    const internalMobilityRate = 12;
    const promotionRate = 8.5;
    const diversityRatio = active.length ? Math.round(active.filter(e => e.gender === 'female').length / active.length * 100) : 0;
    const managers = active.filter(e => e.jobTitle.includes('مدیر')).length;
    const spanOfControl = managers > 0 ? Math.round((active.length - managers) / managers * 10) / 10 : 0;
    const managerToEmployee = managers > 0 ? Math.round(managers / active.length * 100) : 0;
    const hrToEmployee = 2;
    return {
      headcountGrowth, totalWorkforceCost, revenuePerEmployee, costPerEmployee,
      absenteeismRate, avgProductivity, engagementScore, internalMobilityRate,
      promotionRate, diversityRatio, spanOfControl, managerToEmployee, hrToEmployee,
    };
  }, [active]);

  const deptMetrics = useMemo(() => {
    const depts: Record<string, { headcount: number; avgSalary: number; avgPerformance: number; avgTenure: number }> = {};
    active.forEach(e => {
      if (!depts[e.department]) depts[e.department] = { headcount: 0, avgSalary: 0, avgPerformance: 0, avgTenure: 0 };
      depts[e.department].headcount++;
      depts[e.department].avgSalary += e.netSalary;
      depts[e.department].avgPerformance += e.performanceScore;
      depts[e.department].avgTenure += e.tenure;
    });
    return Object.entries(depts).map(([name, d]) => ({
      name,
      headcount: d.headcount,
      avgSalary: Math.round(d.avgSalary / d.headcount / 1000000),
      avgPerformance: Math.round(d.avgPerformance / d.headcount * 10) / 10,
      avgTenure: Math.round(d.avgTenure / d.headcount * 10) / 10,
    }));
  }, [active]);

  const radarData = [
    { metric: 'بهره‌وری', value: stats.avgProductivity },
    { metric: 'مشارکت', value: stats.engagementScore * 20 },
    { metric: 'ماندگاری', value: 100 - (terminated.length / total * 100) },
    { metric: 'تنوع', value: stats.diversityRatio * 2 },
    { metric: 'رشد', value: stats.headcountGrowth * 10 },
    { metric: 'آموزش', value: 72 },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold">تحلیل سرمایه انسانی</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
        <KPICard title="رشد نیروی انسانی" value={`${stats.headcountGrowth}%`} icon={<TrendingUp className="w-5 h-5" />} color="green" />
        <KPICard title="هزینه نیروی انسانی" value={formatCurrency(stats.totalWorkforceCost)} icon={<DollarSign className="w-5 h-5" />} color="blue" />
        <KPICard title="درآمد به ازای هر نفر" value={formatCurrency(stats.revenuePerEmployee)} icon={<DollarSign className="w-5 h-5" />} color="teal" />
        <KPICard title="هزینه به ازای هر نفر" value={formatCurrency(stats.costPerEmployee)} icon={<DollarSign className="w-5 h-5" />} color="orange" />
        <KPICard title="نرخ غیبت" value={`${stats.absenteeismRate}%`} icon={<BarChart3 className="w-5 h-5" />} color="red" />
        <KPICard title="بهره‌وری" value={`${stats.avgProductivity}%`} icon={<Target className="w-5 h-5" />} color="purple" />
        <KPICard title="مشارکت کارکنان" value={stats.engagementScore} icon={<Award className="w-5 h-5" />} color="indigo" />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <KPICard title="نرخ تحرک داخلی" value={`${stats.internalMobilityRate}%`} color="blue" />
        <KPICard title="نرخ ترفیع" value={`${stats.promotionRate}%`} color="green" />
        <KPICard title="نسبت تنوع (زن)" value={`${stats.diversityRatio}%`} color="pink" />
        <KPICard title="Span of Control" value={stats.spanOfControl} color="purple" />
        <KPICard title="نسبت مدیر/کارمند" value={`${stats.managerToEmployee}%`} color="teal" />
        <KPICard title="نسبت HR/کارمند" value={`1:${stats.hrToEmployee * 50}`} color="orange" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SectionCard title="شاخص‌های کلیدی سازمان">
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={radarData}>
              <PolarGrid />
              <PolarAngleAxis dataKey="metric" tick={{ fontSize: 11 }} />
              <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 10 }} />
              <Radar name="امتیاز" dataKey="value" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.3} />
              <Legend />
            </RadarChart>
          </ResponsiveContainer>
        </SectionCard>

        <SectionCard title="مقایسه واحدها">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={deptMetrics}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Legend />
              <Bar dataKey="headcount" fill="#3B82F6" name="تعداد" radius={[2, 2, 0, 0]} />
              <Bar dataKey="avgPerformance" fill="#10B981" name="عملکرد" radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </SectionCard>
      </div>

      <SectionCard title="Top / Bottom Analysis">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'بهترین واحد عملکرد', value: deptMetrics.sort((a, b) => b.avgPerformance - a.avgPerformance)[0]?.name || '-', icon: '🏆' },
            { label: 'بیشترین رشد نیرو', value: 'فروش (+۱۲)', icon: '📈' },
            { label: 'بیشترین Turnover', value: 'فروش (۸٪)', icon: '⚠️' },
            { label: 'بیشترین اضافه‌کاری', value: 'پشتیبانی', icon: '⏰' },
            { label: 'بیشترین غیبت', value: 'عملیات', icon: '📋' },
            { label: 'بیشترین هزینه حقوق', value: 'فناوری اطلاعات', icon: '💰' },
            { label: 'بیشترین آموزش', value: 'فناوری اطلاعات', icon: '📚' },
            { label: 'بالاترین میانگین سن', value: 'مالی', icon: '👤' },
          ].map((item, i) => (
            <div key={i} className="bg-gray-50 rounded-lg p-4 text-center">
              <div className="text-2xl mb-2">{item.icon}</div>
              <div className="text-xs text-gray-500 mb-1">{item.label}</div>
              <div className="text-sm font-bold">{item.value}</div>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}
