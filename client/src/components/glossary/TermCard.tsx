import type { CSSProperties } from 'react';

interface TermCardProps {
  termAr: string;
  termHe: string;
  definition: string;
  example: string;
  accentColor?: string;
}

const cardStyle = (accent: string): CSSProperties => ({
  background: 'rgba(255,255,255,0.06)',
  borderRadius: 'var(--r)',
  padding: '18px 22px',
  marginBottom: '12px',
  borderRight: `4px solid ${accent}`,
  border: '1px solid rgba(255,255,255,0.08)',
  borderRightWidth: '4px',
  borderRightStyle: 'solid',
  borderRightColor: accent,
  transition: 'background 0.2s, transform 0.15s',
});

const termTitleStyle: CSSProperties = {
  fontFamily: "'Cairo', sans-serif",
  fontSize: '20px',
  fontWeight: 800,
  color: 'var(--white)',
  marginBottom: '4px',
  lineHeight: 1.6,
};

const hebrewStyle: CSSProperties = {
  fontFamily: "'Noto Naskh Arabic', serif",
  fontSize: '15px',
  fontWeight: 400,
  color: 'var(--gray-3)',
  marginBottom: '10px',
  direction: 'rtl',
};

const definitionStyle: CSSProperties = {
  fontFamily: "'Noto Naskh Arabic', serif",
  fontSize: '16px',
  lineHeight: 2,
  color: 'rgba(255,255,255,0.85)',
  marginBottom: '12px',
};

const exampleBoxStyle = (accent: string): CSSProperties => ({
  background: `${accent}15`,
  borderRadius: 'var(--r)',
  padding: '12px 16px',
  display: 'flex',
  alignItems: 'flex-start',
  gap: '8px',
});

const exampleLabelStyle = (accent: string): CSSProperties => ({
  fontFamily: "'Cairo', sans-serif",
  fontSize: '13px',
  fontWeight: 700,
  color: accent,
  whiteSpace: 'nowrap',
  flexShrink: 0,
  marginTop: '2px',
});

const exampleTextStyle: CSSProperties = {
  fontFamily: "'Noto Naskh Arabic', serif",
  fontSize: '15px',
  lineHeight: 1.9,
  color: 'rgba(255,255,255,0.8)',
};

export default function TermCard({
  termAr,
  termHe,
  definition,
  example,
  accentColor = 'var(--gold)',
}: TermCardProps) {
  return (
    <div style={cardStyle(accentColor)}>
      <div style={termTitleStyle}>{termAr}</div>

      {termHe && (
        <div style={hebrewStyle}>[{termHe}]</div>
      )}

      <p style={definitionStyle}>{definition}</p>

      {example && (
        <div style={exampleBoxStyle(accentColor)}>
          <span style={exampleLabelStyle(accentColor)}>
            {'\uD83D\uDCA1'} مثال:
          </span>
          <span style={exampleTextStyle}>{example}</span>
        </div>
      )}
    </div>
  );
}
