import { Subject } from '../../types/syllabus';

export const regulationSubject: Subject = {
  id: 'aviation-leg',
  title: 'AIR REGULATION',
  description: 'International law, licensing, and rules of the air. Understanding the legal framework governing DGCA and ICAO operations.',
  topics: [
    {
      id: 'reg-1',
      title: 'ICAO (Convention on International Civil Aviation)',
      explanation: 'Established in 1944 (Chicago Convention) to ensure safe, orderly development of global aviation.',
      keyPoints: [
        'Headquarters in Montreal, Canada.',
        'UN specialized agency.',
        'Council, Assembly, and Secretariat.',
        'Sets global standards for all member states.'
      ],
      practiceQuestions: [],
      revisionCard: '### ICAO\n- **Convention**: Chicago 1944\n- **Role**: Global Standardizer'
    },
    {
      id: 'reg-2',
      title: 'The 19 ICAO Annexes',
      explanation: 'Technical documents containing SARPs (Standards and Recommended Practices) for states to follow.',
      keyPoints: [
        'Annex 1: Personnel Licensing.',
        'Annex 2: Rules of the Air.',
        'Annex 6: Aircraft Operations.',
        'Annex 17: Aviation Security.'
      ],
      practiceQuestions: [],
      revisionCard: '### ANNEXES\n- **1**: Licensing\n- **2**: Rules\n- **14**: Aerodromes'
    },
    {
      id: 'reg-3',
      title: 'Nationality and Registration',
      explanation: 'Every aircraft must belong to a country and carry a unique identity mark.',
      keyPoints: [
        'Common Mark: State identifying letters (e.g., VT for India).',
        'Registration Mark: Unique aircraft suffix (e.g., VT-ABC).',
        'Certificate of Registration (C of R).',
        'Aircraft cannot be registered in more than one state.'
      ],
      practiceQuestions: [],
      revisionCard: '### REGISTRATION\n- **India Prefix**: VT\n- **Doc**: C of R on board'
    },
    {
      id: 'reg-4',
      title: 'Certificate of Airworthiness (C of A)',
      explanation: 'Proof that an aircraft is fit for flight and maintained according to standards.',
      keyPoints: [
        'Issued by the state of registry.',
        'Validated/Renewed regularly based on inspections.',
        'Flight Manual must be carried with the C of A.',
        'Suspended if aircraft is damaged or not maintained.'
      ],
      practiceQuestions: [],
      revisionCard: '### AIRWORTHINESS\n- **Standard**: Fit for flight\n- **Link**: Maintenance records'
    },
    {
      id: 'reg-5',
      title: 'Personnel Licensing (Rule 1937)',
      explanation: 'The legal framework for issuing pilot, engineer, and dispatcher licenses for India.',
      keyPoints: [
        'Requirements for PPL, CPL, ATPL.',
        'Medical requirements (Class 1 vs Class 2).',
        'Language Proficiency (ELP) standards.',
        'Recency requirements (6 months and 90 days).'
      ],
      practiceQuestions: [],
      revisionCard: '### LICENSING\n- **Rule**: Aircraft Rules 1937\n- **Body**: DGCA India'
    },
    {
      id: 'reg-6',
      title: 'Rules of the Air (Annex 2)',
      explanation: 'Traffic regulations for the sky to avoid collisions and ensure orderly flow.',
      keyPoints: [
        'Right of Way: Aircraft on the right has priority.',
        'Overtaking: Pass to the right of the other aircraft.',
        'Formation flight requires prior agreement.',
        'Acrobatics prohibited over congested areas.'
      ],
      practiceQuestions: [
        {
          id: 'q-reg-6-1',
          q: 'When two aircraft are approaching head-on, or approximately so, each shall...',
          options: ['Turn to the left', 'Turn to the right', 'Climb 500ft', 'Descend 500ft'],
          a: 'Turn to the right',
          explanation: 'According to Annex 2 (Rules of the Air), when two aircraft are approaching head-on, each shall alter its heading to the right to avoid a collision.'
        }
      ],
      revisionCard: '### RULES\n- **Collision**: See and Avoid\n- **Pattern**: Standard Left Hand'
    },
    {
      id: 'reg-7',
      title: 'Airspace Classification',
      explanation: 'Alphabetical classes (A-G) defining services provided to IFR and VFR flights.',
      keyPoints: [
        'Class A: Only IFR, ATC separation.',
        'Class D: Control zone, IFR/VFR separation for IFR only.',
        'Class G: Uncontrolled, Information service only.',
        'Indian airspace typically A, B, C, D, E, F, G.'
      ],
      practiceQuestions: [],
      revisionCard: '### AIRSPACE\n- **Class A**: High level (IFR only)\n- **Class G**: Freedom of flight'
    },
    {
      id: 'reg-8',
      title: 'Air Traffic Services (ATS)',
      explanation: 'The division of control and information services provided to pilots.',
      keyPoints: [
        'ATC: Area (ACC), Approach (APP), Tower (TWR).',
        'Flight Information Service (FIS).',
        'Alerting Service (Search and Rescue trigger).',
        'Clearance: Authorization to proceed under specified conditions.'
      ],
      practiceQuestions: [],
      revisionCard: '### ATS\n- **Control**: Mandatory following\n- **Advisory**: Optional guidance'
    },
    {
      id: 'reg-9',
      title: 'Search and Rescue (SAR)',
      explanation: 'Procedures to locate and assist aircraft in distress or after an accident.',
      keyPoints: [
        'ELT (Emergency Locator Transmitter) requirements.',
        'RCC (Rescue Coordination Center).',
        'UNCERFA, ALERFA, DETRESFA phases.',
        'Visual signals for ground-to-air communication.'
      ],
      practiceQuestions: [],
      revisionCard: '### SAR\n- **U/A/D**: Phases of urgency\n- **ELT**: 121.5 / 406 MHz'
    },
    {
      id: 'reg-10',
      title: 'Accident and Incident Investigation',
      explanation: 'The process of determining "What happened" to prevent future occurrences (not to blame).',
      keyPoints: [
        'Annex 13 standards.',
        'Definitions of Accident vs Serious Incident.',
        'Notification mandatory to AAIB (India).',
        'Preservation of FDR/CVR data.'
      ],
      practiceQuestions: [],
      revisionCard: '### ACCIDENT\n- **Goal**: Safety Improvement\n- **Agency**: AAIB India'
    },
    {
      id: 'reg-11',
      title: 'Aerodromes (Annex 14)',
      explanation: 'Design and operation standards for runways, taxiways, and airport lighting.',
      keyPoints: [
        'Runway markings: Threshold, Aiming point, Touchdown zone.',
        'Runway Lights: White (middle), Green (start), Red (end).',
        'PAPI/VASI: Visual slope indicators.',
        'Obstacle Limitation Surfaces (OLS).'
      ],
      practiceQuestions: [],
      revisionCard: '### AERODROME\n- **PAPI**: 2R/2W = On slope\n- **Lights**: Threshold is Green'
    },
    {
      id: 'reg-12',
      title: 'Facilitation (Annex 9)',
      explanation: 'Standards for efficient movement of aircraft, crew, and cargo through borders.',
      keyPoints: [
        'Customs and Immigration requirements.',
        'Geneva/Crew identity cards.',
        'Declaration forms for health and cargo.',
        'Standardization of passports/visas for aviation.'
      ],
      practiceQuestions: [],
      revisionCard: '### FLOW\n- **Goal**: Reduce delays\n- **Doc**: Gen Dec form'
    },
    {
      id: 'reg-13',
      title: 'Aviation Security (Annex 17)',
      explanation: 'Safeguarding civil aviation against acts of unlawful interference.',
      keyPoints: [
        'Screening of passengers and baggage.',
        'Cockpit door security (locking).',
        'Ground security at airports.',
        'Prohibited items lists.'
      ],
      practiceQuestions: [],
      revisionCard: '### SECURITY\n- **Rule**: Preventive measures\n- **Focus**: Cabin/Crew safety'
    },
    {
      id: 'reg-14',
      title: 'Dangerous Goods (Annex 18)',
      explanation: 'Regulations for safe transport of hazardous materials by air.',
      keyPoints: [
        'Class 1-9 (Explosives to Misc).',
        'Packaging and Labelling requirements.',
        'Pilot-in-command must be notified (NOTOC).',
        'Forbidden items for cabin transport.'
      ],
      practiceQuestions: [],
      revisionCard: '### DANGEROUS\n- **NOTOC**: Info for pilot\n- **Classes**: 9 Categories'
    },
    {
      id: 'reg-15',
      title: 'Indian Aircraft Act 1934',
      explanation: 'The primary legislation enabling the central government to regulate aviation for India.',
      keyPoints: [
        'Empowers the regulation of aircraft manufacturing/ownership.',
        'Penalties for illegal operations.',
        'Framework for DGCA authority.',
        'Amendments for modern aviation needs.'
      ],
      practiceQuestions: [],
      revisionCard: '### ACT 1934\n- **Parent Law** of Indian Aviation'
    },
    {
      id: 'reg-16',
      title: 'Indian Aircraft Rules 1937',
      explanation: 'Specific operational rules derived from the 1934 Act.',
      keyPoints: [
        'Rule 20: Registration requirements.',
        'Rule 3-12: Prohibitions (e.g. carriage of arms).',
        'Rule 19: Licensing requirements.',
        'Schedules: Specific standards (e.g. Schedule II for licenses).'
      ],
      practiceQuestions: [],
      revisionCard: '### RULES 1937\n- **Operation Manual** of Legislation'
    },
    {
      id: 'reg-17',
      title: 'Aeronautical Information Services (AIS)',
      explanation: 'Ensuring the flow of information necessary for safe flight.',
      keyPoints: [
        'AIP (Aeronautical Information Publication).',
        'NOTAM (Notice to Airmen) for temporary changes.',
        'AIC (Aeronautical Information Circulars).',
        'AIRAC cycle: 28-day update standard.'
      ],
      practiceQuestions: [],
      revisionCard: '### AIS\n- **NOTAM**: Real-time updates\n- **AIP**: The bible of air data'
    },
    {
      id: 'reg-18',
      title: 'Instruments and Equipment',
      explanation: 'Minimum equipment lists (MEL) required for VFR, IFR, and Night flights.',
      keyPoints: [
        'Altimeter, Airspeed marker, Compass (VFR min).',
        'Transponder requirements.',
        'Life jackets vs Life rafts rules.',
        'GPWS (Ground Proximity) and TCAS requirements.'
      ],
      practiceQuestions: [],
      revisionCard: '### GEAR\n- **MEL**: Safe to fly with failure?\n- **VFR**: Basic 6 pack'
    },
    {
      id: 'reg-19',
      title: 'Communication Protocol',
      explanation: 'Legal requirements for radio and emergency frequency monitoring.',
      keyPoints: [
        'Continuous watch on 121.5 MHz.',
        'Air-Ground communication logs.',
        'Secrecy of correspondence act.',
        'Mandatory reporting points.'
      ],
      practiceQuestions: [],
      revisionCard: '### COMM\n- **Law**: Listen to 121.5\n- **Log**: Records of communication'
    },
    {
      id: 'reg-20',
      title: 'Licensing of Aerodromes',
      explanation: 'Certification required for public use airports in India.',
      keyPoints: [
        'Category: Private, Public, Government.',
        'Requirements for safety management (SMS).',
        'Aerodrome manual approval.',
        'Inspection and validity periods.'
      ],
      practiceQuestions: [],
      revisionCard: '### AIRPORT\n- **License**: Required for CPL ops\n- **SMS**: Safety first'
    }
  ]
};
