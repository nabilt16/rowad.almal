import { useState, type CSSProperties } from 'react';

interface StoryCardProps {
  title: string;
  text: string;
  onRead: () => void;
}

const cardStyle: CSSProperties = {
  overflow: 'visible',
  background: 'rgba(249,168,37,0.08)',
  borderRight: '5px solid var(--gold)',
  borderRadius: 'var(--r)',
  padding: '20px 22px',
  marginBottom: '16px',
  animation: 'panelIn 0.3s ease',
};

const labelStyle: CSSProperties = {
  fontSize: '14px',
  fontWeight: 800,
  color: 'var(--gold)',
  marginBottom: '10px',
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
  fontFamily: "'Cairo', sans-serif",
  cursor: 'pointer',
  userSelect: 'none',
};

const textStyle: CSSProperties = {
  fontSize: '19px',
  lineHeight: 2.2,
  color: 'rgba(255,255,255,0.88)',
  fontFamily: "'Noto Naskh Arabic', serif",
};

const btnStyle: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '8px',
  marginTop: '16px',
  padding: '10px 24px',
  background: 'linear-gradient(135deg, var(--gold), #E65100)',
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

const chevronStyle = (expanded: boolean): CSSProperties => ({
  display: 'inline-block',
  transition: 'transform 0.25s ease',
  transform: expanded ? 'rotate(90deg)' : 'rotate(0deg)',
  fontSize: '11px',
});

export default function StoryCard({ title, text, onRead }: StoryCardProps) {
  const [expanded, setExpanded] = useState(true);
  const [read, setRead] = useState(false);

  const handleRead = () => {
    if (!read) {
      setRead(true);
      onRead();
    }
  };

  return (
    <div style={cardStyle}>
      <div style={labelStyle} onClick={() => setExpanded(!expanded)}>
        <span style={chevronStyle(expanded)}>&#9654;</span>
        <span>{'\uD83D\uDCD6'}</span>
        <span>{title || 'القصة'}</span>
      </div>

      {expanded && (
        <>
          <p style={textStyle}>{text}</p>
          <button
            style={read ? btnDoneStyle : btnStyle}
            onClick={handleRead}
            disabled={read}
          >
            {read ? (
              <>
                <span>{'\u2714'}</span>
                تمت القراءة
              </>
            ) : (
              <>
                <span>{'\uD83D\uDC40'}</span>
                قرأتها
              </>
            )}
          </button>
        </>
      )}
    </div>
  );
}
