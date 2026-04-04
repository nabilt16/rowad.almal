import { Router, Response, NextFunction } from 'express';
import {
  bucketSetupSchema,
  bucketIncomeSchema,
  bucketUseSchema,
} from '@rowad/shared';
import { authenticate, AuthRequest } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { prisma } from '../app.js';
import { AppError } from '../middleware/errorHandler.js';

const router = Router();

// GET / - get buckets state (config + transactions)
router.get(
  '/',
  authenticate,
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const config = await prisma.bucketConfig.findUnique({
        where: { userId: req.userId },
      });

      const transactions = await prisma.bucketTransaction.findMany({
        where: { userId: req.userId },
        orderBy: { createdAt: 'desc' },
      });

      res.json({ config, transactions });
    } catch (err) {
      next(err);
    }
  },
);

// POST /setup - create or update bucket configuration
router.post(
  '/setup',
  authenticate,
  validate(bucketSetupSchema),
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const {
        allowance,
        spendPct,
        savePct,
        givePct,
        saveGoalName,
        saveGoalPrice,
        giveGoalName,
        giveGoalPrice,
      } = req.body;

      const config = await prisma.bucketConfig.upsert({
        where: { userId: req.userId },
        create: {
          userId: req.userId!,
          allowance,
          spendPct,
          savePct,
          givePct,
          saveGoalName,
          saveGoalPrice,
          giveGoalName,
          giveGoalPrice,
        },
        update: {
          allowance,
          spendPct,
          savePct,
          givePct,
          saveGoalName,
          saveGoalPrice,
          giveGoalName,
          giveGoalPrice,
        },
      });

      res.json(config);
    } catch (err) {
      next(err);
    }
  },
);

// POST /income - add income and distribute to buckets
router.post(
  '/income',
  authenticate,
  validate(bucketIncomeSchema),
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { amount } = req.body;

      const config = await prisma.bucketConfig.findUnique({
        where: { userId: req.userId },
      });

      if (!config) {
        throw new AppError(400, 'يرجى إعداد القجة أولاً');
      }

      const spendDelta = (amount * config.spendPct) / 100;
      const saveDelta = (amount * config.savePct) / 100;
      const giveDelta = (amount * config.givePct) / 100;

      const [transaction, updatedConfig] = await prisma.$transaction([
        prisma.bucketTransaction.create({
          data: {
            userId: req.userId!,
            type: 'INCOME',
            amount,
            spendDelta,
            saveDelta,
            giveDelta,
          },
        }),
        prisma.bucketConfig.update({
          where: { userId: req.userId },
          data: {
            spendBalance: { increment: spendDelta },
            saveBalance: { increment: saveDelta },
            giveBalance: { increment: giveDelta },
          },
        }),
      ]);

      res.json({ transaction, config: updatedConfig });
    } catch (err) {
      next(err);
    }
  },
);

// POST /use - use money from spend or give bucket
router.post(
  '/use',
  authenticate,
  validate(bucketUseSchema),
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { type, amount, note } = req.body;

      const config = await prisma.bucketConfig.findUnique({
        where: { userId: req.userId },
      });

      if (!config) {
        throw new AppError(400, 'يرجى إعداد القجة أولاً');
      }

      const balanceField = type === 'USE_SPEND' ? 'spendBalance' : 'giveBalance';
      const currentBalance = type === 'USE_SPEND' ? config.spendBalance : config.giveBalance;

      if (currentBalance < amount) {
        throw new AppError(400, 'الرصيد غير كافٍ');
      }

      const spendDelta = type === 'USE_SPEND' ? -amount : 0;
      const giveDelta = type === 'USE_GIVE' ? -amount : 0;

      const [transaction, updatedConfig] = await prisma.$transaction([
        prisma.bucketTransaction.create({
          data: {
            userId: req.userId!,
            type,
            amount,
            spendDelta,
            saveDelta: 0,
            giveDelta,
            note,
          },
        }),
        prisma.bucketConfig.update({
          where: { userId: req.userId },
          data: {
            [balanceField]: { decrement: amount },
          },
        }),
      ]);

      res.json({ transaction, config: updatedConfig });
    } catch (err) {
      next(err);
    }
  },
);

// DELETE / - reset buckets (delete config and all transactions)
router.delete(
  '/',
  authenticate,
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      await prisma.$transaction([
        prisma.bucketTransaction.deleteMany({
          where: { userId: req.userId },
        }),
        prisma.bucketConfig.deleteMany({
          where: { userId: req.userId },
        }),
      ]);

      res.json({ message: 'تم إعادة تعيين القجج بنجاح' });
    } catch (err) {
      next(err);
    }
  },
);

export default router;
