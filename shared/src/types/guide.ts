export interface GuideStep {
  text: string;
  time: string;
}

export interface GuideTip {
  icon: string;
  text: string;
}

export interface GuideLesson {
  id: string;
  guideUnitId: string;
  title: string;
  goal: string;
  totalTime: string;
  steps: GuideStep[];
  questions: string[];
  tips: GuideTip[];
}

export interface GuideUnit {
  id: string;
  gradeId: string;
  unitNumber: number;
  unitName: string;
  lessons: GuideLesson[];
}
