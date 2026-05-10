import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { QuizQuestion, UserProfile } from '../../types';
import { HelpCircle, ChevronRight, CheckCircle2, XCircle, RefreshCw, MessageSquareCode, BrainCircuit, Sparkles, Loader2 } from 'lucide-react';
import { generateAIQuestions } from '../../services/aiConsultantService';

interface QuizViewProps {
  questions?: QuizQuestion[];
  isLoading: boolean;
  onReset: () => void;
  currentSubject?: string;
  profile?: UserProfile | null;
}

export default function QuizView({ questions, isLoading, onReset, currentSubject = "Meteorology", profile }: QuizViewProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [showResults, setShowResults] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [aiQuestions, setAiQuestions] = useState<QuizQuestion[]>([]);
  const [genQuery, setGenQuery] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const allQuestions = [...(questions || []), ...aiQuestions];

  useEffect(() => {
    setCurrentIndex(0);
    setUserAnswers({});
    setShowResults(false);
    setRevealed(false);
  }, [questions, aiQuestions]);

  const handleGenerate = async () => {
    if (!genQuery.trim()) return;
    setIsGenerating(true);
    const newQs = await generateAIQuestions(currentSubject, genQuery);
    if (newQs.length > 0) {
      const formatted: QuizQuestion[] = newQs.map((q, i) => ({
        id: `ai-${Date.now()}-${i}`,
        question: q.question,
        options: q.options,
        correctAnswer: q.correct,
        explanation: q.explanation,
        type: 'mcq'
      }));
      setAiQuestions(prev => [...formatted, ...prev]);
      setGenQuery('');
    }
    setIsGenerating(false);
  };

  if (isLoading) {
    return <div className="h-64 bg-gray-100 animate-pulse rounded-3xl" />;
  }

  if (allQuestions.length === 0) {
    return (
      <div className="space-y-6">
        <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-300">
          <HelpCircle className="mx-auto text-gray-300 mb-4" size={48} />
          <p className="text-gray-500 font-bold uppercase tracking-widest text-xs mb-6">No Practice Exams Available</p>
          <div className="max-w-xs mx-auto">
             <div className="relative">
                <input 
                  type="text" 
                  value={genQuery}
                  onChange={(e) => setGenQuery(e.target.value)}
                  placeholder={`Enter ${currentSubject} chapter (e.g. Navigation)`}
                  className="w-full pl-4 pr-12 py-3 bg-gray-50 rounded-xl border border-gray-100 focus:border-indigo-500 focus:outline-none text-xs font-bold"
                />
                <button 
                  onClick={handleGenerate}
                  disabled={isGenerating}
                  className="absolute right-2 top-2 p-1.5 bg-indigo-600 text-white rounded-lg hover:bg-black transition-all"
                >
                  {isGenerating ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
                </button>
             </div>
          </div>
        </div>
      </div>
    );
  }

  const currentQuestion = allQuestions[currentIndex];
  const isLastQuestion = currentIndex === allQuestions.length - 1;

  const handleAnswer = (answer: string) => {
    if (revealed) return;
    setUserAnswers(prev => ({ ...prev, [currentQuestion.id]: answer }));
  };

  const handleNext = () => {
    if (isLastQuestion) {
      setShowResults(true);
    } else {
      setCurrentIndex(prev => prev + 1);
      setRevealed(false);
    }
  };

  if (showResults) {
    const score = allQuestions.reduce((acc, q) => {
      return acc + (userAnswers[q.id]?.toLowerCase().trim() === q.correctAnswer.toLowerCase().trim() ? 1 : 0);
    }, 0);

    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white p-12 rounded-3xl border border-gray-100 shadow-xl text-center"
      >
        <div className="w-24 h-24 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6 text-indigo-600">
          <CheckCircle2 size={48} />
        </div>
        <h3 className="text-3xl font-bold mb-2">Exam Complete!</h3>
        <p className="text-gray-500 mb-8">You mastered {score} out of {allQuestions.length} questions.</p>
        
        <div className="space-y-4 max-h-[400px] overflow-y-auto mb-8 text-left px-4">
          {allQuestions.map((q, idx) => (
            <div key={q.id} className="p-4 rounded-xl border border-gray-100 bg-gray-50">
              <div className="font-semibold text-sm mb-2">
                <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
                  {`${idx + 1}. ${q.question}`}
                </ReactMarkdown>
              </div>
              <p className={`text-xs ${userAnswers[q.id]?.toLowerCase() === q.correctAnswer.toLowerCase() ? 'text-green-600' : 'text-red-600'}`}>
                Your Answer: {userAnswers[q.id] || '(Skipped)'}
              </p>
              <p className="text-xs text-gray-600 mt-1 font-medium">Correct: {q.correctAnswer}</p>
              <div className="text-xs text-gray-400 mt-2 italic">
                <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
                  {q.explanation}
                </ReactMarkdown>
              </div>
            </div>
          ))}
        </div>

        <button 
          onClick={() => {
            setCurrentIndex(0);
            setUserAnswers({});
            setShowResults(false);
            setRevealed(false);
            onReset();
          }}
          className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-indigo-700 transition-colors flex items-center gap-2 mx-auto"
        >
          <RefreshCw size={18} />
          Try Another Quiz
        </button>
      </motion.div>
    );
  }

  return (
    <div className="grid lg:grid-cols-[1fr,300px] gap-6 md:gap-8 pb-12">
      <div className="space-y-4 md:space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 px-2 md:px-4">
          <div className="space-y-0.5 md:space-y-1">
            <span className="text-[10px] md:text-xs font-black uppercase tracking-[0.2em] text-indigo-600 block">AirclassPRO DGCA EXAM STANDARDS</span>
            <span className="text-[8px] md:text-[10px] font-bold text-gray-400">Professional Mission-Ready Simulations</span>
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{currentIndex + 1} / {allQuestions.length}</span>
            <div className="h-1.5 md:h-2 flex-1 sm:w-32 bg-gray-100 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-indigo-600" 
                initial={{ width: 0 }}
                animate={{ width: `${((currentIndex + 1) / allQuestions.length) * 100}%` }}
              />
            </div>
          </div>
        </div>

        <motion.div 
          key={currentIndex}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white p-6 md:p-10 rounded-[1.5rem] md:rounded-[2.5rem] border border-gray-100 shadow-xl md:shadow-2xl relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-200 to-transparent opacity-50" />
          
          <div className="text-lg md:text-2xl font-black mb-6 md:mb-10 leading-tight tracking-tight text-gray-900 italic">
            <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
              {currentQuestion.question}
            </ReactMarkdown>
          </div>

        {currentQuestion.type === 'mcq' ? (
          <div className="grid gap-2 md:gap-3">
            {currentQuestion.options?.map((option, idx) => {
              const isSelected = userAnswers[currentQuestion.id] === option;
              const isCorrect = option === currentQuestion.correctAnswer;
              
              return (
                <button
                  key={idx}
                  disabled={revealed}
                  onClick={() => handleAnswer(option)}
                  className={`w-full p-3 md:p-4 rounded-xl text-left border-2 transition-all flex items-center justify-between group gap-3 ${
                    revealed 
                      ? isCorrect 
                        ? 'border-green-500 bg-green-50 text-green-700' 
                        : isSelected 
                          ? 'border-red-500 bg-red-50 text-red-700'
                          : 'border-gray-100 text-gray-400'
                      : isSelected 
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-700' 
                        : 'border-gray-100 hover:border-indigo-200'
                  }`}
                >
                  <span className="font-medium text-[13px] md:text-base leading-tight">{option}</span>
                  <div className="shrink-0">
                    {revealed && isCorrect && <CheckCircle2 className="text-green-600" size={16} />}
                    {revealed && isSelected && !isCorrect && <XCircle className="text-red-600" size={16} />}
                  </div>
                </button>
              );
            })}
          </div>
        ) : (
          <div className="space-y-4">
            <textarea
              disabled={revealed}
              value={userAnswers[currentQuestion.id] || ''}
              onChange={(e) => handleAnswer(e.target.value)}
              placeholder="Type your answer here..."
              className="w-full h-24 md:h-32 p-4 rounded-xl md:rounded-2xl border-2 border-gray-100 focus:border-indigo-600 focus:outline-none bg-gray-50 resize-none transition-all text-sm md:text-base"
            />
            {revealed && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 md:p-4 bg-green-50 rounded-xl md:rounded-2xl border border-green-100"
              >
                <p className="text-[10px] uppercase font-bold text-green-700 mb-1">Correct Answer</p>
                <div className="text-xs md:text-sm font-medium text-green-900">
                  <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
                    {currentQuestion.correctAnswer}
                  </ReactMarkdown>
                </div>
              </motion.div>
            )}
          </div>
        )}

        <div className="mt-6 md:mt-8 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 md:gap-4">
          <button 
            onClick={() => setRevealed(true)}
            className={`text-xs md:text-sm font-bold p-3 px-6 rounded-xl transition-all ${
              revealed ? 'text-gray-300 cursor-not-allowed bg-transparent' : 'text-gray-500 bg-gray-50 hover:bg-gray-100'
            }`}
          >
            Reveal Answer
          </button>
          
          <button
            onClick={handleNext}
            disabled={!userAnswers[currentQuestion.id] && !revealed}
            className={`flex items-center justify-center gap-2 px-6 md:px-8 py-3 rounded-xl font-bold transition-all shadow-md text-sm md:text-base ${
              !userAnswers[currentQuestion.id] && !revealed
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed shadow-none'
                : 'bg-indigo-600 text-white hover:bg-indigo-700'
            }`}
          >
            {isLastQuestion ? 'Finish Quiz' : 'Next Question'}
            <ChevronRight size={18} />
          </button>
        </div>

        <AnimatePresence>
          {revealed && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              className="mt-6 pt-6 border-t border-gray-100"
            >
              <div className="text-[11px] md:text-sm text-gray-600 italic flex gap-2">
                <span className="font-black text-indigo-700 not-italic shrink-0">EXPLANATION</span>
                <div className="leading-relaxed">
                  <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
                    {currentQuestion.explanation}
                  </ReactMarkdown>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>

    {/* AI Assistant Sidebar */}
    <aside className="space-y-4 md:space-y-6">
      <div className="bg-indigo-600 rounded-[1.5rem] md:rounded-[2rem] p-6 md:p-8 text-white shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16" />
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4 md:mb-6">
             <div className="p-2 bg-white/20 rounded-xl shrink-0">
               <BrainCircuit size={18} className="md:w-5 md:h-5" />
             </div>
             <h4 className="font-black text-[10px] md:text-xs uppercase tracking-[0.2em]">Exam Assistant</h4>
          </div>
          
          <div className="space-y-3 md:space-y-4 mb-6 md:mb-8">
            <p className="text-[10px] md:text-xs text-indigo-100 leading-relaxed font-medium">
              "Input a chapter name to generate 10-15 DGCA-level practice questions."
            </p>
            <div className="relative">
              <input 
                type="text" 
                value={genQuery}
                onChange={(e) => setGenQuery(e.target.value)}
                placeholder="e.g. Navigation"
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

          <div className="grid grid-cols-2 lg:grid-cols-1 gap-2">
             <button className="w-full py-2.5 bg-white text-indigo-600 rounded-xl text-[8px] md:text-[10px] font-black uppercase tracking-widest hover:bg-black hover:text-white transition-all">
               Strategic Brief
             </button>
             <button className="w-full py-2.5 bg-indigo-500 text-white rounded-xl text-[8px] md:text-[10px] font-black uppercase tracking-widest hover:bg-indigo-400 transition-all border border-white/20">
               Syllabus Ref
             </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-[1.5rem] md:rounded-[2rem] p-5 md:p-6 border border-gray-100 shadow-lg md:shadow-xl group hover:border-indigo-100 transition-colors">
        <h5 className="text-[8px] md:text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-3 md:mb-4">Exam Insights</h5>
        <div className="space-y-3 md:space-y-4">
           <div className="flex gap-2 md:gap-3">
              <div className="w-1 md:w-1.5 h-1 md:h-1.5 rounded-full bg-green-500 mt-1.5 shrink-0" />
              <p className="text-[9px] md:text-[10px] text-gray-500 font-medium leading-relaxed">
                <span className="font-black text-gray-700">76% Match:</span> Pattern observed in March 2024 DGC session.
              </p>
           </div>
           <div className="flex gap-2 md:gap-3">
              <div className="w-1 md:w-1.5 h-1 md:h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
              <p className="text-[9px] md:text-[10px] text-gray-500 font-medium leading-relaxed">
                <span className="font-black text-gray-700">Pitfall:</span> Don't confuse this with ICAO Annex 14 criteria.
              </p>
           </div>
        </div>
      </div>
    </aside>
  </div>
  );
}
