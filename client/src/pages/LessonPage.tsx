import { useEffect, useState, useCallback, type CSSProperties } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useGradeStore } from '../stores/gradeStore';
import AppShell from '../components/layout/AppShell';
import LessonBanner from '../components/lessons/LessonBanner';
import StoryCard from '../components/lessons/StoryCard';
import ConceptCard from '../components/lessons/ConceptCard';
import QuizCard from '../components/lessons/QuizCard';
import LoadingSpinner from '../components/shared/LoadingSpinner';
import * as progressApi from '../api/progress';

/* ==========================================
   Section tracking types
========================================== */
type SectionKey = 'story' | 'concept' | 'quiz';

interface SectionStatus {
  story: boolean;
  concept: boolean;
  quiz: boolean;
}

/* ==========================================
   Styles
========================================== */
const pageStyle: CSSProperties = {
  minHeight: '100vh',
  paddingBottom: '40px',
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

/* ---------- Progress tracker ---------- */
const progressBarOuter: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '0',
  background: 'rgba(255,255,255,0.04)',
  border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: 'var(--r-lg)',
  padding: '8px 12px',
  marginBottom: '20px',
  animation: 'fadeDown 0.6s 0.1s ease both',
};

const stepStyle = (done: boolean): CSSProperties => ({
  flex: 1,
  textAlign: 'center',
  padding: '10px 8px',
  fontFamily: "'Cairo', sans-serif",
  fontSize: '13px',
  fontWeight: 700,
  color: done ? 'var(--green-lt)' : 'rgba(255,255,255,0.35)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '6px',
  transition: 'color 0.3s',
});

const stepDotStyle = (done: boolean): CSSProperties => ({
  width: '22px',
  height: '22px',
  borderRadius: '50%',
  background: done
    ? 'linear-gradient(135deg, var(--green), #1B5E20)'
    : 'rgba(255,255,255,0.1)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '11px',
  color: done ? 'white' : 'rgba(255,255,255,0.25)',
  flexShrink: 0,
  transition: 'all 0.3s',
});

const connectorStyle = (done: boolean): CSSProperties => ({
  flex: '0 0 30px',
  height: '2px',
  background: done
    ? 'var(--green-lt)'
    : 'rgba(255,255,255,0.1)',
  transition: 'background 0.3s',
});

/* ---------- Section divider ---------- */
const sectionDividerStyle: CSSProperties = {
  height: '1px',
  background: 'rgba(255,255,255,0.06)',
  margin: '24px 0',
};

/* ---------- Completion banner ---------- */
const completionStyle: CSSProperties = {
  background: 'rgba(46,125,50,0.15)',
  border: '1px solid rgba(102,187,106,0.3)',
  borderRadius: 'var(--r-lg)',
  padding: '28px 24px',
  textAlign: 'center',
  animation: 'popIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
};

const completionEmojiStyle: CSSProperties = {
  fontSize: '48px',
  marginBottom: '12px',
};

const completionTitleStyle: CSSProperties = {
  fontFamily: "'Cairo', sans-serif",
  fontSize: '24px',
  fontWeight: 900,
  color: 'var(--green-lt)',
  marginBottom: '8px',
};

const completionTextStyle: CSSProperties = {
  fontFamily: "'IBM Plex Arabic', sans-serif",
  fontSize: '16px',
  color: 'rgba(255,255,255,0.7)',
  marginBottom: '20px',
  lineHeight: 1.8,
};

const nextBtnStyle: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '8px',
  padding: '12px 32px',
  background: 'linear-gradient(135deg, var(--green), #1B5E20)',
  color: 'white',
  border: 'none',
  borderRadius: 'var(--r)',
  fontFamily: "'Cairo', sans-serif",
  fontSize: '16px',
  fontWeight: 700,
  cursor: 'pointer',
  textDecoration: 'none',
  transition: 'all 0.2s',
};

/* ---------- Error ---------- */
const errorStyle: CSSProperties = {
  textAlign: 'center',
  color: 'var(--red)',
  fontFamily: "'Cairo', sans-serif",
  fontSize: '16px',
  padding: '40px',
};

/* ==========================================
   Section labels for the progress tracker
========================================== */
const SECTIONS: { key: SectionKey; label: string; icon: string }[] = [
  { key: 'story',   label: 'القصة',   icon: '\uD83D\uDCD6' },
  { key: 'concept', label: 'المفهوم', icon: '\uD83D\uDCA1' },
  { key: 'quiz',    label: 'الاختبار', icon: '\u2753' },
];

/* ==========================================
   Component
========================================== */
export default function LessonPage() {
  const { number, id } = useParams<{ number: string; id: string }>();
  const gradeNumber = Number(number);
  const { currentLesson, lessonLoading, error, fetchLesson, clearCurrentLesson } = useGradeStore();

  const [completed, setCompleted] = useState<SectionStatus>({
    story: false,
    concept: false,
    quiz: false,
  });

  useEffect(() => {
    if (id) {
      fetchLesson(id);
    }
    return () => clearCurrentLesson();
  }, [id, fetchLesson, clearCurrentLesson]);

  /* ---------- Section completion handlers ---------- */
  const markDone = useCallback((section: SectionKey) => {
    setCompleted((prev) => ({ ...prev, [section]: true }));
  }, []);

  const handleStoryRead = useCallback(() => {
    markDone('story');
  }, [markDone]);

  const handleConceptRead = useCallback(() => {
    markDone('concept');
  }, [markDone]);

  const handleQuizAnswer = useCallback(
    (choiceIndex: number, _isCorrect: boolean) => {
      markDone('quiz');

      // Submit quiz result to API (fire-and-forget)
      if (id) {
        progressApi.submitQuiz(id, { choiceIndex }).catch(() => {
          // Silently fail — local state already updated
        });
      }
    },
    [id, markDone],
  );

  /* ---------- Derived ---------- */
  const allDone = completed.story && completed.concept && completed.quiz;
  const completedCount = Object.values(completed).filter(Boolean).length;

  /* ---------- Loading / Error ---------- */
  if (lessonLoading) {
    return (
      <AppShell>
        <LoadingSpinner text="جارٍ تحميل الدرس..." />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div style={errorStyle}>{error}</div>
      </AppShell>
    );
  }

  if (!currentLesson) {
    return (
      <AppShell>
        <div style={errorStyle}>لم يتم العثور على الدرس</div>
      </AppShell>
    );
  }

  /* ---------- Render ---------- */
  return (
    <AppShell>
      <div style={pageStyle}>
        {/* Back button */}
        <Link
          to={`/grade/${gradeNumber}`}
          style={backBtnStyle}
        >
          <span style={{ fontSize: '11px' }}>&#9654;</span>
          العودة للصف
        </Link>

        {/* Progress tracker */}
        <div style={progressBarOuter}>
          {SECTIONS.map((section, i) => (
            <div key={section.key} style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
              <div style={stepStyle(completed[section.key])}>
                <div style={stepDotStyle(completed[section.key])}>
                  {completed[section.key] ? '\u2714' : i + 1}
                </div>
                <span>{section.icon} {section.label}</span>
              </div>
              {i < SECTIONS.length - 1 && (
                <div style={connectorStyle(completed[section.key])} />
              )}
            </div>
          ))}
          {/* Overall fraction */}
          <div
            style={{
              fontFamily: "'Cairo', sans-serif",
              fontSize: '12px',
              fontWeight: 700,
              color: allDone ? 'var(--green-lt)' : 'rgba(255,255,255,0.4)',
              flexShrink: 0,
              paddingRight: '8px',
            }}
          >
            {completedCount}/{SECTIONS.length}
          </div>
        </div>

        {/* Lesson banner */}
        <LessonBanner
          bgEmoji={currentLesson.bgEmoji}
          bgColor={currentLesson.bgColor}
          title={currentLesson.title}
          subtitle={currentLesson.subtitle}
          goal={currentLesson.goal}
        />

        {/* Story section */}
        <StoryCard
          title={currentLesson.storyTitle}
          text={currentLesson.storyText}
          onRead={handleStoryRead}
        />

        <div style={sectionDividerStyle} />

        {/* Concept section */}
        <ConceptCard
          title={currentLesson.conceptTitle}
          text={currentLesson.conceptText}
          html={currentLesson.conceptHtml || undefined}
          onRead={handleConceptRead}
        />

        <div style={sectionDividerStyle} />

        {/* Quiz section */}
        <QuizCard
          question={currentLesson.quizQuestion}
          choices={currentLesson.quizChoices}
          onAnswer={handleQuizAnswer}
        />

        {/* Completion banner */}
        {allDone && (
          <>
            <div style={sectionDividerStyle} />
            <div style={completionStyle}>
              <div style={completionEmojiStyle}>{'\uD83C\uDF89'}</div>
              <h3 style={completionTitleStyle}>أحسنت! أكملت الدرس</h3>
              <p style={completionTextStyle}>
                لقد أنهيت قراءة القصة وفهم المفهوم وأجبت على الاختبار.
                <br />
                استمر في رحلة التعلم المالي!
              </p>
              <Link to={`/grade/${gradeNumber}`} style={nextBtnStyle}>
                <span>&#9664;</span>
                العودة لقائمة الدروس
              </Link>
            </div>
          </>
        )}
      </div>
    </AppShell>
  );
}
