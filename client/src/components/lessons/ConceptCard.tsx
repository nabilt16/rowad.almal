import { useState, type CSSProperties } from 'react';

interface ConceptCardProps {
  title: string;
  text: string;
  html?: string;
  onRead: () => void;
}

const cardStyle: CSSProperties = {
  overflow: 'visible',
  background: 'rgba(46,125,50,0.12)',
  borderRight: '5px solid var(--green-lt)',
  borderRadius: 'var(--r)',
  padding: '20px 22px',
  marginBottom: '16px',
  animation: 'panelIn 0.3s ease',
};

const labelStyle: CSSProperties = {
  fontSize: '14px',
  fontWeight: 800,
  color: 'var(--green-lt)',
  marginBottom: '10px',
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
  fontFamily: "'Cairo', sans-serif",
};

const textStyle: CSSProperties = {
  fontSize: '19px',
  lineHeight: 2.1,
  color: 'rgba(255,255,255,0.88)',
  fontFamily: "'Noto Naskh Arabic', serif",
};

const htmlContainerStyle: CSSProperties = {
  ...textStyle,
};

const btnStyle: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '8px',
  marginTop: '16px',
  padding: '10px 24px',
  background: 'linear-gradient(135deg, var(--green), #1B5E20)',
  color: 'white',
  border: 'none',
  borderRadius: 'var(--r)',
  fontFamily: "'Cairo', sans-serif",
  fontSize: '15px',
  fontWeight: 700,
  cursor: 'pointer',
  transition: 'all 0.2s',
};

const btnDoneStyle: CSSProperties = {
  ...btnStyle,
  background: 'rgba(255,255,255,0.1)',
  color: 'var(--green-lt)',
  cursor: 'default',
};

export default function ConceptCard({ title, text, html, onRead }: ConceptCardProps) {
  const [read, setRead] = useState(false);

  const handleRead = () => {
    if (!read) {
      setRead(true);
      onRead();
    }
  };

  return (
    <div style={cardStyle}>
      <div style={labelStyle}>
        <span>{'\uD83D\uDCA1'}</span>
        <span>{title || 'المفهوم'}</span>
      </div>

      {html ? (
        <div
          style={htmlContainerStyle}
          dangerouslySetInnerHTML={{ __html: html }}
        />
      ) : (
        <p style={textStyle}>{text}</p>
      )}

      <button
        style={read ? btnDoneStyle : btnStyle}
        onClick={handleRead}
        disabled={read}
      >
        {read ? (
          <>
            <span>{'\u2714'}</span>
            تم الفهم
          </>
        ) : (
          <>
            <span>{'\uD83E\uDDE0'}</span>
            فهمت
          </>
        )}
      </button>
    </div>
  );
}
