import { useState, type CSSProperties } from 'react';
import { useBucketStore } from '../../stores/bucketStore';
import BucketCard from './BucketCard';
import BucketHistory from './BucketHistory';

const BUCKET_COLORS = {
  spend: '#FF9800',
  save: '#4CAF50',
  give: '#2196F3',
};

/* ======================== Styles ======================== */

const containerStyle: CSSProperties = {
  animation: 'panelIn 0.4s ease',
};

const headerStyle: CSSProperties = {
  textAlign: 'center',
  marginBottom: '28px',
};

const titleStyle: CSSProperties = {
  fontFamily: "'IBM Plex Arabic', sans-serif",
  fontSize: '28px',
  fontWeight: 900,
  color: 'var(--gold)',
  marginBottom: '4px',
};

const allowanceStyle: CSSProperties = {
  fontFamily: "'IBM Plex Arabic', sans-serif",
  fontSize: '15px',
  color: 'var(--gray-3)',
};

const actionBarStyle: CSSProperties = {
  display: 'flex',
  gap: '10px',
  justifyContent: 'center',
  marginBottom: '28px',
  flexWrap: 'wrap',
};

const incomeBtnStyle: CSSProperties = {
  fontFamily: "'IBM Plex Arabic', sans-serif",
  fontSize: '15px',
  fontWeight: 700,
  padding: '10px 28px',
  borderRadius: 'var(--r)',
  background: 'var(--green)',
  color: 'var(--white)',
  border: 'none',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
  transition: 'opacity 0.2s',
};

const resetBtnStyle: CSSProperties = {
  fontFamily: "'IBM Plex Arabic', sans-serif",
  fontSize: '15px',
  fontWeight: 700,
  padding: '10px 28px',
  borderRadius: 'var(--r)',
  background: 'rgba(255,255,255,0.08)',
  color: 'var(--gray-3)',
  border: '1px solid rgba(255,255,255,0.15)',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
  transition: 'opacity 0.2s',
};

const bucketsRowStyle: CSSProperties = {
  display: 'flex',
  gap: '16px',
  flexWrap: 'wrap',
  justifyContent: 'center',
};

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

const modalDescStyle: CSSProperties = {
  fontFamily: "'IBM Plex Arabic', sans-serif",
  fontSize: '14px',
  color: 'var(--gray-3)',
  textAlign: 'center',
  lineHeight: 1.7,
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

const primaryBtnStyle: CSSProperties = {
  fontFamily: "'IBM Plex Arabic', sans-serif",
  fontSize: '14px',
  fontWeight: 700,
  padding: '10px 20px',
  borderRadius: 'var(--r)',
  background: 'var(--green)',
  color: 'var(--white)',
  border: 'none',
  cursor: 'pointer',
  flex: 1,
};

const cancelBtnStyle: CSSProperties = {
  fontFamily: "'IBM Plex Arabic', sans-serif",
  fontSize: '14px',
  fontWeight: 700,
  padding: '10px 20px',
  borderRadius: 'var(--r)',
  background: 'rgba(255,255,255,0.1)',
  color: 'var(--gray-3)',
  border: 'none',
  cursor: 'pointer',
  flex: 1,
};

const dangerBtnStyle: CSSProperties = {
  ...primaryBtnStyle,
  background: 'var(--red)',
};

const previewStyle: CSSProperties = {
  display: 'flex',
  justifyContent: 'space-around',
  fontSize: '13px',
  fontFamily: "'IBM Plex Arabic', sans-serif",
  color: 'var(--gray-3)',
  padding: '8px 0',
};

const previewItemStyle = (color: string): CSSProperties => ({
  color,
  fontWeight: 700,
});

const errorStyle: CSSProperties = {
  fontFamily: "'IBM Plex Arabic', sans-serif",
  fontSize: '14px',
  color: 'var(--red)',
  textAlign: 'center',
};

/* ======================== Component ======================== */

export default function BucketsTracker() {
  const { config, transactions, loading, error, addIncome, useBucket, resetBuckets } =
    useBucketStore();

  const [showIncomeModal, setShowIncomeModal] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [incomeAmount, setIncomeAmount] = useState('');

  if (!config) return null;

  const handleAddIncome = async () => {
    const amount = parseFloat(incomeAmount);
    if (!amount || amount <= 0) return;
    await addIncome(amount);
    setShowIncomeModal(false);
    setIncomeAmount('');
  };

  const handleReset = async () => {
    await resetBuckets();
    setShowResetModal(false);
  };

  const handleUseBucket = (type: 'spend' | 'give') => {
    return (amount: number, note: string) => {
      const useType = type === 'spend' ? 'USE_SPEND' : 'USE_GIVE';
      useBucket({ type: useType, amount, note });
    };
  };

  // Preview distribution for income modal
  const previewAmount = parseFloat(incomeAmount) || 0;

  return (
    <div style={containerStyle}>
      <header style={headerStyle}>
        <h1 style={titleStyle}>الدلاء الثلاثة</h1>
        <div style={allowanceStyle}>
          المصروف الشهري: {config.allowance} ₪
        </div>
      </header>

      {/* Action buttons */}
      <div style={actionBarStyle}>
        <button style={incomeBtnStyle} onClick={() => setShowIncomeModal(true)}>
          💰 إضافة دخل
        </button>
        <button style={resetBtnStyle} onClick={() => setShowResetModal(true)}>
          🔄 إعادة تعيين
        </button>
      </div>

      {error && <div style={errorStyle}>{error}</div>}

      {/* Bucket cards */}
      <div style={bucketsRowStyle}>
        <BucketCard
          type="spend"
          balance={config.spendBalance}
          percentage={config.spendPct}
          color={BUCKET_COLORS.spend}
          onUse={handleUseBucket('spend')}
        />
        <BucketCard
          type="save"
          balance={config.saveBalance}
          percentage={config.savePct}
          goalName={config.saveGoalName}
          goalPrice={config.saveGoalPrice}
          color={BUCKET_COLORS.save}
          onUse={() => {}}
        />
        <BucketCard
          type="give"
          balance={config.giveBalance}
          percentage={config.givePct}
          goalName={config.giveGoalName}
          goalPrice={config.giveGoalPrice}
          color={BUCKET_COLORS.give}
          onUse={handleUseBucket('give')}
        />
      </div>

      {/* Transaction history */}
      <BucketHistory transactions={transactions} />

      {/* Income modal */}
      {showIncomeModal && (
        <div style={modalOverlayStyle} onClick={() => setShowIncomeModal(false)}>
          <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
            <div style={modalTitleStyle}>💰 إضافة دخل</div>
            <div style={modalDescStyle}>
              سيتم توزيع المبلغ تلقائيًا حسب نسب الدلاء
            </div>
            <input
              type="number"
              placeholder="المبلغ (₪)"
              value={incomeAmount}
              onChange={(e) => setIncomeAmount(e.target.value)}
              style={inputStyle}
              min={1}
              step={0.5}
            />
            {previewAmount > 0 && (
              <div style={previewStyle}>
                <span style={previewItemStyle(BUCKET_COLORS.spend)}>
                  إنفاق: {(previewAmount * config.spendPct / 100).toFixed(2)} ₪
                </span>
                <span style={previewItemStyle(BUCKET_COLORS.save)}>
                  توفير: {(previewAmount * config.savePct / 100).toFixed(2)} ₪
                </span>
                <span style={previewItemStyle(BUCKET_COLORS.give)}>
                  عطاء: {(previewAmount * config.givePct / 100).toFixed(2)} ₪
                </span>
              </div>
            )}
            <div style={modalBtnsStyle}>
              <button
                style={{ ...primaryBtnStyle, opacity: loading ? 0.5 : 1 }}
                onClick={handleAddIncome}
                disabled={loading}
              >
                {loading ? 'جارٍ الإضافة...' : 'إضافة'}
              </button>
              <button style={cancelBtnStyle} onClick={() => setShowIncomeModal(false)}>
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reset confirmation modal */}
      {showResetModal && (
        <div style={modalOverlayStyle} onClick={() => setShowResetModal(false)}>
          <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
            <div style={modalTitleStyle}>🔄 إعادة تعيين</div>
            <div style={modalDescStyle}>
              هل أنت متأكد؟ سيتم حذف جميع الدلاء والمعاملات.
              <br />
              لا يمكن التراجع عن هذا الإجراء.
            </div>
            <div style={modalBtnsStyle}>
              <button
                style={{ ...dangerBtnStyle, opacity: loading ? 0.5 : 1 }}
                onClick={handleReset}
                disabled={loading}
              >
                {loading ? 'جارٍ الحذف...' : 'نعم، احذف'}
              </button>
              <button style={cancelBtnStyle} onClick={() => setShowResetModal(false)}>
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
