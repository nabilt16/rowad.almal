import { useState, type CSSProperties } from 'react';
import { playCorrect, playWrong, playClick } from '../../utils/audio';
import { confettiBurst, flyStars } from '../../utils/confetti';

interface QuizChoice {
  text: string;
  correct: boolean;
}

interface QuizCardProps {
  question: string;
  choices: QuizChoice[];
  onAnswer: (choiceIndex: number, isCorrect: boolean) => void;
}

const cardStyle: CSSProperties = {
  background: 'rgba(255,255,255,0.06)',
  borderRadius: 'var(--r-lg)',
  padding: '24px',
  border: '1px solid rgba(255,255,255,0.11)',
  marginBottom: '18px',
  animation: 'panelIn 0.3s ease',
};

const headingStyle: CSSProperties = {
  fontFamily: "'IBM Plex Arabic', sans-serif",
  fontSize: '17px',
  fontWeight: 800,
  marginBottom: '18px',
  color: 'white',
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
};

const questionStyle: CSSProperties = {
  fontFamily: "'IBM Plex Arabic', sans-serif",
  fontSize: '19px',
  fontWeight: 700,
  lineHeight: 2,
  color: 'rgba(255,255,255,0.92)',
  marginBottom: '18px',
};

const choicesContainerStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '10px',
};

const CHOICE_LABELS = ['\u0623', '\u0628', '\u062C', '\u062F', '\u0647\u0640'];

const choiceBaseStyle: CSSProperties = {
  padding: '14px 18px',
  border: '2px solid rgba(255,255,255,0.22)',
  borderRadius: 'var(--r)',
  background: 'rgba(255,255,255,0.09)',
  cursor: 'pointer',
  fontFamily: "'IBM Plex Arabic', sans-serif",
  fontSize: '20px',
  fontWeight: 600,
  textAlign: 'right',
  transition: 'all 0.22s',
  color: 'rgba(255,255,255,0.95)',
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
};

const choiceIconStyle: CSSProperties = {
  fontSize: '15px',
  fontWeight: 800,
  flexShrink: 0,
  width: '28px',
  height: '28px',
  borderRadius: '8px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: 'rgba(255,255,255,0.15)',
};

const feedbackOkStyle: CSSProperties = {
  marginTop: '14px',
  padding: '16px 20px',
  borderRadius: 'var(--r)',
  fontSize: '16px',
  lineHeight: 1.9,
  background: 'rgba(46,125,50,0.15)',
  borderRight: '4px solid var(--green)',
  color: '#A5D6A7',
  animation: 'popIn 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)',
};

const feedbackBadStyle: CSSProperties = {
  ...feedbackOkStyle,
  background: 'rgba(249,168,37,0.12)',
  borderRight: '4px solid var(--gold)',
  color: '#FFE082',
};

type ChoiceState = 'idle' | 'ok' | 'bad' | 'dim';

function getChoiceStyle(state: ChoiceState): CSSProperties {
  switch (state) {
    case 'ok':
      return {
        ...choiceBaseStyle,
        borderColor: 'var(--green)',
        background: 'rgba(46,125,50,0.2)',
        color: '#81C784',
        pointerEvents: 'none',
        animation: 'correctPulse 0.6s ease',
      };
    case 'bad':
      return {
        ...choiceBaseStyle,
        borderColor: '#EF5350',
        background: 'rgba(239,83,80,0.15)',
        color: '#EF9A9A',
        pointerEvents: 'none',
        animation: 'shakeX 0.4s ease',
      };
    case 'dim':
      return {
        ...choiceBaseStyle,
        opacity: 0.4,
        pointerEvents: 'none',
      };
    default:
      return choiceBaseStyle;
  }
}

export default function QuizCard({ question, choices, onAnswer }: QuizCardProps) {
  const [answered, setAnswered] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState(false);

  const handleChoice = (index: number) => {
    if (answered) return;

    playClick();
    const correct = choices[index].correct;
    setAnswered(true);
    setSelectedIndex(index);
    setIsCorrect(correct);

    if (correct) {
      setTimeout(() => {
        playCorrect();
        flyStars(5);
        confettiBurst();
      }, 150);
    } else {
      setTimeout(() => {
        playWrong();
      }, 100);
    }

    onAnswer(index, correct);
  };

  const getState = (index: number): ChoiceState => {
    if (!answered) return 'idle';
    if (index === selectedIndex) return isCorrect ? 'ok' : 'bad';
    if (choices[index].correct && !isCorrect) return 'ok'; // Reveal the correct one
    return 'dim';
  };

  return (
    <div style={cardStyle}>
      <h4 style={headingStyle}>
        <span>{'\u2753'}</span>
        اختبر معلوماتك
      </h4>

      <p style={questionStyle}>{question}</p>

      <div style={choicesContainerStyle}>
        {choices.map((choice, i) => (
          <button
            key={i}
            className={`choice ${getState(i) === 'ok' ? 'ok' : getState(i) === 'bad' ? 'bad' : ''}`}
            style={getChoiceStyle(getState(i))}
            onClick={() => handleChoice(i)}
            disabled={answered}
          >
            <span style={choiceIconStyle}>
              {getState(i) === 'ok'
                ? '\u2714'
                : getState(i) === 'bad'
                  ? '\u2718'
                  : CHOICE_LABELS[i] || String(i + 1)}
            </span>
            {choice.text}
          </button>
        ))}
      </div>

      {answered && (
        <div
          className="feedback-box"
          style={isCorrect ? feedbackOkStyle : feedbackBadStyle}
        >
          {isCorrect ? (
            <>
              <strong>{'\u2B50'} أحسنت!</strong> إجابة صحيحة. استمر في التعلم!
            </>
          ) : (
            <>
              <strong>{'\uD83D\uDCA1'} لا بأس!</strong> الإجابة الصحيحة هي:{' '}
              <strong>{choices.find((c) => c.correct)?.text}</strong>.
              تعلّم من الخطأ وحاول مرة أخرى.
            </>
          )}
        </div>
      )}
    </div>
  );
}
