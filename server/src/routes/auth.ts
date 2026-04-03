import { Router, Response, NextFunction } from 'express';
import { registerSchema, loginSchema } from '@rowad/shared';
import { authenticate, AuthRequest } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { prisma } from '../app.js';
import { hashPassword, comparePassword } from '../utils/password.js';
import { signToken } from '../utils/jwt.js';
import { AppError } from '../middleware/errorHandler.js';

const router = Router();

// POST /register
router.post(
  '/register',
  validate(registerSchema),
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { email, password, name } = req.body;

      const existing = await prisma.user.findUnique({ where: { email } });
      if (existing) {
        throw new AppError(409, 'البريد الإلكتروني مسجل مسبقاً');
      }

      const passwordHash = await hashPassword(password);

      const user = await prisma.user.create({
        data: {
          email,
          passwordHash,
          profile: {
            create: { studentName: name },
          },
        },
        select: {
          id: true,
          email: true,
          role: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      const token = signToken({ userId: user.id, role: user.role });

      res.status(201).json({ user, token });
    } catch (err) {
      next(err);
    }
  },
);

// POST /login
router.post(
  '/login',
  validate(loginSchema),
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body;

      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) {
        throw new AppError(401, 'بريد إلكتروني أو كلمة مرور غير صحيحة');
      }

      const valid = await comparePassword(password, user.passwordHash);
      if (!valid) {
        throw new AppError(401, 'بريد إلكتروني أو كلمة مرور غير صحيحة');
      }

      const token = signToken({ userId: user.id, role: user.role });

      res.json({
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        },
        token,
      });
    } catch (err) {
      next(err);
    }
  },
);

// GET /me (authenticated)
router.get(
  '/me',
  authenticate,
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const user = await prisma.user.findUnique({
        where: { id: req.userId },
        select: {
          id: true,
          email: true,
          role: true,
          createdAt: true,
          updatedAt: true,
          profile: true,
        },
      });

      if (!user) {
        throw new AppError(404, 'المستخدم غير موجود');
      }

      res.json(user);
    } catch (err) {
      next(err);
    }
  },
);

export default router;
