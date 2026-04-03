import type { CSSProperties } from 'react';

interface StepProgressProps {
  totalSteps: number;
  currentStep: number;
  completedSteps: number[];
}

const containerStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '0',
  padding: '16px 0',
  direction: 'rtl',
};

const stepCircleBase: CSSProperties = {
  width: '36px',
  height: '36px',
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontFamily: "'IBM Plex Arabic', sans-serif",
  fontSize: '14px',
  fontWeight: 700,
  flexShrink: 0,
  transition: 'all 0.3s ease',
  position: 'relative',
};

const lineBase: CSSProperties = {
  height: '3px',
  flex: 1,
  minWidth: '20px',
  maxWidth: '48px',
  transition: 'background 0.3s ease',
};

export default function StepProgress({
  totalSteps,
  currentStep,
  completedSteps,
}: StepProgressProps) {
  const getStepStyle = (stepIndex: number): CSSProperties => {
    const isCompleted = completedSteps.includes(stepIndex);
    const isCurrent = stepIndex === currentStep;

    if (isCompleted) {
      return {
        ...stepCircleBase,
        background: 'linear-gradient(135deg, var(--gold), var(--gold-lt))',
        color: 'var(--navy)',
        boxShadow: '0 2px 8px rgba(249, 168, 37, 0.4)',
      };
    }

    if (isCurrent) {
      return {
        ...stepCircleBase,
        background: 'linear-gradient(135deg, var(--blue), var(--blue-lt))',
        color: 'var(--white)',
        boxShadow: '0 0 0 4px rgba(21, 101, 192, 0.3)',
        animation: 'pulseStep 2s ease-in-out infinite',
      };
    }

    return {
      ...stepCircleBase,
      background: 'transparent',
      border: '2px solid var(--gray-3)',
      color: 'var(--gray-3)',
    };
  };

  const getLineStyle = (afterIndex: number): CSSProperties => {
    const isCompleted = completedSteps.includes(afterIndex);
    return {
      ...lineBase,
      background: isCompleted
        ? 'linear-gradient(90deg, var(--gold), var(--gold-lt))'
        : 'rgba(255, 255, 255, 0.1)',
    };
  };

  return (
    <>
      <style>{`
        @keyframes pulseStep {
          0%, 100% { box-shadow: 0 0 0 4px rgba(21, 101, 192, 0.3); }
          50% { box-shadow: 0 0 0 8px rgba(21, 101, 192, 0.15); }
        }
      `}</style>
      <div style={containerStyle}>
        {Array.from({ length: totalSteps }, (_, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', flex: i < totalSteps - 1 ? 1 : 0 }}>
            <div style={getStepStyle(i)}>
              {completedSteps.includes(i) ? '\u2713' : i + 1}
            </div>
            {i < totalSteps - 1 && <div style={getLineStyle(i)} />}
          </div>
        ))}
      </div>
    </>
  );
}
