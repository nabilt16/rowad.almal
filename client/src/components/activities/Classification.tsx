import { useState, type CSSProperties } from 'react';

interface ClassificationConfig {
  instruction?: string;
  items: { id: string; text: string; category: string }[];
  categories: { id: string; label: string; color?: string }[];
}

interface ClassificationProps {
  config: ClassificationConfig;
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
  fontFamily: "'IBM Plex Arabic', sans-serif",
  fontSize: '20px',
  fontWeight: 700,
  color: 'var(--white)',
  marginBottom: '24px',
  lineHeight: 1.6,
};

const sectionLabel: CSSProperties = {
  fontFamily: "'IBM Plex Arabic', sans-serif",
  fontSize: '14px',
  fontWeight: 700,
  color: 'var(--gold)',
  marginBottom: '12px',
};

const itemsPoolStyle: CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: '10px',
  marginBottom: '28px',
  minHeight: '48px',
  padding: '12px',
  borderRadius: 'var(--r)',
  background: 'rgba(255, 255, 255, 0.02)',
  border: '1px dashed rgba(255, 255, 255, 0.1)',
};

const itemChipBase: CSSProperties = {
  padding: '8px 16px',
  borderRadius: '24px',
  fontFamily: "'IBM Plex Arabic', sans-serif",
  fontSize: '14px',
  fontWeight: 600,
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  border: '2px solid rgba(255, 255, 255, 0.15)',
  background: 'rgba(255, 255, 255, 0.06)',
  color: 'var(--white)',
  whiteSpace: 'nowrap' as const,
};

const categoriesGridStyle: CSSProperties = {
  display: 'grid',
  gap: '16px',
  marginBottom: '24px',
};

const categoryBoxBase: CSSProperties = {
  borderRadius: 'var(--r)',
  padding: '16px',
  minHeight: '100px',
  transition: 'all 0.3s ease',
  cursor: 'pointer',
};

const categoryLabelStyle: CSSProperties = {
  fontFamily: "'IBM Plex Arabic', sans-serif",
  fontSize: '16px',
  fontWeight: 700,
  marginBottom: '10px',
};

const categoryItemsStyle: CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: '8px',
  minHeight: '32px',
};

const checkBtnStyle: CSSProperties = {
  width: '100%',
  padding: '14px 24px',
  borderRadius: 'var(--r)',
  background: 'linear-gradient(135deg, var(--blue), var(--blue-lt))',
  color: 'var(--white)',
  fontFamily: "'IBM Plex Arabic', sans-serif",
  fontSize: '16px',
  fontWeight: 700,
  cursor: 'pointer',
  border: 'none',
  transition: 'all 0.3s ease',
};

const feedbackBarStyle: CSSProperties = {
  fontFamily: "'IBM Plex Arabic', sans-serif",
  fontSize: '15px',
  padding: '12px 16px',
  borderRadius: 'var(--r)',
  marginTop: '16px',
  lineHeight: 1.5,
  textAlign: 'center',
};

export default function Classification({ config, onComplete }: ClassificationProps) {
  const [placements, setPlacements] = useState<Record<string, string>>({});
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [completed, setCompleted] = useState(false);

  const unplacedItems = config.items.filter((item) => !placements[item.id]);

  const handleItemClick = (itemId: string) => {
    if (completed) return;

    if (placements[itemId]) {
      // Remove from category
      setPlacements((prev) => {
        const next = { ...prev };
        delete next[itemId];
        return next;
      });
      setSelectedItem(null);
      setFeedback(null);
      return;
    }

    setSelectedItem(itemId === selectedItem ? null : itemId);
  };

  const handleCategoryClick = (categoryId: string) => {
    if (completed || !selectedItem) return;

    setPlacements((prev) => ({
      ...prev,
      [selectedItem]: categoryId,
    }));
    setSelectedItem(null);
    setFeedback(null);
  };

  const handleCheck = () => {
    if (unplacedItems.length > 0) return;

    const allCorrect = config.items.every(
      (item) => placements[item.id] === item.category,
    );

    if (allCorrect) {
      setFeedback('correct');
      setCompleted(true);
      setTimeout(() => {
        onComplete(100, { placements, correct: true });
      }, 1500);
    } else {
      setFeedback('wrong');
      setTimeout(() => setFeedback(null), 1500);
    }
  };

  const gridColumns = config.categories.length <= 2 ? '1fr 1fr' : '1fr 1fr';

  return (
    <div style={cardStyle}>
      <div style={titleStyle}>
        {config.instruction || '\u0635\u0646\u0641 \u0627\u0644\u0639\u0646\u0627\u0635\u0631 \u0627\u0644\u062A\u0627\u0644\u064A\u0629 \u0641\u064A \u0627\u0644\u0641\u0626\u0627\u062A \u0627\u0644\u0645\u0646\u0627\u0633\u0628\u0629'}
      </div>

      {/* Unplaced items pool */}
      {unplacedItems.length > 0 && (
        <>
          <div style={sectionLabel}>
            {'\u0627\u0644\u0639\u0646\u0627\u0635\u0631'} ({unplacedItems.length})
          </div>
          <div style={itemsPoolStyle}>
            {unplacedItems.map((item) => (
              <button
                key={item.id}
                style={{
                  ...itemChipBase,
                  ...(selectedItem === item.id
                    ? {
                        borderColor: 'var(--gold)',
                        background: 'rgba(249, 168, 37, 0.15)',
                        color: 'var(--gold-lt)',
                        transform: 'scale(1.05)',
                      }
                    : {}),
                }}
                onClick={() => handleItemClick(item.id)}
              >
                {item.text}
              </button>
            ))}
          </div>
        </>
      )}

      {/* Hint */}
      {selectedItem && (
        <div
          style={{
            fontFamily: "'IBM Plex Arabic', sans-serif",
            fontSize: '13px',
            color: 'var(--sky)',
            marginBottom: '12px',
            textAlign: 'center',
            animation: 'fadeIn 0.3s ease-out',
          }}
        >
          {'\u0627\u0636\u063A\u0637 \u0639\u0644\u0649 \u0627\u0644\u0641\u0626\u0629 \u0627\u0644\u0645\u0646\u0627\u0633\u0628\u0629 \u0644\u0648\u0636\u0639 \u0627\u0644\u0639\u0646\u0635\u0631'}
        </div>
      )}

      {/* Categories */}
      <div style={{ ...categoriesGridStyle, gridTemplateColumns: gridColumns }}>
        {config.categories.map((cat) => {
          const catItems = config.items.filter(
            (item) => placements[item.id] === cat.id,
          );
          const catColor = cat.color || 'var(--blue)';

          return (
            <div
              key={cat.id}
              style={{
                ...categoryBoxBase,
                background: `rgba(255, 255, 255, 0.03)`,
                border: `2px solid ${
                  selectedItem ? catColor : 'rgba(255, 255, 255, 0.08)'
                }`,
                ...(selectedItem
                  ? {
                      boxShadow: `0 0 12px ${catColor}33`,
                      cursor: 'pointer',
                    }
                  : {}),
              }}
              onClick={() => handleCategoryClick(cat.id)}
            >
              <div style={{ ...categoryLabelStyle, color: catColor }}>
                {cat.label}
              </div>
              <div style={categoryItemsStyle}>
                {catItems.map((item) => (
                  <button
                    key={item.id}
                    style={{
                      ...itemChipBase,
                      borderColor: catColor,
                      background: `${catColor}22`,
                      fontSize: '13px',
                      padding: '6px 12px',
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleItemClick(item.id);
                    }}
                  >
                    {item.text} \u00D7
                  </button>
                ))}
                {catItems.length === 0 && (
                  <span
                    style={{
                      fontFamily: "'IBM Plex Arabic', sans-serif",
                      fontSize: '12px',
                      color: 'var(--gray-3)',
                      fontStyle: 'italic',
                    }}
                  >
                    {'\u0627\u0633\u062D\u0628 \u0627\u0644\u0639\u0646\u0627\u0635\u0631 \u0647\u0646\u0627'}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Check button */}
      {!completed && (
        <button
          style={{
            ...checkBtnStyle,
            opacity: unplacedItems.length > 0 ? 0.5 : 1,
            cursor: unplacedItems.length > 0 ? 'not-allowed' : 'pointer',
          }}
          onClick={handleCheck}
          disabled={unplacedItems.length > 0}
        >
          {unplacedItems.length > 0
            ? `\u0635\u0646\u0641 \u062C\u0645\u064A\u0639 \u0627\u0644\u0639\u0646\u0627\u0635\u0631 \u0623\u0648\u0644\u0627\u064B (${unplacedItems.length} \u0645\u062A\u0628\u0642\u064A)`
            : '\u062A\u062D\u0642\u0642 \u0645\u0646 \u0627\u0644\u062A\u0635\u0646\u064A\u0641'}
        </button>
      )}

      {/* Feedback */}
      {feedback && (
        <div
          style={{
            ...feedbackBarStyle,
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
            animation:
              feedback === 'correct'
                ? 'popIn 0.4s ease-out'
                : 'shakeX 0.5s ease-out',
          }}
        >
          {feedback === 'correct'
            ? '\u2705 \u0623\u062D\u0633\u0646\u062A! \u062A\u0635\u0646\u064A\u0641 \u0635\u062D\u064A\u062D'
            : '\u274C \u0628\u0639\u0636 \u0627\u0644\u0639\u0646\u0627\u0635\u0631 \u0641\u064A \u063A\u064A\u0631 \u0645\u0643\u0627\u0646\u0647\u0627\u060C \u062D\u0627\u0648\u0644 \u0645\u0631\u0629 \u0623\u062E\u0631\u0649'}
        </div>
      )}
    </div>
  );
}
