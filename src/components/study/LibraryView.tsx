import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Book, 
  CheckCircle2, 
  BookOpen, 
  ChevronRight, 
  Database, 
  Bookmark, 
  FileText, 
  Globe,
  Sparkles,
  Loader2,
  X,
  Target,
  Zap,
  Layout,
  PlayCircle,
  Search,
  Navigation,
  CloudSun,
  Wrench,
  Plane,
  Radio,
  Scale,
  Brain,
  ArrowRight
} from 'lucide-react';
import { getChapterBrief } from '../../services/aiConsultantService';
import ReactMarkdown from 'react-markdown';
import { DGCA_SUBJECTS } from '../../constants/subjects';
import { Subject, Topic, Question } from '../../types/syllabus';

const SUBJECT_CONFIG: Record<string, { color: string; icon: any }> = {
  'nav': { color: 'bg-blue-600', icon: Navigation },
  'met': { color: 'bg-slate-500', icon: CloudSun },
  'tech-gen': { color: 'bg-orange-600', icon: Wrench },
  'tech-spec': { color: 'bg-red-600', icon: Plane },
  'radio-telephony': { color: 'bg-emerald-600', icon: Radio },
  'pof': { color: 'bg-purple-600', icon: Target },
  'aviation-leg': { color: 'bg-yellow-500', icon: Scale },
  'human-performance': { color: 'bg-teal-600', icon: Brain }
};

export default function LibraryView() {
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [viewMode, setViewMode] = useState<'explanation' | 'questions' | 'revision'>('explanation');
  const [isConsulting, setIsConsulting] = useState(false);
  const [aiBrief, setAiBrief] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredSubjects = useMemo(() => {
    if (!searchQuery) return DGCA_SUBJECTS;
    const q = searchQuery.toLowerCase();
    return DGCA_SUBJECTS.filter(s => 
      s.title.toLowerCase().includes(q) || 
      s.topics.some(t => t.title.toLowerCase().includes(q))
    );
  }, [searchQuery]);

  const handleConsultAI = async (subject: string, topic: Topic) => {
    setIsConsulting(true);
    setAiBrief(null);
    try {
      const brief = await getChapterBrief({
        subject,
        chapterTitle: topic.title,
        description: topic.explanation,
        book: 'AirclassPRO DGCA Exam Preparation'
      });
      setAiBrief(brief);
    } catch (err) {
      console.error(err);
    } finally {
      setIsConsulting(false);
    }
  };

  return (
    <div className={`flex flex-col gap-6 md:gap-8 min-h-screen pb-20 ${selectedSubject ? 'lg:grid lg:grid-cols-[300px,1fr]' : ''}`}>
      {/* Search Header */}
      {!selectedSubject && (
        <div className="space-y-6">
          <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h2 className="text-3xl md:text-5xl font-black text-slate-950 uppercase italic tracking-tighter">Knowledge Hub</h2>
              <p className="text-sm text-gray-500 font-bold uppercase tracking-widest mt-1">Select a subject to start your mission</p>
            </div>
            <div className="relative w-full md:w-80 group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors" size={18} />
              <input 
                type="text" 
                placeholder="Search Subjects or Topics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white border-2 border-gray-100 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold focus:border-blue-600 focus:outline-none transition-all shadow-sm"
              />
            </div>
          </header>

          <div className="space-y-12">
            {filteredSubjects.map((subject) => {
              const config = SUBJECT_CONFIG[subject.id] || { color: 'bg-blue-600', icon: Book };
              const Icon = config.icon;
              return (
                <div key={subject.id} className="space-y-4">
                  <div className="flex items-center gap-4 px-2">
                    <div className={`shrink-0 w-10 h-10 ${config.color} text-white rounded-xl flex items-center justify-center shadow-lg`}>
                      <Icon size={20} />
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-slate-900 uppercase italic tracking-tight">{subject.title}</h3>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{subject.topics.length} Chapters • DGCA Syllabus</p>
                    </div>
                  </div>

                  <div className="grid gap-3">
                    {subject.topics.map((topic, i) => (
                      <button
                        key={topic.id}
                        onClick={() => {
                          setSelectedSubject(subject);
                          setSelectedTopic(topic);
                          setViewMode('explanation');
                          setAiBrief(null);
                        }}
                        className="w-full text-left bg-white border border-gray-100 rounded-2xl p-5 flex items-center gap-5 hover:shadow-xl hover:border-blue-500 transition-all group"
                      >
                        <div className="w-10 h-10 bg-gray-50 text-slate-300 rounded-xl flex items-center justify-center font-black italic shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-all">
                          {(i + 1).toString().padStart(2, '0')}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-black text-slate-800 uppercase italic tracking-tight truncate group-hover:text-blue-600 transition-colors">
                            {topic.title}
                          </h4>
                          <p className="text-[10px] text-gray-400 font-medium leading-relaxed line-clamp-1 mt-0.5">
                            {topic.explanation}
                          </p>
                        </div>
                        <ChevronRight size={16} className="text-gray-300 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Selected Subject View */}
      {selectedSubject && (
        <>
          {/* Sidebar for Desktop */}
          <aside className="hidden lg:block space-y-6 shrink-0">
             <div className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-xl space-y-6 sticky top-4">
                <button 
                  onClick={() => setSelectedSubject(null)}
                  className="flex items-center gap-2 text-[10px] font-black text-gray-400 hover:text-blue-600 transition-colors uppercase tracking-widest"
                >
                  <ChevronRight size={14} className="rotate-180" /> Change Subject
                </button>
                <div className="flex items-center gap-3 px-2">
                   <div className={`p-3 ${SUBJECT_CONFIG[selectedSubject.id]?.color || 'bg-blue-600'} text-white rounded-2xl`}>
                      {React.createElement(SUBJECT_CONFIG[selectedSubject.id]?.icon || Book, { size: 24 })}
                   </div>
                   <div>
                      <h3 className="font-black text-sm uppercase italic tracking-tight text-slate-900 leading-none">{selectedSubject.title}</h3>
                      <p className="text-[10px] font-bold text-gray-400 uppercase mt-1">Ground School</p>
                   </div>
                </div>

                <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2 scrollbar-hide">
                   {selectedSubject.topics.map((topic) => (
                     <button
                       key={topic.id}
                       onClick={() => {
                         setSelectedTopic(topic);
                         setViewMode('explanation');
                       }}
                       className={`w-full text-left p-4 rounded-2xl transition-all flex items-center justify-between group ${
                         selectedTopic?.id === topic.id 
                         ? 'bg-slate-900 text-white shadow-lg' 
                         : 'hover:bg-slate-50 text-slate-600 border border-transparent'
                       }`}
                     >
                       <div className="flex flex-col overflow-hidden">
                         <span className="text-[10px] font-black uppercase tracking-tight truncate">{topic.title}</span>
                         <span className={`text-[8px] font-bold ${selectedTopic?.id === topic.id ? 'text-slate-400' : 'text-gray-400'}`}>Chapter {topic.id.toUpperCase()}</span>
                       </div>
                       {selectedTopic?.id === topic.id && <Zap size={14} className="text-blue-400" />}
                     </button>
                   ))}
                </div>
             </div>
          </aside>

          <main className="space-y-6 md:space-y-8">
            {!selectedTopic ? (
              <div className="space-y-6 md:space-y-8">
                <header className="bg-white p-6 md:p-12 rounded-[2rem] md:rounded-[3rem] border border-gray-100 shadow-xl relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
                   <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full blur-3xl -mr-32 -mt-32 opacity-50" />
                   <div className="relative z-10">
                      <div className="flex items-center gap-3 mb-4">
                        <button onClick={() => setSelectedSubject(null)} className="lg:hidden p-2 bg-gray-50 rounded-xl">
                          < ChevronRight size={18} className="rotate-180" />
                        </button>
                        <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full">Subject Modules</span>
                      </div>
                      <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-3 tracking-tighter italic uppercase">{selectedSubject.title}</h2>
                      <p className="text-xs md:text-lg text-gray-500 font-medium tracking-tight max-w-2xl leading-relaxed">{selectedSubject.description}</p>
                   </div>
                </header>

                <div className="grid gap-3 md:gap-4">
                  {selectedSubject.topics.length > 0 ? (
                    selectedSubject.topics.map((topic, i) => (
                      <button
                        key={topic.id}
                        onClick={() => {
                          setSelectedTopic(topic);
                          setViewMode('explanation');
                        }}
                        className="w-full text-left bg-white border border-gray-100 rounded-2xl md:rounded-3xl p-4 md:p-6 flex items-center justify-between gap-4 hover:border-blue-500 hover:shadow-xl transition-all group"
                      >
                        <div className="flex items-center gap-4 md:gap-6 min-w-0">
                          <div className="w-10 h-10 md:w-14 md:h-14 bg-gray-50 text-slate-300 rounded-xl md:rounded-2xl flex items-center justify-center font-black italic md:text-xl shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-all">
                            {(i + 1).toString().padStart(2, '0')}
                          </div>
                          <div className="min-w-0">
                            <h4 className="text-sm md:text-xl font-black text-slate-800 mb-1 uppercase italic tracking-tight truncate group-hover:text-blue-600 transition-colors">{topic.title}</h4>
                            <div className="flex items-center gap-3">
                              <span className="text-[8px] md:text-[10px] font-bold text-gray-400 uppercase tracking-widest">{topic.practiceQuestions.length} Questions</span>
                              <span className="w-1 h-1 bg-gray-200 rounded-full" />
                              <span className="text-[8px] md:text-[10px] font-bold text-emerald-500 uppercase tracking-widest">Available Now</span>
                            </div>
                          </div>
                        </div>
                        <div className="p-2 md:p-3 bg-gray-50 rounded-full text-gray-300 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors shrink-0">
                          <ArrowRight size={18} />
                        </div>
                      </button>
                    ))
                  ) : (
                    <div className="py-20 text-center bg-white rounded-[2rem] border-2 border-dashed border-gray-100">
                      <p className="text-gray-400 font-black uppercase tracking-widest text-xs">Content under update for 2026</p>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <motion.div 
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-6 md:space-y-8"
              >
                {/* Topic Navigation */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-[1.5rem] md:rounded-[2.5rem] border border-gray-100 shadow-sm sticky top-4 z-40">
                  <button 
                    onClick={() => setSelectedTopic(null)}
                    className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-blue-600 transition-colors px-2"
                  >
                    <ChevronRight size={14} className="rotate-180" /> Back to List
                  </button>
                  <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide pb-1 md:pb-0">
                    <NavButton active={viewMode === 'explanation'} icon={<BookOpen size={14} />} label="Lesson" onClick={() => setViewMode('explanation')} />
                    <NavButton active={viewMode === 'questions'} icon={<Target size={14} />} label="Practice" onClick={() => setViewMode('questions')} />
                    <NavButton active={viewMode === 'revision'} icon={<Layout size={14} />} label="Review" onClick={() => setViewMode('revision')} />
                  </div>
                </div>

                <div className="bg-white p-6 md:p-14 rounded-[2rem] md:rounded-[3.5rem] border border-gray-100 shadow-xl overflow-hidden min-h-[600px]">
                  <AnimatePresence mode="wait">
                    {viewMode === 'explanation' && (
                      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} key="explanation" className="space-y-12">
                        <div className="space-y-4">
                          <div className="flex items-center gap-2">
                             <div className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
                             <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest italic">{selectedSubject.title} Module</span>
                          </div>
                          <h2 className="text-3xl md:text-5xl font-black text-slate-950 uppercase italic tracking-tighter leading-tight">{selectedTopic.title}</h2>
                          <div className="w-24 h-2.5 bg-blue-600 rounded-full" />
                        </div>

                        <div className="space-y-10 md:space-y-12">
                           <section className="space-y-6">
                             <div className="flex items-center gap-3">
                               <Sparkles size={24} className="text-blue-500" />
                               <h3 className="text-xs font-black uppercase tracking-[0.2em] text-blue-500">The Ground School Brief</h3>
                             </div>
                             <p className="text-lg md:text-2xl text-slate-700 leading-tight md:leading-snug font-bold italic border-l-8 border-blue-50 p-6 md:p-10 bg-gray-50/50 rounded-3xl">
                               {selectedTopic.explanation}
                             </p>
                           </section>

                           <section className="grid lg:grid-cols-[1fr,360px] gap-8 md:gap-14 pt-12 border-t border-gray-100">
                              <div className="space-y-8">
                                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-emerald-600 flex items-center gap-3 italic">
                                  <Zap size={20} fill="currentColor" /> Strategic Intelligence Points
                                </h3>
                                <div className="grid gap-4">
                                  {selectedTopic.keyPoints.map((pt, i) => (
                                    <div key={i} className="flex gap-4 p-6 md:p-8 bg-emerald-50/50 text-emerald-950 rounded-3xl font-bold text-sm md:text-base border border-emerald-100/50">
                                      <span className="text-emerald-400 font-mono text-xl shrink-0 italic">{(i+1).toString().padStart(2, '0')}</span>
                                      {pt}
                                    </div>
                                  ))}
                                </div>
                              </div>
                              
                              <div className="space-y-6">
                                 <div className="p-8 md:p-10 bg-slate-950 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden">
                                   <h5 className="text-[10px] font-black text-blue-400 uppercase tracking-[0.2em] mb-8 italic">Cockpit Assistant AI</h5>
                                   <button 
                                     onClick={() => handleConsultAI(selectedSubject.title, selectedTopic)}
                                     disabled={isConsulting}
                                     className="w-full py-5 bg-blue-600 hover:bg-blue-500 rounded-2xl font-black uppercase text-xs tracking-widest flex items-center justify-center gap-3 transition-all"
                                   >
                                     {isConsulting ? <Loader2 size={20} className="animate-spin" /> : <Sparkles size={20} />}
                                     AI Explanation
                                   </button>
                                   {aiBrief && (
                                     <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-10 prose prose-invert prose-sm">
                                       <div className="markdown-body text-slate-300">
                                         <ReactMarkdown>{aiBrief}</ReactMarkdown>
                                       </div>
                                     </motion.div>
                                   )}
                                 </div>
                              </div>
                           </section>
                        </div>
                      </motion.div>
                    )}

                    {viewMode === 'questions' && (
                      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} key="questions" className="space-y-8">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10 border-b border-gray-100 pb-8">
                           <div>
                             <h3 className="text-3xl font-black text-slate-950 uppercase italic tracking-tighter leading-none">Practice Range</h3>
                             <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-2">Simulate real exam scenarios</p>
                           </div>
                           <span className="text-[10px] font-black bg-orange-100 text-orange-600 px-6 py-3 rounded-2xl uppercase tracking-widest italic">{selectedTopic.practiceQuestions.length} Mission Objects</span>
                        </div>
                        <div className="space-y-6">
                          {selectedTopic.practiceQuestions.map((q, i) => (
                            <QuestionCard key={i} index={i} question={q} />
                          ))}
                        </div>
                      </motion.div>
                    )}



                    {viewMode === 'revision' && (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} key="revision" className="max-w-3xl mx-auto space-y-12">
                        <div className="bg-slate-50 border-4 border-slate-200 border-dotted rounded-[3.5rem] p-8 md:p-16 text-center">
                           <h3 className="text-3xl font-black text-slate-950 uppercase italic mb-10 tracking-tighter">Strategic Review Card</h3>
                           <div className="prose prose-slate max-w-none text-left bg-white p-8 md:p-14 rounded-[2.5rem] shadow-xl">
                              <ReactMarkdown>{selectedTopic.revisionCard}</ReactMarkdown>
                              <div className="mt-12 pt-8 border-t border-gray-100 flex items-center justify-center gap-2">
                                <span className="text-[8px] font-black text-gray-300 uppercase tracking-widest italic">© 2026 AirclassPRO - All Rights Reserved</span>
                              </div>
                           </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            )}
          </main>
        </>
      )}
    </div>
  );
}

function NavButton({ active, icon, label, onClick }: { active: boolean; icon: React.ReactNode; label: string; onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={`flex items-center gap-2 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shrink-0 ${
        active ? 'bg-slate-900 text-white shadow-xl' : 'text-gray-400 hover:bg-gray-50 hover:text-slate-900'
      }`}
    >
      {icon} <span>{label}</span>
    </button>
  );
}

function QuestionCard({ index, question }: { index: number; question: Question }) {
  const [showAnswer, setShowAnswer] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  return (
    <div className="p-8 md:p-14 bg-gray-50 rounded-[2.5rem] md:rounded-[3.5rem] border border-gray-100 hover:border-blue-100 transition-all">
      <div className="flex items-center gap-4 mb-8">
        <span className="text-[10px] font-black text-white uppercase tracking-[0.2em] bg-slate-900 px-5 py-2 rounded-2xl italic">Mission Obj {(index + 1).toString().padStart(2, '0')}</span>
      </div>
      <p className="text-xl md:text-3xl font-black text-slate-950 mb-10 leading-tight italic tracking-tighter">{question.q}</p>
      <div className="grid gap-3 md:gap-4 mb-10">
        {question.options.map((opt, i) => (
          <button 
            key={i} 
            onClick={() => {
              setSelectedOption(opt);
              setShowAnswer(true);
            }}
            disabled={showAnswer}
            className={`p-6 md:p-8 rounded-[1.5rem] md:rounded-[2rem] text-left font-bold text-sm md:text-lg transition-all border-2 ${
              showAnswer 
                ? opt === question.a 
                  ? 'bg-emerald-600 text-white border-emerald-700 shadow-lg' 
                  : selectedOption === opt
                    ? 'bg-red-600 text-white border-red-700 shadow-lg'
                    : 'bg-white text-gray-300 border-gray-50'
                : 'bg-white text-slate-700 border-gray-100 hover:border-blue-600 hover:bg-blue-50 shadow-sm'
            }`}
          >
            <div className="flex items-center gap-4">
               <span className="w-8 h-8 rounded-lg bg-gray-100 text-slate-400 flex items-center justify-center font-black">{String.fromCharCode(65 + i)}</span>
               {opt}
            </div>
          </button>
        ))}
      </div>
      {showAnswer && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-8 md:p-12 bg-blue-600 text-white rounded-[2.5rem] md:rounded-[3rem] space-y-4 shadow-2xl">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-200">Intelligence Debrief</p>
          <p className="text-lg md:text-xl font-bold leading-relaxed italic">{question.explanation}</p>
        </motion.div>
      )}
    </div>
  );
}
