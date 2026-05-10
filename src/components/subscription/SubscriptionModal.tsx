import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Check, 
  X, 
  Sparkles, 
  ShieldCheck, 
  Zap, 
  Lock, 
  Loader2,
  Trophy,
  Calendar,
  Clock,
  ArrowRight,
  ShieldAlert
} from 'lucide-react';
import { AIRCLASSPRO_PLANS, billingService, ADMIN_EMAIL } from '../../services/billingService';

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  userEmail?: string | null;
}

export default function SubscriptionModal({ isOpen, onClose, userEmail }: SubscriptionModalProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [step, setStep] = useState<'selection' | 'trial-info' | 'success'>('selection');
  const [selectedPlan, setSelectedPlan] = useState(AIRCLASSPRO_PLANS[1]);

  const isAdmin = userEmail === ADMIN_EMAIL;

  const handleStartTrialRequest = () => {
    if (isAdmin) return;
    setStep('trial-info');
  };

  const handlePayNow = async () => {
    if (isAdmin) return;
    setIsProcessing(true);
    try {
      // Simulate starting the trial locally so they get immediate access in the demo
      await billingService.startTrial(selectedPlan.id);
      // Open Razorpay in new tab
      await billingService.startCheckoutSession(selectedPlan.id);
      setStep('success');
    } finally {
      setIsProcessing(false);
    }
  };

  const features = [
    "All DGCA subjects & materials",
    "Live weather & METAR details",
    "Practice Exam Test Series",
    "Digital Flight Briefing Log",
    "Smart Pilot Logbook",
    "Pre-flight Checklist Hub"
  ];

  if (!isOpen) return null;

  if (isAdmin) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-4 bg-[#0a0f18]/90 backdrop-blur-xl">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-[#0a0f18] w-full max-w-xl rounded-[3rem] p-8 md:p-14 text-center shadow-2xl relative overflow-hidden border border-white/5"
        >
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-blue-600/10 blur-[100px] pointer-events-none" />
           <div className="relative z-10">
              <button 
                onClick={onClose}
                className="absolute -top-4 -right-4 p-2 hover:bg-white/10 rounded-full transition-colors text-white/40"
              >
                <X size={20} />
              </button>
              <div className="w-20 h-20 bg-blue-600 text-white rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-lg shadow-blue-600/40 transform -rotate-6">
                <Sparkles size={40} />
              </div>
              
              <h2 className="text-2xl md:text-3xl font-black mb-4 tracking-tighter text-white uppercase italic leading-none">
                WELCOME <span className="text-blue-500">ADMIN!</span>
              </h2>
              
              <div className="bg-slate-900 border border-white/10 p-8 rounded-[2.5rem] mb-8 text-left">
                <p className="text-sm md:text-base text-white/90 font-bold italic leading-relaxed mb-6 italic">
                  "Welcome Admin! You have permanent free access to AirclassPRO. No payment required."
                </p>
                <div className="space-y-3">
                  {[
                    "Owner: harkeeratn02@gmail.com",
                    "Status: Lifetime Unlimited Access",
                    "Mode: Administrator Control Mode"
                  ].map((text, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full bg-blue-500/20 flex items-center justify-center">
                        <Check size={12} className="text-blue-400" />
                      </div>
                      <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{text}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button 
                  onClick={onClose}
                  className="w-full py-5 bg-blue-600 text-white rounded-[2rem] font-black uppercase tracking-widest text-xs hover:bg-white hover:text-slate-950 transition-all shadow-xl"
              >
                Welcome aboard Captain!
              </button>
           </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-4 bg-[#0a0f18]/90 backdrop-blur-xl overflow-y-auto">
      <AnimatePresence mode="wait">
        {step === 'selection' ? (
          <motion.div 
            key="selection"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            className="bg-white w-full max-w-5xl rounded-[2.5rem] md:rounded-[3.5rem] shadow-2xl overflow-hidden flex flex-col md:flex-row my-auto border border-white/10"
          >
            {/* Left: Branding */}
            <div className="md:w-5/12 bg-slate-950 p-8 md:p-12 text-white flex flex-col justify-between shrink-0 relative overflow-hidden">
               {/* Ambient Background */}
               <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/20 blur-[100px] -mr-32 -mt-32" />
               <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 blur-[100px] -ml-32 -mb-32" />
               
               <div className="relative z-10">
                <div className="p-3 bg-blue-600 w-fit rounded-2xl mb-8 shadow-lg shadow-blue-600/40">
                  <Sparkles size={28} className="text-white" />
                </div>
                <h2 className="text-3xl md:text-5xl font-black tracking-tighter leading-tight mb-6 uppercase italic">
                  FLY WITH<br />
                  <span className="text-blue-500">AIRCLASS PRO</span>
                </h2>
                <div className="space-y-4 mt-8">
                   {features.map((f, i) => (
                     <div key={i} className="flex items-center gap-3">
                       <div className="w-5 h-5 rounded-full bg-blue-600/20 flex items-center justify-center">
                        <Check size={12} className="text-blue-400" />
                       </div>
                       <span className="text-xs md:text-sm font-bold text-slate-300">{f}</span>
                     </div>
                   ))}
                </div>
              </div>
              
              <div className="relative z-10 mt-12 p-6 bg-white/5 rounded-3xl border border-white/10">
                 <div className="flex items-center gap-3 mb-2">
                   <ShieldCheck size={20} className="text-blue-400" />
                   <p className="text-[10px] font-black uppercase text-blue-400 tracking-widest">Premium Guarantee</p>
                 </div>
                 <p className="text-[11px] font-medium text-slate-400">Join 500+ student pilots preparing for their DGCA exams with AirclassPRO.</p>
              </div>
            </div>

            {/* Right: Plan Selection */}
            <div className="md:w-7/12 p-8 md:p-14 relative bg-gray-50 flex flex-col h-full overflow-y-auto">
               <button 
                 onClick={onClose}
                 className="absolute top-6 right-6 md:top-10 md:right-10 p-2 hover:bg-gray-200 rounded-full transition-colors text-gray-400 z-10"
               >
                 <X size={20} />
               </button>

               <div className="mb-10">
                <h3 className="text-2xl font-black text-slate-900 mb-2 uppercase italic tracking-tight underline decoration-blue-500 decoration-4 underline-offset-8">Choose Your Membership</h3>
                <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mt-4">Unrestricted access. No hidden fees.</p>
               </div>

               <div className="grid gap-4 mb-10">
                  {AIRCLASSPRO_PLANS.map((plan) => (
                    <button
                      key={plan.id}
                      onClick={() => setSelectedPlan(plan)}
                      className={`p-6 rounded-[2rem] border-2 transition-all flex items-center justify-between group relative overflow-hidden ${
                        selectedPlan.id === plan.id 
                        ? 'bg-white border-blue-600 shadow-2xl scale-[1.02] z-10' 
                        : 'bg-white border-gray-100 hover:border-blue-200'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors shrink-0 ${
                          selectedPlan.id === plan.id ? 'border-blue-600 bg-blue-600' : 'border-gray-200'
                        }`}>
                          {selectedPlan.id === plan.id && <Check size={14} className="text-white" />}
                        </div>
                        <div className="text-left">
                          <div className="flex items-center gap-2 mb-0.5">
                            <p className="text-sm font-black text-slate-900 uppercase italic">{plan.name}</p>
                            {plan.tag && (
                              <span className="px-2 py-0.5 bg-blue-600 text-white text-[8px] font-black uppercase rounded-full">
                                {plan.tag}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">{plan.description}</p>
                            <span className="w-1 h-1 bg-gray-300 rounded-full" />
                            <p className="text-[10px] text-blue-600 font-black uppercase tabular-nums">3 Day Free Trial</p>
                          </div>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="flex items-baseline justify-end gap-1">
                          <span className="text-2xl font-black text-slate-900">₹{plan.displayPrice}</span>
                          <span className="text-[10px] font-bold text-gray-400 uppercase">/{plan.interval === '6 months' ? '6m' : plan.interval === 'month' ? 'mo' : 'yr'}</span>
                        </div>
                      </div>
                    </button>
                  ))}
               </div>

               <div className="space-y-4 mt-auto">
                 <button 
                    onClick={handleStartTrialRequest}
                    className="w-full py-5 bg-slate-950 text-white rounded-[2rem] font-black uppercase tracking-[0.2em] text-xs flex items-center justify-center gap-3 hover:bg-blue-600 transition-all shadow-2xl group"
                 >
                    <Zap size={18} fill="currentColor" className="group-hover:scale-125 transition-transform" />
                    START 3 DAY FREE TRIAL
                    <ArrowRight size={18} className="opacity-50 group-hover:translate-x-1 transition-transform" />
                 </button>
                 <div className="flex justify-center items-center gap-6 opacity-40 py-2">
                    <div className="flex items-center gap-2">
                      <Lock size={12} />
                      <p className="text-[9px] font-black uppercase tracking-widest">SECURE PAYMENT</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <ShieldCheck size={12} />
                      <p className="text-[9px] font-black uppercase tracking-widest">CANCEL ANYTIME</p>
                    </div>
                 </div>
               </div>
            </div>
          </motion.div>
        ) : step === 'trial-info' ? (
          <motion.div 
            key="trial-info"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white w-full max-w-lg rounded-[3rem] shadow-2xl relative overflow-hidden"
          >
             <div className="p-8 md:p-12 text-center">
                <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Calendar size={32} />
                </div>
                <h2 className="text-2xl font-black text-slate-900 mb-2 uppercase italic tracking-tight underline decoration-blue-500 decoration-2 underline-offset-4">START YOUR 3 DAY TRIAL</h2>
                <p className="text-sm text-slate-500 font-bold mb-8">No charge during the first 3 days.</p>
                
                <div className="space-y-4 text-left bg-slate-50 p-6 rounded-[2rem] border border-slate-100 mb-8">
                  {[
                    "Full access for 3 days free",
                    "Cancel anytime before day 3",
                    "No charge today",
                    "Automatic payment after trial"
                  ].map((text, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center">
                        <Check size={12} className="text-green-600" />
                      </div>
                      <span className="text-xs font-bold text-slate-700">{text}</span>
                    </div>
                  ))}
                </div>

                <div className="bg-slate-900 p-6 rounded-[2rem] text-white mb-8">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">ENTER PAYMENT DETAILS TO START YOUR FREE TRIAL NOW</p>
                  <p className="text-lg font-black text-blue-400 italic">via Razorpay Secure checkout</p>
                </div>

                <div className="flex flex-col gap-3">
                  <button 
                    onClick={handlePayNow}
                    disabled={isProcessing}
                    className="w-full py-5 bg-blue-600 text-white rounded-[2rem] font-black uppercase tracking-[0.2em] text-xs flex items-center justify-center gap-3 hover:bg-slate-900 transition-all shadow-xl"
                  >
                    {isProcessing ? (
                      <Loader2 size={20} className="animate-spin" />
                    ) : (
                      <>PAY NOW & START TRIAL</>
                    )}
                  </button>
                  <button 
                    onClick={() => setStep('selection')}
                    className="py-3 text-[10px] font-black uppercase text-slate-400 hover:text-slate-900 transition-colors"
                  >
                    Go Back
                  </button>
                </div>
             </div>
          </motion.div>
        ) : (
          <motion.div 
            key="success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[#0a0f18] w-full max-w-xl rounded-[3rem] p-8 md:p-14 text-center shadow-2xl relative overflow-hidden border border-white/5"
          >
             {/* Background Glow */}
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-blue-600/10 blur-[100px] pointer-events-none" />

             <div className="relative z-10">
                <div className="w-20 h-20 bg-blue-600 text-white rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-lg shadow-blue-600/40 transform -rotate-6">
                  <Trophy size={40} />
                </div>
                
                <h2 className="text-2xl md:text-4xl font-black mb-4 tracking-tighter text-white uppercase italic leading-none">
                  WELCOME TO <br />
                  <span className="text-blue-500">AIRCLASS PRO! ✈️</span>
                </h2>
                
                <p className="text-lg text-blue-400 font-bold italic mb-8">Your 3 day free trial has started!</p>

                <div className="grid grid-cols-2 gap-3 mb-8">
                  {[
                    "All DGCA subjects",
                    "Live METAR weather",
                    "Practice exams",
                    "Flight briefing log",
                    "Pilot logbook",
                    "Pre flight checklist"
                  ].map((f, i) => (
                    <div key={i} className="flex items-center gap-2 bg-white/5 p-3 rounded-xl border border-white/5">
                      <Check size={14} className="text-green-400" />
                      <span className="text-[10px] text-slate-300 font-black uppercase">{f}</span>
                    </div>
                  ))}
                </div>

                <div className="bg-slate-900/50 border border-white/10 p-6 rounded-[2rem] mb-8">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center justify-center gap-2">
                    <Clock size={14} className="text-blue-400" /> 
                    Free trial ends in:
                  </p>
                  <TrialCountdown />
                </div>

                <div className="p-4 bg-orange-500/10 border border-orange-500/20 rounded-2xl mb-8">
                  <div className="flex items-center gap-3 mb-1">
                    <ShieldAlert size={14} className="text-orange-500" />
                    <p className="text-[9px] font-black text-orange-500 uppercase tracking-widest text-left">Automatic Payment Notice</p>
                  </div>
                  <p className="text-[10px] text-slate-400 text-left leading-relaxed">
                    You will be charged automatically after trial. Cancel anytime before trial ends to avoid charges.
                  </p>
                </div>

                <button 
                    onClick={onClose}
                    className="w-full py-5 bg-blue-600 text-white rounded-[2rem] font-black uppercase tracking-widest text-xs hover:bg-white hover:text-slate-950 transition-all shadow-xl"
                >
                  Welcome aboard Captain!
                </button>
             </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function TrialCountdown() {
  const [timeLeft, setTimeLeft] = useState({
    days: 3,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    // In a real app, we'd calculate difference from billingService trialEndsAt
    // For the UI demonstration, we just show 3 days starting
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        if (prev.days > 0) return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        return prev;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex justify-center gap-4">
      {[
        { label: 'Days', val: timeLeft.days },
        { label: 'Hrs', val: timeLeft.hours },
        { label: 'Min', val: timeLeft.minutes }
      ].map((item, i) => (
        <div key={i} className="text-center min-w-[60px]">
          <p className="text-3xl font-black text-white tabular-nums">{item.val.toString().padStart(2, '0')}</p>
          <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{item.label}</p>
        </div>
      ))}
    </div>
  );
}
