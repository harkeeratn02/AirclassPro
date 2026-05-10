import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Calculator, Fuel, Scale, Wind, Thermometer, Clock, Plane, MapPin, BrainCircuit, RotateCcw, Search, ChevronRight } from 'lucide-react';
import { AIRCRAFT_DATA } from '../../constants';

export default function PlanningTools() {
  const [selectedAircraft, setSelectedAircraft] = useState(AIRCRAFT_DATA[3]); // Default to C172
  const [aircraftSearch, setAircraftSearch] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  
  const [weight, setWeight] = useState({ pilot: 170, fuel: 300, baggage: 50 }); // lbs
  const [distance, setDistance] = useState(250); // NM
  const [wind, setWind] = useState({ dir: 270, speed: 20 });
  const [track, setTrack] = useState(0); // Magnetic Track
  const [aerodromes, setAerodromes] = useState({ dep: 'VIDP', arr: 'VIJP', alt: 'VILR' });

  // Filter aircraft
  const filteredAircraft = AIRCRAFT_DATA.filter(ac => 
    ac.type.toLowerCase().includes(aircraftSearch.toLowerCase()) ||
    ac.family.toLowerCase().includes(aircraftSearch.toLowerCase())
  ).slice(0, 50);

  const aircraft = selectedAircraft;
  const totalWeight = aircraft.emptyWeight + weight.pilot + weight.fuel + weight.baggage;

  // Wind Correction Math
  const windRad = (wind.dir - track + 180) * (Math.PI / 180);
  const headwind = wind.speed * Math.cos(windRad);
  const crosswind = wind.speed * Math.sin(windRad);
  
  const wcaRad = Math.asin(crosswind / aircraft.cruiseSpeed) || 0;
  const wca = wcaRad * (180 / Math.PI);
  const gs = aircraft.cruiseSpeed * Math.cos(wcaRad) - headwind;

  const timeEnroute = (distance / Math.max(gs, 1)) * 60; // mins
  const tripFuel = (timeEnroute / 60) * aircraft.fuelBurnGPH * 6; // Approx 6 lbs per gallon for AVGAS/JET-A (simplified)
  const contingency = tripFuel * 0.05; // 5%
  const alternateFuel = (30 / 60) * aircraft.fuelBurnGPH * 6; // 30 min flight to alt
  const finalReserve = (45 / 60) * aircraft.fuelBurnGPH * 6; // 45 min reserve
  const totalFuelRequired = tripFuel + contingency + alternateFuel + finalReserve;

  return (
    <div className="grid lg:grid-cols-[1fr,350px] gap-8 pb-12">
      <div className="space-y-8">
        {/* Aircraft Selection */}
        <div className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-xl relative z-20">
           <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-purple-50 text-purple-600 rounded-2xl">
                 <Plane size={24} />
              </div>
              <div className="flex-1">
                 <h4 className="text-xs font-black uppercase tracking-widest text-gray-400">Selected Platform</h4>
                 <p className="text-lg font-black text-slate-900">{aircraft.type}</p>
              </div>
           </div>
           
           <div className="relative">
              <div className="flex items-center bg-gray-50 border border-gray-100 rounded-2xl p-4 focus-within:border-blue-500 transition-all">
                 <Search className="text-gray-400 mr-3" size={18} />
                 <input 
                   type="text" 
                   placeholder="Search or Select Aircraft Type..."
                   className="bg-transparent outline-none flex-1 text-sm font-bold text-slate-800"
                   value={aircraftSearch}
                   onFocus={() => setShowDropdown(true)}
                   onChange={(e) => {
                     setAircraftSearch(e.target.value);
                     setShowDropdown(true);
                   }}
                 />
              </div>

              <AnimatePresence>
                 {showDropdown && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-100 rounded-2xl shadow-2xl overflow-hidden z-50 p-2"
                    >
                       {filteredAircraft.length > 0 ? (
                         filteredAircraft.map(ac => (
                           <button
                             key={ac.type}
                             onClick={() => {
                               setSelectedAircraft(ac);
                               setAircraftSearch(ac.type);
                               setShowDropdown(false);
                             }}
                             className="w-full p-4 hover:bg-blue-50 rounded-xl flex items-center justify-between group transition-colors"
                           >
                             <div className="text-left">
                                <p className="text-sm font-black text-slate-800">{ac.type}</p>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{ac.category} • {ac.engineType}</p>
                             </div>
                             <ChevronRight size={16} className="text-gray-300 group-hover:text-blue-500 transition-colors" />
                           </button>
                         ))
                       ) : (
                         <div className="p-8 text-center">
                            <p className="text-sm font-black text-gray-400 italic">No matching aircraft found</p>
                         </div>
                       )}
                    </motion.div>
                 )}
              </AnimatePresence>
           </div>

           <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 mt-4">
              {[
                'Cessna 172 Skyhawk', 
                'Piper PA28 Archer', 
                'Diamond DA40', 
                'Diamond DA42', 
                'Beechcraft Bonanza G36', 
                'Boeing 737-800', 
                'Airbus A320', 
                'ATR 72'
              ].map(t => (
                <button
                  key={t}
                  onClick={() => {
                    const found = AIRCRAFT_DATA.find(a => a.type === t);
                    if (found) setSelectedAircraft(found);
                  }}
                  className={`p-3 rounded-xl text-[8px] font-black uppercase tracking-widest transition-all ${
                    aircraft.type === t ? 'bg-blue-600 text-white' : 'bg-gray-50 text-gray-400 hover:bg-gray-100'
                  }`}
                >
                  {t.split(' ').slice(0, 2).join(' ')}
                </button>
              ))}
           </div>
        </div>

        {/* Route Details */}
        <div className="grid md:grid-cols-3 gap-4">
           <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-xl flex items-center gap-4">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
                 <MapPin size={24} />
              </div>
              <div className="flex-1">
                 <label className="text-[10px] font-black uppercase text-gray-400 block mb-1">Departure</label>
                 <input 
                    type="text" 
                    value={aerodromes.dep} 
                    onChange={e => setAerodromes({...aerodromes, dep: e.target.value.toUpperCase()})}
                    className="w-full font-black text-xl outline-none text-slate-800"
                 />
              </div>
           </div>
           <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-xl flex items-center gap-4">
              <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl">
                 <Plane size={24} />
              </div>
              <div className="flex-1">
                 <label className="text-[10px] font-black uppercase text-gray-400 block mb-1">Arrival</label>
                 <input 
                    type="text" 
                    value={aerodromes.arr} 
                    onChange={e => setAerodromes({...aerodromes, arr: e.target.value.toUpperCase()})}
                    className="w-full font-black text-xl outline-none text-slate-800"
                 />
              </div>
           </div>
           <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-xl flex items-center gap-4">
              <div className="p-3 bg-orange-50 text-orange-600 rounded-2xl">
                 <RotateCcw size={20} />
              </div>
              <div className="flex-1">
                 <label className="text-[10px] font-black uppercase text-gray-400 block mb-1">Alternate</label>
                 <input 
                    type="text" 
                    value={aerodromes.alt} 
                    onChange={e => setAerodromes({...aerodromes, alt: e.target.value.toUpperCase()})}
                    className="w-full font-black text-xl outline-none text-slate-800"
                 />
              </div>
           </div>
        </div>

        {/* Planning Engine */}
        <section className="bg-slate-900 text-white p-10 rounded-[2.5rem] shadow-2xl relative overflow-hidden border border-white/5">
          <div className="absolute top-0 right-0 p-8 opacity-[0.03]">
             <BrainCircuit size={160} />
          </div>
          
          <div className="flex items-center gap-3 mb-8 relative z-10">
            <div className="p-2 bg-blue-500 text-white rounded-xl">
              <Wind size={20} />
            </div>
            <h3 className="font-black uppercase tracking-tight text-lg">Planning Engine (CR-3 Logic)</h3>
          </div>

          <div className="grid md:grid-cols-4 gap-6 relative z-10">
            <div>
              <label className="text-[10px] font-black uppercase text-blue-400 block mb-2">Distance (NM)</label>
              <input type="number" value={distance} onChange={e => setDistance(Number(e.target.value))} className="w-full p-4 bg-white/5 border border-white/10 rounded-xl font-mono text-lg outline-none" />
            </div>
            <div>
              <label className="text-[10px] font-black uppercase text-blue-400 block mb-2">Mag Track (°)</label>
              <input type="number" value={track} onChange={e => setTrack(Number(e.target.value))} className="w-full p-4 bg-white/5 border border-white/10 rounded-xl font-mono text-lg outline-none" />
            </div>
            <div>
              <label className="text-[10px] font-black uppercase text-blue-400 block mb-2">Wind (Dir/Spd)</label>
              <div className="flex gap-2">
                <input type="number" value={wind.dir} onChange={e => setWind({...wind, dir: Number(e.target.value)})} className="w-1/2 p-4 bg-white/5 border border-white/10 rounded-xl font-mono text-lg outline-none" />
                <input type="number" value={wind.speed} onChange={e => setWind({...wind, speed: Number(e.target.value)})} className="w-1/2 p-4 bg-white/5 border border-white/10 rounded-xl font-mono text-lg outline-none" />
              </div>
            </div>
            <div>
              <label className="text-[10px] font-black uppercase text-blue-400 block mb-2">TAS (KTS)</label>
              <div className="w-full p-4 bg-white/10 border border-blue-500/30 rounded-xl font-mono text-lg text-blue-300">{aircraft.cruiseSpeed}</div>
            </div>
          </div>

          <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-4 relative z-10">
            <div className="bg-white/5 p-5 rounded-2xl border border-white/10">
              <p className="text-[10px] font-black text-blue-400 uppercase mb-1">Time Enroute</p>
              <p className="text-2xl font-black">{Math.round(timeEnroute)} min</p>
            </div>
            <div className="bg-white/5 p-5 rounded-2xl border border-white/10">
              <p className="text-[10px] font-black text-blue-400 uppercase mb-1">Ground Speed</p>
              <p className="text-2xl font-black">{Math.round(gs)} KTS</p>
            </div>
            <div className="bg-white/5 p-5 rounded-2xl border border-white/10">
              <p className="text-[10px] font-black text-blue-400 uppercase mb-1">WCA (°)</p>
              <p className="text-2xl font-black">{wca > 0 ? `L ${Math.abs(Math.round(wca))}` : `R ${Math.abs(Math.round(wca))}`}</p>
            </div>
            <div className="bg-white/5 p-5 rounded-2xl border border-white/10">
              <p className="text-[10px] font-black text-orange-400 uppercase mb-1">Trip Fuel</p>
              <p className="text-2xl font-black text-orange-400">{tripFuel.toFixed(1)} Lbs</p>
            </div>
          </div>
        </section>

        {/* Detailed Fuel Manifest */}
        <section className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-xl">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2 bg-orange-50 text-orange-600 rounded-xl">
              <Fuel size={20} />
            </div>
            <h3 className="font-black uppercase tracking-tight text-lg">Fuel Manifest (DGCA Compliance)</h3>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
             <div className="space-y-4">
                {[
                  { label: 'Trip Fuel', val: tripFuel },
                  { label: 'Contingency (5%)', val: contingency },
                  { label: 'Alternate Fuel', val: alternateFuel },
                  { label: 'Final Reserve (45 min)', val: finalReserve }
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{item.label}</span>
                    <span className="font-mono text-sm font-black text-slate-800">{item.val.toFixed(1)} KG</span>
                  </div>
                ))}
                <div className="pt-6 flex items-center justify-between">
                   <span className="text-sm font-black text-slate-900 uppercase">Min Block Fuel</span>
                   <span className="text-2xl font-black text-blue-600">{totalFuelRequired.toFixed(1)} Lbs</span>
                </div>
             </div>
             
             <div className="flex flex-col justify-center items-center p-8 bg-blue-50 rounded-[2rem] text-center">
                <p className="text-[10px] font-black text-blue-600 uppercase mb-4 tracking-tighter">Fuel Status</p>
                <div className="relative mb-6">
                  <svg className="w-32 h-32 transform -rotate-90">
                    <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-blue-100" />
                    <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="12" fill="transparent" strokeDasharray={364.4} strokeDashoffset={364.4 - (Math.min(weight.fuel / totalFuelRequired, 1) * 364.4)} className="text-blue-600 transition-all duration-1000" />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center font-black text-xl text-blue-600">
                    {Math.round((weight.fuel / Math.max(totalFuelRequired, 1)) * 100)}%
                  </div>
                </div>
                <p className="text-xs text-blue-800 font-bold">Planned: {weight.fuel} Lbs</p>
                <p className="text-[10px] text-blue-400 uppercase font-black mt-1">
                  {weight.fuel >= totalFuelRequired ? "Safe for Dispatch" : "INSUFFICIENT FUEL"}
                </p>
             </div>
          </div>
        </section>

        {/* Load Manifest */}
        <section className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-xl">
           <div className="flex items-center gap-3 mb-8">
            <div className="p-2 bg-slate-100 text-slate-600 rounded-xl">
              <Scale size={20} />
            </div>
            <h3 className="font-black uppercase tracking-tight text-lg">Load Manifest</h3>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              {Object.entries(weight).map(([key, val]) => (
                <div key={key} className="flex items-center justify-between group">
                  <label className="text-xs font-black uppercase text-gray-400 group-hover:text-blue-500 transition-colors">
                    {key} (LBS)
                  </label>
                  <input 
                    type="number"
                    value={val}
                    onChange={(e) => setWeight({...weight, [key]: Number(e.target.value)})}
                    className="w-24 p-2 bg-gray-50 border border-gray-100 rounded-lg text-right font-mono text-sm focus:border-blue-500 outline-none font-bold"
                  />
                </div>
              ))}
              <div className="pt-4 border-t border-gray-50 flex items-center justify-between">
                <span className="font-black text-gray-900 uppercase text-sm">Gross Weight</span>
                <span className={`font-mono text-lg font-bold ${totalWeight > aircraft.mtow ? 'text-red-500' : 'text-blue-600'}`}>
                  {totalWeight.toFixed(0)} LBS
                </span>
              </div>
            </div>
            <div className="bg-gray-50 rounded-2xl p-6 flex flex-col justify-center items-center">
               <div className="w-full h-2 bg-gray-200 rounded-full mb-4 overflow-hidden">
                  <motion.div 
                    className={`h-full ${totalWeight > aircraft.mtow ? 'bg-red-500' : 'bg-green-500'}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min((totalWeight / aircraft.mtow) * 100, 100)}%` }}
                  />
               </div>
               <p className="text-[10px] text-gray-400 font-bold uppercase">MTOW Limit: {aircraft.mtow} LBS</p>
            </div>
          </div>
        </section>
      </div>

      <aside className="space-y-6">
         {/* Vertical Navigation Log Logic */}
         <div className="bg-blue-600 rounded-[2.5rem] p-8 text-white shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16" />
            <div className="relative z-10">
               <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-white/20 rounded-xl">
                     <BrainCircuit size={20} />
                  </div>
                  <h4 className="font-black text-xs uppercase tracking-widest">Dispatch Assistant</h4>
               </div>
               <p className="text-xs text-blue-100 mb-8 leading-relaxed font-medium italic">
                 "I've calculated your drift at {Math.abs(Math.round(wca))}°. To maintain track {track}°, steer heading {Math.round(track + wca)}°."
               </p>
               <button className="w-full py-4 bg-black text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all">
                  Generate PDF NavLog
               </button>
            </div>
         </div>

         <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-xl">
             <h5 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Met Intel</h5>
             <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                   <p className="text-[10px] font-black text-blue-600 mb-1 uppercase tracking-widest">Wind Factor</p>
                   <p className="text-xs font-bold text-gray-700">Headwind: {Math.round(headwind)} kts</p>
                   <p className="text-xs text-gray-400">X-Wind: {Math.round(crosswind)} kts</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                   <p className="text-[10px] font-black text-blue-600 mb-1 uppercase tracking-widest">Performance</p>
                   <p className="text-xs font-bold text-gray-700">Payload: {weight.pilot + weight.baggage} LBS</p>
                   <p className="text-xs text-gray-400">Fuel Endur: {Math.round((weight.fuel / Math.max(aircraft.fuelBurnGPH * 6, 1)) * 60)} min</p>
                </div>
             </div>
         </div>
      </aside>
    </div>
  );
}
