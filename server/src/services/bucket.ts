import { prisma } from '../app.js';
import { AppError } from '../middleware/errorHandler.js';
import type { BucketTransactionType } from '@prisma/client';

/**
 * Return the user's bucket configuration (or null if not set up yet)
 * together with their transaction history.
 */
export async function getConfig(userId: string) {
  const config = await prisma.bucketConfig.findUnique({
    where: { userId },
  });

  const transactions = await prisma.bucketTransaction.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  });

  return { config, transactions };
}

/**
 * Create or update the user's three-buckets configuration.
 * Percentages must total 100 (validated by the Zod schema at route level).
 */
export async function setup(
  userId: string,
  data: {
    allowance: number;
    spendPct: number;
    savePct: number;
    givePct: number;
    saveGoalName?: string;
    saveGoalPrice?: number;
    giveGoalName?: string;
    giveGoalPrice?: number;
  },
) {
  const config = await prisma.bucketConfig.upsert({
    where: { userId },
    create: {
      userId,
      allowance: data.allowance,
      spendPct: data.spendPct,
      savePct: data.savePct,
      givePct: data.givePct,
      saveGoalName: data.saveGoalName ?? '',
      saveGoalPrice: data.saveGoalPrice ?? 0,
      giveGoalName: data.giveGoalName ?? '',
      giveGoalPrice: data.giveGoalPrice ?? 0,
    },
    update: {
      allowance: data.allowance,
      spendPct: data.spendPct,
      savePct: data.savePct,
      givePct: data.givePct,
      saveGoalName: data.saveGoalName ?? '',
      saveGoalPrice: data.saveGoalPrice ?? 0,
      giveGoalName: data.giveGoalName ?? '',
      giveGoalPrice: data.giveGoalPrice ?? 0,
    },
  });

  return config;
}

/**
 * Add income to the three buckets.
 * Distributes the amount according to the user's configured percentages.
 */
export async function addIncome(userId: string, amount: number) {
  const config = await prisma.bucketConfig.findUnique({ where: { userId } });
  if (!config) {
    throw new AppError(400, 'يرجى إعداد الجرار أولاً');
  }

  const spendDelta = (amount * config.spendPct) / 100;
  const saveDelta = (amount * config.savePct) / 100;
  const giveDelta = (amount * config.givePct) / 100;

  const [updatedConfig, transaction] = await prisma.$transaction([
    prisma.bucketConfig.update({
      where: { userId },
      data: {
        spendBalance: { increment: spendDelta },
        saveBalance: { increment: saveDelta },
        giveBalance: { increment: giveDelta },
      },
    }),
    prisma.bucketTransaction.create({
      data: {
        userId,
        type: 'INCOME' as BucketTransactionType,
        amount,
        spendDelta,
        saveDelta,
        giveDelta,
      },
    }),
  ]);

  return { config: updatedConfig, transaction };
}

/**
 * Use money from the spend or give bucket.
 * Validates that sufficient balance exists before deducting.
 */
export async function useBucket(
  userId: string,
  type: 'USE_SPEND' | 'USE_GIVE',
  amount: number,
  note: string,
) {
  const config = await prisma.bucketConfig.findUnique({ where: { userId } });
  if (!config) {
    throw new AppError(400, 'يرجى إعداد الجرار أولاً');
  }

  if (type === 'USE_SPEND') {
    if (config.spendBalance < amount) {
      throw new AppError(400, 'رصيد الإنفاق غير كافٍ');
    }
  } else {
    if (config.giveBalance < amount) {
      throw new AppError(400, 'رصيد العطاء غير كافٍ');
    }
  }

  const spendDelta = type === 'USE_SPEND' ? -amount : 0;
  const giveDelta = type === 'USE_GIVE' ? -amount : 0;

  const [updatedConfig, transaction] = await prisma.$transaction([
    prisma.bucketConfig.update({
      where: { userId },
      data: {
        ...(type === 'USE_SPEND'
          ? { spendBalance: { decrement: amount } }
          : { giveBalance: { decrement: amount } }),
      },
    }),
    prisma.bucketTransaction.create({
      data: {
        userId,
        type: type as BucketTransactionType,
        amount,
        spendDelta,
        saveDelta: 0,
        giveDelta,
        note,
      },
    }),
  ]);

  return { config: updatedConfig, transaction };
}

/**
 * Reset the user's buckets: delete config and all transactions.
 * The user can then set up fresh buckets.
 */
export async function reset(userId: string) {
  const config = await prisma.bucketConfig.findUnique({ where: { userId } });
  if (!config) {
    throw new AppError(400, 'لا توجد جرار لإعادة تعيينها');
  }

  await prisma.$transaction([
    prisma.bucketTransaction.deleteMany({ where: { userId } }),
    prisma.bucketConfig.delete({ where: { userId } }),
  ]);

  return { success: true };
}
