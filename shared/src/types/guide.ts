export interface GuideStep {
  title: string;
  duration: string;
  description: string;
}

export interface GuideLesson {
  id: string;
  guideUnitId: string;
  title: string;
  goal: string;
  totalTime: string;
  steps: GuideStep[];
  questions: string[];
  tips: string[];
}

export interface GuideUnit {
  id: string;
  gradeId: string;
  unitNumber: number;
  unitName: string;
  lessons: GuideLesson[];
}
