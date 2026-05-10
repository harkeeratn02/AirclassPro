import { Subject } from '../../types/syllabus';

export const rtrSubject: Subject = {
  id: 'radio-telephony',
  title: 'RADIO TELEPHONY',
  description: 'Communication procedures and phraseology. Mastering the art of clear, concise, and professional aviation radio calls.',
  topics: [
    {
      id: 'rt-1',
      title: 'General Principles',
      explanation: 'The foundation of aviation radio: Clarity, Brevity, and Discipline.',
      keyPoints: [
        'International Phonetic Alphabet (Alpha, Bravo...).',
        'Standard number pronunciation (Tree, Fife, Niner).',
        'Simplex vs Duplex communication.',
        'Frequency bands: VHF (118-137 MHz).'
      ],
      practiceQuestions: [
        {
          id: 'q-rt-1-1',
          q: "What is the phonetic version of the letter 'M'?",
          options: ['Matrix', 'Mike', 'Mother', 'Monday'],
          a: 'Mike',
          explanation: "In the ICAO phonetic alphabet, M is 'Mike'."
        }
      ],
      revisionCard: '### ABCs\n- **A,B,C**: Alpha, Bravo, Charlie\n- **123**: Wun, Too, Tree'
    },
    {
      id: 'rt-2',
      title: 'Standard Phraseology',
      explanation: 'Precise words to avoid confusion between pilots and ATC.',
      keyPoints: [
        'ROGER: I have received all your last transmission.',
        'WILCO: I understand and will comply.',
        'SAY AGAIN: Repeat your transmission.',
        'STANDBY: Wait, I will call you back.'
      ],
      practiceQuestions: [
        {
          id: 'q-rt-2-1',
          q: 'Which phrase means "I understand and will comply"?',
          options: ['Roger', 'Wilco', 'Affirm', 'Copy'],
          a: 'Wilco',
          explanation: 'WILCO is short for "Will Comply". ROGER only means message received.'
        }
      ],
      revisionCard: '### WORDS\n- **Roger**: Received only\n- **Wilco**: Received + Action'
    },
    {
      id: 'rt-3',
      title: 'VHF and HF Propagation',
      explanation: 'How radio waves travel and their range limits.',
      keyPoints: [
        'VHF: Line of sight, high quality, short range.',
        'HF: Skywave, skips off ionosphere, long range.',
        'Obstacles: Mountains block VHF signals.',
        'Atmospheric interference with HF.'
      ],
      practiceQuestions: [],
      revisionCard: '### RANGE\n- **VHF**: Earth curve limited\n- **HF**: Worldwide skip'
    },
    {
      id: 'rt-4',
      title: 'Call Signs',
      explanation: 'Establishing identity for aircraft and ground stations.',
      keyPoints: [
        'Aircraft: Registration (VTABC) or Flight Number (AirIndia 123).',
        'Ground: Suffixes (TOWER, GROUND, APPROACH).',
        'Abbreviation rules after contact established.',
        'Similar call sign awareness.'
      ],
      practiceQuestions: [],
      revisionCard: '### IDENT\n- **Full**: VT-ABC\n- **Short**: V-BC (if allowed)'
    },
    {
      id: 'rt-5',
      title: 'Readback Procedures',
      explanation: 'The mandatory repetition of certain ATC instructions for verification.',
      keyPoints: [
        'Must read back: Altitudes, Headings, Clearances.',
        'Must read back: Transponder codes, QNH.',
        'Readback ensures no "hear-back" errors.',
        'Acknowledge with full call sign.'
      ],
      practiceQuestions: [],
      revisionCard: '### READBACK\n- **Alt**: Must\n- **Heading**: Must\n- **Squawk**: Must'
    },
    {
      id: 'rt-6',
      title: 'Frequency Change',
      explanation: 'Coordinated handoff between controllers or airspaces.',
      keyPoints: [
        'ATC: "Contact Delhi Tower on 118.1".',
        'Pilot readback before switching.',
        'Initial contact on new frequency (Who, Where, What).',
        'Return to previous if contact fails.'
      ],
      practiceQuestions: [],
      revisionCard: '### SWITCH\n- **Readback** then switch\n- **Resume** on old if silent'
    },
    {
      id: 'rt-7',
      title: 'Radio Test Procedures',
      explanation: 'Checking equipment clarity and readability.',
      keyPoints: [
        'Scale 1 to 5 (Readability).',
        '1: Unreadable; 3: Readable with difficulty.',
        '5: Perfectly readable.',
        'Should be brief and off-peak.'
      ],
      practiceQuestions: [],
      revisionCard: '### TEST\n- **Scale**: 1 (Poor) to 5 (Loud/Clear)'
    },
    {
      id: 'rt-8',
      title: 'Met Reports (ATIS/VOLMET)',
      explanation: 'Receiving weather information via continuous broadcasts.',
      keyPoints: [
        'ATIS: Aerodrome information (Wind, QNH, Active RWY).',
        'Information code (Alpha, Bravo...) changes every hour.',
        'VOLMET: En-route weather for multiple airports.',
        'Listening only (no transmission required).'
      ],
      practiceQuestions: [],
      revisionCard: '### WEATHER\n- **ATIS**: Airport specific\n- **VOLMET**: Route info'
    },
    {
      id: 'rt-9',
      title: 'Aerodrome Traffic Procedures',
      explanation: 'Calls during taxi, takeoff, and the traffic pattern.',
      keyPoints: [
        'Ready for departure.',
        'Downwind, Base, Final reports.',
        'Runway vacated.',
        'Line up and Wait vs Cleared for Takeoff.'
      ],
      practiceQuestions: [],
      revisionCard: '### CIRCUIT\n- **Reports**: Critical for separation'
    },
    {
      id: 'rt-10',
      title: 'VFR Navigation Comms',
      explanation: 'Reporting position and intentions in uncontrolled areas.',
      keyPoints: [
        'Position reports: Location, Time, Altitude, Next point.',
        'Flight Information Service interaction.',
        'Blind transmissions (to "All Stations").',
        'Estimates for waypoints.'
      ],
      practiceQuestions: [],
      revisionCard: '### VFR\n- **Blind**: No reply expected\n- **Pos**: Where are you?'
    },
    {
      id: 'rt-11',
      title: 'IFR Procedures',
      explanation: 'Rigid communication for instrument flight rules.',
      keyPoints: [
        'Clearance Delivery (SID, Transponder).',
        'Approach clearances for ILS/VOR.',
        'Holding instructions.',
        'Missed approach reports.'
      ],
      practiceQuestions: [],
      revisionCard: '### IFR\n- **Clearance**: CRAFT protocol\n- **Missed**: Mandatory report'
    },
    {
      id: 'rt-12',
      title: 'Distress (MAYDAY)',
      explanation: 'The highest priority call for life-threatening emergencies.',
      keyPoints: [
        'MAYDAY x3 repeats.',
        'Status: Who, Where, Nature, Souls, Intentions.',
        'Frequency: Current or 121.5 MHz.',
        'Silence during distress (all other traffic stops).'
      ],
      practiceQuestions: [
        {
          id: 'q-rt-12-1',
          q: 'How many times should "MAYDAY" be spoken in a distress call?',
          options: ['Once', 'Twice', 'Three times', 'Four times'],
          a: 'Three times',
          explanation: 'Standard procedure is to repeat "MAYDAY" three times to ensure it is clearly identified as a distress call.'
        }
      ],
      revisionCard: '### DISTRESS\n- **MAYDAY**: 3 times\n- **121.5**: Guard frequency'
    },
    {
      id: 'rt-13',
      title: 'Urgency (PAN-PAN)',
      explanation: 'High priority call for serious technical issues not yet life-threatening.',
      keyPoints: [
        'PAN-PAN x3 repeats.',
        'Priority over all except Distress.',
        'Requesting priority for landing.',
        'Can be downgraded or cancelled if resolved.'
      ],
      practiceQuestions: [],
      revisionCard: '### URGENT\n- **PAN-PAN**: Help me now'
    },
    {
      id: 'rt-14',
      title: 'Communication Failure',
      explanation: 'Procedures when the radio stops working (Transmitter or Receiver).',
      keyPoints: [
        'Check frequency, volume, and connections.',
        'Squawk 7600 (Loss of Comms).',
        'Transmit "blind" twice: "Transmitting Blind".',
        'Watch for light signals from Tower.'
      ],
      practiceQuestions: [],
      revisionCard: '### COMMS LOSS\n- **Squawk**: 7600\n- **Blind**: Speak anyway'
    },
    {
      id: 'rt-15',
      title: 'Selective Calling (SELCAL)',
      explanation: 'Using distinct tones to alert a specific aircraft without continuous monitoring.',
      keyPoints: [
        '4-letter code assigned to aircraft.',
        'Ground station sends the tones.',
        'Notification in the cockpit (Chime/Light).',
        'Used extensively for long-haul HF flights.'
      ],
      practiceQuestions: [],
      revisionCard: '### SELCAL\n- **Benefit**: Reduces pilot fatigue\n- **Type**: 4-Tone unique'
    },
    {
      id: 'rt-16',
      title: 'Radio Failure Light Signals',
      explanation: 'Visual instructions from the tower to non-radio aircraft.',
      keyPoints: [
        'Steady Green: Cleared to land (air) / Takeoff (ground).',
        'Flashing Green: Return for landing / Cleared for taxi.',
        'Steady Red: Give way / STOP.',
        'Flashing Red: Airport unsafe / Taxi clear of runway.'
      ],
      practiceQuestions: [],
      revisionCard: '### LIGHTS\n- **Steady Green**: GO\n- **Steady Red**: STOP'
    }
  ]
};
