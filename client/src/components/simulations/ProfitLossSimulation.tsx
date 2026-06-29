import { useState, type CSSProperties } from 'react';

/* ─────────────────────────────────────────────
   Data
───────────────────────────────────────────── */

interface Product {
  id: string;
  emoji: string;
  nameAr: string;
  cost: number;
}

const PRODUCTS: Product[] = [
  { id: 'cake',      emoji: '🧁', nameAr: 'كيك منزلي',     cost: 8  },
  { id: 'juice',     emoji: '🧃', nameAr: 'عصير طبيعي',    cost: 5  },
  { id: 'accessory', emoji: '📿', nameAr: 'إكسسوار يدوي',  cost: 12 },
];

/* ─────────────────────────────────────────────
   Props
───────────────────────────────────────────── */

interface ProfitLossSimulationProps {
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

const sectionLabelStyle: CSSProperties = {
  fontFamily: "'IBM Plex Arabic', sans-serif",
  fontSize: '16px',
  fontWeight: 700,
  color: '#FFD700',
  marginBottom: '10px',
};

const productCardBase = (selected: boolean): CSSProperties => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '5px',
  padding: '14px 8px',
  borderRadius: 'var(--r)',
  border: `2px solid ${selected ? '#FFB300' : 'rgba(255,255,255,0.12)'}`,
  background: selected ? 'rgba(255,179,0,0.12)' : 'rgba(255,255,255,0.04)',
  boxShadow: selected ? '0 0 12px rgba(255,179,0,0.2)' : 'none',
  cursor: 'pointer',
  transition: 'all 0.18s',
  flex: 1,
});

const sliderBoxStyle: CSSProperties = {
  background: 'rgba(255,255,255,0.04)',
  border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: 'var(--r)',
  padding: '18px',
  marginBottom: '16px',
};

const sliderStyle: CSSProperties = {
  width: '100%',
  height: '8px',
  cursor: 'pointer',
  accentColor: '#FFB300',
  marginTop: '10px',
  marginBottom: '10px',
};

const liveStatStyle = (positive: boolean | null): CSSProperties => ({
  fontFamily: "'IBM Plex Arabic', sans-serif",
  fontSize: '15px',
  fontWeight: 700,
  color: positive === null ? 'rgba(255,255,255,0.6)'
       : positive         ? 'var(--green-lt)'
                          : '#EF9A9A',
  textAlign: 'center',
  marginTop: '6px',
  transition: 'color 0.2s',
});

const hintTextStyle: CSSProperties = {
  fontFamily: "'IBM Plex Arabic', sans-serif",
  fontSize: '12px',
  color: 'rgba(255,255,255,0.35)',
  textAlign: 'center',
  marginTop: '4px',
};

const statRowStyle: CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  fontFamily: "'IBM Plex Arabic', sans-serif",
  fontSize: '14px',
  fontWeight: 700,
  color: 'rgba(255,255,255,0.6)',
  marginBottom: '8px',
};

const primaryBtnStyle: CSSProperties = {
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
  marginTop: '8px',
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
export default function ProfitLossSimulation({ onComplete }: ProfitLossSimulationProps) {
  const [product, setProduct]       = useState<Product | null>(null);
  const [price, setPrice]           = useState(10);
  const [qty, setQty]               = useState(5);
  const [phase, setPhase]           = useState<'setup' | 'results'>('setup');
  const [done, setDone]             = useState(false);

  /* ── Derived ── */
  const cost         = product?.cost ?? 0;
  const profitPerUnit = price - cost;
  const totalRevenue = price * qty;
  const totalCost    = cost * qty;
  const netProfit    = totalRevenue - totalCost;

  // Break-even: how many units to sell to cover cost (only meaningful if price > cost)
  const breakEven = profitPerUnit > 0 ? Math.ceil(cost / profitPerUnit) : null;

  const handleSell = () => setPhase('results');

  const handleRetry = () => {
    setProduct(null);
    setPrice(10);
    setQty(5);
    setPhase('setup');
    setDone(false);
  };

  const handleComplete = () => {
    setDone(true);
    onComplete();
  };

  /* ─────── SETUP PHASE ─────── */
  if (phase === 'setup') {
    return (
      <div style={wrapStyle}>
        <div style={headingStyle}><span>🎮</span> جرّب بنفسك — حدد سعرك واعرف نتيجتك</div>
        <div style={subStyle}>اختر منتجك، حدد سعر البيع وعدد القطع، وشوف إذا ربحت أو خسرت!</div>

        {/* Step 1 — pick product */}
        <div style={sectionLabelStyle}>الخطوة 1 — اختر المنتج</div>
        <div style={{ display: 'flex', gap: '10px', marginBottom: '22px' }}>
          {PRODUCTS.map(p => (
            <button
              key={p.id}
              style={productCardBase(product?.id === p.id)}
              onClick={() => { setProduct(p); setPrice(Math.max(p.cost + 1, price)); }}
            >
              <span style={{ fontSize: '28px' }}>{p.emoji}</span>
              <span style={{
                fontFamily: "'IBM Plex Arabic', sans-serif",
                fontSize: '18px',
                fontWeight: 700,
                color: '#FFFFFF',
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
          ))}
        </div>

        {product && (
          <>
            {/* Step 2 — price slider */}
            <div style={sectionLabelStyle}>الخطوة 2 — حدد سعر البيع</div>
            <div style={sliderBoxStyle}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontFamily: "'IBM Plex Arabic', sans-serif", fontSize: '13px', color: 'rgba(255,255,255,0.5)' }}>
                  تكلفة الصنع: {product.cost} ₪
                </span>
                <span style={{ fontFamily: "'IBM Plex Arabic', sans-serif", fontSize: '26px', fontWeight: 900, color: '#FFD54F' }}>
                  {price} ₪
                </span>
              </div>
              <input
                type="range"
                min={1}
                max={50}
                value={price}
                onChange={e => setPrice(Number(e.target.value))}
                style={sliderStyle}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontFamily: "'IBM Plex Arabic', sans-serif", fontSize: '11px', color: 'rgba(255,255,255,0.3)' }}>1 ₪</span>
                <span style={{ fontFamily: "'IBM Plex Arabic', sans-serif", fontSize: '11px', color: 'rgba(255,255,255,0.3)' }}>50 ₪</span>
              </div>
              <div style={liveStatStyle(profitPerUnit > 0 ? true : profitPerUnit < 0 ? false : null)}>
                {profitPerUnit > 0
                  ? `ربحك لكل قطعة: +${profitPerUnit} ₪ 📈`
                  : profitPerUnit === 0
                    ? 'تعادل — لا ربح ولا خسارة ⚖️'
                    : `خسارة لكل قطعة: ${profitPerUnit} ₪ 📉`}
              </div>
              <div style={hintTextStyle}>
                عشان تغطي التكلفة لازم تبيع بأكثر من {product.cost} ₪
              </div>
            </div>

            {/* Step 3 — quantity slider */}
            <div style={sectionLabelStyle}>الخطوة 3 — كم قطعة رح تبيع؟</div>
            <div style={sliderBoxStyle}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontFamily: "'IBM Plex Arabic', sans-serif", fontSize: '13px', color: 'rgba(255,255,255,0.5)' }}>
                  عدد القطع
                </span>
                <span style={{ fontFamily: "'IBM Plex Arabic', sans-serif", fontSize: '26px', fontWeight: 900, color: '#FFD54F' }}>
                  {qty}
                </span>
              </div>
              <input
                type="range"
                min={1}
                max={20}
                value={qty}
                onChange={e => setQty(Number(e.target.value))}
                style={sliderStyle}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontFamily: "'IBM Plex Arabic', sans-serif", fontSize: '11px', color: 'rgba(255,255,255,0.3)' }}>1</span>
                <span style={{ fontFamily: "'IBM Plex Arabic', sans-serif", fontSize: '11px', color: 'rgba(255,255,255,0.3)' }}>20</span>
              </div>

              {/* Live totals */}
              <div style={{ marginTop: '12px', padding: '12px', borderRadius: 'var(--r)', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div style={statRowStyle}>
                  <span>إجمالي الإيراد</span>
                  <strong style={{ color: 'white' }}>{totalRevenue} ₪</strong>
                </div>
                <div style={statRowStyle}>
                  <span>إجمالي التكلفة</span>
                  <strong style={{ color: '#EF9A9A' }}>{totalCost} ₪</strong>
                </div>
                <div style={{ ...statRowStyle, marginBottom: 0, paddingTop: '8px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                  <span style={{ fontWeight: 800, color: 'white' }}>
                    {netProfit >= 0 ? 'الربح الصافي' : 'الخسارة'}
                  </span>
                  <strong style={{ fontSize: '18px', color: netProfit > 0 ? 'var(--green-lt)' : netProfit < 0 ? '#EF9A9A' : '#FFB300' }}>
                    {netProfit >= 0 ? '+' : ''}{netProfit} ₪
                  </strong>
                </div>
              </div>
            </div>

            {/* Break-even visual */}
            <div style={sectionLabelStyle}>نقطة التعادل</div>
            <div style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 'var(--r)',
              padding: '16px',
              marginBottom: '16px',
            }}>
              {profitPerUnit <= 0 ? (
                <div style={{ fontFamily: "'IBM Plex Arabic', sans-serif", fontSize: '13px', color: '#EF9A9A', textAlign: 'center' }}>
                  ⚠️ لما السعر أقل أو يساوي التكلفة، ما في نقطة تعادل — كل قطعة خسارة!
                </div>
              ) : (
                <>
                  <div style={{ fontFamily: "'IBM Plex Arabic', sans-serif", fontSize: '13px', color: 'rgba(255,255,255,0.6)', marginBottom: '10px', textAlign: 'center' }}>
                    نقطة التعادل: تحتاج تبيع <strong style={{ color: 'white' }}>{breakEven}</strong> قطعة عشان ما تخسر
                  </div>
                  {/* Bar showing break-even vs chosen qty */}
                  {(() => {
                    const maxBar  = Math.max(20, (breakEven ?? 0) + 5, qty + 2);
                    const bePct   = Math.min(100, ((breakEven ?? 0) / maxBar) * 100);
                    const qtyPct  = Math.min(100, (qty / maxBar) * 100);
                    const ahead   = qty >= (breakEven ?? 0);
                    return (
                      <div style={{ position: 'relative' }}>
                        {/* Track */}
                        <div style={{ background: 'rgba(255,255,255,0.06)', borderRadius: '8px', height: '14px', overflow: 'hidden', position: 'relative' }}>
                          {/* Qty fill */}
                          <div style={{
                            position: 'absolute', left: 0, top: 0, bottom: 0,
                            width: `${qtyPct}%`,
                            background: ahead ? 'var(--green)' : '#EF5350',
                            borderRadius: '8px',
                            transition: 'width 0.3s',
                          }} />
                          {/* Break-even marker */}
                          <div style={{
                            position: 'absolute', top: 0, bottom: 0,
                            left: `${bePct}%`,
                            width: '3px',
                            background: '#FFB300',
                            transform: 'translateX(-50%)',
                          }} />
                        </div>
                        {/* Labels */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px', fontFamily: "'IBM Plex Arabic', sans-serif", fontSize: '11px' }}>
                          <span style={{ color: ahead ? 'var(--green-lt)' : '#EF9A9A' }}>أنت: {qty} قطعة</span>
                          <span style={{ color: '#FFD54F' }}>🟡 التعادل: {breakEven} قطعة</span>
                        </div>
                      </div>
                    );
                  })()}
                </>
              )}
            </div>

            <button style={primaryBtnStyle} onClick={handleSell}>
              📊 شوف النتيجة
            </button>
          </>
        )}
      </div>
    );
  }

  /* ─────── RESULTS PHASE ─────── */
  const verdictMsg =
    netProfit > 0  ? 'أنت في الربح! قرارك كان ذكي 🎉' :
    netProfit < 0  ? 'خسرت هالمرة — جرّب ترفع السعر أو تبيع أكثر 💡' :
                     'وصلت لنقطة التعادل — لا ربح ولا خسارة 👌';
  const verdictColor =
    netProfit > 0 ? '#A5D6A7' :
    netProfit < 0 ? '#EF9A9A' :
                    '#FFD54F';
  const verdictBg =
    netProfit > 0 ? 'rgba(46,125,50,0.15)' :
    netProfit < 0 ? 'rgba(183,28,28,0.15)' :
                    'rgba(255,193,7,0.08)';
  const verdictBorder =
    netProfit > 0 ? '1px solid rgba(102,187,106,0.3)' :
    netProfit < 0 ? '1px solid rgba(239,83,80,0.3)' :
                    '1px solid rgba(255,193,7,0.2)';

  return (
    <div style={wrapStyle}>
      <div style={{ fontFamily: "'IBM Plex Arabic', sans-serif", fontSize: '21px', fontWeight: 900, color: 'white', textAlign: 'center', marginBottom: '18px' }}>
        {product!.emoji} نتيجة مشروعك
      </div>

      {/* Verdict */}
      <div style={{
        borderRadius: 'var(--r)',
        padding: '20px 16px',
        marginBottom: '16px',
        textAlign: 'center',
        fontFamily: "'IBM Plex Arabic', sans-serif",
        fontSize: '18px',
        fontWeight: 800,
        color: verdictColor,
        background: verdictBg,
        border: verdictBorder,
        animation: 'popIn 0.5s cubic-bezier(0.34,1.56,0.64,1)',
      }}>
        {verdictMsg}
      </div>

      {/* Summary stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '8px', marginBottom: '16px' }}>
        {[
          { label: 'السعر', value: `${price} ₪`, color: '#FFD54F' },
          { label: 'الكمية', value: `${qty} قطعة`, color: '#90CAF9' },
          { label: netProfit >= 0 ? 'الربح' : 'الخسارة', value: `${netProfit >= 0 ? '+' : ''}${netProfit} ₪`, color: verdictColor },
        ].map(s => (
          <div key={s.label} style={{
            borderRadius: 'var(--r)',
            padding: '12px 8px',
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.08)',
            textAlign: 'center',
          }}>
            <div style={{ fontFamily: "'IBM Plex Arabic', sans-serif", fontSize: '22px', fontWeight: 900, color: s.color, marginBottom: '2px' }}>{s.value}</div>
            <div style={{ fontFamily: "'IBM Plex Arabic', sans-serif", fontSize: '11px', color: 'rgba(255,255,255,0.4)' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Detailed breakdown */}
      <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 'var(--r)', padding: '14px 16px', marginBottom: '16px' }}>
        <div style={statRowStyle}><span>إجمالي الإيراد ({qty} × {price} ₪)</span><strong style={{ color: 'white' }}>{totalRevenue} ₪</strong></div>
        <div style={statRowStyle}><span>إجمالي التكلفة ({qty} × {product!.cost} ₪)</span><strong style={{ color: '#EF9A9A' }}>{totalCost} ₪</strong></div>
        {breakEven !== null && (
          <div style={{ ...statRowStyle, marginBottom: 0, paddingTop: '8px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
            <span style={{ color: 'rgba(255,255,255,0.5)' }}>نقطة التعادل</span>
            <strong style={{ color: '#FFD54F' }}>{breakEven} قطعة</strong>
          </div>
        )}
      </div>

      {/* Buttons */}
      <div style={{ display: 'flex', gap: '10px' }}>
        <button style={retryBtnStyle} onClick={handleRetry}>🔄 جرّب مرة ثانية</button>
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
