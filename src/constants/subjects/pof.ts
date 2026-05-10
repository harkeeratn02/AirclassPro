import { Subject } from '../../types/syllabus';

export const pofSubject: Subject = {
  id: 'pof',
  title: 'PRINCIPLES OF FLIGHT',
  description: 'The physics of flight. Aerodynamics, lift generation, and aircraft stability across various flight regimes.',
  topics: [
    {
      id: 'pof-1',
      title: 'Subsonic Aerodynamics',
      explanation: 'How air flows over an airfoil at speeds well below the speed of sound.',
      keyPoints: [
        'Bernoulli\'s Principle: High velocity = Low pressure.',
        'Newton\'s Third Law: Action/Reaction (Downwash).',
        'Angle of Attack (AOA): Angle between chord and relative wind.',
        'Center of Pressure (CP): Point where total lift acts.'
      ],
      practiceQuestions: [
        {
          id: 'q-pof-1-1',
          q: "What is Bernoulli's Principle in relation to an airfoil?",
          options: ['Pressure increases as velocity increases', 'Pressure decreases as velocity increases', 'Velocity is constant', 'Lift is only from impact air'],
          a: 'Pressure decreases as velocity increases',
          explanation: "Bernoulli's Principle states that as the velocity of a moving fluid (like air) increases, the pressure within the fluid decreases. This creates lower pressure on top of the wing."
        }
      ],
      revisionCard: '### SUBSONIC\n- **Lift**: Pressure diff + Reaction\n- **AOA**: Main lift driver'
    },
    {
      id: 'pof-2',
      title: 'Forces in Flight',
      explanation: 'The balance between Lift, Weight, Thrust, and Drag.',
      keyPoints: [
        'Lift = Weight + Tail Down Force (usually).',
        'Thrust = Drag in steady cruise.',
        'Induced Drag: Byproduct of lift (vortices).',
        'Parasite Drag: Friction, Form, and Interference drag.'
      ],
      practiceQuestions: [
        {
          id: 'q-pof-2-1',
          q: 'Which force acts vertically upwards and opposes weight?',
          options: ['Thrust', 'Drag', 'Lift', 'Centrifugal'],
          a: 'Lift',
          explanation: 'In steady level flight, Lift acts vertically upwards to oppose the force of Weight acting downwards.'
        }
      ],
      revisionCard: '### FORCES\n- **Equilibrium**: Steady flight\n- **Total Drag**: Induced + Parasite'
    },
    {
      id: 'pof-3',
      title: 'Aircraft Stability',
      explanation: 'The tendency of an aircraft to return to its original state after a disturbance.',
      keyPoints: [
        'Static Stability: Initial tendency.',
        'Dynamic Stability: Tendency over time (oscillations).',
        'Longitudinal Stability: Stability around the lateral axis (pitch).',
        'Dihedral: V-shape wings for lateral stability (roll).'
      ],
      practiceQuestions: [
        {
          id: 'q-pof-3-1',
          q: 'What is the tendency of an aircraft to return to its original position after being disturbed?',
          options: ['Stability', 'Maneuverability', 'Controllability', 'Performance'],
          a: 'Stability',
          explanation: 'Stability is the inherent quality of an aircraft to correct for disturbances and return to its original flight path.'
        }
      ],
      revisionCard: '### STABILITY\n- **Static**: Positive, Neutral, Negative\n- **Dihedral**: Roll stability'
    },
    {
      id: 'pof-4',
      title: 'Stalls and Spins',
      explanation: 'The critical limit where flow separates and lift is lost.',
      keyPoints: [
        'Critical AOA: Angle where stall occurs (~15-18°).',
        'Factors: Weight, CG, Flaps, Contamination.',
        'Spin: Aggravated stall with rotation (Auto-rotation).',
        'Recovery: AOA reduction is mandatory.'
      ],
      practiceQuestions: [
        {
          id: 'q-pof-4-1',
          q: 'A stall occurs when the wing exceeds its...',
          options: ['Maximum speed', 'Maximum altitude', 'Critical Angle of Attack', 'Maximum weight'],
          a: 'Critical Angle of Attack',
          explanation: 'A stall is caused by the separation of airflow from the wing surface, which occurs when the Critical Angle of Attack is exceeded.'
        }
      ],
      revisionCard: '### STALL\n- **Cause**: Exceeding critical AOA\n- **Spin**: Stall + Yaw imbalance'
    },
    {
      id: 'pof-5',
      title: 'Lift Augmentation (Flaps/Slats)',
      explanation: 'Increasing wing camber and area to allow slower flight for landing and takeoff.',
      keyPoints: [
        'Flaps: Increse lift and drag (allow steeper descent).',
        'Slats/Slots: Delay stall by re-energizing the boundary layer.',
        'Camber: The curvature of the airfoil.',
        'Spoilers: Dump lift and increase drag in flight or on ground.'
      ],
      practiceQuestions: [],
      revisionCard: '### FLAPS\n- **Goal**: High lift at low speed\n- **Drag**: Penalty paid for lift'
    },
    {
      id: 'pof-6',
      title: 'Maneuvering and Load Factor',
      explanation: 'The forces experienced during turns, climbs, and pull-outs.',
      keyPoints: [
        'Load Factor (G): Lift / Weight.',
        'Bank Angle: Increases G and stall speed.',
        'Coordinated Turn: Balancing horizontal lift and centrifugal force.',
        'Structural Limits: Yield point and Ultimate load.'
      ],
      practiceQuestions: [],
      revisionCard: '### TURNS\n- **60° Bank**: 2G load factor\n- **Stall**: Increases as √G'
    }
  ]
};
