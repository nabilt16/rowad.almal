import { useState, useEffect, useCallback, type CSSProperties } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { GRADE_CONFIG } from '@rowad/shared';
import * as adminApi from '../api/admin';
import type { AdminUser, AdminUserDetail, AdminStats } from '../api/admin';

/* ============================================================
   Tabs
============================================================ */
type Tab = 'users' | 'stats' | 'content';

const TABS: { key: Tab; label: string }[] = [
  { key: 'users', label: 'المستخدمين' },
  { key: 'stats', label: 'الإحصائيات' },
  { key: 'content', label: 'المحتوى' },
];

/* ============================================================
   Styles
============================================================ */
const pageStyle: CSSProperties = {
  minHeight: '100vh',
  padding: '32px 20px',
  position: 'relative',
  zIndex: 1,
  maxWidth: '1100px',
  margin: '0 auto',
};

const backLinkStyle: CSSProperties = {
  fontFamily: "'Cairo', sans-serif",
  fontSize: '14px',
  color: 'var(--sky)',
  textDecoration: 'none',
  display: 'inline-block',
  marginBottom: '24px',
};

const titleStyle: CSSProperties = {
  fontFamily: "'Cairo', sans-serif",
  fontSize: '28px',
  fontWeight: 900,
  color: 'var(--gold)',
  marginBottom: '8px',
};

const subtitleStyle: CSSProperties = {
  fontFamily: "'Cairo', sans-serif",
  fontSize: '14px',
  color: 'var(--gray-3)',
  marginBottom: '32px',
};

const tabBarStyle: CSSProperties = {
  display: 'flex',
  gap: '4px',
  marginBottom: '32px',
  background: 'rgba(255,255,255,0.04)',
  borderRadius: 'var(--r)',
  padding: '4px',
  border: '1px solid rgba(255,255,255,0.06)',
};

const tabBtnBase: CSSProperties = {
  flex: 1,
  padding: '12px 16px',
  fontFamily: "'Cairo', sans-serif",
  fontSize: '15px',
  fontWeight: 700,
  border: 'none',
  borderRadius: '14px',
  cursor: 'pointer',
  transition: 'all 0.2s',
};

const glassCardStyle: CSSProperties = {
  background: 'rgba(255,255,255,0.06)',
  borderRadius: 'var(--r-lg)',
  border: '1px solid rgba(255,255,255,0.08)',
  padding: '24px',
  marginBottom: '24px',
};

const accessDeniedStyle: CSSProperties = {
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  position: 'relative',
  zIndex: 1,
  textAlign: 'center',
};

const accessDeniedIcon: CSSProperties = {
  fontSize: '64px',
  marginBottom: '24px',
};

const accessDeniedTitle: CSSProperties = {
  fontFamily: "'Cairo', sans-serif",
  fontSize: '24px',
  fontWeight: 800,
  color: 'var(--red)',
  marginBottom: '12px',
};

const accessDeniedText: CSSProperties = {
  fontFamily: "'Cairo', sans-serif",
  fontSize: '16px',
  color: 'var(--gray-3)',
  marginBottom: '32px',
};

const accessDeniedLink: CSSProperties = {
  fontFamily: "'Cairo', sans-serif",
  fontSize: '14px',
  color: 'var(--sky)',
  textDecoration: 'none',
};

const loadingStyle: CSSProperties = {
  textAlign: 'center',
  padding: '60px 20px',
  color: 'var(--gray-3)',
  fontFamily: "'Cairo', sans-serif",
  fontSize: '16px',
};

/* ============================================================
   Main Component
============================================================ */
export default function AdminPage() {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState<Tab>('users');

  if (!user || user.role !== 'ADMIN') {
    return (
      <div style={accessDeniedStyle}>
        <div style={accessDeniedIcon}>🔒</div>
        <h1 style={accessDeniedTitle}>الوصول مرفوض</h1>
        <p style={accessDeniedText}>
          هذه الصفحة متاحة فقط للمشرفين. ليس لديك صلاحية الوصول.
        </p>
        <Link to="/home" style={accessDeniedLink}>
          &larr; العودة للصفحة الرئيسية
        </Link>
      </div>
    );
  }

  return (
    <div style={pageStyle}>
      <Link to="/home" style={backLinkStyle}>
        &larr; العودة للصفحة الرئيسية
      </Link>

      <h1 style={titleStyle}>لوحة الإدارة</h1>
      <p style={subtitleStyle}>
        مرحبًا بك في لوحة التحكم الإدارية - {user.email}
      </p>

      {/* Tab Bar */}
      <div style={tabBarStyle}>
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            style={{
              ...tabBtnBase,
              background:
                activeTab === tab.key
                  ? 'rgba(249, 168, 37, 0.2)'
                  : 'transparent',
              color:
                activeTab === tab.key ? 'var(--gold)' : 'var(--gray-3)',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'users' && <UsersTab />}
      {activeTab === 'stats' && <StatsTab />}
      {activeTab === 'content' && <ContentTab />}
    </div>
  );
}

/* ============================================================
   Users Tab
============================================================ */
function UsersTab() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [expandedData, setExpandedData] = useState<AdminUserDetail | null>(null);
  const [expandLoading, setExpandLoading] = useState(false);

  useEffect(() => {
    adminApi
      .getUsers()
      .then(setUsers)
      .catch(() => setError('فشل تحميل المستخدمين'))
      .finally(() => setLoading(false));
  }, []);

  const handleRowClick = useCallback(
    async (userId: string) => {
      if (expandedId === userId) {
        setExpandedId(null);
        setExpandedData(null);
        return;
      }
      setExpandedId(userId);
      setExpandedData(null);
      setExpandLoading(true);
      try {
        const detail = await adminApi.getUserById(userId);
        setExpandedData(detail);
      } catch {
        setExpandedData(null);
      } finally {
        setExpandLoading(false);
      }
    },
    [expandedId],
  );

  if (loading) return <div style={loadingStyle}>جارٍ تحميل المستخدمين...</div>;
  if (error) return <div style={{ ...loadingStyle, color: 'var(--red)' }}>{error}</div>;

  const tableHeaderStyle: CSSProperties = {
    padding: '14px 16px',
    fontFamily: "'Cairo', sans-serif",
    fontSize: '13px',
    fontWeight: 700,
    color: 'var(--gold)',
    textAlign: 'right',
    borderBottom: '2px solid rgba(249,168,37,0.2)',
  };

  const cellStyle: CSSProperties = {
    padding: '12px 16px',
    fontFamily: "'Noto Naskh Arabic', serif",
    fontSize: '14px',
    color: 'var(--white)',
    textAlign: 'right',
  };

  return (
    <div style={glassCardStyle}>
      <h2
        style={{
          fontFamily: "'Cairo', sans-serif",
          fontSize: '18px',
          fontWeight: 800,
          color: 'var(--white)',
          marginBottom: '20px',
        }}
      >
        قائمة المستخدمين ({users.length})
      </h2>

      <div style={{ overflowX: 'auto' }}>
        <table
          style={{
            width: '100%',
            borderCollapse: 'collapse',
          }}
        >
          <thead>
            <tr>
              <th style={tableHeaderStyle}>الاسم</th>
              <th style={tableHeaderStyle}>البريد الإلكتروني</th>
              <th style={tableHeaderStyle}>مسجّل</th>
              <th style={tableHeaderStyle}>التقدم</th>
              <th style={tableHeaderStyle}>تاريخ الانضمام</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u, index) => {
              const isEven = index % 2 === 0;
              const isExpanded = expandedId === u.id;
              const rowBg = isExpanded
                ? 'rgba(249,168,37,0.08)'
                : isEven
                  ? 'rgba(255,255,255,0.02)'
                  : 'transparent';

              return (
                <UserRow
                  key={u.id}
                  user={u}
                  rowBg={rowBg}
                  isExpanded={isExpanded}
                  expandedData={expandedData}
                  expandLoading={expandLoading}
                  cellStyle={cellStyle}
                  onRowClick={handleRowClick}
                />
              );
            })}
          </tbody>
        </table>
      </div>

      {users.length === 0 && (
        <div style={{ ...loadingStyle, padding: '32px' }}>
          لا يوجد مستخدمون بعد
        </div>
      )}
    </div>
  );
}

/* ============================================================
   UserRow Sub-component
============================================================ */
interface UserRowProps {
  user: AdminUser;
  rowBg: string;
  isExpanded: boolean;
  expandedData: AdminUserDetail | null;
  expandLoading: boolean;
  cellStyle: CSSProperties;
  onRowClick: (id: string) => void;
}

function UserRow({
  user,
  rowBg,
  isExpanded,
  expandedData,
  expandLoading,
  cellStyle,
  onRowClick,
}: UserRowProps) {
  const joinDate = new Date(user.createdAt).toLocaleDateString('ar-SA', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  const badgeStyle = (bg: string, color: string): CSSProperties => ({
    display: 'inline-block',
    padding: '2px 10px',
    borderRadius: '10px',
    fontSize: '12px',
    fontWeight: 700,
    fontFamily: "'Cairo', sans-serif",
    background: bg,
    color,
  });

  return (
    <>
      <tr
        onClick={() => onRowClick(user.id)}
        style={{
          background: rowBg,
          cursor: 'pointer',
          transition: 'background 0.2s',
        }}
      >
        <td style={cellStyle}>
          {user.profile?.studentName || (
            <span style={{ color: 'var(--gray-3)', fontStyle: 'italic' }}>
              بدون اسم
            </span>
          )}
        </td>
        <td style={{ ...cellStyle, direction: 'ltr', textAlign: 'right' }}>
          {user.email}
        </td>
        <td style={cellStyle}>
          {user.profile?.onboarded ? (
            <span style={badgeStyle('rgba(46,125,50,0.2)', 'var(--green-lt)')}>
              نعم
            </span>
          ) : (
            <span style={badgeStyle('rgba(198,40,40,0.2)', '#EF9A9A')}>
              لا
            </span>
          )}
        </td>
        <td style={cellStyle}>
          <span style={{ color: 'var(--sky)', fontWeight: 600 }}>
            {isExpanded ? '▲' : '▼'}
          </span>
        </td>
        <td style={cellStyle}>{joinDate}</td>
      </tr>

      {isExpanded && (
        <tr>
          <td
            colSpan={5}
            style={{
              padding: '0',
              background: 'rgba(255,255,255,0.03)',
              borderBottom: '2px solid rgba(249,168,37,0.1)',
            }}
          >
            <ExpandedUserDetail
              data={expandedData}
              loading={expandLoading}
              userId={user.id}
            />
          </td>
        </tr>
      )}
    </>
  );
}

/* ============================================================
   Expanded User Detail
============================================================ */
function ExpandedUserDetail({
  data,
  loading,
}: {
  data: AdminUserDetail | null;
  loading: boolean;
  userId: string;
}) {
  if (loading) {
    return (
      <div style={{ padding: '24px', textAlign: 'center', color: 'var(--gray-3)', fontFamily: "'Cairo', sans-serif" }}>
        جارٍ تحميل التفاصيل...
      </div>
    );
  }

  if (!data) {
    return (
      <div style={{ padding: '24px', textAlign: 'center', color: 'var(--red)', fontFamily: "'Cairo', sans-serif" }}>
        فشل تحميل التفاصيل
      </div>
    );
  }

  const sectionTitle: CSSProperties = {
    fontFamily: "'Cairo', sans-serif",
    fontSize: '14px',
    fontWeight: 700,
    color: 'var(--gold)',
    marginBottom: '8px',
  };

  const infoGrid: CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '16px',
    padding: '20px 24px',
  };

  const infoItem: CSSProperties = {
    fontFamily: "'Noto Naskh Arabic', serif",
    fontSize: '13px',
    color: 'var(--white)',
  };

  const infoLabel: CSSProperties = {
    color: 'var(--gray-3)',
    fontSize: '12px',
    display: 'block',
    marginBottom: '2px',
    fontFamily: "'Cairo', sans-serif",
  };

  return (
    <div style={{ padding: '8px 0' }}>
      {/* Profile Info */}
      {data.profile && (
        <div style={infoGrid}>
          <div style={infoItem}>
            <span style={infoLabel}>اسم الطالب</span>
            {data.profile.studentName}
          </div>
          <div style={infoItem}>
            <span style={infoLabel}>الجنس</span>
            {data.profile.gender === 'male' ? 'ذكر' : 'أنثى'}
          </div>
          <div style={infoItem}>
            <span style={infoLabel}>من يعمل</span>
            {data.profile.whoWorks === 'dad'
              ? 'الأب'
              : data.profile.whoWorks === 'mom'
                ? 'الأم'
                : 'كلاهما'}
          </div>
        </div>
      )}

      {/* Progress */}
      <div style={{ padding: '0 24px 16px' }}>
        <h4 style={sectionTitle}>الدروس المكتملة ({data.lessonProgress.length})</h4>
        {data.lessonProgress.length === 0 ? (
          <p style={{ fontSize: '13px', color: 'var(--gray-3)', fontFamily: "'Cairo', sans-serif" }}>
            لم يكمل أي درس بعد
          </p>
        ) : (
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '6px',
            }}
          >
            {data.lessonProgress.slice(0, 20).map((lp) => (
              <span
                key={lp.lessonId}
                style={{
                  display: 'inline-block',
                  padding: '3px 10px',
                  borderRadius: '8px',
                  fontSize: '11px',
                  fontFamily: "'Cairo', sans-serif",
                  background: 'rgba(46,125,50,0.15)',
                  color: 'var(--green-lt)',
                }}
              >
                {lp.lessonId.slice(0, 8)}...
              </span>
            ))}
            {data.lessonProgress.length > 20 && (
              <span
                style={{
                  fontSize: '12px',
                  color: 'var(--gray-3)',
                  fontFamily: "'Cairo', sans-serif",
                  alignSelf: 'center',
                }}
              >
                +{data.lessonProgress.length - 20} المزيد
              </span>
            )}
          </div>
        )}
      </div>

      {/* Badges */}
      <div style={{ padding: '0 24px 16px' }}>
        <h4 style={sectionTitle}>الشارات ({data.userBadges.length})</h4>
        {data.userBadges.length === 0 ? (
          <p style={{ fontSize: '13px', color: 'var(--gray-3)', fontFamily: "'Cairo', sans-serif" }}>
            لم يحصل على شارات بعد
          </p>
        ) : (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {data.userBadges.map((ub) => (
              <span
                key={ub.id}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '4px 12px',
                  borderRadius: '12px',
                  fontSize: '13px',
                  fontFamily: "'Cairo', sans-serif",
                  background: 'rgba(249,168,37,0.12)',
                  color: 'var(--gold-lt)',
                }}
              >
                <span>{ub.badge.icon}</span>
                {ub.badge.nameAr}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Streak */}
      {data.streak && (
        <div style={{ padding: '0 24px 16px' }}>
          <h4 style={sectionTitle}>سلسلة المواظبة</h4>
          <div style={{ display: 'flex', gap: '24px' }}>
            <div style={{ fontFamily: "'Cairo', sans-serif", fontSize: '13px', color: 'var(--white)' }}>
              <span style={{ color: 'var(--gray-3)' }}>الحالية: </span>
              <strong style={{ color: 'var(--gold)' }}>{data.streak.currentStreak}</strong> يوم
            </div>
            <div style={{ fontFamily: "'Cairo', sans-serif", fontSize: '13px', color: 'var(--white)' }}>
              <span style={{ color: 'var(--gray-3)' }}>الأطول: </span>
              <strong style={{ color: 'var(--sky)' }}>{data.streak.longestStreak}</strong> يوم
            </div>
          </div>
        </div>
      )}

      {/* Buckets */}
      {data.bucketConfig && (
        <div style={{ padding: '0 24px 20px' }}>
          <h4 style={sectionTitle}>الدلاء المالية</h4>
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
            <BucketMini label="الإنفاق" amount={data.bucketConfig.spendBalance} color="var(--sky)" />
            <BucketMini label="الادخار" amount={data.bucketConfig.saveBalance} color="var(--green-lt)" />
            <BucketMini label="العطاء" amount={data.bucketConfig.giveBalance} color="var(--gold)" />
          </div>
        </div>
      )}
    </div>
  );
}

function BucketMini({ label, amount, color }: { label: string; amount: number; color: string }) {
  return (
    <div
      style={{
        padding: '8px 16px',
        borderRadius: '10px',
        background: 'rgba(255,255,255,0.05)',
        border: `1px solid ${color}33`,
        fontFamily: "'Cairo', sans-serif",
        fontSize: '13px',
        color: 'var(--white)',
      }}
    >
      <span style={{ color: 'var(--gray-3)', marginLeft: '8px' }}>{label}:</span>
      <strong style={{ color }}>{amount.toFixed(1)}</strong> ر.س
    </div>
  );
}

/* ============================================================
   Stats Tab
============================================================ */
function StatsTab() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    adminApi
      .getStats()
      .then(setStats)
      .catch(() => setError('فشل تحميل الإحصائيات'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div style={loadingStyle}>جارٍ تحميل الإحصائيات...</div>;
  if (error) return <div style={{ ...loadingStyle, color: 'var(--red)' }}>{error}</div>;
  if (!stats) return null;

  const statCards: {
    icon: string;
    value: number;
    label: string;
    color: string;
    bgColor: string;
  }[] = [
    {
      icon: '👥',
      value: stats.totalUsers,
      label: 'إجمالي المستخدمين',
      color: '#64B5F6',
      bgColor: 'rgba(100,181,246,0.12)',
    },
    {
      icon: '🎓',
      value: stats.onboardedUsers,
      label: 'الطلاب المسجّلين',
      color: '#66BB6A',
      bgColor: 'rgba(102,187,106,0.12)',
    },
    {
      icon: '✅',
      value: stats.completedProgressCount,
      label: 'الدروس المكتملة',
      color: '#F9A825',
      bgColor: 'rgba(249,168,37,0.12)',
    },
    {
      icon: '📚',
      value: stats.totalLessons,
      label: 'إجمالي الدروس',
      color: '#CE93D8',
      bgColor: 'rgba(206,147,216,0.12)',
    },
    {
      icon: '🪣',
      value: stats.activeBuckets,
      label: 'إعدادات الدلاء',
      color: '#4DD0E1',
      bgColor: 'rgba(77,208,225,0.12)',
    },
  ];

  const gridStyle: CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '20px',
  };

  return (
    <div>
      <div style={gridStyle}>
        {statCards.map((card) => (
          <div
            key={card.label}
            style={{
              ...glassCardStyle,
              textAlign: 'center',
              padding: '28px 20px',
              background: card.bgColor,
              border: `1px solid ${card.color}22`,
            }}
          >
            <div style={{ fontSize: '40px', marginBottom: '12px' }}>{card.icon}</div>
            <div
              style={{
                fontFamily: "'Cairo', sans-serif",
                fontSize: '36px',
                fontWeight: 900,
                color: card.color,
                lineHeight: 1.1,
                marginBottom: '8px',
              }}
            >
              {card.value}
            </div>
            <div
              style={{
                fontFamily: "'Cairo', sans-serif",
                fontSize: '14px',
                fontWeight: 600,
                color: 'var(--white)',
                opacity: 0.85,
              }}
            >
              {card.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ============================================================
   Content Tab
============================================================ */
function ContentTab() {
  const grades = Object.values(GRADE_CONFIG);

  return (
    <div>
      <div style={glassCardStyle}>
        <h2
          style={{
            fontFamily: "'Cairo', sans-serif",
            fontSize: '18px',
            fontWeight: 800,
            color: 'var(--white)',
            marginBottom: '12px',
          }}
        >
          إدارة المحتوى
        </h2>
        <p
          style={{
            fontFamily: "'Cairo', sans-serif",
            fontSize: '14px',
            color: 'var(--gray-3)',
            marginBottom: '24px',
            lineHeight: 1.8,
          }}
        >
          يمكن تعديل محتوى الدروس من خلال واجهة برمجة التطبيقات (API) مباشرة.
          سيتم إضافة محرر مرئي للدروس في مرحلة لاحقة.
        </p>

        <h3
          style={{
            fontFamily: "'Cairo', sans-serif",
            fontSize: '15px',
            fontWeight: 700,
            color: 'var(--gold)',
            marginBottom: '16px',
          }}
        >
          الصفوف والوحدات
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {grades.map((grade) => (
            <div
              key={grade.number}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '16px 20px',
                borderRadius: '14px',
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.06)',
              }}
            >
              <div>
                <div
                  style={{
                    fontFamily: "'Cairo', sans-serif",
                    fontSize: '16px',
                    fontWeight: 700,
                    color: 'var(--white)',
                  }}
                >
                  {grade.nameAr}
                </div>
                <div
                  style={{
                    fontFamily: "'Cairo', sans-serif",
                    fontSize: '12px',
                    color: 'var(--gray-3)',
                    marginTop: '4px',
                  }}
                >
                  {grade.unitCount} وحدات &middot; {grade.lessonCount} درسًا
                </div>
              </div>
              <div
                style={{
                  fontFamily: "'Cairo', sans-serif",
                  fontSize: '24px',
                  fontWeight: 900,
                  color: 'var(--sky)',
                  opacity: 0.6,
                }}
              >
                {grade.number}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
