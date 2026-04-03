import { type CSSProperties } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';

const GRADES = [
  {
    number: 4,
    nameAr: 'الصف الرابع',
    emoji: '4\uFE0F\u20E3',
    color: 'linear-gradient(135deg, #1565C0, #1E88E5)',
    description: '19 درسًا في 5 وحدات',
  },
  {
    number: 5,
    nameAr: 'الصف الخامس',
    emoji: '5\uFE0F\u20E3',
    color: 'linear-gradient(135deg, #2E7D32, #66BB6A)',
    description: '19 درسًا في 5 وحدات',
  },
  {
    number: 6,
    nameAr: 'الصف السادس',
    emoji: '6\uFE0F\u20E3',
    color: 'linear-gradient(135deg, #F9A825, #FFD54F)',
    description: '20 درسًا في 5 وحدات',
  },
];

const pageStyle: CSSProperties = {
  minHeight: '100vh',
  padding: '40px 20px',
  position: 'relative',
  zIndex: 1,
  animation: 'fadeIn 0.4s ease',
};

const headerStyle: CSSProperties = {
  textAlign: 'center',
  marginBottom: '48px',
};

const logoStyle: CSSProperties = {
  fontFamily: "'IBM Plex Arabic', sans-serif",
  fontSize: '42px',
  fontWeight: 900,
  color: 'var(--gold)',
  marginBottom: '8px',
};

const welcomeStyle: CSSProperties = {
  fontFamily: "'IBM Plex Arabic', sans-serif",
  fontSize: '18px',
  color: 'var(--gray-3)',
};

const logoutBtnStyle: CSSProperties = {
  position: 'absolute',
  top: '20px',
  left: '20px',
  padding: '8px 20px',
  fontSize: '14px',
  fontWeight: 600,
  fontFamily: "'IBM Plex Arabic', sans-serif",
  background: 'rgba(255,255,255,0.1)',
  color: 'var(--gray-3)',
  border: '1px solid var(--gray-3)',
  borderRadius: 'var(--r)',
  cursor: 'pointer',
  transition: 'background 0.2s, color 0.2s',
};

const gridStyle: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
  gap: '24px',
  maxWidth: '960px',
  margin: '0 auto',
};

const cardStyle = (bg: string): CSSProperties => ({
  background: bg,
  borderRadius: 'var(--r-lg)',
  padding: '32px',
  color: 'var(--white)',
  textAlign: 'center',
  boxShadow: 'var(--sh-lg)',
  transition: 'transform 0.2s, box-shadow 0.2s',
  cursor: 'pointer',
  textDecoration: 'none',
  display: 'block',
});

const emojiStyle: CSSProperties = {
  fontSize: '48px',
  marginBottom: '12px',
};

const gradeNameStyle: CSSProperties = {
  fontFamily: "'IBM Plex Arabic', sans-serif",
  fontSize: '24px',
  fontWeight: 700,
  marginBottom: '8px',
};

const descStyle: CSSProperties = {
  fontFamily: "'IBM Plex Arabic', sans-serif",
  fontSize: '14px',
  opacity: 0.9,
  marginBottom: '16px',
};

const enterBtnStyle: CSSProperties = {
  display: 'inline-block',
  padding: '10px 28px',
  fontSize: '16px',
  fontWeight: 700,
  fontFamily: "'IBM Plex Arabic', sans-serif",
  background: 'rgba(255,255,255,0.2)',
  color: 'var(--white)',
  border: '2px solid rgba(255,255,255,0.4)',
  borderRadius: 'var(--r)',
};

/**
 * Derive a display name for the welcome message.
 * Prefers the student's name from their profile, falls back to email,
 * and gracefully handles a fully unauthenticated state.
 */
function useDisplayName(): string {
  const user = useAuthStore((s) => s.user);
  const profile = useAuthStore((s) => s.profile);

  if (profile?.studentName) {
    return profile.studentName;
  }
  if (user?.email) {
    return user.email;
  }
  return '';
}

const parentBtnStyle: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '8px',
  padding: '12px 28px',
  fontSize: '15px',
  fontWeight: 700,
  fontFamily: "'IBM Plex Arabic', sans-serif",
  background: 'rgba(255,255,255,0.08)',
  color: 'var(--white)',
  border: '1px solid rgba(255,255,255,0.15)',
  borderRadius: 'var(--r)',
  textDecoration: 'none',
  transition: 'background 0.2s',
};

const adminLinkStyle: CSSProperties = {
  fontFamily: "'IBM Plex Arabic', sans-serif",
  fontSize: '13px',
  color: 'var(--gray-3)',
  textDecoration: 'none',
  opacity: 0.7,
  transition: 'opacity 0.2s',
};

export default function HomePage() {
  const logout = useAuthStore((s) => s.logout);
  const user = useAuthStore((s) => s.user);
  const displayName = useDisplayName();

  return (
    <div style={pageStyle}>
      <button style={logoutBtnStyle} onClick={logout}>
        تسجيل الخروج
      </button>

      <header style={headerStyle}>
        <h1 style={logoStyle}>رواد المال</h1>
        <p style={welcomeStyle}>
          مرحبًا{displayName ? ` ${displayName}` : ''}! اختر صفك للبدء
        </p>
      </header>

      <div style={gridStyle}>
        {GRADES.map((g) => (
          <Link key={g.number} to={`/grade/${g.number}`} style={cardStyle(g.color)}>
            <div style={emojiStyle}>{g.emoji}</div>
            <h2 style={gradeNameStyle}>{g.nameAr}</h2>
            <p style={descStyle}>{g.description}</p>
            <span style={enterBtnStyle}>ابدأ التعلّم</span>
          </Link>
        ))}
      </div>

      {/* Bottom actions */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '16px',
          marginTop: '48px',
        }}
      >
        <Link to="/parent" style={parentBtnStyle}>
          <span style={{ fontSize: '20px' }}>👨‍👩‍👧‍👦</span>
          لوحة ولي الأمر
        </Link>

        {user?.role === 'ADMIN' && (
          <Link to="/admin" style={adminLinkStyle}>
            لوحة الإدارة
          </Link>
        )}
      </div>
    </div>
  );
}
