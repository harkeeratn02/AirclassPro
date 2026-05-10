import { Subject } from '../../types/syllabus';

export const technicalGeneralSubject: Subject = {
  id: 'tech-gen',
  title: 'TECHNICAL GENERAL',
  description: 'Aircraft structures, systems, and theoretical aerodynamics. Exploring the hardware and physics behind every flight.',
  topics: [
    {
      id: 'tg-1',
      title: 'Airframe (Fuselage)',
      explanation: 'The main body of the aircraft that carries the crew, passengers, and cargo.',
      keyPoints: [
        'Monocoque: Skin carries the load.',
        'Semi-monocoque: Shell + frames/stringers carry the load.',
        'Truss: Framework of tubes.',
        'Stress types: Tension, Compression, Torque, Torsion, Shearing.'
      ],
      practiceQuestions: [
        {
          id: 'q-tg-1-1',
          q: 'Which type of airframe structure relies on the skin to carry all or most of the load?',
          options: ['Truss', 'Monocoque', 'Semi-monocoque', 'Geodesic'],
          a: 'Monocoque',
          explanation: 'In a monocoque structure, the outer skin carries the primary structural loads. Semi-monocoque uses internal frames and stringers to support the skin.'
        },
        {
          id: 'q-tg-1-2',
          q: 'Which stress is a combination of tension and compression?',
          options: ['Torsion', 'Bending', 'Shear', 'Torque'],
          a: 'Bending',
          explanation: 'Bending involves stretching (tension) on one side and squeezing (compression) on the other.'
        }
      ],
      revisionCard: '### FUSELAGE\n- **Semi-monocoque**: Modern standard\n- **Bulkheads**: Shape & reinforcement'
    },
    {
      id: 'tg-2',
      title: 'Wings (Airfoils)',
      explanation: 'Primary lifting surface of the aircraft. Built around main beams called spars.',
      keyPoints: [
        'Spars: Primary longitudinal beams.',
        'Ribs: Give the wing its aerodynamic shape.',
        'Stressed Skin: Contributes to structural strength.',
        'Winglets: Reduce induced drag by stopping vortices.'
      ],
      practiceQuestions: [
        {
          id: 'q-tg-2-1',
          q: 'What is the primary longitudinal structural member of a wing?',
          options: ['Rib', 'Spar', 'Stringer', 'Skin'],
          a: 'Spar',
          explanation: 'Spars are the main internal beams that run along the length of the wing and carry the lift loads.'
        }
      ],
      revisionCard: '### WINGS\n- **Spar**: Spine of the wing\n- **Cantilever**: No external bracing'
    },
    {
      id: 'tg-3',
      title: 'Empennage (Tail Unit)',
      explanation: 'Provides stability and control about the yaw and pitch axes.',
      keyPoints: [
        'Vertical Stabilizer + Rudder (Directional).',
        'Horizontal Stabilizer + Elevator (Longitudinal).',
        'Stabilator: One piece horizontal unit.',
        'V-Tail: Combined pitch and yaw surfaces.'
      ],
      practiceQuestions: [],
      revisionCard: '### TAIL\n- **Rudder**: Yaw control\n- **Elevator**: Pitch control'
    },
    {
      id: 'tg-4',
      title: 'Landing Gear (Undercarriage)',
      explanation: 'Supports the aircraft on the ground and absorbs landing shocks.',
      keyPoints: [
        'Tricycle (Nose wheel) vs Conventional (Tail wheel).',
        'Shock Struts (Oleo): Air and Oil absorption.',
        'Shimmy Damper: Prevents nose wheel vibration.',
        'Retraction systems: Hydraulic or Electric.'
      ],
      practiceQuestions: [],
      revisionCard: '### GEAR\n- **Tricycle**: Better visibility\n- **Oleo**: Absorbs vertical load'
    },
    {
      id: 'tg-5',
      title: 'Flight Controls',
      explanation: 'Mechanical, hydraulic, or fly-by-wire systems to move control surfaces.',
      keyPoints: [
        'Ailerons: Roll (Longitudinal axis).',
        'Elevator: Pitch (Lateral axis).',
        'Rudder: Yaw (Vertical axis).',
        'Cables, Pulleys, and Pushrods: Transmission methods.'
      ],
      practiceQuestions: [],
      revisionCard: '### CONTROLS\n- **Ailerons**: Wing tips\n- **Elevator**: Tail rear\n- **Rudder**: Tail vertical'
    },
    {
      id: 'tg-6',
      title: 'Hydraulic Systems',
      explanation: 'Using incompressible fluid to transmit high force with low weight.',
      keyPoints: [
        'Pascal\'s Law: Pressure is transmitted equally in all directions.',
        'Components: Reservoir, Pump, Accumulator, Actuator.',
        'Fluid types: Skydrol (purple) vs Mineral (red).',
        'High pressure (typically 3000 PSI in airliners).'
      ],
      practiceQuestions: [],
      revisionCard: '### HYDRAULICS\n- **Accumulator**: Stores energy\n- **Skydrol**: Fire resistant but toxic'
    },
    {
      id: 'tg-7',
      title: 'Pneumatic Systems',
      explanation: 'Using compressed air for landing gear, brakes, or de-icing.',
      keyPoints: [
        'Bleed air from jet engines.',
        'High pressure storage bottles (in smaller aircraft).',
        'Vacuum systems for gyro instrument rotation.',
        'Air cycle machines for cabin temperature.'
      ],
      practiceQuestions: [],
      revisionCard: '### PNEUMATICS\n- **Bleed Air**: Engine source\n- **Vacuum**: Turns gyros'
    },
    {
      id: 'tg-8',
      title: 'Air Conditioning and Pressurization',
      explanation: 'Maintaining a breathable and comfortable environment at high altitudes.',
      keyPoints: [
        'Differential Pressure: Cabin vs Outside air.',
        'Outflow Valve: Controls how much air leaves the cabin.',
        'Cabin Altitude: Equivalent pressure height inside.',
        'Safety Valve: Prevents over-pressurization.'
      ],
      practiceQuestions: [],
      revisionCard: '### CABIN\n- **Max Diff**: Limit on fuselage strength\n- **O2**: Required > 10,000ft typically'
    },
    {
      id: 'tg-9',
      title: 'Ice and Rain Protection',
      explanation: 'Systems to prevent or remove ice and ensure clear vision through the windshield.',
      keyPoints: [
        'De-icing Boots: Inflatable rubber on lead edges.',
        'Anti-ice: Thermal (bleed air) or Chemical (TKS).',
        'Pitot Heat: Electrically heating air sensors.',
        'Windshield Wipers or Rain Repellent (hydrophobic).'
      ],
      practiceQuestions: [],
      revisionCard: '### ICE OPS\n- **Anti-ice**: ON before icing\n- **De-ice**: ON after buildup'
    },
    {
      id: 'tg-10',
      title: 'Fuel Systems',
      explanation: 'Storage, management, and supply of fuel to the engines.',
      keyPoints: [
        'Gravity Feed vs Pump Feed.',
        'Sumps and Drains: Removing water/sediment.',
        'Fuel Vents: Preventing vacuum in tanks.',
        'Cross-feed: Balancing fuel between wings.'
      ],
      practiceQuestions: [],
      revisionCard: '### FUEL\n- **AVGAS**: Blue (100LL)\n- **JET A1**: Straw color'
    },
    {
      id: 'tg-11',
      title: 'Electrical Systems',
      explanation: 'Generation and distribution of power for avionics, lights, and systems.',
      keyPoints: [
        'Alternator/Generator: Primary source (engine driven).',
        'Battery: Backup source and starting power.',
        'Bus Bar: Distribution point for several circuits.',
        'Circuit Breakers: Protect system from overload.'
      ],
      practiceQuestions: [],
      revisionCard: '### ELECTRICS\n- **Volts**: Pressure\n- **Amps**: Flow'
    },
    {
      id: 'tg-12',
      title: 'Piston Engines (Part 1 - Cycles)',
      explanation: 'Internal combustion engines using the 4-stroke cycle.',
      keyPoints: [
        'Intake, Compression, Power, Exhaust.',
        'Dual Ignition: Safety and Efficiency.',
        'Magnetos: Self-contained electrical power for spark plugs.',
        'Air-cooling vs Liquid-cooling.'
      ],
      practiceQuestions: [
        {
          id: 'q-tg-12-1',
          q: 'In a four-stroke internal combustion engine, which stroke follows the power stroke?',
          options: ['Intake', 'Compression', 'Exhaust', 'Ignition'],
          a: 'Exhaust',
          explanation: 'The cycle is: Intake, Compression, Power, Exhaust (Suck, Squeeze, Bang, Blow).'
        }
      ],
      revisionCard: '### OTTO CYCLE\n- **Induction**: Suck\n- **Compression**: Squeeze\n- **Power**: Bang\n- **Exhaust**: Blow'
    },
    {
      id: 'tg-13',
      title: 'Piston Engines (Part 2 - Carburetion/Fuel)',
      explanation: 'Mixing fuel and air for combustion and handling engine cooling.',
      keyPoints: [
        'Carburetor: Mixes fuel/air at the venturi.',
        'Carb Ice: Cooling due to fuel evaporation and pressure drop.',
        'Fuel Injection: Direct spray into cylinders (no carb ice).',
        'Mixture Control: Leaning for altitude fuel efficiency.'
      ],
      practiceQuestions: [],
      revisionCard: '### ENGINE OPS\n- **Carb Heat**: Pre-heats intake\n- **Leaning**: Pull for high alt'
    },
    {
      id: 'tg-14',
      title: 'Gas Turbine Engines (Jet)',
      explanation: 'High-thrust engines using continuous compression and combustion.',
      keyPoints: [
        'Turbojet vs Turbofan vs Turboprop.',
        'Compression Ratio: Pressure increase in the core.',
        'Bypass Ratio: Fan air vs Core air (modern turbofans).',
        'Reverse Thrust: Redirecting exhaust for braking.'
      ],
      practiceQuestions: [],
      revisionCard: '### JETS\n- **Core**: Air heater\n- **Fan**: Thrust producer'
    },
    {
      id: 'tg-15',
      title: 'Propellers',
      explanation: 'Rotating airfoils that convert engine power into thrust.',
      keyPoints: [
        'Fixed Pitch vs Constant Speed (Variable).',
        'Governor: Adjusts blade angle to hold RPM.',
        'Feathering: Blades edge-to-wind for engine failure.',
        'Pitch: Distance propeller moves forward in one rev.'
      ],
      practiceQuestions: [],
      revisionCard: '### PROP\n- **Fine Pitch**: High RPM (Takeoff)\n- **Coarse Pitch**: High speed (Cruise)'
    },
    {
      id: 'tg-16',
      title: 'Instruments - Pitot Static',
      explanation: 'Airspeed Indicator, Altimeter, and Vertical Speed Indicator (VSI).',
      keyPoints: [
        'Pitot Tube: Impact (Dynamic) pressure source.',
        'Static Port: Ambient (Static) pressure source.',
        'ASI = Total Pressure - Static Pressure.',
        'Blockage Errors: ASI zero, Altimeter froze, VSI zero.'
      ],
      practiceQuestions: [],
      revisionCard: '### PITOT\n- **ASI**: Total - Static\n- **Alt**: Measures Static'
    },
    {
      id: 'tg-17',
      title: 'Instruments - Gyroscopic',
      explanation: 'Attitude Indicator, Turn Coordinator, and Heading Indicator.',
      keyPoints: [
        'Rigidity in Space: Tendency to hold axis position.',
        'Precession: Deflection 90° later in direction of rotation.',
        'Vacuum or Electric driven for redundancy.',
        'Gimbal systems for multi-axis monitoring.'
      ],
      practiceQuestions: [],
      revisionCard: '### GYROS\n- **Precession**: Error cause\n- **Spin**: High RPM needed'
    },
    {
      id: 'tg-18',
      title: 'Instruments - Compass',
      explanation: 'Traditional and electronic methods of direction sensing.',
      keyPoints: [
        'Magnetic Compass: Wet compass with fluid damping.',
        'Errors: Acceleration, Turning, Dip.',
        'Flux Gate: Electronic sensing without moving needle.',
        'Compass Swing: Calibration process.'
      ],
      practiceQuestions: [],
      revisionCard: '### COMPASS\n- **ANDS**: Accel North, Decel South\n- **UNOS**: Undershoot North, Overshoot South'
    },
    {
      id: 'tg-19',
      title: 'Automation (Autopilot/FMS)',
      explanation: 'Modern systems that assist pilot in navigation and aircraft control.',
      keyPoints: [
        'Servos: Move the control surfaces.',
        'Flight Management System (FMS): The brain of the aircraft.',
        'LNAV/VNAV: Horizontal and Vertical path following.',
        'Glass Cockpit: PFD/MFD electronic displays.'
      ],
      practiceQuestions: [],
      revisionCard: '### AUTO\n- **MCP**: Mode Control Panel\n- **FMC**: Flight Management Comp'
    },
    {
      id: 'tg-20',
      title: 'Warnings and Fire Protection',
      explanation: 'Sensing and extinguishing fires/smoke in the airframe or engines.',
      keyPoints: [
        'Loop Systems: Continuous wire sensors.',
        'Halon: Common extinguishing agent.',
        'Master Warning vs Caution lights.',
        'Cargo compartment fire suppression.'
      ],
      practiceQuestions: [],
      revisionCard: '### FIRE\n- **Engine**: Bottle discharge\n- **Cabin**: Portable Halon'
    }
  ]
};
