import { useState, type CSSProperties } from 'react';

interface Statement {
  text: string;
  correct: boolean;
  feedback?: string;
}

interface TrueFalseConfig {
  instruction?: string;
  statements: Statement[];
}

interface TrueFalseProps {
  config: TrueFalseConfig;
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
  marginBottom: '8px',
  lineHeight: 1.6,
};

const progressTextStyle: CSSProperties = {
  fontFamily: "'Cairo', sans-serif",
  fontSize: '14px',
  color: 'var(--gray-3)',
  marginBottom: '24px',
};

const statementBoxStyle: CSSProperties = {
  background: 'rgba(255, 255, 255, 0.04)',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  borderRadius: 'var(--r)',
  padding: '24px',
  marginBottom: '20px',
  fontFamily: "'IBM Plex Arabic', sans-serif",
  fontSize: '17px',
  color: 'var(--white)',
  lineHeight: 1.7,
  textAlign: 'center',
};

const buttonsRowStyle: CSSProperties = {
  display: 'flex',
  gap: '16px',
  justifyContent: 'center',
};

const tfButtonBase: CSSProperties = {
  flex: 1,
  maxWidth: '200px',
  padding: '14px 24px',
  borderRadius: 'var(--r)',
  fontFamily: "'Cairo', sans-serif",
  fontSize: '18px',
  fontWeight: 700,
  cursor: 'pointer',
  border: '2px solid transparent',
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

const completionStyle: CSSProperties = {
  textAlign: 'center',
  padding: '24px',
};

export default function TrueFalse({ config, onComplete }: TrueFalseProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<(boolean | null)[]>(
    () => new Array(config.statements.length).fill(null),
  );
  const [showFeedback, setShowFeedback] = useState(false);
  const [lastAnswer, setLastAnswer] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);

  const current = config.statements[currentIndex];
  const total = config.statements.length;

  const handleAnswer = (answer: boolean) => {
    if (showFeedback) return;

    setLastAnswer(answer);
    setShowFeedback(true);

    const isCorrect = answer === current.correct;
    const newAnswers = [...answers];
    newAnswers[currentIndex] = answer;
    setAnswers(newAnswers);

    const newScore = isCorrect ? score + 1 : score;
    if (isCorrect) setScore(newScore);

    setTimeout(() => {
      setShowFeedback(false);
      setLastAnswer(null);

      if (currentIndex < total - 1) {
        setCurrentIndex((prev) => prev + 1);
      } else {
        setDone(true);
        const finalScore = Math.round((newScore / total) * 100);
        onComplete(finalScore, {
          answers: newAnswers,
          correctCount: newScore,
          total,
        });
      }
    }, 1800);
  };

  const isCorrect = lastAnswer === current?.correct;

  if (done) {
    const finalScore = Math.round((score / total) * 100);
    return (
      <div style={cardStyle}>
        <div
          style={{
            ...completionStyle,
            animation: 'popIn 0.5s ease-out',
          }}
        >
          <div
            style={{
              fontSize: '48px',
              marginBottom: '12px',
            }}
          >
            {finalScore >= 80 ? '\uD83C\uDF1F' : finalScore >= 50 ? '\uD83D\uDC4D' : '\uD83D\uDCAA'}
          </div>
          <div
            style={{
              fontFamily: "'Cairo', sans-serif",
              fontSize: '22px',
              fontWeight: 700,
              color: 'var(--gold)',
              marginBottom: '8px',
            }}
          >
            {'\u0627\u0646\u062A\u0647\u064A\u062A!'}
          </div>
          <div
            style={{
              fontFamily: "'Cairo', sans-serif",
              fontSize: '16px',
              color: 'var(--gray-3)',
            }}
          >
            {'\u0627\u0644\u0646\u062A\u064A\u062C\u0629: '}{score}{' / '}{total}{' \u0625\u062C\u0627\u0628\u0627\u062A \u0635\u062D\u064A\u062D\u0629'}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={cardStyle}>
      <div style={titleStyle}>
        {config.instruction || '\u062D\u062F\u062F \u0625\u0646 \u0643\u0627\u0646\u062A \u0627\u0644\u0639\u0628\u0627\u0631\u0629 \u0635\u062D\u064A\u062D\u0629 \u0623\u0645 \u062E\u0627\u0637\u0626\u0629'}
      </div>

      <div style={progressTextStyle}>
        {'\u0627\u0644\u0639\u0628\u0627\u0631\u0629 '}{currentIndex + 1}{' \u0645\u0646 '}{total}
      </div>

      <div
        style={{
          ...statementBoxStyle,
          animation: 'fadeIn 0.4s ease-out',
        }}
        key={currentIndex}
      >
        {current.text}
      </div>

      <div style={buttonsRowStyle}>
        <button
          style={{
            ...tfButtonBase,
            background: 'linear-gradient(135deg, var(--green), var(--green-lt))',
            color: 'var(--white)',
            ...(showFeedback && lastAnswer === true
              ? {
                  transform: 'scale(1.05)',
                  boxShadow: `0 4px 16px ${
                    isCorrect ? 'rgba(46, 125, 50, 0.4)' : 'rgba(198, 40, 40, 0.4)'
                  }`,
                }
              : {}),
          }}
          onClick={() => handleAnswer(true)}
          disabled={showFeedback}
        >
          {'\u0635\u062D\u064A\u062D'}
        </button>
        <button
          style={{
            ...tfButtonBase,
            background: 'linear-gradient(135deg, var(--red), #E53935)',
            color: 'var(--white)',
            ...(showFeedback && lastAnswer === false
              ? {
                  transform: 'scale(1.05)',
                  boxShadow: `0 4px 16px ${
                    isCorrect ? 'rgba(46, 125, 50, 0.4)' : 'rgba(198, 40, 40, 0.4)'
                  }`,
                }
              : {}),
          }}
          onClick={() => handleAnswer(false)}
          disabled={showFeedback}
        >
          {'\u062E\u0627\u0637\u0626'}
        </button>
      </div>

      {showFeedback && (
        <div
          style={{
            ...feedbackStyle,
            background: isCorrect
              ? 'rgba(46, 125, 50, 0.2)'
              : 'rgba(198, 40, 40, 0.15)',
            color: isCorrect ? 'var(--green-lt)' : '#ef9a9a',
            border: `1px solid ${
              isCorrect
                ? 'rgba(102, 187, 106, 0.3)'
                : 'rgba(198, 40, 40, 0.3)'
            }`,
            animation: isCorrect ? 'popIn 0.4s ease-out' : 'shakeX 0.5s ease-out',
          }}
        >
          {isCorrect ? '\u2705 ' : '\u274C '}
          {current.feedback ||
            (isCorrect
              ? '\u0625\u062C\u0627\u0628\u0629 \u0635\u062D\u064A\u062D\u0629!'
              : `\u0627\u0644\u0625\u062C\u0627\u0628\u0629 \u0627\u0644\u0635\u062D\u064A\u062D\u0629: ${current.correct ? '\u0635\u062D\u064A\u062D' : '\u062E\u0627\u0637\u0626'}`)}
        </div>
      )}
    </div>
  );
}
