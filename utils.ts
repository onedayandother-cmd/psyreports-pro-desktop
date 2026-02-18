
import { Age, Assessment, AssessmentType } from './types';

export const DEFAULT_SALT = "PSY_PRO_SECRET_2024";

export const calculateAge = (dob: string, testDate: string): Age => {
  const birthDate = new Date(dob);
  const examDate = new Date(testDate);
  let years = examDate.getFullYear() - birthDate.getFullYear();
  let months = examDate.getMonth() - birthDate.getMonth();
  let days = examDate.getDate() - birthDate.getDate();

  if (days < 0) {
    months--;
    const lastMonth = new Date(examDate.getFullYear(), examDate.getMonth(), 0);
    days += lastMonth.getDate();
  }
  if (months < 0) {
    years--;
    months += 12;
  }
  return { years, months, days };
};

export const formatAge = (age: Age, lang: 'ar' | 'en'): string => {
  if (lang === 'ar') {
    return `${age.years} سنة، ${age.months} شهر، ${age.days} يوم`;
  }
  return `${age.years} Years, ${age.months} Months, ${age.days} Days`;
};

export const generateId = () => Math.random().toString(36).substr(2, 9);

/**
 * تصنيف درجات الذكاء المعيارية بناءً على منحنى التوزيع الطبيعي
 * Mean = 100, SD = 15
 */
export const getIQClassification = (stdScore: number): { label: string, color: string } => {
  if (stdScore >= 130) return { label: 'مرتفع جداً (متفوق للغاية)', color: 'text-indigo-600' };
  if (stdScore >= 120) return { label: 'مرتفع (متفوق)', color: 'text-blue-600' };
  if (stdScore >= 110) return { label: 'متوسط مرتفع', color: 'text-emerald-600' };
  if (stdScore >= 90) return { label: 'متوسط', color: 'text-slate-900' };
  if (stdScore >= 80) return { label: 'متوسط منخفض', color: 'text-amber-600' };
  if (stdScore >= 70) return { label: 'حدودي (Borderline)', color: 'text-orange-600' };
  return { label: 'منخفض جداً (تأخر ذهني محتمل)', color: 'text-rose-600' };
};

/**
 * حساب الرتبة المئوية التقريبية (Percentile Rank) بناءً على الدرجة المعيارية
 */
export const calculatePercentile = (stdScore: number): number => {
  // تقريب حسابي للرتبة المئوية بناءً على z-score
  const z = (stdScore - 100) / 15;
  const percentile = (1 / (1 + Math.exp(-0.07056 * Math.pow(z, 3) - 1.5976 * z))) * 100;
  return Math.round(percentile * 10) / 10;
};

export const getDeviceId = () => {
  let id = localStorage.getItem('psyreports_device_id');
  if (!id) {
    id = 'DEV-' + Math.random().toString(36).toUpperCase().substr(2, 6);
    localStorage.setItem('psyreports_device_id', id);
  }
  return id;
};

export const checkRelapseRisk = (current: Assessment, history: Assessment[]): boolean => {
  const typesToWatch = [AssessmentType.DEPRESSION];
  if (!typesToWatch.includes(current.type)) return false;
  const previousTests = history
    .filter(a => a.type === current.type)
    .sort((a, b) => new Date(b.testDate).getTime() - new Date(a.testDate).getTime());
  if (previousTests.length === 0) return false;
  const scoreField = 'bdi_total';
  const lastScore = previousTests[0].rawScores[scoreField] || 0;
  const currentScore = current.rawScores[scoreField] || 0;
  return currentScore > lastScore * 1.20;
};

export const getPatientFusionContext = (assessments: Assessment[]): string => {
  if (assessments.length === 0) return "لا توجد تقييمات سابقة.";
  return assessments.slice(0, 5).map(a => {
    const scores = Object.entries(a.rawScores).map(([k,v]) => `${k}: ${v}`).join(', ');
    return `- اختبار ${a.type} بتاريخ ${a.testDate}: درجاته (${scores}). التوصية: ${a.suggestedDiagnosis || 'لا يوجد'}`;
  }).join('\n');
};

export const getDaysInMonth = (year: number, month: number): number => {
  return new Date(year, month + 1, 0).getDate();
};

/**
 * توليد كود تفعيل مرتبط بجهاز محدد
 * الصيغة: CREDITS:SALT:DEVICE_ID:RANDOM_NONCE
 * يتم تشفيره بـ Base64
 */
export const generateUniversalCode = (credits: string, salt: string, targetDeviceId: string): string => {
  const nonce = Math.random().toString(36).substring(2, 6).toUpperCase();
  // Normalize ID (uppercase, trim)
  const cleanDevice = targetDeviceId.trim().toUpperCase();
  const payload = `${credits}:${salt}:${cleanDevice}:${nonce}`;
  return btoa(payload).replace(/=/g, ''); 
};

/**
 * التحقق من صحة كود التفعيل وفك التشفير مع التحقق من الجهاز
 */
export const validateUniversalCode = (code: string, salt: string, currentDeviceId: string): number | null => {
  try {
    // Add padding if missing
    let base64 = code;
    while (base64.length % 4) {
      base64 += '=';
    }
    
    const decoded = atob(base64);
    const parts = decoded.split(':');
    
    // Legacy support (Old format was credits-salt or credits:salt:random)
    // We are deprecating generic codes for strict device locking, but keeping logic prevents crash
    if (parts.length < 3) return null;

    // Strict V3 Format: CREDITS:SALT:DEVICE_ID:NONCE
    if (parts.length === 4) {
        const [c, s, d, n] = parts;
        if (s !== salt) return null;
        if (d !== currentDeviceId.toUpperCase()) return null; // Device Mismatch
        return c === 'INF' ? Infinity : parseInt(c);
    }
    
    // Fallback for V2 (Credits:Salt:Nonce) - Optional: Disable this if you want STRICT device lock only
    // To enforce STRICT device lock, remove the block below.
    // For now, let's enforce strict device lock for new codes.
    return null; 
    
  } catch (e) {
    return null;
  }
};
