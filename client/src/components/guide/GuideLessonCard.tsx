import { useState, type CSSProperties } from 'react';
import type { GuideStep } from '@rowad/shared';

interface GuideLessonCardProps {
  title: string;
  goal: string;
  totalTime: string;
  steps: GuideStep[];
  questions: string[];
  tips: string[];
  accentColor?: string;
}

const cardStyle = (expanded: boolean): CSSProperties => ({
  background: expanded ? 'rgba(255,255,255,0.07)' : 'rgba(255,255,255,0.04)',
  borderRadius: 'var(--r-lg)',
  marginBottom: '14px',
  border: '1px solid rgba(255,255,255,0.08)',
  overflow: 'hidden',
  transition: 'background 0.2s',
});

const cardHeaderStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  padding: '16px 20px',
  cursor: 'pointer',
  userSelect: 'none',
};

const chevronStyle = (expanded: boolean): CSSProperties => ({
  display: 'inline-block',
  transition: 'transform 0.25s ease',
  transform: expanded ? 'rotate(90deg)' : 'rotate(0deg)',
  fontSize: '12px',
  color: 'var(--gray-3)',
  flexShrink: 0,
});

const lessonTitleStyle: CSSProperties = {
  fontFamily: "'IBM Plex Arabic', sans-serif",
  fontSize: '17px',
  fontWeight: 700,
  color: 'var(--white)',
  flex: 1,
};

const timeChipStyle: CSSProperties = {
  fontFamily: "'IBM Plex Arabic', sans-serif",
  fontSize: '13px',
  fontWeight: 600,
  color: 'var(--sky)',
  background: 'rgba(100,181,246,0.15)',
  padding: '4px 12px',
  borderRadius: '12px',
  flexShrink: 0,
  display: 'flex',
  alignItems: 'center',
  gap: '4px',
};

const bodyStyle: CSSProperties = {
  padding: '0 20px 20px',
};

const sectionStyle: CSSProperties = {
  marginBottom: '20px',
};

const sectionTitleStyle = (color: string): CSSProperties => ({
  fontFamily: "'IBM Plex Arabic', sans-serif",
  fontSize: '15px',
  fontWeight: 700,
  color: color,
  marginBottom: '10px',
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
});

const goalBoxStyle: CSSProperties = {
  background: 'rgba(46,125,50,0.12)',
  borderRadius: 'var(--r)',
  padding: '14px 18px',
  display: 'flex',
  alignItems: 'flex-start',
  gap: '10px',
};

const goalIconStyle: CSSProperties = {
  fontSize: '20px',
  flexShrink: 0,
  marginTop: '2px',
};

const goalTextStyle: CSSProperties = {
  fontFamily: "'IBM Plex Arabic', sans-serif",
  fontSize: '16px',
  lineHeight: 1.9,
  color: 'rgba(255,255,255,0.88)',
};

const stepItemStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'flex-start',
  gap: '12px',
  padding: '10px 0',
  borderBottom: '1px solid rgba(255,255,255,0.05)',
};

const stepNumberStyle = (color: string): CSSProperties => ({
  fontFamily: "'IBM Plex Arabic', sans-serif",
  fontSize: '14px',
  fontWeight: 800,
  color: 'var(--white)',
  background: color,
  width: '28px',
  height: '28px',
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
  marginTop: '2px',
});

const stepContentStyle: CSSProperties = {
  flex: 1,
};

const stepTitleStyle: CSSProperties = {
  fontFamily: "'IBM Plex Arabic', sans-serif",
  fontSize: '15px',
  fontWeight: 700,
  color: 'var(--white)',
  marginBottom: '4px',
};

const stepDescStyle: CSSProperties = {
  fontFamily: "'IBM Plex Arabic', sans-serif",
  fontSize: '14px',
  lineHeight: 1.8,
  color: 'rgba(255,255,255,0.75)',
};

const stepTimeChipStyle: CSSProperties = {
  fontFamily: "'IBM Plex Arabic', sans-serif",
  fontSize: '12px',
  fontWeight: 600,
  color: 'var(--gold)',
  background: 'rgba(249,168,37,0.15)',
  padding: '2px 10px',
  borderRadius: '10px',
  flexShrink: 0,
  marginTop: '4px',
};

const questionItemStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'flex-start',
  gap: '10px',
  padding: '8px 0',
};

const questionNumberStyle: CSSProperties = {
  fontFamily: "'IBM Plex Arabic', sans-serif",
  fontSize: '14px',
  fontWeight: 700,
  color: 'var(--sky)',
  flexShrink: 0,
  marginTop: '2px',
};

const questionTextStyle: CSSProperties = {
  fontFamily: "'IBM Plex Arabic', sans-serif",
  fontSize: '15px',
  lineHeight: 1.9,
  color: 'rgba(255,255,255,0.85)',
};

const tipItemStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'flex-start',
  gap: '10px',
  padding: '8px 14px',
  background: 'rgba(249,168,37,0.08)',
  borderRadius: 'var(--r)',
  marginBottom: '8px',
};

const tipTextStyle: CSSProperties = {
  fontFamily: "'IBM Plex Arabic', sans-serif",
  fontSize: '15px',
  lineHeight: 1.9,
  color: 'rgba(255,255,255,0.85)',
  flex: 1,
};

export default function GuideLessonCard({
  title,
  goal,
  totalTime,
  steps,
  questions,
  tips,
  accentColor = 'var(--blue)',
}: GuideLessonCardProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div style={cardStyle(expanded)}>
      {/* Header - clickable to expand */}
      <div style={cardHeaderStyle} onClick={() => setExpanded(!expanded)}>
        <span style={chevronStyle(expanded)}>{'\u25B6'}</span>
        <span style={lessonTitleStyle}>{title}</span>
        {totalTime && (
          <span style={timeChipStyle}>
            {'\u23F1'} {totalTime}
          </span>
        )}
      </div>

      {/* Expandable body */}
      {expanded && (
        <div style={bodyStyle}>
          {/* Goal */}
          {goal && (
            <div style={sectionStyle}>
              <div style={sectionTitleStyle('var(--green-lt)')}>
                {'\uD83C\uDFAF'} الهدف
              </div>
              <div style={goalBoxStyle}>
                <span style={goalIconStyle}>{'\uD83C\uDFAF'}</span>
                <span style={goalTextStyle}>{goal}</span>
              </div>
            </div>
          )}

          {/* Steps */}
          {steps && steps.length > 0 && (
            <div style={sectionStyle}>
              <div style={sectionTitleStyle(accentColor)}>
                {'\uD83D\uDCCB'} خطوات الدرس
              </div>
              {steps.map((step, idx) => (
                <div key={idx} style={stepItemStyle}>
                  <span style={stepNumberStyle(accentColor)}>{idx + 1}</span>
                  <div style={stepContentStyle}>
                    <div style={stepTitleStyle}>{step.title}</div>
                    {step.description && (
                      <div style={stepDescStyle}>{step.description}</div>
                    )}
                  </div>
                  {step.duration && (
                    <span style={stepTimeChipStyle}>
                      {'\u23F0'} {step.duration}
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Discussion Questions */}
          {questions && questions.length > 0 && (
            <div style={sectionStyle}>
              <div style={sectionTitleStyle('var(--sky)')}>
                {'\u2753'} أسئلة للنقاش
              </div>
              {questions.map((q, idx) => (
                <div key={idx} style={questionItemStyle}>
                  <span style={questionNumberStyle}>
                    {'\u2753'} {idx + 1}.
                  </span>
                  <span style={questionTextStyle}>{q}</span>
                </div>
              ))}
            </div>
          )}

          {/* Tips */}
          {tips && tips.length > 0 && (
            <div style={sectionStyle}>
              <div style={sectionTitleStyle('var(--gold)')}>
                {'\uD83D\uDCA1'} نصائح للمعلم
              </div>
              {tips.map((tip, idx) => (
                <div key={idx} style={tipItemStyle}>
                  <span style={{ fontSize: '16px', flexShrink: 0 }}>{'\uD83D\uDCA1'}</span>
                  <span style={tipTextStyle}>{tip}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
