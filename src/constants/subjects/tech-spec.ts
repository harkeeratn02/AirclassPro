import { Subject } from '../../types/syllabus';

export const technicalSpecificSubject: Subject = {
  id: 'tech-spec',
  title: 'TECHNICAL SPECIFIC',
  description: 'Specific aircraft handling and performance. Mastering the operating manual, limitations, and check-lists for specific types.',
  topics: [
    {
      id: 'ts-1',
      title: 'General Description',
      explanation: 'Overview of a specific aircraft type (e.g., Cessna 172) including basic dimensions and weights.',
      keyPoints: [
        'Manufacturer and Model identifier.',
        'Length, Wingspan, and Height.',
        'Propeller type and diameter.',
        'Seating and baggage capacity.'
      ],
      practiceQuestions: [],
      revisionCard: '### GENERAL\n- **Type**: Specific airframe\n- **Weight**: Empty vs Gross'
    },
    {
      id: 'ts-2',
      title: 'Limitations',
      explanation: 'Operating boundaries for safety, including airspeeds, power, and loading.',
      keyPoints: [
        'V-speeds (Vne, Vno, Va).',
        'Maximum Engine RPM and Oil Temp.',
        'Load Factors (G-Limits).',
        'Fuel volume and usable vs unusable.'
      ],
      practiceQuestions: [
        {
          id: 'q-ts-2-1',
          q: 'What does the V-speed Vne represent?',
          options: ['Normal operating speed', 'Never exceed speed', 'Maneuvering speed', 'Rotation speed'],
          a: 'Never exceed speed',
          explanation: 'Vne is the speed that must never be exceeded in any flight regime to avoid structural damage.'
        }
      ],
      revisionCard: '### LIMITS\n- **Vne**: Never Exceed\n- **Va**: Maneuvering Speed'
    },
    {
      id: 'ts-3',
      title: 'Emergency Procedures',
      explanation: 'Standardized actions for critical failures like engine fires or stalls.',
      keyPoints: [
        'Airspeeds for emergency gliding (Vg).',
        'Engine failure during takeoff/flight.',
        'Electrical fire on ground/air.',
        'Unintentional spins recovery (PARE).'
      ],
      practiceQuestions: [
        {
          id: 'q-ts-3-1',
          q: 'In the PARE acronym for spin recovery, what does the E stand for?',
          options: ['Elevator', 'Engine', 'Emergency', 'Exit'],
          a: 'Elevator',
          explanation: 'PARE stands for Power Idle, Ailerons Neutral, Rudder Opposite, Elevator Forward.'
        }
      ],
      revisionCard: '### EMER\n- **Fire**: Mixture Off, Fuel Off\n- **Glide**: Best Glide speed'
    },
    {
      id: 'ts-4',
      title: 'Normal Procedures',
      explanation: 'Daily operations from pre-flight to engine shutdown.',
      keyPoints: [
        'Check-list usage (Read and Do).',
        'Engine starting and taxiing.',
        'Takeoff and Landing profiles.',
        'Cruising and leaning techniques.'
      ],
      practiceQuestions: [],
      revisionCard: '### NORMAL\n- **Scan**: Flows + Checklists\n- **Safety**: PIC responsibility'
    },
    {
      id: 'ts-5',
      title: 'Performance Charts',
      explanation: 'Using specific aircraft tables to predict takeoff distance and climb rates.',
      keyPoints: [
        'Takeoff over 50ft obstacle.',
        'Rate of climb vs Angle of climb.',
        'Cruise performance (fuel flow).',
        'Landing roll calculations.'
      ],
      practiceQuestions: [],
      revisionCard: '### PERFORMANCE\n- **Vy**: Best Rate (Time)\n- **Vx**: Best Angle (Dist)'
    },
    {
      id: 'ts-6',
      title: 'Weight and Balance',
      explanation: 'Ensuring the aircraft is within weight limits and its Center of Gravity is correct.',
      keyPoints: [
        'Datum line: The reference point for arm measurement.',
        'Moment = Weight * Arm.',
        'CG = Total Moment / Total Weight.',
        'Effect of CG (forward = stable, aft = unstable).'
      ],
      practiceQuestions: [
        {
          id: 'q-ts-6-1',
          q: 'How is the Moment calculated in Weight and Balance?',
          options: ['Weight + Arm', 'Weight / Arm', 'Weight * Arm', 'Arm / Weight'],
          a: 'Weight * Arm',
          explanation: 'Moment is the product of the weight of an item and its distance (arm) from the datum.'
        }
      ],
      revisionCard: '### W&B\n- **Datum**: Start point\n- **CG Limit**: Envelope'
    },
    {
      id: 'ts-7',
      title: 'Systems Description',
      explanation: 'Detailed look at the electrical, fuel, and control systems of a specific type.',
      keyPoints: [
        'Fuel tank location and selection.',
        'Electrical bus architecture.',
        'Heating and Ventilation controls.',
        'Landing gear extension mechanics.'
      ],
      practiceQuestions: [],
      revisionCard: '### SYSTEMS\n- **Details**: Know your aircraft\n- **Failure**: Backup paths'
    },
    {
      id: 'ts-8',
      title: 'Operating Speeds (V-Speeds)',
      explanation: 'The critical speeds for safe flight configurations.',
      keyPoints: [
        'Vso (stall stall flap); Vs1 (stall clean).',
        'Vr (rotation); Vfe (flap max).',
        'Vlo (gear operate); Vle (gear extended).',
        'Vno (normal op structural).'
      ],
      practiceQuestions: [],
      revisionCard: '### V-SPEEDS\n- **Vso**: Bottom white arc\n- **Vs1**: Bottom green arc'
    },
    {
      id: 'ts-9',
      title: 'Flight Planning',
      explanation: 'Combining performance, weather, and weight for a cross-country trip.',
      keyPoints: [
        'Fuel requirements (Trip + Res + Alt).',
        'Compass headings and Groundspeed.',
        'Time en-route calculations.',
        'Navigation log preparation.'
      ],
      practiceQuestions: [],
      revisionCard: '### PLANNING\n- **Fuel**: 45 min reserve typically\n- **Log**: Nav tracking'
    },
    {
      id: 'ts-10',
      title: 'Performance Class B',
      explanation: 'Standards for small single-engine aircraft used in training.',
      keyPoints: [
        'MTOW (Max Takeoff Weight) constraints.',
        'Required climb gradients for terrain clearance.',
        'Runway factored distance (1.25x or 1.43x).',
        'Safety margins for engine failure.'
      ],
      practiceQuestions: [],
      revisionCard: '### CLASS B\n- **Factor**: 1.25x for landing\n- **Type**: Training singles'
    },
    {
      id: 'ts-11',
      title: 'Performance Class A',
      explanation: 'Standards for complex, large multi-engine aircraft (Commercial airliners).',
      keyPoints: [
        'V1 (Decision); V2 (Takeoff Safety).',
        'ASDA (Accelerate Stop Distance Available).',
        'Net for Gross gradients.',
        'Balanced Field Length concept.'
      ],
      practiceQuestions: [],
      revisionCard: '### CLASS A\n- **V1**: GO or STOP\n- **V2**: Single engine climb'
    },
    {
      id: 'ts-12',
      title: 'Loading',
      explanation: 'Managing cargo and passengers to maintain structural integrity.',
      keyPoints: [
        'Floor loading limits (lb per sq ft).',
        'Tie-down and restraint requirements.',
        'Effect of zero-fuel weight (ZFW).',
        'Fuel loading sequence to avoid imbalance.'
      ],
      practiceQuestions: [],
      revisionCard: '### LOADING\n- **Limit**: Structure strength\n- **ZFW**: Wing root stress'
    },
    {
      id: 'ts-13',
      title: 'Center of Gravity (CG) Impact',
      explanation: 'How shifting weight affects elevator authority and longitudinal stability.',
      keyPoints: [
        'Forward CG: More stable, high stall speed, hard to flare.',
        'Aft CG: Less stable, low stall speed, easy to over-pitch.',
        'Out of Envelope: Unrecoverable stall or spin risk.',
        'Moving passengers in-flight affects trim.'
      ],
      practiceQuestions: [],
      revisionCard: '### CG EFFECT\n- **Forward**: Stable & Heavy\n- **Aft**: Unstable & Light'
    },
    {
      id: 'ts-14',
      title: 'Takeoff and Landing Performance',
      explanation: 'Variables affecting the distance needed for flight transitions.',
      keyPoints: [
        'High, Hot, and Humid = Longer distance.',
        'Upslope runway = Longer takeoff.',
        'Tailwind = Drastically longer landing/takeoff.',
        'Contaminated runway (water/ice) = Poor braking.'
      ],
      practiceQuestions: [],
      revisionCard: '### TRACK\n- **Density Alt**: Major factor\n- **Wind**: Headwind benefit'
    },
    {
      id: 'ts-15',
      title: 'En-route Performance',
      explanation: 'Optimizing speed and fuel over long distances.',
      keyPoints: [
        'Cruising altitude selection (wind vs power).',
        'Step climbs for heavier jets.',
        'Long Range Cruise (LRC) vs Max Range (MRC).',
        'Effect of IAS vs TAS at altitude.'
      ],
      practiceQuestions: [],
      revisionCard: '### EN-ROUTE\n- **MRC**: Best MPG\n- **LRC**: Extra speed margin'
    },
    {
      id: 'ts-16',
      title: 'Handling & Maintenance',
      explanation: 'Best practices for ground operations and technician interaction.',
      keyPoints: [
        'Towing and Tie-down procedures.',
        'Fueling safety (static grounding).',
        'Tire pressure and brake wear checks.',
        'Engine oil levels and air filter cleaning.'
      ],
      practiceQuestions: [],
      revisionCard: '### CARE\n- **Grounding**: Fire prevention\n- **Oil**: Check pre-flight'
    },
    {
      id: 'ts-17',
      title: 'Supplements',
      explanation: 'Modifications to the basic manual for items like floats or GPS units.',
      keyPoints: [
        'G1000 glass cockpit Operating Supplement.',
        'Autopilot operational limits.',
        'Cold weather kit instructions.',
        'Long range fuel tank operations.'
      ],
      practiceQuestions: [],
      revisionCard: '### ADDONS\n- **AFMS**: Manual Supplement\n- **Limits**: GPS vs Raw'
    },
    {
      id: 'ts-18',
      title: 'Checklist Mastery',
      explanation: 'The critical tool for human-error mitigation.',
      keyPoints: [
        'Challenge and Response method.',
        'Silent Checklists (scans).',
        'Abnormal vs Emergency checklists.',
        'Verification of critical items.'
      ],
      practiceQuestions: [],
      revisionCard: '### CHECKLIST\n- **Goal**: Zero memory errors\n- **Style**: Clear and Concise'
    }
  ]
};
