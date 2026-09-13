import React from 'react';
import { useApp } from '../contexts/AppContext';
import { SectionCard } from '../components/UIComponents';
import { Settings as SettingsIcon, User, Shield, Palette, Bell, Database } from 'lucide-react';

export default function SettingsPage() {
  const { theme, toggleTheme, user } = useApp();

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold">تنظیمات</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SectionCard title="👤 اطلاعات کاربر">
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white text-xl font-bold">م</div>
              <div>
                <div className="font-bold">مدیر سیستم</div>
                <div className="text-sm text-gray-500">admin@company.ir</div>
                <div className="text-xs text-gray-400 mt-1">نقش: مدیر ارشد</div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div><label className="text-xs text-gray-500">نام کاربری</label><input value="admin" readOnly className="w-full border rounded-lg px-3 py-2 text-sm mt-1 bg-gray-50" /></div>
              <div><label className="text-xs text-gray-500">ایمیل</label><input value="admin@company.ir" className="w-full border rounded-lg px-3 py-2 text-sm mt-1" /></div>
            </div>
          </div>
        </SectionCard>

        <SectionCard title="🎨 ظاهر">
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <div className="font-medium text-sm">حالت تاریک</div>
                <div className="text-xs text-gray-500">تغییر ظاهر سیستم</div>
              </div>
              <button onClick={toggleTheme} className={`w-12 h-6 rounded-full transition-colors ${theme === 'dark' ? 'bg-blue-600' : 'bg-gray-300'} relative`}>
                <div className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-all ${theme === 'dark' ? 'right-6' : 'right-0.5'}`} />
              </button>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <div className="font-medium text-sm">زبان</div>
                <div className="text-xs text-gray-500">زبان رابط کاربری</div>
              </div>
              <select className="border rounded-lg px-3 py-1.5 text-sm"><option>فارسی</option><option>English</option></select>
            </div>
          </div>
        </SectionCard>

        <SectionCard title="🔔 اعلان‌ها">
          <div className="space-y-3">
            {['اعلان ایمیلی', 'اعلان مرورگر', 'هشدارهای مدیریتی', 'یادآوری قرارداد'].map((item, i) => (
              <div key={i} className="flex items-center justify-between p-3 border rounded-lg">
                <span className="text-sm">{item}</span>
                <div className="w-10 h-5 bg-blue-600 rounded-full relative cursor-pointer">
                  <div className="w-4 h-4 rounded-full bg-white absolute top-0.5 right-0.5" />
                </div>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="🔒 امنیت">
          <div className="space-y-4">
            <div><label className="text-sm font-medium">تغییر رمز عبور</label>
              <input type="password" placeholder="رمز عبور فعلی" className="w-full border rounded-lg px-3 py-2 text-sm mt-2" />
              <input type="password" placeholder="رمز عبور جدید" className="w-full border rounded-lg px-3 py-2 text-sm mt-2" />
              <button className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm">تغییر رمز</button>
            </div>
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-700">
              ⚠️ احراز هویت دو مرحله‌ای غیرفعال است
            </div>
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
