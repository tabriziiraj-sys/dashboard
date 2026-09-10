import { Employee, Department, LeaveRecord, RecruitmentPosition, PerformanceReview, TrainingCourse, Alert, Notification } from './types';

const firstNamesMale = ['امیر','علی','محمد','حسین','رضا','مهدی','سعید','آرش','نیما','پویا','کاوه','بهنام','سینا','داریوش','فرهاد','پارسا','کیان','سامان','یاسین','ابوالفضل','میلاد','شایان','عرفان','آرمان','بهزاد','حامد','جواد','وحید','ناصر','کامران','محسن','امید','رامین','شهاب','طاها','ایمان','بابک','توحید','پیمان','آرین'];
const firstNamesFemale = ['نگار','سارا','مریم','فاطمه','زهرا','نیلوفر','مینا','الهام','شیما','پریسا','نازنین','مهسا','ترانه','هانیه','یاسمن','سمیرا','رویا','لیلا','فرناز','آتنا','بهناز','درسا','گلناز','کتایون','مهتاب','سحر','شیرین','نسرین','فرزانه','آرزو','دیبا','رها','تینا','مونا','ریحانه','سوگند','آوا','سپیده','نسترن','پگاه'];
const lastNames = ['رضایی','احمدی','کریمی','حسینی','محمدی','کاظمی','اکبری','مرادی','نوری','صادقی','جعفری','موسوی','هاشمی','رحیمی','عباسی','علوی','طاهری','باقری','امینی','فرهادی','نجفی','سلطانی','میرزایی','غفاری','شریفی','داوودی','یوسفی','قاسمی',' Ibrahimی','فتاحی','ملکی','صفری','بهرامی','خسروی','زارعی','پاکدل','شاکری','منصوری','گلستانی','آقایی'];
const departments = [
  { id: 'd1', name: 'فناوری اطلاعات', manager: 'آرش اکبری' },
  { id: 'd2', name: 'منابع انسانی', manager: 'نگار محمدی' },
  { id: 'd3', name: 'مالی', manager: 'بهنام شریفی' },
  { id: 'd4', name: 'فروش', manager: 'مهدی کریمی' },
  { id: 'd5', name: 'بازاریابی', manager: 'پریسا حسینی' },
  { id: 'd6', name: 'عملیات', manager: 'کاوه رضایی' },
  { id: 'd7', name: 'پشتیبانی', manager: 'حامد نوری' },
  { id: 'd8', name: 'محصول', manager: 'سارا احمدی' },
];
const branches = ['تهران - مرکزی','تهران - شمال','اصفهان','شیراز','مشهد','تبریز','کرج'];
const cities = ['تهران','اصفهان','شیراز','مشهد','تبریز','کرج','اهواز','رشت','قم','کرمان'];
const provinces = ['تهران','اصفهان','فارس','خراسان رضوی','آذربایجان شرقی','البرز','خوزستان','گیلان','قم','کرمان'];
const jobTitlesByDept: Record<string, string[]> = {
  'فناوری اطلاعات': ['برنامه‌نویس ارشد','برنامه‌نویس','طراح UI/UX','مدیر فنی','تحلیلگر سیستم','تست‌کننده','مدیر پروژه','کارشناس شبکه','توسعه‌دهنده بک‌اند','توسعه‌دهنده فرانت‌اند'],
  'منابع انسانی': ['کارشناس جذب','کارشناس آموزش','مدیر منابع انسانی','کارشناس رفاه','کارشناس حقوق و دستمزد','تحلیلگر HR','کارشناس روابط کار'],
  'مالی': ['حسابدار','مدیر مالی','کارشناس بودجه','حسابرس','کارشناس خزانه‌داری','کارشناس مالیاتی','تحلیلگر مالی'],
  'فروش': ['کارشناس فروش','مدیر فروش','کارشناس فروش منطقه‌ای','نماینده فروش','مدیر حساب','کارشناس فروش آنلاین','سرپرست فروش'],
  'بازاریابی': ['کارشناس دیجیتال مارکتینگ','مدیر بازاریابی','کارشناس محتوا','طراح گرافیک','کارشناس سئو','کارشناس شبکه‌های اجتماعی','مدیر برند'],
  'عملیات': ['مدیر عملیات','کارشناس لجستیک','سرپرست انبار','کارشناس زنجیره تأمین','برنامه‌ریز تولید','کارشناس کنترل کیفیت'],
  'پشتیبانی': ['کارشناس پشتیبانی','مدیر پشتیبانی','تکنسین فنی','کارشناس خدمات مشتری','سرپرست تیم پشتیبانی'],
  'محصول': ['مدیر محصول','کارشناس محصول','تحلیلگر محصول','طراح محصول','مدیر استراتژی محصول'],
};
const degrees = ['دیپلم','کاردانی','کارشناسی','کارشناسی ارشد','دکتری'];
const educations = ['کامپیوتر','مدیریت','حسابداری','مهندسی صنایع','بازرگانی','مهندسی برق','مهندسی مکانیک','روانشناسی','حقوق','ادبیات','اقتصاد','ریاضی','آمار','طراحی گرافیک','معماری'];
const deptWeights = [25, 12, 15, 30, 18, 20, 15, 10]; // IT, HR, Finance, Sales, Marketing, Ops, Support, Product

function seededRandom(seed: number) {
  let s = seed;
  return () => { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; };
}

function generateNationalId(rand: () => number): string {
  const digits = Array.from({ length: 10 }, () => Math.floor(rand() * 10));
  const check = digits.reduce((sum, d, i) => sum + d * (10 - i), 0) % 11;
  digits[9] = check < 2 ? check : 11 - check;
  return digits.join('');
}

function generateMobile(rand: () => number): string {
  const prefixes = ['0912','0913','0914','0915','0916','0917','0918','0919','0930','0933','0935','0936','0937','0938','0939'];
  const prefix = prefixes[Math.floor(rand() * prefixes.length)];
  const rest = Array.from({ length: 7 }, () => Math.floor(rand() * 10)).join('');
  return prefix + rest;
}

function generateEmail(first: string, _last: string, rand: () => number): string {
  const domains = ['gmail.com','yahoo.com','outlook.com','company.ir'];
  const domain = domains[Math.floor(rand() * domains.length)];
  const num = Math.floor(rand() * 999);
  return `${first}${num}@${domain}`;
}

function generateHireDate(rand: () => number): string {
  const startYear = 1390;
  const endYear = 1403;
  const year = startYear + Math.floor(rand() * (endYear - startYear + 1));
  const month = 1 + Math.floor(rand() * 12);
  const day = 1 + Math.floor(rand() * 28);
  return `${year}/${String(month).padStart(2,'0')}/${String(day).padStart(2,'0')}`;
}

function generateBirthDate(rand: () => number, age: number): string {
  const currentJYear = 1403;
  const birthYear = currentJYear - age;
  const month = 1 + Math.floor(rand() * 12);
  const day = 1 + Math.floor(rand() * 28);
  return `${birthYear}/${String(month).padStart(2,'0')}/${String(day).padStart(2,'0')}`;
}

function calculateAge(birthDate: string): number {
  const [year] = birthDate.split('/').map(Number);
  return 1403 - year;
}

function calculateTenure(hireDate: string): number {
  const [year, month] = hireDate.split('/').map(Number);
  return (1403 - year) + (9 - month) / 12;
}

export function generateEmployees(): Employee[] {
  const rand = seededRandom(42);
  const employees: Employee[] = [];
  const totalEmployees = 150;
  
  // Distribute employees across departments based on weights
  const totalWeight = deptWeights.reduce((a, b) => a + b, 0);
  const deptCounts = deptWeights.map(w => Math.round((w / totalWeight) * totalEmployees));
  // Adjust to exactly 150
  const diff = totalEmployees - deptCounts.reduce((a, b) => a + b, 0);
  deptCounts[3] += diff; // Add diff to sales

  let empId = 1;
  
  departments.forEach((dept, deptIdx) => {
    const count = deptCounts[deptIdx];
    const titles = jobTitlesByDept[dept.name];
    
    for (let i = 0; i < count; i++) {
      const isMale = rand() > 0.4;
      const firstName = isMale 
        ? firstNamesMale[Math.floor(rand() * firstNamesMale.length)]
        : firstNamesFemale[Math.floor(rand() * firstNamesFemale.length)];
      const lastName = lastNames[Math.floor(rand() * lastNames.length)];
      const gender: 'male' | 'female' = isMale ? 'male' : 'female';
      const age = 22 + Math.floor(rand() * 38);
      const birthDate = generateBirthDate(rand, age);
      const hireDate = generateHireDate(rand);
      const tenure = calculateTenure(hireDate);
      const isManager = i === 0;
      const jobTitle = isManager ? titles[0].replace('کارشناس ','مدیر ') : titles[Math.floor(rand() * titles.length)];
      
      const cityIdx = Math.floor(rand() * cities.length);
      const city = cities[cityIdx];
      const province = provinces[cityIdx];
      const branch = branches[Math.floor(rand() * branches.length)];
      
      const empTypes: Array<'permanent' | 'contract' | 'partTime'> = ['permanent','contract','partTime'];
      const empTypeWeights = [0.5, 0.35, 0.15];
      const empTypeRand = rand();
      let employmentType: 'permanent' | 'contract' | 'partTime' = 'permanent';
      if (empTypeRand > 0.85) employmentType = 'partTime';
      else if (empTypeRand > 0.5) employmentType = 'contract';
      
      const statusRand = rand();
      let employmentStatus: 'active' | 'inactive' | 'terminated' = 'active';
      if (statusRand > 0.92) employmentStatus = 'terminated';
      else if (statusRand > 0.85) employmentStatus = 'inactive';
      
      const workModeRand = rand();
      let workMode: 'onsite' | 'remote' | 'hybrid' = 'onsite';
      if (workModeRand > 0.7) workMode = 'hybrid';
      else if (workModeRand > 0.55) workMode = 'remote';
      
      // Salary based on role and tenure
      const baseMultiplier = isManager ? 2.5 : (jobTitle.includes('ارشد') ? 1.8 : (jobTitle.includes('مدیر') ? 2.2 : 1));
      const baseSalary = Math.round((15000000 + rand() * 35000000) * baseMultiplier / 1000000) * 1000000;
      const allowances = Math.round(baseSalary * (0.1 + rand() * 0.3));
      const overtimeHours = Math.round(rand() * 40 * 10) / 10;
      const overtimePay = Math.round(overtimeHours * baseSalary / 160 * 1.4);
      const bonus = Math.round(baseSalary * rand() * 0.2);
      const deductions = Math.round(baseSalary * 0.07 + rand() * 2000000);
      const netSalary = baseSalary + allowances + overtimePay + bonus - deductions;
      
      const totalLeaveEntitlement = employmentType === 'partTime' ? 12 : 26;
      const usedLeave = Math.floor(rand() * (totalLeaveEntitlement - 2));
      const remainingLeave = totalLeaveEntitlement - usedLeave;
      
      const performanceScore = Math.round((2.5 + rand() * 2.5) * 10) / 10;
      const trainingHours = Math.round(rand() * 60 * 10) / 10;
      const attendanceRate = Math.round((85 + rand() * 15) * 10) / 10;
      const absenceDays = Math.floor(rand() * 10);
      const lateMinutes = Math.floor(rand() * 120);
      const earlyLeaves = Math.floor(rand() * 5);
      
      const degreeIdx = Math.min(4, Math.floor(rand() * 3 + (isManager ? 2 : tenure > 5 ? 1 : 0)));
      const degree = degrees[Math.min(4, degreeIdx)];
      const education = educations[Math.floor(rand() * educations.length)];
      
      const maritalRand = rand();
      const maritalStatus: 'single' | 'married' = (age > 30 && maritalRand > 0.3) || (age > 25 && maritalRand > 0.6) ? 'married' : 'single';
      
      const exitDate = employmentStatus === 'terminated' ? '1403/06/15' : null;
      const exitReasons = ['حقوق','مهاجرت','پیشنهاد شغلی بهتر','مسائل شخصی','عدم رضایت شغلی','تغییر مسیر شغلی','پایان قرارداد','عملکرد نامناسب'];
      const exitReason = employmentStatus === 'terminated' ? exitReasons[Math.floor(rand() * exitReasons.length)] : null;
      
      const id = `emp-${String(empId).padStart(3, '0')}`;
      const employeeCode = `EMP${String(1000 + empId).padStart(5, '0')}`;
      
      employees.push({
        id,
        employeeCode,
        firstName,
        lastName,
        fullName: `${firstName} ${lastName}`,
        nationalId: generateNationalId(rand),
        gender,
        birthDate,
        age,
        maritalStatus,
        mobile: generateMobile(rand),
        email: generateEmail(firstName, lastName, rand),
        province,
        city,
        address: `${city}، خیابان ${['آزادی','ولیعصر','انقلاب','پاسداران','دانشگاه','جمهوری','سعادت‌آباد','جردن'][Math.floor(rand() * 8)]}، پلاک ${Math.floor(rand() * 200 + 1)}`,
        avatar: `/avatars/${id}.svg`,
        departmentId: dept.id,
        department: dept.name,
        jobTitle,
        managerId: isManager ? null : dept.id,
        managerName: isManager ? 'مدیرعامل' : dept.manager,
        branch,
        location: branch,
        hireDate,
        tenure: Math.round(tenure * 10) / 10,
        employmentType,
        employmentStatus,
        workMode,
        baseSalary,
        allowances,
        bonus,
        overtimePay,
        deductions,
        netSalary,
        remainingLeave,
        usedLeave,
        totalLeaveEntitlement,
        attendanceRate,
        absenceDays,
        lateMinutes,
        earlyLeaves,
        overtimeHours,
        performanceScore,
        trainingHours,
        education,
        degree,
        exitDate,
        exitReason,
      });
      empId++;
    }
  });
  
  return employees;
}

export function generateDepartments(): Department[] {
  return departments.map(d => ({
    id: d.id,
    name: d.name,
    managerId: d.id,
    managerName: d.manager,
    parentId: null,
    headcount: 0,
  }));
}

export function generateLeaveRecords(employees: Employee[]): LeaveRecord[] {
  const rand = seededRandom(100);
  const records: LeaveRecord[] = [];
  const types: Array<'annual' | 'sick' | 'unpaid' | 'hourly' | 'mission' | 'other'> = ['annual','sick','unpaid','hourly','mission','other'];
  const statuses: Array<'pending' | 'approved' | 'rejected'> = ['approved','approved','approved','pending','rejected'];
  
  for (let i = 0; i < 80; i++) {
    const emp = employees[Math.floor(rand() * employees.length)];
    const type = types[Math.floor(rand() * types.length)];
    const days = type === 'hourly' ? 0.5 : Math.ceil(rand() * 10);
    const month = 1 + Math.floor(rand() * 9);
    const day = 1 + Math.floor(rand() * 28);
    records.push({
      id: `leave-${i + 1}`,
      employeeId: emp.id,
      employeeName: emp.fullName,
      type,
      startDate: `1403/${String(month).padStart(2,'0')}/${String(day).padStart(2,'0')}`,
      endDate: `1403/${String(month).padStart(2,'0')}/${String(Math.min(28, day + days)).padStart(2,'0')}`,
      days,
      status: statuses[Math.floor(rand() * statuses.length)],
      description: 'درخواست مرخصی',
    });
  }
  return records;
}

export function generateRecruitmentPositions(): RecruitmentPosition[] {
  return [
    { id: 'r1', title: 'برنامه‌نویس ارشد React', department: 'فناوری اطلاعات', status: 'open', postedDate: '1403/07/01', applicants: 45, screened: 20, interviewed: 8, offered: 2, hired: 1, source: 'لینکدین' },
    { id: 'r2', title: 'کارشناس فروش', department: 'فروش', status: 'open', postedDate: '1403/07/10', applicants: 60, screened: 25, interviewed: 12, offered: 3, hired: 2, source: 'سایت شرکت' },
    { id: 'r3', title: 'مدیر بازاریابی دیجیتال', department: 'بازاریابی', status: 'open', postedDate: '1403/06/15', applicants: 30, screened: 15, interviewed: 6, offered: 1, hired: 0, source: 'جابینجا' },
    { id: 'r4', title: 'حسابدار ارشد', department: 'مالی', status: 'closed', postedDate: '1403/05/01', applicants: 35, screened: 18, interviewed: 7, offered: 2, hired: 1, source: 'ایران تلنت' },
    { id: 'r5', title: 'کارشناس پشتیبانی فنی', department: 'پشتیبانی', status: 'open', postedDate: '1403/07/20', applicants: 25, screened: 12, interviewed: 5, offered: 1, hired: 0, source: 'کوئرا' },
    { id: 'r6', title: 'تحلیلگر داده', department: 'فناوری اطلاعات', status: 'onHold', postedDate: '1403/06/01', applicants: 40, screened: 22, interviewed: 9, offered: 2, hired: 1, source: 'لینکدین' },
    { id: 'r7', title: 'طراح UI/UX', department: 'محصول', status: 'open', postedDate: '1403/08/01', applicants: 50, screened: 20, interviewed: 8, offered: 2, hired: 1, source: 'لینکدین' },
    { id: 'r8', title: 'کارشناس منابع انسانی', department: 'منابع انسانی', status: 'closed', postedDate: '1403/04/15', applicants: 28, screened: 14, interviewed: 6, offered: 2, hired: 1, source: 'جابینجا' },
  ];
}

export function generatePerformanceReviews(employees: Employee[]): PerformanceReview[] {
  return employees.filter(e => e.employmentStatus === 'active').map(emp => ({
    employeeId: emp.id,
    employeeName: emp.fullName,
    department: emp.department,
    period: '1403 - نیمسال اول',
    score: emp.performanceScore,
    goals: ['تحقق اهداف فروش','بهبود مهارت‌های فنی','همکاری تیمی'],
    feedback: emp.performanceScore > 4 ? 'عملکرد عالی' : emp.performanceScore > 3 ? 'عملکرد خوب' : 'نیازمند بهبود',
    reviewer: emp.managerName,
  }));
}

export function generateTrainingCourses(): TrainingCourse[] {
  return [
    { id: 't1', title: 'مدیریت پروژه حرفه‌ای', department: 'عمومی', instructor: 'دکتر احمدی', hours: 24, cost: 5000000, participants: 20, completionRate: 85, averageScore: 4.2, startDate: '1403/04/01', endDate: '1403/04/30', status: 'completed' },
    { id: 't2', title: 'React پیشرفته', department: 'فناوری اطلاعات', instructor: 'مهندس رضایی', hours: 40, cost: 8000000, participants: 15, completionRate: 90, averageScore: 4.5, startDate: '1403/05/01', endDate: '1403/06/15', status: 'completed' },
    { id: 't3', title: 'مهارت‌های فروش', department: 'فروش', instructor: 'خانم کریمی', hours: 16, cost: 3000000, participants: 25, completionRate: 75, averageScore: 3.8, startDate: '1403/06/01', endDate: '1403/06/20', status: 'completed' },
    { id: 't4', title: 'رهبری و مدیریت تیم', department: 'عمومی', instructor: 'دکتر محمدی', hours: 20, cost: 6000000, participants: 12, completionRate: 92, averageScore: 4.6, startDate: '1403/07/01', endDate: '1403/07/25', status: 'active' },
    { id: 't5', title: 'امنیت سایبری', department: 'فناوری اطلاعات', instructor: 'مهندس حسینی', hours: 32, cost: 7000000, participants: 10, completionRate: 60, averageScore: 4.0, startDate: '1403/08/01', endDate: '1403/09/15', status: 'active' },
    { id: 't6', title: 'تحلیل داده با Python', department: 'فناوری اطلاعات', instructor: 'مهندس نوری', hours: 36, cost: 9000000, participants: 18, completionRate: 0, averageScore: 0, startDate: '1403/09/01', endDate: '1403/10/15', status: 'upcoming' },
    { id: 't7', title: 'مذاکره حرفه‌ای', department: 'فروش', instructor: 'دکتر شریفی', hours: 12, cost: 4000000, participants: 20, completionRate: 0, averageScore: 0, startDate: '1403/09/15', endDate: '1403/10/01', status: 'upcoming' },
    { id: 't8', title: 'مدیریت مالی برای غیرمالی‌ها', department: 'عمومی', instructor: 'دکتر باقری', hours: 16, cost: 3500000, participants: 30, completionRate: 80, averageScore: 4.1, startDate: '1403/05/15', endDate: '1403/06/10', status: 'completed' },
  ];
}

export function generateAlerts(): Alert[] {
  return [
    { id: 'a1', type: 'danger', title: 'افزایش نرخ ترک خدمت', message: 'نرخ ترک خدمت واحد فروش ۱۵٪ بالاتر از میانگین سازمان است.', date: '1403/08/15', read: false, category: 'turnover' },
    { id: 'a2', type: 'warning', title: 'اضافه‌کاری بیش از حد', message: 'اضافه‌کاری واحد پشتیبانی در ماه جاری ۱۸٪ افزایش داشته است.', date: '1403/08/14', read: false, category: 'attendance' },
    { id: 'a3', type: 'warning', title: 'قراردادهای رو به اتمام', message: 'قرارداد ۵ کارمند تا ۱۰ روز آینده پایان می‌یابد.', date: '1403/08/13', read: false, category: 'contract' },
    { id: 'a4', type: 'info', title: 'ارزیابی عملکرد', message: 'ارزیابی عملکرد نیمسال دوم باید تا پایان آبان تکمیل شود.', date: '1403/08/12', read: true, category: 'performance' },
    { id: 'a5', type: 'success', title: 'جذب موفق', message: 'موقعیت شغلی برنامه‌نویس ارشد با موفقیت پر شد.', date: '1403/08/11', read: true, category: 'recruitment' },
    { id: 'a6', type: 'danger', title: 'غیبت غیرموجه', message: '۳ کارمند واحد عملیات بیش از ۳ روز غیبت غیرموجه دارند.', date: '1403/08/10', read: false, category: 'attendance' },
    { id: 'a7', type: 'warning', title: 'مانده مرخصی بالا', message: '۱۲ کارمند بیش از ۱۵ روز مرخصی استفاده‌نشده دارند.', date: '1403/08/09', read: true, category: 'leave' },
    { id: 'a8', type: 'info', title: 'دوره آموزشی جدید', message: 'دوره امنیت سایبری از اول آذر شروع می‌شود.', date: '1403/08/08', read: true, category: 'training' },
  ];
}

export function generateNotifications(): Notification[] {
  return [
    { id: 'n1', type: 'warning', title: 'قرارداد رو به اتمام', message: 'قرارداد امیر رضایی تا ۵ روز دیگر پایان می‌یابد.', date: '1403/08/15', read: false },
    { id: 'n2', type: 'info', title: 'درخواست مرخصی', message: 'سارا احمدی درخواست مرخصی استحقاقی ثبت کرده است.', date: '1403/08/14', read: false },
    { id: 'n3', type: 'success', title: 'کارمند جدید', message: 'نیما کریمی به عنوان برنامه‌نویس فرانت‌اند اضافه شد.', date: '1403/08/13', read: false },
    { id: 'n4', type: 'error', title: 'ارزیابی ناقص', message: 'ارزیابی عملکرد واحد مالی هنوز تکمیل نشده است.', date: '1403/08/12', read: true },
    { id: 'n5', type: 'info', title: 'یادآوری', message: 'جلسه بررسی عملکرد ساعت ۱۴ امروز.', date: '1403/08/11', read: true },
  ];
}

export const monthlyHireData = [
  { month: 'فروردین', hires: 5, exits: 2 },
  { month: 'اردیبهشت', hires: 8, exits: 3 },
  { month: 'خرداد', hires: 6, exits: 4 },
  { month: 'تیر', hires: 10, exits: 2 },
  { month: 'مرداد', hires: 7, exits: 5 },
  { month: 'شهریور', hires: 9, exits: 3 },
  { month: 'مهر', hires: 12, exits: 4 },
  { month: 'آبان', hires: 8, exits: 6 },
];

export const attendanceTrendData = [
  { month: 'فروردین', present: 142, absent: 5, leave: 3 },
  { month: 'اردیبهشت', present: 145, absent: 3, leave: 2 },
  { month: 'خرداد', present: 140, absent: 6, leave: 4 },
  { month: 'تیر', present: 143, absent: 4, leave: 3 },
  { month: 'مرداد', present: 138, absent: 7, leave: 5 },
  { month: 'شهریور', present: 144, absent: 3, leave: 3 },
  { month: 'مهر', present: 146, absent: 2, leave: 2 },
  { month: 'آبان', present: 141, absent: 5, leave: 4 },
];

export const payrollTrendData = [
  { month: 'فروردین', total: 4200, average: 28 },
  { month: 'اردیبهشت', total: 4350, average: 29 },
  { month: 'خرداد', total: 4500, average: 29.5 },
  { month: 'تیر', total: 4600, average: 30 },
  { month: 'مرداد', total: 4750, average: 30.5 },
  { month: 'شهریور', total: 4900, average: 31 },
  { month: 'مهر', total: 5100, average: 32 },
  { month: 'آبان', total: 5250, average: 33 },
];
