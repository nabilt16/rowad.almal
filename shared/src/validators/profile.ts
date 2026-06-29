import { z } from 'zod';

export const onboardingSchema = z.object({
  studentName: z.string().min(2, 'الاسم مطلوب'),
  gender: z.enum(['male', 'female']),
  whoWorks: z.enum(['dad', 'mom', 'both']).optional(),
  dadName: z.string().optional(),
  dadJob: z.string().optional(),
  momName: z.string().optional(),
  momJob: z.string().optional(),
});

export const profileUpdateSchema = z.object({
  studentName: z.string().min(2).optional(),
  gender: z.enum(['male', 'female']).optional(),
  whoWorks: z.enum(['dad', 'mom', 'both']).optional(),
  dadName: z.string().min(1).optional(),
  dadJob: z.string().min(1).optional(),
  momName: z.string().min(1).optional(),
  momJob: z.string().min(1).optional(),
});

export type OnboardingInput = z.infer<typeof onboardingSchema>;
export type ProfileUpdateInput = z.infer<typeof profileUpdateSchema>;
