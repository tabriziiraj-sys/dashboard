import React, { ReactNode } from 'react';
import { ArrowUpLeft, ArrowDownRight } from 'lucide-react';
import { cn, formatNumber } from '../utils/helpers';

// KPI Card
interface KPICardProps {
  title: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  icon?: ReactNode;
  color?: string;
  sparkData?: number[];
}

export function KPICard({ title, value, change, changeLabel = 'نسبت به دوره قبل', icon, color = 'blue', sparkData }: KPICardProps) {
  const colorClasses: Record<string, string> = {
    blue: 'from-blue-500 to-blue-600',
    green: 'from-emerald-500 to-emerald-600',
    purple: 'from-purple-500 to-purple-600',
    orange: 'from-orange-500 to-orange-600',
    red: 'from-red-500 to-red-600',
    indigo: 'from-indigo-500 to-indigo-600',
    teal: 'from-teal-500 to-teal-600',
    pink: 'from-pink-500 to-pink-600',
  };

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-xs text-gray-500 mb-1">{title}</p>
          <p className="text-xl font-bold text-gray-900">{typeof value === 'number' ? formatNumber(value) : value}</p>
          {change !== undefined && (
            <div className={`flex items-center gap-1 mt-2 text-xs ${change >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
              {change >= 0 ? <ArrowUpLeft className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
              <span>{formatNumber(Math.abs(change))}%</span>
              <span className="text-gray-400">{changeLabel}</span>
            </div>
          )}
        </div>
        {icon && (
          <div className={cn('w-10 h-10 rounded-lg bg-gradient-to-br flex items-center justify-center text-white', colorClasses[color] || colorClasses.blue)}>
            {icon}
          </div>
        )}
      </div>
      {sparkData && sparkData.length > 0 && (
        <div className="mt-3 h-8 flex items-end gap-0.5">
          {sparkData.map((v, i) => (
            <div key={i} className="flex-1 bg-blue-100 rounded-sm" style={{ height: `${(v / Math.max(...sparkData)) * 100}%` }} />
          ))}
        </div>
      )}
    </div>
  );
}

// Section Card
interface SectionCardProps {
  title: string;
  children: ReactNode;
  className?: string;
  action?: ReactNode;
}

export function SectionCard({ title, children, className, action }: SectionCardProps) {
  return (
    <div className={cn('bg-white rounded-xl border border-gray-100 p-5', className)}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-gray-900 text-sm">{title}</h3>
        {action}
      </div>
      {children}
    </div>
  );
}

// Stat Badge
export function StatBadge({ label, value, color = 'blue' }: { label: string; value: string | number; color?: string }) {
  const colors: Record<string, string> = {
    blue: 'bg-blue-50 text-blue-700',
    green: 'bg-emerald-50 text-emerald-700',
    red: 'bg-red-50 text-red-700',
    orange: 'bg-orange-50 text-orange-700',
    purple: 'bg-purple-50 text-purple-700',
  };
  return (
    <div className={cn('px-3 py-1.5 rounded-lg text-xs font-medium', colors[color])}>
      {label}: {typeof value === 'number' ? formatNumber(value) : value}
    </div>
  );
}

// Progress Bar
export function ProgressBar({ value, max = 100, color = 'blue', label }: { value: number; max?: number; color?: string; label?: string }) {
  const pct = Math.min(100, (value / max) * 100);
  const colors: Record<string, string> = {
    blue: 'bg-blue-500', green: 'bg-emerald-500', red: 'bg-red-500',
    orange: 'bg-orange-500', purple: 'bg-purple-500',
  };
  return (
    <div className="w-full">
      {label && <div className="flex justify-between text-xs text-gray-500 mb-1"><span>{label}</span><span>{formatNumber(value)}/{formatNumber(max)}</span></div>}
      <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
        <div className={cn('h-full rounded-full transition-all', colors[color])} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

// Loading Skeleton
export function Skeleton({ className }: { className?: string }) {
  return <div className={cn('animate-pulse bg-gray-200 rounded', className)} />;
}

// Empty State
export function EmptyState({ message = 'داده‌ای یافت نشد', icon }: { message?: string; icon?: ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-gray-400">
      {icon || <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-3"><span className="text-2xl">📭</span></div>}
      <p className="text-sm">{message}</p>
    </div>
  );
}

// Modal
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export function Modal({ isOpen, onClose, title, children, size = 'md' }: ModalProps) {
  if (!isOpen) return null;
  const sizes = { sm: 'max-w-sm', md: 'max-w-lg', lg: 'max-w-2xl', xl: 'max-w-4xl' };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className={`relative bg-white rounded-xl shadow-2xl w-full ${sizes[size]} max-h-[90vh] overflow-y-auto`}>
        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between rounded-t-xl">
          <h3 className="font-bold text-lg">{title}</h3>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-gray-100">✕</button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

// Badge
export function Badge({ children, variant = 'default' }: { children: ReactNode; variant?: 'default' | 'success' | 'warning' | 'danger' | 'info' }) {
  const variants = {
    default: 'bg-gray-100 text-gray-700',
    success: 'bg-emerald-50 text-emerald-700',
    warning: 'bg-amber-50 text-amber-700',
    danger: 'bg-red-50 text-red-700',
    info: 'bg-blue-50 text-blue-700',
  };
  return <span className={cn('px-2 py-0.5 rounded-full text-xs font-medium', variants[variant])}>{children}</span>;
}

// Filter Chip
export function FilterChip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium">
      {label}
      <button onClick={onRemove} className="hover:text-blue-900">✕</button>
    </span>
  );
}

// Avatar
export function Avatar({ name, size = 'md' }: { name: string; size?: 'sm' | 'md' | 'lg' }) {
  const sizes = { sm: 'w-8 h-8 text-xs', md: 'w-10 h-10 text-sm', lg: 'w-16 h-16 text-lg' };
  const colors = ['from-blue-500 to-purple-500', 'from-emerald-500 to-teal-500', 'from-orange-500 to-red-500', 'from-pink-500 to-rose-500', 'from-indigo-500 to-blue-500'];
  const colorIdx = name.charCodeAt(0) % colors.length;
  return (
    <div className={`${sizes[size]} rounded-full bg-gradient-to-br ${colors[colorIdx]} flex items-center justify-center text-white font-bold flex-shrink-0`}>
      {name[0]}
    </div>
  );
}

// Tab Component
export function Tabs({ tabs, activeTab, onChange }: { tabs: { id: string; label: string }[]; activeTab: string; onChange: (id: string) => void }) {
  return (
    <div className="flex gap-1 border-b border-gray-200 mb-4 overflow-x-auto">
      {tabs.map(tab => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={cn('px-4 py-2.5 text-sm font-medium border-b-2 transition-colors whitespace-nowrap',
            activeTab === tab.id ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
