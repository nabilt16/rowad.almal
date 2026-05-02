import { useEffect, useState, useCallback, useMemo, type CSSProperties } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useGradeStore } from '../stores/gradeStore';
import AppShell from '../components/layout/AppShell';
import LessonBanner from '../components/lessons/LessonBanner';
import StoryCard from '../components/lessons/StoryCard';
import ConceptCard from '../components/lessons/ConceptCard';
import QuizCard from '../components/lessons/QuizCard';
import ActivityCard from '../components/activities/ActivityCard';
import NeedsWantsSimulation from '../components/simulations/NeedsWantsSimulation';
import WeeklyBudgetSimulation from '../components/simulations/WeeklyBudgetSimulation';
import JuiceStandSimulation from '../components/simulations/JuiceStandSimulation';
import CreditCardSimulation from '../components/simulations/CreditCardSimulation';
import ValueCompareSimulation from '../components/simulations/ValueCompareSimulation';
import ProfitLossSimulation from '../components/simulations/ProfitLossSimulation';
import BarterSimulation from '../components/simulations/BarterSimulation';
import LoadingSpinner from '../components/shared/LoadingSpinner';
import CompletionCertificate from '../components/lessons/CompletionCertificate';
import * as progressApi from '../api/progress';
import { confettiBurst } from '../utils/confetti';
import { usePersonalize } from '../hooks/usePersonalize';
import { useUIStore } from '../stores/uiStore';
import { useAuthStore } from '../stores/authStore';

/* ==========================================
   Section tracking types
========================================== */
type SectionKey = 'story' | 'concept' | 'activity' | 'quiz' | 'simulation';

interface SectionStatus {
  story: boolean;
  concept: boolean;
  activity: boolean;
  quiz: boolean;
  simulation: boolean;
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
  fontFamily: "'IBM Plex Arabic', sans-serif",
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
  fontFamily: "'IBM Plex Arabic', sans-serif",
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
  fontFamily: "'IBM Plex Arabic', sans-serif",
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
  fontFamily: "'IBM Plex Arabic', sans-serif",
  fontSize: '16px',
  padding: '40px',
};

/* ==========================================
   Section labels for the progress tracker
========================================== */
const SECTION_ACTIVITY = { key: 'activity' as const, label: 'النشاط', icon: '🧠' };

const ALL_SECTIONS: { key: SectionKey; label: string; icon: string }[] = [
  { key: 'story',      label: 'القصة',       icon: '\uD83D\uDCD6' },
  { key: 'concept',    label: 'المفهوم',     icon: '\uD83D\uDCA1' },
  SECTION_ACTIVITY,
  { key: 'quiz',       label: 'الاختبار',    icon: '\u2753'       },
  { key: 'simulation', label: 'جرّب بنفسك',  icon: '\uD83C\uDFAE' },
];

/* ---------- Level-completion messages (last lesson of Unit 5 per grade) ---------- */
interface LevelCompletionData {
  title: string; body: string; teaser: string; levelName: string;
  units: { label: string; color: string }[];
}

const LEVEL_COMPLETION: Record<string, LevelCompletionData> = {
  l5d: {
    title: 'أتممت المستوى الأول! 🎉',
    body: 'أنت الآن تعرف أساسيات المال والقجة والقرارات الذكية.',
    teaser: '🔮 في المستوى الثاني: ستتعلم الميزانية والتضخم والاستثمار — استعد!',
    levelName: 'المستوى الأول',
    units: [
      { label: 'المال من حولي',         color: '#1565C0' },
      { label: 'قراراتي المالية',        color: '#2E7D32' },
      { label: 'أنا مستهلك واعٍ',       color: '#BF360C' },
      { label: 'أنا رائد صغير',         color: '#6A1B9A' },
      { label: 'المال أداة في يدي',     color: '#B71C1C' },
    ],
  },
  g5_l20: {
    title: 'أتممت المستوى الثاني! 🎉',
    body: 'أنت الآن تفهم الميزانية والتضخم وحقوق المستهلك.',
    teaser: '🔮 في المستوى الثالث: ستتعلم الاستثمار والتخطيط المالي المتقدم — استعد!',
    levelName: 'المستوى الثاني',
    units: [
      { label: 'قيمة المال',             color: '#1565C0' },
      { label: 'ميزانيتي',              color: '#2E7D32' },
      { label: 'أنا مستهلك ذكي',       color: '#00695C' },
      { label: 'أنا منتج',             color: '#E65100' },
      { label: 'المال والمجتمع',        color: '#4A148C' },
    ],
  },
  g6_l20: {
    title: 'أتممت رحلة رواد المال! 🎉',
    body: 'أنت الآن تملك أدوات مالية لا يعرفها أغلب الكبار.',
    teaser: '💪 استخدمها بحكمة — المستقبل المالي بيدك!',
    levelName: 'المستوى الثالث',
    units: [
      { label: 'قيمة المال والتضخم',    color: '#1565C0' },
      { label: 'المال الرقمي والأمان',  color: '#00695C' },
      { label: 'القجة والاستثمار',    color: '#E65100' },
      { label: 'ريادة الأعمال',         color: '#4A148C' },
      { label: 'المال والمجتمع والمستقبل', color: '#1B5E20' },
    ],
  },
};

const levelCompletionStyle: CSSProperties = {
  background: 'linear-gradient(135deg, rgba(255,179,0,0.18), rgba(230,81,0,0.15))',
  border: '1.5px solid rgba(255,179,0,0.45)',
  borderRadius: 'var(--r-lg)',
  padding: '32px 28px',
  textAlign: 'center',
  animation: 'popIn 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)',
  direction: 'rtl',
};

const levelTitleStyle: CSSProperties = {
  fontFamily: "'IBM Plex Arabic', sans-serif",
  fontSize: '26px',
  fontWeight: 900,
  color: '#FFD54F',
  marginBottom: '12px',
};

const levelBodyStyle: CSSProperties = {
  fontFamily: "'IBM Plex Arabic', sans-serif",
  fontSize: '17px',
  color: 'rgba(255,255,255,0.88)',
  lineHeight: 1.9,
  marginBottom: '14px',
};

const levelTeaserStyle: CSSProperties = {
  fontFamily: "'IBM Plex Arabic', sans-serif",
  fontSize: '16px',
  fontWeight: 700,
  color: '#FFB300',
  background: 'rgba(255,179,0,0.1)',
  borderRadius: 'var(--r)',
  padding: '10px 16px',
  display: 'inline-block',
};

/* ==========================================
   Component
========================================== */
export default function LessonPage() {
  const { number, id } = useParams<{ number: string; id: string }>();
  const gradeNumber = Number(number);
  const { currentGrade, currentLesson, lessonLoading, error, fetchLesson, fetchGrade, clearCurrentLesson } = useGradeStore();
  const personalize = usePersonalize();
  const personalBudget = useUIStore(s => s.personalBudget);
  const studentName = useAuthStore(s => s.profile?.studentName ?? 'الطالب');
  const [showCertificate, setShowCertificate] = useState(false);

  const [completed, setCompleted] = useState<SectionStatus>({
    story: false,
    concept: false,
    activity: false,
    quiz: false,
    simulation: false,
  });

  // Reset completion state every time the lesson changes
  useEffect(() => {
    setCompleted({ story: false, concept: false, activity: false, quiz: false, simulation: false });
    window.scrollTo(0, 0);
    if (id) fetchLesson(id);
    return () => clearCurrentLesson();
  }, [id, fetchLesson, clearCurrentLesson]);

  useEffect(() => {
    if (gradeNumber && !currentGrade) fetchGrade(gradeNumber);
  }, [gradeNumber, currentGrade, fetchGrade]);

  // Find the next lesson across all units of this grade
  const nextLesson = useMemo(() => {
    if (!currentGrade || !id) return null;
    const allLessons = currentGrade.units.flatMap((u) => u.lessons);
    const idx = allLessons.findIndex((l) => l.id === id);
    return idx !== -1 && idx < allLessons.length - 1 ? allLessons[idx + 1] : null;
  }, [currentGrade, id]);

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

  const handleActivityComplete = useCallback(
    (score: number, answers: Record<string, unknown>) => {
      markDone('activity');
      if (id) {
        progressApi.submitActivity(id, { score, answers }).catch(() => {
          // Silently fail — local state already updated
        });
      }
    },
    [id, markDone],
  );

  const handleSimulationComplete = useCallback(() => {
    markDone('simulation');
  }, [markDone]);

  /* ---------- Derived ---------- */
  const levelCompletion = currentLesson ? LEVEL_COMPLETION[currentLesson.legacyId] ?? null : null;
  const hasSimulation = currentLesson?.legacyId === 'l1' || currentLesson?.legacyId === 'l5' || currentLesson?.legacyId === 'l6' || currentLesson?.legacyId === 'l4a' || currentLesson?.legacyId === 'l5c' || currentLesson?.legacyId === 'l9' || currentLesson?.legacyId === 'l4d';
  const hasActivity = Boolean(
    currentLesson?.activityType &&
      currentLesson.activityConfig &&
      Object.keys(currentLesson.activityConfig).length > 0,
  );
  const sections = hasSimulation
    ? ALL_SECTIONS
    : hasActivity
      ? [ALL_SECTIONS[0], ALL_SECTIONS[1], SECTION_ACTIVITY, ALL_SECTIONS[2]]
      : ALL_SECTIONS.slice(0, 3);
  const allDone = sections.every(s => completed[s.key]);
  const completedCount = sections.filter(s => completed[s.key]).length;

  // Fire confetti and show certificate when the final lesson of a level is completed
  useEffect(() => {
    if (allDone && levelCompletion) {
      setTimeout(confettiBurst, 200);
      setTimeout(confettiBurst, 800);
      setTimeout(() => setShowCertificate(true), 1400);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allDone]);

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
          العودة للمستوى
        </Link>

        {/* Progress tracker */}
        <div style={progressBarOuter}>
          {sections.map((section, i) => (
            <div key={section.key} style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
              <div style={stepStyle(completed[section.key])}>
                <div style={stepDotStyle(completed[section.key])}>
                  {completed[section.key] ? '\u2714' : i + 1}
                </div>
                <span>{section.icon} {section.label}</span>
              </div>
              {i < sections.length - 1 && (
                <div style={connectorStyle(completed[section.key])} />
              )}
            </div>
          ))}
          {/* Overall fraction */}
          <div
            style={{
              fontFamily: "'IBM Plex Arabic', sans-serif",
              fontSize: '12px',
              fontWeight: 700,
              color: allDone ? 'var(--green-lt)' : 'rgba(255,255,255,0.4)',
              flexShrink: 0,
              paddingRight: '8px',
            }}
          >
            {completedCount}/{sections.length}
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
          highlight={gradeNumber !== 5}
          isFirst
        />

        <div style={sectionDividerStyle} />

        {/* Concept section */}
        <ConceptCard
          title={currentLesson.conceptTitle}
          text={currentLesson.conceptText}
          html={currentLesson.conceptHtml || undefined}
          onRead={handleConceptRead}
          highlight={gradeNumber !== 5}
        />

        <div style={sectionDividerStyle} />

        {/* Activity section */}
        {hasActivity && (
          <>
            <ActivityCard
              activityType={currentLesson.activityType}
              activityConfig={currentLesson.activityConfig}
              lessonId={currentLesson.id}
              onComplete={handleActivityComplete}
            />
            <div style={sectionDividerStyle} />
          </>
        )}

        {/* Quiz section */}
        <QuizCard
          question={personalize(currentLesson.quizQuestion)}
          choices={currentLesson.quizChoices}
          onAnswer={handleQuizAnswer}
          highlight={gradeNumber !== 5}
        />

        {/* Simulation — 4th step, only for lessons that have one */}
        {currentLesson.legacyId === 'l1' && (
          <>
            <div style={sectionDividerStyle} />
            <BarterSimulation onComplete={handleSimulationComplete} personalBudget={personalBudget ?? undefined} />
          </>
        )}
        {currentLesson.legacyId === 'l5' && (
          <>
            <div style={sectionDividerStyle} />
            <NeedsWantsSimulation onComplete={handleSimulationComplete} personalBudget={personalBudget ?? undefined} />
          </>
        )}
        {currentLesson.legacyId === 'l6' && (
          <>
            <div style={sectionDividerStyle} />
            <WeeklyBudgetSimulation onComplete={handleSimulationComplete} personalBudget={personalBudget ?? undefined} />
          </>
        )}
        {currentLesson.legacyId === 'l4a' && (
          <>
            <div style={sectionDividerStyle} />
            <JuiceStandSimulation onComplete={handleSimulationComplete} personalBudget={personalBudget ?? undefined} />
          </>
        )}
        {currentLesson.legacyId === 'l5c' && (
          <>
            <div style={sectionDividerStyle} />
            <CreditCardSimulation onComplete={handleSimulationComplete} personalBudget={personalBudget ?? undefined} />
          </>
        )}
        {currentLesson.legacyId === 'l9' && (
          <>
            <div style={sectionDividerStyle} />
            <ValueCompareSimulation onComplete={handleSimulationComplete} personalBudget={personalBudget ?? undefined} />
          </>
        )}
        {currentLesson.legacyId === 'l4d' && (
          <>
            <div style={sectionDividerStyle} />
            <ProfitLossSimulation onComplete={handleSimulationComplete} personalBudget={personalBudget ?? undefined} />
          </>
        )}

        {/* Celebration banner — appears only when fully done */}
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
            </div>

            {/* Level-completion banner — only for the last lesson of each level */}
            {levelCompletion && (
              <>
                <div style={sectionDividerStyle} />
                <div style={levelCompletionStyle}>
                  <div style={{ fontSize: '56px', marginBottom: '12px' }}>🏆</div>
                  <h2 style={levelTitleStyle}>{levelCompletion.title}</h2>
                  <p style={levelBodyStyle}>{levelCompletion.body}</p>
                  <span style={levelTeaserStyle}>{levelCompletion.teaser}</span>
                </div>
              </>
            )}
          </>
        )}

        {/* Navigation bar — always visible, enabled only when all done */}
        <div style={sectionDividerStyle} />
        <div style={{
          display: 'flex',
          gap: '12px',
          justifyContent: 'center',
          flexWrap: 'wrap',
          padding: '8px 0 24px',
        }}>
          {nextLesson && (
            allDone ? (
              <Link
                to={`/grade/${gradeNumber}/lesson/${nextLesson.id}`}
                style={nextBtnStyle}
                onClick={() => window.scrollTo(0, 0)}
              >
                {nextLesson.bgEmoji || '\uD83D\uDCD6'} {nextLesson.title}
                <span style={{ fontSize: '13px', marginRight: '4px' }}>&#9664;</span>
              </Link>
            ) : (
              <div style={{
                ...nextBtnStyle,
                background: 'rgba(255,255,255,0.08)',
                color: 'rgba(255,255,255,0.3)',
                border: '1px solid rgba(255,255,255,0.1)',
                cursor: 'not-allowed',
                flexDirection: 'column',
                gap: '4px',
                padding: '12px 24px',
              }}>
                <span style={{ fontSize: '13px' }}>
                  {nextLesson.bgEmoji || '\uD83D\uDCD6'} {nextLesson.title}
                </span>
                <span style={{ fontSize: '11px', opacity: 0.6 }}>
                  {'\uD83D\uDD12'} أكمل الدرس أولاً ({completedCount}/{sections.length})
                </span>
              </div>
            )
          )}
          <Link
            to={`/grade/${gradeNumber}`}
            style={{
              ...nextBtnStyle,
              background: 'rgba(255,255,255,0.10)',
              border: '1px solid rgba(255,255,255,0.15)',
              color: 'rgba(255,255,255,0.7)',
            }}
          >
            <span>&#9664;</span>
            قائمة الدروس
          </Link>
        </div>
      </div>

      {/* Completion certificate overlay */}
      {showCertificate && levelCompletion && (
        <CompletionCertificate
          studentName={studentName}
          levelName={levelCompletion.levelName}
          units={levelCompletion.units}
          showCharter={currentLesson?.legacyId === 'g5_l20' || currentLesson?.legacyId === 'g6_l20'}
          onClose={() => setShowCertificate(false)}
        />
      )}
    </AppShell>
  );
}
