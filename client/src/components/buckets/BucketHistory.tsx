import type { CSSProperties } from 'react';
import type { BucketTransaction } from '@rowad/shared';
import { BucketTransactionType } from '@rowad/shared';

interface BucketHistoryProps {
  transactions: BucketTransaction[];
}

const TYPE_CONFIG: Record<
  BucketTransactionType,
  { label: string; icon: string; color: string; sign: string }
> = {
  [BucketTransactionType.INCOME]: {
    label: 'دخل',
    icon: '💰',
    color: '#4CAF50',
    sign: '+',
  },
  [BucketTransactionType.USE_SPEND]: {
    label: 'إنفاق',
    icon: '🛒',
    color: '#FF9800',
    sign: '-',
  },
  [BucketTransactionType.USE_GIVE]: {
    label: 'عطاء',
    icon: '🤲',
    color: '#2196F3',
    sign: '-',
  },
};

const sectionStyle: CSSProperties = {
  marginTop: '32px',
};

const titleStyle: CSSProperties = {
  fontFamily: "'Cairo', sans-serif",
  fontSize: '20px',
  fontWeight: 700,
  color: 'var(--white)',
  marginBottom: '16px',
};

const listStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
};

const itemStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  padding: '12px 16px',
  background: 'rgba(255,255,255,0.05)',
  borderRadius: 'var(--r)',
  border: '1px solid rgba(255,255,255,0.06)',
};

const iconStyle: CSSProperties = {
  fontSize: '22px',
  width: '36px',
  textAlign: 'center',
  flexShrink: 0,
};

const infoStyle: CSSProperties = {
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  gap: '2px',
};

const labelTextStyle: CSSProperties = {
  fontFamily: "'Cairo', sans-serif",
  fontSize: '14px',
  fontWeight: 700,
  color: 'var(--white)',
};

const noteTextStyle: CSSProperties = {
  fontFamily: "'IBM Plex Arabic', sans-serif",
  fontSize: '12px',
  color: 'var(--gray-3)',
};

const dateTextStyle: CSSProperties = {
  fontFamily: "'Cairo', sans-serif",
  fontSize: '11px',
  color: 'var(--muted)',
};

const amountStyle = (color: string): CSSProperties => ({
  fontFamily: "'Cairo', sans-serif",
  fontSize: '16px',
  fontWeight: 700,
  color,
  direction: 'ltr',
  textAlign: 'left',
  flexShrink: 0,
});

const emptyStyle: CSSProperties = {
  fontFamily: "'Cairo', sans-serif",
  fontSize: '15px',
  color: 'var(--gray-3)',
  textAlign: 'center',
  padding: '32px 16px',
};

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('ar-SA', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function BucketHistory({ transactions }: BucketHistoryProps) {
  if (transactions.length === 0) {
    return (
      <div style={sectionStyle}>
        <h3 style={titleStyle}>سجل المعاملات</h3>
        <div style={emptyStyle}>لا توجد معاملات بعد</div>
      </div>
    );
  }

  // Show newest first
  const sorted = [...transactions].reverse();

  return (
    <div style={sectionStyle}>
      <h3 style={titleStyle}>سجل المعاملات</h3>
      <div style={listStyle}>
        {sorted.map((tx) => {
          const cfg = TYPE_CONFIG[tx.type];
          return (
            <div key={tx.id} style={itemStyle}>
              <div style={iconStyle}>{cfg.icon}</div>
              <div style={infoStyle}>
                <div style={labelTextStyle}>{cfg.label}</div>
                {tx.note && <div style={noteTextStyle}>{tx.note}</div>}
                <div style={dateTextStyle}>{formatDate(tx.createdAt)}</div>
              </div>
              <div style={amountStyle(cfg.color)}>
                {cfg.sign}{tx.amount.toFixed(2)} ₪
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
