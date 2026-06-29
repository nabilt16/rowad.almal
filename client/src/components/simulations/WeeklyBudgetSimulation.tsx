import { useState, type CSSProperties } from 'react';

/* ─────────────────────────────────────────────
   Data
───────────────────────────────────────────── */

const BUDGET = 30;

const DAYS_FULL  = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
const DAYS_SHORT = ['أحد', 'اثن', 'ثلا', 'أرب', 'خمي', 'جمع', 'سبت'];

const EVENT_POOL = [
  { text: 'اشتريت عصيراً بارداً من البوفيه',       icon: '🧃', price: 3 },
  { text: 'نسيت غداءك واشتريت ساندويتش',          icon: '🥪', price: 5 },
  { text: 'أراد صديقك تناول الآيس كريم معاً',     icon: '🍦', price: 4 },
  { text: 'احتجت قلماً جديداً للمدرسة',           icon: '✏️', price: 3 },
  { text: 'وجدت كتاباً مثيراً في المكتبة',        icon: '📚', price: 6 },
  { text: 'أردت شراء شيبس في الاستراحة',          icon: '🍟', price: 2 },
  { text: 'احتجت مواصلات إضافية للعودة',          icon: '🚌', price: 4 },
  { text: 'دعوت صديقك لشراء عصير',               icon: '🥤', price: 5 },
  { text: 'رأيت لعبة صغيرة وأعجبتك',             icon: '🎮', price: 7 },
  { text: 'اشتريت دفتراً للرسم',                  icon: '📒', price: 4 },
  { text: 'أكلت فطيرة في البوفيه',                 icon: '🥐', price: 3 },
  { text: 'احتجت مستلزمات مدرسية طارئة',          icon: '🖊️', price: 5 },
  { text: 'رأيت ملصقات جميلة أعجبتك',             icon: '🎀', price: 3 },
  { text: 'أردت شراء هدية صغيرة لصديق',           icon: '🎁', price: 8 },
];

interface DayEvent {
  dayFull:  string;
  dayShort: string;
  text:     string;
  icon:     string;
  price:    number;
}

type Decision = 'paid' | 'skipped';

function generateEvents(): DayEvent[] {
  const shuffled = [...EVENT_POOL].sort(() => Math.random() - 0.5);
  return DAYS_FULL.map((dayFull, i) => ({
    dayFull,
    dayShort: DAYS_SHORT[i],
    text:  shuffled[i].text,
    icon:  shuffled[i].icon,
    price: shuffled[i].price,
  }));
}

/* ─────────────────────────────────────────────
   Props
───────────────────────────────────────────── */

interface WeeklyBudgetSimulationProps {
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

/* Budget bar */
const budgetBoxStyle: CSSProperties = {
  background: 'rgba(255,255,255,0.05)',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: 'var(--r)',
  padding: '12px 16px',
  marginBottom: '18px',
};

const budgetLabelStyle: CSSProperties = {
  fontFamily: "'IBM Plex Arabic', sans-serif",
  fontSize: '16px',
  color: '#E0E0E0',
  display: 'flex',
  justifyContent: 'space-between',
  marginBottom: '6px',
};

const trackStyle: CSSProperties = {
  height: '8px',
  borderRadius: '999px',
  background: 'rgba(255,255,255,0.1)',
  overflow: 'hidden',
  marginBottom: '6px',
};

/* Day strip */
const stripStyle: CSSProperties = {
  display: 'flex',
  gap: '6px',
  overflowX: 'auto' as const,
  paddingBottom: '4px',
  marginBottom: '18px',
};

const dayPillBase: CSSProperties = {
  flex: '0 0 auto',
  width: '46px',
  display: 'flex',
  flexDirection: 'column' as const,
  alignItems: 'center',
  padding: '8px 4px',
  borderRadius: 'var(--r)',
  border: '2px solid rgba(255,255,255,0.1)',
  background: 'rgba(255,255,255,0.02)',
  transition: 'all 0.2s',
};

/* Event card */
const eventCardStyle: CSSProperties = {
  background: 'rgba(255,193,7,0.07)',
  border: '1px solid rgba(255,193,7,0.25)',
  borderRadius: 'var(--r)',
  padding: '18px',
  marginBottom: '16px',
  animation: 'popIn 0.35s cubic-bezier(0.34,1.56,0.64,1)',
};

const eventTextStyle: CSSProperties = {
  fontFamily: "'IBM Plex Arabic', sans-serif",
  fontSize: '17px',
  fontWeight: 700,
  color: 'rgba(255,255,255,0.92)',
  marginBottom: '10px',
  lineHeight: 1.6,
};

const priceBadgeStyle: CSSProperties = {
  display: 'inline-block',
  background: 'rgba(255,193,7,0.15)',
  border: '1px solid rgba(255,193,7,0.3)',
  borderRadius: '20px',
  padding: '3px 12px',
  fontFamily: "'IBM Plex Arabic', sans-serif",
  fontSize: '15px',
  fontWeight: 800,
  color: '#FFD54F',
};

const btnRowStyle: CSSProperties = {
  display: 'flex',
  gap: '10px',
  marginTop: '14px',
};

const payBtnStyle: CSSProperties = {
  flex: 1,
  padding: '12px',
  borderRadius: 'var(--r)',
  background: 'linear-gradient(135deg, var(--green), #1B5E20)',
  color: 'white',
  fontFamily: "'IBM Plex Arabic', sans-serif",
  fontSize: '15px',
  fontWeight: 700,
  border: 'none',
  cursor: 'pointer',
  transition: 'opacity 0.2s',
};

const skipBtnStyle: CSSProperties = {
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

/* Results */
const resultHeadingStyle: CSSProperties = {
  fontFamily: "'IBM Plex Arabic', sans-serif",
  fontSize: '20px',
  fontWeight: 800,
  color: 'white',
  textAlign: 'center',
  marginBottom: '16px',
};

const summaryRowStyle: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: '10px',
  marginBottom: '16px',
};

const summaryBoxStyle = (color: string, bg: string): CSSProperties => ({
  borderRadius: 'var(--r)',
  padding: '14px',
  background: bg,
  border: `1px solid ${color}44`,
  textAlign: 'center',
});

const summaryValueStyle = (color: string): CSSProperties => ({
  fontFamily: "'IBM Plex Arabic', sans-serif",
  fontSize: '26px',
  fontWeight: 900,
  color,
  display: 'block',
  marginBottom: '2px',
});

const summaryLabelStyle: CSSProperties = {
  fontFamily: "'IBM Plex Arabic', sans-serif",
  fontSize: '12px',
  color: 'rgba(255,255,255,0.5)',
};

const dayRowStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  padding: '9px 12px',
  borderRadius: 'var(--r)',
  marginBottom: '6px',
  fontFamily: "'IBM Plex Arabic', sans-serif",
  fontSize: '14px',
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

export default function WeeklyBudgetSimulation({ onComplete, personalBudget }: WeeklyBudgetSimulationProps) {
  const budget = personalBudget ?? BUDGET;
  const [events, setEvents]           = useState<DayEvent[]>(() => generateEvents());
  const [decisions, setDecisions]     = useState<Decision[]>([]);
  const [remaining, setRemaining]     = useState(budget);
  const [currentDay, setCurrentDay]   = useState(0);
  const [phase, setPhase]             = useState<'week' | 'results'>('week');
  const [ranOutOnDay, setRanOutOnDay] = useState<number | null>(null);
  const [done, setDone]               = useState(false);

  /* ── Derived ── */
  const event    = events[currentDay];
  const canAfford = remaining >= event?.price;
  const budgetPct = (remaining / budget) * 100;
  const budgetColor = remaining <= 4 ? '#EF5350' : remaining <= 10 ? '#FFB300' : 'var(--green-lt)';

  /* ── advance to next day or results ── */
  const advance = (decision: Decision, newRemaining: number) => {
    const newDecisions = [...decisions, decision];
    setDecisions(newDecisions);
    setRemaining(newRemaining);

    if (newRemaining === 0 && currentDay < 6 && ranOutOnDay === null) {
      setRanOutOnDay(currentDay);
    }

    if (currentDay === 6) {
      setPhase('results');
    } else {
      setCurrentDay(d => d + 1);
    }
  };

  const handlePay  = () => advance('paid',    remaining - event.price);
  const handleSkip = () => advance('skipped', remaining);

  /* ── retry with fresh events ── */
  const handleRetry = () => {
    setEvents(generateEvents());
    setDecisions([]);
    setRemaining(budget);
    setCurrentDay(0);
    setPhase('week');
    setRanOutOnDay(null);
  };

  const handleComplete = () => {
    setDone(true);
    onComplete();
  };

  /* ── Results derived ── */
  const spent = budget - remaining;
  const saved = remaining;

  const getFeedback = () => {
    if (ranOutOnDay !== null) {
      return {
        good: false,
        text: `في يوم ${events[ranOutOnDay].dayFull} نفد المال بعد "${events[ranOutOnDay].text}" — هل كان القرار يستحق؟`,
      };
    }
    if (saved === 0) {
      return {
        good: false,
        text: 'صرفت كل المصروف! الأسبوع القادم حاول أن تتخطى بعض الإغراءات وتوفر شيئاً.',
      };
    }
    return {
      good: true,
      text: `وفّرت ${saved} ₪ هذا الأسبوع — أنت مخطط ذكي! 🌟`,
    };
  };

  /* ═══════════════════════════════════════
     WEEK PHASE
  ═══════════════════════════════════════ */
  if (phase === 'week') {
    return (
      <div style={wrapStyle}>
        <div style={headingStyle}><span>🎮</span> جرّب بنفسك</div>
        <div style={subStyle}>عندك {budget} ₪ للأسبوع كله — قرر كل يوم: هل تدفع أم تتخطى؟</div>

        {/* Budget bar */}
        <div style={budgetBoxStyle}>
          <div style={budgetLabelStyle}>
            <span>المتبقي من المصروف</span>
            <span>أنفقت {spent} ₪</span>
          </div>
          <div style={trackStyle}>
            <div style={{
              height: '100%',
              width: `${budgetPct}%`,
              background: budgetColor,
              borderRadius: '999px',
              transition: 'width 0.3s ease, background 0.3s ease',
            }} />
          </div>
          <div style={{
            fontFamily: "'IBM Plex Arabic', sans-serif",
            fontSize: '22px',
            fontWeight: 900,
            color: budgetColor,
            textAlign: 'center',
          }}>
            {remaining} ₪
          </div>
        </div>

        {/* Day strip */}
        <div style={stripStyle}>
          {events.map((day, i) => {
            const isPast    = i < currentDay;
            const isCurrent = i === currentDay;
            const decision  = decisions[i];
            return (
              <div key={i} style={{
                ...dayPillBase,
                borderColor: isCurrent ? 'var(--gold)' : isPast ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.06)',
                background:  isCurrent ? 'rgba(249,168,37,0.1)' : 'rgba(255,255,255,0.02)',
              }}>
                <span style={{
                  fontFamily: "'IBM Plex Arabic', sans-serif",
                  fontSize: '11px',
                  fontWeight: 700,
                  color: isCurrent ? 'var(--gold)' : 'rgba(255,255,255,0.45)',
                  marginBottom: '4px',
                }}>
                  {day.dayShort}
                </span>
                <span style={{ fontSize: '15px', lineHeight: 1 }}>
                  {isPast
                    ? (decision === 'paid' ? '✅' : '⏭️')
                    : isCurrent ? day.icon : '❓'}
                </span>
                {isPast && (
                  <span style={{
                    fontFamily: "'IBM Plex Arabic', sans-serif",
                    fontSize: '10px',
                    fontWeight: 700,
                    marginTop: '3px',
                    color: decision === 'paid' ? 'var(--green-lt)' : 'rgba(255,255,255,0.35)',
                  }}>
                    {decision === 'paid' ? `-${events[i].price}₪` : 'تخطّى'}
                  </span>
                )}
                {isCurrent && (
                  <span style={{
                    fontFamily: "'IBM Plex Arabic', sans-serif",
                    fontSize: '9px',
                    color: 'var(--gold)',
                    marginTop: '3px',
                  }}>
                    الآن
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {/* Day event card */}
        <div style={eventCardStyle}>
          <div style={{
            fontFamily: "'IBM Plex Arabic', sans-serif",
            fontSize: '13px',
            fontWeight: 700,
            color: '#FFD54F',
            marginBottom: '8px',
          }}>
            📅 {event.dayFull} — اليوم {currentDay + 1} من 7
          </div>
          <div style={eventTextStyle}>
            {event.icon} {event.text}
          </div>
          <div>
            <span style={priceBadgeStyle}>{event.price} ₪</span>
            {!canAfford && (
              <span style={{
                fontFamily: "'IBM Plex Arabic', sans-serif",
                fontSize: '12px',
                color: '#EF9A9A',
                marginRight: '10px',
              }}>
                ← لا يكفي المال
              </span>
            )}
          </div>
          <div style={btnRowStyle}>
            <button
              style={{ ...payBtnStyle, opacity: canAfford ? 1 : 0.4, cursor: canAfford ? 'pointer' : 'not-allowed' }}
              onClick={handlePay}
              disabled={!canAfford}
            >
              ✅ ادفع {event.price} ₪
            </button>
            <button style={skipBtnStyle} onClick={handleSkip}>
              ⏭️ تخطَّ
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* ═══════════════════════════════════════
     RESULTS PHASE
  ═══════════════════════════════════════ */
  const feedback = getFeedback();

  return (
    <div style={wrapStyle}>
      <div style={resultHeadingStyle}>📅 ملخص الأسبوع</div>

      {/* Spent / Saved summary */}
      <div style={summaryRowStyle}>
        <div style={summaryBoxStyle('#EF5350', 'rgba(239,83,80,0.08)')}>
          <span style={summaryValueStyle('#EF9A9A')}>{spent} ₪</span>
          <span style={summaryLabelStyle}>إجمالي الإنفاق</span>
        </div>
        <div style={summaryBoxStyle('#66BB6A', 'rgba(102,187,106,0.08)')}>
          <span style={summaryValueStyle('var(--green-lt)')}>{saved} ₪</span>
          <span style={summaryLabelStyle}>وفّرت</span>
        </div>
      </div>

      {/* Day-by-day breakdown */}
      <div style={{ marginBottom: '16px' }}>
        {events.map((day, i) => {
          const paid = decisions[i] === 'paid';
          return (
            <div key={i} style={{
              ...dayRowStyle,
              background: paid ? 'rgba(239,83,80,0.07)' : 'rgba(255,255,255,0.03)',
              border: `1px solid ${paid ? 'rgba(239,83,80,0.15)' : 'rgba(255,255,255,0.06)'}`,
            }}>
              <span style={{ fontSize: '16px', flexShrink: 0 }}>
                {paid ? '✅' : '⏭️'}
              </span>
              <span style={{
                fontFamily: "'IBM Plex Arabic', sans-serif",
                fontSize: '12px',
                fontWeight: 700,
                color: 'rgba(255,255,255,0.5)',
                flexShrink: 0,
                width: '34px',
              }}>
                {day.dayShort}
              </span>
              <span style={{
                fontFamily: "'IBM Plex Arabic', sans-serif",
                fontSize: '13px',
                color: 'rgba(255,255,255,0.8)',
                flex: 1,
              }}>
                {day.icon} {day.text}
              </span>
              <span style={{
                fontFamily: "'IBM Plex Arabic', sans-serif",
                fontSize: '13px',
                fontWeight: 800,
                color: paid ? '#EF9A9A' : 'rgba(255,255,255,0.3)',
                flexShrink: 0,
              }}>
                {paid ? `-${day.price} ₪` : '—'}
              </span>
            </div>
          );
        })}
      </div>

      {/* Feedback */}
      <div style={feedbackBoxStyle(feedback.good)}>
        {feedback.text}
      </div>

      {/* Actions */}
      <div style={actionRowStyle}>
        <button style={retryBtnStyle} onClick={handleRetry}>
          🔄 أسبوع جديد
        </button>
        <button
          style={{ ...completeBtnStyle, opacity: done ? 0.6 : 1, cursor: done ? 'default' : 'pointer' }}
          onClick={handleComplete}
          disabled={done}
        >
          {done ? '✔ أكملت النشاط' : '✅ أكملت النشاط'}
        </button>
      </div>
    </div>
  );
}
