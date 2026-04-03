import type { CSSProperties } from 'react';

interface LessonBannerProps {
  bgEmoji: string;
  bgColor: string;
  title: string;
  subtitle: string;
  goal: string;
}

const bannerStyle = (bgColor: string): CSSProperties => ({
  borderRadius: 'var(--r-lg)',
  padding: '26px 28px',
  color: 'white',
  marginBottom: '18px',
  position: 'relative',
  overflow: 'hidden',
  background: bgColor || 'linear-gradient(135deg, var(--blue), #0D47A1)',
  animation: 'panelIn 0.3s ease',
});

const emojiBackdropStyle: CSSProperties = {
  position: 'absolute',
  left: '16px',
  top: '50%',
  transform: 'translateY(-50%)',
  fontSize: '100px',
  opacity: 0.12,
  lineHeight: 1,
  pointerEvents: 'none',
};

const titleStyle: CSSProperties = {
  fontFamily: "'Noto Naskh Arabic', serif",
  fontSize: '22px',
  fontWeight: 900,
  marginBottom: '8px',
  position: 'relative',
  zIndex: 1,
};

const subtitleStyle: CSSProperties = {
  opacity: 0.85,
  fontSize: '18px',
  lineHeight: 1.9,
  position: 'relative',
  zIndex: 1,
  marginBottom: '12px',
};

const goalContainerStyle: CSSProperties = {
  position: 'relative',
  zIndex: 1,
  background: 'rgba(0,0,0,0.15)',
  borderRadius: '12px',
  padding: '10px 16px',
  marginTop: '12px',
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
};

const goalLabelStyle: CSSProperties = {
  fontFamily: "'Cairo', sans-serif",
  fontSize: '12px',
  fontWeight: 800,
  color: 'rgba(255,255,255,0.7)',
  flexShrink: 0,
};

const goalTextStyle: CSSProperties = {
  fontSize: '15px',
  lineHeight: 1.6,
  color: 'rgba(255,255,255,0.9)',
};

export default function LessonBanner({
  bgEmoji,
  bgColor,
  title,
  subtitle,
  goal,
}: LessonBannerProps) {
  return (
    <div style={bannerStyle(bgColor)}>
      {/* Large emoji backdrop */}
      <div style={emojiBackdropStyle}>{bgEmoji}</div>

      <h2 style={titleStyle}>
        {bgEmoji} {title}
      </h2>
      <p style={subtitleStyle}>{subtitle}</p>

      {goal && (
        <div style={goalContainerStyle}>
          <span style={goalLabelStyle}>
            \uD83C\uDFAF الهدف:
          </span>
          <span style={goalTextStyle}>{goal}</span>
        </div>
      )}
    </div>
  );
}
