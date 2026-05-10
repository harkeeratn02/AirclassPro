import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  FileCheck, 
  Calendar, 
  AlertTriangle, 
  ShieldCheck, 
  History, 
  TrendingUp,
  Award,
  BookOpen,
  Plus,
  Trash2,
  Save,
  BrainCircuit,
  Edit2,
  X,
  Plane,
  Clock,
  ArrowRight,
  Globe,
  Navigation
} from 'lucide-react';
import { AIRCRAFT_DATA } from '../../constants.ts';
import { LogbookEntry, UserProfile } from '../../types.ts';
import { getDateStatus, getStatusBg, getStatusColor } from '../../lib/dateUtils.ts';

interface LogbookViewProps {
  profile?: UserProfile | null;
  onUpdateProfile?: (data: Partial<UserProfile>) => void;
}

export default function LogbookView({ profile, onUpdateProfile }: LogbookViewProps) {
  const [logs, setLogs] = useState<LogbookEntry[]>([]);

  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const initialForm: Omit<LogbookEntry, 'id'> = {
    date: new Date().toISOString().split('T')[0],
    aircraftType: '',
    registration: '',
    depIcao: '',
    arrIcao: '',
    blockOff: '',
    blockOn: '',
    blockTime: 0,
    flightTime: 0,
    day: 0,
    night: 0,
    instrument: 0,
    crossCountry: 0,
    pic: 0,
    copilot: 0,
    dual: 0,
    solo: 0,
    takeoffsDay: 0,
    takeoffsNight: 0,
    landingsDay: 0,
    landingsNight: 0,
    remarks: ''
  };

  const [form, setForm] = useState(initialForm);

  // Load logs
  useEffect(() => {
    const saved = localStorage.getItem('airclass_logbook');
    if (saved) {
      setLogs(JSON.parse(saved));
    }
  }, []);

  const saveLogsToStorage = (newLogs: LogbookEntry[]) => {
    setLogs(newLogs);
    localStorage.setItem('airclass_logbook', JSON.stringify(newLogs));
  };
  const [sortConfig, setSortConfig] = useState<{ key: string, direction: 'asc' | 'desc' }>({ key: 'date', direction: 'desc' });

  const sortedLogs = [...logs].sort((a, b) => {
    const aVal = (a as any)[sortConfig.key];
    const bVal = (b as any)[sortConfig.key];
    
    if (['duration', 'landings', 'pic', 'solo', 'night', 'instrument'].includes(sortConfig.key)) {
      return sortConfig.direction === 'asc' 
        ? parseFloat(aVal || '0') - parseFloat(bVal || '0')
        : parseFloat(bVal || '0') - parseFloat(aVal || '0');
    }
    
    if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
    if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
    return 0;
  });

  const handleSort = (key: string) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'desc' ? 'asc' : 'desc'
    }));
  };

  const totalMinutes = logs.reduce((acc, log) => acc + (log.flightTime || 0), 0);
  const totalNightMinutes = logs.reduce((acc, log) => acc + (log.night || 0), 0);
  const totalInstrumentMinutes = logs.reduce((acc, log) => acc + (log.instrument || 0), 0);
  const totalPicMinutes = logs.reduce((acc, log) => acc + (log.pic || 0), 0);

  const formatHrs = (min: number) => (min / 60).toFixed(1);

  const getStatsForPeriod = (days: number) => {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);
    return logs.filter(l => new Date(l.date) >= cutoff).reduce((acc, l) => acc + l.flightTime, 0);
  };

  const stats = {
    total: formatHrs(totalMinutes),
    last28: formatHrs(getStatsForPeriod(28)),
    last90: formatHrs(getStatsForPeriod(90)),
    last12m: formatHrs(getStatsForPeriod(365)),
    pic: formatHrs(totalPicMinutes),
    night: formatHrs(totalNightMinutes),
    instrument: formatHrs(totalInstrumentMinutes)
  };

  const currencyData = {
    medical: profile?.medicalExpiry || '',
    flightReview: profile?.flightReviewDate || '',
    licenseExpiry: profile?.licenseExpiry || '',
    bfrDueDate: profile?.bfrDueDate || '',
    ifrCurrency: true,
    nightLanding: 3,
  };

  const medicalStatus = getDateStatus(currencyData.medical);
  const flightReviewStatus = getDateStatus(currencyData.flightReview);
  const licenseExpiryStatus = getDateStatus(currencyData.licenseExpiry);
  const bfrDueStatus = getDateStatus(currencyData.bfrDueDate);

  const expiringSoon = [
    { label: 'Medical Certificate', status: medicalStatus },
    { label: 'Flight Review', status: flightReviewStatus },
    { label: 'License', status: licenseExpiryStatus },
    { label: 'BFR', status: bfrDueStatus }
  ].filter(s => s.status.severity === 'red' && s.status.daysRemaining >= 0);

  const milestones = [
    { title: 'Commercial Pilot License', progress: Math.min(Math.round((parseFloat(stats.total) / 200) * 100), 100), color: 'bg-blue-500' },
    { title: 'Radio Telephony (RTR)', progress: 100, color: 'bg-green-500' },
    { title: 'Multi-Engine Rating', progress: 30, color: 'bg-orange-500' },
  ];

  const startEditing = (log: any) => {
    setEditingId(log.id);
    // Since we've changed the structure, we'd need a more complex edit form
    // For now, let's just allow deletion/addition
  };

  const saveEdit = () => {
    setEditingId(null);
  };

  const handleDeleteLog = (id: string) => {
    if (confirm('Delete this flight record?')) {
      setLogs(logs.filter(l => l.id !== id));
    }
  };

  return (
    <div className="grid lg:grid-cols-[1fr,350px] gap-8 pb-12">
      <div className="space-y-8">
        {/* Alert Banners */}
        {expiringSoon.map((item, i) => (
          <div key={i} className="bg-red-50 border border-red-100 p-6 rounded-3xl flex items-center gap-4 animate-in slide-in-from-top-4">
            <div className="p-3 bg-white text-red-600 rounded-xl shadow-sm">
              <AlertTriangle size={24} />
            </div>
            <div>
              <h4 className="font-black text-sm uppercase text-red-900">Expiry Warning</h4>
              <p className="text-sm text-red-700">⚠️ Your {item.label.toLowerCase()} expires in <span className="font-bold">{item.status.daysRemaining} days</span>. Please renew soon.</p>
            </div>
          </div>
        ))}

      <div className="grid md:grid-cols-2 gap-8">
        {/* Currency Card */}
        <section className="bg-[#1B263B] text-white p-8 rounded-[2rem] shadow-2xl relative overflow-hidden">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2 bg-blue-500 text-white rounded-xl">
               <ShieldCheck size={20} />
            </div>
            <h3 className="font-black uppercase tracking-tight text-lg">Operational Readiness</h3>
          </div>

          <div className="space-y-6">
            <div className={`p-4 rounded-2xl border transition-all ${getStatusBg(medicalStatus.severity)}/10 ${medicalStatus.severity === 'none' ? 'border-white/10' : ''}`}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <Calendar size={18} className="text-blue-400" />
                  <span className="text-sm font-bold uppercase tracking-widest text-white/70">Medical Expiry</span>
                </div>
                <input 
                  type="date" 
                  value={currencyData.medical} 
                  onChange={(e) => onUpdateProfile?.({ medicalExpiry: e.target.value })}
                  className="bg-transparent font-mono font-bold text-white outline-none cursor-pointer"
                />
              </div>
              <p className={`text-[10px] font-black uppercase italic ${getStatusColor(medicalStatus.severity)}`}>
                {medicalStatus.label}
              </p>
            </div>

            <div className={`p-4 rounded-2xl border transition-all ${getStatusBg(flightReviewStatus.severity)}/10 ${flightReviewStatus.severity === 'none' ? 'border-white/10' : ''}`}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <Award size={18} className="text-blue-400" />
                  <span className="text-sm font-bold uppercase tracking-widest text-white/70">Flight Review</span>
                </div>
                <input 
                  type="date" 
                  value={currencyData.flightReview} 
                  onChange={(e) => onUpdateProfile?.({ flightReviewDate: e.target.value })}
                  className="bg-transparent font-mono font-bold text-white outline-none cursor-pointer"
                />
              </div>
              <p className={`text-[10px] font-black uppercase italic ${getStatusColor(flightReviewStatus.severity)}`}>
                {flightReviewStatus.label}
              </p>
            </div>

            <div className={`p-4 rounded-2xl border transition-all ${getStatusBg(licenseExpiryStatus.severity)}/10 ${licenseExpiryStatus.severity === 'none' ? 'border-white/10' : ''}`}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <FileCheck size={18} className="text-blue-400" />
                  <span className="text-sm font-bold uppercase tracking-widest text-white/70">License Expiry</span>
                </div>
                <input 
                  type="date" 
                  value={currencyData.licenseExpiry} 
                  onChange={(e) => onUpdateProfile?.({ licenseExpiry: e.target.value })}
                  className="bg-transparent font-mono font-bold text-white outline-none cursor-pointer"
                />
              </div>
              <p className={`text-[10px] font-black uppercase italic ${getStatusColor(licenseExpiryStatus.severity)}`}>
                {licenseExpiryStatus.label}
              </p>
            </div>

            <div className={`p-4 rounded-2xl border transition-all ${getStatusBg(bfrDueStatus.severity)}/10 ${bfrDueStatus.severity === 'none' ? 'border-white/10' : ''}`}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <History size={18} className="text-blue-400" />
                  <span className="text-sm font-bold uppercase tracking-widest text-white/70">BFR Due Date</span>
                </div>
                <input 
                  type="date" 
                  value={currencyData.bfrDueDate} 
                  onChange={(e) => onUpdateProfile?.({ bfrDueDate: e.target.value })}
                  className="bg-transparent font-mono font-bold text-white outline-none cursor-pointer"
                />
              </div>
              <p className={`text-[10px] font-black uppercase italic ${getStatusColor(bfrDueStatus.severity)}`}>
                {bfrDueStatus.label}
              </p>
            </div>
          </div>
        </section>

        {/* Career Progress */}
        <section className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-xl">
           <div className="flex items-center gap-3 mb-8">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
               <TrendingUp size={20} />
            </div>
            <h3 className="font-black uppercase tracking-tight text-lg">Goal Tracker</h3>
          </div>

          <div className="space-y-8">
            {milestones.map((m, i) => (
              <div key={i} className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase text-gray-500">{m.title}</span>
                  <span className="text-xs font-bold text-blue-600">{m.progress}%</span>
                </div>
                <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                   <motion.div 
                     initial={{ width: 0 }}
                     animate={{ width: `${m.progress}%` }}
                     className={`h-full ${m.color}`}
                   />
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Flight Logs Summary */}
      <section className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-xl overflow-hidden">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
              <History size={20} />
            </div>
            <h3 className="font-black uppercase tracking-tight text-lg">Detailed Flight Logs</h3>
          </div>
          <button 
            onClick={() => setIsAdding(true)}
            className="p-3 bg-blue-600 text-white rounded-xl hover:bg-black transition-all flex items-center gap-2 text-xs font-black uppercase tracking-widest"
          >
            <Plus size={16} /> New Entry
          </button>
        </div>

        <AnimatePresence>
          {isAdding && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="mb-8 p-8 bg-gray-50 rounded-[2.5rem] border border-gray-100 overflow-hidden"
            >
              <div className="grid md:grid-cols-4 gap-6 mb-6">
                <div className="space-y-1">
                  <label className="text-[8px] font-black uppercase text-gray-400">Date</label>
                  <input type="date" value={form.date} onChange={e => setForm({...form, date: e.target.value})} className="w-full p-3 bg-white border border-gray-200 rounded-xl text-xs font-bold" />
                </div>
                <div className="space-y-1">
                  <label className="text-[8px] font-black uppercase text-gray-400">Aircraft Type</label>
                  <select value={form.aircraftType} onChange={e => setForm({...form, aircraftType: e.target.value})} className="w-full p-3 bg-white border border-gray-200 rounded-xl text-xs font-bold">
                    <option value="">Select Type...</option>
                    {AIRCRAFT_DATA.map(a => <option key={a.type} value={a.type}>{a.type}</option>)}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[8px] font-black uppercase text-gray-400">Registration</label>
                  <input type="text" placeholder="VT-XXX" value={form.registration} onChange={e => setForm({...form, registration: e.target.value.toUpperCase()})} className="w-full p-3 bg-white border border-gray-200 rounded-xl text-xs font-bold" />
                </div>
                <div className="flex gap-2">
                   <div className="space-y-1 flex-1">
                     <label className="text-[8px] font-black uppercase text-gray-400">Dep</label>
                     <input type="text" placeholder="ICAO" value={form.depIcao} onChange={e => setForm({...form, depIcao: e.target.value.toUpperCase()})} className="w-full p-3 bg-white border border-gray-200 rounded-xl text-xs font-bold" />
                   </div>
                   <div className="space-y-1 flex-1">
                     <label className="text-[8px] font-black uppercase text-gray-400">Arr</label>
                     <input type="text" placeholder="ICAO" value={form.arrIcao} onChange={e => setForm({...form, arrIcao: e.target.value.toUpperCase()})} className="w-full p-3 bg-white border border-gray-200 rounded-xl text-xs font-bold" />
                   </div>
                </div>
              </div>

              <div className="grid md:grid-cols-4 gap-6 mb-6">
                <div className="space-y-1">
                  <label className="text-[8px] font-black uppercase text-gray-400">Block Off (UTC)</label>
                  <input type="time" value={form.blockOff} onChange={e => setForm({...form, blockOff: e.target.value})} className="w-full p-3 bg-white border border-gray-200 rounded-xl text-xs font-bold" />
                </div>
                <div className="space-y-1">
                  <label className="text-[8px] font-black uppercase text-gray-400">Block On (UTC)</label>
                  <input type="time" value={form.blockOn} onChange={e => setForm({...form, blockOn: e.target.value})} className="w-full p-3 bg-white border border-gray-200 rounded-xl text-xs font-bold" />
                </div>
                <div className="space-y-1">
                  <label className="text-[8px] font-black uppercase text-gray-400">Flight Time (MINS)</label>
                  <input type="number" value={form.flightTime} onChange={e => setForm({...form, flightTime: parseInt(e.target.value) || 0})} className="w-full p-3 bg-white border border-gray-200 rounded-xl text-xs font-bold" />
                </div>
                <div className="space-y-1">
                  <label className="text-[8px] font-black uppercase text-gray-400">PIC Time (MINS)</label>
                  <input type="number" value={form.pic} onChange={e => setForm({...form, pic: parseInt(e.target.value) || 0})} className="w-full p-3 bg-white border border-gray-200 rounded-xl text-xs font-bold" />
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-6">
                 <div className="space-y-1">
                   <label className="text-[8px] font-black uppercase text-gray-400">Night</label>
                   <input type="number" value={form.night} onChange={e => setForm({...form, night: parseInt(e.target.value) || 0})} className="w-full p-2 bg-white border border-gray-200 rounded-xl text-[10px] font-bold" />
                 </div>
                 <div className="space-y-1">
                   <label className="text-[8px] font-black uppercase text-gray-400">Inst.</label>
                   <input type="number" value={form.instrument} onChange={e => setForm({...form, instrument: parseInt(e.target.value) || 0})} className="w-full p-2 bg-white border border-gray-200 rounded-xl text-[10px] font-bold" />
                 </div>
                 <div className="space-y-1">
                   <label className="text-[8px] font-black uppercase text-gray-400">X-Country</label>
                   <input type="number" value={form.crossCountry} onChange={e => setForm({...form, crossCountry: parseInt(e.target.value) || 0})} className="w-full p-2 bg-white border border-gray-200 rounded-xl text-[10px] font-bold" />
                 </div>
                 <div className="space-y-1">
                   <label className="text-[8px] font-black uppercase text-gray-400">Takeoffs (D/N)</label>
                   <div className="flex gap-1">
                     <input type="number" placeholder="D" value={form.takeoffsDay} onChange={e => setForm({...form, takeoffsDay: parseInt(e.target.value) || 0})} className="w-full p-2 bg-white border border-gray-200 rounded-xl text-[10px] font-bold" />
                     <input type="number" placeholder="N" value={form.takeoffsNight} onChange={e => setForm({...form, takeoffsNight: parseInt(e.target.value) || 0})} className="w-full p-2 bg-white border border-gray-200 rounded-xl text-[10px] font-bold" />
                   </div>
                 </div>
                 <div className="space-y-1">
                   <label className="text-[8px] font-black uppercase text-gray-400">Landings (D/N)</label>
                   <div className="flex gap-1">
                     <input type="number" placeholder="D" value={form.landingsDay} onChange={e => setForm({...form, landingsDay: parseInt(e.target.value) || 0})} className="w-full p-2 bg-white border border-gray-200 rounded-xl text-[10px] font-bold" />
                     <input type="number" placeholder="N" value={form.landingsNight} onChange={e => setForm({...form, landingsNight: parseInt(e.target.value) || 0})} className="w-full p-2 bg-white border border-gray-200 rounded-xl text-[10px] font-bold" />
                   </div>
                 </div>
                 <div className="space-y-1">
                   <label className="text-[8px] font-black uppercase text-gray-400">Solo/Dual</label>
                   <div className="flex gap-1">
                     <input type="number" placeholder="S" value={form.solo} onChange={e => setForm({...form, solo: parseInt(e.target.value) || 0})} className="w-full p-2 bg-white border border-gray-200 rounded-xl text-[10px] font-bold" />
                     <input type="number" placeholder="D" value={form.dual} onChange={e => setForm({...form, dual: parseInt(e.target.value) || 0})} className="w-full p-2 bg-white border border-gray-200 rounded-xl text-[10px] font-bold" />
                   </div>
                 </div>
              </div>

              <div className="space-y-1 mb-6">
                <label className="text-[8px] font-black uppercase text-gray-400">Remarks / Endorsements</label>
                <textarea 
                  value={form.remarks} 
                  onChange={e => setForm({...form, remarks: e.target.value})}
                  className="w-full p-3 bg-white border border-gray-200 rounded-xl text-xs font-medium h-20 outline-none focus:border-blue-500 transition-colors"
                  placeholder="Enter remarks, instructor signature placeholder, etc."
                />
              </div>

              <div className="flex gap-4">
                 <button 
                  onClick={() => {
                    const entry: LogbookEntry = { ...form, id: Date.now().toString(), blockTime: 0 }; // simplified
                    saveLogsToStorage([...logs, entry].sort((a,b) => b.date.localeCompare(a.date)));
                    setIsAdding(false);
                    setForm(initialForm);
                  }} 
                  className="flex-1 py-4 bg-blue-600 text-white rounded-[2rem] hover:bg-black transition-all flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest"
                 >
                   <Save size={16} /> Archive Entry
                 </button>
                 <button 
                  onClick={() => setIsAdding(false)} 
                  className="flex-1 py-4 bg-gray-200 text-gray-600 rounded-[2rem] hover:bg-gray-300 transition-all text-[10px] font-black uppercase tracking-widest"
                 >
                   Discard
                 </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        <div className="overflow-x-auto">
          <table className="w-full text-[10px]">
            <thead>
              <tr className="text-left text-gray-400 font-black uppercase tracking-tighter border-b border-gray-100 italic">
                <th className="pb-4">Date</th>
                <th className="pb-4">Reg/Type</th>
                <th className="pb-4">Sector</th>
                <th className="pb-4">Duration</th>
                <th className="pb-4">Nite/Inst/XC</th>
                <th className="pb-4">PIC/Solo/Dual</th>
                <th className="pb-4">Landings</th>
                <th className="pb-4 text-right">Ops</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 text-slate-800">
              {sortedLogs.map((log) => (
                <tr key={log.id} className="hover:bg-blue-50/30 transition-all group">
                   <td className="py-4 font-mono text-gray-400">{log.date}</td>
                   <td className="py-4">
                      <div className="font-black text-blue-600">{log.registration}</div>
                      <div className="text-[8px] font-bold text-gray-400">{log.aircraftType}</div>
                   </td>
                   <td className="py-4">
                      <div className="flex items-center gap-1 font-black italic">
                         <span>{log.depIcao}</span>
                         <ArrowRight size={10} className="text-gray-300" />
                         <span>{log.arrIcao}</span>
                      </div>
                   </td>
                   <td className="py-4 font-mono font-black">{(log.flightTime / 60).toFixed(1)}H</td>
                   <td className="py-4">
                      <div className="flex gap-2">
                         <span title="Night" className={log.night > 0 ? "text-orange-500 font-bold" : "text-gray-200"}>N:{(log.night/60).toFixed(1)}</span>
                         <span title="Instrument" className={log.instrument > 0 ? "text-blue-500 font-bold" : "text-gray-200"}>I:{(log.instrument/60).toFixed(1)}</span>
                         <span title="X-Country" className={log.crossCountry > 0 ? "text-emerald-500 font-bold" : "text-gray-200"}>X:{(log.crossCountry/60).toFixed(1)}</span>
                      </div>
                   </td>
                   <td className="py-4">
                      <div className="flex gap-2 font-bold">
                         <span title="PIC" className={log.pic > 0 ? "text-slate-900" : "text-gray-200"}>P:{(log.pic/60).toFixed(1)}</span>
                         <span title="Solo" className={log.solo > 0 ? "text-slate-900" : "text-gray-200"}>S:{(log.solo/60).toFixed(1)}</span>
                         <span title="Dual" className={log.dual > 0 ? "text-slate-900" : "text-gray-200"}>D:{(log.dual/60).toFixed(1)}</span>
                      </div>
                   </td>
                   <td className="py-4">
                      <div className="flex flex-col text-[8px] font-black">
                         <span>D: {log.landingsDay}</span>
                         <span>N: {log.landingsNight}</span>
                      </div>
                   </td>
                   <td className="py-4 text-right">
                      <button onClick={() => saveLogsToStorage(logs.filter(l => l.id !== log.id))} className="opacity-0 group-hover:opacity-100 p-2 text-red-400 hover:bg-red-50 rounded-lg transition-all"><Trash2 size={14}/></button>
                   </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>

    {/* Log Assistant Monitor */}
    <aside className="space-y-6">
       <div className="bg-orange-600 rounded-[2.5rem] p-8 text-white shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16" />
          <div className="relative z-10">
             <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-white/20 rounded-xl">
                   <BrainCircuit size={20} />
                </div>
                <h4 className="font-black text-xs uppercase tracking-widest">Logbook Auditor</h4>
             </div>
             <p className="text-xs text-orange-100 mb-8 leading-relaxed font-medium">
               "I'm cross-referencing your {stats.total} logged hours against CPL requirements. You need {Math.max(0, 200 - parseFloat(stats.total)).toFixed(1)} more hours total to meet the 200h minimum."
             </p>
             <button className="w-full py-4 bg-black text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all">
                Forecast Eligibility
             </button>
          </div>
       </div>

       <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-xl">
           <h5 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Hour breakdown</h5>
           <div className="space-y-4">
              {[
                { label: 'Total Logged', value: stats.total, target: '200' },
                { label: 'Total PIC', value: stats.pic, target: '100' },
                { label: 'Night Hours', value: stats.night, target: '50' },
                { label: 'Instrument', value: stats.instrument, target: '40' }
              ].map((stat, i) => (
                 <div key={i} className="space-y-2">
                    <div className="flex justify-between text-[10px] font-bold">
                       <span className="text-gray-500 uppercase">{stat.label}</span>
                       <span className="text-gray-900">{stat.value} / {stat.target}</span>
                    </div>
                    <div className="h-1.5 w-full bg-gray-50 rounded-full overflow-hidden">
                       <div 
                         className="h-full bg-blue-600" 
                         style={{ width: `${(Number(stat.value) / Number(stat.target)) * 100}%` }}
                       />
                    </div>
                 </div>
              ))}
           </div>
       </div>
    </aside>
  </div>
  );
}
