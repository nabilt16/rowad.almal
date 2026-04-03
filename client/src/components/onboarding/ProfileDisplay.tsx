import { useState, type CSSProperties } from 'react';
import type { StudentProfile } from '@rowad/shared';
import ProfileEditOverlay from './ProfileEditOverlay';

/* ──────────────────────────────────────────
   Props
   ────────────────────────────────────────── */
interface ProfileDisplayProps {
  profile: StudentProfile;
}

/* ──────────────────────────────────────────
   Styles
   ────────────────────────────────────────── */
const cardStyle: CSSProperties = {
  background: 'rgba(255, 255, 255, 0.06)',
  border: '1px solid rgba(255, 255, 255, 0.12)',
  borderRadius: 'var(--r-lg)',
  padding: '24px',
  direction: 'rtl',
  position: 'relative',
};

const headerRow: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '16px',
  marginBottom: '20px',
};

const avatarStyle: CSSProperties = {
  width: '56px',
  height: '56px',
  borderRadius: '50%',
  background: 'linear-gradient(135deg, var(--gold), var(--gold-lt))',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '28px',
  flexShrink: 0,
};

const nameStyle: CSSProperties = {
  fontFamily: "'Cairo', sans-serif",
  fontSize: '22px',
  fontWeight: 800,
  color: 'var(--white)',
  lineHeight: 1.3,
};

const subtitleStyle: CSSProperties = {
  fontFamily: "'Noto Naskh Arabic', serif",
  fontSize: '14px',
  color: 'var(--gray-3)',
  marginTop: '2px',
};

const infoGrid: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: '12px',
  marginBottom: '16px',
};

const infoItem: CSSProperties = {
  background: 'rgba(255, 255, 255, 0.05)',
  borderRadius: 'var(--r)',
  padding: '12px 14px',
};

const infoLabel: CSSProperties = {
  fontFamily: "'Cairo', sans-serif",
  fontSize: '11px',
  fontWeight: 600,
  color: 'var(--gray-3)',
  marginBottom: '4px',
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
};

const infoValue: CSSProperties = {
  fontFamily: "'Noto Naskh Arabic', serif",
  fontSize: '15px',
  fontWeight: 600,
  color: 'var(--white)',
};

const editBtnStyle: CSSProperties = {
  position: 'absolute',
  top: '16px',
  left: '16px',
  background: 'rgba(255, 255, 255, 0.10)',
  border: '1px solid rgba(255, 255, 255, 0.15)',
  borderRadius: '12px',
  padding: '8px 16px',
  fontFamily: "'Cairo', sans-serif",
  fontSize: '13px',
  fontWeight: 600,
  color: 'var(--sky)',
  cursor: 'pointer',
  transition: 'all 0.2s',
};

const WHO_WORKS_MAP: Record<string, string> = {
  dad: '\u0623\u0628\u064a',
  mom: '\u0623\u0645\u064a',
  both: '\u0643\u0644\u0627\u0647\u0645\u0627',
};

/* ──────────────────────────────────────────
   Component
   ────────────────────────────────────────── */
export default function ProfileDisplay({ profile }: ProfileDisplayProps) {
  const [showEdit, setShowEdit] = useState(false);

  const genderIcon = profile.gender === 'female' ? '\ud83d\udc67' : '\ud83d\udc66';

  return (
    <>
      <div style={cardStyle}>
        <button
          type="button"
          style={editBtnStyle}
          onClick={() => setShowEdit(true)}
        >
          {'\u270f\ufe0f \u062a\u0639\u062f\u064a\u0644'}
        </button>

        {/* Header: avatar + name */}
        <div style={headerRow}>
          <div style={avatarStyle}>{genderIcon}</div>
          <div>
            <div style={nameStyle}>{profile.studentName}</div>
            <div style={subtitleStyle}>
              {profile.gender === 'female'
                ? '\u0637\u0627\u0644\u0628\u0629'
                : '\u0637\u0627\u0644\u0628'}
              {' \u2022 \u064a\u0639\u0645\u0644: '}
              {WHO_WORKS_MAP[profile.whoWorks] || profile.whoWorks}
            </div>
          </div>
        </div>

        {/* Family info grid */}
        <div style={infoGrid}>
          <div style={infoItem}>
            <div style={infoLabel}>{'\u0627\u0633\u0645 \u0627\u0644\u0623\u0628'}</div>
            <div style={infoValue}>{profile.dadName}</div>
          </div>
          <div style={infoItem}>
            <div style={infoLabel}>{'\u0645\u0647\u0646\u0629 \u0627\u0644\u0623\u0628'}</div>
            <div style={infoValue}>{profile.dadJob}</div>
          </div>
          <div style={infoItem}>
            <div style={infoLabel}>{'\u0627\u0633\u0645 \u0627\u0644\u0623\u0645'}</div>
            <div style={infoValue}>{profile.momName}</div>
          </div>
          <div style={infoItem}>
            <div style={infoLabel}>{'\u0645\u0647\u0646\u0629 \u0627\u0644\u0623\u0645'}</div>
            <div style={infoValue}>{profile.momJob}</div>
          </div>
        </div>
      </div>

      {showEdit && (
        <ProfileEditOverlay
          profile={profile}
          onSave={() => setShowEdit(false)}
          onClose={() => setShowEdit(false)}
        />
      )}
    </>
  );
}
