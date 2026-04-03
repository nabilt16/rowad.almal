import { useState, type CSSProperties } from 'react';

/* =============================================
   Font options — all suitable for Arabic text
============================================= */
const FONTS: { name: string; family: string; description: string; tag?: string }[] = [
  {
    name: 'Noto Naskh Arabic',
    family: "'Noto Naskh Arabic', serif",
    description: 'الخط الحالي — نسخ كلاسيكي، واضح ومريح للقراءة',
    tag: 'الحالي',
  },
  {
    name: 'Cairo',
    family: "'Cairo', sans-serif",
    description: 'هندسي حديث، مناسب للأطفال، خط العناوين الحالي',
    tag: 'حديث',
  },
  {
    name: 'Tajawal',
    family: "'Tajawal', sans-serif",
    description: 'أنيق ومريح، يجمع بين البساطة والوضوح',
    tag: 'مريح',
  },
  {
    name: 'El Messiri',
    family: "'El Messiri', sans-serif",
    description: 'مستدير وودود، مثالي للمحتوى التعليمي للأطفال',
    tag: 'ودود',
  },
  {
    name: 'Mada',
    family: "'Mada', sans-serif",
    description: 'هندسي نظيف وعصري، قراءة سهلة جداً',
    tag: 'عصري',
  },
  {
    name: 'IBM Plex Arabic',
    family: "'IBM Plex Arabic', sans-serif",
    description: 'احترافي وتقني، حيادي وواضح',
    tag: 'احترافي',
  },
  {
    name: 'Amiri',
    family: "'Amiri', serif",
    description: 'خط نسخي كلاسيكي أنيق، مستوحى من المخطوطات العربية',
    tag: 'كلاسيكي',
  },
  {
    name: 'Scheherazade New',
    family: "'Scheherazade New', serif",
    description: 'تقليدي راقٍ، يمنح نصوص القصص طابعاً أدبياً',
    tag: 'أدبي',
  },
  {
    name: 'Lateef',
    family: "'Lateef', serif",
    description: 'رشيق ومتدفق، مناسب للنصوص الطويلة',
    tag: 'رشيق',
  },
  {
    name: 'Reem Kufi',
    family: "'Reem Kufi', sans-serif",
    description: 'كوفي معاصر، مميز ومثير للاهتمام',
    tag: 'مميز',
  },
];

const SAMPLE_STORY =
  'كانت نور تحمل كيس التسوق مع جدتها في السوق. توقفت أمام بائع الفواكه وسألت: "جدتي، كيف نعرف أن هذا السعر مناسب؟" ابتسمت الجدة وقالت: "نقارن الأسعار يا حبيبتي، وهذا ما يسمى القرار الذكي."';

const SAMPLE_CONCEPT =
  'المقارنة بين الأسعار هي مهارة مالية مهمة تساعدنا على اتخاذ قرارات صحيحة عند الشراء. عندما نقارن سعرين لنفس المنتج، نختار الأوفر لتوفير أموالنا.';

/* =============================================
   Styles
============================================= */
const pageStyle: CSSProperties = {
  minHeight: '100vh',
  background: 'linear-gradient(160deg, #0B1929 0%, #0D2137 50%, #0B1929 100%)',
  color: 'white',
  direction: 'rtl',
  padding: '32px 20px 60px',
  fontFamily: "'Cairo', sans-serif",
};

const headerStyle: CSSProperties = {
  textAlign: 'center',
  marginBottom: '40px',
};

const titleStyle: CSSProperties = {
  fontSize: '28px',
  fontWeight: 900,
  color: '#FFD54F',
  fontFamily: "'Cairo', sans-serif",
  marginBottom: '8px',
};

const subtitleStyle: CSSProperties = {
  fontSize: '15px',
  color: 'rgba(255,255,255,0.55)',
  fontFamily: "'Cairo', sans-serif",
};

const gridStyle: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(520px, 1fr))',
  gap: '24px',
  maxWidth: '1200px',
  margin: '0 auto',
};

const cardStyle = (selected: boolean): CSSProperties => ({
  background: selected
    ? 'rgba(249,168,37,0.12)'
    : 'rgba(255,255,255,0.04)',
  border: selected
    ? '2px solid rgba(249,168,37,0.6)'
    : '1px solid rgba(255,255,255,0.1)',
  borderRadius: '18px',
  padding: '20px 22px',
  cursor: 'pointer',
  transition: 'all 0.2s ease',
});

const fontHeaderStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  marginBottom: '16px',
};

const fontNameStyle: CSSProperties = {
  fontFamily: "'Cairo', sans-serif",
  fontSize: '14px',
  fontWeight: 700,
  color: '#64B5F6',
};

const tagStyle = (selected: boolean): CSSProperties => ({
  fontSize: '11px',
  fontWeight: 700,
  fontFamily: "'Cairo', sans-serif",
  padding: '2px 10px',
  borderRadius: '20px',
  background: selected ? 'rgba(249,168,37,0.25)' : 'rgba(255,255,255,0.08)',
  color: selected ? '#FFD54F' : 'rgba(255,255,255,0.45)',
});

const descStyle: CSSProperties = {
  fontSize: '12px',
  color: 'rgba(255,255,255,0.4)',
  fontFamily: "'Cairo', sans-serif",
  marginRight: 'auto',
};

const storyBlockStyle: CSSProperties = {
  background: 'rgba(249,168,37,0.07)',
  borderRight: '4px solid #F9A825',
  borderRadius: '10px',
  padding: '14px 16px',
  marginBottom: '12px',
};

const storyLabelStyle: CSSProperties = {
  fontSize: '12px',
  fontWeight: 800,
  color: '#F9A825',
  fontFamily: "'Cairo', sans-serif",
  marginBottom: '8px',
};

const conceptBlockStyle: CSSProperties = {
  background: 'rgba(46,125,50,0.1)',
  borderRight: '4px solid #66BB6A',
  borderRadius: '10px',
  padding: '14px 16px',
};

const conceptLabelStyle: CSSProperties = {
  fontSize: '12px',
  fontWeight: 800,
  color: '#66BB6A',
  fontFamily: "'Cairo', sans-serif",
  marginBottom: '8px',
};

const selectedBannerStyle: CSSProperties = {
  textAlign: 'center',
  marginBottom: '32px',
};

const selectedPillStyle: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '10px',
  background: 'rgba(249,168,37,0.15)',
  border: '1px solid rgba(249,168,37,0.4)',
  borderRadius: '40px',
  padding: '10px 24px',
  fontFamily: "'Cairo', sans-serif",
  fontSize: '15px',
  fontWeight: 700,
  color: '#FFD54F',
};

const instructionStyle: CSSProperties = {
  textAlign: 'center',
  marginBottom: '28px',
  fontFamily: "'Cairo', sans-serif",
  fontSize: '15px',
  color: 'rgba(255,255,255,0.45)',
};

/* =============================================
   Component
============================================= */
export default function FontPreviewPage() {
  const [selected, setSelected] = useState<string>('Noto Naskh Arabic');

  const selectedFont = FONTS.find((f) => f.name === selected)!;

  return (
    <div style={pageStyle}>
      <div style={headerStyle}>
        <div style={titleStyle}>🔤 اختر خط محتوى الدروس</div>
        <div style={subtitleStyle}>
          انقر على أي بطاقة لمعاينة الخط في القصة والمفهوم
        </div>
      </div>

      <div style={selectedBannerStyle}>
        <div style={selectedPillStyle}>
          <span>✅</span>
          <span>الخط المختار:</span>
          <span style={{ fontFamily: selectedFont.family }}>{selectedFont.name}</span>
        </div>
      </div>

      <div style={instructionStyle}>
        انقر على الخط الذي يناسبك وأخبر المطور باسمه
      </div>

      <div style={gridStyle}>
        {FONTS.map((font) => {
          const isSelected = selected === font.name;
          return (
            <div
              key={font.name}
              style={cardStyle(isSelected)}
              onClick={() => setSelected(font.name)}
            >
              <div style={fontHeaderStyle}>
                <div style={fontNameStyle}>{font.name}</div>
                {font.tag && <div style={tagStyle(isSelected)}>{font.tag}</div>}
                <div style={descStyle}>{font.description}</div>
              </div>

              {/* Story block */}
              <div style={storyBlockStyle}>
                <div style={storyLabelStyle}>📖 القصة</div>
                <p
                  style={{
                    fontFamily: font.family,
                    fontSize: '18px',
                    lineHeight: 2.1,
                    color: 'rgba(255,255,255,0.88)',
                    margin: 0,
                  }}
                >
                  {SAMPLE_STORY}
                </p>
              </div>

              {/* Concept block */}
              <div style={conceptBlockStyle}>
                <div style={conceptLabelStyle}>💡 المفهوم</div>
                <p
                  style={{
                    fontFamily: font.family,
                    fontSize: '18px',
                    lineHeight: 2.0,
                    color: 'rgba(255,255,255,0.88)',
                    margin: 0,
                  }}
                >
                  {SAMPLE_CONCEPT}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
