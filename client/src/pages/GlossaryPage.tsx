import { type CSSProperties } from 'react';
import { useParams, Link } from 'react-router-dom';
import GlossaryPanel from '../components/glossary/GlossaryPanel';

const pageStyle: CSSProperties = {
  minHeight: '100vh',
  padding: '32px 20px',
  position: 'relative',
  zIndex: 1,
  maxWidth: '800px',
  margin: '0 auto',
};

const backLinkStyle: CSSProperties = {
  fontFamily: "'Cairo', sans-serif",
  fontSize: '14px',
  color: 'var(--sky)',
  textDecoration: 'none',
  display: 'inline-flex',
  alignItems: 'center',
  gap: '6px',
  marginBottom: '24px',
  transition: 'color 0.2s',
};

const headerStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  marginBottom: '32px',
};

const titleStyle: CSSProperties = {
  fontFamily: "'Cairo', sans-serif",
  fontSize: '28px',
  fontWeight: 900,
  color: 'var(--gold)',
};

const titleIconStyle: CSSProperties = {
  fontSize: '32px',
};

export default function GlossaryPage() {
  const { number } = useParams<{ number: string }>();
  const gradeNumber = Number(number);

  return (
    <div style={pageStyle}>
      <Link to={`/grade/${number}`} style={backLinkStyle}>
        {'\u2190'} العودة للصف
      </Link>

      <div style={headerStyle}>
        <span style={titleIconStyle}>{'\uD83D\uDCD6'}</span>
        <h1 style={titleStyle}>قاموس المصطلحات المالية</h1>
      </div>

      <GlossaryPanel gradeNumber={gradeNumber} />
    </div>
  );
}
