import type { CSSProperties } from 'react';
import MultipleChoice from './MultipleChoice';
import Ordering from './Ordering';
import Classification from './Classification';
import TrueFalse from './TrueFalse';
import Calculation from './Calculation';
import StepActivity from './StepActivity';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface ActivityCardProps {
  activityType: string;
  activityConfig: Record<string, unknown>;
  lessonId: string;
  onComplete: (score: number, answers: Record<string, unknown>) => void;
}

/* ------------------------------------------------------------------ */
/*  Activity type to component mapping                                 */
/* ------------------------------------------------------------------ */

/** Activity types that use the generic StepActivity component */
const STEP_ACTIVITY_TYPES = new Set([
  'amir_steps',
  'souq_activity',
  'wassam_party',
  'maryam_detective',
  'time_machine',
  'city_council',
  'smart_shopper',
  'vat_calculator',
  'compound_interest',
  'stock_simulation',
  'business_calculator',
  'phishing_detector',
  'inflation_timeline',
]);

/* ------------------------------------------------------------------ */
/*  Fallback styles                                                    */
/* ------------------------------------------------------------------ */

const fallbackStyle: CSSProperties = {
  background: 'rgba(255, 255, 255, 0.06)',
  border: '1px solid rgba(255, 255, 255, 0.08)',
  borderRadius: 'var(--r-lg)',
  padding: '48px 32px',
  textAlign: 'center',
  direction: 'rtl',
};

const fallbackIconStyle: CSSProperties = {
  fontSize: '40px',
  marginBottom: '12px',
};

const fallbackTextStyle: CSSProperties = {
  fontFamily: "'Cairo', sans-serif",
  fontSize: '16px',
  color: 'var(--gray-3)',
  lineHeight: 1.6,
};

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function ActivityCard({
  activityType,
  activityConfig,
  lessonId: _lessonId,
  onComplete,
}: ActivityCardProps) {
  // Cast helper: activityConfig comes as Record<string, unknown> from the API
  // but each activity component expects a specific shape. We cast through
  // unknown to satisfy TypeScript's strict overlap check.
  const cfg = activityConfig as unknown;

  /* ----- Grade 4 core activity types ----- */

  if (activityType === 'multiple_choice') {
    return (
      <MultipleChoice
        config={cfg as Parameters<typeof MultipleChoice>[0]['config']}
        onComplete={onComplete}
      />
    );
  }

  if (activityType === 'ordering') {
    return (
      <Ordering
        config={cfg as Parameters<typeof Ordering>[0]['config']}
        onComplete={onComplete}
      />
    );
  }

  if (activityType === 'classification') {
    return (
      <Classification
        config={cfg as Parameters<typeof Classification>[0]['config']}
        onComplete={onComplete}
      />
    );
  }

  if (activityType === 'true_false') {
    return (
      <TrueFalse
        config={cfg as Parameters<typeof TrueFalse>[0]['config']}
        onComplete={onComplete}
      />
    );
  }

  if (activityType === 'calculation') {
    return (
      <Calculation
        config={cfg as Parameters<typeof Calculation>[0]['config']}
        onComplete={onComplete}
      />
    );
  }

  /* ----- Step-based narrative activities (Grade 5 & 6) ----- */

  if (STEP_ACTIVITY_TYPES.has(activityType)) {
    return (
      <StepActivity
        activityType={activityType}
        config={cfg as Parameters<typeof StepActivity>[0]['config']}
        onComplete={onComplete}
      />
    );
  }

  /* ----- Unknown activity type fallback ----- */

  return (
    <div style={fallbackStyle}>
      <div style={fallbackIconStyle}>{'\uD83D\uDEA7'}</div>
      <div style={fallbackTextStyle}>
        {'\u0647\u0630\u0627 \u0627\u0644\u0646\u0634\u0627\u0637 \u063A\u064A\u0631 \u0645\u062A\u0648\u0641\u0631 \u062D\u0627\u0644\u064A\u0627\u064B'}
      </div>
      <div
        style={{
          ...fallbackTextStyle,
          fontSize: '13px',
          color: 'var(--muted)',
          marginTop: '8px',
        }}
      >
        ({activityType})
      </div>
    </div>
  );
}
