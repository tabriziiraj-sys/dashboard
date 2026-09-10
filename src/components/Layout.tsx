import React, { useState } from 'react';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import {
  LayoutDashboard, Users, GitBranch, Clock, CalendarDays, UserPlus,
  Target, GraduationCap, DollarSign, TrendingDown, BarChart3, FileText,
  FileSpreadsheet, Settings, LogOut, Search, Bell, Menu, X, ChevronLeft,
  Sun, Moon, ArrowUpLeft, ArrowDownRight, ChevronDown
} from 'lucide-react';
import { formatNumber } from '../utils/helpers';

const menuItems = [
  { path: '/', label: 'داشبورد', icon: LayoutDashboard },
  { path: '/employees', label: 'کارکنان', icon: Users },
  { path: '/organization', label: 'ساختار سازمانی', icon: GitBranch },
  { path: '/attendance', label: 'حضور و غیاب', icon: Clock },
  { path: '/leave', label: 'مرخصی', icon: CalendarDays },
  { path: '/recruitment', label: 'استخدام', icon: UserPlus },
  { path: '/performance', label: 'عملکرد', icon: Target },
  { path: '/learning', label: 'آموزش', icon: GraduationCap },
  { path: '/payroll', label: 'حقوق و مزایا', icon: DollarSign },
  { path: '/turnover', label: 'ترک خدمت', icon: TrendingDown },
  { path: '/workforce', label: 'تحلیل سرمایه انسانی', icon: BarChart3 },
  { path: '/reports', label: 'گزارش‌ها', icon: FileText },
  { path: '/excel', label: 'ورود / خروج Excel', icon: FileSpreadsheet },
  { path: '/settings', label: 'تنظیمات', icon: Settings },
];

export default function Layout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, notifications, alerts, filteredEmployees, theme, toggleTheme } = useApp();

  const unreadNotifs = notifications.filter(n => !n.read).length;
  const unreadAlerts = alerts.filter(a => !a.read).length;

  const searchResults = searchQuery.length > 1
    ? filteredEmployees.filter(e =>
        e.fullName.includes(searchQuery) ||
        e.employeeCode.includes(searchQuery) ||
        e.department.includes(searchQuery) ||
        e.jobTitle.includes(searchQuery)
      ).slice(0, 8)
    : [];

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-900'}`} dir="rtl">
      {/* Mobile Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setMobileMenuOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed top-0 right-0 h-full z-50 transition-all duration-300 ${sidebarCollapsed ? 'w-16' : 'w-64'} ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-l shadow-lg ${mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'} lg:translate-x-0`}>
        <div className="flex items-center justify-between p-4 border-b border-inherit">
          {!sidebarCollapsed && (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-lg flex items-center justify-center">
                <Users className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-sm">سیستم منابع انسانی</span>
            </div>
          )}
          <button onClick={() => setSidebarCollapsed(!sidebarCollapsed)} className="hidden lg:flex p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700">
            <ChevronLeft className={`w-4 h-4 transition-transform ${sidebarCollapsed ? 'rotate-180' : ''}`} />
          </button>
          <button onClick={() => setMobileMenuOpen(false)} className="lg:hidden p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="p-2 space-y-1 overflow-y-auto h-[calc(100%-140px)]">
          {menuItems.map(item => {
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.path}
                onClick={() => { navigate(item.path); setMobileMenuOpen(false); }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${isActive ? 'bg-blue-50 text-blue-700 font-medium' : theme === 'dark' ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-50'}`}
                title={item.label}
              >
                <item.icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-blue-600' : ''}`} />
                {!sidebarCollapsed && <span>{item.label}</span>}
              </button>
            );
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-3 border-t border-inherit">
          <button onClick={handleLogout} className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm ${theme === 'dark' ? 'text-red-400 hover:bg-gray-700' : 'text-red-600 hover:bg-red-50'}`}>
            <LogOut className="w-5 h-5" />
            {!sidebarCollapsed && <span>خروج</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className={`transition-all duration-300 ${sidebarCollapsed ? 'lg:mr-16' : 'lg:mr-64'}`}>
        {/* Header */}
        <header className={`sticky top-0 z-30 ${theme === 'dark' ? 'bg-gray-800/95 border-gray-700' : 'bg-white/95 border-gray-200'} border-b backdrop-blur-sm`}>
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center gap-3">
              <button onClick={() => setMobileMenuOpen(true)} className="lg:hidden p-2 rounded-lg hover:bg-gray-100">
                <Menu className="w-5 h-5" />
              </button>
              
              {/* Global Search */}
              <div className="relative">
                <div className={`flex items-center gap-2 px-3 py-2 rounded-lg border ${theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'} w-64`}>
                  <Search className="w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="جستجوی کارمند..."
                    value={searchQuery}
                    onChange={(e) => { setSearchQuery(e.target.value); setSearchOpen(true); }}
                    onFocus={() => setSearchOpen(true)}
                    className="bg-transparent outline-none text-sm w-full placeholder:text-gray-400"
                  />
                </div>
                {searchOpen && searchResults.length > 0 && (
                  <div className={`absolute top-full mt-1 right-0 w-80 ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-lg shadow-xl z-50 max-h-80 overflow-y-auto`}>
                    {searchResults.map(emp => (
                      <button
                        key={emp.id}
                        onClick={() => { navigate(`/employees/${emp.id}`); setSearchOpen(false); setSearchQuery(''); }}
                        className={`w-full flex items-center gap-3 px-4 py-3 text-right hover:${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'} border-b border-gray-100 last:border-0`}
                      >
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-xs font-bold">
                          {emp.firstName[0]}
                        </div>
                        <div>
                          <div className="text-sm font-medium">{emp.fullName}</div>
                          <div className="text-xs text-gray-500">{emp.department} - {emp.jobTitle}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Theme Toggle */}
              <button onClick={toggleTheme} className={`p-2 rounded-lg ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}>
                {theme === 'dark' ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-gray-500" />}
              </button>

              {/* Notifications */}
              <div className="relative">
                <button onClick={() => setNotifOpen(!notifOpen)} className={`p-2 rounded-lg relative ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}>
                  <Bell className="w-5 h-5" />
                  {(unreadNotifs + unreadAlerts) > 0 && (
                    <span className="absolute -top-0.5 -left-0.5 w-4 h-4 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center">
                      {formatNumber(unreadNotifs + unreadAlerts)}
                    </span>
                  )}
                </button>
                {notifOpen && (
                  <div className={`absolute top-full mt-2 left-0 w-80 ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-lg shadow-xl z-50`}>
                    <div className="p-3 border-b border-inherit font-medium text-sm">اعلان‌ها</div>
                    <div className="max-h-64 overflow-y-auto">
                      {notifications.map(n => (
                        <div key={n.id} className={`px-4 py-3 border-b border-gray-100 ${!n.read ? (theme === 'dark' ? 'bg-gray-750' : 'bg-blue-50/50') : ''}`}>
                          <div className="text-sm font-medium">{n.title}</div>
                          <div className="text-xs text-gray-500 mt-1">{n.message}</div>
                          <div className="text-xs text-gray-400 mt-1">{n.date}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Profile */}
              <div className="relative">
                <button onClick={() => setProfileOpen(!profileOpen)} className={`flex items-center gap-2 px-3 py-2 rounded-lg ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}>
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white text-xs font-bold">
                    م
                  </div>
                  <span className="text-sm hidden md:block">مدیر سیستم</span>
                  <ChevronDown className="w-3 h-3" />
                </button>
                {profileOpen && (
                  <div className={`absolute top-full mt-2 left-0 w-48 ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-lg shadow-xl z-50`}>
                    <button onClick={handleLogout} className="w-full flex items-center gap-2 px-4 py-3 text-sm text-red-600 hover:bg-red-50 rounded-lg">
                      <LogOut className="w-4 h-4" />
                      خروج از سیستم
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 md:p-6">
          <Outlet />
        </main>
      </div>

      {/* Click outside to close dropdowns */}
      {(searchOpen || notifOpen || profileOpen) && (
        <div className="fixed inset-0 z-20" onClick={() => { setSearchOpen(false); setNotifOpen(false); setProfileOpen(false); }} />
      )}
    </div>
  );
}
