export enum Role {
  STUDENT = 'STUDENT',
  ADMIN = 'ADMIN',
}

export interface User {
  id: string;
  email: string;
  role: Role;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface StudentProfile {
  id: string;
  userId: string;
  studentName: string;
  gender: 'male' | 'female';
  whoWorks: 'dad' | 'mom' | 'both';
  dadName: string;
  dadJob: string;
  momName: string;
  momJob: string;
  onboarded: boolean;
}
