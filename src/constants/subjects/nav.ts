import { Subject } from '../../types/syllabus';

export const navigationSubject: Subject = {
  id: 'nav',
  title: 'AIR NAVIGATION',
  description: 'Calculations, charts, and routing. From the basics of Earth geometry to advanced satellite and inertial navigation systems.',
  topics: [
    {
      id: 'nav-1',
      title: 'Shape and Dimensions of the Earth',
      explanation: 'The Earth is an oblate spheroid, flattened at the poles and bulging at the equator. This affects calculations of distance and direction over long routes.',
      keyPoints: [
        'Oblate Spheroid shape due to rotational centrifugal force.',
        'Polar diameter is ~23 NM shorter than the equatorial diameter.',
        'Great Circle: The intersection of a plane passing through Earth\'s center.',
        'Small Circle: Any circle whose plane does not pass through the center.'
      ],
      practiceQuestions: [],
      revisionCard: '### EARTH GEOMETRY\n- **Shape**: Oblate Spheroid\n- **Great Circle**: Shortest Path\n- **Rhumb Line**: Constant Angle Crosser'
    },
    {
      id: 'nav-2',
      title: 'Units of Measurement',
      explanation: 'Standardized units for distance, speed, and altitude to ensure global safety and consistency in flight planning.',
      keyPoints: [
        '1 Nautical Mile (NM) = 1852m = 6080ft.',
        'Speed is measured in Knots (NM per hour).',
        'Altitude is typically in feet (ft) above MSL.',
        'Pressure is measured in hPa or inches of Hg.'
      ],
      practiceQuestions: [],
      revisionCard: '### UNITS\n- **1 NM** = 6080 ft\n- **1 Statute Mile** = 5280 ft\n- **1 Meter** = 3.28 ft'
    },
    {
      id: 'nav-3',
      title: 'Latitude and Longitude',
      explanation: 'The global coordinate system. Latitude (N/S) and Longitude (E/W) allow pinpointing any location on Earth.',
      keyPoints: [
        'Parallels of Latitude are Small Circles (except Equator).',
        'Meridians of Longitude are Semi-Great Circles.',
        '1° = 60\' = 3600".',
        '1\' Latitude = 1 NM everywhere.'
      ],
      practiceQuestions: [],
      revisionCard: '### GRID\n- **Lat**: Parallels (0-90°)\n- **Long**: Meridians (0-180°)\n- **Position**: Lat/Long format'
    },
    {
      id: 'nav-4',
      title: 'Direction and Distance',
      explanation: 'Measuring paths between two points using the 360-degree compass system and standardized units.',
      keyPoints: [
        'Direction is a clockwise angle from North.',
        'Departure: Distance along a parallel (NM).',
        'Formula: Dep = ChLong (min) * cos(Lat).',
        'Departure decreases as latitude increases.'
      ],
      practiceQuestions: [],
      revisionCard: `### DIR & DIST\n- **Dep Formula**: d'long * cos(lat)\n- **Bearing**: Measured from N`
    },
    {
      id: 'nav-5',
      title: 'Magnetism and Compasses',
      explanation: `Using the Earth's magnetic field for navigation. Dealing with variation, deviation, and dip errors.`,
      keyPoints: [
        'Variation: Angle between True and Magnetic North.',
        'Deviation: Local aircraft electrical/ferrous interference.',
        'Isogonals: Lines of equal variation.',
        'TVMDC: True Virgins Make Dull Company (+W/-E).'
      ],
      practiceQuestions: [
        {
          id: 'q-nav-5-1',
          q: 'If the magnetic heading is 090° and the variation is 5°W, what is the true heading?',
          options: ['085°', '095°', '090°', '100°'],
          a: '085°',
          explanation: 'Using the rule "Variation West, Magnetic Best" (Best means higher). So True + Var = Mag. If Mag is 90 and Var is 5W, then True = 90 - 5 = 85°.'
        }
      ],
      revisionCard: '### MAGNETISM\n- **Variation**: Earth field error\n- **Deviation**: Aircraft field error\n- **West is Best**: ADD'
    },
    {
      id: 'nav-6',
      title: 'Charts and Projections',
      explanation: `Transferring the 3D Earth onto a 2D map. Mercator, Lamberts, and Polar Stereographic projections.`,
      keyPoints: [
        "Lambert's Conformal: Great circles are nearly straight.",
        'Scale: Measured distance vs real distance.',
        'Orthomorphism: Preservation of angles and shapes.'
      ],
      practiceQuestions: [],
      revisionCard: '### CHARTS\n- **Mercator**: Rhumb lines straight\n- **Lamberts**: Great Circles straight'
    },
    {
      id: 'nav-7',
      title: 'Dead Reckoning (DR) Navigation',
      explanation: 'Calculating current position based on past position, speed, time, and heading.',
      keyPoints: [
        'Track: The path over the ground.',
        'Heading: Where the nose is pointing.',
        'Wind Velocity: Effect of air movement on track.',
        'Drift: The angle between Heading and Track.'
      ],
      practiceQuestions: [],
      revisionCard: '### DR NAV\n- **Heading + Wind** = Track\n- **Speed * Time** = Distance'
    },
    {
      id: 'nav-8',
      title: 'Time and Date',
      explanation: 'Managing time across longitudes. Coordinated Universal Time (UTC) and Local Mean Time (LMT).',
      keyPoints: [
        '15° Longitude = 1 Hour.',
        '1° Longitude = 4 Minutes.',
        'LMT = UTC +/- Arc-to-Time.',
        'IDL: International Date Line at 180°.'
      ],
      practiceQuestions: [
        {
          id: 'q-nav-8-1',
          q: 'At 0° Longitude, the LMT is 1200. What is the LMT at 15°E?',
          options: ['1100', '1300', '1200', '1215'],
          a: '1300',
          explanation: 'Every 15° of longitude equals 1 hour of time difference. Locations to the East are ahead in time. Therefore, 1200 + 1 hour = 1300.'
        }
      ],
      revisionCard: '### TIME\n- **15°/hr** cadence\n- **West**: Earlier LMT\n- **East**: Later LMT'
    },
    {
      id: 'nav-9',
      title: 'Altimetry',
      explanation: 'Measuring height using air pressure. Setting QNH, QFE, and Standard (1013.2 hPa).',
      keyPoints: [
        'QNH: Altitude above Mean Sea Level.',
        'QFE: Height above Aerodrome.',
        'Transition Level: Where altimeter is set to 1013.2.',
        'Temperature error: Cold air = Altimeter over-reads.'
      ],
      practiceQuestions: [],
      revisionCard: '### ALTIMETRY\n- **High to Low**: Look out below!\n- **Hot to Cold**: Look out below!'
    },
    {
      id: 'nav-10',
      title: 'Point of No Return (PNR)',
      explanation: 'The furthest point you can fly and return to base with the remaining fuel.',
      keyPoints: [
        'Calculated using Ground Speeds (Out and Home).',
        'Always moves INTO the wind (Upwind).',
        'Formula: Time to PNR = (E * H) / (O + H).',
        'E = Endurance; O = GS Out; H = GS Home.'
      ],
      practiceQuestions: [
        {
          id: 'q-nav-10-1',
          q: 'An aircraft has an endurance of 4 hours. The groundspeed out is 100 kts and the groundspeed home is 120 kts. What is the time to PNR?',
          options: ['2.18 hours', '2.00 hours', '1.82 hours', '2.40 hours'],
          a: '2.18 hours',
          explanation: 'Formula: Time to PNR = (Endurance * GS Home) / (GS Out + GS Home). Calculation: (4 * 120) / (100 + 120) = 480 / 220 ≈ 2.18 hours.'
        }
      ],
      revisionCard: '### PNR\n- **Formula**: (E*H)/(O+H)\n- **Moves**: Toward the Wind'
    },
    {
      id: 'nav-11',
      title: 'Equal Time Point (ETP)',
      explanation: 'The point on a track where the time to return to origin equals the time to proceed to destination.',
      keyPoints: [
        'Also called Critical Point (CP).',
        'Formula: Dist to ETP = (D * H) / (O + H).',
        'D = Total Route Distance.',
        'Moves towards the wind.'
      ],
      practiceQuestions: [],
      revisionCard: '### ETP\n- **Formula**: (D*H)/(O+H)\n- **Time**: Same for either choice'
    },
    {
      id: 'nav-12',
      title: 'Radio Theory and Beacons',
      explanation: 'Understanding frequency bands (VHF, HF, LF) and how radio waves propagate through the atmosphere.',
      keyPoints: [
        'Line of Sight: Propagation for VHF frequencies.',
        'Sky Waves: Propagation for HF via Ionosphere.',
        'Fading: Signal loss due to atmospheric changes.',
        'Frequency = c / Wavelength.'
      ],
      practiceQuestions: [],
      revisionCard: '### RADIO\n- **VHF**: Line of Sight\n- **HF**: Long Range (Skywave)'
    },
    {
      id: 'nav-13',
      title: 'VOR (VHF Omni-directional Range)',
      explanation: 'Providing 360 radials for precise track following. The standard short-to-medium range navigation aid.',
      keyPoints: [
        'VHF band: 108.0 to 117.95 MHz.',
        'Radial: Magnetic bearing FROM the VOR.',
        'Accuracy: Typically +/- 1 degree.',
        'Cone of Silence: Directly above the beacon.'
      ],
      practiceQuestions: [],
      revisionCard: '### VOR\n- **Phase Difference** method\n- **Radials**: OUTBOUND bearings'
    },
    {
      id: 'nav-14',
      title: 'NDB and ADF',
      explanation: 'Non-Directional Beacon and Automatic Direction Finder. One of the oldest electronic nav aids.',
      keyPoints: [
        'LF/MF band: 190 to 1750 kHz.',
        'Produces a circular signal (non-directional).',
        'Relative Bearing: Angle between nose and beacon.',
        'Errors: Night effect, Shoreline, Mountain, Thunderstorm.'
      ],
      practiceQuestions: [],
      revisionCard: '### NDB/ADF\n- **RB + HDG** = MB to station\n- **Coastal Refraction** error'
    },
    {
      id: 'nav-15',
      title: 'DME (Distance Measuring Equipment)',
      explanation: 'Providing slant range distance using pulse-pairs and transponders.',
      keyPoints: [
        'UHF band: 962 to 1213 MHz.',
        'Slant Range: Measured distance (not horizontal).',
        'Time Delay: Used to calculate distance.',
        'Interrogation: Aircraft initiates the signal.'
      ],
      practiceQuestions: [],
      revisionCard: '### DME\n- **Slant Range** vs Ground Dist\n- **Errors**: Negligible except overhead'
    },
    {
      id: 'nav-16',
      title: 'ILS (Instrument Landing System)',
      explanation: 'Precision approach aid providing lateral (localizer) and vertical (glide path) guidance.',
      keyPoints: [
        'Localizer: 108.1-111.95 MHz.',
        'Glide Path: 329.15-335 MHz (paired with localizer).',
        'False Glideslopes: Created at multiples of 3° (e.g. 6°, 9°).',
        'Markers: Outer, Middle, Inner indicate distance to threshold.'
      ],
      practiceQuestions: [],
      revisionCard: '### ILS\n- **Loc**: Lateral\n- **GS**: Vertical\n- **Markers**: Om/Mm/Im'
    },
    {
      id: 'nav-17',
      title: 'Radar Theory',
      explanation: 'Radio Detection and Ranging. Primary radar (echo) vs Secondary radar (transponder).',
      keyPoints: [
        'Primary Radar: Detects skin echo.',
        'Secondary (SSR): Interrogates transponder.',
        'Slant range distortion at high altitudes.',
        'Pulse Width determines minimum range.'
      ],
      practiceQuestions: [],
      revisionCard: '### RADAR\n- **AWR**: Weather detection\n- **SSR**: Identity (Squawk)'
    },
    {
      id: 'nav-18',
      title: 'GNSS / GPS',
      explanation: 'Satellite-based navigation using 24+ satellites. Segment architecture and accuracy methods.',
      keyPoints: [
        'Space, Control, and User segments.',
        '3D Position: Need 4 satellites.',
        'RAIM: Receiver Autonomous Integrity Monitoring.',
        'Differential GPS: Enhances precision for landings.'
      ],
      practiceQuestions: [],
      revisionCard: '### GPS\n- **24+ Satellites**\n- **RAIM**: Integrity check'
    },
    {
      id: 'nav-19',
      title: 'INS and IRS',
      explanation: `Inertial Navigation/Reference Systems. Self-contained navigation using gyros and accelerometers.`,
      keyPoints: [
        'Does not require external ground stations.',
        'IRS uses ring-laser gyros (strapdown).',
        'Alignment: Requires 10-15 mins before flight.',
        `Schuler Tuning: Compensates for Earth's curve.`
      ],
      practiceQuestions: [],
      revisionCard: '### INS/IRS\n- **Accelerometers** + Gyros\n- **Self-Contained**'
    },
    {
      id: 'nav-20',
      title: 'Transponders and Squawk Codes',
      explanation: 'Enabling ATC to identify and track aircraft in secondary radar environments.',
      keyPoints: [
        'Mode A: Ident only.',
        'Mode C: Ident + Pressure Altitude.',
        '7700: Emergency.',
        '7600: Radio Failure; 7500: Hijack.'
      ],
      practiceQuestions: [],
      revisionCard: '### CODES\n- **7700**: PAN/MAYDAY\n- **7600**: Comms loss\n- **7500**: Hijack'
    },
    {
      id: 'nav-21',
      title: 'Relative Motion',
      explanation: 'Calculating movement between two moving objects, vital for interception or avoiding collisions.',
      keyPoints: [
        'Relative Velocity (RV): Sum or Difference of speeds.',
        'Angle of Interception: Heading change needed.',
        'Closure Rate: Speed of closing distance.',
        'Points of closest approach calculation.'
      ],
      practiceQuestions: [],
      revisionCard: '### RELATIVE\n- **Closure**: Distance / RV\n- **Interception**: Path convergence'
    }
  ]
};
