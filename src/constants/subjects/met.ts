import { Subject } from '../../types/syllabus';

export const meteorologySubject: Subject = {
  id: 'met',
  title: 'AIR METEOROLOGY',
  description: 'Weather patterns, hazards, and forecasting. Understanding atmospheric forces and how to interpret METAR/TAF reports for safe dispatch.',
  topics: [
    {
      id: 'met-1',
      title: 'The Atmosphere',
      explanation: 'Structure and composition of the air blanket surrounding Earth. The Troposphere is the critical layer for pilots.',
      keyPoints: [
        '78% Nitrogen, 21% Oxygen, 1% Argon/Other.',
        'Troposphere: Temp decreases with altitude (~2°C/1000ft).',
        'Tropopause: Boundary where cooling stops.',
        'Stratosphere: Ozone layer, temp increases with height.'
      ],
      practiceQuestions: [],
      revisionCard: '### LAYERS\n- **Troposphere**: 0-11km\n- **Stratosphere**: 11-50km\n- **Mesosphere**: 50-80km'
    },
    {
      id: 'met-2',
      title: 'Temperature',
      explanation: 'The driver of all weather. How heat is transferred via radiation, conduction, and convection.',
      keyPoints: [
        'Insolation: Incoming solar radiation.',
        'Lapse Rate: Change of temp with altitude.',
        'Inversion: Temperature INCREASES with height.',
        'Dalr (dry) vs Salr (saturated) lapse rates.'
      ],
      practiceQuestions: [
        {
          id: 'q-met-2-1',
          q: 'What is the standard ISA temperature lapse rate in the troposphere?',
          options: ['1.98°C per 1000ft', '3.0°C per 1000ft', '0.5°C per 1000ft', '6.5°C per 1000ft'],
          a: '1.98°C per 1000ft',
          explanation: 'In the International Standard Atmosphere (ISA), the temperature decreases linearly at a rate of 1.98°C (often rounded to 2°C) for every 1000 feet of altitude gain in the troposphere.'
        }
      ],
      revisionCard: '### TEMP\n- **DALR**: 3°C / 1000ft\n- **SALR**: 1.5°C / 1000ft'
    },
    {
      id: 'met-3',
      title: 'Pressure and Density',
      explanation: 'Atmospheric weight and its effect on aircraft performance. Density is the "thickness" of the air.',
      keyPoints: [
        'Standard Sea Level Pressure: 1013.25 hPa.',
        'High Density = Better performance.',
        'Density Altitude: Pressure alt corrected for non-standard temp.',
        'Low pressure = High density altitude = Poor performance.'
      ],
      practiceQuestions: [],
      revisionCard: '### PRESSURE\n- **1013.2**: ISA Standard\n- **Low Dens**: High/Hot ops'
    },
    {
      id: 'met-4',
      title: 'Pressure Systems',
      explanation: 'Anticyclones (Highs) and Depressions (Lows). Their circulation and associated weather patterns.',
      keyPoints: [
        'Lows (Cyclones): Rising air, clouds, rain.',
        'Highs (Anticyclones): Sinking air, clear skies, fog.',
        'Isobars: Lines of equal pressure.',
        'Trough (extending Low); Ridge (extending High).'
      ],
      practiceQuestions: [],
      revisionCard: '### SYSTEMS\n- **High**: Clockwise (NH)\n- **Low**: Anti-clockwise (NH)'
    },
    {
      id: 'met-5',
      title: 'Altimetry',
      explanation: 'Determining altitude from pressure. Navigating when pressure or temperature varies from standard.',
      keyPoints: [
        'QNH: Regional setting for altitude above MSL.',
        'QFE: Station setting for height above runway.',
        'Standard: 1013.2 for FL (Flight Levels).',
        'Formula: 1 hPa = ~27 feet (at sea level).'
      ],
      practiceQuestions: [],
      revisionCard: '### ALTIMETRY\n- **QNH**: Altitude\n- **QFE**: Height\n- **QNE**: Flight Level'
    },
    {
      id: 'met-6',
      title: 'Humidity and Condensation',
      explanation: 'Moisture in the air. Dew point, relative humidity, and how clouds form.',
      keyPoints: [
        'Dew Point: Temp at which air becomes saturated.',
        'Relative Humidity: Moisture held vs max moisture.',
        'Latent Heat: Energy absorbed/released during state change.',
        'Condensation leads to cloud or fog formation.'
      ],
      practiceQuestions: [],
      revisionCard: '### HUMIDITY\n- **Saturation**: Temp = Dewpoint\n- **Condensation**: Cloud birth'
    },
    {
      id: 'met-7',
      title: 'Adiabatic Processes',
      explanation: 'Temperature changes in a rising or sinking parcel of air without exchange of heat with surroundings.',
      keyPoints: [
        'Air expands and cools as it rises.',
        'Air compresses and warms as it sinks.',
        'ELR (Environmental Lapse Rate) vs Parcel rate.',
        'Critical for determining atmospheric stability.'
      ],
      practiceQuestions: [],
      revisionCard: '### ADIABATIC\n- **Ascending**: Cools\n- **Descending**: Warms'
    },
    {
      id: 'met-8',
      title: 'Static Stability',
      explanation: 'The tendency of air to resist or promote vertical displacement (lifting).',
      keyPoints: [
        'Stable: Air returns to original level.',
        'Unstable: Air continues to rise (leads to Cumulus).',
        'Neutral: Air stays at new level.',
        'Conditional Instability: Depends on saturation.'
      ],
      practiceQuestions: [],
      revisionCard: '### STABILITY\n- **Stable**: Layered weather\n- **Unstable**: Vertical weather'
    },
    {
      id: 'met-9',
      title: 'Clouds',
      explanation: 'Classifying types by height and shape. Cumuliform (vertical) vs Stratiform (layered).',
      keyPoints: [
        'High: Cirrus (Ci), Cirrostratus (Cs).',
        'Medium: Altocumulus (Ac), Altostratus (As).',
        'Low: Stratus (St), Cumulus (Cu).',
        'Cb (Cumulonimbus): The king of hazardous weather.'
      ],
      practiceQuestions: [],
      revisionCard: '### CLOUDS\n- **Nimbus**: Rain bearing\n- **Stratus**: Layered\n- **Cumulus**: Puffy/Towering'
    },
    {
      id: 'met-10',
      title: 'Fog, Mist, and Haze',
      explanation: 'Common poor visibility conditions that restrict operations.',
      keyPoints: [
        'Fog: Visibility < 1000m due to water droplets.',
        'Radiation Fog: Forms on calm, clear nights over land.',
        'Advection Fog: Warm moist air over cold surface.',
        'Haze: Dust/Smoke particles (Relative Humidity < 95%).'
      ],
      practiceQuestions: [],
      revisionCard: '### VISIBILITY\n- **Rad Fog**: Land/Night\n- **Adv Fog**: Sea/Day'
    },
    {
      id: 'met-11',
      title: 'Precipitation',
      explanation: 'Rain, Snow, Hail, and Drizzle. Their formation and impact on flight safety.',
      keyPoints: [
        'Coalescence: Droplets merging into larger ones.',
        'Bergeron Process: Ice crystals growing at the expense of droplets.',
        'Freezing Rain: Massive icing hazard (Supercooled).',
        'Hail: Vertical updrafts in Cb clouds.'
      ],
      practiceQuestions: [],
      revisionCard: '### RAIN\n- **Freezing Rain**: Supercooled risk\n- **Drizzle**: Tiny droplets'
    },
    {
      id: 'met-12',
      title: 'Wind and Coriolis Force',
      explanation: 'Movement of air due to pressure difference and Earth\'s rotation.',
      keyPoints: [
        'Pressure Gradient Force (PGF): High to Low.',
        'Coriolis: Deflects wind to Right (NH) and Left (SH).',
        'Geostrophic Wind: Balance of PGF and Coriolis.',
        'Friction layer (0-3000ft) reduces speed and backs wind.'
      ],
      practiceQuestions: [
        {
          id: 'q-met-12-1',
          q: 'In the Northern Hemisphere, which way does the Coriolis force deflect the wind?',
          options: ['To the Left', 'To the Right', 'Directly Up', 'Directly Down'],
          a: 'To the Right',
          explanation: "Due to the Earth's rotation, the Coriolis force deflects moving air to the right in the Northern Hemisphere and to the left in the Southern Hemisphere."
        }
      ],
      revisionCard: '### WIND\n- **Buys Ballot\'s Law**: L on Left (NH)\n- **Veer**: Clockwise change'
    },
    {
      id: 'met-13',
      title: 'Local Winds',
      explanation: 'Winds caused by local geography like coasts or mountains.',
      keyPoints: [
        'Sea Breeze: Day (Offshore to Inland).',
        'Land Breeze: Night (Inland to Offshore).',
        'Anabatic: Day (Up-slope).',
        'Katabatic: Night (Down-slope).'
      ],
      practiceQuestions: [],
      revisionCard: '### LOCAL\n- **Sea Breeze**: Cooler air inland\n- **Katabatic**: Gravity flow'
    },
    {
      id: 'met-14',
      title: 'Mountain Waves',
      explanation: 'Standing waves formed when wind blows across a mountain range.',
      keyPoints: [
        'Lenticular Clouds: Lens-shaped indicator.',
        'Rotor Clouds: High turbulence area below crest.',
        'Downdrafts can exceed aircraft climb capability.',
        'Vertical currents extend to great altitudes.'
      ],
      practiceQuestions: [],
      revisionCard: '### MOUNTAIN\n- **Lenticular**: Wave indicator\n- **Rotor**: Severe turbulence'
    },
    {
      id: 'met-15',
      title: 'Air Masses',
      explanation: 'Large bodies of air with uniform temperature and moisture properties.',
      keyPoints: [
        'Maritime (moist) vs Continental (dry).',
        'Polar (cold) vs Tropical (warm).',
        'Modification: Warming or Cooling from below.',
        'Source Regions determines initial characteristics.'
      ],
      practiceQuestions: [],
      revisionCard: '### AIR MASS\n- **mP**: Maritime Polar\n- **cT**: Continental Tropical'
    },
    {
      id: 'met-16',
      title: 'Fronts',
      explanation: 'Boundaries between two different air masses.',
      keyPoints: [
        'Warm Front: Warm air replacing cold air (shallow slope).',
        'Cold Front: Cold air replacing warm air (steep slope).',
        'Occluded Front: Cold front catches warm front.',
        'Frontal weather: Clouds, rain, pressure drops.'
      ],
      practiceQuestions: [],
      revisionCard: '### FRONTS\n- **Cold**: Blue spikes\n- **Warm**: Red semi-circles'
    },
    {
      id: 'met-17',
      title: 'Frontal Depressions',
      explanation: 'The life cycle of a mid-latitude low-pressure system.',
      keyPoints: [
        'Stage 1: Polar Front wave.',
        'Stage 2: Developing depression.',
        'Stage 3: Mature stage with warm sector.',
        'Stage 4: Occluded stage (decay).'
      ],
      practiceQuestions: [],
      revisionCard: '### LOW LIFE\n- **Origin**: Temp contrast\n- **Death**: Occlusion'
    },
    {
      id: 'met-18',
      title: 'Non-frontal Depressions',
      explanation: 'Thermal lows, Lee lows, and Polar lows.',
      keyPoints: [
        'Thermal Lows: Intense sun heating land.',
        'Lee Lows: Form on the downwind side of mountains.',
        'Trough of Low Pressure: Elongated area of convergence.',
        'Can cause localized severe weather without fronts.'
      ],
      practiceQuestions: [],
      revisionCard: '### NON-FRONTAL\n- **Thermal**: Heat driven\n- **Lee**: Relief driven'
    },
    {
      id: 'met-19',
      title: 'Tropical Revolving Storms',
      explanation: 'Cyclones (Indian Ocean), Hurricanes (Atlantic), Typhoons (Pacific).',
      keyPoints: [
        'Need Sea surface temp > 27°C.',
        'Eye: Calm center with extremely low pressure.',
        'Eye Wall: Most intense wind and rain.',
        'Dissipate over land due to friction and lack of moisture.'
      ],
      practiceQuestions: [],
      revisionCard: '### CYCLONE\n- **Power**: Latent heat\n- **Eye**: 10-30 NM wide'
    },
    {
      id: 'met-20',
      title: 'Thunderstorms (Cb)',
      explanation: 'The most dangerous meteorological phenomenon for aviation.',
      keyPoints: [
        'Stages: Cumulus, Mature, Dissipating.',
        '成熟期: Both Updrafts and Downdrafts present.',
        'Mirco-bursts: Intense localized downdrafts.',
        'Avoidance: Pilots stay 20 NM away from intense echoes.'
      ],
      practiceQuestions: [
        {
          id: 'q-met-20-1',
          q: 'Which stage of a Thunderstorm is characterized by both updrafts and downdrafts?',
          options: ['Cumulus stage', 'Mature stage', 'Dissipating stage', 'Initial stage'],
          a: 'Mature stage',
          explanation: 'The mature stage is the most intense period where both strong updrafts and downdrafts (leading to rain/hail at the surface) are present simultaneously.'
        }
      ],
      revisionCard: '### CB\n- **Mature**: Rain begins\n- **Hazards**: Hail/Lightning'
    },
    {
      id: 'met-21',
      title: 'Aircraft Icing',
      explanation: 'Accumulation of ice on wings and airframe.',
      keyPoints: [
        'Clear Ice: Heavy, spreadable (large droplets).',
        'Rime Ice: Miliky, brittle (small droplets).',
        'Mixed Ice: Combination of both.',
        'Effect: Reduces lift, increases drag/weight/stall speed.'
      ],
      practiceQuestions: [],
      revisionCard: '### ICING\n- **Temp**: -10 to 0°C is peak risk\n- **Clear**: Dangerous!'
    },
    {
      id: 'met-22',
      title: 'Turbulence',
      explanation: 'Irregular motion of the aircraft in flight.',
      keyPoints: [
        'Convective: Thermal activity.',
        'Mechanical: Wind over obstacles.',
        'Clear Air Turbulence (CAT): High level shear near jets.',
        'Wake Turbulence: Wingtip vortices from heavy aircraft.'
      ],
      practiceQuestions: [],
      revisionCard: '### TURB\n- **CAT**: No cloud warning\n- **Wake**: Landing/Takeoff risk'
    },
    {
      id: 'met-23',
      title: 'Jet Streams',
      explanation: 'High speed tubes of wind above the troposphere.',
      keyPoints: [
        'Speeds > 60 knots (up to 200+ knots).',
        'Polar Front Jet and Sub-tropical Jet.',
        'Located near the tropopause breaks.',
        'Provides massive groundspeed boosts eastbound.'
      ],
      practiceQuestions: [],
      revisionCard: '### JET\n- **Core**: 10,000s ft high\n- **Shear**: Dangerous CAT source'
    },
    {
      id: 'met-24',
      title: 'Flight Hazards',
      explanation: 'Dust storms, Squal lines, and Volcanic Ash.',
      keyPoints: [
        'Squall Line: Line of active thunderstorms.',
        'Dust Storms: Reduced visibility to near zero.',
        'Volcanic Ash: Abrasive, melts and stops engines.',
        'Low Level Wind Shear (LLWS): Sudden change in wind.'
      ],
      practiceQuestions: [],
      revisionCard: '### HAZARDS\n- **Ash**: Engine killer\n- **LLWS**: Approach danger'
    },
    {
      id: 'met-25',
      title: 'Meteorological Charts',
      explanation: 'Surface pressure charts and significant weather charts.',
      keyPoints: [
        'Isobaric Charts: Layout of pressure systems.',
        'SWC: Significant Weather Chart (high level).',
        'Wind & Temp Charts for route planning.',
        'Updated every 3, 6, or 12 hours.'
      ],
      practiceQuestions: [],
      revisionCard: '### CHARTS\n- **SWC**: Hazard summary\n- **W/T Chart**: Planning fuel'
    },
    {
      id: 'met-26',
      title: 'METAR and SPECI',
      explanation: 'Regular and special reports of current airport weather.',
      keyPoints: [
        'METAR: Hourly/Half-hourly observations.',
        'SPECI: Issued for rapid changes.',
        'Codes: DZ (Drizzle), RA (Rain), FG (Fog), BR (Mist).',
        'CAVOK: Ceiling and Vis OK (>10km, no cloud < 5000ft).'
      ],
      practiceQuestions: [],
      revisionCard: '### METAR\n- **Current** weather status\n- **SPECI**: Urgent change'
    },
    {
      id: 'met-27',
      title: 'TAF (Terminal Aerodrome Forecast)',
      explanation: 'Forecasted weather for a specific airport for 9-30 hours.',
      keyPoints: [
        'BECMG (Becoming): Gradual permanent change.',
        'TEMPO (Temporary): Fluctuations lasting < 1 hour.',
        'PROB: Probability of occurrence (30% or 40%).',
        'Used for alternate airport planning.'
      ],
      practiceQuestions: [],
      revisionCard: '### TAF\n- **Forecast** weather status\n- **Planning**: Reserve fuel'
    },
    {
      id: 'met-28',
      title: 'SIGMET and AIRMET',
      explanation: 'Significant and Airmen\'s warnings for severe weather.',
      keyPoints: [
        'SIGMET: Severe icing, turbulence, ash, cyclonic events.',
        'AIRMET: Moderate hazardous weather for low level flights.',
        'Valid for 4 hours (sometimes 6 for ash).',
        'Distributed via flight information centers.'
      ],
      practiceQuestions: [],
      revisionCard: '### WARNINGS\n- **SIGMET**: Critical safety info\n- **AIRMET**: General hazards'
    },
    {
      id: 'met-29',
      title: 'Climatology of India',
      explanation: 'Seasonal weather patterns in the Indian subcontinent.',
      keyPoints: [
        'South-West Monsoon (June-Sept).',
        'North-East Monsoon (Jan-Feb).',
        'Pre-monsoon heat and local storms (Nor\'westers).',
        'Western Disturbances in North India (Winter rain).'
      ],
      practiceQuestions: [],
      revisionCard: '### INDIA CLIMATE\n- **SW Monsoon**: Major rain\n- **Dust**: Pre-monsoon LU'
    }
  ]
};
