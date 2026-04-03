import { useEffect, type CSSProperties } from 'react';
import { useProgressStore } from '../../stores/progressStore';
import { useGradeStore } from '../../stores/gradeStore';
import UnitProgressBar from './UnitProgressBar';
import LoadingSpinner from '../shared/LoadingSpinner';

interface ProgressPanelProps {
  gradeNumber: number;
}

/* ---------- unit color palette ---------- */

const UNIT_COLORS = [
  '#1565C0', // blue
  '#2E7D32', // green
  '#F9A825', // gold
  '#C62828', // red
  '#6A1B9A', // purple
];

/* ---------- styles ---------- */

const panelStyle: CSSProperties = {
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
  marginBottom: '24px',
  textAlign: 'center',
};

const ringContainerStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  marginBottom: '28px',
};

const svgSize = 140;
const strokeWidth = 10;
const radius = (svgSize - strokeWidth) / 2;
const circumference = 2 * Math.PI * radius;

const summaryTextStyle: CSSProperties = {
  fontFamily: "'IBM Plex Arabic', sans-serif",
  fontSize: '15px',
  fontWeight: 600,
  color: 'rgba(255,255,255,0.7)',
  marginTop: '12px',
};

const percentTextStyle: CSSProperties = {
  fontFamily: "'IBM Plex Arabic', sans-serif",
  fontWeight: 800,
  fontSize: '28px',
  fill: 'var(--gold)',
};

const percentLabelStyle: CSSProperties = {
  fontFamily: "'IBM Plex Arabic', sans-serif",
  fontWeight: 600,
  fontSize: '13px',
  fill: 'rgba(255,255,255,0.5)',
};

const dividerStyle: CSSProperties = {
  width: '100%',
  height: '1px',
  background: 'rgba(255,255,255,0.08)',
  margin: '20px 0',
};

const unitsSectionHeading: CSSProperties = {
  fontFamily: "'IBM Plex Arabic', sans-serif",
  fontSize: '16px',
  fontWeight: 700,
  color: 'rgba(255,255,255,0.8)',
  marginBottom: '16px',
};

const errorStyle: CSSProperties = {
  fontFamily: "'IBM Plex Arabic', sans-serif",
  fontSize: '15px',
  color: 'var(--red)',
  textAlign: 'center',
  padding: '20px',
};

export default function ProgressPanel({ gradeNumber }: ProgressPanelProps) {
  const {
    gradeProgress,
    loading,
    error,
    fetchGradeProgress,
  } = useProgressStore();

  const currentGrade = useGradeStore((s) => s.currentGrade);

  useEffect(() => {
    fetchGradeProgress(gradeNumber);
  }, [gradeNumber, fetchGradeProgress]);

  /* ---------- loading / error ---------- */

  if (loading) {
    return (
      <div style={panelStyle}>
        <LoadingSpinner text="جارٍ تحميل التقدم..." />
      </div>
    );
  }

  if (error) {
    return (
      <div style={panelStyle}>
        <p style={errorStyle}>{error}</p>
      </div>
    );
  }

  if (!gradeProgress) return null;

  /* ---------- calculations ---------- */

  const totalLessons = gradeProgress.unitProgress.reduce((s, u) => s + u.totalLessons, 0);
  const completedLessons = gradeProgress.unitProgress.reduce((s, u) => s + u.completedLessons, 0);
  const pct = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

  const strokeDashoffset = circumference - (circumference * pct) / 100;

  /* ---------- build unit title map from currentGrade if available ---------- */

  const unitTitleMap = new Map<number, { title: string; color: string }>();
  if (currentGrade) {
    for (const unit of currentGrade.units) {
      unitTitleMap.set(unit.number, { title: unit.title, color: unit.color });
    }
  }

  return (
    <div style={panelStyle}>
      <h3 style={headingStyle}>
        {'\uD83D\uDCCA'} التقدم العام
      </h3>

      {/* Circular progress ring */}
      <div style={ringContainerStyle}>
        <svg
          width={svgSize}
          height={svgSize}
          viewBox={`0 0 ${svgSize} ${svgSize}`}
        >
          {/* Background track */}
          <circle
            cx={svgSize / 2}
            cy={svgSize / 2}
            r={radius}
            fill="none"
            stroke="rgba(255,255,255,0.08)"
            strokeWidth={strokeWidth}
          />
          {/* Filled arc */}
          <circle
            cx={svgSize / 2}
            cy={svgSize / 2}
            r={radius}
            fill="none"
            stroke="var(--gold)"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            transform={`rotate(-90 ${svgSize / 2} ${svgSize / 2})`}
            style={{ transition: 'stroke-dashoffset 1s cubic-bezier(0.22, 1, 0.36, 1)' }}
          />
          {/* Center text */}
          <text
            x="50%"
            y="46%"
            dominantBaseline="middle"
            textAnchor="middle"
            style={percentTextStyle}
          >
            {pct}%
          </text>
          <text
            x="50%"
            y="62%"
            dominantBaseline="middle"
            textAnchor="middle"
            style={percentLabelStyle}
          >
            مكتمل
          </text>
        </svg>

        <span style={summaryTextStyle}>
          {completedLessons} من {totalLessons} درسًا مكتمل
        </span>
      </div>

      <div style={dividerStyle} />

      {/* Per-unit progress bars */}
      <h4 style={unitsSectionHeading}>
        {'\uD83D\uDCDA'} تقدم الوحدات
      </h4>
      {gradeProgress.unitProgress.map((up, i) => {
        const info = unitTitleMap.get(up.unitNumber);
        return (
          <UnitProgressBar
            key={up.unitId}
            unitNumber={up.unitNumber}
            title={info?.title ?? `الوحدة ${up.unitNumber}`}
            completed={up.completedLessons}
            total={up.totalLessons}
            color={info?.color ?? UNIT_COLORS[i % UNIT_COLORS.length]}
          />
        );
      })}
    </div>
  );
}
