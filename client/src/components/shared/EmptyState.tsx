import type { CSSProperties } from 'react';

interface EmptyStateProps {
  icon: string;
  title: string;
  description: string;
}

const containerStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '48px 24px',
  textAlign: 'center',
  direction: 'rtl',
  animation: 'fadeIn 0.4s ease',
};

const iconStyle: CSSProperties = {
  fontSize: '56px',
  marginBottom: '16px',
  lineHeight: 1,
};

const titleStyle: CSSProperties = {
  fontFamily: "'Cairo', sans-serif",
  fontSize: '20px',
  fontWeight: 700,
  color: 'var(--white)',
  marginBottom: '8px',
};

const descriptionStyle: CSSProperties = {
  fontFamily: "'IBM Plex Arabic', sans-serif",
  fontSize: '15px',
  color: 'var(--gray-3)',
  maxWidth: '360px',
  lineHeight: 1.7,
};

export default function EmptyState({ icon, title, description }: EmptyStateProps) {
  return (
    <div style={containerStyle}>
      <div style={iconStyle}>{icon}</div>
      <h3 style={titleStyle}>{title}</h3>
      <p style={descriptionStyle}>{description}</p>
    </div>
  );
}
