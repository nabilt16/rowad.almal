import type { CSSProperties } from 'react';

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}

const containerStyle: CSSProperties = {
  background: 'rgba(198, 40, 40, 0.08)',
  border: '1px solid rgba(198, 40, 40, 0.25)',
  borderRadius: 'var(--r)',
  padding: '24px',
  textAlign: 'center',
  direction: 'rtl',
  animation: 'fadeIn 0.3s ease',
};

const iconStyle: CSSProperties = {
  fontSize: '36px',
  marginBottom: '8px',
  lineHeight: 1,
};

const messageStyle: CSSProperties = {
  fontFamily: "'Cairo', sans-serif",
  fontSize: '15px',
  fontWeight: 600,
  color: 'var(--red)',
  marginBottom: '12px',
  lineHeight: 1.6,
};

const retryBtnStyle: CSSProperties = {
  display: 'inline-block',
  padding: '8px 24px',
  fontSize: '14px',
  fontWeight: 700,
  fontFamily: "'Cairo', sans-serif",
  background: 'var(--red)',
  color: 'var(--white)',
  border: 'none',
  borderRadius: 'var(--r)',
  cursor: 'pointer',
  transition: 'opacity 0.2s',
};

export default function ErrorMessage({ message, onRetry }: ErrorMessageProps) {
  return (
    <div style={containerStyle}>
      <div style={iconStyle}>{'\u26A0\uFE0F'}</div>
      <p style={messageStyle}>{message}</p>
      {onRetry && (
        <button
          type="button"
          style={retryBtnStyle}
          onClick={onRetry}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.opacity = '0.85';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.opacity = '1';
          }}
        >
          إعادة المحاولة
        </button>
      )}
    </div>
  );
}
