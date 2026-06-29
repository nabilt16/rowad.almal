import { useState, type CSSProperties } from 'react';

/* ─────────────────────────────────────────────
   Data
───────────────────────────────────────────── */

const BUDGET = 30;

interface SimItem {
  id: string;
  emoji: string;
  nameAr: string;
  price: number;
  isNeed: boolean;
}

// Alternating need / want so child can't pattern-match by position
const ITEMS: SimItem[] = [
  { id: 'bread',    emoji: '🍞', nameAr: 'خبز',         price: 6,  isNeed: true  },
  { id: 'candy',    emoji: '🍬', nameAr: 'حلوى',         price: 5,  isNeed: false },
  { id: 'water',    emoji: '💧', nameAr: 'ماء',           price: 4,  isNeed: true  },
  { id: 'toy',      emoji: '🎁', nameAr: 'لعبة',          price: 12, isNeed: false },
  { id: 'notebook', emoji: '📒', nameAr: 'دفتر مدرسي',   price: 7,  isNeed: true  },
  { id: 'stickers', emoji: '🎀', nameAr: 'ملصقات',        price: 6,  isNeed: false },
  { id: 'soap',     emoji: '🧼', nameAr: 'صابون',          price: 8,  isNeed: true  },
  { id: 'game',     emoji: '🕹️', nameAr: 'لعبة فيديو',    price: 14, isNeed: false },
];

/* ─────────────────────────────────────────────
   Props
───────────────────────────────────────────── */

interface NeedsWantsSimulationProps {
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
  fontSize: '26px',
  fontWeight: 800,
  color: 'white',
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  marginBottom: '6px',
};

const subheadingStyle: CSSProperties = {
  fontFamily: "'IBM Plex Arabic', sans-serif",
  fontSize: '17px',
  color: 'rgba(255,255,255,0.5)',
  marginBottom: '18px',
};

const budgetBoxStyle: CSSProperties = {
  background: 'rgba(255,255,255,0.05)',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: 'var(--r)',
  padding: '14px 18px',
  marginBottom: '20px',
};

const budgetLabelStyle: CSSProperties = {
  fontFamily: "'IBM Plex Arabic', sans-serif",
  fontSize: '16px',
  color: 'rgba(255,255,255,0.5)',
  marginBottom: '6px',
  display: 'flex',
  justifyContent: 'space-between',
};

const budgetTrackStyle: CSSProperties = {
  height: '10px',
  borderRadius: '999px',
  background: 'rgba(255,255,255,0.1)',
  overflow: 'hidden',
  marginBottom: '8px',
};

const budgetAmountStyle: CSSProperties = {
  fontFamily: "'IBM Plex Arabic', sans-serif",
  fontSize: '30px',
  fontWeight: 900,
  textAlign: 'center',
};

const gridStyle: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(4, 1fr)',
  gap: '10px',
  marginBottom: '20px',
};

const itemCardBase: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '4px',
  padding: '12px 6px 10px',
  borderRadius: 'var(--r)',
  border: '2px solid rgba(255,255,255,0.15)',
  background: 'rgba(255,255,255,0.05)',
  cursor: 'pointer',
  transition: 'all 0.18s',
  position: 'relative' as const,
  userSelect: 'none' as const,
};

const itemEmojiStyle: CSSProperties = {
  fontSize: '36px',
  lineHeight: 1,
};

const itemNameStyle: CSSProperties = {
  fontFamily: "'IBM Plex Arabic', sans-serif",
  fontSize: '15px',
  fontWeight: 600,
  color: 'rgba(255,255,255,0.9)',
  textAlign: 'center',
};

const itemPriceStyle: CSSProperties = {
  fontFamily: "'IBM Plex Arabic', sans-serif",
  fontSize: '20px',
  fontWeight: 900,
  color: '#FFD700',
};

const doneBtnStyle: CSSProperties = {
  width: '100%',
  padding: '13px',
  borderRadius: 'var(--r)',
  background: 'linear-gradient(135deg, var(--blue), #1565C0)',
  color: 'white',
  fontFamily: "'IBM Plex Arabic', sans-serif",
  fontSize: '18px',
  fontWeight: 700,
  border: 'none',
  cursor: 'pointer',
  transition: 'opacity 0.2s',
};

/* ── Results styles ── */

const resultHeadingStyle: CSSProperties = {
  fontFamily: "'IBM Plex Arabic', sans-serif",
  fontSize: '20px',
  fontWeight: 800,
  color: 'white',
  textAlign: 'center',
  marginBottom: '18px',
};

const columnsStyle: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: '12px',
  marginBottom: '18px',
};

const colBoxBase: CSSProperties = {
  borderRadius: 'var(--r)',
  padding: '14px',
  minHeight: '80px',
};

const colLabelStyle: CSSProperties = {
  fontFamily: "'IBM Plex Arabic', sans-serif",
  fontSize: '14px',
  fontWeight: 800,
  marginBottom: '10px',
};

const colItemStyle: CSSProperties = {
  fontFamily: "'IBM Plex Arabic', sans-serif",
  fontSize: '13px',
  color: 'rgba(255,255,255,0.85)',
  display: 'flex',
  justifyContent: 'space-between',
  marginBottom: '5px',
};

const colTotalStyle: CSSProperties = {
  fontFamily: "'IBM Plex Arabic', sans-serif",
  fontSize: '13px',
  fontWeight: 800,
  borderTop: '1px solid rgba(255,255,255,0.12)',
  paddingTop: '6px',
  marginTop: '6px',
  display: 'flex',
  justifyContent: 'space-between',
};

const feedbackBoxStyle = (good: boolean): CSSProperties => ({
  borderRadius: 'var(--r)',
  padding: '16px 18px',
  marginBottom: '18px',
  fontFamily: "'IBM Plex Arabic', sans-serif",
  fontSize: '15px',
  lineHeight: 1.8,
  color: good ? '#A5D6A7' : '#FFE082',
  background: good ? 'rgba(46,125,50,0.15)' : 'rgba(249,168,37,0.1)',
  border: good ? '1px solid rgba(102,187,106,0.3)' : '1px solid rgba(249,168,37,0.25)',
  animation: 'popIn 0.4s cubic-bezier(0.34,1.56,0.64,1)',
});

const btnRowStyle: CSSProperties = {
  display: 'flex',
  gap: '10px',
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
  flex: 2,
  padding: '12px',
  borderRadius: 'var(--r)',
  background: 'linear-gradient(135deg, var(--green), #1B5E20)',
  color: 'white',
  fontFamily: "'IBM Plex Arabic', sans-serif",
  fontSize: '15px',
  fontWeight: 700,
  border: 'none',
  cursor: 'pointer',
};

/* ─────────────────────────────────────────────
   Component
───────────────────────────────────────────── */

export default function NeedsWantsSimulation({ onComplete, personalBudget }: NeedsWantsSimulationProps) {
  const budget = personalBudget ?? BUDGET;
  const [bought, setBought] = useState<Set<string>>(new Set());
  const [phase, setPhase] = useState<'shop' | 'results'>('shop');
  const [completed, setCompleted] = useState(false);

  /* ── Derived values ── */
  const spent = ITEMS.filter(i => bought.has(i.id)).reduce((s, i) => s + i.price, 0);
  const remaining = budget - spent;
  const budgetPct = (remaining / budget) * 100;
  const budgetColor = remaining <= 4 ? '#EF5350' : remaining <= 10 ? '#FFB300' : 'var(--green-lt)';

  const boughtItems = ITEMS.filter(i => bought.has(i.id));
  const needsBought = boughtItems.filter(i => i.isNeed);
  const wantsBought = boughtItems.filter(i => !i.isNeed);
  const needsTotal = needsBought.reduce((s, i) => s + i.price, 0);
  const wantsTotal = wantsBought.reduce((s, i) => s + i.price, 0);

  /* ── Feedback ── */
  const isGood = needsTotal >= wantsTotal && needsBought.length > 0;

  const getFeedback = () => {
    if (boughtItems.length === 0) {
      return { good: false, emoji: '🤔', text: 'لم تشترِ شيئاً! جرّب مرة أخرى — اختر ما تحتاجه فعلاً بـ30 ₪.' };
    }
    if (needsBought.length === 0) {
      return { good: false, emoji: '💭', text: 'اشتريت رغبات فقط! تذكّر: الخبز والماء والصابون أهم من الحلوى واللعبة. جرّب مرة أخرى.' };
    }
    if (needsTotal >= wantsTotal) {
      return {
        good: true,
        emoji: '⭐',
        text: `أحسنت! أنفقت ${needsTotal} ₪ على الحاجات و${wantsTotal} ₪ على الرغبات — هذا توازن ذكي تماماً!`,
      };
    }
    return {
      good: false,
      emoji: '💡',
      text: `أنفقت ${wantsTotal} ₪ على الرغبات أكثر من الحاجات (${needsTotal} ₪). لا بأس! في المرة القادمة ابدأ بالحاجات أولاً.`,
    };
  };

  /* ── Extra consequence line ── */
  const getExtraLine = (): string | null => {
    if (boughtItems.length === 0) return null;

    // Child bought only needs — plant the saving idea
    if (wantsBought.length === 0 && needsBought.length > 0) {
      return `بقي معك ${remaining} ₪ — ماذا ستفعل بها؟ 💭`;
    }

    // Child bought some wants — find a need they skipped
    const missedNeed = ITEMS.filter(i => i.isNeed && !bought.has(i.id))[0];
    if (missedNeed) {
      return `لو وفّرت ${missedNeed.price} ₪ أكثر، كنت قادراً على شراء ${missedNeed.emoji} ${missedNeed.nameAr}`;
    }

    // All needs were bought + some wants — show wants cost as savings potential
    return `أنفقت ${wantsTotal} ₪ على الرغبات — لو وفّرتها كانت ستكون ${wantsTotal} ₪ في حصالتك!`;
  };

  /* ── Handlers ── */
  const handleToggle = (item: SimItem) => {
    if (phase !== 'shop') return;
    setBought(prev => {
      const next = new Set(prev);
      if (next.has(item.id)) {
        next.delete(item.id);
      } else {
        if (remaining >= item.price) next.add(item.id);
      }
      return next;
    });
  };

  const handleDone = () => setPhase('results');

  const handleRetry = () => {
    setBought(new Set());
    setPhase('shop');
  };

  const handleComplete = () => {
    setCompleted(true);
    onComplete();
  };

  /* ── Item card style helper ── */
  const getItemStyle = (item: SimItem): CSSProperties => {
    const isBought = bought.has(item.id);
    const canAfford = remaining >= item.price;
    if (isBought) {
      return {
        ...itemCardBase,
        borderColor: 'var(--green-lt)',
        background: 'rgba(102,187,106,0.15)',
        boxShadow: '0 0 10px rgba(102,187,106,0.2)',
      };
    }
    if (!canAfford) {
      return { ...itemCardBase, opacity: 0.35, cursor: 'not-allowed' };
    }
    return itemCardBase;
  };

  /* ── Render: shopping phase ── */
  if (phase === 'shop') {
    return (
      <div style={wrapStyle}>
        <div style={headingStyle}>
          <span>🎮</span>
          جرّب بنفسك
        </div>
        <div style={subheadingStyle}>
          عندك {budget} ₪ — اشترِ ما تحتاجه. اضغط على الأشياء لإضافتها أو إزالتها.
        </div>

        {/* Budget bar */}
        <div style={budgetBoxStyle}>
          <div style={budgetLabelStyle}>
            <span>المبلغ المتبقي</span>
            <span>أنفقت {spent} ₪</span>
          </div>
          <div style={budgetTrackStyle}>
            <div style={{
              height: '100%',
              width: `${budgetPct}%`,
              background: budgetColor,
              borderRadius: '999px',
              transition: 'width 0.25s ease, background 0.25s ease',
            }} />
          </div>
          <div style={{ ...budgetAmountStyle, color: budgetColor }}>
            {remaining} ₪
          </div>
          {remaining === 0 && (
            <div style={{
              fontFamily: "'IBM Plex Arabic', sans-serif",
              fontSize: '12px',
              color: '#EF9A9A',
              textAlign: 'center',
              marginTop: '4px',
            }}>
              وصلت للحد الأقصى — اضغط «انتهيت» أو أزِل شيئاً لتشتري غيره
            </div>
          )}
        </div>

        {/* Items grid */}
        <div style={gridStyle}>
          {ITEMS.map(item => {
            const isBought = bought.has(item.id);
            return (
              <button
                key={item.id}
                style={getItemStyle(item)}
                onClick={() => handleToggle(item)}
              >
                {isBought && (
                  <div style={{
                    position: 'absolute',
                    top: '4px',
                    left: '4px',
                    width: '16px',
                    height: '16px',
                    borderRadius: '50%',
                    background: 'var(--green-lt)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '9px',
                    color: 'white',
                    fontWeight: 800,
                  }}>
                    ✓
                  </div>
                )}
                <span style={itemEmojiStyle}>{item.emoji}</span>
                <span style={itemNameStyle}>{item.nameAr}</span>
                <span style={itemPriceStyle}>{item.price} ₪</span>
              </button>
            );
          })}
        </div>

        <button style={doneBtnStyle} onClick={handleDone}>
          انتهيت من التسوق ←
        </button>
      </div>
    );
  }

  /* ── Render: results phase ── */
  const feedback = getFeedback();

  return (
    <div style={wrapStyle}>
      <div style={resultHeadingStyle}>🛍️ ماذا اشتريت؟</div>

      {/* Two columns */}
      <div style={columnsStyle}>
        {/* Needs column */}
        <div style={{
          ...colBoxBase,
          background: 'rgba(46,125,50,0.12)',
          border: '1px solid rgba(102,187,106,0.25)',
        }}>
          <div style={{ ...colLabelStyle, color: 'var(--green-lt)' }}>
            ✅ احتياجات
          </div>
          {needsBought.length === 0 ? (
            <div style={{
              fontFamily: "'IBM Plex Arabic', sans-serif",
              fontSize: '12px',
              color: 'rgba(255,255,255,0.35)',
              fontStyle: 'italic',
            }}>
              لا شيء
            </div>
          ) : (
            <>
              {needsBought.map(item => (
                <div key={item.id} style={colItemStyle}>
                  <span>{item.emoji} {item.nameAr}</span>
                  <span>{item.price} ₪</span>
                </div>
              ))}
              <div style={{ ...colTotalStyle, color: 'var(--green-lt)' }}>
                <span>المجموع</span>
                <span>{needsTotal} ₪</span>
              </div>
            </>
          )}
        </div>

        {/* Wants column */}
        <div style={{
          ...colBoxBase,
          background: 'rgba(255,152,0,0.08)',
          border: '1px solid rgba(255,152,0,0.22)',
        }}>
          <div style={{ ...colLabelStyle, color: '#FFB300' }}>
            ⭐ رغبات
          </div>
          {wantsBought.length === 0 ? (
            <div style={{
              fontFamily: "'IBM Plex Arabic', sans-serif",
              fontSize: '12px',
              color: 'rgba(255,255,255,0.35)',
              fontStyle: 'italic',
            }}>
              لا شيء
            </div>
          ) : (
            <>
              {wantsBought.map(item => (
                <div key={item.id} style={colItemStyle}>
                  <span>{item.emoji} {item.nameAr}</span>
                  <span>{item.price} ₪</span>
                </div>
              ))}
              <div style={{ ...colTotalStyle, color: '#FFB300' }}>
                <span>المجموع</span>
                <span>{wantsTotal} ₪</span>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Feedback */}
      <div style={feedbackBoxStyle(feedback.good)}>
        <strong>{feedback.emoji} </strong>{feedback.text}
        {getExtraLine() && (
          <div style={{
            marginTop: '10px',
            paddingTop: '10px',
            borderTop: '1px solid rgba(255,255,255,0.1)',
            fontSize: '14px',
            opacity: 0.9,
          }}>
            {getExtraLine()}
          </div>
        )}
      </div>

      {/* Action buttons */}
      <div style={btnRowStyle}>
        <button style={retryBtnStyle} onClick={handleRetry}>
          🔄 حاولي مرة أخرى
        </button>
        <button
          style={{
            ...completeBtnStyle,
            opacity: completed ? 0.6 : 1,
            cursor: completed ? 'default' : 'pointer',
          }}
          onClick={handleComplete}
          disabled={completed}
        >
          {completed ? '✔ أكملت النشاط' : '✅ أكملت النشاط'}
        </button>
      </div>
    </div>
  );
}
