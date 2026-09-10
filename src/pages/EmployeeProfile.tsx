import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import { Avatar, Badge, Tabs, SectionCard, ProgressBar } from '../components/UIComponents';
import { formatNumber, formatCurrency, getEmploymentTypeName, getStatusName, getGenderName, getMaritalName, getWorkModeName, getPerformanceColor } from '../utils/helpers';
import { ArrowRight, Phone, Mail, MapPin, Calendar, Briefcase, Award, BookOpen, DollarSign, Clock } from 'lucide-react';

export default function EmployeeProfile() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { employees } = useApp();
  const [activeTab, setActiveTab] = useState('personal');

  const employee = useMemo(() => employees.find(e => e.id === id), [employees, id]);

  if (!employee) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500">کارمند مورد نظر یافت نشد</p>
        <button onClick={() => navigate('/employees')} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm">بازگشت به لیست</button>
      </div>
    );
  }

  const tabs = [
    { id: 'personal', label: 'اطلاعات فردی' },
    { id: 'job', label: 'اطلاعات شغلی' },
    { id: 'attendance', label: 'حضور و غیاب' },
    { id: 'leave', label: 'مرخصی' },
    { id: 'salary', label: 'حقوق' },
    { id: 'performance', label: 'عملکرد' },
    { id: 'training', label: 'آموزش' },
    { id: 'documents', label: 'اسناد' },
  ];

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <button onClick={() => navigate('/employees')} className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700">
        <ArrowRight className="w-4 h-4" /> بازگشت به لیست کارکنان
      </button>

      {/* Profile Header */}
      <div className="bg-white rounded-xl border p-6">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
          <Avatar name={employee.fullName} size="lg" />
          <div className="flex-1">
            <h1 className="text-2xl font-bold">{employee.fullName}</h1>
            <p className="text-gray-500 mt-1">{employee.jobTitle} • {employee.department}</p>
            <div className="flex flex-wrap gap-2 mt-3">
              <Badge variant={employee.employmentStatus === 'active' ? 'success' : 'danger'}>{getStatusName(employee.employmentStatus)}</Badge>
              <Badge variant="info">{getEmploymentTypeName(employee.employmentType)}</Badge>
              <Badge>{getWorkModeName(employee.workMode)}</Badge>
            </div>
          </div>
          <div className="flex flex-col gap-2 text-sm text-gray-600">
            <div className="flex items-center gap-2"><Phone className="w-4 h-4" />{employee.mobile}</div>
            <div className="flex items-center gap-2"><Mail className="w-4 h-4" />{employee.email}</div>
            <div className="flex items-center gap-2"><MapPin className="w-4 h-4" />{employee.city}</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      {/* Tab Content */}
      <div className="bg-white rounded-xl border p-6">
        {activeTab === 'personal' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <InfoItem label="نام" value={employee.firstName} />
            <InfoItem label="نام خانوادگی" value={employee.lastName} />
            <InfoItem label="کد ملی" value={employee.nationalId} />
            <InfoItem label="تاریخ تولد" value={employee.birthDate} />
            <InfoItem label="سن" value={`${formatNumber(employee.age)} سال`} />
            <InfoItem label="جنسیت" value={getGenderName(employee.gender)} />
            <InfoItem label="وضعیت تأهل" value={getMaritalName(employee.maritalStatus)} />
            <InfoItem label="موبایل" value={employee.mobile} />
            <InfoItem label="ایمیل" value={employee.email} />
            <InfoItem label="استان" value={employee.province} />
            <InfoItem label="شهر" value={employee.city} />
            <InfoItem label="آدرس" value={employee.address} />
            <InfoItem label="تحصیلات" value={employee.degree} />
            <InfoItem label="رشته" value={employee.education} />
          </div>
        )}

        {activeTab === 'job' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <InfoItem label="کد پرسنلی" value={employee.employeeCode} />
            <InfoItem label="سمت" value={employee.jobTitle} />
            <InfoItem label="واحد سازمانی" value={employee.department} />
            <InfoItem label="مدیر مستقیم" value={employee.managerName} />
            <InfoItem label="تاریخ استخدام" value={employee.hireDate} />
            <InfoItem label="سابقه کار" value={`${employee.tenure.toFixed(1)} سال`} />
            <InfoItem label="نوع قرارداد" value={getEmploymentTypeName(employee.employmentType)} />
            <InfoItem label="محل خدمت" value={employee.location} />
            <InfoItem label="شعبه" value={employee.branch} />
            <InfoItem label="وضعیت همکاری" value={getStatusName(employee.employmentStatus)} />
            <InfoItem label="نحوه کار" value={getWorkModeName(employee.workMode)} />
          </div>
        )}

        {activeTab === 'attendance' && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatBox label="نرخ حضور" value={`${employee.attendanceRate}%`} color="green" />
              <StatBox label="روزهای غیبت" value={formatNumber(employee.absenceDays)} color="red" />
              <StatBox label="تأخیر (دقیقه)" value={formatNumber(employee.lateMinutes)} color="orange" />
              <StatBox label="اضافه‌کاری (ساعت)" value={formatNumber(Math.round(employee.overtimeHours))} color="blue" />
            </div>
            <SectionCard title="سوابق حضور (نمونه)">
              <table className="w-full text-sm">
                <thead className="bg-gray-50"><tr><th className="p-3 text-right">تاریخ</th><th className="p-3 text-right">وضعیت</th><th className="p-3 text-right">ساعت ورود</th><th className="p-3 text-right">ساعت خروج</th><th className="p-3 text-right">ساعت کار</th></tr></thead>
                <tbody>
                  {['1403/08/15','1403/08/14','1403/08/13','1403/08/12','1403/08/11'].map((d, i) => (
                    <tr key={d} className="border-t">
                      <td className="p-3">{d}</td>
                      <td className="p-3"><Badge variant={i === 2 ? 'warning' : 'success'}>{i === 2 ? 'تأخیر' : 'حاضر'}</Badge></td>
                      <td className="p-3">{i === 2 ? '08:25' : '07:55'}</td>
                      <td className="p-3">16:30</td>
                      <td className="p-3">{i === 2 ? '8:05' : '8:35'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </SectionCard>
          </div>
        )}

        {activeTab === 'leave' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-blue-50 rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-blue-700">{employee.totalLeaveEntitlement}</div>
                <div className="text-sm text-blue-600">سهمیه کل</div>
              </div>
              <div className="bg-orange-50 rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-orange-700">{employee.usedLeave}</div>
                <div className="text-sm text-orange-600">استفاده‌شده</div>
              </div>
              <div className="bg-emerald-50 rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-emerald-700">{employee.remainingLeave}</div>
                <div className="text-sm text-emerald-600">مانده</div>
              </div>
            </div>
            <ProgressBar value={employee.usedLeave} max={employee.totalLeaveEntitlement} color="blue" label="درصد استفاده از مرخصی" />
          </div>
        )}

        {activeTab === 'salary' && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <StatBox label="حقوق پایه" value={formatCurrency(employee.baseSalary)} color="blue" />
              <StatBox label="مزایا" value={formatCurrency(employee.allowances)} color="green" />
              <StatBox label="اضافه‌کاری" value={formatCurrency(employee.overtimePay)} color="purple" />
              <StatBox label="پاداش" value={formatCurrency(employee.bonus)} color="teal" />
              <StatBox label="کسورات" value={formatCurrency(employee.deductions)} color="red" />
              <StatBox label="دریافتی خالص" value={formatCurrency(employee.netSalary)} color="indigo" />
            </div>
          </div>
        )}

        {activeTab === 'performance' && (
          <div className="space-y-6">
            <div className="flex items-center gap-6">
              <div className={`text-5xl font-bold ${getPerformanceColor(employee.performanceScore)}`}>{employee.performanceScore}</div>
              <div>
                <div className="text-lg font-medium">امتیاز عملکرد</div>
                <div className="text-sm text-gray-500">از ۵ امتیاز</div>
              </div>
            </div>
            <ProgressBar value={employee.performanceScore} max={5} color={employee.performanceScore >= 4 ? 'green' : employee.performanceScore >= 3 ? 'blue' : 'orange'} label="امتیاز عملکرد" />
            <SectionCard title="اهداف">
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-sm"><span className="w-2 h-2 rounded-full bg-emerald-500" />تحقق اهداف تعیین‌شده واحد</li>
                <li className="flex items-center gap-2 text-sm"><span className="w-2 h-2 rounded-full bg-blue-500" />بهبود مهارت‌های تخصصی</li>
                <li className="flex items-center gap-2 text-sm"><span className="w-2 h-2 rounded-full bg-purple-500" />همکاری مؤثر با تیم</li>
              </ul>
            </SectionCard>
          </div>
        )}

        {activeTab === 'training' && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <StatBox label="ساعات آموزش" value={formatNumber(Math.round(employee.trainingHours))} color="purple" />
              <StatBox label="دوره‌های گذرانده" value={Math.floor(employee.trainingHours / 16)} color="blue" />
              <StatBox label="میانگین نمره" value="4.2" color="green" />
            </div>
            <SectionCard title="دوره‌های آموزشی">
              <div className="space-y-3">
                {['مدیریت پروژه حرفه‌ای', 'React پیشرفته', 'مهارت‌های ارتباطی'].map((course, i) => (
                  <div key={i} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <BookOpen className="w-5 h-5 text-blue-500" />
                      <span className="text-sm">{course}</span>
                    </div>
                    <Badge variant="success">تکمیل‌شده</Badge>
                  </div>
                ))}
              </div>
            </SectionCard>
          </div>
        )}

        {activeTab === 'documents' && (
          <div className="space-y-4">
            <p className="text-sm text-gray-500 mb-4">اسناد پرسنلی آپلودشده:</p>
            {['تصویر کارت ملی', 'سند تحصیلی', 'قرارداد همکاری', 'رزومه'].map((doc, i) => (
              <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">📄</div>
                  <div>
                    <div className="text-sm font-medium">{doc}</div>
                    <div className="text-xs text-gray-500">آپلود: 1403/05/10</div>
                  </div>
                </div>
                <button className="text-sm text-blue-600 hover:underline">مشاهده</button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-xs text-gray-500 mb-1">{label}</div>
      <div className="text-sm font-medium">{value || '—'}</div>
    </div>
  );
}

function StatBox({ label, value, color }: { label: string; value: string | number; color: string }) {
  const colors: Record<string, string> = {
    blue: 'bg-blue-50 text-blue-700', green: 'bg-emerald-50 text-emerald-700',
    red: 'bg-red-50 text-red-700', orange: 'bg-orange-50 text-orange-700',
    purple: 'bg-purple-50 text-purple-700', teal: 'bg-teal-50 text-teal-700',
    indigo: 'bg-indigo-50 text-indigo-700',
  };
  return (
    <div className={`${colors[color] || colors.blue} rounded-xl p-4 text-center`}>
      <div className="text-xl font-bold">{value}</div>
      <div className="text-sm mt-1 opacity-80">{label}</div>
    </div>
  );
}
