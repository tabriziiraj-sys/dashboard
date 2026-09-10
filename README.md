# سیستم مدیریت منابع انسانی (HR Dashboard)

یک داشبورد جامع و حرفه‌ای مدیریت منابع انسانی با قابلیت‌های کامل تحلیل، گزارش‌گیری و مدیریت کارکنان.

## 🚀 امکانات

### داشبورد اصلی
- KPIهای جامع نیروی انسانی (بیش از ۳۰ شاخص کلیدی)
- نمودارهای تحلیلی متنوع (Bar, Pie, Line, Area, Radar)
- خلاصه مدیریتی هوشمند
- قیف استخدام
- هشدارهای مدیریتی

### مدیریت کارکنان
- لیست کامل کارکنان با جدول حرفه‌ای
- جستجو، فیلتر و مرتب‌سازی
- پروفایل کامل هر کارمند با تب‌های مختلف
- افزودن، ویرایش و حذف کارمند
- صفحه‌بندی و انتخاب چندتایی

### صفحات تحلیلی
- **حضور و غیاب**: آمار حضور، غیبت، تأخیر و اضافه‌کاری
- **مرخصی**: تحلیل انواع مرخصی و روند ماهانه
- **استخدام**: داشبورد جذب با قیف استخدام
- **عملکرد**: تحلیل امتیاز عملکرد و Ranking
- **آموزش**: مدیریت دوره‌ها و ROI آموزش
- **حقوق و مزایا**: تحلیل Payroll و مقایسه واحدها
- **ترک خدمت**: تحلیل دلایل و نرخ خروج
- **تحلیل سرمایه انسانی**: شاخص‌های پیشرفته HR

### ابزارها
- **ورود از Excel**: آپلود فایل xlsx با Preview و Column Mapping
- **خروجی Excel**: Export در تمام بخش‌ها با Header فارسی
- **گزارش‌ها**: ۸ نوع گزارش آماده با قابلیت Export
- **جستجوی سراسری**: جستجو در تمام کارکنان
- **مرکز اعلان‌ها**: Notification Center در Header

### ویژگی‌های UI/UX
- طراحی RTL کامل فارسی
- فونت وزیرمتن
- تاریخ شمسی
- Responsive (Desktop, Laptop, Tablet)
- حالت روشن و تاریک
- Sidebar قابل جمع‌شدن
- انیمیشن‌های ظریف

## 🛠 تکنولوژی‌ها

- **React 18** + **TypeScript**
- **Vite** (Build Tool)
- **Tailwind CSS 4** (Styling)
- **React Router 6** (Routing)
- **Recharts** (Charts)
- **XLSX** (Excel Import/Export)
- **Jalaali-JS** (Persian Calendar)
- **Lucide React** (Icons)

## 📁 ساختار پروژه

```
src/
├── App.tsx                    # Entry point + Routing
├── main.tsx                   # React DOM render
├── index.css                  # Global styles + Tailwind
├── contexts/
│   └── AppContext.tsx          # State management (Auth + Data)
├── data/
│   ├── types.ts               # TypeScript interfaces
│   └── seedData.ts            # Mock data generator (150 employees)
├── utils/
│   └── helpers.ts             # Persian date, formatting, utilities
├── components/
│   ├── Layout.tsx             # Sidebar + Header + Navigation
│   └── UIComponents.tsx       # Reusable components (KPI, Modal, etc.)
└── pages/
    ├── Login.tsx              # Login page
    ├── Dashboard.tsx          # Main HR Dashboard
    ├── Employees.tsx          # Employee management
    ├── EmployeeProfile.tsx    # Employee detail page
    ├── OrganizationChart.tsx  # Org structure
    ├── Attendance.tsx         # Attendance analytics
    ├── Leave.tsx              # Leave management
    ├── Recruitment.tsx        # Recruitment dashboard
    ├── Performance.tsx        # Performance management
    ├── Learning.tsx           # L&D dashboard
    ├── Payroll.tsx            # Payroll analytics
    ├── Turnover.tsx           # Turnover analysis
    ├── WorkforceAnalytics.tsx # Workforce metrics
    ├── Reports.tsx            # Reports section
    ├── ExcelPage.tsx          # Excel import/export
    └── Settings.tsx           # Settings page
```

## 📦 نصب و اجرا

### پیش‌نیازها
- Node.js 18+
- npm 9+

### نصب
```bash
npm install
```

### اجرای Development
```bash
npm run dev
```

### Build Production
```bash
npm run build
```

## 🔐 اطلاعات ورود

| فیلد | مقدار |
|------|-------|
| نام کاربری | `admin` |
| رمز عبور | `12345` |

## 📊 ورود اطلاعات از Excel

1. به بخش «ورود / خروج Excel» بروید
2. فایل قالب نمونه را دانلود کنید (دکمه «دانلود قالب نمونه»)
3. اطلاعات کارکنان را طبق قالب وارد کنید
4. فایل را آپلود کنید
5. Preview داده‌ها را بررسی کنید
6. روی «تأیید و ورود» کلیک کنید

### فرمت فایل Excel
ستون‌های مورد نیاز:
- کد پرسنلی
- نام
- نام خانوادگی
- کد ملی
- جنسیت
- موبایل
- ایمیل
- واحد
- سمت

## 📤 خروجی Excel

خروجی در بخش‌های زیر امکان‌پذیر است:
- لیست کارکنان (کامل)
- حضور و غیاب
- مرخصی
- عملکرد
- حقوق و مزایا
- آموزش
- استخدام

## 🗃 Data Layer

- داده‌ها در `src/data/seedData.ts` تولید می‌شوند
- ۱۵۰ کارمند نمونه ایرانی با اطلاعات منطقی
- Seed ثابت (با Refresh تغییر نمی‌کند)
- Data Layer از UI جداست (قابل جایگزینی با API)

## 📝 License

این پروژه برای اهداف نمایشی و Demo طراحی شده است.
