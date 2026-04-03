import type { CSSProperties } from 'react';

const overlayStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '40px',
  gap: '16px',
};

const spinnerStyle: CSSProperties = {
  width: '48px',
  height: '48px',
  border: '4px solid var(--gray-2)',
  borderTopColor: 'var(--gold)',
  borderRadius: '50%',
  animation: 'spin 0.8s linear infinite',
};

const textStyle: CSSProperties = {
  fontFamily: "'Cairo', sans-serif",
  fontSize: '16px',
  color: 'var(--gray-3)',
  fontWeight: 600,
};

interface LoadingSpinnerProps {
  text?: string;
  fullScreen?: boolean;
}

export default function LoadingSpinner({
  text = 'جارٍ التحميل...',
  fullScreen = false,
}: LoadingSpinnerProps) {
  const wrapperStyle: CSSProperties = fullScreen
    ? {
        ...overlayStyle,
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: 'rgba(11, 25, 41, 0.85)',
      }
    : overlayStyle;

  return (
    <div style={wrapperStyle}>
      <div style={spinnerStyle} />
      <span style={textStyle}>{text}</span>
    </div>
  );
}
