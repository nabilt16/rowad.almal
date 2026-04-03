import type { CSSProperties } from 'react';

type TabKey = 'lessons' | 'glossary' | 'guide' | 'progress';

interface NavBarProps {
  /** Current grade number for context */
  gradeNumber: number;
  /** Currently active tab */
  activeTab: TabKey;
  /** Called when user switches tab */
  onTabChange: (tab: TabKey) => void;
}

interface TabDef {
  key: TabKey;
  label: string;
  icon: string;
}

const TABS: TabDef[] = [
  { key: 'lessons',  label: 'الدروس',    icon: '\uD83D\uDCDA' },
  { key: 'glossary', label: 'المصطلحات', icon: '\uD83D\uDCD6' },
  { key: 'guide',    label: 'الدليل',    icon: '\uD83D\uDC68\u200D\uD83C\uDFEB' },
  { key: 'progress', label: 'التقدم',    icon: '\uD83D\uDCCA' },
];

const navStyle: CSSProperties = {
  display: 'flex',
  gap: '6px',
  background: 'rgba(255,255,255,0.04)',
  border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: 'var(--r-lg)',
  padding: '6px',
  marginBottom: '24px',
  animation: 'fadeDown 0.6s 0.1s ease both',
  overflowX: 'auto',
};

const navBtnBase: CSSProperties = {
  flex: 1,
  minWidth: '80px',
  padding: '11px 14px',
  border: 'none',
  borderRadius: 'var(--r)',
  background: 'transparent',
  color: 'rgba(255,255,255,0.45)',
  fontFamily: "'IBM Plex Arabic', sans-serif",
  fontSize: '14px',
  fontWeight: 700,
  cursor: 'pointer',
  transition: 'all 0.25s',
  whiteSpace: 'nowrap',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '6px',
};

const navBtnActive: CSSProperties = {
  ...navBtnBase,
  background: 'linear-gradient(135deg, var(--blue), #0D47A1)',
  color: 'white',
  boxShadow: '0 4px 18px rgba(21,101,192,0.45)',
};

export default function NavBar({ activeTab, onTabChange }: NavBarProps) {
  return (
    <nav style={navStyle}>
      {TABS.map((tab) => (
        <button
          key={tab.key}
          style={activeTab === tab.key ? navBtnActive : navBtnBase}
          onClick={() => onTabChange(tab.key)}
        >
          <span>{tab.icon}</span>
          {tab.label}
        </button>
      ))}
    </nav>
  );
}
