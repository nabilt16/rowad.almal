import { useState, type CSSProperties } from 'react';

interface CalcQuestion {
  question: string;
  answer: number;
  tolerance?: number;
  hint?: string;
  unit?: string;
}

interface CalculationConfig {
  instruction?: string;
  questions: CalcQuestion[];
}

interface CalculationProps {
  config: CalculationConfig;
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

const questionBlockStyle: CSSProperties = {
  background: 'rgba(255, 255, 255, 0.03)',
  border: '1px solid rgba(255, 255, 255, 0.08)',
  borderRadius: 'var(--r)',
  padding: '20px',
  marginBottom: '16px',
};

const questionTextStyle: CSSProperties = {
  fontFamily: "'Noto Naskh Arabic', serif",
  fontSize: '16px',
  color: 'var(--white)',
  marginBottom: '14px',
  lineHeight: 1.6,
};

const inputRowStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
};

const inputStyle: CSSProperties = {
  flex: 1,
  padding: '12px 16px',
  borderRadius: 'var(--r)',
  border: '2px solid rgba(255, 255, 255, 0.15)',
  background: 'rgba(255, 255, 255, 0.04)',
  color: 'var(--white)',
  fontFamily: "'Cairo', sans-serif",
  fontSize: '18px',
  fontWeight: 700,
  textAlign: 'center',
  outline: 'none',
  transition: 'border-color 0.3s ease',
  direction: 'ltr' as const,
};

const unitLabelStyle: CSSProperties = {
  fontFamily: "'Cairo', sans-serif",
  fontSize: '14px',
  color: 'var(--gray-3)',
  flexShrink: 0,
};

const hintStyle: CSSProperties = {
  fontFamily: "'Cairo', sans-serif",
  fontSize: '13px',
  color: 'var(--sky)',
  marginTop: '8px',
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
  marginTop: '8px',
};

const feedbackBarStyle: CSSProperties = {
  fontFamily: "'Cairo', sans-serif",
  fontSize: '15px',
  padding: '12px 16px',
  borderRadius: 'var(--r)',
  marginTop: '16px',
  lineHeight: 1.5,
  textAlign: 'center',
};

const resultIconStyle: CSSProperties = {
  width: '24px',
  height: '24px',
  borderRadius: '50%',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '12px',
  fontWeight: 700,
  marginRight: '8px',
  flexShrink: 0,
};

export default function Calculation({ config, onComplete }: CalculationProps) {
  const [userAnswers, setUserAnswers] = useState<string[]>(
    () => new Array(config.questions.length).fill(''),
  );
  const [results, setResults] = useState<(boolean | null)[]>(
    () => new Array(config.questions.length).fill(null),
  );
  const [checked, setChecked] = useState(false);
  const [completed, setCompleted] = useState(false);

  const handleInputChange = (index: number, value: string) => {
    if (completed) return;
    // Allow digits, minus sign, and decimal point
    const cleaned = value.replace(/[^\d.\-]/g, '');
    setUserAnswers((prev) => {
      const next = [...prev];
      next[index] = cleaned;
      return next;
    });
    if (checked) {
      setChecked(false);
      setResults(new Array(config.questions.length).fill(null));
    }
  };

  const handleCheck = () => {
    const newResults = config.questions.map((q, i) => {
      const userVal = parseFloat(userAnswers[i]);
      if (isNaN(userVal)) return false;
      const tolerance = q.tolerance ?? 0.01;
      return Math.abs(userVal - q.answer) <= tolerance;
    });

    setResults(newResults);
    setChecked(true);

    const allCorrect = newResults.every(Boolean);

    if (allCorrect) {
      setCompleted(true);
      const correctCount = newResults.filter(Boolean).length;
      const score = Math.round((correctCount / config.questions.length) * 100);
      setTimeout(() => {
        onComplete(score, {
          answers: userAnswers.map(parseFloat),
          results: newResults,
          correct: true,
        });
      }, 1500);
    }
  };

  const allFilled = userAnswers.every((a) => a.trim() !== '');

  const getQuestionStyle = (index: number): CSSProperties => {
    if (!checked || results[index] === null) return questionBlockStyle;

    if (results[index]) {
      return {
        ...questionBlockStyle,
        borderColor: 'var(--green-lt)',
        background: 'rgba(46, 125, 50, 0.1)',
        animation: 'popIn 0.4s ease-out',
      };
    }
    return {
      ...questionBlockStyle,
      borderColor: 'var(--red)',
      background: 'rgba(198, 40, 40, 0.08)',
      animation: 'shakeX 0.5s ease-out',
    };
  };

  const getInputBorderColor = (index: number): string => {
    if (!checked || results[index] === null) return 'rgba(255, 255, 255, 0.15)';
    return results[index] ? 'var(--green-lt)' : 'var(--red)';
  };

  return (
    <div style={cardStyle}>
      <div style={titleStyle}>
        {config.instruction || '\u0623\u062C\u0628 \u0639\u0646 \u0627\u0644\u0623\u0633\u0626\u0644\u0629 \u0627\u0644\u062D\u0633\u0627\u0628\u064A\u0629 \u0627\u0644\u062A\u0627\u0644\u064A\u0629'}
      </div>

      {config.questions.map((q, i) => (
        <div key={i} style={getQuestionStyle(i)}>
          <div style={questionTextStyle}>{q.question}</div>
          <div style={inputRowStyle}>
            <input
              type="text"
              inputMode="decimal"
              style={{
                ...inputStyle,
                borderColor: getInputBorderColor(i),
              }}
              value={userAnswers[i]}
              onChange={(e) => handleInputChange(i, e.target.value)}
              placeholder="\u0627\u0644\u0625\u062C\u0627\u0628\u0629"
              disabled={completed}
            />
            {q.unit && <span style={unitLabelStyle}>{q.unit}</span>}
            {checked && results[i] !== null && (
              <span
                style={{
                  ...resultIconStyle,
                  background: results[i]
                    ? 'var(--green-lt)'
                    : 'var(--red)',
                  color: 'var(--white)',
                }}
              >
                {results[i] ? '\u2713' : '\u2717'}
              </span>
            )}
          </div>
          {q.hint && !checked && (
            <div style={hintStyle}>
              {'\uD83D\uDCA1 '}{q.hint}
            </div>
          )}
        </div>
      ))}

      {!completed && (
        <button
          style={{
            ...checkBtnStyle,
            opacity: allFilled ? 1 : 0.5,
            cursor: allFilled ? 'pointer' : 'not-allowed',
          }}
          onClick={handleCheck}
          disabled={!allFilled}
        >
          {'\u062A\u062D\u0642\u0642 \u0645\u0646 \u0627\u0644\u0625\u062C\u0627\u0628\u0627\u062A'}
        </button>
      )}

      {checked && (
        <div
          style={{
            ...feedbackBarStyle,
            background: completed
              ? 'rgba(46, 125, 50, 0.2)'
              : 'rgba(198, 40, 40, 0.15)',
            color: completed ? 'var(--green-lt)' : '#ef9a9a',
            border: `1px solid ${
              completed
                ? 'rgba(102, 187, 106, 0.3)'
                : 'rgba(198, 40, 40, 0.3)'
            }`,
            animation: completed ? 'popIn 0.4s ease-out' : 'fadeIn 0.3s ease-out',
          }}
        >
          {completed
            ? '\u2705 \u0623\u062D\u0633\u0646\u062A! \u062C\u0645\u064A\u0639 \u0627\u0644\u0625\u062C\u0627\u0628\u0627\u062A \u0635\u062D\u064A\u062D\u0629'
            : `\u274C ${results.filter(Boolean).length} \u0645\u0646 ${config.questions.length} \u0635\u062D\u064A\u062D\u0629\u060C \u0631\u0627\u062C\u0639 \u0625\u062C\u0627\u0628\u0627\u062A\u0643`}
        </div>
      )}
    </div>
  );
}
