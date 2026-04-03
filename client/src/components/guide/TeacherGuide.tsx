import { useState, useEffect, type CSSProperties } from 'react';
import type { GuideUnit } from '@rowad/shared';
import { getGuide } from '../../api/guide';
import LoadingSpinner from '../shared/LoadingSpinner';
import GuideLessonCard from './GuideLessonCard';

interface TeacherGuideProps {
  gradeNumber: number;
}

// Unit accent colors for visual distinction
const UNIT_COLORS = [
  '#1E88E5', // blue
  '#43A047', // green
  '#F9A825', // gold
  '#E53935', // red
  '#8E24AA', // purple
  '#00ACC1', // teal
  '#FB8C00', // orange
];

const panelStyle: CSSProperties = {
  width: '100%',
};

const unitSectionStyle: CSSProperties = {
  marginBottom: '32px',
};

const unitHeaderStyle = (color: string): CSSProperties => ({
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  padding: '16px 20px',
  background: `${color}20`,
  borderRadius: 'var(--r)',
  marginBottom: '16px',
  borderRight: `4px solid ${color}`,
});

const unitDotStyle = (color: string): CSSProperties => ({
  width: 14,
  height: 14,
  borderRadius: '50%',
  background: color,
  flexShrink: 0,
});

const unitNameStyle: CSSProperties = {
  fontFamily: "'IBM Plex Arabic', sans-serif",
  fontSize: '20px',
  fontWeight: 800,
  color: 'var(--white)',
  flex: 1,
};

const lessonCountStyle = (color: string): CSSProperties => ({
  fontFamily: "'IBM Plex Arabic', sans-serif",
  fontSize: '13px',
  fontWeight: 600,
  color: color,
  background: `${color}20`,
  padding: '4px 12px',
  borderRadius: '12px',
  flexShrink: 0,
});

const emptyStyle: CSSProperties = {
  textAlign: 'center',
  color: 'var(--gray-3)',
  fontFamily: "'IBM Plex Arabic', sans-serif",
  fontSize: '18px',
  padding: '60px 20px',
  background: 'rgba(255,255,255,0.04)',
  borderRadius: 'var(--r-lg)',
  border: '1px solid rgba(255,255,255,0.06)',
};

const errorStyle: CSSProperties = {
  textAlign: 'center',
  color: 'var(--red)',
  fontFamily: "'IBM Plex Arabic', sans-serif",
  fontSize: '16px',
  padding: '40px',
};

export default function TeacherGuide({ gradeNumber }: TeacherGuideProps) {
  const [units, setUnits] = useState<GuideUnit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError('');

    getGuide(gradeNumber)
      .then((data) => {
        if (!cancelled) setUnits(data);
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err.response?.data?.message || 'حدث خطأ في تحميل دليل المعلم');
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [gradeNumber]);

  if (loading) {
    return <LoadingSpinner text="جارٍ تحميل دليل المعلم..." />;
  }

  if (error) {
    return <div style={errorStyle}>{error}</div>;
  }

  if (units.length === 0) {
    return (
      <div style={emptyStyle}>
        {'\uD83D\uDC68\u200D\uD83C\uDFEB'} لا يوجد دليل معلم لهذا الصف
      </div>
    );
  }

  return (
    <div style={panelStyle}>
      {units.map((unit, unitIdx) => {
        const color = UNIT_COLORS[unitIdx % UNIT_COLORS.length];

        return (
          <div key={unit.id} style={unitSectionStyle}>
            {/* Unit header */}
            <div style={unitHeaderStyle(color)}>
              <span style={unitDotStyle(color)} />
              <span style={unitNameStyle}>
                الوحدة {unit.unitNumber}: {unit.unitName}
              </span>
              <span style={lessonCountStyle(color)}>
                {unit.lessons.length} درس
              </span>
            </div>

            {/* Lesson cards */}
            {unit.lessons.map((lesson) => (
              <GuideLessonCard
                key={lesson.id}
                title={lesson.title}
                goal={lesson.goal}
                totalTime={lesson.totalTime}
                steps={lesson.steps}
                questions={lesson.questions}
                tips={lesson.tips}
                accentColor={color}
              />
            ))}
          </div>
        );
      })}
    </div>
  );
}
