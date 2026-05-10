import React, { useState, useRef, useEffect } from 'react';
import { Upload, Send, FileText, X, Navigation, Scale, CloudSun, Wrench, Radio, Brain, Zap, MessageCircleCode, MapPin, Loader2, Wind, Activity } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { DGCASubject } from '../../types';
import { weatherService, WeatherData } from '../../services/weatherService';
import { getWeatherBrief, decodeWeather } from '../../services/aiConsultantService';
import ReactMarkdown from 'react-markdown';

interface ChatInterfaceProps {
  onProcess: (text: string) => void;
  isLoading: boolean;
  currentSubject: DGCASubject;
}

export default function ChatInterface({ onProcess, isLoading, currentSubject }: ChatInterfaceProps) {
  const [input, setInput] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [icaoSearch, setIcaoSearch] = useState('');
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [isFetchingWeather, setIsFetchingWeather] = useState(false);
  const [decodedWeather, setDecodedWeather] = useState<string | null>(null);
  const [isDecoding, setIsDecoding] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFetchWeather = async () => {
    if (icaoSearch.length < 3) return;
    setIsFetchingWeather(true);
    setWeatherData(null);
    setDecodedWeather(null);
    try {
      const data = await weatherService.fetchWeather(icaoSearch);
      setWeatherData(data);
      
      // Auto-decode for meteorology subject
      handleAutoDecode(data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsFetchingWeather(false);
    }
  };

  const handleAutoDecode = async (data: WeatherData) => {
    setIsDecoding(true);
    try {
      const decoded = await decodeWeather(data.icao, data.metar, data.taf);
      setDecodedWeather(decoded);
    } catch (error) {
      console.error(error);
    } finally {
      setIsDecoding(false);
    }
  };

  const subjectConfig = {
    'air-navigation': { label: 'Air Navigation Consultant', icon: Navigation, bgColor: 'bg-blue-600' },
    'air-regulation': { label: 'Regulation Specialist', icon: Scale, bgColor: 'bg-slate-800' },
    'meteorology': { label: 'Meteorology Consultant', icon: CloudSun, bgColor: 'bg-sky-500' },
    'technical-general': { label: 'Technical Consultant', icon: Wrench, bgColor: 'bg-orange-600' },
    'technical-specific': { label: 'Systems Specialist', icon: Zap, bgColor: 'bg-indigo-600' },
    'rtr': { label: 'Comms Instructor', icon: Radio, bgColor: 'bg-emerald-600' },
    'general': { label: 'Human Factors Expert', icon: Brain, bgColor: 'bg-purple-600' }
  };

  const config = subjectConfig[currentSubject] || subjectConfig.general;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() && !file) return;
    
    if (file) {
      onProcess(`[File: ${file.name}] ${input}`);
    } else {
      onProcess(input);
    }
    
    setInput('');
    setFile(null);
  };

  const DGCA_PROMPTS = [
    { label: 'AirclassPRO: 1-in-60 Math', icon: Zap },
    { label: 'Weather Logic: Tropical Storms', icon: CloudSun },
    { label: 'CAR Section 2: Rule 12(b)', icon: Scale },
    { label: 'Engine Failure Flow', icon: Wrench },
    { label: 'RT Script: Pan-Pan Call', icon: Radio },
  ];

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="bg-white rounded-[1.5rem] md:rounded-[2rem] border border-gray-200 shadow-xl md:shadow-2xl relative overflow-hidden flex flex-col">
        {/* Consultant Header */}
        <div className={`p-4 md:p-6 ${config.bgColor} text-white flex items-center justify-between`}>
          <div className="flex items-center gap-3 md:gap-4">
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-white/20 flex items-center justify-center animate-pulse shrink-0">
              <config.icon size={20} className="md:w-6 md:h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.2em] opacity-70">Active AI Consultant</span>
                <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-ping" />
              </div>
              <h3 className="text-base md:text-xl font-black tracking-tight leading-tight">{config.label}</h3>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-3">
             <div className="bg-black/10 px-3 py-1.5 rounded-full text-[10px] font-bold border border-white/10 uppercase tracking-widest">
                AirclassPRO Intelligence
             </div>
             <MessageCircleCode size={20} className="opacity-50" />
          </div>
        </div>

        <div className="p-4 sm:p-6 md:p-10 md:pt-8 relative z-10">
          <div className="mb-6 p-4 md:p-6 bg-blue-50 border-l-4 border-blue-500 rounded-r-xl md:rounded-r-2xl">
            <h4 className="font-black text-[10px] md:text-sm uppercase text-blue-900 mb-1 md:mb-2 flex items-center gap-2">
              <Zap size={14} className="md:w-4 md:h-4" /> INSTRUCTOR'S BRIEFING
            </h4>
            <p className="text-xs md:text-sm text-blue-800 leading-relaxed font-semibold italic">
              "Master, ensure you have your AirclassPRO study modules ready. I am here to decode complex regulations and flight math. Let's aim for a high-performance session."
            </p>
          </div>

          <p className="text-gray-500 mb-6 text-xs md:text-base font-medium">Your session is grounded in <span className="text-blue-600 font-bold">AirclassPRO Precision</span> and official Indian DGCA standards.</p>

          {currentSubject === 'meteorology' && (
            <div className="mb-8 overflow-hidden group">
               <div className="bg-slate-900 rounded-3xl p-6 md:p-8 text-white shadow-2xl relative overflow-hidden border border-white/5">
                  <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform">
                     <CloudSun size={80} />
                  </div>
                  <div className="relative z-10">
                     <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-blue-500/20 rounded-xl">
                           <Activity size={20} className="text-blue-400" />
                        </div>
                        <div>
                          <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-400 font-mono italic">Aerodrome Intelligence Feed</h4>
                          <p className="text-[10px] font-bold text-slate-500 uppercase">Input ICAO to fetch real-time METAR/TAF broadcast</p>
                        </div>
                     </div>

                     <div className="flex flex-col sm:flex-row gap-3">
                        <div className="flex-1 relative">
                           <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                           <input 
                              type="text"
                              value={icaoSearch}
                              onChange={(e) => setIcaoSearch(e.target.value.toUpperCase())}
                              placeholder="Enter ICAO (e.g. VIDP, EGLL)"
                              className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-white text-sm font-black uppercase tracking-widest focus:outline-none focus:bg-white/10 transition-all placeholder:text-slate-600"
                              onKeyDown={(e) => e.key === 'Enter' && handleFetchWeather()}
                           />
                        </div>
                        <button 
                          type="button"
                          onClick={handleFetchWeather}
                          disabled={isFetchingWeather}
                          className="bg-blue-600 text-white px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-white hover:text-black transition-all shadow-lg active:scale-95 disabled:opacity-50"
                        >
                           {isFetchingWeather ? (
                             <Loader2 size={18} className="animate-spin mx-auto" />
                           ) : (
                             'Get Live Feed'
                           )}
                        </button>
                     </div>

                     <AnimatePresence>
                       {weatherData && (
                         <motion.div 
                           initial={{ opacity: 0, y: 10 }}
                           animate={{ opacity: 1, y: 0 }}
                           exit={{ opacity: 0, y: 10 }}
                           className="mt-6 space-y-4"
                         >
                           <div className="bg-black/40 rounded-2xl p-5 border border-white/5 font-mono">
                             <div className="flex items-center justify-between mb-3">
                               <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest">METAR Broadcast</span>
                               <span className="text-[8px] text-slate-500">{new Date(weatherData.timestamp).toLocaleTimeString()}</span>
                             </div>
                             <p className="text-xs md:text-sm text-green-400 leading-relaxed font-bold selection:bg-green-500/30">
                               {weatherData.metar}
                             </p>
                           </div>

                           {weatherData.taf && (
                             <div className="bg-black/40 rounded-2xl p-5 border border-white/5 font-mono">
                               <div className="flex items-center justify-between mb-3">
                                 <span className="text-[10px] font-black text-amber-400 uppercase tracking-widest">TAF Forecast</span>
                               </div>
                               <p className="text-[10px] md:text-xs text-slate-300 leading-normal whitespace-pre-wrap font-medium">
                                 {weatherData.taf}
                               </p>
                             </div>
                           )}

                           <AnimatePresence>
                             {isDecoding && (
                               <motion.div 
                                 initial={{ opacity: 0 }}
                                 animate={{ opacity: 1 }}
                                 className="flex items-center gap-2 px-5 py-3 bg-blue-500/10 rounded-xl"
                                >
                                 <Loader2 size={12} className="animate-spin text-blue-400" />
                                 <span className="text-[8px] font-black uppercase tracking-widest text-blue-400">AI Decoding...</span>
                               </motion.div>
                             )}

                             {decodedWeather && (
                               <motion.div 
                                 initial={{ opacity: 0, height: 0 }}
                                 animate={{ opacity: 1, height: 'auto' }}
                                 className="bg-blue-500/5 rounded-2xl p-5 border border-blue-500/20"
                               >
                                 <div className="flex items-center gap-2 mb-3">
                                   <Wind size={14} className="text-blue-400" />
                                   <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Smart Breakdown</span>
                                 </div>
                                 <div className="prose prose-invert prose-xs text-slate-300 font-medium leading-relaxed selection:bg-blue-500/30">
                                   <ReactMarkdown>{decodedWeather}</ReactMarkdown>
                                 </div>
                               </motion.div>
                             )}
                           </AnimatePresence>

                           <button 
                             type="button"
                             onClick={() => onProcess(`As an AI Aviation Weather Consultant, please provide a professional AirclassPRO Intelligence briefing for the following weather at ${weatherData.icao}. 
                             
METAR: ${weatherData.metar}
TAF: ${weatherData.taf || 'Not available'}

Focus on operational impact, technical breakdown, and safety advice.`)}
                             className="w-full py-2 bg-blue-500/10 hover:bg-blue-500 text-blue-400 hover:text-white rounded-xl text-[9px] font-black uppercase tracking-widest transition-all border border-blue-500/20"
                           >
                             Analyze with AI Officer
                           </button>
                         </motion.div>
                       )}
                     </AnimatePresence>
                  </div>
               </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
            <div className="relative">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={`Ask about ${currentSubject.replace('-', ' ')}...`}
                className="w-full h-40 md:h-48 p-4 md:p-8 rounded-[1rem] md:rounded-[1.5rem] bg-gray-50 border-2 border-gray-100 focus:border-blue-500 focus:bg-white focus:outline-none transition-all resize-none text-base md:text-xl font-medium tracking-tight"
              />
              
              <div className="absolute bottom-4 right-4 md:bottom-6 md:right-6 flex items-center gap-2 md:gap-3">
                 <input 
                   type="file" 
                   ref={fileInputRef}
                   onChange={(e) => setFile(e.target.files?.[0] || null)}
                   accept=".pdf,.txt"
                   className="hidden"
                 />
                 
                 {file && (
                   <div className="flex items-center gap-1.5 md:gap-2 bg-blue-50 text-blue-700 px-2 md:px-4 py-1.5 md:py-2 rounded-lg md:rounded-xl text-[8px] md:text-xs font-black border border-blue-100 uppercase tracking-widest">
                      <FileText size={12} className="md:w-3.5 md:h-3.5" />
                      <span className="max-w-[60px] md:max-w-[120px] truncate">{file.name}</span>
                      <button onClick={() => setFile(null)} className="hover:text-red-500">
                        <X size={12} className="md:w-3.5 md:h-3.5" />
                      </button>
                   </div>
                 )}

                 <button
                   type="button"
                   onClick={() => fileInputRef.current?.click()}
                   className="p-3 md:p-4 bg-white text-gray-500 rounded-xl md:rounded-2xl hover:text-blue-600 shadow-sm border border-gray-200 transition-all hover:border-blue-200"
                 >
                   <Upload size={18} className="md:w-5.5 md:h-5.5" />
                 </button>

                 <button
                   disabled={isLoading || (!input.trim() && !file)}
                   className="p-3 md:p-4 bg-[#1B263B] text-white rounded-xl md:rounded-2xl hover:bg-black shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
                 >
                   {isLoading ? (
                     <motion.div 
                       animate={{ rotate: 360 }}
                       transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                     >
                       <Navigation size={18} className="md:w-5.5 md:h-5.5" />
                     </motion.div>
                   ) : (
                     <div className="flex items-center gap-2 px-1 md:px-2">
                       <span className="hidden sm:inline font-bold uppercase tracking-widest text-[10px] md:text-xs">Consult</span>
                       <Send size={18} className="md:w-5 md:h-5 group-hover:translate-x-1 transition-transform" />
                     </div>
                   )}
                 </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      <div className="space-y-2 md:space-y-3">
        <h3 className="text-[8px] md:text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] px-2 md:px-4">Expert Reference Prompts</h3>
        <div className="flex flex-wrap gap-2 md:gap-3">
          {DGCA_PROMPTS.map((p, i) => (
            <button
              key={i}
              onClick={() => onProcess(p.label)}
              className="flex items-center gap-2 bg-white border border-gray-200 p-2 md:p-3 px-3 md:px-5 rounded-xl md:rounded-2xl text-[10px] md:text-xs font-bold text-gray-700 hover:border-blue-400 hover:bg-blue-50 transition-all shadow-sm"
            >
              <p.icon size={12} className="text-blue-500 md:w-3.5 md:h-3.5" />
              {p.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
