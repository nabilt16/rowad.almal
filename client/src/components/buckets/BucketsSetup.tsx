import { useState, type CSSProperties } from 'react';
import { useBucketStore } from '../../stores/bucketStore';

const BUCKET_COLORS = {
  spend: '#FF9800',
  save: '#4CAF50',
  give: '#2196F3',
};

/* ======================== Styles ======================== */

const containerStyle: CSSProperties = {
  maxWidth: '560px',
  margin: '0 auto',
  animation: 'panelIn 0.4s ease',
};

const headerStyle: CSSProperties = {
  textAlign: 'center',
  marginBottom: '32px',
};

const titleStyle: CSSProperties = {
  fontFamily: "'IBM Plex Arabic', sans-serif",
  fontSize: '28px',
  fontWeight: 900,
  color: 'var(--gold)',
  marginBottom: '8px',
};

const subtitleStyle: CSSProperties = {
  fontFamily: "'IBM Plex Arabic', sans-serif",
  fontSize: '15px',
  color: 'var(--gray-3)',
  lineHeight: 1.7,
};

const cardStyle: CSSProperties = {
  background: 'rgba(255,255,255,0.06)',
  backdropFilter: 'blur(12px)',
  borderRadius: 'var(--r-lg)',
  padding: '28px 24px',
  border: '1px solid rgba(255,255,255,0.08)',
  marginBottom: '20px',
};

const stepLabelStyle: CSSProperties = {
  fontFamily: "'IBM Plex Arabic', sans-serif",
  fontSize: '16px',
  fontWeight: 700,
  color: 'var(--sky)',
  marginBottom: '16px',
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
};

const stepNumStyle = (active: boolean): CSSProperties => ({
  width: '28px',
  height: '28px',
  borderRadius: '50%',
  background: active ? 'var(--blue)' : 'rgba(255,255,255,0.1)',
  color: active ? 'var(--white)' : 'var(--gray-3)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '14px',
  fontWeight: 700,
  flexShrink: 0,
});

const inputGroupStyle: CSSProperties = {
  marginBottom: '16px',
};

const labelStyle: CSSProperties = {
  fontFamily: "'IBM Plex Arabic', sans-serif",
  fontSize: '14px',
  fontWeight: 600,
  color: 'var(--white)',
  marginBottom: '6px',
  display: 'block',
};

const inputStyle: CSSProperties = {
  fontFamily: "'IBM Plex Arabic', sans-serif",
  fontSize: '16px',
  padding: '10px 14px',
  borderRadius: 'var(--r)',
  border: '1px solid rgba(255,255,255,0.15)',
  background: 'rgba(255,255,255,0.08)',
  color: 'var(--white)',
  width: '100%',
  direction: 'rtl',
};

const sliderGroupStyle: CSSProperties = {
  marginBottom: '20px',
};

const sliderLabelStyle = (color: string): CSSProperties => ({
  fontFamily: "'IBM Plex Arabic', sans-serif",
  fontSize: '15px',
  fontWeight: 700,
  color,
  marginBottom: '6px',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
});

const sliderStyle: CSSProperties = {
  width: '100%',
  height: '8px',
  cursor: 'pointer',
  accentColor: 'var(--blue)',
};

const percentBarContainerStyle: CSSProperties = {
  display: 'flex',
  height: '32px',
  borderRadius: '16px',
  overflow: 'hidden',
  marginTop: '16px',
  marginBottom: '8px',
  border: '1px solid rgba(255,255,255,0.1)',
};

const percentSegmentStyle = (color: string, pct: number): CSSProperties => ({
  width: `${pct}%`,
  background: color,
  transition: 'width 0.3s ease',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontFamily: "'IBM Plex Arabic', sans-serif",
  fontSize: '12px',
  fontWeight: 700,
  color: 'var(--white)',
  minWidth: pct > 5 ? undefined : '0',
  overflow: 'hidden',
});

const sumWarningStyle: CSSProperties = {
  fontFamily: "'IBM Plex Arabic', sans-serif",
  fontSize: '13px',
  color: 'var(--red)',
  textAlign: 'center',
  marginTop: '4px',
};

const navBtnsStyle: CSSProperties = {
  display: 'flex',
  gap: '8px',
  marginTop: '24px',
};

const primaryBtnStyle: CSSProperties = {
  fontFamily: "'IBM Plex Arabic', sans-serif",
  fontSize: '16px',
  fontWeight: 700,
  padding: '12px 32px',
  borderRadius: 'var(--r)',
  background: 'var(--blue)',
  color: 'var(--white)',
  border: 'none',
  cursor: 'pointer',
  flex: 1,
  transition: 'opacity 0.2s',
};

const secondaryBtnStyle: CSSProperties = {
  fontFamily: "'IBM Plex Arabic', sans-serif",
  fontSize: '16px',
  fontWeight: 700,
  padding: '12px 32px',
  borderRadius: 'var(--r)',
  background: 'rgba(255,255,255,0.1)',
  color: 'var(--gray-3)',
  border: 'none',
  cursor: 'pointer',
  flex: 1,
};

const errorStyle: CSSProperties = {
  fontFamily: "'IBM Plex Arabic', sans-serif",
  fontSize: '14px',
  color: 'var(--red)',
  textAlign: 'center',
  marginTop: '8px',
};

const stepsDotsStyle: CSSProperties = {
  display: 'flex',
  justifyContent: 'center',
  gap: '8px',
  marginBottom: '24px',
};

const dotStyle = (active: boolean, done: boolean): CSSProperties => ({
  width: '10px',
  height: '10px',
  borderRadius: '50%',
  background: active ? 'var(--blue)' : done ? 'var(--sky)' : 'rgba(255,255,255,0.15)',
  transition: 'background 0.3s',
});

/* ======================== Component ======================== */

export default function BucketsSetup() {
  const { setupBuckets, loading, error } = useBucketStore();

  const [step, setStep] = useState(1);
  const [allowance, setAllowance] = useState('');
  const [spendPct, setSpendPct] = useState(50);
  const [savePct, setSavePct] = useState(30);
  const [givePct, setGivePct] = useState(20);
  const [saveGoalName, setSaveGoalName] = useState('');
  const [saveGoalPrice, setSaveGoalPrice] = useState('');
  const [giveGoalName, setGiveGoalName] = useState('');
  const [giveGoalPrice, setGiveGoalPrice] = useState('');

  const totalPct = spendPct + savePct + givePct;
  const pctValid = totalPct === 100;

  const handleSlider = (
    bucket: 'spend' | 'save' | 'give',
    rawVal: number,
  ) => {
    // Adjust the other two proportionally to keep sum = 100
    if (bucket === 'spend') {
      const remaining = 100 - rawVal;
      const oldOther = savePct + givePct;
      if (oldOther === 0) {
        setSavePct(Math.round(remaining / 2));
        setGivePct(remaining - Math.round(remaining / 2));
      } else {
        const newSave = Math.round((savePct / oldOther) * remaining);
        const newGive = remaining - newSave;
        setSavePct(Math.max(0, newSave));
        setGivePct(Math.max(0, newGive));
      }
      setSpendPct(rawVal);
    } else if (bucket === 'save') {
      const remaining = 100 - rawVal;
      const oldOther = spendPct + givePct;
      if (oldOther === 0) {
        setSpendPct(Math.round(remaining / 2));
        setGivePct(remaining - Math.round(remaining / 2));
      } else {
        const newSpend = Math.round((spendPct / oldOther) * remaining);
        const newGive = remaining - newSpend;
        setSpendPct(Math.max(0, newSpend));
        setGivePct(Math.max(0, newGive));
      }
      setSavePct(rawVal);
    } else {
      const remaining = 100 - rawVal;
      const oldOther = spendPct + savePct;
      if (oldOther === 0) {
        setSpendPct(Math.round(remaining / 2));
        setSavePct(remaining - Math.round(remaining / 2));
      } else {
        const newSpend = Math.round((spendPct / oldOther) * remaining);
        const newSave = remaining - newSpend;
        setSpendPct(Math.max(0, newSpend));
        setSavePct(Math.max(0, newSave));
      }
      setGivePct(rawVal);
    }
  };

  const handleSubmit = async () => {
    const allowanceNum = parseFloat(allowance);
    if (!allowanceNum || allowanceNum <= 0) return;
    if (!pctValid) return;

    await setupBuckets({
      allowance: allowanceNum,
      spendPct,
      savePct,
      givePct,
      saveGoalName: saveGoalName || '',
      saveGoalPrice: parseFloat(saveGoalPrice) || 0,
      giveGoalName: giveGoalName || '',
      giveGoalPrice: parseFloat(giveGoalPrice) || 0,
    });
  };

  const canNext = (s: number) => {
    if (s === 1) return parseFloat(allowance) > 0;
    if (s === 2) return pctValid;
    return true;
  };

  return (
    <div style={containerStyle}>
      <header style={headerStyle}>
        <h1 style={titleStyle}>الدلاء الثلاثة</h1>
        <p style={subtitleStyle}>
          قسّم مصروفك إلى ثلاثة دلاء: إنفاق، توفير، وعطاء!
        </p>
      </header>

      {/* Step dots */}
      <div style={stepsDotsStyle}>
        <div style={dotStyle(step === 1, step > 1)} />
        <div style={dotStyle(step === 2, step > 2)} />
        <div style={dotStyle(step === 3, false)} />
      </div>

      {/* Step 1: Allowance */}
      {step === 1 && (
        <div style={cardStyle}>
          <div style={stepLabelStyle}>
            <span style={stepNumStyle(true)}>1</span>
            مصروف الشهر
          </div>
          <div style={inputGroupStyle}>
            <label style={labelStyle}>كم مصروفك الشهري؟ (₪)</label>
            <input
              type="number"
              placeholder="مثلاً: 100"
              value={allowance}
              onChange={(e) => setAllowance(e.target.value)}
              style={inputStyle}
              min={1}
              step={1}
            />
          </div>
          <div style={navBtnsStyle}>
            <button
              style={{
                ...primaryBtnStyle,
                opacity: canNext(1) ? 1 : 0.5,
              }}
              onClick={() => canNext(1) && setStep(2)}
              disabled={!canNext(1)}
            >
              التالي
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Percentage split */}
      {step === 2 && (
        <div style={cardStyle}>
          <div style={stepLabelStyle}>
            <span style={stepNumStyle(true)}>2</span>
            توزيع النسب
          </div>

          {/* Visual percentage bar */}
          <div style={percentBarContainerStyle}>
            <div style={percentSegmentStyle(BUCKET_COLORS.spend, spendPct)}>
              {spendPct > 10 ? `${spendPct}%` : ''}
            </div>
            <div style={percentSegmentStyle(BUCKET_COLORS.save, savePct)}>
              {savePct > 10 ? `${savePct}%` : ''}
            </div>
            <div style={percentSegmentStyle(BUCKET_COLORS.give, givePct)}>
              {givePct > 10 ? `${givePct}%` : ''}
            </div>
          </div>

          {/* Spend slider */}
          <div style={sliderGroupStyle}>
            <div style={sliderLabelStyle(BUCKET_COLORS.spend)}>
              <span>🛒 إنفاق</span>
              <span>{spendPct}%</span>
            </div>
            <input
              type="range"
              min={0}
              max={100}
              value={spendPct}
              onChange={(e) => handleSlider('spend', Number(e.target.value))}
              style={{ ...sliderStyle, accentColor: BUCKET_COLORS.spend }}
            />
          </div>

          {/* Save slider */}
          <div style={sliderGroupStyle}>
            <div style={sliderLabelStyle(BUCKET_COLORS.save)}>
              <span>🏦 توفير</span>
              <span>{savePct}%</span>
            </div>
            <input
              type="range"
              min={0}
              max={100}
              value={savePct}
              onChange={(e) => handleSlider('save', Number(e.target.value))}
              style={{ ...sliderStyle, accentColor: BUCKET_COLORS.save }}
            />
          </div>

          {/* Give slider */}
          <div style={sliderGroupStyle}>
            <div style={sliderLabelStyle(BUCKET_COLORS.give)}>
              <span>🤲 عطاء</span>
              <span>{givePct}%</span>
            </div>
            <input
              type="range"
              min={0}
              max={100}
              value={givePct}
              onChange={(e) => handleSlider('give', Number(e.target.value))}
              style={{ ...sliderStyle, accentColor: BUCKET_COLORS.give }}
            />
          </div>

          {!pctValid && (
            <div style={sumWarningStyle}>
              المجموع: {totalPct}% (يجب أن يكون 100%)
            </div>
          )}

          <div style={navBtnsStyle}>
            <button style={secondaryBtnStyle} onClick={() => setStep(1)}>
              السابق
            </button>
            <button
              style={{
                ...primaryBtnStyle,
                opacity: canNext(2) ? 1 : 0.5,
              }}
              onClick={() => canNext(2) && setStep(3)}
              disabled={!canNext(2)}
            >
              التالي
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Goals */}
      {step === 3 && (
        <div style={cardStyle}>
          <div style={stepLabelStyle}>
            <span style={stepNumStyle(true)}>3</span>
            أهداف التوفير والعطاء
          </div>

          {/* Save goal */}
          <div style={inputGroupStyle}>
            <label style={labelStyle}>🏦 هدف التوفير (اختياري)</label>
            <input
              type="text"
              placeholder="مثلاً: دراجة جديدة"
              value={saveGoalName}
              onChange={(e) => setSaveGoalName(e.target.value)}
              style={{ ...inputStyle, marginBottom: '8px' }}
            />
            <input
              type="number"
              placeholder="سعر الهدف (₪)"
              value={saveGoalPrice}
              onChange={(e) => setSaveGoalPrice(e.target.value)}
              style={inputStyle}
              min={0}
            />
          </div>

          {/* Give goal */}
          <div style={inputGroupStyle}>
            <label style={labelStyle}>🤲 هدف العطاء (اختياري)</label>
            <input
              type="text"
              placeholder="مثلاً: تبرع لجمعية"
              value={giveGoalName}
              onChange={(e) => setGiveGoalName(e.target.value)}
              style={{ ...inputStyle, marginBottom: '8px' }}
            />
            <input
              type="number"
              placeholder="المبلغ المستهدف (₪)"
              value={giveGoalPrice}
              onChange={(e) => setGiveGoalPrice(e.target.value)}
              style={inputStyle}
              min={0}
            />
          </div>

          {error && <div style={errorStyle}>{error}</div>}

          <div style={navBtnsStyle}>
            <button style={secondaryBtnStyle} onClick={() => setStep(2)}>
              السابق
            </button>
            <button
              style={{
                ...primaryBtnStyle,
                opacity: loading ? 0.5 : 1,
              }}
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? 'جارٍ الإعداد...' : 'ابدأ!'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
