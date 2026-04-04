import { useState, type CSSProperties } from 'react';
import SavingBoxIcon from '../shared/SavingBoxIcon';

interface BucketCardProps {
  type: 'spend' | 'save' | 'give';
  balance: number;
  percentage: number;
  goalName?: string;
  goalPrice?: number;
  color: string;
  onUse: (amount: number, note: string) => void;
}

const LABELS: Record<string, { name: string; icon: string | null }> = {
  spend: { name: 'إنفاق', icon: '🛒' },
  save:  { name: 'توفير', icon: null },
  give:  { name: 'عطاء', icon: '🤲' },
};

const cardStyle = (color: string): CSSProperties => ({
  background: 'rgba(255,255,255,0.06)',
  backdropFilter: 'blur(12px)',
  border: `2px solid ${color}40`,
  borderRadius: 'var(--r-lg)',
  padding: '24px 20px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '12px',
  flex: 1,
  minWidth: '220px',
  position: 'relative',
  overflow: 'hidden',
  transition: 'transform 0.2s, box-shadow 0.2s',
});

const iconWrapStyle: CSSProperties = {
  fontSize: '36px',
  marginBottom: '4px',
};

const labelStyle: CSSProperties = {
  fontFamily: "'IBM Plex Arabic', sans-serif",
  fontSize: '18px',
  fontWeight: 700,
  color: 'var(--white)',
};

const pctBadgeStyle = (color: string): CSSProperties => ({
  fontFamily: "'IBM Plex Arabic', sans-serif",
  fontSize: '13px',
  fontWeight: 700,
  color,
  background: `${color}20`,
  borderRadius: '20px',
  padding: '2px 14px',
});

const balanceStyle: CSSProperties = {
  fontFamily: "'IBM Plex Arabic', sans-serif",
  fontSize: '28px',
  fontWeight: 900,
  color: 'var(--gold)',
  direction: 'ltr',
};

const bucketContainerStyle: CSSProperties = {
  width: '100%',
  height: '80px',
  background: 'rgba(255,255,255,0.05)',
  borderRadius: '12px',
  position: 'relative',
  overflow: 'hidden',
  border: '1px solid rgba(255,255,255,0.08)',
};

const bucketFillStyle = (color: string, pct: number): CSSProperties => ({
  position: 'absolute',
  bottom: 0,
  left: 0,
  right: 0,
  height: `${Math.min(pct, 100)}%`,
  background: `linear-gradient(0deg, ${color}90, ${color}40)`,
  transition: 'height 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
  borderRadius: '0 0 12px 12px',
});

const bucketPctLabelStyle: CSSProperties = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  fontFamily: "'IBM Plex Arabic', sans-serif",
  fontSize: '14px',
  fontWeight: 700,
  color: 'var(--white)',
  zIndex: 1,
  textShadow: '0 1px 4px rgba(0,0,0,0.5)',
};

const goalStyle: CSSProperties = {
  fontFamily: "'IBM Plex Arabic', sans-serif",
  fontSize: '13px',
  color: 'var(--gray-3)',
  textAlign: 'center',
  lineHeight: 1.5,
};

const goalNameStyle: CSSProperties = {
  fontFamily: "'IBM Plex Arabic', sans-serif",
  fontWeight: 700,
  color: 'var(--white)',
  fontSize: '14px',
};

const useBtnStyle = (color: string): CSSProperties => ({
  fontFamily: "'IBM Plex Arabic', sans-serif",
  fontSize: '14px',
  fontWeight: 700,
  padding: '8px 24px',
  borderRadius: 'var(--r)',
  background: color,
  color: 'var(--white)',
  border: 'none',
  cursor: 'pointer',
  transition: 'opacity 0.2s',
  width: '100%',
});

const modalOverlayStyle: CSSProperties = {
  position: 'fixed',
  inset: 0,
  background: 'rgba(0,0,0,0.6)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 1000,
  padding: '20px',
};

const modalStyle: CSSProperties = {
  background: '#1a2a3e',
  borderRadius: 'var(--r-lg)',
  padding: '32px 28px',
  maxWidth: '360px',
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
  border: '1px solid rgba(255,255,255,0.1)',
};

const modalTitleStyle: CSSProperties = {
  fontFamily: "'IBM Plex Arabic', sans-serif",
  fontSize: '20px',
  fontWeight: 700,
  color: 'var(--white)',
  textAlign: 'center',
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

const modalBtnsStyle: CSSProperties = {
  display: 'flex',
  gap: '8px',
};

const cancelBtnStyle: CSSProperties = {
  fontFamily: "'IBM Plex Arabic', sans-serif",
  fontSize: '14px',
  fontWeight: 700,
  padding: '8px 20px',
  borderRadius: 'var(--r)',
  background: 'rgba(255,255,255,0.1)',
  color: 'var(--gray-3)',
  border: 'none',
  cursor: 'pointer',
  flex: 1,
};

export default function BucketCard({
  type,
  balance,
  percentage,
  goalName,
  goalPrice,
  color,
  onUse,
}: BucketCardProps) {
  const [showModal, setShowModal] = useState(false);
  const [useAmount, setUseAmount] = useState('');
  const [useNote, setUseNote] = useState('');

  const label = LABELS[type];
  const hasGoal = goalName && goalPrice && goalPrice > 0;
  const fillPct = hasGoal ? (balance / goalPrice) * 100 : Math.min(balance * 2, 100);

  const handleUse = () => {
    const amount = parseFloat(useAmount);
    if (!amount || amount <= 0 || amount > balance) return;
    onUse(amount, useNote);
    setShowModal(false);
    setUseAmount('');
    setUseNote('');
  };

  // Only spend and give can "use" funds
  const canUse = type === 'spend' || type === 'give';

  return (
    <>
      <div style={cardStyle(color)}>
        <div style={iconWrapStyle}>
          {label.icon === null ? <SavingBoxIcon size={48} /> : label.icon}
        </div>
        <div style={labelStyle}>{label.name}</div>
        <div style={pctBadgeStyle(color)}>{percentage}%</div>
        <div style={balanceStyle}>{balance.toFixed(2)} ₪</div>

        {/* Visual bucket fill */}
        <div style={bucketContainerStyle}>
          <div style={bucketFillStyle(color, fillPct)} />
          <div style={bucketPctLabelStyle}>{Math.round(fillPct)}%</div>
        </div>

        {/* Goal progress */}
        {hasGoal && (
          <div style={goalStyle}>
            <div style={goalNameStyle}>{goalName}</div>
            <div>{balance.toFixed(2)} / {goalPrice.toFixed(2)} ₪</div>
          </div>
        )}

        {/* Use button */}
        {canUse && (
          <button
            style={useBtnStyle(color)}
            onClick={() => setShowModal(true)}
            disabled={balance <= 0}
          >
            استخدام
          </button>
        )}
      </div>

      {/* Use modal */}
      {showModal && (
        <div style={modalOverlayStyle} onClick={() => setShowModal(false)}>
          <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
            <div style={modalTitleStyle}>
              استخدام من {label.name}
            </div>
            <div style={{ ...goalStyle, fontSize: '14px' }}>
              الرصيد الحالي: {balance.toFixed(2)} ₪
            </div>
            <input
              type="number"
              placeholder="المبلغ"
              value={useAmount}
              onChange={(e) => setUseAmount(e.target.value)}
              style={inputStyle}
              min={0}
              max={balance}
              step={0.5}
            />
            <input
              type="text"
              placeholder="ملاحظة (اختياري)"
              value={useNote}
              onChange={(e) => setUseNote(e.target.value)}
              style={inputStyle}
            />
            <div style={modalBtnsStyle}>
              <button
                style={{ ...useBtnStyle(color), flex: 1 }}
                onClick={handleUse}
              >
                تأكيد
              </button>
              <button style={cancelBtnStyle} onClick={() => setShowModal(false)}>
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
