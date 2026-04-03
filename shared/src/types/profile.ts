export interface OnboardingData {
  studentName: string;
  gender: 'male' | 'female';
  whoWorks: 'dad' | 'mom' | 'both';
  dadName: string;
  dadJob: string;
  momName: string;
  momJob: string;
}

export interface ProfileUpdate {
  studentName?: string;
  gender?: 'male' | 'female';
  whoWorks?: 'dad' | 'mom' | 'both';
  dadName?: string;
  dadJob?: string;
  momName?: string;
  momJob?: string;
}
