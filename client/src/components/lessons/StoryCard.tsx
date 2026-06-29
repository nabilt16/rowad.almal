import { useState, useEffect, useRef, type CSSProperties } from 'react';
import { highlightNumbers } from '../../utils/highlightNumbers';

interface StoryCardProps {
  title: string;
  text: string;
  onRead: () => void;
  highlight?: boolean;
}

const BELOW_20 = [
  '', 'واحد', 'اثنان', 'ثلاثة', 'أربعة', 'خمسة', 'ستة', 'سبعة', 'ثمانية', 'تسعة',
  'عشرة', 'أحد عشر', 'اثنا عشر', 'ثلاثة عشر', 'أربعة عشر', 'خمسة عشر',
  'ستة عشر', 'سبعة عشر', 'ثمانية عشر', 'تسعة عشر',
];
const TENS  = ['', '', 'عشرون', 'ثلاثون', 'أربعون', 'خمسون', 'ستون', 'سبعون', 'ثمانون', 'تسعون'];
const H100S = ['', 'مائة', 'مئتان', 'ثلاثمائة', 'أربعمائة', 'خمسمائة', 'ستمائة', 'سبعمائة', 'ثمانمائة', 'تسعمائة'];

function toArabicWords(n: number): string {
  n = Math.floor(Math.abs(n));
  if (n === 0) return 'صفر';
  const parts: string[] = [];
  if (n >= 1000) {
    const th = Math.floor(n / 1000);
    n %= 1000;
    if (th === 1)      parts.push('ألف');
    else if (th === 2) parts.push('ألفان');
    else if (th <= 10) parts.push(BELOW_20[th] + ' آلاف');
    else               parts.push(toArabicWords(th) + ' ألف');
  }
  if (n >= 100) {
    parts.push(H100S[Math.floor(n / 100)]);
    n %= 100;
  }
  if (n >= 20) {
    const unit = n % 10;
    const ten  = Math.floor(n / 10);
    parts.push(unit > 0 ? BELOW_20[unit] + ' و' + TENS[ten] : TENS[ten]);
  } else if (n > 0) {
    parts.push(BELOW_20[n]);
  }
  return parts.join(' و');
}

function numToArabic(s: string): string {
  if (s.includes('.')) {
    const [intPart, decPart] = s.split('.');
    return toArabicWords(parseInt(intPart, 10)) + ' فاصلة ' + toArabicWords(parseInt(decPart, 10));
  }
  return toArabicWords(parseInt(s, 10));
}

function opToArabic(op: string): string {
  switch (op) {
    case '÷':                    return 'على';
    case '×': case 'x': case 'X': case '*': return 'ضرب';
    case '+':                    return 'زائد';
    case '-':                    return 'ناقص';
    default:                     return op;
  }
}

// In RTL text "A op B" is visually displayed as "B op A", so we swap operands
// so ElevenLabs reads them in the order the student sees on screen.
const NUM_PAT = '(\\d+(?:\\.\\d+)?)';
const OP_PAT  = '([÷×xX*+\\-])';
const FORMULA_EQ  = new RegExp(`${NUM_PAT}\\s*${OP_PAT}\\s*${NUM_PAT}\\s*=\\s*${NUM_PAT}`, 'g');
const FORMULA_BIN = new RegExp(`${NUM_PAT}\\s*${OP_PAT}\\s*${NUM_PAT}`, 'g');

function prepareStoryForAudio(text: string): string {
  let result = text;

  // Word-specific diacritic fixes to force correct TTS pronunciation.
  result = result.replace(/شعرت/g, 'شَعَرَت');

  // Separate attached preposition ب (with optional tatweel ـ) from digits.
  result = result.replace(/ب[ـ]*(\d)/g, 'ب $1');

  // Full equations: A op B = C → reverse operands for RTL reading.
  result = result.replace(FORMULA_EQ, (_m, a, op, b, c) =>
    `${numToArabic(b)} ${opToArabic(op)} ${numToArabic(a)} يساوي ${numToArabic(c)}`
  );

  // Simple binary formulas: A op B → reverse for RTL reading.
  result = result.replace(FORMULA_BIN, (_m, a, op, b) =>
    `${numToArabic(b)} ${opToArabic(op)} ${numToArabic(a)}`
  );

  // Currency: convert amount then append شيكل.
  result = result.replace(/(\d+(?:\.\d+)?)\s*₪/g, (_m, n) => numToArabic(n) + ' شيكل');
  result = result.replace(/₪\s*(\d+(?:\.\d+)?)/g, (_m, n) => numToArabic(n) + ' شيكل');
  result = result.replace(/₪/g, 'شيكل');

  // Convert any remaining numbers to Arabic words.
  result = result.replace(/\d+(?:\.\d+)?/g, (m) => numToArabic(m));

  // Clean up any raw operators that survived.
  result = result.replace(/÷/g, ' على ');
  result = result.replace(/[×xX*]/g, ' ضرب ');
  result = result.replace(/=/g, ' يساوي ');

  return result;
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

const headerRowStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: '10px',
};

const labelStyle: CSSProperties = {
  fontSize: '20px',
  fontWeight: 800,
  color: 'var(--gold)',
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
  fontFamily: "'IBM Plex Arabic', sans-serif",
  cursor: 'pointer',
  userSelect: 'none',
};

const textStyle: CSSProperties = {
  fontSize: '19px',
  lineHeight: 2.2,
  color: 'rgba(255,255,255,0.88)',
  fontFamily: "'IBM Plex Arabic', sans-serif",
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

const audioBtnStyle = (playing: boolean, loading: boolean): CSSProperties => ({
  display: 'inline-flex',
  alignItems: 'center',
  gap: '5px',
  padding: '5px 12px',
  background: playing ? 'rgba(249,168,37,0.25)' : 'rgba(255,255,255,0.08)',
  color: playing ? 'var(--gold)' : loading ? 'rgba(255,255,255,0.4)' : 'rgba(255,255,255,0.65)',
  border: `1px solid ${playing ? 'var(--gold)' : 'rgba(255,255,255,0.15)'}`,
  borderRadius: '20px',
  fontFamily: "'IBM Plex Arabic', sans-serif",
  fontSize: '13px',
  fontWeight: 600,
  cursor: loading ? 'wait' : 'pointer',
  transition: 'all 0.2s',
  whiteSpace: 'nowrap',
  flexShrink: 0,
  opacity: loading ? 0.7 : 1,
});

const chevronStyle = (expanded: boolean): CSSProperties => ({
  display: 'inline-block',
  transition: 'transform 0.25s ease',
  transform: expanded ? 'rotate(90deg)' : 'rotate(0deg)',
  fontSize: '11px',
});

export default function StoryCard({ title, text, onRead, highlight = false }: StoryCardProps) {
  const [expanded, setExpanded] = useState(true);
  const [read, setRead] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [loading, setLoading] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const blobUrlRef = useRef<string | null>(null);

  // Cleanup audio on unmount
  useEffect(() => {
    return () => {
      audioRef.current?.pause();
      if (blobUrlRef.current) URL.revokeObjectURL(blobUrlRef.current);
    };
  }, []);

  // Pause when card collapses
  useEffect(() => {
    if (!expanded) {
      audioRef.current?.pause();
      setPlaying(false);
    }
  }, [expanded]);

  const handleSpeak = async () => {
    // If already playing → pause (keep position)
    if (playing) {
      audioRef.current?.pause();
      setPlaying(false);
      return;
    }

    // If paused mid-way → resume from current position
    if (audioRef.current && blobUrlRef.current) {
      audioRef.current.play().catch(console.error);
      setPlaying(true);
      return;
    }

    // Fetch audio from backend TTS proxy
    setLoading(true);
    try {
      const spokenText = prepareStoryForAudio(text);
      const response = await fetch('http://localhost:3001/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: spokenText }),
      });
      if (!response.ok) throw new Error(`TTS fetch failed: ${response.status}`);

      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      blobUrlRef.current = blobUrl;

      const audio = new Audio(blobUrl);
      audio.onended = () => { audio.currentTime = 0; setPlaying(false); };
      audio.onerror = () => { setPlaying(false); setLoading(false); };
      audioRef.current = audio;

      await audio.play();
      setPlaying(true);
    } catch (err) {
      console.error('[TTS] error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRead = () => {
    if (!read) { setRead(true); onRead(); }
  };

  const btnLabel = loading ? '⏳ جاري التحميل...' : playing ? '⏸️ إيقاف' : '🔊 استمع للقصة';

  return (
    <div style={cardStyle}>
      <div style={headerRowStyle}>
        <div style={labelStyle} onClick={() => setExpanded(!expanded)}>
          <span style={chevronStyle(expanded)}>&#9654;</span>
          <span>{'\uD83D\uDCD6'}</span>
          <span>{title || 'القصة'}</span>
        </div>

        <button
          style={audioBtnStyle(playing, loading)}
          onClick={handleSpeak}
          disabled={loading}
          title="استمع للقصة"
        >
          {btnLabel}
        </button>
      </div>

      {expanded && (
        <>
          <p style={textStyle}>{highlight ? highlightNumbers(text) : text}</p>
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
