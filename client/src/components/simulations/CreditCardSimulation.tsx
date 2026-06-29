import { useState, type CSSProperties } from 'react';
import { useUIStore } from '../../stores/uiStore';

/* ─────────────────────────────────────────────
   Constants
───────────────────────────────────────────── */

const DEFAULT_WEEKLY = 50;          // ₪/week fallback
const TOTAL_MONTHS   = 4;

/* ─────────────────────────────────────────────
   Data
───────────────────────────────────────────── */

interface PurchaseItem {
  id: string;
  emoji: string;
  nameAr: string;
  price: number;
  type: 'essential' | 'want' | 'impulse';
  typeLabel: string;
  typeLabelEn: string;
}

const MONTHS_DATA: PurchaseItem[][] = [
  [
    { id: 'm1-e', emoji: '🍱', nameAr: 'طعام الأسبوع',    price: 60, type: 'essential', typeLabel: 'ضروري',  typeLabelEn: 'essential' },
    { id: 'm1-w', emoji: '🎮', nameAr: 'لعبة فيديو',       price: 80, type: 'want',      typeLabel: 'رغبة',   typeLabelEn: 'want'      },
    { id: 'm1-i', emoji: '🍬', nameAr: 'حلويات',           price: 15, type: 'impulse',   typeLabel: 'اندفاع', typeLabelEn: 'impulse'   },
  ],
  [
    { id: 'm2-e', emoji: '🚌', nameAr: 'مواصلات الشهر',   price: 50, type: 'essential', typeLabel: 'ضروري',  typeLabelEn: 'essential' },
    { id: 'm2-w', emoji: '👕', nameAr: 'ملابس جديدة',      price: 90, type: 'want',      typeLabel: 'رغبة',   typeLabelEn: 'want'      },
    { id: 'm2-i', emoji: '🎴', nameAr: 'باقة ملصقات',     price: 20, type: 'impulse',   typeLabel: 'اندفاع', typeLabelEn: 'impulse'   },
  ],
  [
    { id: 'm3-e', emoji: '🛒', nameAr: 'مشتريات البيت',   price: 65, type: 'essential', typeLabel: 'ضروري',  typeLabelEn: 'essential' },
    { id: 'm3-w', emoji: '📚', nameAr: 'كتب قصص',          price: 70, type: 'want',      typeLabel: 'رغبة',   typeLabelEn: 'want'      },
    { id: 'm3-i', emoji: '🧸', nameAr: 'لعبة صغيرة',      price: 25, type: 'impulse',   typeLabel: 'اندفاع', typeLabelEn: 'impulse'   },
  ],
  [
    { id: 'm4-e', emoji: '⚡', nameAr: 'فاتورة الكهرباء', price: 55, type: 'essential', typeLabel: 'ضروري',  typeLabelEn: 'essential' },
    { id: 'm4-w', emoji: '👟', nameAr: 'حذاء رياضي',       price: 85, type: 'want',      typeLabel: 'رغبة',   typeLabelEn: 'want'      },
    { id: 'm4-i', emoji: '🍿', nameAr: 'وجبة خفيفة',      price: 18, type: 'impulse',   typeLabel: 'اندفاع', typeLabelEn: 'impulse'   },
  ],
];

interface MonthRecord {
  month: number;
  spent: number;
  savedAmount: number;  // monthlyBudget - spent (always ≥ 0)
}

/* ─────────────────────────────────────────────
   Props
───────────────────────────────────────────── */

interface CreditCardSimulationProps {
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
  marginBottom: '18px',
};

const infoRowStyle: CSSProperties = {
  display: 'flex',
  gap: '8px',
  marginBottom: '20px',
  flexWrap: 'wrap' as const,
};

const badgeStyle = (color: string, bg: string): CSSProperties => ({
  display: 'inline-flex',
  alignItems: 'center',
  gap: '5px',
  background: bg,
  border: `1px solid ${color}55`,
  borderRadius: '20px',
  padding: '4px 14px',
  fontFamily: "'IBM Plex Arabic', sans-serif",
  fontSize: '13px',
  fontWeight: 700,
  color,
});

const monthLabelStyle: CSSProperties = {
  fontFamily: "'IBM Plex Arabic', sans-serif",
  fontSize: '16px',
  fontWeight: 700,
  color: '#FFD700',
  marginBottom: '10px',
};

const itemCardStyle = (selected: boolean, disabled: boolean): CSSProperties => ({
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  padding: '14px 16px',
  borderRadius: 'var(--r)',
  border: `2px solid ${selected ? '#64B5F6' : disabled ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.1)'}`,
  background: selected ? 'rgba(33,150,243,0.12)' : disabled ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.04)',
  cursor: disabled ? 'not-allowed' : 'pointer',
  opacity: disabled ? 0.38 : 1,
  transition: 'all 0.18s',
  marginBottom: '8px',
  textAlign: 'right' as const,
  width: '100%',
});

const typeTagStyle = (type: string): CSSProperties => ({
  fontFamily: "'IBM Plex Arabic', sans-serif",
  fontSize: '11px',
  fontWeight: 700,
  borderRadius: '8px',
  padding: '2px 8px',
  flexShrink: 0,
  color: type === 'essential' ? '#A5D6A7' : type === 'want' ? '#FFD54F' : '#EF9A9A',
  background: type === 'essential' ? 'rgba(102,187,106,0.15)' : type === 'want' ? 'rgba(255,193,7,0.15)' : 'rgba(239,83,80,0.15)',
  border: `1px solid ${type === 'essential' ? 'rgba(102,187,106,0.3)' : type === 'want' ? 'rgba(255,193,7,0.25)' : 'rgba(239,83,80,0.3)'}`,
});

const spendBarOuter: CSSProperties = {
  background: 'rgba(255,255,255,0.06)',
  borderRadius: '8px',
  height: '10px',
  overflow: 'hidden',
  marginBottom: '6px',
};

const primaryBtnStyle: CSSProperties = {
  width: '100%',
  padding: '14px',
  borderRadius: 'var(--r)',
  background: 'linear-gradient(135deg, #1565C0, #0D47A1)',
  color: 'white',
  fontFamily: "'IBM Plex Arabic', sans-serif",
  fontSize: '16px',
  fontWeight: 800,
  border: 'none',
  cursor: 'pointer',
  marginTop: '16px',
};

const savingsBoxStyle: CSSProperties = {
  borderRadius: 'var(--r)',
  padding: '14px 16px',
  background: 'rgba(46,125,50,0.15)',
  border: '1px solid rgba(102,187,106,0.3)',
  fontFamily: "'IBM Plex Arabic', sans-serif",
  fontSize: '15px',
  fontWeight: 700,
  color: '#A5D6A7',
  marginBottom: '14px',
  animation: 'popIn 0.4s cubic-bezier(0.34,1.56,0.64,1)',
};

const nextMonthBtnStyle: CSSProperties = {
  width: '100%',
  padding: '13px',
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
   Helpers
───────────────────────────────────────────── */

function monthName(m: number) {
  return ['الأول', 'الثاني', 'الثالث', 'الرابع'][m - 1];
}

/* Savings jar panel
   imageIndex = 1-4, selects /saving-box-N.png
   saved      = accumulated ₪ to display below jar
*/
function JarPanel({ saved, imageIndex, size = 150 }: { saved: number; imageIndex: number; size?: number }) {
  return (
    <div style={{
      width: `${size}px`,
      flexShrink: 0,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '10px',
      paddingTop: '4px',
      position: 'sticky',
      top: '16px',
    }}>
      {/* Jar image — keyed so React remounts it on month change, triggering fadeIn */}
      <img
        key={imageIndex}
        src={`/saving-box-${imageIndex}.png`}
        alt="savings jar"
        style={{
          width: `${size}px`,
          height: `${size}px`,
          objectFit: 'contain',
          display: 'block',
          animation: 'fadeIn 0.45s ease',
        }}
      />

      {/* Cumulative savings */}
      <div style={{
        fontFamily: "'IBM Plex Arabic', sans-serif",
        fontSize: '28px',
        fontWeight: 900,
        color: '#A5D6A7',
        textAlign: 'center',
        lineHeight: 1.2,
        transition: 'all 0.3s',
      }}>
        {saved} ₪
      </div>
    </div>
  );
}

/* Two-column layout wrapper — keeps jar on left (RTL: second child = left) */
function TwoCol({ children, jarSaved, jarImageIndex, jarSize = 150 }: {
  children: React.ReactNode;
  jarSaved: number;
  jarImageIndex: number;
  jarSize?: number;
}) {
  return (
    <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
      <div style={{ flex: 1, minWidth: 0 }}>{children}</div>
      <JarPanel saved={jarSaved} imageIndex={jarImageIndex} size={jarSize} />
    </div>
  );
}

/* ─────────────────────────────────────────────
   Component
───────────────────────────────────────────── */

export default function CreditCardSimulation({ onComplete, personalBudget }: CreditCardSimulationProps) {
  // Monthly budget = weekly personalBudget × 4 weeks
  const monthlyBudget = (personalBudget ?? DEFAULT_WEEKLY) * 4;
  const totalBudget   = monthlyBudget * TOTAL_MONTHS;

  const [month, setMonth]   = useState(1);
  const [phase, setPhase]   = useState<'shopping' | 'month-end' | 'results'>('shopping');
  const [bought, setBought] = useState<Set<string>>(new Set());
  const [history, setHistory] = useState<MonthRecord[]>([]);
  const [done, setDone]     = useState(false);
  const dreamName           = useUIStore(s => s.dreamName);
  const dreamCost           = useUIStore(s => s.dreamCost);

  const items     = MONTHS_DATA[month - 1];
  const spent     = items.filter(i => bought.has(i.id)).reduce((s, i) => s + i.price, 0);
  const remaining = monthlyBudget - spent;

  const historySaved = history.reduce((s, r) => s + r.savedAmount, 0);

  /* ── Toggle item (disabled if it would exceed budget) ── */
  const toggleItem = (item: PurchaseItem) => {
    if (bought.has(item.id)) {
      setBought(prev => { const n = new Set(prev); n.delete(item.id); return n; });
    } else if (item.price <= remaining) {
      setBought(prev => new Set(prev).add(item.id));
    }
  };

  const handleEndMonth = () => {
    const savedAmount = monthlyBudget - spent;   // always ≥ 0 (no overspend)
    setHistory(prev => [...prev, { month, spent, savedAmount }]);
    setPhase('month-end');
  };

  const handleNextMonth = () => {
    setBought(new Set());
    if (month < TOTAL_MONTHS) {
      setMonth(m => m + 1);
      setPhase('shopping');
    } else {
      setPhase('results');
    }
  };

  const handleRetry = () => {
    setMonth(1);
    setPhase('shopping');
    setBought(new Set());
    setHistory([]);
    setDone(false);
  };

  const handleComplete = () => {
    setDone(true);
    onComplete();
  };

  /* ─────── SHOPPING PHASE ─────── */
  if (phase === 'shopping') {
    const pct      = Math.min(100, (spent / monthlyBudget) * 100);
    const barColor = pct > 85 ? '#EF5350' : pct > 60 ? '#FFB300' : '#66BB6A';
    // jar shows: completed months savings only (not current preview)
    const jarSaved      = historySaved;
    // During shopping month N: show previous month's image; month 1 → box 1
    const jarImageIndex = Math.max(1, month - 1);

    return (
      <div style={wrapStyle}>
        <div style={headingStyle}><span>🎮</span> جرّب بنفسك — شهر مع البطاقة</div>
        <div style={subStyle}>
          ميزانيتك الشهرية {monthlyBudget} ₪. اختر شو تشتري — لا تتجاوز الميزانية!
        </div>

        <TwoCol jarSaved={jarSaved} jarImageIndex={jarImageIndex}>
          {/* Info badges */}
          <div style={infoRowStyle}>
            <span style={badgeStyle('#FFD54F', 'rgba(255,193,7,0.1)')}>💵 ميزانيتك: {monthlyBudget} ₪</span>
            <span style={badgeStyle(remaining < 20 ? '#EF9A9A' : '#A5D6A7', remaining < 20 ? 'rgba(239,83,80,0.1)' : 'rgba(102,187,106,0.1)')}>
              🏦 المتبقي: {remaining} ₪
            </span>
          </div>

          {/* Month header */}
          <div style={monthLabelStyle}>الشهر {monthName(month)} من {TOTAL_MONTHS}</div>

          {/* Items */}
          {items.map(item => {
            const sel      = bought.has(item.id);
            const disabled = !sel && item.price > remaining;
            return (
              <button
                key={item.id}
                style={itemCardStyle(sel, disabled)}
                onClick={() => toggleItem(item)}
                disabled={disabled}
              >
                <span style={{ fontSize: '26px', flexShrink: 0 }}>{item.emoji}</span>
                <div style={{ flex: 1 }}>
                  <div style={{
                    fontFamily: "'IBM Plex Arabic', sans-serif",
                    fontSize: '18px',
                    fontWeight: 700,
                    color: '#FFFFFF',
                    marginBottom: '2px',
                  }}>
                    {item.nameAr}
                    {disabled && <span style={{ fontSize: '13px', marginRight: '6px', opacity: 0.6 }}>— ما في رصيد كافي</span>}
                  </div>
                  <div style={{
                    fontFamily: "'IBM Plex Arabic', sans-serif",
                    fontSize: '16px',
                    fontWeight: 700,
                    color: '#00ff88',
                  }}>
                    {item.price} ₪
                  </div>
                </div>
                <span style={typeTagStyle(item.typeLabelEn)}>{item.typeLabel}</span>
                <span style={{
                  fontFamily: "'IBM Plex Arabic', sans-serif",
                  fontSize: '18px',
                  flexShrink: 0,
                  color: sel ? '#64B5F6' : 'rgba(255,255,255,0.2)',
                }}>
                  {sel ? '✓' : '+'}
                </span>
              </button>
            );
          })}

          {/* Spend tracker */}
          <div style={{
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 'var(--r)',
            padding: '14px 16px',
            marginTop: '8px',
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontFamily: "'IBM Plex Arabic', sans-serif",
              fontSize: '13px',
              color: 'rgba(255,255,255,0.6)',
              marginBottom: '8px',
            }}>
              <span>صرفت: <strong style={{ color: 'white' }}>{spent} ₪</strong></span>
              <span>من {monthlyBudget} ₪</span>
            </div>
            <div style={spendBarOuter}>
              <div style={{
                height: '100%',
                width: `${pct}%`,
                background: barColor,
                borderRadius: '8px',
                transition: 'width 0.3s, background 0.3s',
              }} />
            </div>
            <div style={{
              fontFamily: "'IBM Plex Arabic', sans-serif",
              fontSize: '12px',
              color: remaining < 20 ? '#FFD54F' : 'rgba(255,255,255,0.35)',
              marginTop: '4px',
              transition: 'color 0.3s',
            }}>
              {remaining > 0
                ? `المتبقي: ${remaining} ₪`
                : 'استخدمت كل الميزانية!'}
            </div>
          </div>

          <button style={primaryBtnStyle} onClick={handleEndMonth}>
            📅 إنهاء الشهر {monthName(month)}
          </button>
        </TwoCol>
      </div>
    );
  }

  /* ─────── MONTH-END PHASE ─────── */
  if (phase === 'month-end') {
    const rec      = history[history.length - 1];
    // jar: sum of ALL completed months; image = current completed month number
    const jarSaved = historySaved;

    return (
      <div style={wrapStyle}>
        <TwoCol jarSaved={jarSaved} jarImageIndex={rec.month} jarSize={220}>
          <div style={headingStyle}>📋 نهاية الشهر {monthName(rec.month)}</div>

          {/* Bought items summary */}
          <div style={{ ...monthLabelStyle, marginTop: '12px' }}>ما اشتريته هذا الشهر</div>
          <div style={{ marginBottom: '14px' }}>
            {MONTHS_DATA[rec.month - 1].map(item => (
              <div key={item.id} style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '9px 12px',
                borderRadius: 'var(--r)',
                marginBottom: '6px',
                fontFamily: "'IBM Plex Arabic', sans-serif",
                fontSize: '13px',
                background: bought.has(item.id) ? 'rgba(33,150,243,0.08)' : 'rgba(255,255,255,0.02)',
                border: `1px solid ${bought.has(item.id) ? 'rgba(100,181,246,0.2)' : 'rgba(255,255,255,0.05)'}`,
                color: bought.has(item.id) ? 'rgba(255,255,255,0.85)' : 'rgba(255,255,255,0.3)',
              }}>
                <span style={{ fontSize: '18px' }}>{item.emoji}</span>
                <span style={{ flex: 1 }}>{item.nameAr}</span>
                <span>{bought.has(item.id) ? `${item.price} ₪` : '—'}</span>
              </div>
            ))}
          </div>

          {/* Totals row */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontFamily: "'IBM Plex Arabic', sans-serif",
            fontSize: '14px',
            fontWeight: 700,
            color: 'rgba(255,255,255,0.6)',
            marginBottom: '14px',
            padding: '0 4px',
          }}>
            <span>صرفت: <strong style={{ color: 'white' }}>{rec.spent} ₪</strong></span>
            <span>ميزانيتك: <strong style={{ color: '#FFD54F' }}>{monthlyBudget} ₪</strong></span>
          </div>

          {/* Savings message */}
          <div style={savingsBoxStyle}>
            {rec.savedAmount > 0
              ? `✅ وفّرت ${rec.savedAmount} ₪ هذا الشهر — قرار ذكي!`
              : '⚖️ استخدمت الميزانية كاملة هذا الشهر.'}
          </div>

          <button style={nextMonthBtnStyle} onClick={handleNextMonth}>
            {month < TOTAL_MONTHS ? `الشهر التالي ←` : `شوف النتائج النهائية 🏁`}
          </button>
        </TwoCol>
      </div>
    );
  }

  /* ─────── RESULTS PHASE ─────── */
  const totalSaved = history.reduce((s, r) => s + r.savedAmount, 0);

  const verdictMsg = totalSaved >= totalBudget * 0.25
    ? 'أنت عملت قجة حقيقية! 🏆'
    : totalSaved > 0
      ? 'بداية كويسة — الشهر الجاي وفّر أكثر 💪'
      : 'صرفت كل شي — شو كان ممكن تتخلى عنه؟ 🤔';

  const verdictGood = totalSaved > 0;

  return (
    <div style={wrapStyle}>
      <TwoCol jarSaved={totalSaved} jarImageIndex={4}>
        <div style={{
          fontFamily: "'IBM Plex Arabic', sans-serif",
          fontSize: '21px',
          fontWeight: 900,
          color: 'white',
          marginBottom: '18px',
        }}>
          🏁 النتائج النهائية
        </div>

        {/* Grand total */}
        <div style={{
          borderRadius: 'var(--r)',
          padding: '18px 16px',
          marginBottom: '16px',
          fontFamily: "'IBM Plex Arabic', sans-serif",
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
          <div style={{ fontSize: '48px', fontWeight: 900, marginBottom: '4px' }}>
            {totalSaved} ₪
          </div>
          <div style={{ fontSize: '17px', opacity: 0.75, marginBottom: '10px' }}>
            إجمالي ما وفّرته من {totalBudget} ₪
          </div>
          <div style={{ fontSize: '20px', fontWeight: 800 }}>{verdictMsg}</div>
        </div>

        {/* Per-month breakdown */}
        <div style={{
          fontFamily: "'IBM Plex Arabic', sans-serif",
          fontSize: '13px',
          fontWeight: 700,
          color: 'rgba(255,255,255,0.45)',
          marginBottom: '8px',
        }}>
          التفصيل
        </div>
        <div style={{
          fontFamily: "'IBM Plex Arabic', sans-serif",
          fontSize: '17px',
          color: 'rgba(255,255,255,0.6)',
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.07)',
          borderRadius: 'var(--r)',
          padding: '12px 16px',
          marginBottom: '16px',
          display: 'flex',
          gap: '6px',
          flexWrap: 'wrap' as const,
        }}>
          {history.map((rec, i) => (
            <span key={rec.month}>
              <span style={{ color: 'rgba(255,255,255,0.4)' }}>شهر {i + 1}: </span>
              <strong style={{ color: rec.savedAmount > 0 ? '#A5D6A7' : '#FFD54F' }}>
                {rec.savedAmount} ₪
              </strong>
              {i < history.length - 1 && (
                <span style={{ color: 'rgba(255,255,255,0.2)', margin: '0 4px' }}>|</span>
              )}
            </span>
          ))}
        </div>

        {/* Month-by-month timeline */}
        <div style={{ marginBottom: '18px' }}>
          {history.map(rec => (
            <div key={rec.month} style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '12px 14px',
              borderRadius: 'var(--r)',
              marginBottom: '6px',
              fontFamily: "'IBM Plex Arabic', sans-serif",
              fontSize: '17px',
              background: rec.savedAmount > 0 ? 'rgba(46,125,50,0.08)' : 'rgba(255,255,255,0.03)',
              border: `1px solid ${rec.savedAmount > 0 ? 'rgba(102,187,106,0.2)' : 'rgba(255,255,255,0.06)'}`,
            }}>
              <span style={{ fontSize: '20px', flexShrink: 0 }}>{rec.savedAmount > 0 ? '📈' : '📊'}</span>
              <span style={{ fontWeight: 700, color: 'rgba(255,255,255,0.8)', flexShrink: 0 }}>
                الشهر {monthName(rec.month)}
              </span>
              <span style={{ flex: 1, color: 'rgba(255,255,255,0.5)' }}>صرفت {rec.spent} ₪</span>
              <span style={{
                fontWeight: 800,
                color: rec.savedAmount > 0 ? '#A5D6A7' : 'rgba(255,255,255,0.3)',
                flexShrink: 0,
              }}>
                {rec.savedAmount > 0 ? `وفّرت ${rec.savedAmount} ₪` : 'كامل'}
              </span>
            </div>
          ))}
        </div>

        {/* Dream progress — only when dream is set */}
        {dreamName && dreamCost && (() => {
          const pct      = Math.min(100, Math.round((totalSaved / dreamCost) * 100));
          const reached  = totalSaved >= dreamCost;
          const remaining = dreamCost - totalSaved;
          return (
            <div style={{
              borderRadius: 'var(--r)',
              padding: '14px 16px',
              marginBottom: '16px',
              background: reached ? 'rgba(46,125,50,0.12)' : 'rgba(255,255,255,0.04)',
              border: `1px solid ${reached ? 'rgba(102,187,106,0.3)' : 'rgba(255,255,255,0.08)'}`,
            }}>
              <div style={{
                fontFamily: "'IBM Plex Arabic', sans-serif",
                fontSize: '15px',
                fontWeight: 800,
                color: '#FFD54F',
                marginBottom: '10px',
              }}>
                🌟 حلمك: {dreamName}
              </div>
              {/* Progress bar */}
              <div style={{
                background: 'rgba(255,255,255,0.06)',
                borderRadius: '8px',
                height: '10px',
                overflow: 'hidden',
                marginBottom: '6px',
              }}>
                <div style={{
                  height: '100%',
                  width: `${pct}%`,
                  background: reached
                    ? 'linear-gradient(90deg, var(--green), #66BB6A)'
                    : 'linear-gradient(90deg, #FFB300, #FFD54F)',
                  borderRadius: '8px',
                  transition: 'width 0.4s',
                }} />
              </div>
              <div style={{
                fontFamily: "'IBM Plex Arabic', sans-serif",
                fontSize: '12px',
                color: 'rgba(255,255,255,0.4)',
                marginBottom: '8px',
                textAlign: 'left' as const,
              }}>
                {totalSaved} / {dreamCost} ₪ ({pct}%)
              </div>
              <div style={{
                fontFamily: "'IBM Plex Arabic', sans-serif",
                fontSize: '14px',
                fontWeight: 700,
                color: reached ? '#A5D6A7' : 'rgba(255,255,255,0.75)',
                lineHeight: 1.6,
              }}>
                {reached
                  ? '🎉 وفّرت كفاية تحقق حلمك!'
                  : `باقيلك ${remaining} ₪ لتوصل لـ ${dreamName} — استمر هيك وبتوصل! 💪`}
              </div>
            </div>
          );
        })()}

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
      </TwoCol>
    </div>
  );
}
