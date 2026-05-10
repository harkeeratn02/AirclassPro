import React from 'react';
import { motion } from 'motion/react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { Summary, StudyMaterial } from '../../types';
import { CheckCircle2, List, Table, History, MessageCircle, ArrowRight } from 'lucide-react';

interface SummaryViewProps {
  summary?: Summary;
  isLoading: boolean;
  history?: StudyMaterial[];
  onSelectHistory?: (index: number) => void;
}

export default function SummaryView({ summary, isLoading, history, onSelectHistory }: SummaryViewProps) {
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-12 bg-gray-200 animate-pulse rounded-xl w-3/4" />
        <div className="space-y-3">
          <div className="h-4 bg-gray-200 animate-pulse rounded w-full" />
          <div className="h-4 bg-gray-200 animate-pulse rounded w-5/6" />
        </div>
      </div>
    );
  }

  if (!summary) {
    return (
      <div className="text-center py-20 bg-white rounded-[2rem] border-2 border-dashed border-gray-200">
        <BookIcon className="mx-auto text-gray-200 mb-4" size={48} />
        <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Awaiting Flight Data...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row gap-8 pb-12">
      <div className="flex-1 space-y-8">
        {/* Big Picture */}
        <section className="bg-[#1B263B] text-white p-10 rounded-[2rem] shadow-2xl relative overflow-hidden border border-blue-500/20">
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center">
              <CheckCircle2 size={12} />
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-400">AirclassPRO MISSION BRIEFING</span>
          </div>
          <div className="text-3xl font-black leading-tight tracking-tight">
            <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
              {summary.bigPicture}
            </ReactMarkdown>
          </div>
        </div>
        <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
          <Plane size={240} />
        </div>
      </section>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Core Pillars */}
        <section className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
              <List size={20} />
            </div>
            <h3 className="font-black uppercase tracking-tight text-lg">Technical Pillars</h3>
          </div>
          <ul className="space-y-5">
            {summary.corePillars.map((pillar, idx) => (
              <motion.li 
                key={idx}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="flex gap-4 items-start group"
              >
                <div className="mt-1.5 w-2 h-2 rounded-full bg-blue-500 shrink-0 group-hover:scale-125 transition-transform" />
                <div className="text-gray-700 font-medium leading-relaxed">
                  <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
                    {pillar}
                  </ReactMarkdown>
                </div>
              </motion.li>
            ))}
          </ul>
        </section>

        {/* Cheat Sheet */}
        <section className="bg-white rounded-[2rem] border border-gray-100 shadow-xl overflow-hidden self-start">
          <div className="p-8 pb-4 flex items-center gap-3">
            <div className="p-2 bg-orange-50 text-orange-600 rounded-xl">
              <Table size={20} />
            </div>
            <h3 className="font-black uppercase tracking-tight text-lg">The Checklist</h3>
          </div>
          <div className="px-8 pb-8">
            <div className="space-y-4">
              {summary.cheatSheet.map((item, idx) => (
                <div key={idx} className="group border-b border-gray-50 pb-4 last:border-0 hover:bg-gray-50/50 p-2 rounded-lg transition-colors">
                  <p className="font-black text-xs uppercase tracking-widest text-blue-600 mb-1">{item.term}</p>
                  <div className="text-sm text-gray-500 font-serif italic leading-relaxed">
                    <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
                      {item.definition}
                    </ReactMarkdown>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>

    {/* Side Profile / history & consultant */}
      <aside className="w-full lg:w-80 space-y-6">
        {/* AI Consultant */}
        <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-xl overflow-hidden relative group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-full blur-2xl -mr-12 -mt-12 transition-all group-hover:scale-150" />
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-blue-600 text-white rounded-xl animate-bounce">
                <MessageCircle size={18} />
              </div>
              <h4 className="font-black text-xs uppercase tracking-widest text-gray-900">Mission Consultant</h4>
            </div>
            <p className="text-xs text-gray-500 leading-relaxed mb-4">
              I can help you deep-dive into this briefing. Ask about any technical pillar or specific DGCA regulation mentioned here.
            </p>
            <button className="w-full py-3 bg-gray-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 transition-all flex items-center justify-center gap-2">
              Deep Dive Briefing <ArrowRight size={12} />
            </button>
          </div>
        </div>

        {/* History */}
        {history && history.length > 0 && (
          <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-xl">
             <div className="flex items-center gap-3 mb-6">
                <History size={18} className="text-gray-400" />
                <h4 className="font-black text-xs uppercase tracking-widest text-gray-900">Briefing History</h4>
             </div>
             <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                {history.map((item, idx) => (
                  <button 
                    key={item.id}
                    onClick={() => onSelectHistory?.(idx)}
                    className="w-full text-left p-4 rounded-2xl hover:bg-blue-50 border border-transparent hover:border-blue-100 transition-all group"
                  >
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 group-hover:text-blue-400">
                      {new Date(item.timestamp).toLocaleDateString()}
                    </p>
                    <p className="text-xs font-bold text-gray-700 truncate">{item.title}</p>
                  </button>
                ))}
             </div>
          </div>
        )}
      </aside>
    </div>
  );
}

function Plane(props: any) {
  return (
    <svg 
      {...props} 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
    >
      <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"/>
    </svg>
  );
}

function BookIcon(props: any) {
  return (
    <svg 
      {...props} 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
    >
      <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z"/>
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z"/>
    </svg>
  );
}
