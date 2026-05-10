import { Subject } from '../types/syllabus';
import { navigationSubject } from './subjects/nav';
import { meteorologySubject } from './subjects/met';
import { technicalGeneralSubject } from './subjects/tech-gen';
import { technicalSpecificSubject } from './subjects/tech-spec';
import { rtrSubject } from './subjects/rtr';
import { pofSubject } from './subjects/pof';
import { regulationSubject } from './subjects/reg';
import { humanPerformanceSubject } from './subjects/hp';

export const DGCA_SUBJECTS: Subject[] = [
  navigationSubject,
  meteorologySubject,
  technicalGeneralSubject,
  technicalSpecificSubject,
  rtrSubject,
  pofSubject,
  regulationSubject,
  humanPerformanceSubject
];
