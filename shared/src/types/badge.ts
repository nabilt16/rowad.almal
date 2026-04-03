export enum BadgeRequirementType {
  LESSON_COUNT = 'LESSON_COUNT',
  SAVINGS_STARTED = 'SAVINGS_STARTED',
  UNIT_COMPLETED = 'UNIT_COMPLETED',
  GOAL_SET = 'GOAL_SET',
  STREAK_REACHED = 'STREAK_REACHED',
}

export interface Badge {
  id: string;
  gradeId: string;
  badgeKey: string;
  icon: string;
  nameAr: string;
  requirementType: BadgeRequirementType;
  requirementValue: number;
  requirementKey: string | null;
}

export interface UserBadge {
  id: string;
  userId: string;
  badgeId: string;
  earnedAt: string;
  badge: Badge;
}

export interface BadgeWithEarned extends Badge {
  earned: boolean;
  earnedAt: string | null;
}
