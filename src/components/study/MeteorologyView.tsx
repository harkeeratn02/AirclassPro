import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  CloudSun, 
  Wind, 
  Compass,
  Plus,
  Clock,
  MapPin, 
  Search, 
  ArrowRight, 
  Sparkles, 
  AlertTriangle, 
  CheckCircle2, 
  Navigation, 
  Thermometer, 
  Droplets, 
  Gauge, 
  Star,
  Mic,
  Loader2,
  ChevronDown,
  Globe,
  Share2
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { WeatherData, weatherService } from '../../services/weatherService';
import { getWeatherBrief, decodeWeather, getWeatherResponse, getAIInstructorBriefing } from '../../services/aiConsultantService';
import { PRIORITY_AIRPORTS, Airport } from '../../constants/airports';

export default function MeteorologyView() {
  const [activeTab, setActiveTab] = useState<'regional' | 'route' | 'ai'>('regional');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentWeather, setCurrentWeather] = useState<WeatherData | null>(null);
  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Route planning state
  const [route, setRoute] = useState({ dep: '', arr: '' });
  const [routeWeather, setRouteWeather] = useState<{ dep: WeatherData | null, arr: WeatherData | null }>({ dep: null, arr: null });
  
  // AI State
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
  const [instructorBriefing, setInstructorBriefing] = useState<string | null>(null);
  const [aiQuestion, setAiQuestion] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [dgcaMode, setDgcaMode] = useState(false);
  
  // Calculations State
  const [runwayHeading, setRunwayHeading] = useState(270);
  const [xwind, setXwind] = useState(0);

  // Parsing METAR for wind
  useEffect(() => {
    if (currentWeather?.metar) {
      const windMatch = currentWeather.metar.match(/(\d{3})(\d{2,3})(G\d{2,3})?KT/);
      if (windMatch) {
        const windDir = parseInt(windMatch[1]);
        const windSpeed = parseInt(windMatch[2]);
        const angle = (windDir - runwayHeading) * (Math.PI / 180);
        const cross = windSpeed * Math.sin(angle);
        setXwind(cross);
      }
    }
  }, [currentWeather, runwayHeading]);
  
  const [favorites, setFavorites] = useState<string[]>(['VABB', 'VIDP', 'VCBI', 'RPLL', 'FAOR']);
  
  // Regional State
  const [selectedCountry, setSelectedCountry] = useState(PRIORITY_AIRPORTS[0].country);

  // Time state
  const [times, setTimes] = useState({
    utc: '',
    ist: '',
    sast: '',
    local: ''
  });

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setTimes({
        utc: now.toISOString().slice(11, 16) + ' Z',
        ist: new Date(now.getTime() + (5.5 * 60 * 60 * 1000)).toISOString().slice(11, 16) + ' IST',
        sast: new Date(now.getTime() + (2 * 60 * 60 * 1000)).toISOString().slice(11, 16) + ' SAST',
        local: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleSearch = async (icao: string) => {
    if (!icao || icao.length < 3) return;
    setIsFetching(true);
    setAiAnalysis(null);
    setInstructorBriefing(null);
    setError(null);
    try {
      const data = await weatherService.fetchWeather(icao.toUpperCase());
      setCurrentWeather(data);
      if (activeTab === 'ai') {
        setIsAiLoading(true);
        const [decoded, briefing] = await Promise.all([
          decodeWeather(data.icao, data.metar, data.taf),
          getAIInstructorBriefing(data.icao, data.metar, data.taf)
        ]);
        setAiAnalysis(decoded);
        setInstructorBriefing(briefing);
        setIsAiLoading(false);
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An unexpected error occurred.");
      setCurrentWeather(null);
    } finally {
      setIsFetching(false);
    }
  };

  const handleRouteSearch = async () => {
    if (!route.dep || !route.arr) return;
    setIsFetching(true);
    try {
      const [dep, arr] = await Promise.all([
        weatherService.fetchWeather(route.dep),
        weatherService.fetchWeather(route.arr)
      ]);
      setRouteWeather({ dep, arr });
    } catch (error) {
       console.error(error);
    } finally {
       setIsFetching(false);
    }
  };

  const askAI = async () => {
    if (!currentWeather || !aiQuestion) return;
    setIsAiLoading(true);
    try {
      const resp = await getWeatherResponse(aiQuestion, {
        icao: currentWeather.icao,
        metar: currentWeather.metar,
        taf: currentWeather.taf
      });
      setAiAnalysis(resp);
    } catch (error) {
      console.error(error);
    } finally {
      setIsAiLoading(false);
      setAiQuestion('');
    }
  };

  const startVoiceInput = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Voice recognition not supported in this browser.");
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript.toUpperCase().replace(/\s/g, '');
      if (transcript.length >= 4) {
        setSearchQuery(transcript.slice(0, 4));
        handleSearch(transcript.slice(0, 4));
      }
    };
    recognition.start();
  };

  const formatObsTime = (timestamp: number | null | undefined) => {
    if (!timestamp) return { utc: 'N/A', ist: 'N/A' };
    const date = new Date(timestamp * 1000);
    const utc = date.toISOString().slice(11, 16) + ' Z';
    const ist = new Date(date.getTime() + (5.5 * 60 * 60 * 1000)).toISOString().slice(11, 16) + ' IST';
    return { utc, ist };
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      {/* Disclaimer */}
      <div className="max-w-6xl mx-auto mb-6 bg-amber-50 border border-amber-200 p-3 rounded-xl flex items-center gap-3">
         <AlertTriangle size={16} className="text-amber-600 flex-shrink-0" />
         <p className="text-[10px] md:text-sm text-amber-800 font-medium">
           <strong>DISCLAIMER:</strong> This AI explanation is for study purposes only. Always get official weather briefing before flight. Check with ATC and MET office.
         </p>
      </div>

      <div className="max-w-6xl mx-auto grid lg:grid-cols-[1fr,350px] gap-8">
        <main className="space-y-8">
          {/* Header & Global Clock */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
             <div>
                <h1 className="text-3xl font-black text-slate-900 tracking-tighter mb-2">Met Intelligence Dashboard</h1>
                <p className="text-slate-500 font-medium">Global Aerodrome Monitoring & AI Analysis</p>
             </div>
             <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
                {[
                  { label: 'UTC', time: times.utc, color: 'text-blue-600' },
                  { label: 'IST', time: times.ist, color: 'text-orange-600' },
                  { label: 'SAST', time: times.sast, color: 'text-emerald-600' },
                  { label: 'LOCAL', time: times.local, color: 'text-slate-600' }
                ].map((t, i) => (
                  <div key={i} className="bg-white px-4 py-2 rounded-2xl shadow-sm border border-gray-100 min-w-[100px]">
                    <p className="text-[8px] font-black uppercase text-gray-400 mb-0.5">{t.label}</p>
                    <p className={`text-sm font-black font-mono ${t.color}`}>{t.time}</p>
                  </div>
                ))}
             </div>
          </div>

          {/* Search Bar */}
          <div className="space-y-4">
            <div className="bg-white p-2 rounded-[2rem] shadow-xl border border-gray-100 flex items-center gap-2">
               <div className="flex-1 relative">
                  <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <input 
                    type="text"
                    placeholder="Search Aerodrome ICAO (e.g. VABB, VIDP, FAOR)..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value.toUpperCase())}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch(searchQuery)}
                    className="w-full pl-16 pr-14 py-4 rounded-[1.5rem] bg-gray-50 border-none focus:ring-2 focus:ring-blue-500 font-bold text-slate-800 outline-none"
                  />
                  <button 
                    onClick={startVoiceInput}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-2 hover:bg-blue-50 text-slate-400 hover:text-blue-600 rounded-full transition-all"
                  >
                    <Mic size={20} />
                  </button>
               </div>
               <button 
                  onClick={() => handleSearch(searchQuery)}
                  className="bg-blue-600 text-white px-8 py-4 rounded-[1.5rem] font-black uppercase tracking-widest text-xs hover:bg-slate-900 transition-all flex items-center gap-2"
                  disabled={isFetching}
                >
                  {isFetching ? <Loader2 size={16} className="animate-spin" /> : <Globe size={16} />}
                  {isFetching ? 'Fetching...' : 'Fetch Live Data'}
               </button>
            </div>

            <AnimatePresence>
              {isFetching && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex items-center gap-2 ml-6 text-blue-600 font-black text-[10px] uppercase tracking-widest"
                >
                  <Loader2 size={12} className="animate-spin" />
                  Fetching live weather for {searchQuery || 'airport'}...
                </motion.div>
              )}

              {error && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="bg-red-50 border border-red-100 text-red-600 px-6 py-3 rounded-2xl flex items-center gap-3 ml-2 mr-2"
                >
                  <AlertTriangle size={16} />
                  <p className="text-xs font-bold uppercase tracking-wider">{error}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Section Tabs */}
          <div className="flex gap-4 border-b border-gray-200">
             {[
               { id: 'regional', label: 'Regional Feed', icon: Globe },
               { id: 'route', label: 'Route Comparison', icon: Navigation },
               { id: 'ai', label: 'AI expert', icon: Sparkles }
             ].map((tab) => (
               <button
                 key={tab.id}
                 onClick={() => setActiveTab(tab.id as any)}
                 className={`pb-4 px-4 text-xs font-black uppercase tracking-widest flex items-center gap-2 transition-all border-b-4 ${
                   activeTab === tab.id ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-400 hover:text-slate-600'
                 }`}
               >
                 <tab.icon size={14} />
                 {tab.label}
               </button>
             ))}
          </div>

          {/* Main Content Area */}
          <div className="min-h-[600px]">
             {activeTab === 'regional' && renderRegionalView()}
             {activeTab === 'route' && renderRouteView()}
             {activeTab === 'ai' && renderAIView()}
          </div>
        </main>

        {/* Sidebar */}
        <aside className="space-y-6">
           <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-2xl relative overflow-hidden group">
              <div className="relative z-10">
                 <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-blue-500/20 rounded-xl">
                       <CheckCircle2 size={20} className="text-blue-400" />
                    </div>
                    <h4 className="font-black text-xs uppercase tracking-widest">Regional Alerts</h4>
                 </div>
                 
                 <div className="space-y-4">
                    <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                       <p className="text-[10px] font-black text-blue-400 uppercase mb-2">Sri Lanka Specific</p>
                       <p className="text-xs text-slate-300 leading-relaxed">
                         Monsoon Season in progress. Southwest coast affected (May-Sept). High risk of CB and intense rain.
                       </p>
                    </div>
                    <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                       <p className="text-[10px] font-black text-amber-400 uppercase mb-2">Philippines Specific</p>
                       <p className="text-xs text-slate-300 leading-relaxed">
                         Typhoon season starting soon (June-Nov). Watch for ITCZ updates.
                       </p>
                    </div>
                    <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                       <p className="text-[10px] font-black text-emerald-400 uppercase mb-2">South Africa Specific</p>
                       <p className="text-xs text-slate-300 leading-relaxed">
                         Highveld afternoon storms (Johannesburg vicinity). Severe turbulence and hail risk.
                       </p>
                    </div>
                 </div>
              </div>
           </div>

           <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-xl">
              <h5 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-6 px-2 flex items-center justify-between">
                Favorite Airports
                <button className="text-blue-600 hover:scale-110 transition-transform"><Plus size={14} /></button>
              </h5>
              <div className="space-y-3">
                 {favorites.map((fav) => (
                    <button 
                      key={fav}
                      onClick={() => {
                        setSearchQuery(fav);
                        handleSearch(fav);
                      }}
                      className="w-full p-4 bg-gray-50 hover:bg-blue-50 hover:border-blue-200 border border-gray-50 rounded-2xl flex items-center justify-between transition-all group"
                    >
                       <div className="flex items-center gap-3">
                          <div className="p-2 bg-white rounded-lg group-hover:bg-blue-500 group-hover:text-white transition-colors">
                            <Star size={12} className={favorites.includes(fav) ? 'fill-amber-400 text-amber-400' : ''} />
                          </div>
                          <span className="font-black text-slate-800">{fav}</span>
                       </div>
                       <ChevronDown size={14} className="text-gray-300" />
                    </button>
                 ))}
              </div>
           </div>
        </aside>
      </div>
    </div>
  );

  function renderRegionalView() {
    return (
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
         <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide">
            {PRIORITY_AIRPORTS.map(country => (
              <button
                key={country.country}
                onClick={() => setSelectedCountry(country.country)}
                className={`px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all ${
                  selectedCountry === country.country 
                    ? 'bg-slate-900 text-white shadow-lg scale-105' 
                    : 'bg-white text-gray-500 border border-gray-100 hover:bg-gray-50'
                }`}
              >
                {country.country}
              </button>
            ))}
         </div>

         <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {PRIORITY_AIRPORTS.find(c => c.country === selectedCountry)?.airports.map(airport => (
              <AirportCard 
                key={airport.icao} 
                airport={airport} 
                onClick={() => {
                  setSearchQuery(airport.icao);
                  handleSearch(airport.icao);
                  setActiveTab('ai');
                }}
              />
            ))}
         </div>
      </div>
    );
  }

  function renderRouteView() {
    return (
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
         <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-gray-100">
            <h3 className="text-lg font-black text-slate-900 mb-8 flex items-center gap-2">
              <Navigation className="text-blue-600" size={24} />
              Route Connectivity Analysis
            </h3>
            
            <div className="grid md:grid-cols-3 gap-6 items-center">
               <div className="relative">
                  <p className="text-[10px] font-black text-gray-400 uppercase mb-2 ml-4">Departure</p>
                  <input 
                    type="text" 
                    placeholder="Enter ICAO" 
                    value={route.dep}
                    onChange={(e) => setRoute({...route, dep: e.target.value.toUpperCase()})}
                    className="w-full p-5 bg-gray-50 border border-gray-100 rounded-2xl font-black text-lg text-slate-900 uppercase focus:ring-2 focus:ring-blue-500 outline-none"
                   />
               </div>
               <div className="flex justify-center">
                  <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center border border-blue-100">
                     <ArrowRight size={20} />
                  </div>
               </div>
               <div className="relative">
                  <p className="text-[10px] font-black text-gray-400 uppercase mb-2 ml-4">Destination</p>
                  <input 
                    type="text" 
                    placeholder="Enter ICAO" 
                    value={route.arr}
                    onChange={(e) => setRoute({...route, arr: e.target.value.toUpperCase()})}
                    className="w-full p-5 bg-gray-50 border border-gray-100 rounded-2xl font-black text-lg text-slate-900 uppercase focus:ring-2 focus:ring-blue-500 outline-none"
                   />
               </div>
            </div>

            <button 
              onClick={handleRouteSearch}
              className="w-full mt-8 py-5 bg-slate-900 text-white rounded-3xl font-black uppercase tracking-[0.2em] hover:bg-blue-600 transition-all shadow-xl"
            >
               Compare Operational Weather
            </button>
         </div>

         {routeWeather.dep && routeWeather.arr && (
           <div className="grid md:grid-cols-2 gap-8">
              <WeatherDataColumn data={routeWeather.dep} label="Departure" />
              <WeatherDataColumn data={routeWeather.arr} label="Destination" />
           </div>
         )}
      </div>
    );
  }

  function renderAIView() {
    return (
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
         {currentWeather ? (
           <>
            <div className="grid md:grid-cols-2 gap-8">
                {/* Raw METAR Card */}
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-2xl relative overflow-hidden flex flex-col h-full border border-slate-800"
                >
                   <div className="absolute top-0 right-0 p-8 opacity-5">
                      <Wind size={120} />
                   </div>
                   <div className="relative z-10 flex flex-col h-full">
                      <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-3">
                           <div className="p-2 bg-slate-800 text-blue-400 rounded-xl border border-slate-700">
                              <Gauge size={20} />
                           </div>
                           <div>
                              <h4 className="font-black text-lg leading-tight uppercase tracking-tight">Raw METAR Stream</h4>
                              <p className="text-[10px] font-black uppercase text-blue-400 tracking-widest">{currentWeather.icao} Broadcast</p>
                           </div>
                        </div>
                        <div className="bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20">
                          <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Live</p>
                        </div>
                      </div>

                      <div className="flex-1 space-y-6">
                        <div className="bg-black/40 p-6 rounded-3xl border border-white/5 font-mono text-sm leading-relaxed text-blue-100 shadow-inner">
                           {currentWeather.metar}
                        </div>

                        {currentWeather.taf && (
                           <div className="space-y-3">
                              <p className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-2">Terminal Aerodrome Forecast (TAF)</p>
                              <div className="bg-black/20 p-6 rounded-3xl border border-white/5 font-mono text-[11px] leading-relaxed text-slate-400 whitespace-pre-wrap">
                                 {currentWeather.taf}
                              </div>
                           </div>
                        )}

                        <div className="grid grid-cols-2 gap-4">
                           <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                              <p className="text-[8px] font-black uppercase text-slate-500 mb-1">Observation</p>
                              <p className="font-bold text-xs text-slate-300">{formatObsTime(currentWeather.parsed?.obsTime).utc}</p>
                           </div>
                           <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                              <p className="text-[8px] font-black uppercase text-slate-500 mb-1">Local Time</p>
                              <p className="font-bold text-xs text-slate-300">{formatObsTime(currentWeather.parsed?.obsTime).ist}</p>
                           </div>
                        </div>
                      </div>
                   </div>
                </motion.div>

                {/* AI Instructor Briefing Card */}
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-slate-800 rounded-[2.5rem] p-8 text-white shadow-2xl relative overflow-hidden flex flex-col h-full border border-slate-700"
                >
                   <div className="absolute top-0 right-0 p-8 opacity-5">
                      <Sparkles size={120} className="text-blue-500" />
                   </div>
                   <div className="relative z-10 flex flex-col h-full">
                      <div className="flex items-center justify-between mb-8">
                         <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-600 text-white rounded-xl shadow-[0_0_15px_rgba(37,99,235,0.4)]">
                               <Sparkles size={20} />
                            </div>
                            <div>
                               <h4 className="font-black text-lg leading-tight uppercase tracking-tight">AI Flight Consultant</h4>
                               <p className="text-[10px] font-black uppercase text-blue-400 tracking-widest">Expert Systems Active</p>
                            </div>
                         </div>
                         <div className="flex bg-slate-900/50 p-1 rounded-xl border border-slate-700">
                            <button className="px-3 py-1 text-[8px] font-black uppercase bg-blue-600 text-white rounded-lg shadow-sm">Briefing</button>
                            <button className="px-3 py-1 text-[8px] font-black uppercase text-slate-500">History</button>
                         </div>
                      </div>
                      
                      <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                         {isAiLoading ? (
                            <div className="py-20 text-center space-y-6">
                               <div className="relative inline-block">
                                  <Loader2 size={48} className="text-blue-500 animate-spin" />
                                  <div className="absolute inset-0 bg-blue-500/20 blur-xl animate-pulse"></div>
                               </div>
                               <div>
                                  <p className="text-sm font-black uppercase tracking-[0.2em] text-blue-400 animate-pulse">Running Meteorological Analysis</p>
                                  <p className="text-[10px] text-slate-500 mt-2 font-medium">Decoding complex weather patterns...</p>
                               </div>
                            </div>
                         ) : instructorBriefing ? (
                            <div className="prose prose-invert prose-blue max-w-none prose-sm">
                               <div className="instructor-badge inline-flex items-center gap-2 bg-blue-500/10 text-blue-400 px-4 py-1.5 rounded-full border border-blue-500/20 mb-6 font-black text-[10px] uppercase tracking-widest">
                                  <Mic size={12} />
                                  Instructor Voice Active
                               </div>
                               <ReactMarkdown>{instructorBriefing}</ReactMarkdown>
                               
                               <div className="mt-8 pt-8 border-t border-slate-700 flex gap-4">
                                  <button 
                                    onClick={() => handleSearch(currentWeather.icao)}
                                    className="flex-1 py-3 bg-slate-900 border border-slate-700 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white hover:border-slate-500 transition-all"
                                  >
                                    Re-brief
                                  </button>
                                  <button 
                                    className="flex-1 py-3 bg-blue-600 rounded-xl text-[10px] font-black uppercase tracking-widest text-white shadow-lg hover:bg-blue-500 transition-all"
                                    onClick={() => setActiveTab('regional')}
                                  >
                                    Back to Map
                                  </button>
                               </div>
                            </div>
                         ) : (
                            <div className="py-20 text-center">
                               <button 
                                 onClick={() => handleSearch(currentWeather.icao)}
                                 className="px-10 py-5 bg-blue-600 hover:bg-blue-500 text-white rounded-[2rem] font-black uppercase tracking-widest text-xs shadow-2xl transition-all scale-110 active:scale-95"
                               >
                                 Generate AI Briefing
                               </button>
                               <p className="text-slate-500 text-[10px] mt-6 font-medium uppercase tracking-widest">Click to start expert consulting</p>
                            </div>
                         )}
                      </div>
                   </div>
                </motion.div>
            </div>

             {/* Calculations & Q&A */}
             <div className="grid lg:grid-cols-[1fr,400px] gap-8">
               <div className="bg-white p-8 md:p-10 rounded-[2.5rem] shadow-xl border border-gray-100 h-full">
                  <div className="flex items-center gap-3 mb-8">
                     <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
                        <Mic size={20} />
                     </div>
                     <h4 className="font-black text-xs uppercase tracking-widest text-slate-800">Operational Weather Consultant</h4>
                  </div>
                  
                  <div className="flex flex-col md:flex-row gap-4 mb-8">
                     <div className="flex-1 relative">
                        <input 
                           type="text" 
                           placeholder="Ask: 'Is it safe for VFR?' or 'What is the crosswind for RWY 09?'"
                           value={aiQuestion}
                           onChange={(e) => setAiQuestion(e.target.value)}
                           onKeyDown={(e) => e.key === 'Enter' && askAI()}
                           className="w-full p-5 bg-gray-50 border border-gray-200 rounded-3xl outline-none focus:ring-2 focus:ring-blue-500 font-medium text-slate-900"
                        />
                     </div>
                     <button 
                       onClick={askAI}
                       disabled={isAiLoading || !aiQuestion}
                       className="bg-slate-900 text-white px-10 py-5 rounded-3xl font-black uppercase tracking-widest text-xs hover:bg-blue-600 transition-all shadow-xl disabled:opacity-50"
                     >
                        Analyze
                     </button>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                      "VFR Safety Check",
                      "Runway 27 Drift",
                      "Fog Trend Analysis",
                      "Alternate Suggest"
                    ].map(q => (
                      <button 
                        key={q}
                        onClick={() => setAiQuestion(q)}
                        className="p-3 bg-gray-50 hover:bg-blue-50 rounded-xl text-[10px] font-bold text-slate-600 border border-gray-100 transition-all text-left"
                      >
                        {q}
                      </button>
                    ))}
                  </div>
               </div>

               <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-gray-100">
                  <div className="flex items-center gap-3 mb-6">
                     <div className="p-2 bg-orange-50 text-orange-600 rounded-xl">
                        <Compass size={20} />
                     </div>
                     <h4 className="font-black text-xs uppercase tracking-widest text-slate-800">X-Wind Component</h4>
                  </div>
                  <div className="space-y-4">
                     <div>
                        <label className="text-[8px] font-black uppercase text-gray-400 mb-1 block ml-2">Runway Heading (°)</label>
                        <input 
                          type="number" 
                          value={runwayHeading} 
                          onChange={(e) => setRunwayHeading(Number(e.target.value))}
                          className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl font-black text-center" 
                        />
                     </div>
                     <div className="relative pt-4 text-center">
                        <p className="text-3xl font-black text-blue-600">{Math.abs(Math.round(xwind))} KTS</p>
                        <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Crosswind Component</p>
                        <div className="mt-4 p-4 bg-blue-50 rounded-2xl border border-blue-100">
                           <p className="text-xs font-bold text-blue-800">
                              {Math.abs(xwind) > 15 ? '⚠️ CAUTION: EXCEEDS 15KTS' : 'SAFE FOR ALL CATEGORIES'}
                           </p>
                        </div>
                     </div>
                  </div>
               </div>
             </div>
            </>
          ) : (
            <div className="text-center py-40 bg-white rounded-[3rem] border-2 border-dashed border-gray-200">
               <CloudSun size={64} className="mx-auto text-blue-200 mb-6" />
               <h4 className="text-xl font-black text-slate-900 mb-2">Ready for MET Intelligence</h4>
               <p className="text-slate-500 max-w-sm mx-auto font-medium mb-8">
                 Search for any aerodrome ICAO above or pick a priority country to begin.
               </p>
               <div className="flex justify-center gap-4">
                  {favorites.slice(0, 3).map(f => (
                    <button 
                      key={f}
                      onClick={() => {
                         setSearchQuery(f);
                         handleSearch(f);
                      }}
                      className="px-6 py-2 bg-gray-50 hover:bg-blue-600 hover:text-white rounded-full text-[10px] font-black uppercase tracking-widest border border-gray-100 transition-all"
                    >
                      {f}
                    </button>
                  ))}
               </div>
            </div>
          )}
      </div>
    );
  }
}

function AirportCard({ airport, onClick }: { airport: Airport, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-xl hover:border-blue-200 transition-all text-left flex flex-col justify-between h-[180px] group"
    >
       <div>
          <div className="flex items-center justify-between mb-4">
             <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">{airport.icao}</span>
             <Share2 size={14} className="text-gray-300 group-hover:text-blue-500 transition-colors" />
          </div>
          <h4 className="font-black text-slate-900 leading-tight group-hover:text-blue-600 transition-colors">{airport.name}</h4>
          <p className="text-xs text-gray-500 font-medium">{airport.city}, {airport.country}</p>
       </div>
       <div className="flex items-center gap-2 text-[8px] font-black uppercase text-gray-400 mt-4">
          <Clock size={10} />
          View Live Feed
       </div>
    </button>
  );
}

function WeatherDataColumn({ data, label }: { data: WeatherData, label: string }) {
  const [decoded, setDecoded] = useState<string | null>(null);
  const [isDecoding, setIsDecoding] = useState(false);

  return (
    <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-gray-100 space-y-6">
       <div className="flex items-center justify-between">
          <div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{label}</p>
            <h4 className="text-2xl font-black text-slate-900 uppercase">{data.icao}</h4>
          </div>
          <button 
            onClick={async () => {
              setIsDecoding(true);
              const dec = await decodeWeather(data.icao, data.metar, data.taf);
              setDecoded(dec);
              setIsDecoding(false);
            }}
            className="p-3 bg-blue-50 text-blue-600 rounded-2xl hover:bg-blue-600 hover:text-white transition-all shadow-sm"
          >
            {isDecoding ? <Loader2 size={20} className="animate-spin" /> : <Sparkles size={20} />}
          </button>
       </div>

       <div className="space-y-4">
          <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100 font-mono text-sm leading-relaxed text-slate-700">
             {data.metar}
          </div>
          {data.taf && (
            <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100 font-mono text-[10px] leading-relaxed text-slate-500 whitespace-pre-wrap">
               {data.taf}
            </div>
          )}
          <AnimatePresence>
            {decoded && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-blue-50 p-5 rounded-2xl border border-blue-100 prose prose-slate prose-xs"
              >
                <ReactMarkdown>{decoded}</ReactMarkdown>
              </motion.div>
            )}
          </AnimatePresence>
       </div>
    </div>
  );
}

