import { useState, useEffect, type CSSProperties } from 'react';

interface UnitProgressBarProps {
  unitNumber: number;
  title: string;
  completed: number;
  total: number;
  color: string;
}

const rowStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '6px',
  marginBottom: '14px',
};

const headerStyle: CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
};

const titleStyle: CSSProperties = {
  fontFamily: "'Cairo', sans-serif",
  fontSize: '14px',
  fontWeight: 700,
  color: 'rgba(255,255,255,0.9)',
};

const fractionStyle: CSSProperties = {
  fontFamily: "'Cairo', sans-serif",
  fontSize: '13px',
  fontWeight: 600,
  color: 'rgba(255,255,255,0.6)',
  direction: 'ltr',
};

const trackStyle: CSSProperties = {
  width: '100%',
  height: '10px',
  borderRadius: '5px',
  background: 'rgba(255,255,255,0.08)',
  overflow: 'hidden',
  position: 'relative',
};

const fillStyle = (pct: number, color: string, animated: boolean): CSSProperties => ({
  position: 'absolute',
  inset: 0,
  width: `${animated ? pct : 0}%`,
  borderRadius: '5px',
  background: `linear-gradient(90deg, ${color}, ${lighten(color)})`,
  transition: 'width 0.8s cubic-bezier(0.22, 1, 0.36, 1)',
  boxShadow: pct > 0 ? `0 0 8px ${color}44` : 'none',
});

/**
 * Attempt a simple lighten by blending with white.
 * Accepts hex colors; falls back to original if parsing fails.
 */
function lighten(hex: string): string {
  try {
    const c = hex.replace('#', '');
    const r = Math.min(255, parseInt(c.substring(0, 2), 16) + 50);
    const g = Math.min(255, parseInt(c.substring(2, 4), 16) + 50);
    const b = Math.min(255, parseInt(c.substring(4, 6), 16) + 50);
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
  } catch {
    return hex;
  }
}

export default function UnitProgressBar({
  unitNumber,
  title,
  completed,
  total,
  color,
}: UnitProgressBarProps) {
  const [animated, setAnimated] = useState(false);
  const pct = total > 0 ? Math.round((completed / total) * 100) : 0;

  useEffect(() => {
    // Trigger animation after mount
    const timer = setTimeout(() => setAnimated(true), 80);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div style={rowStyle}>
      <div style={headerStyle}>
        <span style={titleStyle}>
          {'\u{1F4D8}'} الوحدة {unitNumber}: {title}
        </span>
        <span style={fractionStyle}>
          {completed} / {total}
        </span>
      </div>
      <div style={trackStyle}>
        <div style={fillStyle(pct, color, animated)} />
      </div>
    </div>
  );
}
