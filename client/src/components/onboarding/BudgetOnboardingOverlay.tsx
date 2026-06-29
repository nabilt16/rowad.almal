import { useState, type CSSProperties } from 'react';
import { useUIStore } from '../../stores/uiStore';
import { confettiBurst } from '../../utils/confetti';

/* ─────────────────────────────────────────────
   Props
───────────────────────────────────────────── */

interface BudgetOnboardingOverlayProps {
  onComplete: () => void;
}

/* ─────────────────────────────────────────────
   Styles (same dark-card language as the app)
───────────────────────────────────────────── */

const backdropStyle: CSSProperties = {
  position: 'fixed',
  inset: 0,
  zIndex: 9999,
  background: 'rgba(11, 25, 41, 0.92)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '20px',
  animation: 'fadeIn 0.4s ease',
};

const cardStyle: CSSProperties = {
  background: 'rgba(255,255,255,0.07)',
  backdropFilter: 'blur(20px)',
  borderRadius: 'var(--r-lg)',
  padding: '36px 32px 32px',
  width: '100%',
  maxWidth: '440px',
  border: '1px solid rgba(255,255,255,0.12)',
  boxShadow: '0 24px 64px rgba(0,0,0,0.5)',
  animation: 'popIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
  direction: 'rtl',
};

const coinStyle: CSSProperties = {
  textAlign: 'center',
  fontSize: '52px',
  marginBottom: '12px',
  animation: 'popIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
};

const titleStyle: CSSProperties = {
  fontFamily: "'IBM Plex Arabic', sans-serif",
  fontSize: '22px',
  fontWeight: 900,
  color: 'white',
  textAlign: 'center',
  marginBottom: '20px',
};

const questionStyle: CSSProperties = {
  fontFamily: "'IBM Plex Arabic', sans-serif",
  fontSize: '20px',
  fontWeight: 800,
  color: 'rgba(255,255,255,0.95)',
  textAlign: 'center',
  marginBottom: '8px',
};

const hintStyle: CSSProperties = {
  fontFamily: "'IBM Plex Arabic', sans-serif",
  fontSize: '18px',
  fontWeight: 500,
  color: 'rgba(255,255,255,0.85)',
  textAlign: 'center',
  marginBottom: '24px',
};

const sliderRowStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  marginBottom: '8px',
};

const sliderStyle: CSSProperties = {
  flex: 1,
  height: '8px',
  cursor: 'pointer',
  accentColor: '#FFB300',
};

const budgetDisplayStyle: CSSProperties = {
  fontFamily: "'IBM Plex Arabic', sans-serif",
  fontSize: '36px',
  fontWeight: 900,
  color: '#FFD54F',
  textAlign: 'center',
  marginBottom: '4px',
  transition: 'all 0.15s',
};

const rangeLabelsStyle: CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  fontFamily: "'IBM Plex Arabic', sans-serif",
  fontSize: '16px',
  fontWeight: 600,
  color: 'rgba(255,255,255,0.75)',
  marginBottom: '24px',
};

const noteStyle: CSSProperties = {
  fontFamily: "'IBM Plex Arabic', sans-serif",
  fontSize: '17px',
  fontWeight: 800,
  color: '#FFD54F',
  textAlign: 'center',
  lineHeight: 1.7,
  marginBottom: '24px',
  padding: '10px 12px',
  background: 'rgba(255,255,255,0.03)',
  borderRadius: 'var(--r)',
  border: '1px solid rgba(255,255,255,0.06)',
};

const primaryBtnStyle: CSSProperties = {
  width: '100%',
  padding: '15px',
  fontSize: '18px',
  fontWeight: 800,
  fontFamily: "'IBM Plex Arabic', sans-serif",
  background: 'linear-gradient(135deg, #FFB300, #E65100)',
  color: 'white',
  border: 'none',
  borderRadius: 'var(--r)',
  cursor: 'pointer',
  boxShadow: '0 4px 16px rgba(255,179,0,0.3)',
  transition: 'opacity 0.2s',
};

/* Split screen */
const splitCardStyle: CSSProperties = {
  borderRadius: 'var(--r)',
  padding: '16px',
  marginBottom: '10px',
  display: 'flex',
  alignItems: 'center',
  gap: '14px',
};

const splitAmountStyle: CSSProperties = {
  fontFamily: "'IBM Plex Arabic', sans-serif",
  fontSize: '24px',
  fontWeight: 900,
  flexShrink: 0,
  width: '70px',
  textAlign: 'center',
};

const splitLabelStyle: CSSProperties = {
  fontFamily: "'IBM Plex Arabic', sans-serif",
  fontSize: '15px',
  fontWeight: 700,
  flex: 1,
};

const splitPctStyle: CSSProperties = {
  fontFamily: "'IBM Plex Arabic', sans-serif",
  fontSize: '12px',
  color: 'rgba(255,255,255,0.4)',
  flexShrink: 0,
};

const startBtnStyle: CSSProperties = {
  width: '100%',
  padding: '16px',
  fontSize: '19px',
  fontWeight: 800,
  fontFamily: "'IBM Plex Arabic', sans-serif",
  background: 'linear-gradient(135deg, var(--green), #1B5E20)',
  color: 'white',
  border: 'none',
  borderRadius: 'var(--r)',
  cursor: 'pointer',
  boxShadow: '0 4px 16px rgba(46,125,50,0.35)',
  marginTop: '8px',
};

/* ─────────────────────────────────────────────
   Component
───────────────────────────────────────────── */

export default function BudgetOnboardingOverlay({ onComplete }: BudgetOnboardingOverlayProps) {
  const [screen, setScreen]   = useState<1 | 2 | 3>(1);
  const [budget, setBudget]   = useState(50);
  const [dreamName, setDreamName] = useState('');
  const [dreamCost, setDreamCost] = useState(200);
  const setPersonalBudget     = useUIStore(s => s.setPersonalBudget);
  const setDream              = useUIStore(s => s.setDream);

  const needs  = Math.round(budget * 0.5);
  const wants  = Math.round(budget * 0.3);
  const saving = budget - needs - wants;   // remainder to avoid rounding drift

  const handleNext = () => {
    setScreen(2);
    setTimeout(confettiBurst, 300);
  };

  const handleGoToDream = () => {
    setScreen(3);
  };

  const handleStart = () => {
    setPersonalBudget(budget);
    if (dreamName.trim()) {
      setDream(dreamName.trim(), dreamCost);
    }
    onComplete();
  };

  /* ── Screen 1 ── */
  if (screen === 1) {
    return (
      <div style={backdropStyle}>
        <div style={cardStyle}>
          <div style={coinStyle}>🪙</div>
          <div style={titleStyle}>سؤال واحد قبل ما نبدأ 🪙</div>

          <div style={questionStyle}>فكّر: إيش بتحتاج مصروف كل أسبوع؟</div>
          <div style={hintStyle}>أكل، مواصلات، وشي صغير لحالك</div>

          <div style={budgetDisplayStyle}>{budget} ₪</div>

          <div style={sliderRowStyle}>
            <span style={{ fontFamily: "'IBM Plex Arabic', sans-serif", fontSize: '16px', fontWeight: 600, color: 'rgba(255,255,255,0.75)' }}>10</span>
            <input
              type="range"
              min={10}
              max={100}
              step={5}
              value={budget}
              onChange={e => setBudget(Number(e.target.value))}
              style={sliderStyle}
            />
            <span style={{ fontFamily: "'IBM Plex Arabic', sans-serif", fontSize: '16px', fontWeight: 600, color: 'rgba(255,255,255,0.75)' }}>100</span>
          </div>

          <div style={rangeLabelsStyle}>
            <span>10 ₪</span>
            <span>100 ₪</span>
          </div>

          <div style={noteStyle}>
            الفلوس مش بتيجي من الهوا — أهاليكم بيشتغلوا كتير عشانها 💙
          </div>

          <button style={primaryBtnStyle} onClick={handleNext}>
            هيا نحسب
          </button>
        </div>
      </div>
    );
  }

  /* ── Screen 2 ── */
  if (screen === 2) return (
    <div style={backdropStyle}>
      <div style={cardStyle}>
        <div style={titleStyle}>توزيع {budget} ₪ الأسبوعية 📊</div>

        {/* 50% — needs */}
        <div style={{
          ...splitCardStyle,
          background: 'rgba(46,125,50,0.15)',
          border: '1px solid rgba(102,187,106,0.25)',
        }}>
          <div style={{ ...splitAmountStyle, color: '#A5D6A7' }}>{needs} ₪</div>
          <div style={splitLabelStyle}>
            <div style={{ color: '#A5D6A7', marginBottom: '2px' }}>💚 مصاريفك الأساسية</div>
            <div style={{ fontFamily: "'IBM Plex Arabic', sans-serif", fontSize: '12px', color: 'rgba(255,255,255,0.4)', fontWeight: 400 }}>
              أكل، مواصلات، احتياجاتك اليومية
            </div>
          </div>
          <div style={splitPctStyle}>50%</div>
        </div>

        {/* 30% — wants */}
        <div style={{
          ...splitCardStyle,
          background: 'rgba(249,168,37,0.1)',
          border: '1px solid rgba(249,168,37,0.22)',
        }}>
          <div style={{ ...splitAmountStyle, color: '#FFD54F' }}>{wants} ₪</div>
          <div style={splitLabelStyle}>
            <div style={{ color: '#FFD54F', marginBottom: '2px' }}>💛 شي بتحبه لحالك</div>
            <div style={{ fontFamily: "'IBM Plex Arabic', sans-serif", fontSize: '12px', color: 'rgba(255,255,255,0.4)', fontWeight: 400 }}>
              لعبة، كتاب، متعة صغيرة
            </div>
          </div>
          <div style={splitPctStyle}>30%</div>
        </div>

        {/* 20% — saving */}
        <div style={{
          ...splitCardStyle,
          background: 'rgba(33,150,243,0.1)',
          border: '1px solid rgba(100,181,246,0.22)',
        }}>
          <div style={{ ...splitAmountStyle, color: '#90CAF9' }}>{saving} ₪</div>
          <div style={splitLabelStyle}>
            <div style={{ color: '#90CAF9', marginBottom: '2px' }}>❤️ توفير أو إعطاء</div>
            <div style={{ fontFamily: "'IBM Plex Arabic', sans-serif", fontSize: '12px', color: 'rgba(255,255,255,0.4)', fontWeight: 400 }}>
              لهدف تحلم فيه أو لتساعد غيرك
            </div>
          </div>
          <div style={splitPctStyle}>20%</div>
        </div>

        <button style={startBtnStyle} onClick={handleGoToDream}>
          هيا نبدأ! 💪
        </button>
      </div>
    </div>
  );

  /* ── Screen 3 — Dream ── */
  return (
    <div style={backdropStyle}>
      <div style={cardStyle}>
        <div style={coinStyle}>🌟</div>
        <div style={titleStyle}>شو حلمك المالي؟ 🌟</div>
        <div style={hintStyle}>إيش بدك تشتري أو تحقق بالفلوس اللي رح توفّرها؟</div>

        {/* Dream name input */}
        <div style={{ marginBottom: '18px' }}>
          <input
            type="text"
            placeholder="اكتب حلمك هون... (دراجة، تلفون، رحلة)"
            value={dreamName}
            onChange={e => setDreamName(e.target.value)}
            maxLength={60}
            style={{
              width: '100%',
              padding: '14px 16px',
              borderRadius: 'var(--r)',
              border: '1.5px solid rgba(255,255,255,0.15)',
              background: 'rgba(255,255,255,0.06)',
              color: 'white',
              fontFamily: "'IBM Plex Arabic', sans-serif",
              fontSize: '18px',
              outline: 'none',
              direction: 'rtl',
              boxSizing: 'border-box',
            }}
          />
        </div>

        {/* Dream cost */}
        <div style={{ marginBottom: '6px' }}>
          <div style={{ ...questionStyle, marginBottom: '10px' }}>
            كم بتتوقع يكلّف؟
          </div>
          <div style={budgetDisplayStyle}>{dreamCost} ₪</div>
          <div style={sliderRowStyle}>
            <span style={{ fontFamily: "'IBM Plex Arabic', sans-serif", fontSize: '16px', fontWeight: 600, color: 'rgba(255,255,255,0.75)' }}>2000</span>
            <input
              type="range"
              min={50}
              max={2000}
              step={50}
              value={dreamCost}
              onChange={e => setDreamCost(Number(e.target.value))}
              style={{ ...sliderStyle, transform: 'scaleX(-1)' }}
            />
            <span style={{ fontFamily: "'IBM Plex Arabic', sans-serif", fontSize: '16px', fontWeight: 600, color: 'rgba(255,255,255,0.75)' }}>50</span>
          </div>
          <div style={rangeLabelsStyle}>
            <span>2000 ₪</span>
            <span>50 ₪</span>
          </div>
        </div>

        <button style={startBtnStyle} onClick={handleStart}>
          هيا نبدأ الرحلة! 💪
        </button>
      </div>
    </div>
  );
}
