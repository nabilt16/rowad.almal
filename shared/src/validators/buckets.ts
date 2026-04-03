import { z } from 'zod';

export const bucketSetupSchema = z.object({
  allowance: z.number().positive('المبلغ يجب أن يكون أكبر من صفر'),
  spendPct: z.number().min(0).max(100),
  savePct: z.number().min(0).max(100),
  givePct: z.number().min(0).max(100),
  saveGoalName: z.string().optional().default(''),
  saveGoalPrice: z.number().min(0).optional().default(0),
  giveGoalName: z.string().optional().default(''),
  giveGoalPrice: z.number().min(0).optional().default(0),
}).refine(data => data.spendPct + data.savePct + data.givePct === 100, {
  message: 'مجموع النسب يجب أن يساوي 100%',
});

export const bucketIncomeSchema = z.object({
  amount: z.number().positive('المبلغ يجب أن يكون أكبر من صفر'),
});

export const bucketUseSchema = z.object({
  type: z.enum(['USE_SPEND', 'USE_GIVE']),
  amount: z.number().positive('المبلغ يجب أن يكون أكبر من صفر'),
  note: z.string().optional().default(''),
});

export type BucketSetupInput = z.infer<typeof bucketSetupSchema>;
export type BucketIncomeInput = z.infer<typeof bucketIncomeSchema>;
export type BucketUseInput = z.infer<typeof bucketUseSchema>;
