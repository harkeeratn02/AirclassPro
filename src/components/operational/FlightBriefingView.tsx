import React, { useState, useEffect } from 'react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { 
  FileText, 
  MapPin, 
  CloudSun, 
  Wind, 
  Navigation, 
  Plane, 
  User, 
  Activity, 
  Clock, 
  CheckCircle, 
  Download, 
  Share2, 
  AlertTriangle, 
  Save, 
  Plus,
  ArrowRight,
  ShieldCheck,
  Search,
  ChevronRight,
  ChevronDown,
  Gauge,
  Thermometer,
  Fuel,
  Scale,
  AlertCircle,
  ExternalLink,
  History,
  Trash2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { weatherService } from '../../services/weatherService.ts';
import { FlightBriefing, UserProfile, AircraftPerformance } from '../../types.ts';
import { AIRCRAFT_DATA } from '../../constants.ts';

import { 
  calculateGreatCircleDistance, 
  calculateDensityAltitude, 
  calculateWindComponents, 
  istToUtc, 
  utcToIst, 
  calculateFuelWeight,
  calculatePerformanceReduction,
  AIRPORT_COORDS
} from '../../lib/aviationMath.ts';

interface FlightBriefingViewProps {
  profile?: UserProfile | null;
}

export default function FlightBriefingView({ profile }: FlightBriefingViewProps) {
  const [briefings, setBriefings] = useState<FlightBriefing[]>([]);
  const [activeBriefing, setActiveBriefing] = useState<FlightBriefing | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [activeSection, setActiveSection] = useState(1);
  const [isLoadingWeather, setIsLoadingWeather] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [aircraftSearch, setAircraftSearch] = useState('');
  const [showAircraftResults, setShowAircraftResults] = useState(false);

  // Load saved briefings
  useEffect(() => {
    const saved = localStorage.getItem('airclass_briefings');
    if (saved) {
      setBriefings(JSON.parse(saved));
    }
  }, []);

  const createNewBriefing = (): FlightBriefing => ({
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
    status: 'draft',
    aircraft: {
      type: '',
      registration: '',
      callsign: '',
      pic: '',
      coPilot: '',
    },
    flightParams: {
      ias: '',
      tas: '',
      gs: '',
      mach: '',
      altitude: '',
      oat: '',
      windDir: '',
      windSpeed: '',
      distanceNM: '',
      distanceKM: '',
      fuelOnBoardLtr: '',
      fuelOnBoardKg: '',
      burnRate: '',
      totalFuelUsedKg: '',
      tripFuelLtr: '',
      tripFuelKg: '',
      reserveFuelLtr: '',
      reserveFuelKg: '',
      alternateFuelLtr: '',
      alternateFuelKg: '',
      contingencyFuelLtr: '',
      contingencyFuelKg: '',
      totalFuelRequiredLtr: '',
      totalFuelRequiredKg: '',
      timeEnRoute: '',
      eta: '',
      ata: '',
      depUtc: '',
      depIst: '',
      arrUtc: '',
      arrIst: '',
      etaUtc: '',
      etaIst: '',
      ataUtc: '',
      ataIst: '',
      blockTime: '',
      flightTime: '',
      nightHours: '',
      instrumentHours: '',
      crossCountryHours: '',
      blockOff: '',
      blockOn: '',
      takeoff: '',
      landing: '',
    },
    fuelCalc: {
      burnRate: '',
      tripFuel: '',
      reserveFuel: '',
      alternateFuel: '',
      totalRequired: '',
      endurance: '',
      landingFuel: '',
      isLowFuel: false,
    },
    weightBalance: {
      emptyWeight: '',
      pilotWeight: '',
      passengerWeight: '',
      baggageWeight: '',
      fuelWeight: '',
      mtow: '',
      mlw: '',
      mzfw: '',
      payload: '',
      cgPosition: '',
      tow: '',
      lw: '',
      zfw: '',
      isOverweight: false,
      isOverMLW: false,
      isOverMZFW: false,
      isOutOfCG: false,
    },
    performance: {
      takeoffDist: '',
      landingDist: '',
      rateOfClimb: '',
      serviceCeiling: '',
      elevation: '',
      qnh: '',
      densityAltitude: '',
      performanceReduction: '',
      isRunwayShort: false,
    },
    weather: {
      depIcao: '',
      arrIcao: '',
      altIcao: '',
      windDir: '',
      windSpeed: '',
      runwayHeading: '',
      headwind: '',
      tailwind: '',
      crosswind: '',
      isCrosswindLimit: false,
    },
    notams: {
      dep: '',
      arr: '',
      alt: '',
      notes: '',
    },
    atcNotes: {
      clearance: '',
      squawk: '',
      frequencies: [
        { label: 'Ground', value: '' },
        { label: 'Tower', value: '' },
        { label: 'Departure', value: '' },
        { label: 'Approach', value: '' },
        { label: 'ATIS', value: '' },
      ],
      runways: { dep: '', arr: '' },
      procedures: { sid: '', star: '', approach: '' },
    },
    checklist: {
      weatherCleared: false,
      notamChecked: false,
      fuelCalculated: false,
      fplFiled: false,
      aircraftChecked: false,
      atcContacted: false,
    },
  });

  const handleStartNew = () => {
    setActiveBriefing(createNewBriefing());
    setIsCreating(true);
    setActiveSection(1);
  };

  const handleFetchWeather = async (icao: string, field: 'dep' | 'arr' | 'alt') => {
    if (!icao || icao.length < 3) return;
    setIsLoadingWeather(true);
    try {
      const data = await weatherService.fetchWeather(icao);
      if (activeBriefing) {
        setActiveBriefing({
          ...activeBriefing,
          weather: {
            ...activeBriefing.weather,
            [`${field}Metar`]: data.metar,
            [`${field}Taf`]: data.taf
          }
        });
      }
    } catch (err) {
      console.error(err);
      alert(`Could not fetch weather for ${icao}`);
    } finally {
      setIsLoadingWeather(false);
    }
  };

  const handleSave = () => {
    if (!activeBriefing) return;
    
    const updatedActive = { ...activeBriefing, status: 'completed' as const };
    const updatedBriefings = [updatedActive, ...briefings.filter(b => b.id !== activeBriefing.id)].slice(0, 50);
    setBriefings(updatedBriefings);
    localStorage.setItem('airclass_briefings', JSON.stringify(updatedBriefings));
    
    alert("Flight Briefing Saved Successfully");
    setIsCreating(false);
    setActiveBriefing(null);
  };

  const handleSelectAircraft = (aircraft: AircraftPerformance) => {
    if (!activeBriefing) return;
    
    setActiveBriefing({
      ...activeBriefing,
      aircraft: {
        ...activeBriefing.aircraft,
        type: aircraft.type,
        specs: aircraft
      },
      flightParams: {
        ...activeBriefing.flightParams,
        burnRate: aircraft.fuelBurnGPH.toString(),
        altitude: aircraft.serviceCeiling.toString(),
        tas: aircraft.cruiseSpeed.toString(),
      },
      weightBalance: {
        ...activeBriefing.weightBalance,
        emptyWeight: aircraft.emptyWeight.toString(),
        mtow: aircraft.mtow.toString(),
        mlw: aircraft.mlw.toString(),
      },
      performance: {
        ...activeBriefing.performance,
        takeoffDist: aircraft.takeoffDist.toString(),
        landingDist: aircraft.landingDist.toString(),
        serviceCeiling: aircraft.serviceCeiling.toString(),
      }
    });
    setAircraftSearch(aircraft.type);
    setShowAircraftResults(false);
  };

  const filteredAircraft = AIRCRAFT_DATA.filter(a => 
    a.type.toLowerCase().includes(aircraftSearch.toLowerCase()) ||
    a.family.toLowerCase().includes(aircraftSearch.toLowerCase())
  );

  // Automatic Calculations Logic
  useEffect(() => {
    if (!activeBriefing) return;

    const aircraft = AIRCRAFT_DATA.find(a => a.type === activeBriefing.aircraft.type);
    const params = activeBriefing.flightParams;
    const weather = activeBriefing.weather;
    const perf = activeBriefing.performance;
    const wb = activeBriefing.weightBalance;
    const fuelType = aircraft?.fuelType || 'JET A1';

    // 1. Distance Calculation (Great Circle)
    let distNM = parseFloat(params.distanceNM) || 0;
    if (AIRPORT_COORDS[weather.depIcao] && AIRPORT_COORDS[weather.arrIcao]) {
      const dep = AIRPORT_COORDS[weather.depIcao];
      const arr = AIRPORT_COORDS[weather.arrIcao];
      const gcDist = calculateGreatCircleDistance(dep.lat, dep.lon, arr.lat, arr.lon);
      if (Math.abs(gcDist - distNM) > 1) {
        distNM = Math.round(gcDist);
      }
    }

    // 2. Airspeed (TAS)
    let tas = parseFloat(params.tas) || 0;
    const ias = parseFloat(params.ias) || 0;
    const alt = parseFloat(params.altitude) || 0;
    const oat = parseFloat(params.oat) || 15;
    
    if (ias && alt) {
      tas = ias * (1 + 0.02 * (alt / 1000));
    }

    // 3. Wind Components & Groundspeed
    const windDir = parseFloat(weather.windDir) || 0;
    const windSpeed = parseFloat(weather.windSpeed) || 0;
    const rwyHdg = parseFloat(weather.runwayHeading) || 0;
    
    const windComp = calculateWindComponents(windDir, windSpeed, rwyHdg);
    // Simple GS: TAS +/- Headwind. If GS and TAS are 0, use cruise speed as base
    const headwindEff = windComp.headwind;
    let gs = parseFloat(params.gs) || (tas + headwindEff);
    
    if (gs <= 0 && aircraft) {
      // Fallback to cruise speed minus headwind if no IAS/GS provided
      gs = Math.max(1, aircraft.cruiseSpeed + headwindEff);
    }

    // 4. Time (ETE)
    const eteMinutes = gs > 0 ? (distNM / gs) * 60 : 0;
    
    // IST to UTC
    const depIst = params.depIst;
    const depUtc = depIst ? istToUtc(depIst) : '';
    
    let arrIst = '';
    let arrUtc = '';
    if (eteMinutes > 0 && depIst) {
      const [h, m] = depIst.split(':').map(Number);
      const depDate = new Date();
      depDate.setHours(h, m, 0);
      const arrDate = new Date(depDate.getTime() + eteMinutes * 60000);
      arrIst = `${arrDate.getHours().toString().padStart(2, '0')}:${arrDate.getMinutes().toString().padStart(2, '0')}`;
      arrUtc = istToUtc(arrIst);
    }

    // 5. Fuel Math
    const burnRateGPH = aircraft ? aircraft.fuelBurnGPH : parseFloat(params.burnRate) || 0;
    
    const tripLtr = (eteMinutes / 60) * burnRateGPH * 3.785;
    const reserveLtr = burnRateGPH * 0.75 * 3.785; // 45 mins
    const altFuelLtr = parseFloat(activeBriefing.fuelCalc.alternateFuel) || 0;
    
    const baseRequiredLtr = tripLtr + reserveLtr + altFuelLtr;
    const contingencyLtr = baseRequiredLtr * 0.1;
    const totalRequiredLtr = baseRequiredLtr + contingencyLtr;
    
    const totalRequiredKg = calculateFuelWeight(totalRequiredLtr, fuelType);
    const fobLtr = parseFloat(params.fuelOnBoardLtr) || 0;
    const isLowFuel = totalRequiredLtr > (aircraft?.fuelCapacityLtr || Infinity);

    // 6. Weight & Balance
    const emptyW = parseFloat(wb.emptyWeight) || 0;
    const pilotW = parseFloat(wb.pilotWeight) || 0;
    const passW = parseFloat(wb.passengerWeight) || 0;
    const bagW = parseFloat(wb.baggageWeight) || 0;
    const fuelW_lbs = calculateFuelWeight(fobLtr, fuelType) * 2.20462;
    
    const zfw = emptyW + pilotW + passW + bagW;
    const tow = zfw + fuelW_lbs;
    const tripFuel_lbs = calculateFuelWeight(tripLtr, fuelType) * 2.20462;
    const lw = tow - tripFuel_lbs;

    const isOverweight = tow > (parseFloat(wb.mtow) || Infinity);
    const isOverMLW = lw > (parseFloat(wb.mlw) || Infinity);
    const isOverMZFW = zfw > (parseFloat(wb.mzfw) || Infinity);

    // 7. Density Altitude & Performance
    const da = calculateDensityAltitude(parseFloat(perf.elevation) || 0, parseFloat(perf.qnh) || 1013, oat);
    const perfReduction = calculatePerformanceReduction(da);
    
    // Performance scaling
    let todr = aircraft?.takeoffDist || 0;
    let ldr = aircraft?.landingDist || 0;
    if (perfReduction > 0) {
      todr = todr * (1 + perfReduction / 100);
      ldr = ldr * (1 + perfReduction / 100);
    }

    // State Sync
    const updates: Partial<FlightBriefing> = {
      flightParams: {
        ...params,
        distanceNM: distNM.toString(),
        distanceKM: Math.round(distNM * 1.852).toString(),
        tas: Math.round(tas).toString(),
        gs: Math.round(gs).toString(),
        timeEnRoute: eteMinutes > 0 ? `${Math.floor(eteMinutes / 60)}:${Math.round(eteMinutes % 60).toString().padStart(2, '0')}` : '',
        depUtc,
        depIst,
        arrIst,
        arrUtc,
        tripFuelLtr: Math.round(tripLtr).toString(),
        tripFuelKg: Math.round(calculateFuelWeight(tripLtr, fuelType)).toString(),
        reserveFuelLtr: Math.round(reserveLtr).toString(),
        reserveFuelKg: Math.round(calculateFuelWeight(reserveLtr, fuelType)).toString(),
        alternateFuelLtr: Math.round(altFuelLtr).toString(),
        alternateFuelKg: Math.round(calculateFuelWeight(altFuelLtr, fuelType)).toString(),
        contingencyFuelLtr: Math.round(contingencyLtr).toString(),
        contingencyFuelKg: Math.round(calculateFuelWeight(contingencyLtr, fuelType)).toString(),
        totalFuelRequiredLtr: Math.round(totalRequiredLtr).toString(),
        totalFuelRequiredKg: Math.round(totalRequiredKg).toString(),
      },
      weather: {
        ...weather,
        headwind: Math.max(0, Math.round(windComp.headwind)).toString(),
        tailwind: Math.round(windComp.tailwind).toString(),
        crosswind: Math.round(windComp.crosswind).toString(),
        isCrosswindLimit: Math.round(windComp.crosswind) > (aircraft?.maxCrosswind || 15)
      },
      weightBalance: {
        ...wb,
        fuelWeight: Math.round(fuelW_lbs).toString(),
        zfw: Math.round(zfw).toString(),
        tow: Math.round(tow).toString(),
        lw: Math.round(lw).toString(),
        isOverweight,
        isOverMLW,
        isOverMZFW,
      },
      performance: {
        ...perf,
        densityAltitude: da.toString(),
        performanceReduction: perfReduction.toString(),
        takeoffDist: Math.round(todr).toString(),
        landingDist: Math.round(ldr).toString(),
      },
      fuelCalc: {
        ...activeBriefing.fuelCalc,
        isLowFuel
      }
    };

    if (JSON.stringify(updates) !== JSON.stringify(activeBriefing)) {
      setActiveBriefing(prev => prev ? ({ ...prev, ...updates }) : null);
    }

  }, [
    activeBriefing?.aircraft.type,
    activeBriefing?.flightParams.ias,
    activeBriefing?.flightParams.altitude,
    activeBriefing?.flightParams.distanceNM,
    activeBriefing?.flightParams.depIst,
    activeBriefing?.flightParams.fuelOnBoardLtr,
    activeBriefing?.flightParams.oat,
    activeBriefing?.weather.depIcao,
    activeBriefing?.weather.arrIcao,
    activeBriefing?.weather.windDir,
    activeBriefing?.weather.windSpeed,
    activeBriefing?.weather.runwayHeading,
    activeBriefing?.performance.elevation,
    activeBriefing?.performance.qnh,
    activeBriefing?.weightBalance.pilotWeight,
    activeBriefing?.weightBalance.passengerWeight,
    activeBriefing?.weightBalance.baggageWeight,
    activeBriefing?.fuelCalc.alternateFuel
  ]);

  const handleExportPdf = async () => {
    if (!activeBriefing) return;
    setIsExporting(true);
    const element = document.getElementById('briefing-pdf-content');
    if (!element) {
      setIsExporting(false);
      return;
    }

    try {
      // Temporarily show full content for capture
      element.style.display = 'block';
      const canvas = await html2canvas(element, {
        scale: 2,
        backgroundColor: '#0f172a',
        useCORS: true,
        logging: false
      });
      element.style.display = 'none';

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`AirclassPRO_Briefing_${activeBriefing.weather.depIcao}_${activeBriefing.weather.arrIcao}_${new Date().toISOString().split('T')[0]}.pdf`);
    } catch (err) {
      console.error("PDF Export failed:", err);
      alert("Failed to export PDF. Please try again.");
    } finally {
      setIsExporting(false);
    }
  };

  const deleteBriefing = (id: string) => {
    const updated = briefings.filter(b => b.id !== id);
    setBriefings(updated);
    localStorage.setItem('airclass_briefings', JSON.stringify(updated));
  };

  const sections = [
    { title: 'Weather', icon: CloudSun, id: 1 },
    { title: 'Aircraft', icon: Plane, id: 2 },
    { title: 'Flight Plan', icon: Gauge, id: 3 },
    { title: 'NOTAMs', icon: AlertTriangle, id: 4 },
    { title: 'ATC Plan', icon: Clock, id: 5 },
    { title: 'Fuel Ops', icon: Fuel, id: 6 },
    { title: 'Weight & Perf', icon: Scale, id: 7 },
    { title: 'Checklist', icon: CheckCircle, id: 8 },
  ];

  const aircraftTypes = AIRCRAFT_DATA.map(a => a.type);

  if (isCreating && activeBriefing) {
    return (
      <div className="min-h-screen bg-slate-950 text-white p-4 md:p-8 pb-32">
        <div className="max-w-5xl mx-auto">
          {/* Top Bar */}
          <div className="flex items-center justify-between mb-8 pb-6 border-b border-white/10">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-600 rounded-2xl shadow-lg shadow-blue-500/20">
                <FileText size={24} className="text-white" />
              </div>
              <div>
                <h1 className="text-xl font-black uppercase tracking-tighter">AirclassPRO Flight Briefing</h1>
                <div className="flex items-center gap-2">
                  <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest">
                    Electronic Operational Flight Plan • {new Date(activeBriefing.createdAt).toLocaleString()}
                  </p>
                  {profile && (
                    <div className="h-1 w-1 bg-white/20 rounded-full" />
                  )}
                  {profile && (
                    <p className="text-[10px] font-mono font-bold text-slate-400 tracking-widest uppercase">
                      ID: {profile.studentId}
                    </p>
                  )}
                </div>
              </div>
            </div>
            <div className="flex gap-3">
               <button 
                onClick={handleExportPdf}
                disabled={isExporting}
                className="px-6 py-2 bg-white/10 hover:bg-white/20 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2"
              >
                {isExporting ? 'Exporting...' : <Download size={14} />}
                Export PDF
              </button>
              <button 
                onClick={() => setIsCreating(false)}
                className="px-6 py-2 bg-red-500/10 text-red-500 hover:bg-red-500/20 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
              >
                Discard
              </button>
            </div>
          </div>

          {/* Section Selector */}
          <div className="grid grid-cols-3 md:grid-cols-6 gap-2 mb-8">
            {sections.map(s => (
              <button
                key={s.id}
                onClick={() => setActiveSection(s.id)}
                className={`p-4 rounded-2xl border transition-all flex flex-col items-center gap-2 ${
                  activeSection === s.id 
                    ? 'bg-blue-600 border-blue-500 shadow-lg shadow-blue-600/20' 
                    : 'bg-white/5 border-white/5 hover:bg-white/10'
                }`}
              >
                <s.icon size={20} className={activeSection === s.id ? 'text-white' : 'text-blue-500'} />
                <span className="text-[8px] font-black uppercase tracking-widest text-center">{s.title}</span>
              </button>
            ))}
          </div>

          {/* Active Section Content */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/5 rounded-[2.5rem] p-8 md:p-12">
            <AnimatePresence mode="wait">
              {activeSection === 1 && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-8">
                  <SectionHeader title="METEOROLOGY & ENVIRONMENT" subtitle="Atmospheric Conditions" color="text-blue-500" />
                  <div className="grid md:grid-cols-3 gap-6">
                    <IcaoBox label="Departure" value={activeBriefing.weather.depIcao} metar={activeBriefing.weather.depMetar} onUpdate={(v) => setActiveBriefing({...activeBriefing, weather: { ...activeBriefing.weather, depIcao: v }})} onFetch={() => handleFetchWeather(activeBriefing.weather.depIcao, 'dep')} />
                    <IcaoBox label="Destination" value={activeBriefing.weather.arrIcao} metar={activeBriefing.weather.arrMetar} onUpdate={(v) => setActiveBriefing({...activeBriefing, weather: { ...activeBriefing.weather, arrIcao: v }})} onFetch={() => handleFetchWeather(activeBriefing.weather.arrIcao, 'arr')} />
                    <IcaoBox label="Alternate" value={activeBriefing.weather.altIcao} metar={activeBriefing.weather.altMetar} onUpdate={(v) => setActiveBriefing({...activeBriefing, weather: { ...activeBriefing.weather, altIcao: v }})} onFetch={() => handleFetchWeather(activeBriefing.weather.altIcao, 'alt')} />
                  </div>

                  <div className="bg-white/5 p-6 rounded-3xl grid grid-cols-2 lg:grid-cols-5 gap-4">
                    <InputField label="Wind Dir" value={activeBriefing.weather.windDir} placeholder="360" onChange={(v) => setActiveBriefing({...activeBriefing, weather: { ...activeBriefing.weather, windDir: v }})} />
                    <InputField label="Wind Speed" value={activeBriefing.weather.windSpeed} placeholder="10" onChange={(v) => setActiveBriefing({...activeBriefing, weather: { ...activeBriefing.weather, windSpeed: v }})} />
                    <InputField label="Rwy Hdg" value={activeBriefing.weather.runwayHeading} placeholder="090" onChange={(v) => setActiveBriefing({...activeBriefing, weather: { ...activeBriefing.weather, runwayHeading: v }})} />
                    <InputField label="QNH" value={activeBriefing.performance.qnh} placeholder="1013" onChange={(v) => setActiveBriefing({...activeBriefing, performance: { ...activeBriefing.performance, qnh: v }})} />
                    <InputField label="OAT (°C)" value={activeBriefing.flightParams.oat} placeholder="15" onChange={(v) => setActiveBriefing({...activeBriefing, flightParams: { ...activeBriefing.flightParams, oat: v }})} />
                  </div>
                  
                  <div className="grid md:grid-cols-3 gap-4">
                    <StatusCard label="Headwind" value={`${activeBriefing.weather.headwind} Kts`} subtitle="Component" color="blue" />
                    <StatusCard label="Crosswind" value={`${activeBriefing.weather.crosswind} Kts`} subtitle="Component" color={activeBriefing.weather.isCrosswindLimit ? "red" : "blue"} />
                    {activeBriefing.weather.isCrosswindLimit && (
                      <div className="col-span-full md:col-span-1 p-4 bg-red-500/20 border border-red-500/50 rounded-2xl flex items-center gap-3">
                        <AlertTriangle className="text-red-500" size={20} />
                        <p className="text-[10px] font-black uppercase text-red-500 tracking-widest">Crosswind limit exceeded!</p>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {activeSection === 2 && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-8">
                  <SectionHeader title="AIRCRAFT SELECTION" subtitle="Asset & Crew Declaration" color="text-purple-500" />
                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                      <div className="space-y-4">
                        <div className="flex justify-between items-center px-2">
                           <label className="text-[9px] font-black uppercase text-gray-500 tracking-widest">Airliner & Trainer Presets</label>
                           <button 
                             onClick={() => {
                               setActiveBriefing({
                                 ...activeBriefing,
                                 aircraft: { ...activeBriefing.aircraft, type: 'Custom Aircraft', specs: null }
                               });
                               setAircraftSearch('Custom Aircraft');
                             }}
                             className="text-[8px] font-black text-blue-500 uppercase tracking-widest hover:underline"
                           >
                             Use Manual Entry
                           </button>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                           {['Cessna 172 Skyhawk', 'Piper PA28 Archer', 'Beechcraft Bonanza G36', 'Diamond DA40', 'Boeing 737-800', 'Airbus A320', 'ATR 72', 'Bombardier Q400'].map(type => (
                             <button
                               key={type}
                               onClick={() => {
                                 const aircraft = AIRCRAFT_DATA.find(a => a.type === type);
                                 if (aircraft) handleSelectAircraft(aircraft);
                               }}
                               className="p-3 bg-white/5 border border-white/5 rounded-xl text-[8px] font-black uppercase tracking-widest hover:bg-blue-600 hover:border-blue-500 transition-all text-gray-400 hover:text-white text-center"
                             >
                               {type.split(' ').slice(0, 2).join(' ')}
                             </button>
                           ))}
                        </div>
                      </div>

                      <div className="space-y-1 relative pt-4">
                        <label className="text-[9px] font-black uppercase text-gray-500 ml-2 tracking-widest">Search All Aircraft (Custom Selection)</label>
                        <div className="relative">
                          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                          <input 
                            className="w-full bg-white/5 p-4 pl-12 rounded-2xl border border-white/5 text-xs font-black outline-none focus:border-blue-500/50 focus:bg-white/10 transition-all text-white"
                            placeholder="Type aircraft name..."
                            value={aircraftSearch}
                            onChange={(e) => {
                              setAircraftSearch(e.target.value);
                              setShowAircraftResults(true);
                            }}
                            onFocus={() => setShowAircraftResults(true)}
                          />
                        </div>
                        
                        <AnimatePresence>
                          {showAircraftResults && aircraftSearch.length > 0 && (
                            <motion.div 
                              initial={{ opacity: 0, y: -10 }} 
                              animate={{ opacity: 1, y: 0 }} 
                              exit={{ opacity: 0, y: -10 }}
                              className="absolute top-full left-0 right-0 z-50 mt-2 bg-slate-900 border border-white/10 rounded-2xl overflow-hidden shadow-2xl max-h-64 overflow-y-auto"
                            >
                              {filteredAircraft.length > 0 ? (
                                filteredAircraft.map(aircraft => (
                                  <button
                                    key={aircraft.type}
                                    onClick={() => handleSelectAircraft(aircraft)}
                                    className="w-full p-4 text-left hover:bg-white/10 transition-colors flex items-center justify-between border-b border-white/5 last:border-0"
                                  >
                                    <div>
                                      <p className="text-[10px] font-black uppercase tracking-widest text-white">{aircraft.type}</p>
                                      <p className="text-[8px] font-bold text-gray-500 uppercase">{aircraft.family} • {aircraft.category}</p>
                                    </div>
                                    <ChevronRight size={14} className="text-gray-500" />
                                  </button>
                                ))
                              ) : (
                                <div className="p-4 text-center">
                                  <p className="text-[10px] font-bold text-gray-500 uppercase">No matching aircraft found</p>
                                </div>
                              )}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>

                      {activeBriefing.aircraft.specs && (
                        <motion.div 
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="bg-blue-600/10 border border-blue-500/20 p-6 rounded-3xl space-y-4"
                        >
                          <div className="flex items-center gap-3 mb-2">
                             <Plane className="text-blue-500" size={18} />
                             <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-400">Specifications Loaded</h4>
                          </div>
                          <div className="grid grid-cols-2 gap-x-8 gap-y-3">
                             <SpecRow label="MTOW" value={`${activeBriefing.aircraft.specs.mtow} lbs`} />
                             <SpecRow label="Fuel Capacity" value={`${activeBriefing.aircraft.specs.fuelCapacityLtr} Ltr`} />
                             <SpecRow label="Cruise Speed" value={`${activeBriefing.aircraft.specs.cruiseSpeed} Kts`} />
                             <SpecRow label="Service Ceiling" value={`${activeBriefing.aircraft.specs.serviceCeiling} ft`} />
                             <SpecRow label="Fuel Burn" value={`${activeBriefing.aircraft.specs.fuelBurnGPH} GPH`} />
                             <SpecRow label="Seating" value={activeBriefing.aircraft.specs.seating.toString()} />
                          </div>
                        </motion.div>
                      )}

                      <div className="grid grid-cols-2 gap-4">
                        <InputField label="Registration" value={activeBriefing.aircraft.registration} placeholder="e.g. VT-ABC" onChange={(v) => setActiveBriefing({...activeBriefing, aircraft: { ...activeBriefing.aircraft, registration: v }})} />
                        <InputField label="Call Sign" value={activeBriefing.aircraft.callsign} placeholder="e.g. SKYBIRD" onChange={(v) => setActiveBriefing({...activeBriefing, aircraft: { ...activeBriefing.aircraft, callsign: v }})} />
                      </div>
                    </div>
                    <div className="bg-white/5 p-8 rounded-3xl border border-white/5 space-y-6 flex flex-col justify-between">
                      <div>
                        <p className="text-[10px] font-black uppercase text-blue-400 tracking-widest mb-6">Crew Information</p>
                        <InputField label="Pilot in Command" value={activeBriefing.aircraft.pic} placeholder="Full Name" onChange={(v) => setActiveBriefing({...activeBriefing, aircraft: { ...activeBriefing.aircraft, pic: v }})} />
                        <div className="mt-4">
                          <InputField label="Co-Pilot (if applicable)" value={activeBriefing.aircraft.coPilot} placeholder="Optional" onChange={(v) => setActiveBriefing({...activeBriefing, aircraft: { ...activeBriefing.aircraft, coPilot: v }})} />
                        </div>
                      </div>
                      
                      <div className="bg-slate-900/50 p-4 rounded-2xl border border-white/5">
                        <p className="text-[8px] font-bold text-gray-500 uppercase mb-2">Technical Summary</p>
                        <p className="text-[10px] text-gray-400 leading-relaxed italic">
                          Selecting an aircraft from the database will automatically pre-fill weight, performance, and fuel parameters across all briefing sections.
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeSection === 3 && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-8">
                  <SectionHeader title="FLIGHT PLAN" subtitle="Speed, Distance & Time" color="text-emerald-500" />
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-white/5 p-8 rounded-[2.5rem] border border-white/5 space-y-6">
                      <p className="text-[10px] font-black uppercase text-blue-400 tracking-widest">Velocity & Range</p>
                      <div className="grid grid-cols-2 gap-4">
                        <InputField label="IAS (Kts)" value={activeBriefing.flightParams.ias} onChange={(v) => setActiveBriefing({...activeBriefing, flightParams: { ...activeBriefing.flightParams, ias: v }})} />
                        <InputField label="Altitude (ft)" value={activeBriefing.flightParams.altitude} onChange={(v) => setActiveBriefing({...activeBriefing, flightParams: { ...activeBriefing.flightParams, altitude: v }})} />
                              <InputField label="TAS (Kts)" value={activeBriefing.flightParams.tas} readOnly />
                              <InputField label="GS (Kts)" value={activeBriefing.flightParams.gs} readOnly />
                              <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex flex-col items-center justify-center">
                                 <span className="text-[10px] font-black uppercase text-emerald-500 mb-1">Estimated ETE</span>
                                 <span className="text-lg font-mono font-black text-white">{activeBriefing.flightParams.timeEnRoute || '--:--'}</span>
                              </div>
                              <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-2xl flex flex-col items-center justify-center">
                                 <span className="text-[10px] font-black uppercase text-blue-500 mb-1">Cruise Burn</span>
                                 <span className="text-lg font-mono font-black text-white">{activeBriefing.flightParams.burnRate} GPH</span>
                              </div>
                           </div>
                           <div className="grid grid-cols-2 gap-4">
                        <InputField label="Dist (NM)" value={activeBriefing.flightParams.distanceNM} onChange={(v) => setActiveBriefing({...activeBriefing, flightParams: { ...activeBriefing.flightParams, distanceNM: v }})} />
                        <InputField label="Dist (KM)" value={activeBriefing.flightParams.distanceKM} readOnly />
                      </div>
                    </div>

                    <div className="bg-white/5 p-8 rounded-[2.5rem] border border-white/5 space-y-6">
                      <p className="text-[10px] font-black uppercase text-emerald-400 tracking-widest">Schedule (UTC & IST)</p>
                      <div className="grid grid-cols-2 gap-4">
                        <InputField label="Dep IST" value={activeBriefing.flightParams.depIst} placeholder="12:00" onChange={(v) => setActiveBriefing({...activeBriefing, flightParams: { ...activeBriefing.flightParams, depIst: v }})} />
                        <InputField label="Dep UTC" value={activeBriefing.flightParams.depUtc} readOnly />
                        <InputField label="Arr IST (Est)" value={activeBriefing.flightParams.arrIst} readOnly />
                        <InputField label="Arr UTC (Est)" value={activeBriefing.flightParams.arrUtc} readOnly />
                        <InputField label="ETA (Actual)" value={activeBriefing.flightParams.eta} onChange={(v) => setActiveBriefing({...activeBriefing, flightParams: { ...activeBriefing.flightParams, eta: v }})} />
                        <InputField label="ATA (Actual)" value={activeBriefing.flightParams.ata} onChange={(v) => setActiveBriefing({...activeBriefing, flightParams: { ...activeBriefing.flightParams, ata: v }})} />
                      </div>
                      <div className="mt-2 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex justify-between items-center">
                         <span className="text-[10px] font-black uppercase text-emerald-500">Estimated ETE</span>
                         <span className="text-sm font-mono font-black text-white">{activeBriefing.flightParams.timeEnRoute || '--:--'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white/5 p-8 rounded-[2.5rem] border border-white/5 space-y-6">
                    <p className="text-[10px] font-black uppercase text-orange-400 tracking-widest">Logging Metrics (Hours)</p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <InputField label="Flight Time" value={activeBriefing.flightParams.flightTime} placeholder="H:M" onChange={(v) => setActiveBriefing({...activeBriefing, flightParams: { ...activeBriefing.flightParams, flightTime: v }})} />
                      <InputField label="Block Time" value={activeBriefing.flightParams.blockTime} placeholder="H:M" onChange={(v) => setActiveBriefing({...activeBriefing, flightParams: { ...activeBriefing.flightParams, blockTime: v }})} />
                      <InputField label="Night" value={activeBriefing.flightParams.nightHours} placeholder="H:M" onChange={(v) => setActiveBriefing({...activeBriefing, flightParams: { ...activeBriefing.flightParams, nightHours: v }})} />
                      <InputField label="Instrument" value={activeBriefing.flightParams.instrumentHours} placeholder="H:M" onChange={(v) => setActiveBriefing({...activeBriefing, flightParams: { ...activeBriefing.flightParams, instrumentHours: v }})} />
                    </div>
                  </div>
                </motion.div>
              )}

              {activeSection === 4 && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-8">
                  <SectionHeader title="AIRSPACE HAZARDS" subtitle="NOTAMs and Safety Warnings" color="text-red-500" />
                  <div className="grid md:grid-cols-3 gap-6">
                    <TextareaField label="Departure NOTAMs" value={activeBriefing.notams.dep} onChange={(v) => setActiveBriefing({...activeBriefing, notams: { ...activeBriefing.notams, dep: v }})} />
                    <TextareaField label="Destination NOTAMs" value={activeBriefing.notams.arr} onChange={(v) => setActiveBriefing({...activeBriefing, notams: { ...activeBriefing.notams, arr: v }})} />
                    <TextareaField label="Alternate NOTAMs" value={activeBriefing.notams.alt} onChange={(v) => setActiveBriefing({...activeBriefing, notams: { ...activeBriefing.notams, alt: v }})} />
                  </div>
                  <TextareaField label="Additional Strategic Notes" value={activeBriefing.notams.notes} onChange={(v) => setActiveBriefing({...activeBriefing, notams: { ...activeBriefing.notams, notes: v }})} />
                </motion.div>
              )}

              {activeSection === 5 && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-8">
                  <SectionHeader title="ATC & FPL OPS" subtitle="Communications and Clearances" color="text-orange-500" />
                  <div className="grid md:grid-cols-2 gap-12">
                     <div className="space-y-4">
                        <p className="text-[10px] font-black uppercase text-gray-500 mb-4 tracking-[0.2em] ml-2">Communications Deck</p>
                        {activeBriefing.atcNotes.frequencies.map((f, i) => (
                           <div key={f.label} className="bg-black/30 p-4 rounded-2xl flex items-center justify-between border border-white/5">
                              <span className="text-[10px] font-black uppercase text-blue-500">{f.label}</span>
                              <input className="bg-transparent text-right font-mono font-black text-sm outline-none" value={f.value} placeholder="123.45" onChange={(e) => {
                                 const fq = [...activeBriefing.atcNotes.frequencies];
                                 fq[i].value = e.target.value;
                                 setActiveBriefing({...activeBriefing, atcNotes: { ...activeBriefing.atcNotes, frequencies: fq }});
                              }} />
                           </div>
                        ))}
                     </div>
                     <div className="space-y-6 text-white">
                        <div className="bg-white/5 p-8 rounded-[2.5rem] border border-white/5 space-y-6">
                           <InputField label="ATC Clearance" value={activeBriefing.atcNotes.clearance} onChange={(v) => setActiveBriefing({...activeBriefing, atcNotes: { ...activeBriefing.atcNotes, clearance: v }})} />
                           <div className="grid grid-cols-3 gap-4">
                              <InputField label="Squawk Code" value={activeBriefing.atcNotes.squawk} onChange={(v) => setActiveBriefing({...activeBriefing, atcNotes: { ...activeBriefing.atcNotes, squawk: v }})} />
                              <InputField label="Dep Rwy" value={activeBriefing.atcNotes.runways.dep} onChange={(v) => setActiveBriefing({...activeBriefing, atcNotes: { ...activeBriefing.atcNotes, runways: { ...activeBriefing.atcNotes.runways, dep: v }}})} />
                              <InputField label="Arr Rwy" value={activeBriefing.atcNotes.runways.arr} onChange={(v) => setActiveBriefing({...activeBriefing, atcNotes: { ...activeBriefing.atcNotes, runways: { ...activeBriefing.atcNotes.runways, arr: v }}})} />
                           </div>
                           <div className="space-y-4">
                              <p className="text-[10px] font-black uppercase text-blue-400 tracking-widest px-2">Procedures & Routes</p>
                              <div className="grid grid-cols-3 gap-2">
                                <InputField label="SID" value={activeBriefing.atcNotes.procedures.sid} onChange={(v) => setActiveBriefing({...activeBriefing, atcNotes: { ...activeBriefing.atcNotes, procedures: { ...activeBriefing.atcNotes.procedures, sid: v }}})} />
                                <InputField label="STAR" value={activeBriefing.atcNotes.procedures.star} onChange={(v) => setActiveBriefing({...activeBriefing, atcNotes: { ...activeBriefing.atcNotes, procedures: { ...activeBriefing.atcNotes.procedures, star: v }}})} />
                                <InputField label="Approach" value={activeBriefing.atcNotes.procedures.approach} onChange={(v) => setActiveBriefing({...activeBriefing, atcNotes: { ...activeBriefing.atcNotes, procedures: { ...activeBriefing.atcNotes.procedures, approach: v }}})} />
                              </div>
                           </div>
                        </div>
                     </div>
                  </div>
                </motion.div>
              )}

              {activeSection === 6 && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-8">
                  <SectionHeader title="FUEL OPERATIONS" subtitle="Mandatory Reserves & Total Required" color="text-orange-500" />
                  <div className="bg-white/5 p-8 rounded-[2.5rem] border border-white/5 grid md:grid-cols-2 gap-12">
                    <div className="space-y-6">
                       <InputField label="Fuel On Board (Ltr)" value={activeBriefing.flightParams.fuelOnBoardLtr} placeholder="0" onChange={(v) => setActiveBriefing({...activeBriefing, flightParams: { ...activeBriefing.flightParams, fuelOnBoardLtr: v }})} />
                       <InputField label="Alternate Fuel (Ltr)" value={activeBriefing.fuelCalc.alternateFuel} placeholder="0" onChange={(v) => setActiveBriefing({...activeBriefing, fuelCalc: { ...activeBriefing.fuelCalc, alternateFuel: v }})} />
                       <div className="p-6 bg-slate-900/50 rounded-3xl border border-white/5 space-y-4">
                          <p className="text-[9px] font-black uppercase text-gray-500 tracking-widest text-center">Fuel Summary (Required)</p>
                          <div className="grid grid-cols-2 gap-4">
                             <div className="text-center">
                                <p className="text-2xl font-mono font-black text-white">{activeBriefing.flightParams.totalFuelRequiredLtr}</p>
                                <p className="text-[9px] font-bold text-gray-500 uppercase">Litres</p>
                             </div>
                             <div className="text-center">
                                <p className="text-2xl font-mono font-black text-white">{activeBriefing.flightParams.totalFuelRequiredKg}</p>
                                <p className="text-[9px] font-bold text-gray-500 uppercase">Kilograms</p>
                             </div>
                          </div>
                       </div>
                       {activeBriefing.fuelCalc.isLowFuel && (
                         <div className="p-6 bg-red-600 rounded-3xl border shadow-xl shadow-red-600/20 border-red-500 flex items-center gap-4 animate-pulse">
                            <AlertCircle size={32} className="text-white" />
                            <div>
                               <p className="text-xs font-black uppercase text-white leading-none mb-1">Low Fuel Warning</p>
                               <p className="text-[10px] font-bold text-white/80 leading-relaxed uppercase">Required fuel exceeds aircraft capacity!</p>
                            </div>
                         </div>
                       )}
                    </div>
                    <div className="bg-black/20 p-8 rounded-3xl border border-white/5 space-y-6">
                       <p className="text-[10px] font-black uppercase text-blue-400 tracking-widest text-center">Calculation Breakdown</p>
                       <FuelRow label="Trip Fuel" ltr={activeBriefing.flightParams.tripFuelLtr} kg={activeBriefing.flightParams.tripFuelKg} />
                       <FuelRow label="Reserve (45m)" ltr={activeBriefing.flightParams.reserveFuelLtr} kg={activeBriefing.flightParams.reserveFuelKg} />
                       <FuelRow label="Alt Fuel" ltr={activeBriefing.flightParams.alternateFuelLtr} kg={activeBriefing.flightParams.alternateFuelKg} />
                       <FuelRow label="Contingency (10%)" ltr={activeBriefing.flightParams.contingencyFuelLtr} kg={activeBriefing.flightParams.contingencyFuelKg} />
                       <div className="pt-6 mt-4 border-t border-white/10 space-y-4">
                          <div className="flex justify-between items-center text-orange-500">
                             <span className="text-[10px] font-black uppercase tracking-widest">Total Req (BLOCK)</span>
                             <span className="text-sm font-mono font-black">{activeBriefing.flightParams.totalFuelRequiredLtr} LTR</span>
                          </div>
                          {activeBriefing.aircraft.specs && (
                             <div className="flex justify-between items-center text-gray-500">
                                <span className="text-[8px] font-bold uppercase">Aircraft Capacity</span>
                                <span className="text-[10px] font-mono font-bold">{activeBriefing.aircraft.specs.fuelCapacityLtr} LTR</span>
                             </div>
                          )}
                       </div>
                       <div className="pt-4">
                          <p className="text-[8px] font-bold text-gray-500 uppercase mb-4 italic">Auto-calculated based on GC distance and cruise burn rates.</p>
                       </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeSection === 7 && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-8">
                   <SectionHeader title="WEIGHT & PERFORMANCE" subtitle="Structural Limits & Field Ops" color="text-purple-500" />
                   <div className="grid md:grid-cols-2 gap-8">
                      <div className="bg-white/5 p-8 rounded-[2.5rem] border border-white/5 space-y-6">
                        <p className="text-[10px] font-black uppercase text-purple-400 tracking-widest">Weight Distribution (lbs)</p>
                        <div className="grid grid-cols-2 gap-4">
                           <InputField label="Pilot/Crew" value={activeBriefing.weightBalance.pilotWeight} onChange={(v) => setActiveBriefing({...activeBriefing, weightBalance: { ...activeBriefing.weightBalance, pilotWeight: v }})} />
                           <InputField label="Passengers" value={activeBriefing.weightBalance.passengerWeight} onChange={(v) => setActiveBriefing({...activeBriefing, weightBalance: { ...activeBriefing.weightBalance, passengerWeight: v }})} />
                           <InputField label="Baggage" value={activeBriefing.weightBalance.baggageWeight} onChange={(v) => setActiveBriefing({...activeBriefing, weightBalance: { ...activeBriefing.weightBalance, baggageWeight: v }})} />
                           <InputField label="Fuel Weight" value={activeBriefing.weightBalance.fuelWeight} readOnly />
                        </div>
                        <div className="space-y-3 pt-4">
                           <WeightRow label="Zero Fuel Wt" value={activeBriefing.weightBalance.zfw} limit={activeBriefing.weightBalance.mzfw} isOver={activeBriefing.weightBalance.isOverMZFW} />
                           <WeightRow label="Takeoff Weight" value={activeBriefing.weightBalance.tow} limit={activeBriefing.weightBalance.mtow} isOver={activeBriefing.weightBalance.isOverweight} />
                           <WeightRow label="Landing Weight" value={activeBriefing.weightBalance.lw} limit={activeBriefing.weightBalance.mlw} isOver={activeBriefing.weightBalance.isOverMLW} />
                        </div>
                      </div>

                      <div className="bg-white/5 p-8 rounded-[2.5rem] border border-white/5 space-y-6">
                        <p className="text-[10px] font-black uppercase text-blue-400 tracking-widest">Field Performance</p>
                        <div className="grid grid-cols-2 gap-4">
                           <InputField label="Airport Elevation" value={activeBriefing.performance.elevation} onChange={(v) => setActiveBriefing({...activeBriefing, performance: { ...activeBriefing.performance, elevation: v }})} />
                           <InputField label="Runway Length" value="5000" placeholder="ft" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 bg-black/40 border border-white/5 rounded-2xl">
                               <p className="text-[8px] font-black uppercase text-gray-500 mb-1">Density Alt</p>
                               <p className="text-sm font-mono font-black text-white">{activeBriefing.performance.densityAltitude} ft</p>
                            </div>
                            <div className="p-4 bg-black/40 border border-white/5 rounded-2xl">
                               <p className="text-[8px] font-black uppercase text-gray-500 mb-1">Perf Reduction</p>
                               <p className="text-sm font-mono font-black text-orange-500">{activeBriefing.performance.performanceReduction}%</p>
                            </div>
                        </div>
                        <div className="space-y-3">
                           <div className="flex justify-between items-center p-3 border-b border-white/5">
                              <span className="text-[9px] font-black uppercase text-gray-400 tracking-widest">TODR (Est)</span>
                              <span className="text-xs font-mono font-black text-white">{activeBriefing.performance.takeoffDist} ft</span>
                           </div>
                           <div className="flex justify-between items-center p-3 border-b border-white/5">
                              <span className="text-[9px] font-black uppercase text-gray-400 tracking-widest">LDR (Est)</span>
                              <span className="text-xs font-mono font-black text-white">{activeBriefing.performance.landingDist} ft</span>
                           </div>
                        </div>
                        {activeBriefing.performance.isRunwayShort && (
                          <div className="p-4 bg-red-600 rounded-2xl flex items-center gap-3">
                             <AlertCircle size={20} className="text-white" />
                             <p className="text-[9px] font-black uppercase text-white tracking-widest">Insufficient Runway Length!</p>
                          </div>
                        )}
                      </div>
                   </div>
                </motion.div>
              )}

              {activeSection === 8 && (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="max-w-2xl mx-auto space-y-12 py-8">
                  <div className="text-center space-y-2">
                    <div className="p-6 bg-blue-600/20 rounded-full w-fit mx-auto mb-6">
                      <ShieldCheck size={48} className="text-blue-500" />
                    </div>
                    <h2 className="text-3xl font-black uppercase italic tracking-tighter">Operational Readiness</h2>
                    <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.3em]">Must be verified by Pilot in Command</p>
                  </div>

                  <div className="grid gap-3">
                    <CheckItem label="Weather Conditions Analyzed" active={activeBriefing.checklist.weatherCleared} onClick={() => setActiveBriefing({...activeBriefing, checklist: { ...activeBriefing.checklist, weatherCleared: !activeBriefing.checklist.weatherCleared}})} />
                    <CheckItem label="NOTAMs / Restrictions Verified" active={activeBriefing.checklist.notamChecked} onClick={() => setActiveBriefing({...activeBriefing, checklist: { ...activeBriefing.checklist, notamChecked: !activeBriefing.checklist.notamChecked}})} />
                    <CheckItem label="Fuel Requirements Satisfied" active={activeBriefing.checklist.fuelCalculated} onClick={() => setActiveBriefing({...activeBriefing, checklist: { ...activeBriefing.checklist, fuelCalculated: !activeBriefing.checklist.fuelCalculated}})} />
                    <CheckItem label="Flight Plan Successfully Filed" active={activeBriefing.checklist.fplFiled} onClick={() => setActiveBriefing({...activeBriefing, checklist: { ...activeBriefing.checklist, fplFiled: !activeBriefing.checklist.fplFiled}})} />
                    <CheckItem label="Aircraft Logbook & Check OK" active={activeBriefing.checklist.aircraftChecked} onClick={() => setActiveBriefing({...activeBriefing, checklist: { ...activeBriefing.checklist, aircraftChecked: !activeBriefing.checklist.aircraftChecked}})} />
                    <CheckItem label="ATC Contact & Clearance Ready" active={activeBriefing.checklist.atcContacted} onClick={() => setActiveBriefing({...activeBriefing, checklist: { ...activeBriefing.checklist, atcContacted: !activeBriefing.checklist.atcContacted}})} />
                  </div>

                  <div className="pt-8">
                    <button 
                      onClick={handleSave}
                      disabled={!Object.values(activeBriefing.checklist).every(v => v)}
                      className="w-full py-6 bg-blue-600 disabled:opacity-20 disabled:cursor-not-allowed rounded-3xl font-black uppercase tracking-[0.2em] text-xs hover:bg-blue-500 transition-all flex items-center justify-center gap-3 shadow-2xl shadow-blue-600/40"
                    >
                      <Save size={20} /> Authorize & Archive Briefing
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Hidden PDF Capture Area */}
          <div id="briefing-pdf-content" style={{ display: 'none', padding: '40px', width: '800px', background: '#0f172a', color: 'white' }}>
             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', borderBottom: '2px solid #3b82f6', paddingBottom: '20px' }}>
                <div>
                  <h1 style={{ fontSize: '24px', fontWeight: '900', textTransform: 'uppercase', marginBottom: '5px' }}>AirclassPRO Flight Briefing</h1>
                  <p style={{ fontSize: '10px', color: '#3b82f6', fontWeight: '900', textTransform: 'uppercase' }}>Electronic Operational Logistics Briefing</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                   <p style={{ fontSize: '12px', fontWeight: '900', textTransform: 'uppercase' }}>{activeBriefing.aircraft.pic}</p>
                   <p style={{ fontSize: '10px', color: '#64748b' }}>{new Date(activeBriefing.createdAt).toLocaleString()}</p>
                </div>
             </div>
             
             <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', marginBottom: '30px' }}>
                <div style={{ padding: '20px', background: 'rgba(255,255,255,0.05)', borderRadius: '15px' }}>
                   <p style={{ fontSize: '10px', color: '#3b82f6', fontWeight: '900', marginBottom: '15px' }}>WEATHER ENVIRONMENT</p>
                   <p style={{ fontSize: '12px', marginBottom: '10px' }}>DEPARTURE: <strong>{activeBriefing.weather.depIcao}</strong></p>
                   <p style={{ fontSize: '8px', color: '#94a3b8', fontStyle: 'italic', marginBottom: '15px' }}>{activeBriefing.weather.depMetar}</p>
                   <p style={{ fontSize: '12px', marginBottom: '10px' }}>DESTINATION: <strong>{activeBriefing.weather.arrIcao}</strong></p>
                   <p style={{ fontSize: '8px', color: '#94a3b8', fontStyle: 'italic' }}>{activeBriefing.weather.arrMetar}</p>
                </div>
                <div style={{ padding: '20px', background: 'rgba(255,255,255,0.05)', borderRadius: '15px' }}>
                    <p style={{ fontSize: '10px', color: '#10b981', fontWeight: '900', marginBottom: '15px' }}>FLIGHT PERFORMANCE</p>
                    <p style={{ fontSize: '11px', marginBottom: '5px' }}>AIRCRAFT: {activeBriefing.aircraft.type} ({activeBriefing.aircraft.registration})</p>
                    <p style={{ fontSize: '11px', marginBottom: '5px' }}>CALLSIGN: {activeBriefing.aircraft.callsign}</p>
                    <p style={{ fontSize: '11px', marginBottom: '5px' }}>PIC: {activeBriefing.aircraft.pic}</p>
                    {activeBriefing.aircraft.coPilot && <p style={{ fontSize: '11px', marginBottom: '5px' }}>COPILOT: {activeBriefing.aircraft.coPilot}</p>}
                    <p style={{ fontSize: '11px', marginBottom: '5px' }}>TAS: {activeBriefing.flightParams.tas} KTS</p>
                    <p style={{ fontSize: '11px', marginBottom: '5px' }}>GS: {activeBriefing.flightParams.gs} KTS</p>
                    <p style={{ fontSize: '11px', marginBottom: '5px' }}>ALTITUDE: {activeBriefing.flightParams.altitude} FT</p>
                    <p style={{ fontSize: '11px' }}>FUEL BURN: {activeBriefing.fuelCalc.burnRate}/HR</p>
                </div>
             </div>

             <div style={{ marginTop: '30px', paddingTop: '20px', borderTop: '1px solid rgba(255,255,255,0.1)', textAlign: 'center' }}>
                <p style={{ fontSize: '8px', color: '#64748b', textTransform: 'uppercase', marginBottom: '10px' }}>
                   This briefing log is generated by AirclassPRO for study and reference purposes only.
                   Always obtain official weather briefing from MET office and ATC before actual flight.
                </p>
                <p style={{ fontSize: '8px', fontWeight: '900' }}>© 2026 AirclassPRO. All rights reserved.</p>
             </div>
          </div>

          <p className="mt-12 text-center text-[8px] font-bold text-gray-700 uppercase tracking-widest max-w-lg mx-auto">
             Always cross-verify AirclassPRO auto-populated data with official AIP and METAR sources before making operational decisions.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tighter leading-none mb-2">OPERATIONAL LOGS</h1>
            <div className="flex items-center gap-3">
               <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full border border-blue-100">AirclassPRO Suite</span>
               <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">v2.1 Stable</span>
            </div>
          </div>
          <button 
            onClick={handleStartNew}
            className="px-10 py-5 bg-slate-900 text-white rounded-[2rem] font-black uppercase tracking-[0.2em] text-xs hover:bg-blue-600 transition-all shadow-2xl shadow-slate-900/10 flex items-center gap-3"
          >
            <Plus size={20} /> Create Flight Briefing
          </button>
        </div>

        {briefings.length === 0 ? (
          <div className="py-40 text-center bg-white rounded-[3.5rem] border-2 border-dashed border-slate-200">
             <div className="p-8 bg-blue-50 rounded-full w-fit mx-auto mb-10 shadow-inner">
                <FileText size={64} className="text-blue-200" />
             </div>
             <h4 className="text-2xl font-black text-slate-900 mb-2">No Briefings Archived</h4>
             <p className="text-slate-500 max-w-sm mx-auto font-medium mb-10">
               Generate your first professional pilot briefing log to begin tracking your flight data and archive it securely.
             </p>
             <button onClick={handleStartNew} className="px-8 py-3 bg-blue-50 text-blue-600 rounded-full font-black uppercase text-[10px] tracking-widest hover:bg-blue-600 hover:text-white transition-all">Start Onboarding</button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
             <AnimatePresence>
                {briefings.map(b => (
                  <motion.div 
                    key={b.id} 
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="bg-white p-8 rounded-[3rem] shadow-xl border border-slate-100 hover:border-blue-500 hover:shadow-2xl hover:shadow-blue-500/10 transition-all group relative"
                  >
                    <div className="flex items-center justify-between mb-8">
                      <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
                        <History size={20} />
                      </div>
                      <button onClick={() => deleteBriefing(b.id)} className="text-slate-300 hover:text-red-500 transition-colors p-2">
                        <Trash2 size={16} />
                      </button>
                    </div>
                    <div className="flex items-center gap-4 mb-4">
                      <h3 className="text-3xl font-black text-slate-900 tracking-tighter">{b.weather.depIcao}</h3>
                      <ArrowRight size={20} className="text-blue-500 animate-pulse" />
                      <h3 className="text-3xl font-black text-slate-900 tracking-tighter">{b.weather.arrIcao}</h3>
                    </div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-10 flex items-center gap-2">
                       <Clock size={12} /> {new Date(b.createdAt).toLocaleDateString()} • {new Date(b.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                    <div className="flex items-center justify-between pt-8 border-t border-slate-50">
                       <span className="text-[10px] font-black uppercase tracking-widest text-blue-600 bg-blue-50 px-4 py-2 rounded-full border border-blue-100">Archived Briefing</span>
                       <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-blue-600 transition-all">
                          <ExternalLink size={14} /> View Log
                       </button>
                    </div>
                  </motion.div>
                ))}
             </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}

// Sub-components
function SpecRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-center border-b border-white/5 pb-1">
      <span className="text-[8px] font-black uppercase text-gray-500 tracking-wider">{label}</span>
      <span className="text-[10px] font-black text-white">{value}</span>
    </div>
  );
}

function FuelRow({ label, ltr, kg }: { label: string; ltr: string; kg: string }) {
  return (
    <div className="flex justify-between items-center p-3 border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors rounded-xl">
       <span className="text-[10px] font-black uppercase text-gray-500 tracking-widest">{label}</span>
       <div className="text-right">
          <p className="text-[10px] font-black text-white font-mono">{ltr} Ltr</p>
          <p className="text-[8px] font-bold text-gray-600 font-mono uppercase">{kg} Kg</p>
       </div>
    </div>
  );
}

function WeightRow({ label, value, limit, isOver }: { label: string; value: string; limit: string; isOver: boolean }) {
  return (
    <div className={`flex justify-between items-center p-4 rounded-2xl border ${isOver ? 'bg-red-500/10 border-red-500/30' : 'bg-black/20 border-white/5'}`}>
       <div>
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">{label}</p>
          <p className="text-[8px] font-bold text-gray-600 uppercase">Limit: {limit} lbs</p>
       </div>
       <div className="text-right">
          <p className={`text-sm font-mono font-black ${isOver ? 'text-red-500' : 'text-emerald-500'}`}>{value} lbs</p>
          {isOver && <p className="text-[8px] font-black text-red-500 uppercase animate-pulse">WARNING: OVER LIMIT</p>}
       </div>
    </div>
  );
}

function StatusCard({ label, value, subtitle, color }: { label: string; value: string; subtitle: string; color: 'blue' | 'red' | 'emerald' }) {
  const colors = {
    blue: 'text-blue-500 bg-blue-500/10 border-blue-500/20',
    red: 'text-red-500 bg-red-500/10 border-red-500/20',
    emerald: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20'
  };
  
  return (
    <div className={`p-6 rounded-[2rem] border ${colors[color]}`}>
       <p className="text-[9px] font-black uppercase tracking-widest mb-1 opacity-60">{label}</p>
       <p className="text-xl font-black italic tracking-tighter uppercase">{value}</p>
       <p className="text-[8px] font-bold uppercase opacity-40">{subtitle}</p>
    </div>
  );
}

function SectionHeader({ title, subtitle, color }: { title: string; subtitle: string; color: string }) {
  return (
    <div className="space-y-1">
      <h3 className="text-2xl font-black uppercase italic text-white tracking-tighter">{title}</h3>
      <p className={`text-[10px] font-black uppercase tracking-[0.4em] ${color}`}>{subtitle}</p>
    </div>
  );
}

function InputField({ label, value, onChange, placeholder, readOnly }: { label: string; value: string; onChange?: (v: string) => void; placeholder?: string; readOnly?: boolean }) {
  return (
    <div className="space-y-1">
      <label className="text-[9px] font-black uppercase text-gray-500 ml-2 tracking-widest">{label}</label>
      <input 
        className={`w-full p-4 rounded-2xl border border-white/5 text-xs font-black outline-none transition-all placeholder:text-white/10 ${
          readOnly ? 'bg-black/20 text-gray-400 cursor-not-allowed border-transparent' : 'bg-white/5 text-white focus:border-blue-500/50 focus:bg-white/10'
        }`}
        value={value || ''}
        readOnly={readOnly}
        onChange={(e) => onChange && onChange(e.target.value)}
        placeholder={placeholder || '---'}
      />
    </div>
  );
}

function TextareaField({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <div className="space-y-1 h-full flex flex-col">
      <label className="text-[9px] font-black uppercase text-gray-500 ml-2 tracking-widest">{label}</label>
      <textarea 
        className="flex-1 min-h-[120px] w-full bg-white/5 p-4 rounded-3xl border border-white/5 text-xs font-bold outline-none focus:border-blue-500/50 focus:bg-white/10 transition-all resize-none"
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
    </div>
  );
}

function SelectionField({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (v: string) => void }) {
  return (
    <div className="space-y-1">
      <label className="text-[9px] font-black uppercase text-gray-500 ml-2 tracking-widest">{label}</label>
      <div className="flex bg-white/5 p-1 rounded-2xl border border-white/5">
        {options.map(opt => (
          <button
            key={opt}
            onClick={() => onChange(opt)}
            className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
              value === opt ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-500 hover:text-white'
            }`}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}

function IcaoBox({ label, value, metar, onUpdate, onFetch }: { label: string; value: string; metar?: string; onUpdate: (v: string) => void; onFetch: () => void }) {
  return (
    <div className="bg-white/5 p-6 rounded-[2rem] border border-white/5 space-y-4 hover:border-blue-500/30 transition-all">
      <div className="flex items-center justify-between">
        <label className="text-[9px] font-black uppercase text-gray-500 tracking-widest">{label} ICAO</label>
        <button onClick={onFetch} className="p-2 bg-blue-600 rounded-xl hover:bg-blue-500 transition-all shadow-lg shadow-blue-600/20">
          <Search size={14} className="text-white" />
        </button>
      </div>
      <input 
        className="w-full bg-transparent text-3xl font-black text-white outline-none placeholder:text-white/5" 
        placeholder="----"
        value={value || ''}
        onChange={(e) => onUpdate(e.target.value.toUpperCase())}
      />
      <div className="h-16 overflow-y-auto pr-2 scrollbar-hide">
        <p className="text-[9px] font-mono text-blue-400/80 leading-relaxed">
          {metar || 'No METAR data fetched yet. Tap the search icon to load live broadcast.'}
        </p>
      </div>
    </div>
  );
}

function DateInput({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
   return (
      <div className="space-y-1 overflow-hidden">
         <label className="text-[8px] font-black uppercase text-gray-500 ml-2">{label}</label>
         <div className="bg-white/5 p-4 rounded-2xl border border-white/5 flex items-center justify-between">
            <input type="date" className="bg-transparent text-[10px] font-black text-white outline-none w-full" value={value || ''} onChange={(e) => onChange(e.target.value)} />
         </div>
      </div>
   );
}

function ToggleInput({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
   return (
      <button onClick={onClick} className="w-full bg-white/5 p-4 rounded-2xl border border-white/5 flex items-center justify-between group">
         <span className={`text-[10px] font-black uppercase tracking-widest ${active ? 'text-white' : 'text-gray-500'}`}>{label}</span>
         <div className={`w-10 h-6 rounded-full transition-all flex items-center px-1 ${active ? 'bg-blue-600' : 'bg-white/10'}`}>
            <div className={`w-4 h-4 rounded-full bg-white shadow-md transition-all ${active ? 'translate-x-4' : 'translate-x-0'}`} />
         </div>
      </button>
   );
}

function CheckItem({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={`w-full p-6 rounded-[2rem] border transition-all flex items-center justify-between group ${
        active 
          ? 'bg-blue-600/10 border-blue-500/50 shadow-inner' 
          : 'bg-white/5 border-white/5 hover:bg-white/10'
      }`}
    >
      <div className="flex items-center gap-4">
        <div className={`p-2 rounded-xl transition-all ${active ? 'bg-blue-600 text-white' : 'bg-white/5 text-gray-600'}`}>
           <CheckCircle size={16} />
        </div>
        <span className={`text-[11px] font-black uppercase tracking-widest ${active ? 'text-white' : 'text-gray-400 group-hover:text-gray-200'}`}>{label}</span>
      </div>
      <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-all ${active ? 'bg-blue-500' : 'border-2 border-white/10'}`}>
         {active && <div className="w-2 h-2 bg-white rounded-full" />}
      </div>
    </button>
  );
}
