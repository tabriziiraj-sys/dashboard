import React, { useMemo } from 'react';
import { useApp } from '../contexts/AppContext';
import { KPICard, SectionCard } from '../components/UIComponents';
import { formatNumber } from '../utils/helpers';
import { TrendingDown, Users, Clock, AlertTriangle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend, LineChart, Line } from 'recharts';

const COLORS = ['#3B82F6','#10B981','#F59E0B','#EF4444','#8B5CF6','#EC4899','#06B6D4','#F97316'];

export default function Turnover() {
  const { filteredEmployees } = useApp();
  const total = filteredEmployees.length;
  const terminated = filteredEmployees.filter(e => e.employmentStatus === 'terminated');
  const active = filteredEmployees.filter(e => e.employmentStatus === 'active');

  const stats = useMemo(() => {
    const turnoverRate = total > 0 ? Math.round((terminated.length / total) * 1000) / 10 : 0;
    const retentionRate = total > 0 ? Math.round(((total - terminated.length) / total) * 1000) / 10 : 0;
    const voluntary = Math.round(terminated.length * 0.65);
    const involuntary = terminated.length - voluntary;
    const avgTenureBeforeExit = terminated.length ? Math.round(terminated.reduce((s, e) => s + e.tenure, 0) / terminated.length * 10) / 10 : 0;
    return { turnoverRate, retentionRate, voluntary, involuntary, avgTenureBeforeExit, total: terminated.length };
  }, [total, terminated]);

  const reasons = useMemo(() => {
    const r: Record<string, number> = {};
    terminated.forEach(e => { if (e.exitReason) r[e.exitReason] = (r[e.exitReason] || 0) + 1; });
    return Object.entries(r).map(([name, value]) => ({ name, value }));
  }, [terminated]);

  const deptTurnover = useMemo(() => {
    const depts: Record<string, { total: number; exited: number }> = {};
    filteredEmployees.forEach(e => {
      if (!depts[e.department]) depts[e.department] = { total: 0, exited: 0 };
      depts[e.department].total++;
      if (e.employmentStatus === 'terminated') depts[e.department].exited++;
    });
    return Object.entries(depts).map(([name, d]) => ({ name, rate: d.total > 0 ? Math.round((d.exited / d.total) * 100) : 0, exited: d.exited }));
  }, [filteredEmployees]);

  const monthlyTurnover = [
    { month: 'فروردین', exits: 2 }, { month: 'اردیبهشت', exits: 3 },
    { month: 'خرداد', exits: 4 }, { month: 'تیر', exits: 2 },
    { month: 'مرداد', exits: 5 }, { month: 'شهریور', exits: 3 },
    { month: 'مهر', exits: 4 }, { month: 'آبان', exits: 6 },
  ];

  const tenureAtExit = [
    { range: 'کمتر از ۱ سال', count: terminated.filter(e => e.tenure < 1).length },
    { range: '۱-۳ سال', count: terminated.filter(e => e.tenure >= 1 && e.tenure < 3).length },
    { range: '۳-۵ سال', count: terminated.filter(e => e.tenure >= 3 && e.tenure < 5).length },
    { range: '۵-۱۰ سال', count: terminated.filter(e => e.tenure >= 5 && e.tenure < 10).length },
    { range: 'بیش از ۱۰ سال', count: terminated.filter(e => e.tenure >= 10).length },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold">تحلیل ترک خدمت</h1>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <KPICard title="نرخ ترک خدمت" value={`${stats.turnoverRate}%`} icon={<TrendingDown className="w-5 h-5" />} color="red" change={-1.5} />
        <KPICard title="نرخ ماندگاری" value={`${stats.retentionRate}%`} icon={<Users className="w-5 h-5" />} color="green" change={1.5} />
        <KPICard title="خروج داوطلبانه" value={stats.voluntary} icon={<TrendingDown className="w-5 h-5" />} color="orange" />
        <KPICard title="خروج غیرداوطلبانه" value={stats.involuntary} icon={<AlertTriangle className="w-5 h-5" />} color="red" />
        <KPICard title="کل خروجی" value={stats.total} icon={<TrendingDown className="w-5 h-5" />} color="purple" />
        <KPICard title="میانگین سابقه قبل از خروج" value={`${stats.avgTenureBeforeExit} سال`} icon={<Clock className="w-5 h-5" />} color="blue" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SectionCard title="دلایل ترک همکاری">
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={reasons} cx="50%" cy="50%" outerRadius={100} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                {reasons.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </SectionCard>

        <SectionCard title="نرخ ترک خدمت بر اساس واحد (%)">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={deptTurnover}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="rate" fill="#EF4444" radius={[4, 4, 0, 0]} name="نرخ %" />
            </BarChart>
          </ResponsiveContainer>
        </SectionCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SectionCard title="روند خروج ماهانه">
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={monthlyTurnover}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Line type="monotone" dataKey="exits" stroke="#EF4444" strokeWidth={2} dot={{ fill: '#EF4444' }} name="خروج" />
            </LineChart>
          </ResponsiveContainer>
        </SectionCard>

        <SectionCard title="خروج بر اساس سابقه">
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={tenureAtExit}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="range" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="count" fill="#8B5CF6" radius={[4, 4, 0, 0]} name="تعداد" />
            </BarChart>
          </ResponsiveContainer>
        </SectionCard>
      </div>
    </div>
  );
}
