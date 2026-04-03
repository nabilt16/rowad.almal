import type { CSSProperties } from 'react';
import { Link } from 'react-router-dom';

interface HeaderProps {
  /** Grade number to display as badge (e.g. 4, 5, 6) */
  gradeNumber?: number;
  /** Page title */
  title?: string;
  /** Show back navigation button */
  showBack?: boolean;
  /** Back link target (defaults to /home) */
  backTo?: string;
  /** Back link label */
  backLabel?: string;
}

const headerStyle: CSSProperties = {
  textAlign: 'center',
  padding: '36px 20px 28px',
  animation: 'fadeDown 0.6s ease both',
};

const backBtnStyle: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '6px',
  background: 'rgba(255,255,255,0.10)',
  border: '1px solid rgba(255,255,255,0.15)',
  borderRadius: '12px',
  padding: '8px 16px',
  fontFamily: "'IBM Plex Arabic', sans-serif",
  fontSize: '15px',
  fontWeight: 600,
  color: 'var(--muted)',
  cursor: 'pointer',
  transition: 'all 0.2s',
  marginBottom: '18px',
  textDecoration: 'none',
};

const gradeBadgeStyle: CSSProperties = {
  display: 'inline-block',
  background: 'linear-gradient(135deg, var(--gold), #E65100)',
  color: 'white',
  fontSize: '11px',
  fontWeight: 800,
  letterSpacing: '3px',
  textTransform: 'uppercase',
  padding: '5px 18px',
  borderRadius: '30px',
  marginBottom: '18px',
  fontFamily: "'Cairo', sans-serif",
};

const titleStyle: CSSProperties = {
  fontFamily: "'IBM Plex Arabic', sans-serif",
  fontSize: 'clamp(30px, 7vw, 58px)',
  fontWeight: 900,
  lineHeight: 1.15,
  background: 'linear-gradient(135deg, #fff 0%, var(--sky) 45%, var(--gold-lt) 100%)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
  marginBottom: '10px',
};

const GRADE_NAMES: Record<number, string> = {
  4: 'الصف الرابع',
  5: 'الصف الخامس',
  6: 'الصف السادس',
};

export default function Header({
  gradeNumber,
  title = 'رواد المال',
  showBack = false,
  backTo = '/home',
  backLabel = 'العودة',
}: HeaderProps) {
  return (
    <header style={headerStyle}>
      {showBack && (
        <div style={{ textAlign: 'right' }}>
          <Link to={backTo} style={backBtnStyle}>
            <span style={{ fontSize: '11px' }}>&#9664;</span>
            {backLabel}
          </Link>
        </div>
      )}

      {gradeNumber && (
        <div style={gradeBadgeStyle}>
          {GRADE_NAMES[gradeNumber] || `الصف ${gradeNumber}`}
        </div>
      )}

      <h1 style={titleStyle}>{title}</h1>
    </header>
  );
}
