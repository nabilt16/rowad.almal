import { useState, type CSSProperties } from 'react';

interface Choice {
  text: string;
  correct: boolean;
  feedback?: string;
}

interface MultipleChoiceConfig {
  question: string;
  choices: Choice[];
}

interface MultipleChoiceProps {
  config: MultipleChoiceConfig;
  onComplete: (score: number, answers: Record<string, unknown>) => void;
}

const cardStyle: CSSProperties = {
  background: 'rgba(255, 255, 255, 0.06)',
  border: '1px solid rgba(255, 255, 255, 0.08)',
  borderRadius: 'var(--r-lg)',
  padding: '32px',
  direction: 'rtl',
};

const questionStyle: CSSProperties = {
  fontFamily: "'Cairo', sans-serif",
  fontSize: '20px',
  fontWeight: 700,
  color: 'var(--white)',
  marginBottom: '24px',
  lineHeight: 1.6,
};

const choicesContainerStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
};

const choiceButtonBase: CSSProperties = {
  width: '100%',
  padding: '16px 20px',
  borderRadius: 'var(--r)',
  fontFamily: "'Noto Naskh Arabic', serif",
  fontSize: '16px',
  fontWeight: 600,
  textAlign: 'right',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  border: '2px solid rgba(255, 255, 255, 0.12)',
  background: 'rgba(255, 255, 255, 0.04)',
  color: 'var(--white)',
  lineHeight: 1.5,
};

const feedbackStyle: CSSProperties = {
  fontFamily: "'Cairo', sans-serif",
  fontSize: '15px',
  padding: '12px 16px',
  borderRadius: 'var(--r)',
  marginTop: '16px',
  lineHeight: 1.5,
};

export default function MultipleChoice({ config, onComplete }: MultipleChoiceProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [animating, setAnimating] = useState<'correct' | 'wrong' | null>(null);

  const handleSelect = (index: number) => {
    if (answered) return;

    setSelectedIndex(index);
    setAnswered(true);

    const choice = config.choices[index];
    const isCorrect = choice.correct;

    setAnimating(isCorrect ? 'correct' : 'wrong');

    if (isCorrect) {
      setTimeout(() => {
        onComplete(100, { selectedIndex: index, correct: true });
      }, 1500);
    } else {
      setTimeout(() => {
        setAnimating(null);
        setAnswered(false);
        setSelectedIndex(null);
      }, 1200);
    }
  };

  const getChoiceStyle = (index: number): CSSProperties => {
    if (!answered || selectedIndex !== index) {
      return {
        ...choiceButtonBase,
        ...(selectedIndex === null
          ? {}
          : { opacity: selectedIndex === index ? 1 : 0.5 }),
      };
    }

    const isCorrect = config.choices[index].correct;

    if (isCorrect) {
      return {
        ...choiceButtonBase,
        background: 'rgba(46, 125, 50, 0.3)',
        borderColor: 'var(--green-lt)',
        color: 'var(--green-lt)',
        animation: 'popIn 0.4s ease-out',
      };
    }

    return {
      ...choiceButtonBase,
      background: 'rgba(198, 40, 40, 0.2)',
      borderColor: 'var(--red)',
      color: '#ef9a9a',
      animation: 'shakeX 0.5s ease-out',
    };
  };

  const selectedChoice =
    selectedIndex !== null ? config.choices[selectedIndex] : null;

  return (
    <div style={cardStyle}>
      <div style={questionStyle}>{config.question}</div>

      <div style={choicesContainerStyle}>
        {config.choices.map((choice, i) => (
          <button
            key={i}
            style={getChoiceStyle(i)}
            onClick={() => handleSelect(i)}
            disabled={answered}
          >
            {choice.text}
          </button>
        ))}
      </div>

      {answered && selectedChoice && (
        <div
          style={{
            ...feedbackStyle,
            background: selectedChoice.correct
              ? 'rgba(46, 125, 50, 0.2)'
              : 'rgba(198, 40, 40, 0.15)',
            color: selectedChoice.correct ? 'var(--green-lt)' : '#ef9a9a',
            border: `1px solid ${
              selectedChoice.correct
                ? 'rgba(102, 187, 106, 0.3)'
                : 'rgba(198, 40, 40, 0.3)'
            }`,
            animation: 'fadeIn 0.3s ease-out',
          }}
        >
          {selectedChoice.correct ? '\u2705 ' : '\u274C '}
          {selectedChoice.feedback ||
            (selectedChoice.correct ? '\u0623\u062D\u0633\u0646\u062A! \u0625\u062C\u0627\u0628\u0629 \u0635\u062D\u064A\u062D\u0629' : '\u062D\u0627\u0648\u0644 \u0645\u0631\u0629 \u0623\u062E\u0631\u0649')}
        </div>
      )}
    </div>
  );
}
