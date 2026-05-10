export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  phoneNumber?: string;
  city?: string;
  studentId: string;
  planId: 'free' | 'cadet' | 'navigator' | 'captain';
  subscriptionStatus: 'active' | 'trialing' | 'inactive';
  isBanned: boolean;
  streak: number;
  readinessScore: number;
  licenseType: string;
  profilePhoto?: string;
  validFrom: string;
  validUntil: string;
  medicalExpiry?: string;
  flightReviewDate?: string;
  licenseExpiry?: string;
  bfrDueDate?: string;
  createdAt: any;
  lastLogin: any;
}

export type StudyTab = 'summary' | 'quiz' | 'chat' | 'planning' | 'logbook' | 'flashcards' | 'library' | 'meteorology' | 'briefing' | 'id-card';

export type DGCASubject = 'air-navigation' | 'air-regulation' | 'meteorology' | 'rtr' | 'general';

export interface CheatSheetItem {
  term: string;
  definition: string;
}

export interface Summary {
  bigPicture: string;
  corePillars: string[];
  cheatSheet: CheatSheetItem[];
}

export interface QuizQuestion {
  id: string;
  type: 'mcq' | 'short';
  question: string;
  options?: string[]; // For MCQ
  correctAnswer: string;
  explanation: string;
}

export interface BrainHacks {
  legoBreakdown: string[];
  mnemonic: string;
  eli5: string;
}

export interface Scenario {
  title: string;
  description: string;
  options: { id: string; text: string; consequence: string; isSafe: boolean }[];
  correctLogic: string;
}

export interface LogbookEntry {
  id: string;
  date: string;
  aircraftType: string;
  registration: string;
  depIcao: string;
  arrIcao: string;
  blockOff: string; // UTC
  blockOn: string; // UTC
  blockTime: number; // minutes
  flightTime: number; // minutes
  day: number; // minutes
  night: number; // minutes
  instrument: number; // minutes
  crossCountry: number; // minutes
  pic: number; // minutes
  copilot: number; // minutes
  dual: number; // minutes
  solo: number; // minutes
  takeoffsDay: number;
  takeoffsNight: number;
  landingsDay: number;
  landingsNight: number;
  remarks: string;
}

export interface CurrencyStatus {
  medicalExpiry: string;
  bfrExpiry: string;
  last90DaysLandings: number;
  nightLandingsCurrency: boolean;
  instrumentCurrency: boolean;
  daysSinceLastFlight: number;
}

export interface StudyMaterial {
  title: string;
  id: string;
  content: string;
  summary?: Summary;
  quiz?: QuizQuestion[];
  hacks?: BrainHacks;
  timestamp: number;
}

export interface AircraftPerformance {
  type: string;
  family: string;
  category: 'Training' | 'Turboprop' | 'Regional' | 'Narrow Body' | 'Wide Body' | 'Indian' | 'Helicopter';
  fuelType: 'AVGAS' | 'JET A1';
  emptyWeight: number; // lbs
  mtow: number; // lbs
  mlw: number; // lbs
  mzfw: number; // lbs
  fuelCapacityLtr: number;
  fuelBurnGPH: number; // Gallons per hour (average)
  cruiseSpeed: number; // kts
  vmo: number; // kts
  vs: number; // kts
  vso: number; // kts
  vy: number; // kts
  bestGlide: number; // kts
  serviceCeiling: number; // ft
  rangeNM: number;
  takeoffDist: number; // ft
  landingDist: number; // ft
  engines: number;
  engineType: 'Piston' | 'Turboprop' | 'Jet' | 'Turboshaft';
  seating: number;
  maxCrosswind: number; // kts
}

export interface FlightBriefing {
  id: string;
  createdAt: string;
  status: 'draft' | 'completed';
  aircraft: {
    type: string;
    registration: string;
    callsign: string;
    pic: string;
    coPilot: string;
    specs?: AircraftPerformance;
  };
  flightParams: {
    ias: string;
    tas: string;
    gs: string;
    mach: string;
    altitude: string;
    oat: string; // Outside Air Temp
    windDir: string;
    windSpeed: string;
    distanceNM: string;
    distanceKM: string;
    fuelOnBoardLtr: string;
    fuelOnBoardKg: string;
    burnRate: string;
    totalFuelUsedKg: string;
    tripFuelLtr: string;
    tripFuelKg: string;
    reserveFuelLtr: string;
    reserveFuelKg: string;
    alternateFuelLtr: string;
    alternateFuelKg: string;
    contingencyFuelLtr: string;
    contingencyFuelKg: string;
    totalFuelRequiredLtr: string;
    totalFuelRequiredKg: string;
    timeEnRoute: string; // ETE
    eta: string;
    ata: string;
    depUtc: string;
    depIst: string;
    arrUtc: string;
    arrIst: string;
    etaUtc: string;
    etaIst: string;
    ataUtc: string;
    ataIst: string;
    blockTime: string;
    flightTime: string;
    nightHours: string;
    instrumentHours: string;
    crossCountryHours: string;
    blockOff: string;
    blockOn: string;
    takeoff: string;
    landing: string;
  };
  fuelCalc: {
    burnRate: string; // Gallons or Kg per hour
    tripFuel: string;
    reserveFuel: string; // 45 mins min
    alternateFuel: string;
    totalRequired: string;
    endurance: string;
    landingFuel: string;
    isLowFuel: boolean;
  };
  weightBalance: {
    emptyWeight: string;
    pilotWeight: string;
    passengerWeight: string;
    baggageWeight: string;
    fuelWeight: string;
    mtow: string;
    mlw: string;
    mzfw: string;
    payload: string;
    cgPosition: string;
    tow: string;
    lw: string;
    zfw: string;
    isOverweight: boolean;
    isOverMLW: boolean;
    isOverMZFW: boolean;
    isOutOfCG: boolean;
  };
  performance: {
    takeoffDist: string;
    landingDist: string;
    rateOfClimb: string;
    serviceCeiling: string;
    elevation: string;
    qnh: string;
    densityAltitude: string;
    performanceReduction: string;
    isRunwayShort: boolean;
  };
  weather: {
    depIcao: string;
    arrIcao: string;
    altIcao: string;
    depMetar?: string;
    arrMetar?: string;
    altMetar?: string;
    depTaf?: string;
    arrTaf?: string;
    altTaf?: string;
    windDir: string;
    windSpeed: string;
    runwayHeading: string;
    headwind: string;
    tailwind: string;
    crosswind: string;
    isCrosswindLimit: boolean;
  };
  notams: {
    dep: string;
    arr: string;
    alt: string;
    notes: string;
  };
  atcNotes: {
    clearance: string;
    squawk: string;
    frequencies: { label: string; value: string }[];
    runways: { dep: string; arr: string };
    procedures: { sid: string; star: string; approach: string };
  };
  checklist: {
    weatherCleared: boolean;
    notamChecked: boolean;
    fuelCalculated: boolean;
    fplFiled: boolean;
    aircraftChecked: boolean;
    atcContacted: boolean;
  };
}
