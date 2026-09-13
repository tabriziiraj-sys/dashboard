import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import { KPICard, SectionCard, Avatar, Badge } from '../components/UIComponents';
import { formatNumber, getPerformanceColor } from '../utils/helpers';
import { Target, Award, TrendingUp, AlertTriangle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend } from 'recharts';

const COLORS = ['#10B981','#3B82F6','#F59E0B','#EF4444'];

export default function Performance() {
  const { filteredEmployees, performanceReviews } = useApp();
  const navigate = useNavigate();
  const active = filteredEmployees.filter(e => e.employmentStatus === 'active');

  const stats = useMemo(() => {
    const avg = active.length ? Math.round(active.reduce((s, e) => s + e.performanceScore, 0) / active.length * 10) / 10 : 0;
    const excellent = active.filter(e => e.performanceScore >= 4.5).length;
    const good = active.filter(e => e.performanceScore >= 3.5 && e.performanceScore < 4.5).length;
    const average = active.filter(e => e.performanceScore >= 2.5 && e.performanceScore < 3.5).length;
    const needsImprovement = active.filter(e => e.performanceScore < 2.5).length;
    return { avg, excellent, good, average, needsImprovement };
  }, [active]);

  const distribution = [
    { name: 'عالی', value: stats.excellent, color: COLORS[0] },
    { name: 'خوب', value: stats.good, color: COLORS[1] },
    { name: 'متوسط', value: stats.average, color: COLORS[2] },
    { name: 'نیازمند بهبود', value: stats.needsImprovement, color: COLORS[3] },
  ];

  const deptPerformance = useMemo(() => {
    const depts: Record<string, { total: number; count: number }> = {};
    active.forEach(e => {
      if (!depts[e.department]) depts[e.department] = { total: 0, count: 0 };
      depts[e.department].total += e.performanceScore;
      depts[e.department].count++;
    });
    return Object.entries(depts).map(([name, d]) => ({ name, score: Math.round(d.total / d.count * 10) / 10 }));
  }, [active]);

  const topPerformers = [...active].sort((a, b) => b.performanceScore - a.performanceScore).slice(0, 10);
  const bottomPerformers = [...active].sort((a, b) => a.performanceScore - b.performanceScore).slice(0, 10);

  const radarData = deptPerformance.map(d => ({ subject: d.name, score: d.score, fullMark: 5 }));

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold">مدیریت عملکرد</h1>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <KPICard title="میانگین امتیاز" value={stats.avg} icon={<Target className="w-5 h-5" />} color="blue" change={2.1} />
        <KPICard title="عملکرد عالی" value={stats.excellent} icon={<Award className="w-5 h-5" />} color="green" />
        <KPICard title="خوب" value={stats.good} icon={<TrendingUp className="w-5 h-5" />} color="blue" />
        <KPICard title="متوسط" value={stats.average} icon={<Target className="w-5 h-5" />} color="orange" />
        <KPICard title="نیازمند بهبود" value={stats.needsImprovement} icon={<AlertTriangle className="w-5 h-5" />} color="red" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SectionCard title="توزیع عملکرد">
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={distribution} cx="50%" cy="50%" innerRadius={60} outerRadius={100} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                {distribution.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </SectionCard>

        <SectionCard title="مقایسه عملکرد واحدها">
          <ResponsiveContainer width="100%" height={280}>
            <RadarChart data={radarData}>
              <PolarGrid />
              <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10 }} />
              <PolarRadiusAxis angle={30} domain={[0, 5]} tick={{ fontSize: 10 }} />
              <Radar name="امتیاز" dataKey="score" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.3} />
            </RadarChart>
          </ResponsiveContainer>
        </SectionCard>
      </div>

      <SectionCard title="عملکرد بر اساس واحد">
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={deptPerformance}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="name" tick={{ fontSize: 10 }} />
            <YAxis domain={[0, 5]} tick={{ fontSize: 11 }} />
            <Tooltip />
            <Bar dataKey="score" fill="#3B82F6" radius={[4, 4, 0, 0]} name="امتیاز" />
          </BarChart>
        </ResponsiveContainer>
      </SectionCard>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SectionCard title="🏆 برترین‌ها">
          <div className="space-y-2">
            {topPerformers.map((emp, i) => (
              <button key={emp.id} onClick={() => navigate(`/employees/${emp.id}`)} className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 text-right">
                <span className="text-sm font-bold text-gray-400 w-5">{i + 1}</span>
                <Avatar name={emp.fullName} size="sm" />
                <div className="flex-1"><div className="text-sm font-medium">{emp.fullName}</div><div className="text-xs text-gray-500">{emp.department}</div></div>
                <span className={`font-bold ${getPerformanceColor(emp.performanceScore)}`}>{emp.performanceScore}</span>
              </button>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="⚠️ نیازمند بهبود">
          <div className="space-y-2">
            {bottomPerformers.map((emp, i) => (
              <button key={emp.id} onClick={() => navigate(`/employees/${emp.id}`)} className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 text-right">
                <span className="text-sm font-bold text-gray-400 w-5">{i + 1}</span>
                <Avatar name={emp.fullName} size="sm" />
                <div className="flex-1"><div className="text-sm font-medium">{emp.fullName}</div><div className="text-xs text-gray-500">{emp.department}</div></div>
                <span className={`font-bold ${getPerformanceColor(emp.performanceScore)}`}>{emp.performanceScore}</span>
              </button>
            ))}
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
