import React, { useState } from 'react';
import { 
  Navigation, 
  Scale, 
  CloudSun, 
  Wrench, 
  Plane, 
  Radio,
  BookOpen, 
  Brain, 
  HelpCircle, 
  Menu, 
  X,
  MessageSquare,
  Plus,
  Compass,
  Trello,
  ShieldAlert,
  Calculator,
  Layers,
  Sparkles,
  LogOut,
  Shield,
  Zap,
  Target,
  FileText,
  UserCheck,
  Lock
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { StudyTab } from '../../types';
import { getDateStatus } from '../../lib/dateUtils';
import { billingService, ADMIN_EMAIL } from '../../services/billingService';

interface ShellProps {
  children: React.ReactNode;
  activeTab: StudyTab;
  setActiveTab: (tab: StudyTab) => void;
  currentSubject: string;
  setCurrentSubject: (subject: any) => void;
  onOpenSubscription: () => void;
  userData?: any;
}

export default function Shell({ 
  children, 
  activeTab, 
  setActiveTab, 
  currentSubject,
  setCurrentSubject,
  onOpenSubscription,
  userData
}: ShellProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Default to closed on mobile
  const [isDesktopSidebarOpen, setIsDesktopSidebarOpen] = useState(true);

  const tabs: { id: StudyTab; label: string; icon: any; category: string; premium?: boolean }[] = [
    { id: 'chat', label: 'Briefing Room', icon: MessageSquare, category: 'Core' },
    { id: 'library', label: 'Knowledge Hub', icon: BookOpen, category: 'Core', premium: true },
    { id: 'briefing', label: 'Briefing Log', icon: FileText, category: 'Ground School', premium: true },
    { id: 'quiz', label: 'Practice Exam', icon: HelpCircle, category: 'Ground School', premium: true },
    { id: 'flashcards', label: 'Flashcards', icon: Layers, category: 'Ground School', premium: true },
    { id: 'meteorology', label: 'Met Intelligence', icon: CloudSun, category: 'Operational', premium: true },
    { id: 'planning', label: 'Flight Deck', icon: Calculator, category: 'Operational', premium: true },
    { id: 'logbook', label: 'Pilot Logbook', icon: Trello, category: 'Operational', premium: true },
    { id: 'id-card', label: 'Pilot ID Card', icon: Shield, category: 'Operational' },
  ];

  const subjects = [
    { id: 'nav', icon: Navigation, label: '01 AIR NAVIGATION' },
    { id: 'met', icon: CloudSun, label: '02 AIR METEOROLOGY' },
    { id: 'tech-gen', icon: Wrench, label: '03 TECHNICAL GENERAL' },
    { id: 'tech-spec', icon: Plane, label: '04 TECHNICAL SPECIFIC' },
    { id: 'radio-telephony', icon: Radio, label: '05 RADIO TELEPHONY' },
    { id: 'pof', icon: Target, label: '06 PRINCIPLES OF FLIGHT' },
    { id: 'aviation-leg', icon: Scale, label: '07 AIR REGULATION' },
    { id: 'human-performance', icon: Brain, label: '08 HUMAN PERFORMANCE' },
  ];

  const SidebarContent = ({ isExpanded }: { isExpanded: boolean }) => {
    const sub = billingService.getSubscription(userData?.email);
    const isPro = sub.isPro || userData?.email === ADMIN_EMAIL;

    return (
    <>
      <div className="p-6 flex items-center justify-between border-b border-white/10">
        {isExpanded && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-2"
          >
            <Plane className="text-blue-400" size={24} />
            <h1 className="font-black text-xl tracking-tighter">
              Airclass<span className="text-blue-400">PRO</span>
            </h1>
          </motion.div>
        )}
        <button 
          onClick={() => {
            setIsSidebarOpen(false);
            setIsDesktopSidebarOpen(!isDesktopSidebarOpen);
          }}
          className={`p-2 hover:bg-white/10 rounded-lg transition-colors hidden md:block`}
        >
          {isExpanded ? <X size={20} /> : <Menu size={20} />}
        </button>
        <button 
          onClick={() => setIsSidebarOpen(false)}
          className="p-2 hover:bg-white/10 rounded-lg transition-colors md:hidden"
        >
          <X size={20} />
        </button>
      </div>

      <div className="flex-1 px-4 space-y-2 py-4 overflow-y-auto scrollbar-hide">
        {['Core', 'Ground School', 'Operational'].map(cat => (
          <React.Fragment key={cat}>
            {isExpanded && <div className="text-[10px] font-black text-white/40 mt-6 mb-2 px-2 uppercase tracking-widest">{cat}</div>}
            {tabs.filter(t => t.category === cat).map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  if (tab.premium && !isPro) {
                    onOpenSubscription();
                    return;
                  }
                  setActiveTab(tab.id);
                  setIsSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-4 p-3 rounded-xl transition-all relative group ${
                  activeTab === tab.id 
                    ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' 
                    : 'text-white/60 hover:bg-white/5 hover:text-white'
                }`}
              >
                <tab.icon size={20} />
                {isExpanded && (
                  <div className="flex items-center justify-between flex-1">
                    <span className="font-semibold text-sm">{tab.label}</span>
                    {tab.premium && !isPro && <Lock size={12} className="text-amber-500" />}
                  </div>
                )}
              </button>
            ))}
          </React.Fragment>
        ))}

        {isExpanded && (
          <div className="mt-8 space-y-4">
            <div className="text-[10px] font-black text-white/40 px-2 uppercase tracking-widest">DGCA Subjects</div>
            <div className="grid grid-cols-1 gap-1 pb-8">
              {subjects.map((s) => (
                <button 
                  key={s.id} 
                  onClick={() => {
                    setCurrentSubject(s.id);
                    setActiveTab('chat');
                    setIsSidebarOpen(false);
                  }}
                  className={`flex items-center gap-3 p-2 px-3 rounded-lg text-xs transition-all cursor-pointer group w-full text-left ${
                    currentSubject === s.id 
                      ? 'bg-white/10 text-white' 
                      : 'text-white/60 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <s.icon size={14} className={currentSubject === s.id ? 'text-blue-400' : 'group-hover:text-blue-400'} />
                  <span className="font-medium">{s.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="p-6 border-t border-white/10 bg-black/20">
        {isExpanded && userData && (
          <div className="grid grid-cols-2 gap-2 mb-6">
            <div className="bg-white/5 p-3 rounded-xl border border-white/5">
              <p className="text-[8px] font-black uppercase text-blue-400 mb-1">Strike</p>
              <div className="flex items-center gap-1">
                <Zap size={12} className="text-amber-400" />
                <span className="text-xs font-black">{userData.streak || 0}d</span>
              </div>
            </div>
            <div className="bg-white/5 p-3 rounded-xl border border-white/5">
              <p className="text-[8px] font-black uppercase text-blue-400 mb-1">Readiness</p>
              <div className="flex items-center gap-1">
                <Target size={12} className="text-green-400" />
                <span className="text-xs font-black">{userData.readinessScore || 0}%</span>
              </div>
            </div>
            <div className="bg-white/5 p-3 rounded-xl border border-white/5 col-span-2">
              <p className="text-[8px] font-black uppercase text-blue-400 mb-2">Critical Review Areas</p>
              <div className="flex flex-wrap gap-2">
                 {['Met Theory', 'Nav Math', 'Altimetry'].map((topic, i) => (
                   <span key={i} className="px-2 py-1 bg-red-400/10 text-red-400 text-[8px] font-black uppercase rounded-lg border border-red-400/20">
                     {topic}
                   </span>
                 ))}
              </div>
            </div>
          </div>
        )}

        {isExpanded && (
          <button 
            onClick={() => {
              onOpenSubscription();
              setIsSidebarOpen(false);
            }}
            className="w-full mb-4 p-4 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center gap-3 hover:shadow-lg hover:shadow-blue-500/20 transition-all border border-white/10 group"
          >
            <div className="p-2 bg-white/20 rounded-xl group-hover:scale-110 transition-transform">
              <Sparkles size={16} className="text-white" />
            </div>
            <div className="text-left">
              <p className="text-[10px] font-black uppercase text-blue-200 leading-none mb-1">Elite Access</p>
              <p className="text-xs font-black text-white">UNLOCK COCKPITPRO</p>
            </div>
          </button>
        )}

          <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setActiveTab('id-card')}
              className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-black text-lg border-2 shadow-inner transition-all hover:scale-105 active:scale-95 ${userData ? 'bg-blue-600 border-blue-400/50' : 'bg-slate-700 border-slate-600'}`}
            >
              {userData?.name?.charAt(0) || '?'}
            </button>
            {isExpanded && (
              <div className="overflow-hidden text-left">
                <p className="font-bold text-sm truncate tracking-tight text-white">{userData?.name || 'Guest Pilot'}</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <div className={`w-1.5 h-1.5 rounded-full ${userData?.email === ADMIN_EMAIL ? 'bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,0.6)]' : 'bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]'}`} />
                  <p className={`text-[10px] font-black tracking-[0.15em] uppercase ${userData?.email === ADMIN_EMAIL ? 'text-blue-400' : 'text-green-400'}`}>
                    {userData?.email === ADMIN_EMAIL ? 'ADMIN — AIRCLASSPRO OWNER' : 'PIC ONLINE'}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
    );
  };

   const warnings = userData ? [
     { label: 'Medical Certificate', date: userData.medicalExpiry },
     { label: 'License Expiry', date: userData.licenseExpiry },
     { label: 'Flight Review', date: userData.flightReviewDate },
     { label: 'BFR', date: userData.bfrDueDate }
   ].map(item => ({ ...item, status: getDateStatus(item.date) }))
    .filter(item => (item.status.severity === 'red') || (item.status.severity === 'orange'))
   : [];

  return (
    <div className="flex h-screen bg-[#F0F4F8] font-sans text-[#1A202C] overflow-hidden">
      {/* Desktop Sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: isDesktopSidebarOpen ? 280 : 80 }}
        className="bg-[#1B263B] text-white hidden md:flex flex-col z-20 shadow-2xl shrink-0"
      >
        <SidebarContent isExpanded={isDesktopSidebarOpen} />
      </motion.aside>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSidebarOpen(false)}
              className="fixed inset-0 bg-black/60 bg-blur-sm z-[100] md:hidden"
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 bottom-0 w-[280px] bg-[#1B263B] text-white z-[101] md:hidden flex flex-col shadow-2xl"
            >
              <SidebarContent isExpanded={true} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 relative overflow-y-auto flex flex-col h-full">
        <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-[#E2E8F0] px-4 md:px-8 py-3 md:py-4 flex items-center justify-between">
           <div className="flex items-center gap-3 md:gap-4 font-space">
             <button 
               onClick={() => setIsSidebarOpen(true)}
               className="p-2 md:hidden hover:bg-slate-100 rounded-lg transition-colors"
             >
               <Menu size={20} className="text-slate-600" />
             </button>
             <div className="p-1.5 bg-blue-50 text-blue-600 rounded-md hidden md:block">
               <Compass size={16} className="animate-spin-slow" />
             </div>
             <div className="flex flex-col overflow-hidden max-w-[150px] sm:max-w-none">
               <h2 className="text-[8px] md:text-[10px] uppercase tracking-[0.2em] font-black text-gray-400 leading-none mb-1 truncate">
                 {tabs.find(t => t.id === activeTab)?.label}
               </h2>
               <p className="text-[9px] md:text-[10px] font-bold text-blue-600 uppercase tracking-widest truncate">
                 MODULE: {currentSubject.replace('-', ' ')}
               </p>
             </div>
           </div>
           
           <div className="flex items-center gap-2 md:gap-4">
             <div className="bg-[#1B263B] text-white px-3 md:px-4 py-1.5 rounded-full text-[9px] md:text-[10px] font-black flex items-center gap-2 border border-white/10 whitespace-nowrap">
               <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-green-400 animate-pulse" />
               <span className="hidden sm:inline">ALT:</span> 33,000 FT
             </div>
           </div>
        </header>

        <div className="flex-1 overflow-x-hidden">
          <div className="max-w-5xl mx-auto p-4 md:p-8">
            <AnimatePresence>
              {warnings.map((warning, idx) => (
                <motion.div
                  key={warning.label}
                  initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                  animate={{ opacity: 1, height: 'auto', marginBottom: 16 }}
                  className={`p-4 rounded-2xl border flex items-center justify-between gap-4 ${
                    warning.status.severity === 'red' 
                      ? 'bg-red-50 border-red-200 text-red-700' 
                      : 'bg-orange-50 border-orange-200 text-orange-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <ShieldAlert size={20} className={warning.status.severity === 'red' ? 'text-red-500' : 'text-orange-500'} />
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest">{warning.label} Warning</p>
                      <p className="text-sm font-bold">{warning.status.label}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setActiveTab('logbook')}
                    className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                      warning.status.severity === 'red'
                        ? 'bg-red-600 text-white hover:bg-red-700'
                        : 'bg-orange-600 text-white hover:bg-orange-700'
                    }`}
                  >
                    Update Now
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                {children}
              </motion.div>
            </AnimatePresence>
            
            {/* Copyright Footer */}
            <div className="mt-20 border-t border-slate-200 pt-8 pb-12 text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Plane size={16} className="text-slate-300" />
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">
                  AirclassPRO Dispatch
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                &copy; 2026 AirclassPRO DGCA Exam Preparation - All Rights Reserved
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

// Add some custom animation to index.css or here
// For simplicity I'll skip it unless I need complex ones. 
// Standard lucide icons spinning slow:
// .animate-spin-slow { animation: spin 8s linear infinite; }
