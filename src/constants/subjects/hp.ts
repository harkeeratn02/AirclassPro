import { Subject } from '../../types/syllabus';

export const humanPerformanceSubject: Subject = {
  id: 'human-performance',
  title: 'HUMAN PERFORMANCE',
  description: 'Aviation physiology and psychology. Understanding the biological and mental limits of the human pilot in the flight environment.',
  topics: [
    {
      id: 'hp-1',
      title: 'Aviation Physiology (Altitude)',
      explanation: 'How reduced pressure and oxygen affect the human body.',
      keyPoints: [
        'Hypoxia: Lack of oxygen reaching the brain/tissues.',
        'TUC (Time of Useful Consciousness): Seconds to minutes at high alt.',
        'Dysbarism: Trapped gases (Bends, Chokes) in joints.',
        'Hyperventilation: Excessive breathing lowers CO2.'
      ],
      practiceQuestions: [
        {
          id: 'q-hp-1-1',
          q: 'Which gas is responsible for the regulation of the breathing rate in humans?',
          options: ['Oxygen', 'Nitrogen', 'Carbon Dioxide', 'Carbon Monoxide'],
          a: 'Carbon Dioxide',
          explanation: 'The body regulates breathing primarily based on the levels of carbon dioxide (CO2) in the blood, not oxygen.'
        }
      ],
      revisionCard: '### ALTITUDE\n- **Hypoxia**: Euphoria + Blue lips\n- **TUC**: 30s at 35,000 ft'
    },
    {
      id: 'hp-2',
      title: 'Health and Hygiene',
      explanation: 'Maintaining physical fitness for flight duties.',
      keyPoints: [
        'Fatigue: Acute vs Chronic.',
        'Diet and Dehydration.',
        'Medication: Self-medication is hazardous.',
        'Circadian Rhythm: The 24-hour body clock and Jet Lag.'
      ],
      practiceQuestions: [
        {
          id: 'q-hp-2-1',
          q: 'What is the "Time of Useful Consciousness" (TUC) at 30,000 feet?',
          options: ['1-2 minutes', '10-20 minutes', '30-60 seconds', '5 minutes'],
          a: '1-2 minutes',
          explanation: 'At 30,000 feet, the TUC (the time a pilot has to take life-saving action before losing consciousness) is approximately 1 to 2 minutes.'
        }
      ],
      revisionCard: '### HEALTH\n- **Fatigue**: Error multiplier\n- **Water**: Essential for clarity'
    },
    {
      id: 'hp-3',
      title: 'Vision and Hearing',
      explanation: 'The primary senses for flight and their limitations.',
      keyPoints: [
        'Empty Field Myopia: Eyes focusing close-in when nothing to see.',
        'Night Vision: Rods (low light) vs Cones (color/detail).',
        'Noise Induced Hearing Loss.',
        'Spatial Disorientation: Mismatch between eyes and inner ear.'
      ],
      practiceQuestions: [
        {
          id: 'q-hp-3-1',
          q: 'To maintain night vision, it is best to avoid looking directly at...',
          options: ['Red lights', 'Dim lights', 'Bright white lights', 'Blue lights'],
          a: 'Bright white lights',
          explanation: 'Bright white light destroys rhodopsin (visual purple) in the rods, which are essential for night vision.'
        }
      ],
      revisionCard: '### SENSES\n- **Night**: Scan 5-10° off-center\n- **Illusions**: Trust instruments'
    },
    {
      id: 'hp-4',
      title: 'Basic Psychology',
      explanation: 'Information processing, memory, and decision making.',
      keyPoints: [
        'Short-term vs Long-term memory.',
        'Attention: Selective, divided, and focused.',
        'Stress: Optimal levels vs Overload.',
        'Risk Management: Identifying hazards.'
      ],
      practiceQuestions: [],
      revisionCard: '### PSYCH\n- **Memory**: 7 +/- 2 items limit\n- **Stress**: Inverted U curve'
    },
    {
      id: 'hp-5',
      title: 'CRM (Crew Resource Management)',
      explanation: 'Effective use of all available resources to ensure safety.',
      keyPoints: [
        'Leadership and Followership.',
        'Communication: Direct and assertiveness.',
        'Teamwork and synergy.',
        'Conflict resolution in the cockpit.'
      ],
      practiceQuestions: [],
      revisionCard: '### CRM\n- **Goal**: Safety over Ego\n- **Debrief**: Learning from mistakes'
    }
  ]
};
