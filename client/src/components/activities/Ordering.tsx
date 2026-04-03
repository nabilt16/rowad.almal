import { useState, useCallback, type CSSProperties } from 'react';

interface OrderingConfig {
  instruction?: string;
  items: string[];
  correctOrder: number[];
}

interface OrderingProps {
  config: OrderingConfig;
  onComplete: (score: number, answers: Record<string, unknown>) => void;
}

const cardStyle: CSSProperties = {
  background: 'rgba(255, 255, 255, 0.06)',
  border: '1px solid rgba(255, 255, 255, 0.08)',
  borderRadius: 'var(--r-lg)',
  padding: '32px',
  direction: 'rtl',
};

const titleStyle: CSSProperties = {
  fontFamily: "'Cairo', sans-serif",
  fontSize: '20px',
  fontWeight: 700,
  color: 'var(--white)',
  marginBottom: '24px',
  lineHeight: 1.6,
};

const listStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '10px',
  marginBottom: '24px',
};

const itemBase: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  padding: '14px 16px',
  borderRadius: 'var(--r)',
  background: 'rgba(255, 255, 255, 0.04)',
  border: '2px solid rgba(255, 255, 255, 0.1)',
  color: 'var(--white)',
  fontFamily: "'Noto Naskh Arabic', serif",
  fontSize: '15px',
  lineHeight: 1.5,
  transition: 'all 0.3s ease',
};

const arrowBtnStyle: CSSProperties = {
  width: '32px',
  height: '32px',
  borderRadius: '50%',
  background: 'rgba(255, 255, 255, 0.08)',
  border: '1px solid rgba(255, 255, 255, 0.15)',
  color: 'var(--white)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  fontSize: '14px',
  transition: 'all 0.2s ease',
  flexShrink: 0,
};

const checkBtnStyle: CSSProperties = {
  width: '100%',
  padding: '14px 24px',
  borderRadius: 'var(--r)',
  background: 'linear-gradient(135deg, var(--blue), var(--blue-lt))',
  color: 'var(--white)',
  fontFamily: "'Cairo', sans-serif",
  fontSize: '16px',
  fontWeight: 700,
  cursor: 'pointer',
  border: 'none',
  transition: 'all 0.3s ease',
};

const feedbackStyle: CSSProperties = {
  fontFamily: "'Cairo', sans-serif",
  fontSize: '15px',
  padding: '12px 16px',
  borderRadius: 'var(--r)',
  marginTop: '16px',
  lineHeight: 1.5,
  textAlign: 'center',
};

export default function Ordering({ config, onComplete }: OrderingProps) {
  const [order, setOrder] = useState<number[]>(() =>
    config.items.map((_, i) => i),
  );
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [completed, setCompleted] = useState(false);

  const moveItem = useCallback(
    (fromIndex: number, direction: 'up' | 'down') => {
      if (completed) return;
      const toIndex = direction === 'up' ? fromIndex - 1 : fromIndex + 1;
      if (toIndex < 0 || toIndex >= order.length) return;

      setOrder((prev) => {
        const next = [...prev];
        [next[fromIndex], next[toIndex]] = [next[toIndex], next[fromIndex]];
        return next;
      });
      setFeedback(null);
    },
    [order.length, completed],
  );

  const handleCheck = () => {
    const isCorrect = order.every(
      (itemIndex, position) => itemIndex === config.correctOrder[position],
    );

    if (isCorrect) {
      setFeedback('correct');
      setCompleted(true);
      setTimeout(() => {
        onComplete(100, { finalOrder: order, correct: true });
      }, 1500);
    } else {
      setFeedback('wrong');
      setTimeout(() => setFeedback(null), 1500);
    }
  };

  const getItemStyle = (index: number): CSSProperties => {
    if (feedback === 'correct') {
      return {
        ...itemBase,
        background: 'rgba(46, 125, 50, 0.2)',
        borderColor: 'var(--green-lt)',
        animation: 'popIn 0.4s ease-out',
        animationDelay: `${index * 0.08}s`,
        animationFillMode: 'both',
      };
    }
    if (feedback === 'wrong') {
      return {
        ...itemBase,
        background: 'rgba(198, 40, 40, 0.12)',
        borderColor: 'rgba(198, 40, 40, 0.4)',
        animation: 'shakeX 0.5s ease-out',
      };
    }
    return itemBase;
  };

  return (
    <div style={cardStyle}>
      <div style={titleStyle}>
        {config.instruction || '\u0631\u062A\u0628 \u0627\u0644\u0639\u0646\u0627\u0635\u0631 \u0628\u0627\u0644\u062A\u0631\u062A\u064A\u0628 \u0627\u0644\u0635\u062D\u064A\u062D'}
      </div>

      <div style={listStyle}>
        {order.map((itemIndex, position) => (
          <div key={itemIndex} style={getItemStyle(position)}>
            <span
              style={{
                fontFamily: "'Cairo', sans-serif",
                fontWeight: 700,
                color: 'var(--gold)',
                minWidth: '24px',
              }}
            >
              {position + 1}
            </span>
            <span style={{ flex: 1 }}>{config.items[itemIndex]}</span>
            {!completed && (
              <div style={{ display: 'flex', gap: '6px', flexDirection: 'column' }}>
                <button
                  style={{
                    ...arrowBtnStyle,
                    opacity: position === 0 ? 0.3 : 1,
                  }}
                  onClick={() => moveItem(position, 'up')}
                  disabled={position === 0}
                  aria-label="\u0644\u0644\u0623\u0639\u0644\u0649"
                >
                  \u25B2
                </button>
                <button
                  style={{
                    ...arrowBtnStyle,
                    opacity: position === order.length - 1 ? 0.3 : 1,
                  }}
                  onClick={() => moveItem(position, 'down')}
                  disabled={position === order.length - 1}
                  aria-label="\u0644\u0644\u0623\u0633\u0641\u0644"
                >
                  \u25BC
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {!completed && (
        <button style={checkBtnStyle} onClick={handleCheck}>
          {'\u062A\u062D\u0642\u0642 \u0645\u0646 \u0627\u0644\u062A\u0631\u062A\u064A\u0628'}
        </button>
      )}

      {feedback && (
        <div
          style={{
            ...feedbackStyle,
            background:
              feedback === 'correct'
                ? 'rgba(46, 125, 50, 0.2)'
                : 'rgba(198, 40, 40, 0.15)',
            color: feedback === 'correct' ? 'var(--green-lt)' : '#ef9a9a',
            border: `1px solid ${
              feedback === 'correct'
                ? 'rgba(102, 187, 106, 0.3)'
                : 'rgba(198, 40, 40, 0.3)'
            }`,
            animation: 'fadeIn 0.3s ease-out',
          }}
        >
          {feedback === 'correct'
            ? '\u2705 \u0623\u062D\u0633\u0646\u062A! \u0627\u0644\u062A\u0631\u062A\u064A\u0628 \u0635\u062D\u064A\u062D'
            : '\u274C \u0627\u0644\u062A\u0631\u062A\u064A\u0628 \u063A\u064A\u0631 \u0635\u062D\u064A\u062D\u060C \u062D\u0627\u0648\u0644 \u0645\u0631\u0629 \u0623\u062E\u0631\u0649'}
        </div>
      )}
    </div>
  );
}
