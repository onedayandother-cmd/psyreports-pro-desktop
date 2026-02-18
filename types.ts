
export interface PsychReport {
  id: string;
  patientId: string;
  status: 'draft' | 'final';
  createdAt: number;
  updatedAt: number;
  sections: {
    referralReason: string;
    behavioralNotes: string;
    testResults: Array<{ name: string; score: string; interpretation: string }>;
    clinicalSummary: string;
    recommendations: string[];
  };
}

export interface SessionReport {
  id: string;
  patientId: string;
  date: string;
  sessionNumber: number;
  duration: string; // e.g., "45 min"
  subjective: string; // S: شكوى المريض وكلامه
  objective: string; // O: ملاحظات المعالج
  assessment: string; // A: تقييم الجلسة
  plan: string; // P: الخطة والواجبات
  interventions: string[]; // Techniques used (CBT, etc.)
  moodRating: number; // 1-10
  riskAssessment: 'Low' | 'Medium' | 'High';
  nextSessionDate?: string;
  isPrivate?: boolean; // For confidential notes
}

export interface User {
  id: string;
  name: string;
  role: 'admin' | 'specialist';
  specialty?: string;
  securityKey: string;
  email: string;
  avatar?: string;
  createdAt: number;
}

export interface Patient {
  id: string;
  name: string;
  gender: 'male' | 'female';
  dateOfBirth: string;
  phoneNumber: string;
  educationLevel?: string;
  referralSource?: string;
  mainComplaint?: string;
  mainComplaintEn?: string;
  emergencyContact?: {
    name: string;
    relation: string;
    phone: string;
  };
  tags: string[];
  medicalHistory: string;
  currentMedications?: string;
  birthHistory?: string;
  notes: string;
  createdAt: number;
  isEncrypted?: boolean;
  createdBy?: string; 
}

export interface BehavioralObservationData {
  id: string;
  patientId: string;
  specialistId: string;
  createdAt: number;
  appearance: {
    grooming: string;
    eyeContact: string;
    facialExpressions: string[];
    psychomotor: string;
  };
  speech: {
    rate: string;
    tone: string;
    problems: string[];
  };
  mood: {
    prevailing: string;
    congruence: string;
    anxietySigns: string[];
  };
  attention: {
    distractibility: string;
    instructions: string;
    impulsivity: string[];
  };
  social: {
    initiative: string;
    responseToName: string;
    skills: string[];
  };
  thought: {
    coherence: string;
    content: string[];
    hallucinations: string;
  };
  notes: string;
}

export interface ClinicalIntakeData {
  id: string;
  patientId: string;
  specialistId: string;
  createdAt: number;
  referral: {
    infoSource: string;
    visitReason: string[];
    mainComplaint: string;
    mainComplaintEn?: string;
  };
  hpi: {
    onsetNature: string;
    durationValue: string;
    durationUnit: string;
    course: string;
    triggers: string[];
  };
  symptoms: {
    mood: string[];
    cognitive: string[];
    behavioral: string[];
    psychotic: string[];
  };
  pastHistory: {
    chronicDiseases: string[];
    headInjuries: string;
    previousTreatment: string[];
    previousPsych: string[];
    substanceAbuse: string;
  };
  familySocial: {
    socialStatus: string;
    familyStability: string;
    geneticHistory: string[];
    consanguinity: string;
  };
  developmental?: {
    pregnancy: string;
    birth: string;
    walkingTalking: string;
    toileting: string;
  };
  functional: {
    eduLevel: string;
    academicPerformance: string;
    occupationalStability: string;
  };
  initialImpression: {
    diagnosis: string;
    diagnosisEn?: string;
    proposedPlan: string[];
    otherTests: string;
  };
}

export interface Age {
  years: number;
  months: number;
  days: number;
}

export enum AssessmentType {
  IQ = 'IQ',
  WISC = 'WISC',
  AUTISM = 'AUTISM',
  GARS = 'GARS',
  SRS = 'SRS',
  DEPRESSION = 'DEPRESSION',
  ANXIETY = 'ANXIETY',
  CONNERS = 'CONNERS',
  VANDERBILT = 'VANDERBILT',
  VINELAND = 'VINELAND',
  LANGUAGE = 'LANGUAGE',
  SUMMARY = 'SUMMARY',
  FOCUS_GAME = 'FOCUS_GAME'
}

export interface Recommendation {
  id: string;
  text: string;
  textEn?: string;
  category: 'School' | 'Home';
  type: 'Accommodation' | 'Modification';
  tags: string[];
  isFavorite?: boolean;
}

export interface Assessment {
  id: string;
  patientId: string;
  type: AssessmentType;
  testDate: string;
  rawScores: Record<string, any>;
  calculatedScores: Record<string, any>;
  clinicalObservations: string;
  clinicalObservationsEn?: string;
  aiInterpretation?: string;
  aiInterpretationEn?: string;
  suggestedDiagnosis?: string;
  suggestedDiagnosisEn?: string;
  attachmentUrl?: string; 
  attachmentName?: string;
  exportedAt?: number;
  alertTriggered?: boolean;
  createdBy?: string; 
}

export interface Appointment {
  id: string;
  patientId: string;
  userId: string; 
  date: string;
  time: string;
  type: 'session' | 'assessment' | 'followup';
  status: 'pending' | 'completed' | 'cancelled';
  notes?: string;
}

export interface UserCredits {
  balance: number;
  history: Array<{
    amount: number;
    reason: string;
    timestamp: number;
  }>;
}

export interface UserSettings {
  specialistName: string;
  clinicName: string;
  recoveryEmail: string;
  enableAi: boolean;
  theme: 'light' | 'dark';
  autoSave: boolean;
  reportHeaderEnabled: boolean;
  masterSalt: string;
}

export interface AppState {
  users: User[];
  activeUserId?: string;
  patients: Patient[];
  assessments: Assessment[];
  appointments: Appointment[];
  sessionReports: SessionReport[]; // New field
  credits: UserCredits;
  language: 'ar' | 'en';
  securityKey?: string;
  userRole: 'specialist' | 'admin';
  settings: UserSettings;
  isLocked: boolean;
  intakeForms: ClinicalIntakeData[];
  behavioralObservations: BehavioralObservationData[];
  psychReports: PsychReport[];
  clinicStats?: {
    totalRevenue: number;
    activeSpecialists: number;
  };
}
