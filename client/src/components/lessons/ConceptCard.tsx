import React, { useState, useEffect, useRef, type CSSProperties } from 'react';

interface ConceptCardProps {
  title: string;
  text: string;
  html?: string;
  onRead: () => void;
  highlight?: boolean;
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
  fontSize: '20px',
  fontWeight: 800,
  color: 'var(--green-lt)',
  marginBottom: '10px',
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
  fontFamily: "'IBM Plex Arabic', sans-serif",
};

const textStyle: CSSProperties = {
  fontSize: '19px',
  lineHeight: 2.1,
  color: 'rgba(255,255,255,0.88)',
  fontFamily: "'IBM Plex Arabic', sans-serif",
  whiteSpace: 'pre-wrap',
};

const htmlContainerStyle: CSSProperties = {
  ...textStyle,
  whiteSpace: 'normal',
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
  fontFamily: "'IBM Plex Arabic', sans-serif",
  fontSize: '17px',
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

const linkStyle: CSSProperties = {
  color: '#64B5F6',
  textDecoration: 'underline',
  wordBreak: 'break-all',
};

const numStyle: CSSProperties = {
  fontWeight: 800,
  color: '#4DF0A0',
};

const IS_NUM_HIGHLIGHT = /[\d₪%=+\-×÷]/;

// Split on URLs, ₪ amounts, percentages, math operators, and numbers — apply styles to each.
// No Arabic words or letters are ever included in a match.
function renderText(text: string, highlight: boolean): React.ReactNode {
  const parts = text.split(/(https?:\/\/\S+|www\.\S+|₪\s*\d[\d,.]*|\d[\d,.]*\s*₪|\d[\d,.]*\s*%|\d[\d,.]*|[=+\-×÷])/g);
  return parts.map((p, i) => {
    if (/^(https?:\/\/|www\.)/.test(p)) {
      const href = p.startsWith('http') ? p : `https://${p}`;
      return <a key={i} href={href} target="_blank" rel="noopener noreferrer" style={linkStyle}>{p}</a>;
    }
    if (highlight && IS_NUM_HIGHLIGHT.test(p)) {
      return <span key={i} style={numStyle}>{p}</span>;
    }
    return p;
  });
}

export default function ConceptCard({ title, text, html, onRead, highlight = false }: ConceptCardProps) {
  const [read, setRead] = useState(false);
  const htmlRef = useRef<HTMLDivElement>(null);

  // Wire up bill-flip on any img[data-note] rendered via dangerouslySetInnerHTML
  useEffect(() => {
    if (!htmlRef.current) return;
    const imgs = htmlRef.current.querySelectorAll<HTMLImageElement>('img[data-note]');
    const handlers: Array<{ el: HTMLElement; fn: () => void }> = [];

    imgs.forEach((img) => {
      const front = img.src;
      const back  = img.getAttribute('data-note-back') || '';
      if (!back) return;

      let showingFront = true;
      // The clickable parent is the .nl-row div wrapping the img
      const card = img.closest('[onclick]') as HTMLElement | null ?? img.parentElement as HTMLElement;

      const flip = () => {
        img.style.opacity = '0';
        img.style.transition = 'opacity 0.15s';
        setTimeout(() => {
          showingFront = !showingFront;
          img.src = showingFront ? front : back;
          img.style.opacity = '1';
        }, 150);
      };

      card.style.cursor = 'pointer';
      card.removeAttribute('onclick'); // prevent stale JS handler errors
      card.addEventListener('click', flip);
      handlers.push({ el: card, fn: flip });
    });

    return () => {
      handlers.forEach(({ el, fn }) => el.removeEventListener('click', fn));
    };
  }, [html]);

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
          ref={htmlRef}
          style={htmlContainerStyle}
          dangerouslySetInnerHTML={{ __html: html }}
        />
      ) : (
        <p style={textStyle}>{renderText(text, highlight)}</p>
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
