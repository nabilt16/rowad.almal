import type { CSSProperties } from 'react';
import type { BadgeWithEarned, BadgeRequirementType } from '@rowad/shared';

interface BadgeCardProps {
  badge: BadgeWithEarned;
}

/* ---------- requirement description helpers ---------- */

const requirementText: Record<BadgeRequirementType, (v: number, k: string | null) => string> = {
  LESSON_COUNT: (v) => `\u{0623}\u{0643}\u{0645}\u{0644} ${v} \u{062F}\u{0631}\u{0648}\u{0633}`,
  SAVINGS_STARTED: () => '\u{0627}\u{0628}\u{062F}\u{0623} \u{0627}\u{0644}\u{0627}\u{062F}\u{062E}\u{0627}\u{0631}',
  UNIT_COMPLETED: (_v, k) => `\u{0623}\u{0643}\u{0645}\u{0644} \u{0627}\u{0644}\u{0648}\u{062D}\u{062F}\u{0629} ${k ?? ''}`,
  GOAL_SET: () => '\u{062D}\u{062F}\u{062F} \u{0647}\u{062F}\u{0641}\u{064B}\u{0627} \u{0627}\u{062F}\u{062E}\u{0627}\u{0631}\u{064A}\u{064B}\u{0627}',
  STREAK_REACHED: (v) => `\u{062D}\u{0642}\u{0642} \u{0633}\u{0644}\u{0633}\u{0644}\u{0629} ${v} \u{0623}\u{064A}\u{0627}\u{0645}`,
};

function getRequirementDescription(badge: BadgeWithEarned): string {
  const fn = requirementText[badge.requirementType as BadgeRequirementType];
  if (!fn) return '';
  return fn(badge.requirementValue, badge.requirementKey);
}

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return '';
  }
}

/* ---------- styles ---------- */

const cardBase: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  textAlign: 'center',
  padding: '20px 12px',
  borderRadius: 'var(--r)',
  position: 'relative',
  transition: 'transform 0.25s ease, box-shadow 0.25s ease',
  animation: 'panelIn 0.35s ease',
  minHeight: '170px',
};

const earnedStyle: CSSProperties = {
  ...cardBase,
  background: 'rgba(249,168,37,0.10)',
  border: '2px solid var(--gold)',
  boxShadow: '0 0 18px rgba(249,168,37,0.25), 0 4px 20px rgba(0,0,0,0.2)',
};

const lockedStyle: CSSProperties = {
  ...cardBase,
  background: 'rgba(255,255,255,0.04)',
  border: '2px solid rgba(255,255,255,0.08)',
  opacity: 0.6,
};

const iconStyle = (earned: boolean): CSSProperties => ({
  fontSize: '42px',
  lineHeight: 1,
  marginBottom: '10px',
  filter: earned ? 'none' : 'grayscale(1)',
  position: 'relative',
});

const nameStyle: CSSProperties = {
  fontFamily: "'IBM Plex Arabic', sans-serif",
  fontSize: '14px',
  fontWeight: 700,
  color: 'rgba(255,255,255,0.92)',
  marginBottom: '4px',
};

const subTextStyle: CSSProperties = {
  fontFamily: "'IBM Plex Arabic', sans-serif",
  fontSize: '12px',
  color: 'rgba(255,255,255,0.55)',
  lineHeight: 1.5,
};

const earnedBadgeStyle: CSSProperties = {
  display: 'inline-block',
  marginTop: '8px',
  padding: '3px 10px',
  borderRadius: '12px',
  background: 'linear-gradient(135deg, var(--gold), #E65100)',
  fontFamily: "'IBM Plex Arabic', sans-serif",
  fontSize: '11px',
  fontWeight: 700,
  color: 'white',
};

const lockOverlayStyle: CSSProperties = {
  position: 'absolute',
  top: '8px',
  left: '8px',
  fontSize: '16px',
  opacity: 0.5,
};

export default function BadgeCard({ badge }: BadgeCardProps) {
  const earned = badge.earned;

  return (
    <div style={earned ? earnedStyle : lockedStyle}>
      {/* Lock overlay for unearned */}
      {!earned && <span style={lockOverlayStyle}>{'\uD83D\uDD12'}</span>}

      {/* Icon */}
      <div style={iconStyle(earned)}>{badge.icon}</div>

      {/* Name */}
      <div style={nameStyle}>{badge.nameAr}</div>

      {earned ? (
        <>
          {badge.earnedAt && (
            <div style={subTextStyle}>{formatDate(badge.earnedAt)}</div>
          )}
          <span style={earnedBadgeStyle}>
            {'\u2714 \u062A\u0645 \u0627\u0644\u062D\u0635\u0648\u0644 \u0639\u0644\u064A\u0647\u0627'}
          </span>
        </>
      ) : (
        <div style={subTextStyle}>{getRequirementDescription(badge)}</div>
      )}
    </div>
  );
}
