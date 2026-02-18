
import React, { useState, useEffect } from 'react';
import { AppState, Patient, Assessment, UserCredits, Appointment, User as UserType, ClinicalIntakeData, BehavioralObservationData, PsychReport, SessionReport } from './types';
import Layout from './components/Layout.tsx';
import Dashboard from './components/Dashboard.tsx';
import PatientManager from './components/PatientManager.tsx';
import AssessmentForm from './components/AssessmentForm.tsx';
import Billing from './components/Billing.tsx';
import Calendar from './components/Calendar.tsx';
import SettingsPanel from './components/SettingsPanel.tsx';
import UserManager from './components/UserManager.tsx';
import DiagnosticChecker from './components/DiagnosticChecker.tsx';
import RecommendationEngine from './components/RecommendationEngine.tsx';
import ClinicalIntake from './components/ClinicalIntake.tsx';
import BehavioralObservation from './components/BehavioralObservation.tsx';
import FinalReportManager from './components/FinalReportManager.tsx';
import ReportMaker from './components/ReportMaker.tsx';
import SessionRecorder from './components/SessionRecorder.tsx';
import { LogOut } from 'lucide-react';
import { DEFAULT_SALT } from './utils.ts';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>(() => {
    try {
        const saved = localStorage.getItem('psyreports_state_v5');
        if (saved) {
            const parsed = JSON.parse(saved);
            // Verify critical structure to prevent crash
            if (!parsed.settings || !parsed.users) return getInitialState();
            return parsed;
        }
    } catch (e) {
        console.error("Failed to load state", e);
    }
    return getInitialState();
  });

  function getInitialState(): AppState {
      return {
        users: [],
        activeUserId: undefined,
        patients: [],
        assessments: [],
        appointments: [],
        sessionReports: [], 
        credits: { balance: 3, history: [] },
        language: 'ar',
        userRole: 'admin',
        settings: {
            specialistName: 'Clinic Specialist',
            clinicName: 'Mental Health Center',
            recoveryEmail: '',
            enableAi: true,
            theme: 'dark',
            autoSave: true,
            reportHeaderEnabled: true,
            masterSalt: DEFAULT_SALT
        },
        isLocked: false,
        intakeForms: [],
        behavioralObservations: [],
        psychReports: []
      };
  }

  const [activeTab, setActiveTab] = useState('dashboard');

  useEffect(() => {
    if (state.settings.theme === 'dark') document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
    
    try {
        localStorage.setItem('psyreports_state_v5', JSON.stringify(state));
    } catch (e) {
        console.error("Failed to save state", e);
    }
  }, [state]);

  const toggleLanguage = () => {
    setState(prev => ({ ...prev, language: prev.language === 'ar' ? 'en' : 'ar' }));
  };

  const activeUser = state.users.find(u => u.id === state.activeUserId);

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'dashboard': return <Dashboard state={state} />;
      case 'patients': return <PatientManager language={state.language} patients={state.patients} assessments={state.assessments} onAdd={p => setState(prev => ({...prev, patients: [p, ...prev.patients]}))} onUpdate={p => setState(prev => ({...prev, patients: prev.patients.map(x => x.id === p.id ? p : x)}))} onDelete={id => setState(prev => ({...prev, patients: prev.patients.filter(x => x.id !== id)}))} />;
      case 'intake': return <ClinicalIntake language={state.language} patients={state.patients} onSave={i => setState(prev => ({...prev, intakeForms: [i, ...prev.intakeForms]}))} />;
      case 'observation': return <BehavioralObservation language={state.language} patients={state.patients} onSave={o => setState(prev => ({...prev, behavioralObservations: [o, ...prev.behavioralObservations]}))} />;
      case 'sessions': return <SessionRecorder language={state.language} patients={state.patients} sessionReports={state.sessionReports} onSave={s => setState(prev => ({...prev, sessionReports: [s, ...prev.sessionReports]}))} />;
      case 'assessments': return <AssessmentForm language={state.language} patients={state.patients} history={state.assessments} currentCredits={state.credits.balance} onSave={a => setState(prev => ({...prev, assessments: [a, ...prev.assessments]}))} />;
      case 'diagnostic_checker': return <DiagnosticChecker language={state.language} />;
      case 'recommendations': return <RecommendationEngine language={state.language} />;
      case 'report_maker': return <ReportMaker language={state.language} patients={state.patients} intakeForms={state.intakeForms} observations={state.behavioralObservations} assessments={state.assessments} reports={state.psychReports} onSaveReport={r => setState(prev => ({...prev, psychReports: [r, ...prev.psychReports]}))} />;
      case 'final_report': return <FinalReportManager language={state.language} patients={state.patients} intakeForms={state.intakeForms} observations={state.behavioralObservations} assessments={state.assessments} />;
      case 'calendar': return <Calendar language={state.language} patients={state.patients} appointments={state.appointments} onAddAppointment={a => setState(prev => ({...prev, appointments: [a, ...prev.appointments]}))} />;
      case 'billing': return <Billing language={state.language} credits={state.credits} onPurchase={async a => setState(prev => ({...prev, credits: { ...prev.credits, balance: prev.credits.balance + a }}))} isAdmin={state.userRole === 'admin'} />;
      case 'settings': return <SettingsPanel language={state.language} settings={state.settings} onUpdate={s => setState(prev => ({...prev, settings: {...prev.settings, ...s}}))} isAdmin={state.userRole === 'admin'} onExport={() => {}} onImport={() => {}} />;
      case 'users': return <UserManager users={state.users} onAddUser={u => setState(prev => ({...prev, users: [...prev.users, u]}))} onDeleteUser={id => setState(prev => ({...prev, users: prev.users.filter(x => x.id !== id)}))} currentUserRole={state.userRole} />;
      default: return <Dashboard state={state} />;
    }
  };

  return (
    <Layout
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      credits={state.credits.balance >= 9999 ? '∞' : state.credits.balance}
      userRole={state.userRole}
      userName={activeUser?.name || state.settings.specialistName}
      theme={state.settings.theme}
      language={state.language}
      onThemeToggle={() => setState(prev => ({...prev, settings: {...prev.settings, theme: prev.settings.theme === 'light' ? 'dark' : 'light'}}))}
      onLanguageToggle={toggleLanguage}
    >
      <div className={`fixed bottom-8 ${state.language === 'ar' ? 'left-8' : 'right-8'} z-[60] no-print`}>
        <button 
          onClick={() => setState(prev => ({ ...prev, isLocked: true, activeUserId: undefined }))} 
          className="glass-widget p-5 rounded-[2rem] text-slate-400 hover:text-rose-500 shadow-2xl active:scale-90"
        >
          <LogOut size={24} />
        </button>
      </div>
      {renderActiveTab()}
    </Layout>
  );
};

export default App;
