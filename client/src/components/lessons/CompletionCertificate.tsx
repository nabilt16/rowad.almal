import { type CSSProperties } from 'react';

interface UnitBadge {
  label: string;
  color: string;
}

interface CompletionCertificateProps {
  studentName: string;
  levelName: string;
  units: UnitBadge[];
  showCharter?: boolean;
  onClose: () => void;
}

const CHARTER_HTML = `
  <div style="
    background:#F9FBF7;border:1.5px solid #C8A951;border-radius:10px;
    padding:20px;margin:0;text-align:center;direction:rtl;
    width:100%;box-sizing:border-box;
  ">
    <div style="font-size:18px;font-weight:700;color:#1B5E20;margin-bottom:6px;font-family:'Almarai',sans-serif">✏️ ميثاق الريادي الذكي</div>
    <div style="font-size:13px;color:#555;margin-bottom:10px;font-family:'Cairo',sans-serif">
      أنا الخريج/ة في برنامج "رواد المال"، أعدُ نفسي ومجتمعي بأنني:
    </div>
    <div style="display:flex;gap:20px;direction:rtl;justify-content:center">
      <div style="flex:1;font-size:13px;color:#212121;line-height:2;text-align:right;font-family:'Cairo',sans-serif">
        <div>💰 <strong>أعرف قيمة المال:</strong> سأقارن الأسعار للحفاظ على قوتي الشرائية.</div>
        <div>📊 <strong>أدير ميزانيتي:</strong> سأخطط وأُفرّق بين الحاجة والرغبة.</div>
        <div>🛒 <strong>مستهلك ذكي:</strong> لن أقع في فخ الإعلانات وسأشتري بوعي.</div>
      </div>
      <div style="flex:1;font-size:13px;color:#212121;line-height:2;text-align:right;font-family:'Cairo',sans-serif">
        <div>🤝 <strong>شريك في المجتمع:</strong> سأفهم أهمية الضرائب والتبرع لمساعدة غيري.</div>
        <div>⏰ <strong>أُقدّر العمل:</strong> وقتي وجهدي هما رأس مالي الحقيقي.</div>
      </div>
    </div>
  </div>
`;

function buildPrintWindow(
  studentName: string,
  levelName: string,
  units: { label: string; color: string }[],
  today: string,
  showCharter: boolean,
) {
  const badgesHtml = units.map(u => `
    <span style="
      background:${u.color};color:white;border-radius:16px;
      padding:8px 16px;font-size:14px;font-weight:700;
      display:inline-flex;align-items:center;gap:4px;margin:3px;
    ">✅ ${u.label}</span>
  `).join('');

  return `<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
  <meta charset="UTF-8">
  <link href="https://fonts.googleapis.com/css2?family=Almarai:wght@700&family=Amiri:wght@700&family=Cairo&display=swap" rel="stylesheet">
  <style>
    @page { size: A4 landscape; margin: 0.7cm; }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    html, body { width:100%; height:100%; overflow:hidden; background:#FFFEF5; }
    body { display:flex; align-items:stretch; justify-content:center; }
    .cert {
      background: #FFFEF5;
      outline: 3px solid #C8A951;
      outline-offset: -3px;
      border: 1px solid #C8A951;
      border-radius: 10px;
      padding: 16px 40px 14px;
      width: 100%;
      position: relative;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: space-between;
      text-align: center;
      direction: rtl;
      font-family: 'Cairo', sans-serif;
      color: #212121;
      overflow: hidden;
    }
    .corner {
      position: absolute;
      font-size: 18px;
      color: #C8A951;
      line-height: 1;
    }
    .content { position:relative; z-index:1; width:100%; display:flex; flex-direction:column; align-items:center; justify-content:space-evenly; flex:1; }
    .section { width:100%; display:flex; flex-direction:column; align-items:center; }
    .divider {
      height: 1px;
      width: 80%;
      background: linear-gradient(90deg, transparent, #C8A951, transparent);
    }
    .sig-row {
      display:flex; justify-content:space-around; align-items:flex-start; width:100%;
      border-top: 1px solid #C8A951; padding-top:10px; margin-top:16px;
    }
    .sig-col { text-align:center; font-size:13px; color:#212121; font-family:'Cairo',sans-serif; }
    .sig-line { border-bottom:1px solid #999; width:120px; margin:0 auto 5px; }
  </style>
</head>
<body>
  <div class="cert">
    <!-- Corner ornaments -->
    <span class="corner" style="top:8px;right:10px">✦</span>
    <span class="corner" style="top:8px;left:10px">✦</span>
    <span class="corner" style="bottom:8px;right:10px">✦</span>
    <span class="corner" style="bottom:8px;left:10px">✦</span>

    <div class="content">

      <!-- 1. HEADER -->
      <div class="section">
        <div style="font-size:32px;line-height:1.1">🏛️</div>
        <div style="font-size:28px;font-weight:700;color:#1B5E20;font-family:'Almarai',sans-serif;margin-top:2px">رواد المال</div>
        <div style="font-size:16px;color:#C8A951;font-family:'Almarai',sans-serif;margin-top:2px">شهادة إنجاز</div>
      </div>

      <div class="divider"></div>

      <!-- 2. STUDENT -->
      <div class="section">
        <div style="font-size:14px;color:#666;font-family:'Cairo',sans-serif;margin-bottom:4px">يُشهد بأن الطالب/ة</div>
        <div style="font-size:42px;font-weight:700;color:#1B5E20;line-height:1.15;font-family:'Amiri',serif">${studentName}</div>
      </div>

      <div class="divider"></div>

      <!-- 3. LEVEL & BADGES -->
      <div class="section">
        <div style="font-size:15px;color:#444;margin-bottom:10px;font-family:'Cairo',sans-serif">
          أتمّ بنجاح برنامج الثقافة المالية للأطفال —
          <strong style="color:#1B5E20">${levelName}</strong>
        </div>
        <div style="display:flex;flex-wrap:wrap;justify-content:center;gap:6px">${badgesHtml}</div>
      </div>

      <!-- 4. STARS -->
      <div style="font-size:22px;letter-spacing:6px">⭐⭐⭐⭐⭐</div>

      <!-- 5. MITHAQ (Levels 2 & 3 only) -->
      ${showCharter ? CHARTER_HTML : ''}

    </div>

    <!-- 6. SIGNATURE ROW -->
    <div class="sig-row">
      <div class="sig-col">
        <div class="sig-line"></div>
        توقيع المعلم/ة
      </div>
      <div class="sig-col">📅 ${today}</div>
      <div class="sig-col">
        <div class="sig-line"></div>
        ختم المدرسة
      </div>
    </div>
  </div>
</body>
</html>`;
}

function handlePrint(
  studentName: string,
  levelName: string,
  units: { label: string; color: string }[],
  today: string,
  showCharter: boolean,
) {
  const win = window.open('', '_blank', 'width=1000,height=700');
  if (!win) return;
  win.document.write(buildPrintWindow(studentName, levelName, units, today, showCharter));
  win.document.close();
  win.onload = () => {
    win.focus();
    win.print();
    win.close();
  };
}

/* ─── On-screen modal styles ─── */

const backdropStyle: CSSProperties = {
  position: 'fixed',
  inset: 0,
  zIndex: 9999,
  background: 'rgba(0,0,0,0.75)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '16px',
  animation: 'fadeIn 0.4s ease',
  direction: 'rtl',
  overflowY: 'auto',
};

const certStyle: CSSProperties = {
  background: '#FFFDE7',
  border: '6px double #B8860B',
  borderRadius: '12px',
  padding: '36px 32px 28px',
  width: '100%',
  maxWidth: '480px',
  textAlign: 'center',
  fontFamily: "'IBM Plex Arabic', sans-serif",
  direction: 'rtl',
  animation: 'popIn 0.5s cubic-bezier(0.34,1.56,0.64,1)',
  boxShadow: '0 8px 40px rgba(0,0,0,0.4)',
  color: '#2c2c2c',
};

export default function CompletionCertificate({
  studentName,
  levelName,
  units,
  showCharter = false,
  onClose,
}: CompletionCertificateProps) {
  const _d = new Date();
  const today = `${_d.getDate()}/${_d.getMonth() + 1}/${_d.getFullYear()}`;

  return (
    <div style={backdropStyle}>
      <div style={certStyle} className="certificate">

        {/* Logo */}
        <div className="cert-logo" style={{ fontSize: '60px', marginBottom: '4px' }}>🏛️</div>

        {/* App title */}
        <div className="cert-app-title" style={{
          fontSize: '28px', fontWeight: 900,
          color: '#B8860B', marginBottom: '2px',
        }}>
          رواد المال
        </div>

        {/* Certificate heading */}
        <div className="cert-heading" style={{
          fontSize: '16px', color: '#8B6914', marginBottom: '16px',
        }}>
          شهادة إنجاز
        </div>

        {/* Gold divider */}
        <div className="cert-divider" style={{
          height: '2px',
          background: 'linear-gradient(90deg, transparent, #B8860B, transparent)',
          margin: '0 0 16px',
        }} />

        {/* Presented to */}
        <div className="cert-presented" style={{
          fontSize: '14px', color: '#666', marginBottom: '8px',
        }}>
          يُشهد بأن الطالب/ة
        </div>

        {/* Student name */}
        <div className="cert-name" style={{
          fontSize: '32px', fontWeight: 900,
          color: '#1A237E', marginBottom: '12px',
          lineHeight: 1.3,
        }}>
          {studentName}
        </div>

        {/* Gold divider */}
        <div className="cert-divider" style={{
          height: '2px',
          background: 'linear-gradient(90deg, transparent, #B8860B, transparent)',
          margin: '0 0 16px',
        }} />

        {/* Body */}
        <div className="cert-body-line" style={{
          fontSize: '15px', color: '#444', marginBottom: '4px',
        }}>
          أتمّ بنجاح برنامج الثقافة المالية للأطفال
        </div>
        <div className="cert-level" style={{
          fontSize: '16px', fontWeight: 700,
          color: '#B8860B', marginBottom: '18px',
        }}>
          {levelName}
        </div>

        {/* Unit badges */}
        <div className="cert-badges-row" style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: '8px',
          marginBottom: '18px',
        }}>
          {units.map((u, i) => (
            <span key={i} className="cert-badge" style={{
              background: u.color,
              color: 'white',
              borderRadius: '20px',
              padding: '5px 16px',
              fontSize: '13px',
              fontWeight: 700,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
            }}>
              ✅ {u.label}
            </span>
          ))}
        </div>

        {/* Stars */}
        <div className="cert-stars" style={{
          fontSize: '24px', letterSpacing: '6px', marginBottom: '18px',
        }}>
          ⭐⭐⭐⭐⭐
        </div>

        {/* Signature lines */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          width: '100%',
          marginBottom: '12px',
          borderTop: '1px solid #B8860B',
          paddingTop: '10px',
        }}>
          <div style={{ textAlign: 'center', flex: 1 }}>
            <div className="cert-sig-label" style={{ fontSize: '12px', color: '#666' }}>ختم المدرسة</div>
          </div>
          <div style={{ width: '1px', background: '#B8860B', margin: '0 12px' }} />
          <div style={{ textAlign: 'center', flex: 1 }}>
            <div className="cert-sig-label" style={{ fontSize: '12px', color: '#666' }}>توقيع المعلم/ة</div>
          </div>
        </div>

        {/* Date */}
        <div className="cert-date" style={{
          fontSize: '13px', color: '#888', marginBottom: '20px',
        }}>
          📅 {today}
        </div>

        {/* Buttons */}
        <div className="cert-btn-row" style={{
          display: 'flex', gap: '10px', justifyContent: 'center',
        }}>
          <button
            onClick={() => handlePrint(studentName, levelName, units, today, showCharter)}
            style={{
              padding: '11px 24px',
              background: 'linear-gradient(135deg, #FFB300, #E65100)',
              color: 'white', border: 'none', borderRadius: '10px',
              fontSize: '15px', fontWeight: 800, cursor: 'pointer',
              fontFamily: "'IBM Plex Arabic', sans-serif",
            }}
          >
            🖨️ اطبع شهادتك
          </button>
          <button
            onClick={onClose}
            style={{
              padding: '11px 20px',
              background: 'rgba(0,0,0,0.08)',
              border: '1px solid #ccc', borderRadius: '10px',
              fontSize: '14px', fontWeight: 700, cursor: 'pointer',
              fontFamily: "'IBM Plex Arabic', sans-serif",
              color: '#555',
            }}
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
}
