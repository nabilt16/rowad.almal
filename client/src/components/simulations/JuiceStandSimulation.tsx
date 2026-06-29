import { useState, useMemo, type CSSProperties } from 'react';

/* ─────────────────────────────────────────────
   Data
───────────────────────────────────────────── */

interface Product {
  id: string;
  emoji: string;
  nameAr: string;
  cost: number;
  suggestedPrice: number;
}

const PRODUCTS: Product[] = [
  { id: 'lemon',      emoji: '🍋', nameAr: 'عصير ليمون',    cost: 3, suggestedPrice: 5 },
  { id: 'orange',     emoji: '🍊', nameAr: 'عصير برتقال',   cost: 4, suggestedPrice: 7 },
  { id: 'watermelon', emoji: '🍉', nameAr: 'عصير بطيخ',     cost: 5, suggestedPrice: 8 },
];

interface Customer {
  id: number;
  nameAr: string;
  emoji: string;
  maxBudget: number;     // won't buy above this price
  comment: string;       // shown when they walk away
}

const CUSTOMERS: Customer[] = [
  { id: 1, nameAr: 'سامي',   emoji: '👦', maxBudget: 4,  comment: 'السعر غالٍ عليّ اليوم!' },
  { id: 2, nameAr: 'ليلى',   emoji: '👧', maxBudget: 7,  comment: 'وجدت أرخص في الجانب الآخر.' },
  { id: 3, nameAr: 'جدّو',   emoji: '👴', maxBudget: 10, comment: 'مرّ أمامي ولم يتوقف.' },
  { id: 4, nameAr: 'نور',    emoji: '👩', maxBudget: 5,  comment: 'معي مصروف محدود اليوم.' },
  { id: 5, nameAr: 'أحمد',   emoji: '🧑', maxBudget: 9,  comment: 'فضّل المشروب الآخر.' },
];

const CAPITAL = 20;

/* ─────────────────────────────────────────────
   Props
───────────────────────────────────────────── */

interface JuiceStandSimulationProps {
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
  marginBottom: '20px',
};

const sectionLabelStyle: CSSProperties = {
  fontFamily: "'IBM Plex Arabic', sans-serif",
  fontSize: '16px',
  fontWeight: 700,
  color: '#FFD700',
  marginBottom: '10px',
};

/* Product picker */
const productGridStyle: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(3, 1fr)',
  gap: '10px',
  marginBottom: '22px',
};

const productCardBase: CSSProperties = {
  display: 'flex',
  flexDirection: 'column' as const,
  alignItems: 'center',
  gap: '6px',
  padding: '20px 12px',
  borderRadius: 'var(--r)',
  border: '2px solid rgba(255,255,255,0.12)',
  background: 'rgba(255,255,255,0.04)',
  cursor: 'pointer',
  transition: 'all 0.18s',
};

/* Slider section */
const sliderBoxStyle: CSSProperties = {
  background: 'rgba(255,255,255,0.04)',
  border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: 'var(--r)',
  padding: '18px',
  marginBottom: '22px',
};

const sliderStyle: CSSProperties = {
  width: '100%',
  height: '8px',
  cursor: 'pointer',
  accentColor: '#FFB300',
  marginTop: '10px',
  marginBottom: '10px',
};

const liveProfitStyle = (profit: number): CSSProperties => ({
  fontFamily: "'IBM Plex Arabic', sans-serif",
  fontSize: '15px',
  fontWeight: 700,
  color: profit > 0 ? 'var(--green-lt)' : profit === 0 ? '#FFB300' : '#EF9A9A',
  textAlign: 'center',
  marginTop: '6px',
});

/* Sell button */
const sellBtnStyle: CSSProperties = {
  width: '100%',
  padding: '14px',
  borderRadius: 'var(--r)',
  background: 'linear-gradient(135deg, #FFB300, #E65100)',
  color: 'white',
  fontFamily: "'IBM Plex Arabic', sans-serif",
  fontSize: '16px',
  fontWeight: 800,
  border: 'none',
  cursor: 'pointer',
  transition: 'opacity 0.2s',
};

/* Results */
const resultHeadingStyle: CSSProperties = {
  fontFamily: "'IBM Plex Arabic', sans-serif",
  fontSize: '20px',
  fontWeight: 800,
  color: 'white',
  textAlign: 'center',
  marginBottom: '18px',
};

const statGridStyle: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(3, 1fr)',
  gap: '8px',
  marginBottom: '18px',
};

const statBoxStyle = (color: string, bg: string): CSSProperties => ({
  borderRadius: 'var(--r)',
  padding: '12px 8px',
  background: bg,
  border: `1px solid ${color}44`,
  textAlign: 'center',
});

const statValueStyle = (color: string): CSSProperties => ({
  fontFamily: "'IBM Plex Arabic', sans-serif",
  fontSize: '22px',
  fontWeight: 900,
  color,
  display: 'block',
  marginBottom: '2px',
});

const statLabelStyle: CSSProperties = {
  fontFamily: "'IBM Plex Arabic', sans-serif",
  fontSize: '11px',
  color: 'rgba(255,255,255,0.45)',
};

const customerRowStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  padding: '9px 12px',
  borderRadius: 'var(--r)',
  marginBottom: '6px',
  fontFamily: "'IBM Plex Arabic', sans-serif",
  fontSize: '13px',
};

const feedbackBoxStyle = (good: boolean): CSSProperties => ({
  borderRadius: 'var(--r)',
  padding: '14px 16px',
  marginBottom: '14px',
  fontFamily: "'IBM Plex Arabic', sans-serif",
  fontSize: '15px',
  lineHeight: 1.8,
  color: good ? '#A5D6A7' : '#FFE082',
  background: good ? 'rgba(46,125,50,0.15)' : 'rgba(249,168,37,0.1)',
  border: good ? '1px solid rgba(102,187,106,0.3)' : '1px solid rgba(249,168,37,0.25)',
  animation: 'popIn 0.4s cubic-bezier(0.34,1.56,0.64,1)',
});

const hintLineStyle: CSSProperties = {
  marginTop: '10px',
  paddingTop: '10px',
  borderTop: '1px solid rgba(255,255,255,0.1)',
  fontSize: '14px',
  opacity: 0.85,
};

const actionRowStyle: CSSProperties = {
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

// personalBudget is accepted for API consistency but capital is fixed at 20 ₪ for this simulation
export default function JuiceStandSimulation({ onComplete }: JuiceStandSimulationProps) {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [sellingPrice, setSellingPrice]       = useState(5);
  const [phase, setPhase]                     = useState<'setup' | 'results'>('setup');
  const [done, setDone]                       = useState(false);

  /* ── Live profit per cup ── */
  const profitPerCup = selectedProduct ? sellingPrice - selectedProduct.cost : 0;

  /* ── Simulate results (stable per price+product combo) ── */
  const results = useMemo(() => {
    if (!selectedProduct) return null;
    return CUSTOMERS.map(c => ({
      customer: c,
      bought: sellingPrice <= c.maxBudget,
    }));
  }, [selectedProduct, sellingPrice]);

  const soldCount    = results ? results.filter(r => r.bought).length : 0;
  const totalRevenue = soldCount * sellingPrice;
  const totalCost    = soldCount * (selectedProduct?.cost ?? 0);
  const netProfit    = totalRevenue - totalCost;

  /* ── Counterfactual: how many extra cups at price-1 ── */
  const extraAtLower = useMemo(() => {
    if (!selectedProduct || sellingPrice <= 1) return 0;
    const lowerPrice  = sellingPrice - 1;
    const soldAtLower = CUSTOMERS.filter(c => lowerPrice <= c.maxBudget).length;
    return soldAtLower - soldCount;
  }, [selectedProduct, sellingPrice, soldCount]);

  const handleSell = () => setPhase('results');

  // retry with the same product — just go back to price slider
  const handleRetrySame = () => {
    setSellingPrice(selectedProduct?.suggestedPrice ?? 5);
    setPhase('setup');
  };

  // change product — full reset
  const handleRetry = () => {
    setSelectedProduct(null);
    setSellingPrice(5);
    setPhase('setup');
  };

  const handleComplete = () => {
    setDone(true);
    onComplete();
  };

  /* ─────── SETUP PHASE ─────── */
  if (phase === 'setup') {
    return (
      <div style={wrapStyle}>
        <div style={headingStyle}><span>🎮</span> جرّب بنفسك — عصير خالد</div>
        <div style={subStyle}>
          عندك رأس مال 20 ₪. اختر منتجك وحدد سعرك، ثم بِع لـ5 زبائن!
        </div>

        {/* Capital badge */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          background: 'rgba(255,193,7,0.1)',
          border: '1px solid rgba(255,193,7,0.3)',
          borderRadius: '20px',
          padding: '4px 14px',
          fontFamily: "'IBM Plex Arabic', sans-serif",
          fontSize: '14px',
          fontWeight: 700,
          color: '#FFD54F',
          marginBottom: '20px',
        }}>
          💰 رأس المال: {CAPITAL} ₪
        </div>

        {/* Step 1: pick product */}
        <div style={sectionLabelStyle}>الخطوة 1 — اختر منتجك</div>
        <div style={productGridStyle}>
          {PRODUCTS.map(p => {
            const selected = selectedProduct?.id === p.id;
            return (
              <button
                key={p.id}
                style={{
                  ...productCardBase,
                  borderColor: selected ? '#FFB300' : 'rgba(255,255,255,0.12)',
                  background:  selected ? 'rgba(255,179,0,0.12)' : 'rgba(255,255,255,0.04)',
                  boxShadow:   selected ? '0 0 12px rgba(255,179,0,0.2)' : 'none',
                }}
                onClick={() => {
                  setSelectedProduct(p);
                  setSellingPrice(p.suggestedPrice);
                }}
              >
                <span style={{ fontSize: '34px' }}>{p.emoji}</span>
                <span style={{
                  fontFamily: "'IBM Plex Arabic', sans-serif",
                  fontSize: '18px',
                  fontWeight: 700,
                  color: 'white',
                  textAlign: 'center',
                }}>
                  {p.nameAr}
                </span>
                <span style={{
                  fontFamily: "'IBM Plex Arabic', sans-serif",
                  fontSize: '16px',
                  fontWeight: 700,
                  color: '#00ff88',
                }}>
                  تكلفة: {p.cost} ₪
                </span>
              </button>
            );
          })}
        </div>

        {/* Step 2: set price */}
        {selectedProduct && (
          <>
            <div style={sectionLabelStyle}>الخطوة 2 — حدد سعر البيع</div>
            <div style={sliderBoxStyle}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
                <span style={{
                  fontFamily: "'IBM Plex Arabic', sans-serif",
                  fontSize: '13px',
                  color: 'rgba(255,255,255,0.5)',
                }}>
                  السعر المقترح: {selectedProduct.suggestedPrice} ₪
                </span>
                <span style={{
                  fontFamily: "'IBM Plex Arabic', sans-serif",
                  fontSize: '26px',
                  fontWeight: 900,
                  color: '#FFD54F',
                }}>
                  {sellingPrice} ₪
                </span>
              </div>

              <input
                type="range"
                min={1}
                max={15}
                value={sellingPrice}
                onChange={e => setSellingPrice(Number(e.target.value))}
                style={sliderStyle}
              />

              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontFamily: "'IBM Plex Arabic', sans-serif", fontSize: '11px', color: 'rgba(255,255,255,0.3)' }}>1 ₪</span>
                <span style={{ fontFamily: "'IBM Plex Arabic', sans-serif", fontSize: '11px', color: 'rgba(255,255,255,0.3)' }}>15 ₪</span>
              </div>

              <div style={liveProfitStyle(profitPerCup)}>
                {profitPerCup > 0
                  ? `ربحك لكل كأس: +${profitPerCup} ₪ 📈`
                  : profitPerCup === 0
                    ? 'تعادل — لا ربح ولا خسارة ⚖️'
                    : 'هيك رح تخسر على كل كأس! ⚠️'}
              </div>

              {/* Live customer preview */}
              <div style={{
                marginTop: '12px',
                padding: '10px',
                borderRadius: 'var(--r)',
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.06)',
                fontFamily: "'IBM Plex Arabic', sans-serif",
                fontSize: '13px',
                color: 'rgba(255,255,255,0.55)',
                textAlign: 'center',
              }}>
                {results && (
                  <>
                    بهذا السعر: <strong style={{ color: 'var(--green-lt)' }}>{soldCount}</strong> من 5 زبائن سيشترون
                    {soldCount === 0 && ' — السعر غالٍ على الجميع!'}
                  </>
                )}
              </div>
            </div>

            <button style={sellBtnStyle} onClick={handleSell}>
              🛒 ابدأ البيع!
            </button>
          </>
        )}
      </div>
    );
  }

  /* ─────── RESULTS PHASE ─────── */
  const isProfit = netProfit > 0;

  return (
    <div style={wrapStyle}>
      <div style={resultHeadingStyle}>
        {selectedProduct!.emoji} نتائج يوم البيع
      </div>

      {/* Stats */}
      <div style={statGridStyle}>
        <div style={statBoxStyle('#64B5F6', 'rgba(33,150,243,0.08)')}>
          <span style={statValueStyle('#90CAF9')}>{totalRevenue} ₪</span>
          <span style={statLabelStyle}>إجمالي المبيعات</span>
        </div>
        <div style={statBoxStyle('#EF5350', 'rgba(239,83,80,0.08)')}>
          <span style={statValueStyle('#EF9A9A')}>{totalCost} ₪</span>
          <span style={statLabelStyle}>إجمالي التكلفة</span>
        </div>
        <div style={statBoxStyle(
          isProfit ? '#66BB6A' : '#FFB300',
          isProfit ? 'rgba(102,187,106,0.1)' : 'rgba(255,179,0,0.08)',
        )}>
          <span style={statValueStyle(isProfit ? 'var(--green-lt)' : '#FFD54F')}>
            {netProfit >= 0 ? '+' : ''}{netProfit} ₪
          </span>
          <span style={statLabelStyle}>{isProfit ? 'صافي الربح' : 'خسارة / تعادل'}</span>
        </div>
      </div>

      {/* Customer breakdown */}
      <div style={{
        fontFamily: "'IBM Plex Arabic', sans-serif",
        fontSize: '13px',
        fontWeight: 700,
        color: 'rgba(255,255,255,0.45)',
        marginBottom: '8px',
      }}>
        الزبائن الخمسة
      </div>
      <div style={{ marginBottom: '16px' }}>
        {results!.map(r => (
          <div key={r.customer.id} style={{
            ...customerRowStyle,
            background: r.bought ? 'rgba(102,187,106,0.08)' : 'rgba(255,255,255,0.03)',
            border: `1px solid ${r.bought ? 'rgba(102,187,106,0.2)' : 'rgba(255,255,255,0.06)'}`,
          }}>
            <span style={{ fontSize: '18px', flexShrink: 0 }}>{r.customer.emoji}</span>
            <span style={{ fontWeight: 700, color: 'rgba(255,255,255,0.8)', flexShrink: 0 }}>
              {r.customer.nameAr}
            </span>
            <span style={{ flex: 1, color: r.bought ? 'var(--green-lt)' : 'rgba(255,255,255,0.4)' }}>
              {r.bought
                ? `✅ اشترى بـ ${sellingPrice} ₪`
                : `😕 ${r.customer.comment}`}
            </span>
            {r.bought && (
              <span style={{
                fontFamily: "'IBM Plex Arabic', sans-serif",
                fontSize: '13px',
                fontWeight: 800,
                color: 'var(--green-lt)',
                flexShrink: 0,
              }}>
                +{profitPerCup} ₪
              </span>
            )}
          </div>
        ))}
      </div>

      {/* Feedback + counterfactual */}
      <div style={feedbackBoxStyle(isProfit)}>
        {isProfit
          ? `🎉 أحسنت! بعت ${soldCount} كأسات وربحت ${netProfit} ₪ صافياً. هذا هو الربح الحقيقي!`
          : netProfit === 0
            ? `⚖️ تعادلت — لا ربح ولا خسارة. حاول رفع السعر قليلاً مع الحفاظ على الزبائن.`
            : `📉 خسرت ${Math.abs(netProfit)} ₪ لأن التكلفة أعلى من الإيراد. ارفع السعر أو اخفّض التكلفة.`}
        {extraAtLower > 0 && (
          <div style={hintLineStyle}>
            💡 لو خفّضت السعر ₪1 (إلى {sellingPrice - 1} ₪)، كنت ستبيع {extraAtLower} {extraAtLower === 1 ? 'كأس' : 'كأسات'} أكثر
          </div>
        )}
        {extraAtLower === 0 && soldCount < CUSTOMERS.length && sellingPrice > 1 && (
          <div style={hintLineStyle}>
            💡 حتى بخفض السعر ₪1، لن يتغير عدد الزبائن — السعر الحالي هو الأمثل.
          </div>
        )}
      </div>

      {/* Actions */}
      <div style={actionRowStyle}>
        <button style={retryBtnStyle} onClick={handleRetrySame}>
          🔄 جرّب مرة ثانية
        </button>
        <button style={retryBtnStyle} onClick={handleRetry}>
          🔀 غيّر المنتج
        </button>
      </div>
      <div style={{ marginTop: '10px' }}>
        <button
          style={{ ...completeBtnStyle, width: '100%', opacity: done ? 0.6 : 1, cursor: done ? 'default' : 'pointer' }}
          onClick={handleComplete}
          disabled={done}
        >
          {done ? '✔ أكملت النشاط' : '✅ أكملت النشاط'}
        </button>
      </div>
    </div>
  );
}
