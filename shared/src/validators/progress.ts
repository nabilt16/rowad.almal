import { z } from 'zod';

export const quizSubmitSchema = z.object({
  choiceIndex: z.number().int().min(0),
});

export const activitySubmitSchema = z.object({
  score: z.number().min(0).max(100).optional(),
  answers: z.record(z.unknown()).optional(),
});

export type QuizSubmitInput = z.infer<typeof quizSubmitSchema>;
export type ActivitySubmitInput = z.infer<typeof activitySubmitSchema>;
