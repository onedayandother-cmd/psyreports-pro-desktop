
import React, { useState } from 'react';
import { 
  Key, 
  ShieldAlert, 
  Plus, 
  Copy, 
  Link2, 
  MessageCircle, 
  Zap, 
  Settings,
  Database,
  RefreshCw,
  Smartphone
} from 'lucide-react';
import { generateUniversalCode, DEFAULT_SALT } from './utils';

const AdminTool: React.FC = () => {
  const [salt, setSalt] = useState(DEFAULT_SALT);
  const [targetDeviceId, setTargetDeviceId] = useState('');
  const [credits, setCredits] = useState('100');
  const [resultCode, setResultCode] = useState('');
  const [copied, setCopied] = useState(false);

  const handleGenerate = () => {
    if (!targetDeviceId.trim()) {
      alert("الرجاء إدخال رقم جهاز العميل (Device ID) أولاً.");
      return;
    }
    const code = generateUniversalCode(credits, salt, targetDeviceId);
    setResultCode(code);
    setCopied(false);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareWhatsApp = () => {
    const packageName = credits === 'INF' ? 'الباقة الشاملة' : `${credits} تقرير`;
    const text = `تفضل يا دكتور، هذا هو كود التفعيل لجهازك (${targetDeviceId}):\n\n${resultCode}\n\nهذا الكود مخصص لهذا الجهاز فقط.`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-6 font-sans" dir="rtl">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in duration-500">
        <header className="p-10 bg-gradient-to-r from-indigo-900 to-slate-900 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <ShieldAlert size={32} />
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tight">مولد التراخيص (Device Lock)</h1>
              <p className="text-indigo-300 text-xs font-bold uppercase tracking-widest">PsyReports Secure Admin</p>
            </div>
          </div>
        </header>

        <div className="p-10 space-y-6">
          <div className="space-y-4">
            <label className="flex items-center gap-2 text-xs font-black text-slate-500 uppercase mr-2">
              <Smartphone size={14} /> رقم جهاز العميل (Device ID)
            </label>
            <input 
              type="text" 
              value={targetDeviceId}
              onChange={e => setTargetDeviceId(e.target.value)}
              placeholder="مثال: DEV-X9Y2Z1"
              className="w-full bg-slate-800 border border-slate-700 p-5 rounded-2xl text-white font-mono font-black focus:ring-4 focus:ring-indigo-500/20 outline-none transition-all text-center tracking-wider"
            />
            <p className="text-[10px] text-slate-600 font-bold mr-2">اطلب من العميل نسخ الرقم الموجود في صفحة "الباقات والرصيد".</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div className="space-y-4">
               <label className="flex items-center gap-2 text-xs font-black text-slate-500 uppercase mr-2">
                 <Settings size={14} /> مفتاح التشفير (SALT)
               </label>
               <input 
                 type="text" 
                 value={salt}
                 onChange={e => setSalt(e.target.value)}
                 className="w-full bg-slate-800 border border-slate-700 p-5 rounded-2xl text-white font-black outline-none"
               />
             </div>
             <div className="space-y-4">
               <label className="text-xs font-black text-slate-500 uppercase mr-2">الرصيد</label>
               <select 
                 value={credits}
                 onChange={e => setCredits(e.target.value)}
                 className="w-full bg-slate-800 border border-slate-700 p-5 rounded-2xl text-white font-black outline-none cursor-pointer"
               >
                 <option value="10">10 تقارير</option>
                 <option value="50">50 تقرير</option>
                 <option value="100">100 تقرير</option>
                 <option value="INF">الباقة الشاملة (INF)</option>
               </select>
             </div>
          </div>

          <button 
            onClick={handleGenerate}
            className="w-full bg-indigo-600 hover:bg-indigo-500 p-5 rounded-2xl font-black shadow-xl shadow-indigo-900/40 flex items-center justify-center gap-3 transition-all active:scale-95"
          >
            <RefreshCw size={22} /> توليد كود محمي
          </button>

          {resultCode && (
            <div className="space-y-4 pt-6 border-t border-slate-800 animate-in slide-in-from-bottom">
              <div className="bg-slate-950 p-6 rounded-3xl border border-slate-800 space-y-6">
                 <div>
                    <div className="flex items-center justify-between mb-2">
                       <span className="text-[10px] font-black text-indigo-400 uppercase">الكود النشط (يعمل لمرة واحدة فقط)</span>
                       <button onClick={() => copyToClipboard(resultCode)} className="text-slate-500 hover:text-white transition-colors">
                          {copied ? <span className="text-emerald-400 text-[10px] font-black">تم النسخ!</span> : <Copy size={16} />}
                       </button>
                    </div>
                    <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 text-xs font-mono text-slate-400 break-all leading-relaxed select-all">
                      {resultCode}
                    </div>
                 </div>

                 <button 
                    onClick={shareWhatsApp}
                    className="w-full bg-emerald-600 hover:bg-emerald-500 p-4 rounded-2xl font-black flex items-center justify-center gap-2 text-sm shadow-lg shadow-emerald-950/20"
                 >
                    <MessageCircle size={18} /> إرسال للعميل
                 </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminTool;
