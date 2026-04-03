import { useState, useEffect, type CSSProperties } from 'react';
import type { GlossaryUnit, GlossaryTerm } from '@rowad/shared';
import { getGlossary } from '../../api/glossary';
import LoadingSpinner from '../shared/LoadingSpinner';
import TermCard from './TermCard';

interface GlossaryPanelProps {
  gradeNumber: number;
}

const panelStyle: CSSProperties = {
  width: '100%',
};

const searchWrapperStyle: CSSProperties = {
  marginBottom: '28px',
  position: 'relative',
};

const searchIconStyle: CSSProperties = {
  position: 'absolute',
  right: '16px',
  top: '50%',
  transform: 'translateY(-50%)',
  fontSize: '18px',
  color: 'var(--gray-3)',
  pointerEvents: 'none',
};

const searchInputStyle: CSSProperties = {
  width: '100%',
  padding: '14px 48px 14px 18px',
  background: 'rgba(255,255,255,0.07)',
  border: '1px solid rgba(255,255,255,0.12)',
  borderRadius: 'var(--r-lg)',
  color: 'var(--white)',
  fontFamily: "'Cairo', sans-serif",
  fontSize: '16px',
  fontWeight: 600,
  outline: 'none',
  direction: 'rtl',
  transition: 'border-color 0.2s, background 0.2s',
  boxSizing: 'border-box',
};

const unitSectionStyle: CSSProperties = {
  marginBottom: '28px',
};

const unitHeaderStyle = (color: string): CSSProperties => ({
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  padding: '14px 20px',
  background: `${color}20`,
  borderRadius: 'var(--r)',
  marginBottom: '16px',
  cursor: 'pointer',
  userSelect: 'none',
  transition: 'background 0.2s',
});

const unitIconStyle: CSSProperties = {
  fontSize: '22px',
  width: '32px',
  textAlign: 'center',
  flexShrink: 0,
};

const unitNameStyle: CSSProperties = {
  fontFamily: "'Cairo', sans-serif",
  fontSize: '18px',
  fontWeight: 700,
  color: 'var(--white)',
  flex: 1,
};

const termCountStyle = (color: string): CSSProperties => ({
  fontFamily: "'Cairo', sans-serif",
  fontSize: '13px',
  fontWeight: 600,
  color: color,
  background: `${color}20`,
  padding: '4px 12px',
  borderRadius: '12px',
  flexShrink: 0,
});

const chevronStyle = (expanded: boolean): CSSProperties => ({
  display: 'inline-block',
  transition: 'transform 0.25s ease',
  transform: expanded ? 'rotate(90deg)' : 'rotate(0deg)',
  fontSize: '12px',
  color: 'var(--gray-3)',
  flexShrink: 0,
});

const emptyStyle: CSSProperties = {
  textAlign: 'center',
  color: 'var(--gray-3)',
  fontFamily: "'Cairo', sans-serif",
  fontSize: '18px',
  padding: '60px 20px',
  background: 'rgba(255,255,255,0.04)',
  borderRadius: 'var(--r-lg)',
  border: '1px solid rgba(255,255,255,0.06)',
};

const noResultsStyle: CSSProperties = {
  textAlign: 'center',
  color: 'var(--gray-3)',
  fontFamily: "'Cairo', sans-serif",
  fontSize: '16px',
  padding: '40px 20px',
};

const errorStyle: CSSProperties = {
  textAlign: 'center',
  color: 'var(--red)',
  fontFamily: "'Cairo', sans-serif",
  fontSize: '16px',
  padding: '40px',
};

export default function GlossaryPanel({ gradeNumber }: GlossaryPanelProps) {
  const [units, setUnits] = useState<GlossaryUnit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [expandedUnits, setExpandedUnits] = useState<Record<string, boolean>>({});

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError('');

    getGlossary(gradeNumber)
      .then((data) => {
        if (!cancelled) {
          setUnits(data);
          // Expand all units by default
          const expanded: Record<string, boolean> = {};
          data.forEach((u: GlossaryUnit) => {
            expanded[u.id] = true;
          });
          setExpandedUnits(expanded);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err.response?.data?.message || 'حدث خطأ في تحميل المصطلحات');
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [gradeNumber]);

  const toggleUnit = (unitId: string) => {
    setExpandedUnits((prev) => ({ ...prev, [unitId]: !prev[unitId] }));
  };

  // Filter terms by search query
  const filterTerms = (terms: GlossaryTerm[]): GlossaryTerm[] => {
    if (!search.trim()) return terms;
    const q = search.trim().toLowerCase();
    return terms.filter(
      (t) =>
        t.termAr.toLowerCase().includes(q) ||
        t.termHe.toLowerCase().includes(q) ||
        t.definition.toLowerCase().includes(q),
    );
  };

  if (loading) {
    return <LoadingSpinner text="جارٍ تحميل المصطلحات..." />;
  }

  if (error) {
    return <div style={errorStyle}>{error}</div>;
  }

  if (units.length === 0) {
    return (
      <div style={emptyStyle}>
        {'\uD83D\uDCD6'} لا توجد مصطلحات لهذا الصف
      </div>
    );
  }

  // Check if any terms match the search
  const hasResults = units.some((u) => filterTerms(u.terms).length > 0);

  return (
    <div style={panelStyle}>
      {/* Search input */}
      <div style={searchWrapperStyle}>
        <span style={searchIconStyle}>{'\uD83D\uDD0D'}</span>
        <input
          type="text"
          placeholder="ابحث عن مصطلح..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={searchInputStyle}
        />
      </div>

      {!hasResults && (
        <div style={noResultsStyle}>
          لا توجد نتائج للبحث &quot;{search}&quot;
        </div>
      )}

      {/* Unit sections */}
      {units.map((unit) => {
        const filteredTerms = filterTerms(unit.terms);
        if (search.trim() && filteredTerms.length === 0) return null;

        const isExpanded = expandedUnits[unit.id] ?? true;

        return (
          <div key={unit.id} style={unitSectionStyle}>
            <div
              style={unitHeaderStyle(unit.unitColor || 'var(--blue)')}
              onClick={() => toggleUnit(unit.id)}
            >
              <span style={chevronStyle(isExpanded)}>{'\u25B6'}</span>
              <span style={unitIconStyle}>{unit.icon || '\uD83D\uDCD8'}</span>
              <span style={unitNameStyle}>
                {'\u0627\u0644\u0648\u062D\u062F\u0629'} {unit.unitNumber}: {unit.unitName}
              </span>
              <span style={termCountStyle(unit.unitColor || 'var(--blue)')}>
                {filteredTerms.length} {'\u0645\u0635\u0637\u0644\u062D'}
              </span>
            </div>

            {isExpanded && (
              <div style={{ padding: '0 4px' }}>
                {filteredTerms.map((term) => (
                  <TermCard
                    key={term.id}
                    termAr={term.termAr}
                    termHe={term.termHe}
                    definition={term.definition}
                    example={term.example}
                    accentColor={unit.unitColor || 'var(--blue)'}
                  />
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
