import { useState, useEffect, useRef, type CSSProperties } from 'react';
import { highlightNumbers } from '../../utils/highlightNumbers';

interface StoryCardProps {
  title: string;
  text: string;
  onRead: () => void;
  highlight?: boolean;
  isFirst?: boolean;
}

// Number-to-Arabic-word table. Longer entries must come first to prevent
// a shorter pattern from matching inside a larger number (e.g. "33" in "330").
const NUMBER_WORDS: [RegExp, string][] = [
  [/(?<!\d)1000(?!\d)/g, 'ألف'],
  [/(?<!\d)330(?!\d)/g,  'ثلاثمائة وثلاثون'],
  [/(?<!\d)235(?!\d)/g,  'مائتين وخمسة وثلاثين'],
  [/(?<!\d)200(?!\d)/g,  'مئتان'],
  [/(?<!\d)100(?!\d)/g,  'مائة'],
  [/(?<!\d)55(?!\d)/g,   'خمسة وخمسون'],
  [/(?<!\d)50(?!\d)/g,   'خمسون'],
  [/(?<!\d)30(?!\d)/g,   'ثلاثون'],
  [/(?<!\d)20(?!\d)/g,   'عشرون'],
  [/(?<!\d)12(?!\d)/g,   'اثني عشر'],
  [/(?<!\d)10(?!\d)/g,   'عشرة'],
  [/(?<!\d)9(?!\d)/g,    'تسعة'],
  [/(?<!\d)8(?!\d)/g,    'ثمانية'],
  [/(?<!\d)7(?!\d)/g,    'سبعة'],
  [/(?<!\d)6(?!\d)/g,    'ستة'],
  [/(?<!\d)5(?!\d)/g,    'خمسة'],
  [/(?<!\d)4(?!\d)/g,    'أربعة'],
  [/(?<!\d)3(?!\d)/g,    'ثلاثة'],
  [/(?<!\d)2(?!\d)/g,    'اثنان'],
  [/(?<!\d)1(?!\d)/g,    'واحد'],
];

function prepareStoryForAudio(text: string): string {
  let result = text;

  // Separate attached preposition ب (with optional tatweel ـ) from digits so
  // ElevenLabs doesn't stumble on "بـ6" — must run before everything else.
  result = result.replace(/ب[ـ]*(\d)/g, 'ب $1');

  // Decimal numbers: replace the dot with فاصلة so ElevenLabs reads it clearly.
  // Specific values first (to control exact word form), then a general fallback
  // that inserts فاصلة so the number-to-word pass below converts each part.
  result = result.replace(/1\.8/g, 'واحد فاصلة ثمانية');
  result = result.replace(/1\.2/g, 'واحد فاصلة اثنين');
  result = result.replace(/(\d+)\.(\d+)/g, '$1 فاصلة $2');

  // Hard-coded formula fixes — run first so the digit sequences are consumed
  // before the number-to-word pass or the generic operator pass sees them.
  result = result.replace(/6\s*÷\s*330/g,   'ثلاثمائة وثلاثين على ستة');
  result = result.replace(/12\s*÷\s*1000/g, 'ألف على اثني عشر');

  // Replace remaining numbers with their spoken Arabic equivalents.
  for (const [pattern, word] of NUMBER_WORDS) {
    result = result.replace(pattern, word);
  }

  // Equals sign → يساوي (must run after number-to-word so digits are gone).
  result = result.replace(/=/g, ' يساوي ');

  // Any remaining ÷ → على (catches formulas not covered by the hard-coded list).
  result = result.replace(/÷/g, ' على ');

  // Currency symbol → Arabic word.
  result = result.replace(/(\d+)\s*₪/g, '$1 شيكل');
  result = result.replace(/₪\s*(\d+)/g, '$1 شيكل');
  result = result.replace(/₪/g, 'شيكل');

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

export default function StoryCard({ title, text, onRead, highlight = false, isFirst = false }: StoryCardProps) {
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
      const spokenText = isFirst ? prepareStoryForAudio(text) : text;
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
