import React, { useMemo } from 'react';
import { useApp } from '../contexts/AppContext';
import { KPICard, SectionCard, Badge } from '../components/UIComponents';
import { formatNumber } from '../utils/helpers';
import { UserPlus, Clock, DollarSign, CheckCircle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, FunnelChart, Funnel, Cell, Legend, LineChart, Line } from 'recharts';

const COLORS = ['#3B82F6','#6366F1','#8B5CF6','#A855F7','#D946EF','#EC4899'];

export default function Recruitment() {
  const { recruitmentPositions } = useApp();

  const stats = useMemo(() => {
    const open = recruitmentPositions.filter(p => p.status === 'open').length;
    const totalApplicants = recruitmentPositions.reduce((s, p) => s + p.applicants, 0);
    const totalHired = recruitmentPositions.reduce((s, p) => s + p.hired, 0);
    const totalInterviewed = recruitmentPositions.reduce((s, p) => s + p.interviewed, 0);
    const avgTimeToHire = 28;
    const costPerHire = 15000000;
    const offerAcceptanceRate = 85;
    return { open, totalApplicants, totalHired, totalInterviewed, avgTimeToHire, costPerHire, offerAcceptanceRate };
  }, [recruitmentPositions]);

  const funnelData = [
    { name: 'درخواست نیرو', value: recruitmentPositions.length * 2 },
    { name: 'رزومه دریافتی', value: stats.totalApplicants },
    { name: 'غربال‌شده', value: Math.round(stats.totalApplicants * 0.4) },
    { name: 'مصاحبه', value: stats.totalInterviewed },
    { name: 'پیشنهاد', value: Math.round(stats.totalInterviewed * 0.4) },
    { name: 'استخدام', value: stats.totalHired },
  ];

  const sourceData = useMemo(() => {
    const sources: Record<string, number> = {};
    recruitmentPositions.forEach(p => { sources[p.source] = (sources[p.source] || 0) + p.applicants; });
    return Object.entries(sources).map(([name, value]) => ({ name, value }));
  }, [recruitmentPositions]);

  const monthlyHires = [
    { month: 'فروردین', count: 3 }, { month: 'اردیبهشت', count: 5 },
    { month: 'خرداد', count: 4 }, { month: 'تیر', count: 7 },
    { month: 'مرداد', count: 6 }, { month: 'شهریور', count: 8 },
    { month: 'مهر', count: 5 }, { month: 'آبان', count: 4 },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold">داشبورد استخدام</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
        <KPICard title="موقعیت‌های باز" value={stats.open} icon={<UserPlus className="w-5 h-5" />} color="blue" />
        <KPICard title="کل متقاضیان" value={stats.totalApplicants} icon={<UserPlus className="w-5 h-5" />} color="purple" />
        <KPICard title="مصاحبه‌شده" value={stats.totalInterviewed} icon={<UserPlus className="w-5 h-5" />} color="indigo" />
        <KPICard title="استخدام‌شده" value={stats.totalHired} icon={<CheckCircle className="w-5 h-5" />} color="green" />
        <KPICard title="میانگین زمان جذب" value={`${stats.avgTimeToHire} روز`} icon={<Clock className="w-5 h-5" />} color="orange" />
        <KPICard title="هزینه هر جذب" value="۱۵ میلیون" icon={<DollarSign className="w-5 h-5" />} color="red" />
        <KPICard title="نرخ پذیرش پیشنهاد" value={`${stats.offerAcceptanceRate}%`} icon={<CheckCircle className="w-5 h-5" />} color="teal" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SectionCard title="قیف استخدام (Recruitment Funnel)">
          <div className="space-y-2 py-4">
            {funnelData.map((step, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="w-24 text-sm text-gray-600 text-left">{step.name}</div>
                <div className="flex-1 relative">
                  <div className="h-8 rounded-lg bg-gradient-to-l from-blue-500 to-indigo-600 flex items-center justify-center text-white text-sm font-bold"
                    style={{ width: `${(step.value / funnelData[0].value) * 100}%`, minWidth: '60px' }}>
                    {formatNumber(step.value)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="منبع جذب">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={sourceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="value" fill="#6366F1" radius={[4, 4, 0, 0]} name="متقاضی" />
            </BarChart>
          </ResponsiveContainer>
        </SectionCard>
      </div>

      <SectionCard title="روند استخدام ماهانه">
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={monthlyHires}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="month" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip />
            <Line type="monotone" dataKey="count" stroke="#3B82F6" strokeWidth={2} dot={{ fill: '#3B82F6' }} name="استخدام" />
          </LineChart>
        </ResponsiveContainer>
      </SectionCard>

      <SectionCard title="موقعیت‌های شغلی">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50"><tr><th className="p-3 text-right">عنوان</th><th className="p-3 text-right">واحد</th><th className="p-3 text-right">وضعیت</th><th className="p-3 text-right">متقاضی</th><th className="p-3 text-right">مصاحبه</th><th className="p-3 text-right">استخدام</th><th className="p-3 text-right">منبع</th></tr></thead>
            <tbody>
              {recruitmentPositions.map(p => (
                <tr key={p.id} className="border-t hover:bg-gray-50">
                  <td className="p-3 font-medium">{p.title}</td>
                  <td className="p-3">{p.department}</td>
                  <td className="p-3"><Badge variant={p.status === 'open' ? 'success' : p.status === 'closed' ? 'default' : 'warning'}>{p.status === 'open' ? 'باز' : p.status === 'closed' ? 'بسته' : 'متوقف'}</Badge></td>
                  <td className="p-3">{formatNumber(p.applicants)}</td>
                  <td className="p-3">{p.interviewed}</td>
                  <td className="p-3">{p.hired}</td>
                  <td className="p-3">{p.source}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>
    </div>
  );
}
