import { useState, type CSSProperties } from 'react';

/* ─────────────────────────────────────────────
   Story data
───────────────────────────────────────────── */

interface Villager {
  id: string;
  name: string;
  emoji: string;
  has: string;       // what they offer
  hasEmoji: string;
  wants: string;     // what they need
  wantsEmoji: string;
  refusal: string;   // said when Khaled can't trade
}

// Khaled has: 🍎 apple, needs: 👕 shirt
// Chain: apple → bread → fish → cloth → shirt
// But the chain is deliberately broken — no one wants exactly what Khaled has first
const VILLAGERS: Villager[] = [
  {
    id: 'baker',
    name: 'أبو سامي الخبّاز',
    emoji: '👨‍🍳',
    has: 'خبز',    hasEmoji: '🍞',
    wants: 'سمك',  wantsEmoji: '🐟',
    refusal: 'أنا محتاج سمك، مش تفاح!',
  },
  {
    id: 'fisher',
    name: 'أم نور الصيّادة',
    emoji: '👩‍🦱',
    has: 'سمك',   hasEmoji: '🐟',
    wants: 'قماش', wantsEmoji: '🧵',
    refusal: 'معي سمك كتير — محتاجة قماش مش تفاح.',
  },
  {
    id: 'weaver',
    name: 'جدّ يوسف الحائك',
    emoji: '👴',
    has: 'قماش',   hasEmoji: '🧵',
    wants: 'خبز',  wantsEmoji: '🍞',
    refusal: 'أحتاج خبز لأولادي — التفاح ما ينفعني.',
  },
  {
    id: 'tailor',
    name: 'الخيّاطة فاطمة',
    emoji: '👩‍🎨',
    has: 'قميص',  hasEmoji: '👕',
    wants: 'قماش', wantsEmoji: '🧵',
    refusal: 'أنا محتاجة قماش لأخيط — التفاح ما ينفعني!',
  },
];

// The trick: the child tries villagers in order.
// Baker, Fisher, Weaver all refuse. Only Tailor wants the apple.
// BUT we reveal this only after the child has tried at least 2 others → frustration
// Then coins appear and the child buys from Tailor directly.

/* ─────────────────────────────────────────────
   Props
───────────────────────────────────────────── */

interface BarterSimulationProps {
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

const inventoryStyle: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '8px',
  background: 'rgba(255,193,7,0.1)',
  border: '1px solid rgba(255,193,7,0.3)',
  borderRadius: '20px',
  padding: '6px 16px',
  fontFamily: "'IBM Plex Arabic', sans-serif",
  fontSize: '15px',
  fontWeight: 700,
  color: '#FFD54F',
  marginBottom: '20px',
};

const villagerCardStyle = (tried: boolean, canTrade: boolean): CSSProperties => ({
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  padding: '14px 16px',
  borderRadius: 'var(--r)',
  border: `2px solid ${tried ? (canTrade ? 'rgba(102,187,106,0.5)' : 'rgba(239,83,80,0.4)') : 'rgba(255,255,255,0.12)'}`,
  background: tried ? (canTrade ? 'rgba(46,125,50,0.12)' : 'rgba(183,28,28,0.1)') : 'rgba(255,255,255,0.04)',
  cursor: tried ? 'default' : 'pointer',
  transition: 'all 0.2s',
  marginBottom: '10px',
  opacity: tried && !canTrade ? 0.6 : 1,
});

const speechBubbleStyle: CSSProperties = {
  fontFamily: "'IBM Plex Arabic', sans-serif",
  fontSize: '13px',
  color: '#EF9A9A',
  fontStyle: 'italic',
  marginTop: '4px',
};

const narratorBoxStyle: CSSProperties = {
  borderRadius: 'var(--r)',
  padding: '14px 16px',
  marginBottom: '16px',
  fontFamily: "'IBM Plex Arabic', sans-serif",
  fontSize: '15px',
  lineHeight: 1.8,
  background: 'rgba(255,255,255,0.04)',
  border: '1px solid rgba(255,255,255,0.1)',
  color: 'rgba(255,255,255,0.85)',
  animation: 'popIn 0.35s cubic-bezier(0.34,1.56,0.64,1)',
};

const elderBoxStyle: CSSProperties = {
  borderRadius: 'var(--r)',
  padding: '16px',
  marginBottom: '16px',
  background: 'rgba(255,193,7,0.1)',
  border: '1px solid rgba(255,193,7,0.3)',
  fontFamily: "'IBM Plex Arabic', sans-serif",
  fontSize: '15px',
  lineHeight: 1.8,
  color: '#FFD54F',
  animation: 'popIn 0.5s cubic-bezier(0.34,1.56,0.64,1)',
};

const coinRowStyle: CSSProperties = {
  display: 'flex',
  gap: '8px',
  justifyContent: 'center',
  marginBottom: '16px',
  flexWrap: 'wrap' as const,
};

const actionBtnStyle = (color: string, bg: string): CSSProperties => ({
  width: '100%',
  padding: '14px',
  borderRadius: 'var(--r)',
  background: bg,
  color,
  fontFamily: "'IBM Plex Arabic', sans-serif",
  fontSize: '16px',
  fontWeight: 800,
  border: 'none',
  cursor: 'pointer',
  marginTop: '8px',
});

/* ─────────────────────────────────────────────
   Component
───────────────────────────────────────────── */

type Phase = 'barter' | 'elder' | 'coins' | 'success';

// personalBudget accepted for API consistency
export default function BarterSimulation({ onComplete }: BarterSimulationProps) {
  const [tried, setTried]     = useState<Set<string>>(new Set());
  const [refusals, setRefusals] = useState<string[]>([]);
  const [phase, setPhase]     = useState<Phase>('barter');
  const [done, setDone]       = useState(false);

  const failedCount = [...tried].filter(id => id !== 'tailor').length;
  // Elders appear after 2 refusals OR if child tries tailor directly (tailor wants apple but story needs them to feel the frustration first)
  const eldersUnlocked = failedCount >= 2;

  const handleTapVillager = (v: Villager) => {
    if (tried.has(v.id)) return;

    if (v.id === 'tailor') {
      if (!eldersUnlocked) {
        // Tailor wants apple but we show frustration first
        setTried(prev => new Set(prev).add(v.id));
        setRefusals(prev => [...prev, `${v.name}: "صحيح أنا محتاج تفاح — بس ما عندي وقت هلق، جرّب غيري أول!"`]);
        return;
      }
      // After 2 refusals: direct tailor tap advances to elders
      handleCallElders();
      return;
    }

    setTried(prev => new Set(prev).add(v.id));
    setRefusals(prev => [...prev, `${v.name}: "${v.refusal}"`]);
  };

  const handleCallElders = () => setPhase('elder');
  const handleGetCoins   = () => setPhase('coins');
  const handleBuyShirt   = () => setPhase('success');

  const handleComplete = () => {
    setDone(true);
    onComplete();
  };

  const handleRetry = () => {
    setTried(new Set());
    setRefusals([]);
    setPhase('barter');
    setDone(false);
  };

  /* ── Barter phase ── */
  if (phase === 'barter') {
    return (
      <div style={wrapStyle}>
        <div style={headingStyle}><span>🎮</span> عِش قصة خالد بنفسك</div>
        <div style={subStyle}>
          أنت خالد. عندك تفاحة وتحتاج قميصاً. اضغط على أهل القرية لتتبادل معهم!
        </div>

        {/* Inventory */}
        <div style={inventoryStyle}>
          🍎 معك: تفاحة واحدة
          <span style={{ opacity: 0.5, margin: '0 4px' }}>←</span>
          👕 تريد: قميص
        </div>

        {/* Narrator hint */}
        <div style={narratorBoxStyle}>
          🗺️ في القرية أربعة أشخاص. جرّب تتفاوض معهم — شوف من يقبل التفاحة!
        </div>

        {/* Villagers */}
        {VILLAGERS.map(v => {
          const isTried  = tried.has(v.id);
          const canTrade = v.id === 'tailor' && eldersUnlocked;
          return (
            <button
              key={v.id}
              style={villagerCardStyle(isTried, canTrade)}
              onClick={() => handleTapVillager(v)}
            >
              <span style={{ fontSize: '32px', flexShrink: 0 }}>{v.emoji}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: "'IBM Plex Arabic', sans-serif", fontSize: '15px', fontWeight: 800, color: 'white', marginBottom: '2px' }}>
                  {v.name}
                </div>
                <div style={{ fontFamily: "'IBM Plex Arabic', sans-serif", fontSize: '15px', color: '#E0E0E0' }}>
                  عنده: {v.hasEmoji} {v.has} &nbsp;·&nbsp; يريد: {v.wantsEmoji} {v.wants}
                </div>
                {isTried && !canTrade && (
                  <div style={speechBubbleStyle}>💬 {v.refusal || 'جرّبه بعد ما تحصل على عملة!'}</div>
                )}
              </div>
              {isTried && !canTrade && <span style={{ fontSize: '20px', flexShrink: 0 }}>❌</span>}
              {!isTried && <span style={{ fontSize: '18px', flexShrink: 0, color: 'rgba(255,255,255,0.3)' }}>👆</span>}
            </button>
          );
        })}

        {/* Show refusals summary */}
        {refusals.length > 0 && (
          <div style={{
            borderRadius: 'var(--r)',
            padding: '12px 14px',
            background: 'rgba(183,28,28,0.1)',
            border: '1px solid rgba(239,83,80,0.2)',
            fontFamily: "'IBM Plex Arabic', sans-serif",
            fontSize: '13px',
            color: '#EF9A9A',
            lineHeight: 1.8,
            marginTop: '4px',
            marginBottom: '8px',
          }}>
            {refusals.map((r, i) => <div key={i}>❌ {r}</div>)}
          </div>
        )}

        {/* Call elders after 2 refusals */}
        {eldersUnlocked && (
          <div style={{ ...narratorBoxStyle, color: '#FFD54F', background: 'rgba(255,193,7,0.08)', border: '1px solid rgba(255,193,7,0.2)' }}>
            😤 <strong>خالد تعب من المحاولات!</strong> كل واحد يريد شيء ثاني. التبادل صعب جداً...
            <br />هل تنادي على حكماء القرية؟
          </div>
        )}
        {eldersUnlocked && (
          <button style={actionBtnStyle('white', 'linear-gradient(135deg, #1565C0, #0D47A1)')} onClick={handleCallElders}>
            🧓 نادِ حكماء القرية
          </button>
        )}
      </div>
    );
  }

  /* ── Elder phase ── */
  if (phase === 'elder') {
    return (
      <div style={wrapStyle}>
        <div style={headingStyle}><span>🏛️</span> حكماء القرية يتدخّلون</div>

        <div style={narratorBoxStyle}>
          اجتمع حكماء القرية وقالوا: <strong>"المشكلة واضحة — كل واحد يريد شيئاً مختلفاً، والتبادل المباشر مستحيل!"</strong>
        </div>

        <div style={elderBoxStyle}>
          <div style={{ fontSize: '32px', marginBottom: '10px', textAlign: 'center' }}>🪙</div>
          <strong>الحل الذكي من الحكماء:</strong>
          <br /><br />
          "سنصنع قطعاً معدنية صغيرة نسمّيها <strong>عملة</strong>.
          كل شخص يبيع بضاعته ويأخذ عملة، ثم يشتري ما يريد من أي شخص آخر.
          لا يحتاج أحد أن يتفق مع الآخر مباشرة!"
        </div>

        <div style={{ fontFamily: "'IBM Plex Arabic', sans-serif", fontSize: '14px', color: 'rgba(255,255,255,0.6)', marginBottom: '16px', lineHeight: 1.8 }}>
          الحكماء أعطوا خالد <strong style={{ color: '#FFD54F' }}>5 عملات معدنية</strong> مقابل تفاحته.
          الآن خالد يستطيع الشراء من أي أحد!
        </div>

        <button style={actionBtnStyle('white', 'linear-gradient(135deg, #FFB300, #E65100)')} onClick={handleGetCoins}>
          🪙 خذ العملات واذهب للسوق
        </button>
      </div>
    );
  }

  /* ── Coins phase ── */
  if (phase === 'coins') {
    return (
      <div style={wrapStyle}>
        <div style={headingStyle}><span>🪙</span> خالد في السوق</div>

        <div style={inventoryStyle}>
          🪙 معك: 5 عملات معدنية
        </div>

        <div style={narratorBoxStyle}>
          خالد ذهب مباشرة إلى <strong>فاطمة الخيّاطة</strong>.
          قال: "أعطيك 3 عملات مقابل القميص."
          <br />فاطمة ابتسمت: "بكل سرور! العملة تنفع لأي شيء أريده لاحقاً."
        </div>

        <div style={coinRowStyle}>
          {['🪙','🪙','🪙','🪙','🪙'].map((c, i) => (
            <span key={i} style={{ fontSize: '32px', filter: i < 3 ? 'none' : 'grayscale(1) opacity(0.3)' }}>{c}</span>
          ))}
        </div>

        <div style={{ fontFamily: "'IBM Plex Arabic', sans-serif", fontSize: '13px', color: 'rgba(255,255,255,0.45)', textAlign: 'center', marginBottom: '16px' }}>
          3 عملات للقميص — بقي معك 2 عملات!
        </div>

        <div style={{
          borderRadius: 'var(--r)',
          padding: '12px 16px',
          background: 'rgba(46,125,50,0.12)',
          border: '1px solid rgba(102,187,106,0.25)',
          fontFamily: "'IBM Plex Arabic', sans-serif",
          fontSize: '14px',
          color: '#A5D6A7',
          marginBottom: '16px',
        }}>
          ✅ بدون ضغط، بدون بحث عن شخص يريد تفاحة بالضبط — صفقة واحدة بسيطة!
        </div>

        <button style={actionBtnStyle('white', 'linear-gradient(135deg, var(--green), #1B5E20)')} onClick={handleBuyShirt}>
          👕 اشترِ القميص!
        </button>
      </div>
    );
  }

  /* ── Success phase ── */
  return (
    <div style={wrapStyle}>
      <div style={{ textAlign: 'center', fontSize: '64px', marginBottom: '12px', animation: 'popIn 0.5s cubic-bezier(0.34,1.56,0.64,1)' }}>
        🎉
      </div>

      <div style={{
        fontFamily: "'IBM Plex Arabic', sans-serif",
        fontSize: '22px',
        fontWeight: 900,
        color: 'white',
        textAlign: 'center',
        marginBottom: '18px',
      }}>
        خالد حصل على قميصه!
      </div>

      <div style={{
        borderRadius: 'var(--r)',
        padding: '20px 18px',
        marginBottom: '18px',
        background: 'rgba(46,125,50,0.15)',
        border: '1px solid rgba(102,187,106,0.3)',
        fontFamily: "'IBM Plex Arabic', sans-serif",
        fontSize: '16px',
        lineHeight: 2,
        color: '#A5D6A7',
        textAlign: 'center',
        animation: 'popIn 0.5s cubic-bezier(0.34,1.56,0.64,1)',
      }}>
        🌟 <strong>الآن فهمت لماذا اخترع البشر المال!</strong>
        <br />
        عِشتَها بنفسك — التبادل المباشر صعب وبطيء.
        <br />
        العملة حلّت المشكلة: وسيلة يقبلها الجميع، في أي وقت.
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '10px',
        marginBottom: '18px',
        fontFamily: "'IBM Plex Arabic', sans-serif",
        fontSize: '13px',
      }}>
        {[
          { icon: '🔄', label: 'المقايضة', desc: 'صعبة — تحتاج توافق مزدوج' },
          { icon: '🪙', label: 'العملة',   desc: 'سهلة — يقبلها الجميع' },
        ].map(c => (
          <div key={c.label} style={{
            borderRadius: 'var(--r)',
            padding: '12px',
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.08)',
            textAlign: 'center',
          }}>
            <div style={{ fontSize: '24px', marginBottom: '4px' }}>{c.icon}</div>
            <div style={{ fontSize: '18px', fontWeight: 800, color: 'white', marginBottom: '4px' }}>{c.label}</div>
            <div style={{ fontSize: '15px', color: 'rgba(255,255,255,0.55)' }}>{c.desc}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: '10px' }}>
        <button
          style={{
            flex: 1, padding: '12px', borderRadius: 'var(--r)',
            background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)',
            color: 'rgba(255,255,255,0.7)', fontFamily: "'IBM Plex Arabic', sans-serif",
            fontSize: '15px', fontWeight: 700, cursor: 'pointer',
          }}
          onClick={handleRetry}
        >
          🔄 العب مرة ثانية
        </button>
        <button
          style={{
            flex: 2, padding: '12px', borderRadius: 'var(--r)',
            background: done ? 'rgba(255,255,255,0.1)' : 'linear-gradient(135deg, var(--green), #1B5E20)',
            color: done ? 'var(--green-lt)' : 'white',
            fontFamily: "'IBM Plex Arabic', sans-serif",
            fontSize: '15px', fontWeight: 700, border: 'none',
            cursor: done ? 'default' : 'pointer', opacity: done ? 0.7 : 1,
          }}
          onClick={handleComplete}
          disabled={done}
        >
          {done ? '✔ أكملت النشاط' : '✅ أكملت النشاط'}
        </button>
      </div>
    </div>
  );
}
