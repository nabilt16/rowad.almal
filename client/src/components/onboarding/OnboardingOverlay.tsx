import { useState, type CSSProperties } from 'react';
import type { OnboardingInput } from '@rowad/shared';
import { completeOnboarding } from '../../api/profile';
import { useAuthStore } from '../../stores/authStore';
import { confettiBurst, flyStars } from '../../utils/confetti';

/* ──────────────────────────────────────────
   Props
   ────────────────────────────────────────── */
interface OnboardingOverlayProps {
  onComplete: () => void;
}

/* ──────────────────────────────────────────
   Styles
   ────────────────────────────────────────── */
const backdropStyle: CSSProperties = {
  position: 'fixed',
  inset: 0,
  zIndex: 10000,
  background: 'rgba(11, 25, 41, 0.88)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '20px',
  animation: 'fadeIn 0.4s ease',
};

const cardStyle: CSSProperties = {
  background: 'var(--white)',
  borderRadius: 'var(--r-lg)',
  padding: '36px 32px 32px',
  width: '100%',
  maxWidth: '480px',
  boxShadow: 'var(--sh-lg)',
  animation: 'popIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
  direction: 'rtl',
  position: 'relative',
  overflow: 'hidden',
};

const stepIndicatorContainer: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '0',
  marginBottom: '28px',
  direction: 'rtl',
};

const stepCircleBase: CSSProperties = {
  width: '36px',
  height: '36px',
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontFamily: "'Cairo', sans-serif",
  fontSize: '14px',
  fontWeight: 700,
  flexShrink: 0,
  transition: 'all 0.3s ease',
};

const stepLineBase: CSSProperties = {
  height: '3px',
  flex: 1,
  minWidth: '24px',
  maxWidth: '48px',
  transition: 'background 0.3s ease',
};

const headingStyle: CSSProperties = {
  fontFamily: "'Cairo', sans-serif",
  fontSize: '24px',
  fontWeight: 900,
  color: 'var(--navy)',
  textAlign: 'center',
  marginBottom: '24px',
};

const labelStyle: CSSProperties = {
  display: 'block',
  fontFamily: "'Cairo', sans-serif",
  fontSize: '14px',
  fontWeight: 600,
  color: 'var(--text)',
  marginBottom: '6px',
};

const inputStyle: CSSProperties = {
  width: '100%',
  padding: '14px 18px',
  fontSize: '16px',
  border: '2px solid var(--gray-2)',
  borderRadius: 'var(--r)',
  outline: 'none',
  direction: 'rtl',
  marginBottom: '18px',
  transition: 'border-color 0.2s',
  fontFamily: "'IBM Plex Arabic', sans-serif",
};

const genderBtnContainer: CSSProperties = {
  display: 'flex',
  gap: '16px',
  justifyContent: 'center',
  marginBottom: '18px',
};

const genderBtnBase: CSSProperties = {
  flex: 1,
  maxWidth: '160px',
  padding: '20px 16px',
  borderRadius: 'var(--r)',
  border: '3px solid var(--gray-2)',
  background: 'var(--gray-1)',
  cursor: 'pointer',
  textAlign: 'center',
  transition: 'all 0.25s ease',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '8px',
};

const genderBtnActive: CSSProperties = {
  ...genderBtnBase,
  borderColor: 'var(--blue)',
  background: 'rgba(21, 101, 192, 0.08)',
  boxShadow: '0 0 0 4px rgba(21, 101, 192, 0.15)',
};

const genderEmojiStyle: CSSProperties = {
  fontSize: '40px',
  lineHeight: 1,
};

const genderLabelStyle: CSSProperties = {
  fontFamily: "'Cairo', sans-serif",
  fontSize: '16px',
  fontWeight: 700,
  color: 'var(--navy)',
};

const whoWorksBtnContainer: CSSProperties = {
  display: 'flex',
  gap: '12px',
  justifyContent: 'center',
  flexWrap: 'wrap',
  marginBottom: '18px',
};

const whoWorksBtnBase: CSSProperties = {
  padding: '14px 24px',
  borderRadius: 'var(--r)',
  border: '3px solid var(--gray-2)',
  background: 'var(--gray-1)',
  cursor: 'pointer',
  fontFamily: "'Cairo', sans-serif",
  fontSize: '16px',
  fontWeight: 700,
  color: 'var(--navy)',
  transition: 'all 0.25s ease',
  minWidth: '100px',
  textAlign: 'center',
};

const whoWorksBtnActive: CSSProperties = {
  ...whoWorksBtnBase,
  borderColor: 'var(--gold)',
  background: 'rgba(249, 168, 37, 0.10)',
  boxShadow: '0 0 0 4px rgba(249, 168, 37, 0.2)',
};

const navRow: CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginTop: '24px',
  gap: '12px',
};

const primaryBtnStyle: CSSProperties = {
  padding: '14px 32px',
  fontSize: '18px',
  fontWeight: 700,
  fontFamily: "'Cairo', sans-serif",
  background: 'linear-gradient(135deg, var(--blue), var(--blue-lt))',
  color: 'var(--white)',
  border: 'none',
  borderRadius: 'var(--r)',
  cursor: 'pointer',
  flex: 1,
  transition: 'opacity 0.2s',
};

const secondaryBtnStyle: CSSProperties = {
  padding: '14px 24px',
  fontSize: '16px',
  fontWeight: 600,
  fontFamily: "'Cairo', sans-serif",
  background: 'transparent',
  color: 'var(--muted)',
  border: '2px solid var(--gray-2)',
  borderRadius: 'var(--r)',
  cursor: 'pointer',
  transition: 'all 0.2s',
};

const welcomeContainer: CSSProperties = {
  textAlign: 'center',
  padding: '20px 0',
};

const welcomeEmojiStyle: CSSProperties = {
  fontSize: '80px',
  lineHeight: 1,
  marginBottom: '16px',
  animation: 'popIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
};

const welcomeNameStyle: CSSProperties = {
  fontFamily: "'Cairo', sans-serif",
  fontSize: '32px',
  fontWeight: 900,
  color: 'var(--navy)',
  marginBottom: '12px',
};

const welcomeSubtitle: CSSProperties = {
  fontFamily: "'IBM Plex Arabic', sans-serif",
  fontSize: '16px',
  color: 'var(--muted)',
  marginBottom: '32px',
  lineHeight: 1.8,
};

const startBtnStyle: CSSProperties = {
  width: '100%',
  padding: '16px',
  fontSize: '20px',
  fontWeight: 800,
  fontFamily: "'Cairo', sans-serif",
  background: 'linear-gradient(135deg, var(--gold), #E65100)',
  color: 'var(--white)',
  border: 'none',
  borderRadius: 'var(--r)',
  cursor: 'pointer',
  boxShadow: '0 4px 16px rgba(249, 168, 37, 0.4)',
  transition: 'transform 0.2s, box-shadow 0.2s',
};

const errorStyle: CSSProperties = {
  background: '#FFF0F0',
  color: 'var(--red)',
  padding: '10px 16px',
  borderRadius: 'var(--r)',
  fontSize: '14px',
  fontFamily: "'Cairo', sans-serif",
  marginBottom: '12px',
  textAlign: 'center',
};

const fieldRow: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: '12px',
};

/* ──────────────────────────────────────────
   Component
   ────────────────────────────────────────── */
const TOTAL_STEPS = 4;

export default function OnboardingOverlay({ onComplete }: OnboardingOverlayProps) {
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [studentName, setStudentName] = useState('');
  const [gender, setGender] = useState<'male' | 'female' | ''>('');
  const [whoWorks, setWhoWorks] = useState<'dad' | 'mom' | 'both' | ''>('');
  const [dadName, setDadName] = useState('');
  const [dadJob, setDadJob] = useState('');
  const [momName, setMomName] = useState('');
  const [momJob, setMomJob] = useState('');

  /* ── Step validation ─────────────────── */
  const canProceed = (): boolean => {
    switch (step) {
      case 0:
        return studentName.trim().length >= 2 && gender !== '';
      case 1:
        return whoWorks !== '';
      case 2:
        return (
          dadName.trim().length >= 1 &&
          dadJob.trim().length >= 1 &&
          momName.trim().length >= 1 &&
          momJob.trim().length >= 1
        );
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (!canProceed()) return;
    if (step < TOTAL_STEPS - 1) {
      setStep(step + 1);
      // Fire celebration on welcome step
      if (step + 1 === 3) {
        setTimeout(() => {
          confettiBurst();
          flyStars(6);
        }, 300);
      }
    }
  };

  const handleBack = () => {
    if (step > 0) setStep(step - 1);
  };

  /* ── Submit onboarding ───────────────── */
  const handleSubmit = async () => {
    setSubmitting(true);
    setError(null);

    const data: OnboardingInput = {
      studentName: studentName.trim(),
      gender: gender as 'male' | 'female',
      whoWorks: whoWorks as 'dad' | 'mom' | 'both',
      dadName: dadName.trim(),
      dadJob: dadJob.trim(),
      momName: momName.trim(),
      momJob: momJob.trim(),
    };

    try {
      const profile = await completeOnboarding(data);
      // Update the auth store with the new profile
      useAuthStore.setState({ profile: { ...profile, onboarded: true } });
      onComplete();
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        '\u062d\u062f\u062b \u062e\u0637\u0623\u060c \u062d\u0627\u0648\u0644 \u0645\u0631\u0629 \u0623\u062e\u0631\u0649';
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  /* ── Step indicator ──────────────────── */
  const renderStepIndicator = () => (
    <div style={stepIndicatorContainer}>
      {Array.from({ length: TOTAL_STEPS }, (_, i) => {
        const isCompleted = i < step;
        const isCurrent = i === step;

        const circleStyle: CSSProperties = isCompleted
          ? {
              ...stepCircleBase,
              background: 'linear-gradient(135deg, var(--gold), var(--gold-lt))',
              color: 'var(--navy)',
              boxShadow: '0 2px 8px rgba(249, 168, 37, 0.4)',
            }
          : isCurrent
            ? {
                ...stepCircleBase,
                background: 'linear-gradient(135deg, var(--blue), var(--blue-lt))',
                color: 'var(--white)',
                boxShadow: '0 0 0 4px rgba(21, 101, 192, 0.3)',
              }
            : {
                ...stepCircleBase,
                background: 'transparent',
                border: '2px solid var(--gray-3)',
                color: 'var(--gray-3)',
              };

        const lineStyle: CSSProperties = {
          ...stepLineBase,
          background: isCompleted
            ? 'linear-gradient(90deg, var(--gold), var(--gold-lt))'
            : 'var(--gray-2)',
        };

        return (
          <div
            key={i}
            style={{
              display: 'flex',
              alignItems: 'center',
              flex: i < TOTAL_STEPS - 1 ? 1 : 0,
            }}
          >
            <div style={circleStyle}>{isCompleted ? '\u2713' : i + 1}</div>
            {i < TOTAL_STEPS - 1 && <div style={lineStyle} />}
          </div>
        );
      })}
    </div>
  );

  /* ── Step 1: Name & Gender ───────────── */
  const renderStep0 = () => (
    <div>
      <h2 style={headingStyle}>
        {'\u0623\u0647\u0644\u0627\u064b \u0648\u0633\u0647\u0644\u0627\u064b! \ud83d\udc4b'}
      </h2>

      <label style={labelStyle}>
        {'\u0627\u0633\u0645 \u0627\u0644\u0637\u0627\u0644\u0628/\u0629'}
      </label>
      <input
        type="text"
        style={inputStyle}
        placeholder={'\u0627\u0643\u062a\u0628 \u0627\u0633\u0645\u0643 \u0647\u0646\u0627'}
        value={studentName}
        onChange={(e) => setStudentName(e.target.value)}
        autoFocus
      />

      <label style={{ ...labelStyle, textAlign: 'center', marginBottom: '12px' }}>
        {'\u0623\u0646\u0627...'}
      </label>
      <div style={genderBtnContainer}>
        <button
          type="button"
          style={gender === 'male' ? genderBtnActive : genderBtnBase}
          onClick={() => setGender('male')}
        >
          <span style={genderEmojiStyle}>{'\ud83d\udc66'}</span>
          <span style={genderLabelStyle}>{'\u0648\u0644\u062f'}</span>
        </button>
        <button
          type="button"
          style={gender === 'female' ? genderBtnActive : genderBtnBase}
          onClick={() => setGender('female')}
        >
          <span style={genderEmojiStyle}>{'\ud83d\udc67'}</span>
          <span style={genderLabelStyle}>{'\u0628\u0646\u062a'}</span>
        </button>
      </div>
    </div>
  );

  /* ── Step 2: Who Works ───────────────── */
  const renderStep1 = () => (
    <div>
      <h2 style={headingStyle}>
        {'\u0645\u0646 \u064a\u0639\u0645\u0644 \u0641\u064a \u0639\u0627\u0626\u0644\u062a\u0643\u061f'}
      </h2>

      <div style={whoWorksBtnContainer}>
        <button
          type="button"
          style={whoWorks === 'dad' ? whoWorksBtnActive : whoWorksBtnBase}
          onClick={() => setWhoWorks('dad')}
        >
          {'\ud83d\udc68 \u0623\u0628\u064a'}
        </button>
        <button
          type="button"
          style={whoWorks === 'mom' ? whoWorksBtnActive : whoWorksBtnBase}
          onClick={() => setWhoWorks('mom')}
        >
          {'\ud83d\udc69 \u0623\u0645\u064a'}
        </button>
        <button
          type="button"
          style={whoWorks === 'both' ? whoWorksBtnActive : whoWorksBtnBase}
          onClick={() => setWhoWorks('both')}
        >
          {'\ud83d\udc68\u200d\ud83d\udc69\u200d\ud83d\udc67 \u0643\u0644\u0627\u0647\u0645\u0627'}
        </button>
      </div>
    </div>
  );

  /* ── Step 3: Parent Info ─────────────── */
  const renderStep2 = () => (
    <div>
      <h2 style={headingStyle}>
        {'\u0645\u0639\u0644\u0648\u0645\u0627\u062a \u0627\u0644\u0639\u0627\u0626\u0644\u0629'}
      </h2>

      <div style={fieldRow}>
        <div>
          <label style={labelStyle}>{'\u0627\u0633\u0645 \u0627\u0644\u0623\u0628'}</label>
          <input
            type="text"
            style={inputStyle}
            placeholder={'\u0627\u0633\u0645 \u0627\u0644\u0623\u0628'}
            value={dadName}
            onChange={(e) => setDadName(e.target.value)}
          />
        </div>
        <div>
          <label style={labelStyle}>{'\u0645\u0647\u0646\u0629 \u0627\u0644\u0623\u0628'}</label>
          <input
            type="text"
            style={inputStyle}
            placeholder={'\u0645\u0647\u0646\u0629 \u0627\u0644\u0623\u0628'}
            value={dadJob}
            onChange={(e) => setDadJob(e.target.value)}
          />
        </div>
      </div>

      <div style={fieldRow}>
        <div>
          <label style={labelStyle}>{'\u0627\u0633\u0645 \u0627\u0644\u0623\u0645'}</label>
          <input
            type="text"
            style={inputStyle}
            placeholder={'\u0627\u0633\u0645 \u0627\u0644\u0623\u0645'}
            value={momName}
            onChange={(e) => setMomName(e.target.value)}
          />
        </div>
        <div>
          <label style={labelStyle}>{'\u0645\u0647\u0646\u0629 \u0627\u0644\u0623\u0645'}</label>
          <input
            type="text"
            style={inputStyle}
            placeholder={'\u0645\u0647\u0646\u0629 \u0627\u0644\u0623\u0645'}
            value={momJob}
            onChange={(e) => setMomJob(e.target.value)}
          />
        </div>
      </div>
    </div>
  );

  /* ── Step 4: Welcome ─────────────────── */
  const renderStep3 = () => (
    <div style={welcomeContainer}>
      <div style={welcomeEmojiStyle}>{'\ud83c\udf89'}</div>
      <div style={welcomeNameStyle}>
        {'\u0645\u0631\u062d\u0628\u064b\u0627 ' + studentName + '!'}
      </div>
      <p style={welcomeSubtitle}>
        {'\u0623\u0646\u062a' +
          (gender === 'female'
            ? ' \u062c\u0627\u0647\u0632\u0629'
            : ' \u062c\u0627\u0647\u0632') +
          ' \u0644\u0628\u062f\u0621 \u0631\u062d\u0644\u0629 \u0645\u0645\u062a\u0639\u0629 \u0641\u064a \u0639\u0627\u0644\u0645 \u0627\u0644\u0645\u0627\u0644 \u0648\u0627\u0644\u0627\u062f\u062e\u0627\u0631!'}
      </p>

      {error && <div style={errorStyle}>{error}</div>}

      <button
        type="button"
        style={{
          ...startBtnStyle,
          opacity: submitting ? 0.7 : 1,
        }}
        onClick={handleSubmit}
        disabled={submitting}
      >
        {submitting
          ? '\u062c\u0627\u0631\u064d \u0627\u0644\u062d\u0641\u0638...'
          : '\u0627\u0628\u062f\u0623 \u0631\u062d\u0644\u0629 \u0627\u0644\u062a\u0639\u0644\u0651\u0645 \ud83d\ude80'}
      </button>
    </div>
  );

  /* ── Render ──────────────────────────── */
  const renderStep = () => {
    switch (step) {
      case 0:
        return renderStep0();
      case 1:
        return renderStep1();
      case 2:
        return renderStep2();
      case 3:
        return renderStep3();
      default:
        return null;
    }
  };

  return (
    <div style={backdropStyle}>
      <div style={cardStyle}>
        {renderStepIndicator()}
        {renderStep()}

        {/* Navigation buttons (hidden on welcome step) */}
        {step < 3 && (
          <div style={navRow}>
            {step > 0 ? (
              <button type="button" style={secondaryBtnStyle} onClick={handleBack}>
                {'\u0627\u0644\u0633\u0627\u0628\u0642'}
              </button>
            ) : (
              <div />
            )}
            <button
              type="button"
              style={{
                ...primaryBtnStyle,
                opacity: canProceed() ? 1 : 0.5,
                cursor: canProceed() ? 'pointer' : 'not-allowed',
              }}
              onClick={handleNext}
              disabled={!canProceed()}
            >
              {'\u0627\u0644\u062a\u0627\u0644\u064a'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
