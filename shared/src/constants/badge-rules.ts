import { BadgeRequirementType } from '../types/badge.js';

export interface BadgeRule {
  badgeKey: string;
  icon: string;
  nameAr: string;
  requirementType: BadgeRequirementType;
  requirementValue: number;
  requirementKey: string | null;
}

// Badge rules are populated from content extraction in Phase 1.
// This file defines the structure; actual badge data comes from seed.
export const BADGE_REQUIREMENT_LABELS: Record<BadgeRequirementType, string> = {
  [BadgeRequirementType.LESSON_COUNT]: 'إكمال عدد من الدروس',
  [BadgeRequirementType.SAVINGS_STARTED]: 'بدء التوفير',
  [BadgeRequirementType.UNIT_COMPLETED]: 'إكمال وحدة كاملة',
  [BadgeRequirementType.GOAL_SET]: 'تحديد هدف توفيري',
  [BadgeRequirementType.STREAK_REACHED]: 'الوصول إلى سلسلة متتالية',
};
