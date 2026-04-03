import { useState, type CSSProperties } from 'react';
import StepProgress from './shared/StepProgress';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface StepInteraction {
  type: 'input' | 'multiple_choice' | 'selection';
  /** For input type */
  placeholder?: string;
  /** For multiple_choice / selection types */
  choices?: { text: string; correct?: boolean; value?: string }[];
  /** Expected value for input validation (string or number) */
  expected?: string | number;
  /** Tolerance for numeric input validation */
  tolerance?: number;
}

interface Step {
  title: string;
  description?: string;
  content?: string;
  interaction?: StepInteraction;
  feedback?: { correct?: string; wrong?: string };
}

interface StepActivityConfig {
  title?: string;
  steps: Step[];
}

interface StepActivityProps {
  activityType: string;
  config: StepActivityConfig;
  onComplete: (score: number, answers: Record<string, unknown>) => void;
}

/* ------------------------------------------------------------------ */
/*  Styles                                                             */
/* ------------------------------------------------------------------ */

const cardStyle: CSSProperties = {
  background: 'rgba(255, 255, 255, 0.06)',
  border: '1px solid rgba(255, 255, 255, 0.08)',
  borderRadius: 'var(--r-lg)',
  padding: '32px',
  direction: 'rtl',
};

const activityTitleStyle: CSSProperties = {
  fontFamily: "'Cairo', sans-serif",
  fontSize: '22px',
  fontWeight: 900,
  color: 'var(--gold)',
  marginBottom: '8px',
  textAlign: 'center',
};

const stepContainerStyle: CSSProperties = {
  marginTop: '20px',
  animation: 'fadeIn 0.4s ease-out',
};

const stepTitleStyle: CSSProperties = {
  fontFamily: "'Cairo', sans-serif",
  fontSize: '18px',
  fontWeight: 700,
  color: 'var(--white)',
  marginBottom: '12px',
  lineHeight: 1.5,
};

const stepContentStyle: CSSProperties = {
  fontFamily: "'Noto Naskh Arabic', serif",
  fontSize: '15px',
  color: 'var(--gray-3)',
  lineHeight: 1.7,
  marginBottom: '20px',
  background: 'rgba(255, 255, 255, 0.03)',
  borderRadius: 'var(--r)',
  padding: '16px',
  border: '1px solid rgba(255, 255, 255, 0.05)',
};

const inputStyle: CSSProperties = {
  width: '100%',
  padding: '12px 16px',
  borderRadius: 'var(--r)',
  border: '2px solid rgba(255, 255, 255, 0.15)',
  background: 'rgba(255, 255, 255, 0.04)',
  color: 'var(--white)',
  fontFamily: "'Noto Naskh Arabic', serif",
  fontSize: '16px',
  outline: 'none',
  transition: 'border-color 0.3s ease',
  direction: 'rtl',
  marginBottom: '12px',
};

const choiceButtonBase: CSSProperties = {
  width: '100%',
  padding: '12px 16px',
  borderRadius: 'var(--r)',
  fontFamily: "'Noto Naskh Arabic', serif",
  fontSize: '15px',
  fontWeight: 600,
  textAlign: 'right',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  border: '2px solid rgba(255, 255, 255, 0.12)',
  background: 'rgba(255, 255, 255, 0.04)',
  color: 'var(--white)',
  lineHeight: 1.5,
};

const nextBtnStyle: CSSProperties = {
  padding: '12px 32px',
  borderRadius: 'var(--r)',
  background: 'linear-gradient(135deg, var(--blue), var(--blue-lt))',
  color: 'var(--white)',
  fontFamily: "'Cairo', sans-serif",
  fontSize: '15px',
  fontWeight: 700,
  cursor: 'pointer',
  border: 'none',
  transition: 'all 0.3s ease',
};

const completeBtnStyle: CSSProperties = {
  ...nextBtnStyle,
  background: 'linear-gradient(135deg, var(--gold), var(--gold-lt))',
  color: 'var(--navy)',
};

const feedbackStyle: CSSProperties = {
  fontFamily: "'Cairo', sans-serif",
  fontSize: '14px',
  padding: '10px 14px',
  borderRadius: 'var(--r)',
  marginBottom: '12px',
  lineHeight: 1.5,
};

const btnRowStyle: CSSProperties = {
  display: 'flex',
  justifyContent: 'flex-start',
  gap: '12px',
  marginTop: '16px',
};

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function StepActivity({
  activityType: _activityType,
  config,
  onComplete,
}: StepActivityProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [stepAnswers, setStepAnswers] = useState<Record<number, string>>({});
  const [inputValue, setInputValue] = useState('');
  const [selectedChoice, setSelectedChoice] = useState<number | null>(null);
  const [stepFeedback, setStepFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [stepLocked, setStepLocked] = useState(false);

  const steps = config.steps;
  const step = steps[currentStep];
  const totalSteps = steps.length;
  const isLastStep = currentStep === totalSteps - 1;

  const hasInteraction = !!step.interaction;

  /* Check if current step interaction is satisfied */
  const isStepSatisfied = (): boolean => {
    if (!hasInteraction) return true;
    if (completedSteps.includes(currentStep)) return true;

    const interaction = step.interaction!;

    switch (interaction.type) {
      case 'input':
        return inputValue.trim() !== '';
      case 'multiple_choice':
      case 'selection':
        return selectedChoice !== null;
      default:
        return true;
    }
  };

  /* Validate the current step's interaction answer */
  const validateStep = (): boolean => {
    if (!hasInteraction) return true;
    if (completedSteps.includes(currentStep)) return true;

    const interaction = step.interaction!;

    switch (interaction.type) {
      case 'input': {
        if (interaction.expected === undefined) return true;
        const expected =
          typeof interaction.expected === 'number'
            ? interaction.expected
            : parseFloat(String(interaction.expected));
        const userVal = parseFloat(inputValue);
        if (isNaN(expected)) {
          // String comparison
          return (
            inputValue.trim().toLowerCase() ===
            String(interaction.expected).trim().toLowerCase()
          );
        }
        const tolerance = interaction.tolerance ?? 0.01;
        return !isNaN(userVal) && Math.abs(userVal - expected) <= tolerance;
      }
      case 'multiple_choice': {
        if (selectedChoice === null || !interaction.choices) return false;
        const chosen = interaction.choices[selectedChoice];
        return chosen?.correct === true;
      }
      case 'selection': {
        if (selectedChoice === null || !interaction.choices) return false;
        const chosen = interaction.choices[selectedChoice];
        return chosen?.correct === true;
      }
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (stepLocked) return;

    if (hasInteraction && !completedSteps.includes(currentStep)) {
      const valid = validateStep();

      if (!valid) {
        setStepFeedback('wrong');
        setTimeout(() => setStepFeedback(null), 1500);
        return;
      }

      setStepFeedback('correct');
      setStepLocked(true);

      // Store answer
      setStepAnswers((prev) => ({
        ...prev,
        [currentStep]:
          inputValue || (selectedChoice !== null ? String(selectedChoice) : ''),
      }));

      setTimeout(() => {
        setCompletedSteps((prev) => [...prev, currentStep]);
        setStepFeedback(null);
        setStepLocked(false);

        if (!isLastStep) {
          setCurrentStep((prev) => prev + 1);
          setInputValue('');
          setSelectedChoice(null);
        }
      }, 1200);

      return;
    }

    // No interaction or already completed
    if (!completedSteps.includes(currentStep)) {
      setCompletedSteps((prev) => [...prev, currentStep]);
    }

    if (!isLastStep) {
      setCurrentStep((prev) => prev + 1);
      setInputValue('');
      setSelectedChoice(null);
      setStepFeedback(null);
    }
  };

  const handleComplete = () => {
    if (stepLocked) return;

    if (hasInteraction && !completedSteps.includes(currentStep)) {
      const valid = validateStep();
      if (!valid) {
        setStepFeedback('wrong');
        setTimeout(() => setStepFeedback(null), 1500);
        return;
      }

      setStepFeedback('correct');
      setStepLocked(true);

      const finalAnswers = {
        ...stepAnswers,
        [currentStep]:
          inputValue || (selectedChoice !== null ? String(selectedChoice) : ''),
      };

      setTimeout(() => {
        const allSteps = [...completedSteps, currentStep];
        const score = Math.round((allSteps.length / totalSteps) * 100);
        onComplete(score, { stepAnswers: finalAnswers, completedSteps: allSteps });
      }, 1200);

      return;
    }

    // Final step without interaction
    const allSteps = [...completedSteps, currentStep];
    const score = Math.round((allSteps.length / totalSteps) * 100);
    onComplete(score, { stepAnswers, completedSteps: allSteps });
  };

  const getChoiceStyle = (index: number): CSSProperties => {
    const isSelected = selectedChoice === index;

    if (stepFeedback && isSelected) {
      const isCorrect = stepFeedback === 'correct';
      return {
        ...choiceButtonBase,
        background: isCorrect
          ? 'rgba(46, 125, 50, 0.25)'
          : 'rgba(198, 40, 40, 0.2)',
        borderColor: isCorrect ? 'var(--green-lt)' : 'var(--red)',
        color: isCorrect ? 'var(--green-lt)' : '#ef9a9a',
        animation: isCorrect ? 'popIn 0.4s ease-out' : 'shakeX 0.5s ease-out',
      };
    }

    if (isSelected) {
      return {
        ...choiceButtonBase,
        borderColor: 'var(--gold)',
        background: 'rgba(249, 168, 37, 0.12)',
        color: 'var(--gold-lt)',
      };
    }

    return choiceButtonBase;
  };

  return (
    <div style={cardStyle}>
      {/* Activity title */}
      {config.title && <div style={activityTitleStyle}>{config.title}</div>}

      {/* Step Progress */}
      <StepProgress
        totalSteps={totalSteps}
        currentStep={currentStep}
        completedSteps={completedSteps}
      />

      {/* Current Step */}
      <div style={stepContainerStyle} key={currentStep}>
        <div style={stepTitleStyle}>{step.title}</div>

        {(step.description || step.content) && (
          <div style={stepContentStyle}>
            {step.description || step.content}
          </div>
        )}

        {/* Interaction */}
        {hasInteraction && !completedSteps.includes(currentStep) && (
          <div style={{ marginBottom: '8px' }}>
            {step.interaction!.type === 'input' && (
              <input
                type="text"
                style={inputStyle}
                value={inputValue}
                onChange={(e) => {
                  setInputValue(e.target.value);
                  setStepFeedback(null);
                }}
                placeholder={step.interaction!.placeholder || '\u0627\u0643\u062A\u0628 \u0625\u062C\u0627\u0628\u062A\u0643 \u0647\u0646\u0627'}
                disabled={stepLocked}
              />
            )}

            {(step.interaction!.type === 'multiple_choice' ||
              step.interaction!.type === 'selection') &&
              step.interaction!.choices && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {step.interaction!.choices.map((choice, i) => (
                    <button
                      key={i}
                      style={getChoiceStyle(i)}
                      onClick={() => {
                        if (!stepLocked) {
                          setSelectedChoice(i);
                          setStepFeedback(null);
                        }
                      }}
                      disabled={stepLocked}
                    >
                      {choice.text}
                    </button>
                  ))}
                </div>
              )}
          </div>
        )}

        {/* Step feedback */}
        {stepFeedback && (
          <div
            style={{
              ...feedbackStyle,
              background:
                stepFeedback === 'correct'
                  ? 'rgba(46, 125, 50, 0.2)'
                  : 'rgba(198, 40, 40, 0.15)',
              color: stepFeedback === 'correct' ? 'var(--green-lt)' : '#ef9a9a',
              border: `1px solid ${
                stepFeedback === 'correct'
                  ? 'rgba(102, 187, 106, 0.3)'
                  : 'rgba(198, 40, 40, 0.3)'
              }`,
              animation:
                stepFeedback === 'correct'
                  ? 'popIn 0.4s ease-out'
                  : 'shakeX 0.5s ease-out',
            }}
          >
            {stepFeedback === 'correct'
              ? step.feedback?.correct || '\u2705 \u0635\u062D\u064A\u062D!'
              : step.feedback?.wrong || '\u274C \u062D\u0627\u0648\u0644 \u0645\u0631\u0629 \u0623\u062E\u0631\u0649'}
          </div>
        )}

        {/* Navigation */}
        <div style={btnRowStyle}>
          {isLastStep ? (
            <button
              style={{
                ...completeBtnStyle,
                opacity: isStepSatisfied() || completedSteps.includes(currentStep) ? 1 : 0.5,
              }}
              onClick={handleComplete}
              disabled={stepLocked || (!isStepSatisfied() && !completedSteps.includes(currentStep))}
            >
              {'\u0625\u0646\u0647\u0627\u0621 \u0627\u0644\u0646\u0634\u0627\u0637'}
            </button>
          ) : (
            <button
              style={{
                ...nextBtnStyle,
                opacity: isStepSatisfied() || completedSteps.includes(currentStep) ? 1 : 0.5,
              }}
              onClick={handleNext}
              disabled={stepLocked || (!isStepSatisfied() && !completedSteps.includes(currentStep))}
            >
              {'\u0627\u0644\u062A\u0627\u0644\u064A \u2190'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
