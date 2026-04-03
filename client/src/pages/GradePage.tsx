import { useEffect, type CSSProperties } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useGradeStore } from '../stores/gradeStore';
import { useUIStore } from '../stores/uiStore';
import LoadingSpinner from '../components/shared/LoadingSpinner';
import GlossaryPanel from '../components/glossary/GlossaryPanel';
import TeacherGuide from '../components/guide/TeacherGuide';

const pageStyle: CSSProperties = {
  minHeight: '100vh',
  padding: '32px 20px',
  position: 'relative',
  zIndex: 1,
  maxWidth: '960px',
  margin: '0 auto',
};

const backLinkStyle: CSSProperties = {
  fontFamily: "'IBM Plex Arabic', sans-serif",
  fontSize: '14px',
  color: 'var(--sky)',
  textDecoration: 'none',
  display: 'inline-block',
  marginBottom: '24px',
};

const titleStyle: CSSProperties = {
  fontFamily: "'IBM Plex Arabic', sans-serif",
  fontSize: '32px',
  fontWeight: 900,
  color: 'var(--gold)',
  marginBottom: '24px',
};

const tabBarStyle: CSSProperties = {
  display: 'flex',
  gap: '8px',
  marginBottom: '32px',
};

const tabStyle = (active: boolean): CSSProperties => ({
  padding: '10px 24px',
  fontSize: '15px',
  fontWeight: 700,
  fontFamily: "'IBM Plex Arabic', sans-serif",
  background: active ? 'var(--blue)' : 'rgba(255,255,255,0.08)',
  color: active ? 'var(--white)' : 'var(--gray-3)',
  border: 'none',
  borderRadius: 'var(--r)',
  cursor: 'pointer',
  transition: 'background 0.2s',
});

const unitCardStyle: CSSProperties = {
  background: 'rgba(255,255,255,0.06)',
  borderRadius: 'var(--r-lg)',
  padding: '24px',
  marginBottom: '20px',
  border: '1px solid rgba(255,255,255,0.08)',
};

const unitTitleStyle: CSSProperties = {
  fontFamily: "'IBM Plex Arabic', sans-serif",
  fontSize: '20px',
  fontWeight: 700,
  color: 'var(--white)',
  marginBottom: '16px',
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
};

const lessonListStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
};

const lessonItemStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  padding: '14px 18px',
  background: 'rgba(255,255,255,0.05)',
  borderRadius: 'var(--r)',
  color: 'var(--white)',
  textDecoration: 'none',
  transition: 'background 0.2s',
  fontFamily: "'IBM Plex Arabic', sans-serif",
  fontSize: '20px',
  fontWeight: 500,
};

const lessonEmojiStyle: CSSProperties = {
  fontSize: '28px',
  width: '40px',
  textAlign: 'center',
};

const errorStyle: CSSProperties = {
  textAlign: 'center',
  color: 'var(--red)',
  fontFamily: "'IBM Plex Arabic', sans-serif",
  fontSize: '16px',
  padding: '40px',
};

const placeholderStyle: CSSProperties = {
  textAlign: 'center',
  color: 'var(--gray-3)',
  fontFamily: "'IBM Plex Arabic', sans-serif",
  fontSize: '18px',
  padding: '60px 20px',
};

export default function GradePage() {
  const { number } = useParams<{ number: string }>();
  const gradeNumber = Number(number);
  const { currentGrade, gradeLoading, error, fetchGrade, clearCurrentGrade } = useGradeStore();
  const { activeTab, setActiveTab } = useUIStore();

  useEffect(() => {
    if (gradeNumber) {
      fetchGrade(gradeNumber);
    }
    return () => clearCurrentGrade();
  }, [gradeNumber, fetchGrade, clearCurrentGrade]);

  if (gradeLoading) {
    return <LoadingSpinner text="جارٍ تحميل الصف..." />;
  }

  if (error) {
    return <div style={errorStyle}>{error}</div>;
  }

  return (
    <div style={pageStyle}>
      <Link to="/home" style={backLinkStyle}>
        &larr; العودة للصفحة الرئيسية
      </Link>

      <h1 style={titleStyle}>
        {currentGrade?.nameAr || `الصف ${number}`}
      </h1>

      <div style={tabBarStyle}>
        <button style={tabStyle(activeTab === 'lessons')} onClick={() => setActiveTab('lessons')}>
          الدروس
        </button>
        <button style={tabStyle(activeTab === 'glossary')} onClick={() => setActiveTab('glossary')}>
          المصطلحات
        </button>
        <button style={tabStyle(activeTab === 'guide')} onClick={() => setActiveTab('guide')}>
          دليل المعلم
        </button>
      </div>

      {activeTab === 'lessons' && (
        <>
          {currentGrade?.units.map((unit) => (
            <div key={unit.id} style={unitCardStyle}>
              <h2 style={unitTitleStyle}>
                <span
                  style={{
                    width: 12,
                    height: 12,
                    borderRadius: '50%',
                    background: unit.color || 'var(--blue)',
                    display: 'inline-block',
                    flexShrink: 0,
                  }}
                />
                الوحدة {unit.number}: {unit.title}
              </h2>
              <div style={lessonListStyle}>
                {unit.lessons.map((lesson) => (
                  <Link
                    key={lesson.id}
                    to={`/grade/${gradeNumber}/lesson/${lesson.id}`}
                    style={lessonItemStyle}
                  >
                    <span style={lessonEmojiStyle}>{lesson.bgEmoji || '📖'}</span>
                    <span>{lesson.title}</span>
                  </Link>
                ))}
              </div>
            </div>
          ))}
          {currentGrade && currentGrade.units.length === 0 && (
            <div style={placeholderStyle}>لم تتم إضافة دروس بعد</div>
          )}
        </>
      )}

      {activeTab === 'glossary' && (
        <GlossaryPanel gradeNumber={gradeNumber} />
      )}

      {activeTab === 'guide' && (
        <TeacherGuide gradeNumber={gradeNumber} />
      )}
    </div>
  );
}
