export interface Question {
  id: string;
  q: string;
  options: string[];
  a: string;
  explanation: string;
}

export interface Topic {
  id: string;
  title: string;
  explanation: string;
  keyPoints: string[];
  practiceQuestions: Question[];
  revisionCard: string;
}

export interface Subject {
  id: string;
  title: string;
  description: string;
  topics: Topic[];
}
