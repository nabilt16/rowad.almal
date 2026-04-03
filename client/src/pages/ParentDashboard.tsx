import { useState, useRef, useEffect, useCallback, type CSSProperties } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { useProgressStore } from '../stores/progressStore';
import { useBucketStore } from '../stores/bucketStore';
import { GRADE_CONFIG } from '@rowad/shared';
import type { GradeProgress, BadgeWithEarned } from '@rowad/shared';

const PARENT_PIN = '1234';

/* ============================================================
   Styles
============================================================ */
const pageStyle: CSSProperties = {
  minHeight: '100vh',
  padding: '32px 20px',
  position: 'relative',
  zIndex: 1,
  maxWidth: '800px',
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
  fontSize: '28px',
  fontWeight: 900,
  color: 'var(--gold)',
  marginBottom: '8px',
  textAlign: 'center',
};

const glassCardStyle: CSSProperties = {
  background: 'rgba(255,255,255,0.06)',
  borderRadius: 'var(--r-lg)',
  border: '1px solid rgba(255,255,255,0.08)',
  padding: '24px',
  marginBottom: '20px',
};

const sectionTitleStyle: CSSProperties = {
  fontFamily: "'IBM Plex Arabic', sans-serif",
  fontSize: '16px',
  fontWeight: 800,
  color: 'var(--gold)',
  marginBottom: '16px',
};

const loadingStyle: CSSProperties = {
  textAlign: 'center',
  padding: '40px 20px',
  color: 'var(--gray-3)',
  fontFamily: "'IBM Plex Arabic', sans-serif",
  fontSize: '16px',
};

/* ============================================================
   PIN Entry Component
============================================================ */
function PinEntry({ onSuccess }: { onSuccess: () => void }) {
  const [pin, setPin] = useState(['', '', '', '']);
  const [error, setError] = useState(false);
  const [shake, setShake] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleChange = useCallback(
    (index: number, value: string) => {
      if (value.length > 1) return;
      if (value && !/^\d$/.test(value)) return;

      const newPin = [...pin];
      newPin[index] = value;
      setPin(newPin);
      setError(false);
      setShake(false);

      if (value && index < 3) {
        inputRefs.current[index + 1]?.focus();
      }

      // Check PIN when all digits entered
      if (value && index === 3) {
        const fullPin = newPin.join('');
        if (fullPin === PARENT_PIN) {
          onSuccess();
        } else {
          setError(true);
          setShake(true);
          setTimeout(() => {
            setPin(['', '', '', '']);
            setShake(false);
            inputRefs.current[0]?.focus();
          }, 600);
        }
      }
    },
    [pin, onSuccess],
  );

  const handleKeyDown = useCallback(
    (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Backspace' && !pin[index] && index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    },
    [pin],
  );

  const pinContainerStyle: CSSProperties = {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    zIndex: 1,
    padding: '20px',
  };

  const pinBoxStyle: CSSProperties = {
    ...glassCardStyle,
    padding: '48px 40px',
    textAlign: 'center',
    maxWidth: '400px',
    width: '100%',
  };

  const pinInputStyle = (hasValue: boolean): CSSProperties => ({
    width: '64px',
    height: '72px',
    textAlign: 'center',
    fontSize: '28px',
    fontWeight: 900,
    fontFamily: "'IBM Plex Arabic', sans-serif",
    color: 'var(--white)',
    background: hasValue
      ? 'rgba(249,168,37,0.15)'
      : 'rgba(255,255,255,0.06)',
    border: error
      ? '2px solid var(--red)'
      : hasValue
        ? '2px solid var(--gold)'
        : '2px solid rgba(255,255,255,0.12)',
    borderRadius: '16px',
    outline: 'none',
    transition: 'all 0.2s',
    direction: 'ltr' as const,
  });

  return (
    <div style={pinContainerStyle}>
      <div style={pinBoxStyle}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔐</div>
        <h2
          style={{
            fontFamily: "'IBM Plex Arabic', sans-serif",
            fontSize: '22px',
            fontWeight: 800,
            color: 'var(--white)',
            marginBottom: '8px',
          }}
        >
          لوحة ولي الأمر
        </h2>
        <p
          style={{
            fontFamily: "'IBM Plex Arabic', sans-serif",
            fontSize: '14px',
            color: 'var(--gray-3)',
            marginBottom: '32px',
          }}
        >
          أدخل الرمز السري للمتابعة
        </p>

        <div
          style={{
            display: 'flex',
            gap: '12px',
            justifyContent: 'center',
            direction: 'ltr',
            marginBottom: '24px',
            animation: shake ? 'shakeX 0.4s ease' : undefined,
          }}
        >
          {pin.map((digit, i) => (
            <input
              key={i}
              ref={(el) => {
                inputRefs.current[i] = el;
              }}
              type="tel"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              style={pinInputStyle(!!digit)}
            />
          ))}
        </div>

        {error && (
          <p
            style={{
              fontFamily: "'IBM Plex Arabic', sans-serif",
              fontSize: '14px',
              color: 'var(--red)',
              marginBottom: '16px',
            }}
          >
            الرمز غير صحيح، حاول مرة أخرى
          </p>
        )}

        <p
          style={{
            fontFamily: "'IBM Plex Arabic', sans-serif",
            fontSize: '12px',
            color: 'var(--gray-3)',
            opacity: 0.6,
          }}
        >
          الرمز الافتراضي: 1234
        </p>

        <Link
          to="/home"
          style={{
            ...backLinkStyle,
            marginTop: '24px',
            display: 'block',
          }}
        >
          &larr; العودة للصفحة الرئيسية
        </Link>
      </div>
    </div>
  );
}

/* ============================================================
   Parent Dashboard Content
============================================================ */
function DashboardContent() {
  const { user, profile } = useAuthStore();
  const { fetchGradeProgress, fetchBadges } = useProgressStore();
  const { fetchBuckets, config: bucketConfig } = useBucketStore();

  const [allProgress, setAllProgress] = useState<GradeProgress[]>([]);
  const [allBadges, setAllBadges] = useState<BadgeWithEarned[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAll() {
      setLoading(true);
      const progressResults: GradeProgress[] = [];
      const badgeResults: BadgeWithEarned[] = [];

      for (const gradeNum of [4, 5, 6] as const) {
        try {
          await fetchGradeProgress(gradeNum);
          const { gradeProgress } = useProgressStore.getState();
          if (gradeProgress) {
            progressResults.push(gradeProgress);
          }
        } catch {
          // Silently continue
        }

        try {
          await fetchBadges(gradeNum);
          const { badges } = useProgressStore.getState();
          badgeResults.push(...badges);
        } catch {
          // Silently continue
        }
      }

      try {
        await fetchBuckets();
      } catch {
        // Silently continue
      }

      setAllProgress(progressResults);
      setAllBadges(badgeResults);
      setLoading(false);
    }

    loadAll();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (loading) {
    return (
      <div style={pageStyle}>
        <div style={loadingStyle}>جارٍ تحميل بيانات الطالب...</div>
      </div>
    );
  }

  const earnedBadges = allBadges.filter((b) => b.earned);
  const totalCompleted = allProgress.reduce(
    (sum, gp) => sum + gp.completedLessonIds.length,
    0,
  );
  const totalLessons = Object.values(GRADE_CONFIG).reduce(
    (sum, g) => sum + g.lessonCount,
    0,
  );
  const overallPct = totalLessons > 0 ? Math.round((totalCompleted / totalLessons) * 100) : 0;

  return (
    <div style={pageStyle}>
      <Link to="/home" style={backLinkStyle}>
        &larr; العودة للصفحة الرئيسية
      </Link>

      <h1 style={titleStyle}>لوحة ولي الأمر</h1>
      <p
        style={{
          fontFamily: "'IBM Plex Arabic', sans-serif",
          fontSize: '14px',
          color: 'var(--gray-3)',
          textAlign: 'center',
          marginBottom: '32px',
        }}
      >
        متابعة تقدم الطالب
      </p>

      {/* Profile Card */}
      <div style={{ ...glassCardStyle, textAlign: 'center', padding: '32px' }}>
        <div style={{ fontSize: '56px', marginBottom: '12px' }}>
          {profile?.gender === 'female' ? '👧' : '👦'}
        </div>
        <h2
          style={{
            fontFamily: "'IBM Plex Arabic', sans-serif",
            fontSize: '22px',
            fontWeight: 800,
            color: 'var(--white)',
            marginBottom: '6px',
          }}
        >
          {profile?.studentName || user?.email || 'الطالب'}
        </h2>
        <p
          style={{
            fontFamily: "'IBM Plex Arabic', sans-serif",
            fontSize: '13px',
            color: 'var(--gray-3)',
          }}
        >
          {user?.email}
        </p>
      </div>

      {/* Overall Progress */}
      <div style={glassCardStyle}>
        <h3 style={sectionTitleStyle}>التقدم العام</h3>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            marginBottom: '20px',
          }}
        >
          <div
            style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              background: `conic-gradient(var(--gold) ${overallPct * 3.6}deg, rgba(255,255,255,0.08) 0deg)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: 'var(--navy)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: "'IBM Plex Arabic', sans-serif",
                fontSize: '20px',
                fontWeight: 900,
                color: 'var(--gold)',
              }}
            >
              {overallPct}%
            </div>
          </div>
          <div>
            <div
              style={{
                fontFamily: "'IBM Plex Arabic', sans-serif",
                fontSize: '15px',
                fontWeight: 700,
                color: 'var(--white)',
                marginBottom: '4px',
              }}
            >
              {totalCompleted} من {totalLessons} درس مكتمل
            </div>
            <div
              style={{
                fontFamily: "'IBM Plex Arabic', sans-serif",
                fontSize: '13px',
                color: 'var(--gray-3)',
              }}
            >
              عبر جميع الصفوف الدراسية
            </div>
          </div>
        </div>

        {/* Per-grade Progress */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {allProgress.map((gp) => {
            const gradeConfig =
              GRADE_CONFIG[gp.gradeNumber as keyof typeof GRADE_CONFIG];
            if (!gradeConfig) return null;

            const completed = gp.completedLessonIds.length;
            const total = gradeConfig.lessonCount;
            const pct = total > 0 ? Math.round((completed / total) * 100) : 0;

            const gradeColors: Record<number, string> = {
              4: '#1E88E5',
              5: '#66BB6A',
              6: '#FFD54F',
            };

            return (
              <div
                key={gp.gradeNumber}
                style={{
                  padding: '14px 16px',
                  borderRadius: '14px',
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.06)',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '8px',
                  }}
                >
                  <span
                    style={{
                      fontFamily: "'IBM Plex Arabic', sans-serif",
                      fontSize: '14px',
                      fontWeight: 700,
                      color: 'var(--white)',
                    }}
                  >
                    {gradeConfig.nameAr}
                  </span>
                  <span
                    style={{
                      fontFamily: "'IBM Plex Arabic', sans-serif",
                      fontSize: '13px',
                      fontWeight: 600,
                      color: gradeColors[gp.gradeNumber] || 'var(--sky)',
                    }}
                  >
                    {completed}/{total} ({pct}%)
                  </span>
                </div>
                <div
                  style={{
                    height: '8px',
                    borderRadius: '4px',
                    background: 'rgba(255,255,255,0.08)',
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      height: '100%',
                      width: `${pct}%`,
                      borderRadius: '4px',
                      background: gradeColors[gp.gradeNumber] || 'var(--sky)',
                      transition: 'width 0.6s ease',
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Badges */}
      <div style={glassCardStyle}>
        <h3 style={sectionTitleStyle}>
          الشارات المكتسبة ({earnedBadges.length})
        </h3>
        {earnedBadges.length === 0 ? (
          <p
            style={{
              fontFamily: "'IBM Plex Arabic', sans-serif",
              fontSize: '14px',
              color: 'var(--gray-3)',
              textAlign: 'center',
              padding: '20px 0',
            }}
          >
            لم يحصل الطالب على شارات بعد
          </p>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))',
              gap: '12px',
            }}
          >
            {earnedBadges.map((badge) => (
              <div
                key={badge.id}
                style={{
                  textAlign: 'center',
                  padding: '16px 8px',
                  borderRadius: '14px',
                  background: 'rgba(249,168,37,0.08)',
                  border: '1px solid rgba(249,168,37,0.15)',
                }}
              >
                <div style={{ fontSize: '32px', marginBottom: '8px' }}>
                  {badge.icon}
                </div>
                <div
                  style={{
                    fontFamily: "'IBM Plex Arabic', sans-serif",
                    fontSize: '12px',
                    fontWeight: 700,
                    color: 'var(--gold-lt)',
                    lineHeight: 1.4,
                  }}
                >
                  {badge.nameAr}
                </div>
                {badge.earnedAt && (
                  <div
                    style={{
                      fontFamily: "'IBM Plex Arabic', sans-serif",
                      fontSize: '10px',
                      color: 'var(--gray-3)',
                      marginTop: '4px',
                    }}
                  >
                    {new Date(badge.earnedAt).toLocaleDateString('ar-SA', {
                      month: 'short',
                      day: 'numeric',
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Bucket Savings */}
      <div style={glassCardStyle}>
        <h3 style={sectionTitleStyle}>الدلاء المالية</h3>
        {!bucketConfig ? (
          <p
            style={{
              fontFamily: "'IBM Plex Arabic', sans-serif",
              fontSize: '14px',
              color: 'var(--gray-3)',
              textAlign: 'center',
              padding: '20px 0',
            }}
          >
            لم يتم إعداد الدلاء المالية بعد
          </p>
        ) : (
          <div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                gap: '8px',
                marginBottom: '20px',
                fontFamily: "'IBM Plex Arabic', sans-serif",
                fontSize: '13px',
                color: 'var(--gray-3)',
              }}
            >
              المصروف الأسبوعي:{' '}
              <strong style={{ color: 'var(--white)' }}>
                {bucketConfig.allowance} ر.س
              </strong>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '12px',
                marginBottom: '20px',
              }}
            >
              <BucketCard
                emoji="🛍️"
                label="الإنفاق"
                balance={bucketConfig.spendBalance}
                pct={bucketConfig.spendPct}
                color="#64B5F6"
              />
              <BucketCard
                emoji="🏦"
                label="الادخار"
                balance={bucketConfig.saveBalance}
                pct={bucketConfig.savePct}
                color="#66BB6A"
                goalName={bucketConfig.saveGoalName}
                goalPrice={bucketConfig.saveGoalPrice}
              />
              <BucketCard
                emoji="🤲"
                label="العطاء"
                balance={bucketConfig.giveBalance}
                pct={bucketConfig.givePct}
                color="#F9A825"
                goalName={bucketConfig.giveGoalName}
                goalPrice={bucketConfig.giveGoalPrice}
              />
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div
        style={{
          textAlign: 'center',
          padding: '20px 0 40px',
          fontFamily: "'IBM Plex Arabic', sans-serif",
          fontSize: '12px',
          color: 'var(--gray-3)',
          opacity: 0.5,
        }}
      >
        رواد المال - لوحة ولي الأمر
      </div>
    </div>
  );
}

/* ============================================================
   Bucket Card Sub-component
============================================================ */
function BucketCard({
  emoji,
  label,
  balance,
  pct,
  color,
  goalName,
  goalPrice,
}: {
  emoji: string;
  label: string;
  balance: number;
  pct: number;
  color: string;
  goalName?: string;
  goalPrice?: number;
}) {
  const goalPct =
    goalPrice && goalPrice > 0
      ? Math.min(100, Math.round((balance / goalPrice) * 100))
      : null;

  return (
    <div
      style={{
        textAlign: 'center',
        padding: '16px 10px',
        borderRadius: '16px',
        background: `${color}11`,
        border: `1px solid ${color}22`,
      }}
    >
      <div style={{ fontSize: '28px', marginBottom: '6px' }}>{emoji}</div>
      <div
        style={{
          fontFamily: "'IBM Plex Arabic', sans-serif",
          fontSize: '12px',
          fontWeight: 700,
          color,
          marginBottom: '4px',
        }}
      >
        {label} ({pct}%)
      </div>
      <div
        style={{
          fontFamily: "'IBM Plex Arabic', sans-serif",
          fontSize: '22px',
          fontWeight: 900,
          color: 'var(--white)',
          marginBottom: '4px',
        }}
      >
        {balance.toFixed(1)}
      </div>
      <div
        style={{
          fontFamily: "'IBM Plex Arabic', sans-serif",
          fontSize: '11px',
          color: 'var(--gray-3)',
        }}
      >
        ر.س
      </div>
      {goalName && goalPrice != null && goalPrice > 0 && (
        <div style={{ marginTop: '8px' }}>
          <div
            style={{
              fontFamily: "'IBM Plex Arabic', sans-serif",
              fontSize: '10px',
              color: 'var(--gray-3)',
              marginBottom: '4px',
            }}
          >
            {goalName} ({goalPrice} ر.س)
          </div>
          {goalPct !== null && (
            <div
              style={{
                height: '4px',
                borderRadius: '2px',
                background: 'rgba(255,255,255,0.1)',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  height: '100%',
                  width: `${goalPct}%`,
                  borderRadius: '2px',
                  background: color,
                  transition: 'width 0.6s ease',
                }}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ============================================================
   Main Export
============================================================ */
export default function ParentDashboard() {
  const [authenticated, setAuthenticated] = useState(false);

  if (!authenticated) {
    return <PinEntry onSuccess={() => setAuthenticated(true)} />;
  }

  return <DashboardContent />;
}
