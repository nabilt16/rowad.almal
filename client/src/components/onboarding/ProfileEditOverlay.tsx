import { useState, type CSSProperties } from 'react';
import type { StudentProfile, ProfileUpdateInput } from '@rowad/shared';
import { updateProfile } from '../../api/profile';
import { useAuthStore } from '../../stores/authStore';

/* ──────────────────────────────────────────
   Props
   ────────────────────────────────────────── */
interface ProfileEditOverlayProps {
  profile: StudentProfile;
  onSave: () => void;
  onClose: () => void;
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
  animation: 'fadeIn 0.3s ease',
};

const cardStyle: CSSProperties = {
  background: 'var(--white)',
  borderRadius: 'var(--r-lg)',
  padding: '32px',
  width: '100%',
  maxWidth: '500px',
  boxShadow: 'var(--sh-lg)',
  animation: 'popIn 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)',
  direction: 'rtl',
  maxHeight: '90vh',
  overflowY: 'auto',
};

const headingStyle: CSSProperties = {
  fontFamily: "'IBM Plex Arabic', sans-serif",
  fontSize: '22px',
  fontWeight: 900,
  color: 'var(--navy)',
  textAlign: 'center',
  marginBottom: '24px',
};

const sectionTitle: CSSProperties = {
  fontFamily: "'IBM Plex Arabic', sans-serif",
  fontSize: '15px',
  fontWeight: 700,
  color: 'var(--muted)',
  marginBottom: '12px',
  paddingBottom: '6px',
  borderBottom: '2px solid var(--gray-2)',
};

const labelStyle: CSSProperties = {
  display: 'block',
  fontFamily: "'IBM Plex Arabic', sans-serif",
  fontSize: '14px',
  fontWeight: 600,
  color: 'var(--text)',
  marginBottom: '6px',
};

const inputStyle: CSSProperties = {
  width: '100%',
  padding: '12px 16px',
  fontSize: '16px',
  border: '2px solid var(--gray-2)',
  borderRadius: 'var(--r)',
  outline: 'none',
  direction: 'rtl',
  marginBottom: '16px',
  transition: 'border-color 0.2s',
  fontFamily: "'IBM Plex Arabic', sans-serif",
};

const fieldRow: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: '12px',
};

const genderRow: CSSProperties = {
  display: 'flex',
  gap: '12px',
  marginBottom: '16px',
};

const genderBtnBase: CSSProperties = {
  flex: 1,
  padding: '12px',
  borderRadius: 'var(--r)',
  border: '3px solid var(--gray-2)',
  background: 'var(--gray-1)',
  cursor: 'pointer',
  textAlign: 'center',
  transition: 'all 0.25s ease',
  fontFamily: "'IBM Plex Arabic', sans-serif",
  fontSize: '15px',
  fontWeight: 700,
  color: 'var(--navy)',
};

const genderBtnActive: CSSProperties = {
  ...genderBtnBase,
  borderColor: 'var(--blue)',
  background: 'rgba(21, 101, 192, 0.08)',
  boxShadow: '0 0 0 3px rgba(21, 101, 192, 0.15)',
};

const whoWorksRow: CSSProperties = {
  display: 'flex',
  gap: '10px',
  marginBottom: '20px',
};

const whoWorksBtnBase: CSSProperties = {
  flex: 1,
  padding: '10px 12px',
  borderRadius: 'var(--r)',
  border: '3px solid var(--gray-2)',
  background: 'var(--gray-1)',
  cursor: 'pointer',
  fontFamily: "'IBM Plex Arabic', sans-serif",
  fontSize: '14px',
  fontWeight: 700,
  color: 'var(--navy)',
  transition: 'all 0.25s ease',
  textAlign: 'center',
};

const whoWorksBtnActive: CSSProperties = {
  ...whoWorksBtnBase,
  borderColor: 'var(--gold)',
  background: 'rgba(249, 168, 37, 0.10)',
  boxShadow: '0 0 0 3px rgba(249, 168, 37, 0.2)',
};

const btnRow: CSSProperties = {
  display: 'flex',
  gap: '12px',
  marginTop: '24px',
};

const saveBtnStyle: CSSProperties = {
  flex: 1,
  padding: '14px',
  fontSize: '18px',
  fontWeight: 700,
  fontFamily: "'IBM Plex Arabic', sans-serif",
  background: 'linear-gradient(135deg, var(--blue), var(--blue-lt))',
  color: 'var(--white)',
  border: 'none',
  borderRadius: 'var(--r)',
  cursor: 'pointer',
  transition: 'opacity 0.2s',
};

const cancelBtnStyle: CSSProperties = {
  padding: '14px 24px',
  fontSize: '16px',
  fontWeight: 600,
  fontFamily: "'IBM Plex Arabic', sans-serif",
  background: 'transparent',
  color: 'var(--muted)',
  border: '2px solid var(--gray-2)',
  borderRadius: 'var(--r)',
  cursor: 'pointer',
  transition: 'all 0.2s',
};

const errorStyle: CSSProperties = {
  background: '#FFF0F0',
  color: 'var(--red)',
  padding: '10px 16px',
  borderRadius: 'var(--r)',
  fontSize: '14px',
  fontFamily: "'IBM Plex Arabic', sans-serif",
  marginBottom: '12px',
  textAlign: 'center',
};

/* ──────────────────────────────────────────
   Component
   ────────────────────────────────────────── */
export default function ProfileEditOverlay({
  profile,
  onSave,
  onClose,
}: ProfileEditOverlayProps) {
  const [studentName, setStudentName] = useState(profile.studentName);
  const [gender, setGender] = useState<'male' | 'female'>(profile.gender);
  const [whoWorks, setWhoWorks] = useState<'dad' | 'mom' | 'both'>(profile.whoWorks);
  const [dadName, setDadName] = useState(profile.dadName);
  const [dadJob, setDadJob] = useState(profile.dadJob);
  const [momName, setMomName] = useState(profile.momName);
  const [momJob, setMomJob] = useState(profile.momJob);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canSave =
    studentName.trim().length >= 2 &&
    dadName.trim().length >= 1 &&
    dadJob.trim().length >= 1 &&
    momName.trim().length >= 1 &&
    momJob.trim().length >= 1;

  const handleSave = async () => {
    if (!canSave) return;
    setSaving(true);
    setError(null);

    const data: ProfileUpdateInput = {
      studentName: studentName.trim(),
      gender,
      whoWorks,
      dadName: dadName.trim(),
      dadJob: dadJob.trim(),
      momName: momName.trim(),
      momJob: momJob.trim(),
    };

    try {
      const updated = await updateProfile(data);
      useAuthStore.setState({ profile: updated });
      onSave();
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        '\u062d\u062f\u062b \u062e\u0637\u0623\u060c \u062d\u0627\u0648\u0644 \u0645\u0631\u0629 \u0623\u062e\u0631\u0649';
      setError(message);
    } finally {
      setSaving(false);
    }
  };

  // Close on backdrop click
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div style={backdropStyle} onClick={handleBackdropClick}>
      <div style={cardStyle}>
        <h2 style={headingStyle}>
          {'\u062a\u0639\u062f\u064a\u0644 \u0627\u0644\u0645\u0644\u0641 \u0627\u0644\u0634\u062e\u0635\u064a'}
        </h2>

        {error && <div style={errorStyle}>{error}</div>}

        {/* ── Student info ─────────────── */}
        <div style={sectionTitle}>
          {'\u0645\u0639\u0644\u0648\u0645\u0627\u062a \u0627\u0644\u0637\u0627\u0644\u0628/\u0629'}
        </div>

        <label style={labelStyle}>
          {'\u0627\u0633\u0645 \u0627\u0644\u0637\u0627\u0644\u0628/\u0629'}
        </label>
        <input
          type="text"
          style={inputStyle}
          value={studentName}
          onChange={(e) => setStudentName(e.target.value)}
        />

        <label style={labelStyle}>{'\u0627\u0644\u062c\u0646\u0633'}</label>
        <div style={genderRow}>
          <button
            type="button"
            style={gender === 'male' ? genderBtnActive : genderBtnBase}
            onClick={() => setGender('male')}
          >
            {'\ud83d\udc66 \u0648\u0644\u062f'}
          </button>
          <button
            type="button"
            style={gender === 'female' ? genderBtnActive : genderBtnBase}
            onClick={() => setGender('female')}
          >
            {'\ud83d\udc67 \u0628\u0646\u062a'}
          </button>
        </div>

        <label style={labelStyle}>
          {'\u0645\u0646 \u064a\u0639\u0645\u0644 \u0641\u064a \u0627\u0644\u0639\u0627\u0626\u0644\u0629\u061f'}
        </label>
        <div style={whoWorksRow}>
          <button
            type="button"
            style={whoWorks === 'dad' ? whoWorksBtnActive : whoWorksBtnBase}
            onClick={() => setWhoWorks('dad')}
          >
            {'\u0623\u0628\u064a'}
          </button>
          <button
            type="button"
            style={whoWorks === 'mom' ? whoWorksBtnActive : whoWorksBtnBase}
            onClick={() => setWhoWorks('mom')}
          >
            {'\u0623\u0645\u064a'}
          </button>
          <button
            type="button"
            style={whoWorks === 'both' ? whoWorksBtnActive : whoWorksBtnBase}
            onClick={() => setWhoWorks('both')}
          >
            {'\u0643\u0644\u0627\u0647\u0645\u0627'}
          </button>
        </div>

        {/* ── Parent info ──────────────── */}
        <div style={sectionTitle}>
          {'\u0645\u0639\u0644\u0648\u0645\u0627\u062a \u0627\u0644\u0639\u0627\u0626\u0644\u0629'}
        </div>

        <div style={fieldRow}>
          <div>
            <label style={labelStyle}>{'\u0627\u0633\u0645 \u0627\u0644\u0623\u0628'}</label>
            <input
              type="text"
              style={inputStyle}
              value={dadName}
              onChange={(e) => setDadName(e.target.value)}
            />
          </div>
          <div>
            <label style={labelStyle}>{'\u0645\u0647\u0646\u0629 \u0627\u0644\u0623\u0628'}</label>
            <input
              type="text"
              style={inputStyle}
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
              value={momName}
              onChange={(e) => setMomName(e.target.value)}
            />
          </div>
          <div>
            <label style={labelStyle}>{'\u0645\u0647\u0646\u0629 \u0627\u0644\u0623\u0645'}</label>
            <input
              type="text"
              style={inputStyle}
              value={momJob}
              onChange={(e) => setMomJob(e.target.value)}
            />
          </div>
        </div>

        {/* ── Action buttons ───────────── */}
        <div style={btnRow}>
          <button type="button" style={cancelBtnStyle} onClick={onClose}>
            {'\u0625\u0644\u063a\u0627\u0621'}
          </button>
          <button
            type="button"
            style={{
              ...saveBtnStyle,
              opacity: canSave && !saving ? 1 : 0.5,
              cursor: canSave && !saving ? 'pointer' : 'not-allowed',
            }}
            onClick={handleSave}
            disabled={!canSave || saving}
          >
            {saving
              ? '\u062c\u0627\u0631\u064d \u0627\u0644\u062d\u0641\u0638...'
              : '\u062d\u0641\u0638 \u0627\u0644\u062a\u0639\u062f\u064a\u0644\u0627\u062a'}
          </button>
        </div>
      </div>
    </div>
  );
}
