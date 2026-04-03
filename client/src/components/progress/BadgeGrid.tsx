import { useEffect, type CSSProperties } from 'react';
import { useProgressStore } from '../../stores/progressStore';
import BadgeCard from './BadgeCard';
import LoadingSpinner from '../shared/LoadingSpinner';

interface BadgeGridProps {
  gradeNumber: number;
}

/* ---------- styles ---------- */

const containerStyle: CSSProperties = {
  background: 'rgba(255,255,255,0.06)',
  border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: 'var(--r-lg)',
  padding: '28px 24px',
  backdropFilter: 'blur(12px)',
  animation: 'panelIn 0.35s ease',
};

const headingStyle: CSSProperties = {
  fontFamily: "'IBM Plex Arabic', sans-serif",
  fontSize: '20px',
  fontWeight: 800,
  color: 'var(--gold)',
  marginBottom: '8px',
  textAlign: 'center',
};

const subtitleStyle: CSSProperties = {
  fontFamily: "'IBM Plex Arabic', sans-serif",
  fontSize: '14px',
  color: 'rgba(255,255,255,0.5)',
  textAlign: 'center',
  marginBottom: '24px',
};

const gridStyle: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(3, 1fr)',
  gap: '16px',
};

const emptyStyle: CSSProperties = {
  fontFamily: "'IBM Plex Arabic', sans-serif",
  fontSize: '15px',
  color: 'rgba(255,255,255,0.45)',
  textAlign: 'center',
  padding: '28px 0',
};

/* ---------- responsive: media query handled via className + style tag ---------- */

const responsiveStyleId = 'badge-grid-responsive';

function ensureResponsiveStyles() {
  if (typeof document === 'undefined') return;
  if (document.getElementById(responsiveStyleId)) return;
  const style = document.createElement('style');
  style.id = responsiveStyleId;
  style.textContent = `
    @media (max-width: 640px) {
      .badge-grid-responsive {
        grid-template-columns: repeat(2, 1fr) !important;
      }
    }
    @media (max-width: 380px) {
      .badge-grid-responsive {
        grid-template-columns: 1fr !important;
      }
    }
  `;
  document.head.appendChild(style);
}

export default function BadgeGrid({ gradeNumber }: BadgeGridProps) {
  const { badges, fetchBadges } = useProgressStore();

  useEffect(() => {
    ensureResponsiveStyles();
  }, []);

  useEffect(() => {
    fetchBadges(gradeNumber);
  }, [gradeNumber, fetchBadges]);

  /* ---------- sort: earned first, then unearned ---------- */

  const sorted = [...badges].sort((a, b) => {
    if (a.earned && !b.earned) return -1;
    if (!a.earned && b.earned) return 1;
    return 0;
  });

  const earnedCount = badges.filter((b) => b.earned).length;

  if (badges.length === 0) {
    return (
      <div style={containerStyle}>
        <h3 style={headingStyle}>
          {'\uD83C\uDFC5'} الشارات
        </h3>
        <LoadingSpinner text="جارٍ تحميل الشارات..." />
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <h3 style={headingStyle}>
        {'\uD83C\uDFC5'} الشارات
      </h3>
      <p style={subtitleStyle}>
        {earnedCount > 0
          ? `حصلت على ${earnedCount} من ${badges.length} شارات`
          : 'أكمل الدروس والأنشطة لكسب الشارات!'}
      </p>

      {sorted.length > 0 ? (
        <div className="badge-grid-responsive" style={gridStyle}>
          {sorted.map((badge) => (
            <BadgeCard key={badge.id} badge={badge} />
          ))}
        </div>
      ) : (
        <p style={emptyStyle}>لا توجد شارات متاحة حاليًا</p>
      )}
    </div>
  );
}
