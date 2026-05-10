import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Summary, StudyMaterial, CheatSheetItem } from '../../types';
import { RotateCcw, ChevronLeft, ChevronRight, Layers, BrainCircuit, Sparkles, CheckCircle2, XCircle, Trophy, Loader2 } from 'lucide-react';
import { generateAIFlashcards } from '../../services/aiConsultantService';

interface FlashcardViewProps {
  summary?: Summary;
  history?: StudyMaterial[];
  isLoading: boolean;
}

export default function FlashcardView({ summary, history = [], isLoading }: FlashcardViewProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [sessionStats, setSessionStats] = useState({ known: 0, total: 0 });
  const [gradedCards, setGradedCards] = useState<Record<number, 'known' | 'learning'>>({});
  const [aiDecks, setAiDecks] = useState<CheatSheetItem[]>([]);
  const [genQuery, setGenQuery] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  // Combine original summary cards with AI generated ones
  const allCards = [...(summary?.cheatSheet || []), ...aiDecks];

  useEffect(() => {
    // Reset index when summary changes
    setCurrentIndex(0);
    setIsFlipped(false);
    setGradedCards({});
    setSessionStats({ known: 0, total: 0 });
  }, [summary, aiDecks]);

  const handleGenerate = async () => {
    if (!genQuery.trim()) return;
    setIsGenerating(true);
    const newCards = await generateAIFlashcards("Aviation General", genQuery);
    if (newCards.length > 0) {
      const formatted = newCards.map(c => ({ term: c.front, definition: c.back }));
      setAiDecks(prev => [...formatted, ...prev]);
      setGenQuery('');
    }
    setIsGenerating(false);
  };

  if (isLoading) {
    return <div className="h-96 bg-gray-100 animate-pulse rounded-[2rem]" />;
  }

  if (allCards.length === 0) {
    return (
      <div className="space-y-8">
        <div className="text-center py-20 bg-white rounded-[2rem] border-2 border-dashed border-gray-200">
          <Layers className="mx-auto text-gray-200 mb-4" size={48} />
          <p className="text-gray-400 font-bold uppercase tracking-widest text-xs mb-6">No Flashcards Available</p>
          <div className="max-w-xs mx-auto">
             <div className="relative">
                <input 
                  type="text" 
                  value={genQuery}
                  onChange={(e) => setGenQuery(e.target.value)}
                  placeholder="Enter chapter (e.g. Altimetry)"
                  className="w-full pl-4 pr-12 py-3 bg-gray-50 rounded-xl border border-gray-100 focus:border-blue-500 focus:outline-none text-xs font-bold"
                />
                <button 
                  onClick={handleGenerate}
                  disabled={isGenerating}
                  className="absolute right-2 top-2 p-1.5 bg-blue-600 text-white rounded-lg hover:bg-black transition-all"
                >
                  {isGenerating ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
                </button>
             </div>
          </div>
        </div>
      </div>
    );
  }

  const currentCard = allCards[currentIndex];
  const isCorrect = gradedCards[currentIndex] === 'known';
  const isIncorrect = gradedCards[currentIndex] === 'learning';

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % allCards.length);
    setIsFlipped(false);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + allCards.length) % allCards.length);
    setIsFlipped(false);
  };

  const markCard = (status: 'known' | 'learning') => {
    if (gradedCards[currentIndex]) return; // Only grade once per card per session

    setGradedCards(prev => ({ ...prev, [currentIndex]: status }));
    setSessionStats(prev => ({
      total: prev.total + 1,
      known: status === 'known' ? prev.known + 1 : prev.known
    }));
    
    // Auto flip back if it was flipped
    setIsFlipped(false);
    // Brief delay before moving to next card
    setTimeout(() => {
      handleNext();
    }, 400);
  };

  return (
    <div className="grid lg:grid-cols-[1fr,320px] xl:grid-cols-[1fr,350px] gap-6 md:gap-8 pb-12">
      <div className="space-y-6 md:space-y-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
          <div>
            <span className="text-[10px] font-black tracking-[0.4em] text-blue-500 uppercase">AirclassPRO Active Recall</span>
            <h3 className="text-xl md:text-2xl font-black mt-1 md:mt-2">Drill Center</h3>
          </div>
          <div className="flex gap-4 w-full sm:w-auto">
             <div className="bg-white px-4 md:px-6 py-2 md:py-3 rounded-xl md:rounded-2xl border border-gray-100 shadow-sm flex items-center gap-3 w-full sm:w-auto">
                <Trophy size={16} className="text-orange-500" />
                <div>
                   <p className="text-[8px] font-black text-gray-400 uppercase">Current Score</p>
                   <p className="text-xs md:text-sm font-black">{sessionStats.known} / {sessionStats.total}</p>
                </div>
             </div>
          </div>
        </div>

        <div 
          className="relative h-[320px] md:h-[400px] perspective-1000 cursor-pointer group"
          onClick={() => setIsFlipped(!isFlipped)}
        >
          <motion.div
             className="w-full h-full relative preserve-3d"
             initial={false}
             animate={{ rotateY: isFlipped ? 180 : 0 }}
             transition={{ duration: 0.6, type: 'spring', stiffness: 260, damping: 20 }}
          >
            {/* Front */}
            <div className={`absolute inset-0 backface-hidden bg-white rounded-[2rem] md:rounded-[3rem] border-4 ${isCorrect ? 'border-green-100' : isIncorrect ? 'border-red-100' : 'border-blue-50'} shadow-2xl flex flex-col items-center justify-center p-8 md:p-12 text-center overflow-hidden transition-colors`}>
               <div className="absolute top-0 right-0 p-8 opacity-5">
                  <Layers size={100} className="md:w-[120px] md:h-[120px]" />
               </div>
               <p className="text-[8px] md:text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 md:mb-6">TERM / CONCEPT</p>
               <h4 className="text-xl md:text-3xl font-black text-blue-600 tracking-tight leading-tight px-4">{currentCard.term}</h4>
               
               <div className="mt-8 md:mt-12 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                 <div className="text-[10px] font-bold text-gray-300 border border-gray-100 px-4 py-2 rounded-full">
                    TAP TO REVEAL
                 </div>
               </div>
               
               {gradedCards[currentIndex] && (
                 <div className={`mt-4 flex items-center gap-2 text-[10px] md:text-xs font-black uppercase ${isCorrect ? 'text-green-500' : 'text-red-500'}`}>
                    {isCorrect ? <CheckCircle2 size={12}/> : <XCircle size={12}/>}
                    {isCorrect ? 'Mastered' : 'Learning'}
                 </div>
               )}
            </div>

            {/* Back */}
            <div 
              className="absolute inset-0 backface-hidden bg-slate-900 rounded-[2rem] md:rounded-[3rem] border-4 border-blue-900 shadow-2xl flex flex-col items-center justify-center p-8 md:p-12 text-center text-white rotate-y-180"
            >
               <p className="text-[8px] md:text-[10px] font-black text-blue-400 uppercase tracking-widest mb-4 md:mb-6">OPERATIONAL MEANING</p>
               <p className="text-sm md:text-xl font-medium leading-relaxed italic px-4">{currentCard.definition}</p>
               <div className="mt-8 md:mt-12 text-[10px] md:text-xs font-bold text-white/20 border border-white/10 px-4 py-2 rounded-full">
                  TAP TO HIDE
               </div>
            </div>
          </motion.div>
        </div>

        <div className="flex flex-col gap-4 md:gap-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
             <button 
               onClick={(e) => { e.stopPropagation(); markCard('learning'); }}
               className="py-3 md:py-4 bg-white border border-red-100 text-red-500 rounded-xl md:rounded-2xl flex items-center justify-center gap-2 hover:bg-red-50 transition-all font-black text-[10px] md:text-xs uppercase tracking-widest"
             >
                <XCircle size={16} className="md:w-[18px] md:h-[18px]" /> I Don't Know
             </button>
             <button 
               onClick={(e) => { e.stopPropagation(); markCard('known'); }}
               className="py-3 md:py-4 bg-green-500 text-white rounded-xl md:rounded-2xl flex items-center justify-center gap-2 hover:bg-green-600 transition-all font-black text-[10px] md:text-xs uppercase tracking-widest shadow-lg shadow-green-200"
             >
                <CheckCircle2 size={16} className="md:w-[18px] md:h-[18px]" /> I Know This
             </button>
          </div>

          <div className="flex items-center justify-between px-2 md:px-4">
            <button 
              onClick={(e) => { e.stopPropagation(); handlePrev(); }}
              className="p-3 md:p-4 bg-white text-gray-400 rounded-xl md:rounded-2xl hover:text-blue-600 shadow-sm border border-gray-100 transition-all"
            >
              <ChevronLeft size={20} className="md:w-6 md:h-6" />
            </button>
            
            <div className="flex flex-col items-center gap-2">
              <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest bg-gray-50 px-4 md:px-6 py-1.5 md:py-2 rounded-full">
                {currentIndex + 1} / {allCards.length}
              </div>
              <div className="w-24 md:w-32 h-1 bg-gray-100 rounded-full overflow-hidden">
                 <div 
                   className="h-full bg-blue-500 transition-all duration-500" 
                   style={{ width: `${((currentIndex + 1) / allCards.length) * 100}%` }}
                 />
              </div>
            </div>

            <button 
              onClick={(e) => { e.stopPropagation(); handleNext(); }}
              className="p-3 md:p-4 bg-white text-gray-400 rounded-xl md:rounded-2xl hover:text-blue-600 shadow-sm border border-gray-100 transition-all"
            >
              <ChevronRight size={20} className="md:w-6 md:h-6" />
            </button>
          </div>
        </div>
      </div>

      <aside className="space-y-4 md:space-y-6">
         <div className="bg-indigo-600 rounded-[1.5rem] md:rounded-[2.5rem] p-6 md:p-8 text-white shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16" />
            <div className="relative z-10">
               <div className="flex items-center gap-3 mb-4 md:mb-6">
                  <div className="p-2 bg-white/20 rounded-xl shrink-0">
                     <BrainCircuit size={18} className="md:w-5 md:h-5" />
                  </div>
                  <h4 className="font-black text-[10px] md:text-xs uppercase tracking-widest">Consultant</h4>
               </div>
               
               <div className="space-y-3 md:space-y-4 mb-6 md:mb-8">
                  <p className="text-[10px] md:text-[11px] text-indigo-100 leading-relaxed font-medium">
                    "Enter a chapter name to generate AirclassPRO-standard flashcards."
                  </p>
                  <div className="relative">
                    <input 
                      type="text" 
                      value={genQuery}
                      onChange={(e) => setGenQuery(e.target.value)}
                      placeholder="e.g. Gyroscopes"
                      className="w-full pl-3 pr-10 py-2.5 md:py-3 bg-white/10 rounded-xl border border-white/10 text-[11px] md:text-xs font-bold text-white placeholder:text-white/30 focus:bg-white/20 focus:outline-none transition-all"
                    />
                    <button 
                      onClick={handleGenerate}
                      disabled={isGenerating}
                      className="absolute right-2 top-1.5 md:top-2 p-1.5 bg-white text-indigo-600 rounded-lg hover:bg-slate-900 hover:text-white transition-all disabled:opacity-50"
                    >
                      {isGenerating ? <Loader2 size={12} className="md:w-[14px] md:h-[14px] animate-spin" /> : <Sparkles size={12} className="md:w-[14px] md:h-[14px]" />}
                    </button>
                  </div>
               </div>

               <button className="w-full py-3 md:py-4 bg-white text-indigo-600 rounded-xl md:rounded-2xl text-[9px] md:text-[10px] font-black uppercase tracking-widest shadow-xl hover:bg-black hover:text-white transition-all flex items-center justify-center gap-2">
                  <Layers size={14} /> Stats
               </button>
            </div>
         </div>

         <div className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-xl hidden lg:block">
            <h5 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Studied Modules</h5>
            <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 scrollbar-hide">
               {history.length > 0 ? history.map((m, i) => (
                  <div key={m.id} className="p-4 bg-gray-50 rounded-2xl border border-gray-100 group hover:border-indigo-200 transition-colors">
                     <div className="flex justify-between items-start mb-1">
                        <span className="text-[10px] font-black text-indigo-600 uppercase">Module {history.length - i}</span>
                        <span className="text-[10px] text-gray-400 font-mono">{new Date(m.timestamp).toLocaleDateString()}</span>
                     </div>
                     <p className="text-xs font-bold text-gray-800 line-clamp-1">{m.title}</p>
                  </div>
               )) : (
                 <div className="text-center py-8">
                    <p className="text-[10px] text-gray-400 font-black uppercase italic">No modules</p>
                 </div>
               )}
            </div>
         </div>
      </aside>

      <style dangerouslySetInnerHTML={{ __html: `
        .perspective-1000 { perspective: 1000px; }
        .preserve-3d { transform-style: preserve-3d; }
        .backface-hidden { backface-visibility: hidden; }
        .rotate-y-180 { transform: rotateY(180deg); }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />
    </div>
  );
}
