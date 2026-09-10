import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import { KPICard, SectionCard, Badge, Avatar } from '../components/UIComponents';
import { formatNumber, formatCurrency, getAgeGroup, getPerformanceColor, getLeaveTypeName } from '../utils/helpers';
import { Users, UserCheck, UserX, UserPlus, TrendingUp, TrendingDown, Clock, CalendarDays, Target, GraduationCap, DollarSign, Award, AlertTriangle, Cake, Briefcase } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, AreaChart, Area, Legend } from 'recharts';

const COLORS = ['#3B82F6','#10B981','#F59E0B','#EF4444','#8B5CF6','#EC4899','#06B6D4','#F97316'];

export default function Dashboard() {
  const { filteredEmployees, departments, leaveRecords, recruitmentPositions, trainingCourses, alerts, notifications } = useApp();
  const navigate = useNavigate();

  const stats = useMemo(() => {
    const active = filteredEmployees.filter(e => e.employmentStatus === 'active');
    const inactive = filteredEmployees.filter(e => e.employmentStatus === 'inactive');
    const terminated = filteredEmployees.filter(e => e.employmentStatus === 'terminated');
    const total = filteredEmployees.length;
    const males = active.filter(e => e.gender === 'male').length;
    const females = active.filter(e => e.gender === 'female').length;
    const avgAge = active.length ? Math.round(active.reduce((s, e) => s + e.age, 0) / active.length) : 0;
    const avgTenure = active.length ? Math.round(active.reduce((s, e) => s + e.tenure, 0) / active.length * 10) / 10 : 0;
    const avgPerformance = active.length ? Math.round(active.reduce((s, e) => s + e.performanceScore, 0) / active.length * 10) / 10 : 0;
    const avgSalary = active.length ? Math.round(active.reduce((s, e) => s + e.netSalary, 0) / active.length) : 0;
    const totalPayroll = active.reduce((s, e) => s + e.netSalary, 0);
    const totalTrainingHours = active.reduce((s, e) => s + e.trainingHours, 0);
    const totalTrainingCost = trainingCourses.reduce((s, c) => s + c.cost, 0);
    const totalLeaveUsed = active.reduce((s, e) => s + e.usedLeave, 0);
    const totalLeaveRemaining = active.reduce((s, e) => s + e.remainingLeave, 0);
    const highPerformers = active.filter(e => e.performanceScore >= 4.5).length;
    const lowPerformers = active.filter(e => e.performanceScore < 2.5).length;
    const permanent = active.filter(e => e.employmentType === 'permanent').length;
    const contract = active.filter(e => e.employmentType === 'contract').length;
    const partTime = active.filter(e => e.employmentType === 'partTime').length;
    const remote = active.filter(e => e.workMode === 'remote' || e.workMode === 'hybrid').length;
    const managers = active.filter(e => e.jobTitle.includes('مدیر')).length;
    const totalOvertimeHours = active.reduce((s, e) => s + e.overtimeHours, 0);
    const turnoverRate = total > 0 ? Math.round((terminated.length / total) * 1000) / 10 : 0;
    const retentionRate = total > 0 ? Math.round(((total - terminated.length) / total) * 1000) / 10 : 0;

    return {
      total, active: active.length, inactive: inactive.length, terminated: terminated.length,
      males, females, avgAge, avgTenure, avgPerformance, avgSalary, totalPayroll,
      totalTrainingHours, totalTrainingCost, totalLeaveUsed, totalLeaveRemaining,
      highPerformers, lowPerformers, permanent, contract, partTime, remote, managers,
      totalOvertimeHours, turnoverRate, retentionRate,
      departments: departments.length,
    };
  }, [filteredEmployees, departments, trainingCourses]);

  // Chart data
  const deptChartData = useMemo(() => {
    return departments.map(d => ({
      name: d.name,
      count: filteredEmployees.filter(e => e.department === d.name && e.employmentStatus === 'active').length,
    })).filter(d => d.count > 0);
  }, [filteredEmployees, departments]);

  const genderData = useMemo(() => [
    { name: 'مرد', value: stats.males },
    { name: 'زن', value: stats.females },
  ], [stats]);

  const ageData = useMemo(() => {
    const groups: Record<string, number> = {};
    filteredEmployees.filter(e => e.employmentStatus === 'active').forEach(e => {
      const g = getAgeGroup(e.age);
      groups[g] = (groups[g] || 0) + 1;
    });
    return Object.entries(groups).map(([name, value]) => ({ name, value }));
  }, [filteredEmployees]);

  const contractData = useMemo(() => {
    return [
      { name: 'رسمی', value: stats.permanent },
      { name: 'قراردادی', value: stats.contract },
      { name: 'پاره‌وقت', value: stats.partTime },
    ];
  }, [stats]);

  const performanceData = useMemo(() => {
    const active = filteredEmployees.filter(e => e.employmentStatus === 'active');
    return [
      { name: 'عالی', value: active.filter(e => e.performanceScore >= 4.5).length, color: '#10B981' },
      { name: 'خوب', value: active.filter(e => e.performanceScore >= 3.5 && e.performanceScore < 4.5).length, color: '#3B82F6' },
      { name: 'متوسط', value: active.filter(e => e.performanceScore >= 2.5 && e.performanceScore < 3.5).length, color: '#F59E0B' },
      { name: 'ضعیف', value: active.filter(e => e.performanceScore < 2.5).length, color: '#EF4444' },
    ];
  }, [filteredEmployees]);

  // Insights
  const insights = useMemo(() => {
    const items: string[] = [];
    items.push(`تعداد کل کارکنان فعال: ${formatNumber(stats.active)} نفر`);
    if (stats.turnoverRate > 5) items.push(`⚠️ نرخ ترک خدمت (${stats.turnoverRate}%) بالاتر از حد مطلوب است`);
    if (stats.avgPerformance >= 3.5) items.push(`✅ میانگین امتیاز عملکرد (${stats.avgPerformance}) در سطح مطلوب قرار دارد`);
    const topDept = deptChartData.sort((a, b) => b.count - a.count)[0];
    if (topDept) items.push(`بزرگ‌ترین واحد سازمانی: ${topDept.name} با ${formatNumber(topDept.count)} نفر`);
    if (stats.totalOvertimeHours > 500) items.push(`⚠️ مجموع ساعات اضافه‌کاری (${formatNumber(Math.round(stats.totalOvertimeHours))} ساعت) نیازمند بررسی است`);
    return items;
  }, [stats, deptChartData]);

  // Birthdays & Anniversaries
  const birthdays = useMemo(() => {
    return filteredEmployees.filter(e => e.employmentStatus === 'active').slice(0, 5);
  }, [filteredEmployees]);

  const topPerformers = useMemo(() => {
    return filteredEmployees.filter(e => e.employmentStatus === 'active').sort((a, b) => b.performanceScore - a.performanceScore).slice(0, 5);
  }, [filteredEmployees]);

  return (
    <div className="space-y-6">
      {/* Executive Summary */}
      <div className="bg-gradient-to-l from-blue-600 to-indigo-700 rounded-xl p-6 text-white">
        <h2 className="text-lg font-bold mb-3">خلاصه مدیریتی</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {insights.map((insight, i) => (
            <div key={i} className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-3 text-sm">{insight}</div>
          ))}
        </div>
      </div>

      {/* KPI Section 1: Workforce Overview */}
      <div>
        <h3 className="text-sm font-bold text-gray-700 mb-3">📊 نمای کلی نیروی انسانی</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
          <KPICard title="کل کارکنان" value={stats.total} icon={<Users className="w-5 h-5" />} color="blue" change={4.2} />
          <KPICard title="کارکنان فعال" value={stats.active} icon={<UserCheck className="w-5 h-5" />} color="green" change={3.1} />
          <KPICard title="کارکنان غیرفعال" value={stats.inactive} icon={<UserX className="w-5 h-5" />} color="orange" />
          <KPICard title="خروجی سال" value={stats.terminated} icon={<TrendingDown className="w-5 h-5" />} color="red" />
          <KPICard title="نرخ ترک خدمت" value={`${stats.turnoverRate}%`} icon={<TrendingDown className="w-5 h-5" />} color="red" change={-1.2} />
          <KPICard title="نرخ ماندگاری" value={`${stats.retentionRate}%`} icon={<TrendingUp className="w-5 h-5" />} color="green" change={1.2} />
        </div>
      </div>

      {/* KPI Section 2: Demographics */}
      <div>
        <h3 className="text-sm font-bold text-gray-700 mb-3">👥 ترکیب جمعیتی</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
          <KPICard title="میانگین سن" value={`${stats.avgAge} سال`} icon={<CalendarDays className="w-5 h-5" />} color="purple" />
          <KPICard title="میانگین سابقه" value={`${stats.avgTenure} سال`} icon={<Briefcase className="w-5 h-5" />} color="indigo" />
          <KPICard title="کارکنان مرد" value={stats.males} color="blue" />
          <KPICard title="کارکنان زن" value={stats.females} color="pink" />
          <KPICard title="تعداد مدیران" value={stats.managers} color="teal" />
          <KPICard title="واحدهای سازمانی" value={stats.departments} color="purple" />
        </div>
      </div>

      {/* KPI Section 3: Employment Types */}
      <div>
        <h3 className="text-sm font-bold text-gray-700 mb-3">📋 وضعیت اشتغال</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
          <KPICard title="رسمی" value={stats.permanent} color="green" />
          <KPICard title="قراردادی" value={stats.contract} color="orange" />
          <KPICard title="پاره‌وقت" value={stats.partTime} color="purple" />
          <KPICard title="دورکار/ترکیبی" value={stats.remote} color="teal" />
          <KPICard title="اضافه‌کاری (ساعت)" value={formatNumber(Math.round(stats.totalOvertimeHours))} icon={<Clock className="w-5 h-5" />} color="orange" />
          <KPICard title="متوسط حقوق" value={formatCurrency(stats.avgSalary)} icon={<DollarSign className="w-5 h-5" />} color="green" change={5.3} />
        </div>
      </div>

      {/* KPI Section 4: Performance & Training */}
      <div>
        <h3 className="text-sm font-bold text-gray-700 mb-3">🎯 عملکرد و آموزش</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
          <KPICard title="میانگین عملکرد" value={stats.avgPerformance} icon={<Target className="w-5 h-5" />} color="blue" change={2.1} />
          <KPICard title="عملکرد عالی" value={stats.highPerformers} icon={<Award className="w-5 h-5" />} color="green" />
          <KPICard title="نیازمند بهبود" value={stats.lowPerformers} icon={<AlertTriangle className="w-5 h-5" />} color="red" />
          <KPICard title="ساعات آموزش" value={formatNumber(Math.round(stats.totalTrainingHours))} icon={<GraduationCap className="w-5 h-5" />} color="purple" />
          <KPICard title="هزینه آموزش" value={formatCurrency(stats.totalTrainingCost)} icon={<GraduationCap className="w-5 h-5" />} color="indigo" />
          <KPICard title="مانده مرخصی کل" value={formatNumber(stats.totalLeaveRemaining)} icon={<CalendarDays className="w-5 h-5" />} color="orange" />
        </div>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SectionCard title="توزیع کارکنان بر اساس واحد سازمانی">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={deptChartData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis type="number" tick={{ fontSize: 12 }} />
              <YAxis dataKey="name" type="category" tick={{ fontSize: 11 }} width={80} />
              <Tooltip formatter={(v: number) => [formatNumber(v), 'تعداد']} />
              <Bar dataKey="count" fill="#3B82F6" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </SectionCard>

        <SectionCard title="نسبت جنسیتی">
          <div className="flex items-center justify-center">
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={genderData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                  {genderData.map((_, i) => <Cell key={i} fill={i === 0 ? '#3B82F6' : '#EC4899'} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </SectionCard>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <SectionCard title="توزیع سنی">
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={ageData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="value" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </SectionCard>

        <SectionCard title="نوع قرارداد">
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={contractData} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                {contractData.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </SectionCard>

        <SectionCard title="توزیع عملکرد">
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={performanceData} cx="50%" cy="50%" innerRadius={40} outerRadius={80} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                {performanceData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </SectionCard>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top Performers */}
        <SectionCard title="🏆 برترین عملکرد‌ها">
          <div className="space-y-3">
            {topPerformers.map((emp, i) => (
              <button key={emp.id} onClick={() => navigate(`/employees/${emp.id}`)} className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors text-right">
                <span className="text-sm font-bold text-gray-400 w-5">{i + 1}</span>
                <Avatar name={emp.fullName} size="sm" />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">{emp.fullName}</div>
                  <div className="text-xs text-gray-500">{emp.department}</div>
                </div>
                <span className={`text-sm font-bold ${getPerformanceColor(emp.performanceScore)}`}>{emp.performanceScore}</span>
              </button>
            ))}
          </div>
        </SectionCard>

        {/* Alerts */}
        <SectionCard title="🔔 هشدارهای مدیریتی">
          <div className="space-y-3">
            {alerts.filter(a => !a.read).slice(0, 5).map(alert => (
              <div key={alert.id} className={`p-3 rounded-lg border text-sm ${alert.type === 'danger' ? 'bg-red-50 border-red-100' : alert.type === 'warning' ? 'bg-amber-50 border-amber-100' : 'bg-blue-50 border-blue-100'}`}>
                <div className="font-medium">{alert.title}</div>
                <div className="text-xs text-gray-600 mt-1">{alert.message}</div>
              </div>
            ))}
          </div>
        </SectionCard>

        {/* Recent Employees */}
        <SectionCard title="🎂 تولدها و سالگردها">
          <div className="space-y-3">
            {birthdays.map(emp => (
              <div key={emp.id} className="flex items-center gap-3 p-2">
                <Avatar name={emp.fullName} size="sm" />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">{emp.fullName}</div>
                  <div className="text-xs text-gray-500">استخدام: {emp.hireDate}</div>
                </div>
                <Badge variant="info">{emp.department}</Badge>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>

      {/* Recruitment Funnel */}
      <SectionCard title="📈 قیف استخدام">
        <div className="flex flex-col items-center gap-2">
          {[
            { label: 'درخواست نیرو', value: 12, width: '100%' },
            { label: 'رزومه دریافت‌شده', value: 245, width: '85%' },
            { label: 'غربال‌شده', value: 98, width: '65%' },
            { label: 'مصاحبه‌شده', value: 42, width: '45%' },
            { label: 'پیشنهاد همکاری', value: 15, width: '30%' },
            { label: 'استخدام‌شده', value: 8, width: '18%' },
          ].map((step, i) => (
            <div key={i} className="relative w-full flex items-center justify-center" style={{ maxWidth: step.width }}>
              <div className="bg-gradient-to-l from-blue-500 to-indigo-600 text-white rounded-lg px-6 py-3 text-center w-full">
                <span className="text-sm font-medium">{step.label}</span>
                <span className="block text-lg font-bold">{formatNumber(step.value)}</span>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}
