import { useState, type CSSProperties } from 'react';

/* ─────────────────────────────────────────────
   Data
───────────────────────────────────────────── */

interface Product {
  nameAr: string;
  emoji: string;
  price: number;
  detail: string;       // shown on the card (e.g. "400ml", "يدوم سنة")
  unitLabel: string;    // unit for comparison display (e.g. "لكل ml", "لكل شهر")
  unitCost: number;     // computed cost per unit (for picking the winner)
  unitDisplay: string;  // formatted string shown in explanation
}

interface Round {
  question: string;     // what to compare
  a: Product;
  b: Product;
  winner: 'a' | 'b';   // which is truly better value
  explanation: string;  // shown after answer
}

const ROUNDS: Round[] = [
  {
    question: 'أي شامبو أوفر للشراء؟',
    a: {
      nameAr: 'شامبو كبير',
      emoji: '🧴',
      price: 24,
      detail: '400ml',
      unitLabel: 'لكل 100ml',
      unitCost: 24 / 4,
      unitDisplay: '6 ₪ / 100ml',
    },
    b: {
      nameAr: 'شامبو صغير',
      emoji: '🧴',
      price: 14,
      detail: '200ml',
      unitLabel: 'لكل 100ml',
      unitCost: 14 / 2,
      unitDisplay: '7 ₪ / 100ml',
    },
    winner: 'a',
    explanation: 'الشامبو الكبير بيكلّف 6 ₪ لكل 100ml، بينما الصغير 7 ₪ — الحجم الكبير أوفر!',
  },
  {
    question: 'أي حذاء أوفر على المدى البعيد؟',
    a: {
      nameAr: 'حذاء ماركة',
      emoji: '👟',
      price: 180,
      detail: 'يدوم سنة',
      unitLabel: 'لكل شهر',
      unitCost: 180 / 12,
      unitDisplay: '15 ₪ / شهر',
    },
    b: {
      nameAr: 'حذاء عادي',
      emoji: '👞',
      price: 60,
      detail: 'يدوم 4 أشهر',
      unitLabel: 'لكل شهر',
      unitCost: 60 / 4,
      unitDisplay: '15 ₪ / شهر',
    },
    winner: 'a',   // same per-month cost but brand lasts and b needs 3 purchases/year = 180 ₪ total
    explanation: 'الحذاء العادي تحتاج 3 منه في السنة = 180 ₪! السعر السنوي متساوي — لكن الماركة أوفر لأنها أقل إزعاجاً وأقل شراء.',
  },
  {
    question: 'أي اشتراك أوفر؟',
    a: {
      nameAr: 'اشتراك شهري',
      emoji: '📅',
      price: 15,
      detail: '₪ / شهر',
      unitLabel: 'لكل شهر',
      unitCost: 15,
      unitDisplay: '15 ₪ / شهر',
    },
    b: {
      nameAr: 'اشتراك سنوي',
      emoji: '📆',
      price: 120,
      detail: '₪ / سنة',
      unitLabel: 'لكل شهر',
      unitCost: 120 / 12,
      unitDisplay: '10 ₪ / شهر',
    },
    winner: 'b',
    explanation: 'الاشتراك الشهري = 15×12 = 180 ₪ في السنة. الاشتراك السنوي = 120 ₪ فقط — قجة 60 ₪!',
  },
];

/* ─────────────────────────────────────────────
   Props
───────────────────────────────────────────── */

interface ValueCompareSimulationProps {
  onComplete: () => void;
  personalBudget?: number;
}

/* ─────────────────────────────────────────────
   Styles
───────────────────────────────────────────── */

const wrapStyle: CSSProperties = {
  background: 'rgba(255,255,255,0.06)',
  borderRadius: 'var(--r-lg)',
  padding: '24px',
  border: '1px solid rgba(255,255,255,0.11)',
  direction: 'rtl',
  animation: 'panelIn 0.3s ease',
};

const headingStyle: CSSProperties = {
  fontFamily: "'IBM Plex Arabic', sans-serif",
  fontSize: '20px',
  fontWeight: 800,
  color: 'white',
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  marginBottom: '4px',
};

const subStyle: CSSProperties = {
  fontFamily: "'IBM Plex Arabic', sans-serif",
  fontSize: '18px',
  fontWeight: 600,
  color: '#FFFFFF',
  lineHeight: 1.6,
  marginBottom: '20px',
};

const questionStyle: CSSProperties = {
  fontFamily: "'IBM Plex Arabic', sans-serif",
  fontSize: '17px',
  fontWeight: 800,
  color: 'white',
  textAlign: 'center',
  marginBottom: '18px',
};

const productCardStyle = (selected: 'none' | 'this' | 'other', correct: boolean | null): CSSProperties => {
  if (selected === 'none') return {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '8px',
    padding: '20px 12px',
    borderRadius: 'var(--r)',
    border: '2px solid rgba(255,255,255,0.12)',
    background: 'rgba(255,255,255,0.05)',
    cursor: 'pointer',
    transition: 'all 0.18s',
    textAlign: 'center',
  };
  const isSelected = selected === 'this';
  const borderColor = isSelected
    ? (correct ? 'rgba(102,187,106,0.8)' : 'rgba(239,83,80,0.8)')
    : 'rgba(255,255,255,0.08)';
  const bg = isSelected
    ? (correct ? 'rgba(46,125,50,0.2)' : 'rgba(183,28,28,0.2)')
    : 'rgba(255,255,255,0.02)';
  return {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '8px',
    padding: '20px 12px',
    borderRadius: 'var(--r)',
    border: `2px solid ${borderColor}`,
    background: bg,
    cursor: 'default',
    transition: 'all 0.25s',
    textAlign: 'center',
    opacity: selected === 'other' ? 0.45 : 1,
  };
};

const feedbackStyle = (correct: boolean): CSSProperties => ({
  borderRadius: 'var(--r)',
  padding: '14px 16px',
  marginTop: '16px',
  fontFamily: "'IBM Plex Arabic', sans-serif",
  fontSize: '14px',
  lineHeight: 1.7,
  color: correct ? '#A5D6A7' : '#FFD54F',
  background: correct ? 'rgba(46,125,50,0.15)' : 'rgba(255,193,7,0.1)',
  border: correct ? '1px solid rgba(102,187,106,0.3)' : '1px solid rgba(255,193,7,0.25)',
  animation: 'popIn 0.35s cubic-bezier(0.34,1.56,0.64,1)',
});

const nextBtnStyle: CSSProperties = {
  width: '100%',
  padding: '13px',
  marginTop: '14px',
  borderRadius: 'var(--r)',
  background: 'linear-gradient(135deg, #FFB300, #E65100)',
  color: 'white',
  fontFamily: "'IBM Plex Arabic', sans-serif",
  fontSize: '16px',
  fontWeight: 800,
  border: 'none',
  cursor: 'pointer',
};

const retryBtnStyle: CSSProperties = {
  flex: 1,
  padding: '12px',
  borderRadius: 'var(--r)',
  background: 'rgba(255,255,255,0.08)',
  border: '1px solid rgba(255,255,255,0.15)',
  color: 'rgba(255,255,255,0.7)',
  fontFamily: "'IBM Plex Arabic', sans-serif",
  fontSize: '15px',
  fontWeight: 700,
  cursor: 'pointer',
};

const completeBtnStyle: CSSProperties = {
  width: '100%',
  padding: '13px',
  borderRadius: 'var(--r)',
  background: 'linear-gradient(135deg, var(--green), #1B5E20)',
  color: 'white',
  fontFamily: "'IBM Plex Arabic', sans-serif",
  fontSize: '16px',
  fontWeight: 800,
  border: 'none',
  cursor: 'pointer',
  marginTop: '10px',
};

/* ─────────────────────────────────────────────
   Component
───────────────────────────────────────────── */

// personalBudget accepted for API consistency
export default function ValueCompareSimulation({ onComplete }: ValueCompareSimulationProps) {
  const [roundIndex, setRoundIndex]   = useState(0);
  const [chosen, setChosen]           = useState<'a' | 'b' | null>(null);
  const [scores, setScores]           = useState<boolean[]>([]);
  const [phase, setPhase]             = useState<'playing' | 'results'>('playing');
  const [done, setDone]               = useState(false);

  const round = ROUNDS[roundIndex];
  const isCorrect = chosen !== null ? chosen === round.winner : null;

  const handleChoose = (choice: 'a' | 'b') => {
    if (chosen !== null) return;
    setChosen(choice);
    setScores(prev => [...prev, choice === round.winner]);
  };

  const handleNext = () => {
    if (roundIndex < ROUNDS.length - 1) {
      setRoundIndex(i => i + 1);
      setChosen(null);
    } else {
      setPhase('results');
    }
  };

  const handleRetry = () => {
    setRoundIndex(0);
    setChosen(null);
    setScores([]);
    setPhase('playing');
    setDone(false);
  };

  const handleComplete = () => {
    setDone(true);
    onComplete();
  };

  /* ─────── PLAYING PHASE ─────── */
  if (phase === 'playing') {
    return (
      <div style={wrapStyle}>
        <div style={headingStyle}><span>🎮</span> جرّب بنفسك — أيهما أوفر؟</div>
        <div style={subStyle}>
          قارن بين منتجين واختار الأوفر — مش دايماً الأرخص هو الأفضل!
        </div>

        {/* Progress dots */}
        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginBottom: '20px' }}>
          {ROUNDS.map((_, i) => (
            <div key={i} style={{
              width: '10px',
              height: '10px',
              borderRadius: '50%',
              background: i < roundIndex
                ? (scores[i] ? 'var(--green-lt)' : '#EF9A9A')
                : i === roundIndex
                  ? '#FFD54F'
                  : 'rgba(255,255,255,0.15)',
              transition: 'background 0.3s',
            }} />
          ))}
        </div>

        <div style={questionStyle}>{round.question}</div>

        {/* Product cards */}
        <div style={{ display: 'flex', gap: '12px', marginBottom: '4px' }}>
          {(['a', 'b'] as const).map(key => {
            const product = round[key];
            const sel: 'none' | 'this' | 'other' =
              chosen === null ? 'none' : chosen === key ? 'this' : 'other';
            return (
              <button
                key={key}
                style={productCardStyle(sel, isCorrect)}
                onClick={() => handleChoose(key)}
                disabled={chosen !== null}
              >
                <span style={{ fontSize: '36px' }}>{product.emoji}</span>
                <div style={{
                  fontFamily: "'IBM Plex Arabic', sans-serif",
                  fontSize: '18px',
                  fontWeight: 800,
                  color: '#FFFFFF',
                }}>
                  {product.nameAr}
                </div>
                <div style={{
                  fontFamily: "'IBM Plex Arabic', sans-serif",
                  fontSize: '22px',
                  fontWeight: 900,
                  color: '#00ff88',
                }}>
                  {product.price} ₪
                </div>
                <div style={{
                  fontFamily: "'IBM Plex Arabic', sans-serif",
                  fontSize: '15px',
                  color: '#E0E0E0',
                }}>
                  {product.detail}
                </div>
                {/* Reveal unit cost after answer */}
                {chosen !== null && (
                  <div style={{
                    fontFamily: "'IBM Plex Arabic', sans-serif",
                    fontSize: '12px',
                    fontWeight: 700,
                    color: key === round.winner ? '#A5D6A7' : 'rgba(255,255,255,0.4)',
                    marginTop: '4px',
                    padding: '3px 8px',
                    borderRadius: '8px',
                    background: key === round.winner ? 'rgba(102,187,106,0.15)' : 'transparent',
                  }}>
                    {product.unitDisplay}
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Feedback */}
        {chosen !== null && isCorrect !== null && (
          <>
            <div style={feedbackStyle(isCorrect)}>
              <strong>{isCorrect ? 'صح! 🎉' : 'مش دايماً الأرخص هو الأوفر 💡'}</strong>
              <div style={{ marginTop: '6px', fontWeight: 400 }}>{round.explanation}</div>
            </div>
            <button style={nextBtnStyle} onClick={handleNext}>
              {roundIndex < ROUNDS.length - 1 ? 'السؤال التالي ←' : 'شوف نتيجتك 🏁'}
            </button>
          </>
        )}
      </div>
    );
  }

  /* ─────── RESULTS PHASE ─────── */
  const score = scores.filter(Boolean).length;
  const verdictMsg =
    score === 3 ? 'أنت مستهلك ذكي! 🏆' :
    score === 2 ? 'كتير كويس — بس في واحدة راحت منك 💪' :
                  'المقارنة صعبة — جرّب مرة ثانية 🔄';
  const verdictGood = score >= 2;

  return (
    <div style={wrapStyle}>
      <div style={{
        fontFamily: "'IBM Plex Arabic', sans-serif",
        fontSize: '21px',
        fontWeight: 900,
        color: 'white',
        textAlign: 'center',
        marginBottom: '20px',
      }}>
        🏁 نتيجتك
      </div>

      {/* Score display */}
      <div style={{
        borderRadius: 'var(--r)',
        padding: '22px 16px',
        marginBottom: '18px',
        textAlign: 'center',
        animation: 'popIn 0.5s cubic-bezier(0.34,1.56,0.64,1)',
        ...(verdictGood ? {
          background: 'rgba(46,125,50,0.15)',
          border: '1px solid rgba(102,187,106,0.3)',
          color: '#A5D6A7',
        } : {
          background: 'rgba(255,193,7,0.08)',
          border: '1px solid rgba(255,193,7,0.2)',
          color: '#FFD54F',
        }),
      }}>
        <div style={{ fontSize: '48px', fontWeight: 900, marginBottom: '6px' }}>
          {score} / {ROUNDS.length}
        </div>
        <div style={{ fontFamily: "'IBM Plex Arabic', sans-serif", fontSize: '18px', fontWeight: 800 }}>
          {verdictMsg}
        </div>
      </div>

      {/* Round-by-round breakdown */}
      <div style={{ marginBottom: '18px' }}>
        {ROUNDS.map((r, i) => (
          <div key={i} style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '10px',
            padding: '12px 14px',
            borderRadius: 'var(--r)',
            marginBottom: '6px',
            fontFamily: "'IBM Plex Arabic', sans-serif",
            fontSize: '13px',
            background: scores[i] ? 'rgba(46,125,50,0.08)' : 'rgba(183,28,28,0.08)',
            border: `1px solid ${scores[i] ? 'rgba(102,187,106,0.2)' : 'rgba(239,83,80,0.2)'}`,
          }}>
            <span style={{ fontSize: '16px', flexShrink: 0 }}>{scores[i] ? '✅' : '❌'}</span>
            <div>
              <div style={{ fontWeight: 700, color: 'rgba(255,255,255,0.85)', marginBottom: '3px' }}>
                {r.question}
              </div>
              <div style={{ color: 'rgba(255,255,255,0.45)', lineHeight: 1.5 }}>
                {r.explanation}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Buttons */}
      <div style={{ display: 'flex', gap: '10px' }}>
        <button style={retryBtnStyle} onClick={handleRetry}>
          🔄 جرّب مرة ثانية
        </button>
      </div>
      <button
        style={{ ...completeBtnStyle, opacity: done ? 0.6 : 1, cursor: done ? 'default' : 'pointer' }}
        onClick={handleComplete}
        disabled={done}
      >
        {done ? '✔ أكملت النشاط' : '✅ أكملت النشاط'}
      </button>
    </div>
  );
}
