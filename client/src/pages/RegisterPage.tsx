import { useState, type FormEvent, type CSSProperties } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';

const pageStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '100vh',
  padding: '20px',
  position: 'relative',
  zIndex: 1,
};

const cardStyle: CSSProperties = {
  background: 'var(--white)',
  borderRadius: 'var(--r-lg)',
  padding: '40px',
  width: '100%',
  maxWidth: '420px',
  boxShadow: 'var(--sh-lg)',
};

const titleStyle: CSSProperties = {
  fontFamily: "'IBM Plex Arabic', sans-serif",
  fontSize: '28px',
  fontWeight: 900,
  color: 'var(--navy)',
  textAlign: 'center',
  marginBottom: '8px',
};

const subtitleStyle: CSSProperties = {
  fontFamily: "'IBM Plex Arabic', sans-serif",
  fontSize: '16px',
  color: 'var(--muted)',
  textAlign: 'center',
  marginBottom: '32px',
};

const labelStyle: CSSProperties = {
  display: 'block',
  fontFamily: "'IBM Plex Arabic', sans-serif",
  fontSize: '14px',
  fontWeight: 600,
  color: 'var(--text)',
  marginBottom: '6px',
};

const inputStyle: CSSProperties = {
  width: '100%',
  padding: '12px 16px',
  fontSize: '16px',
  border: '2px solid var(--gray-2)',
  borderRadius: 'var(--r)',
  outline: 'none',
  direction: 'rtl',
  marginBottom: '20px',
  transition: 'border-color 0.2s',
};

const buttonStyle: CSSProperties = {
  width: '100%',
  padding: '14px',
  fontSize: '18px',
  fontWeight: 700,
  fontFamily: "'IBM Plex Arabic', sans-serif",
  background: 'linear-gradient(135deg, var(--green), var(--green-lt))',
  color: 'var(--white)',
  border: 'none',
  borderRadius: 'var(--r)',
  cursor: 'pointer',
  marginBottom: '16px',
};

const linkContainerStyle: CSSProperties = {
  textAlign: 'center',
  fontFamily: "'IBM Plex Arabic', sans-serif",
  fontSize: '14px',
  color: 'var(--muted)',
};

const errorStyle: CSSProperties = {
  background: '#FFF0F0',
  color: 'var(--red)',
  padding: '10px 16px',
  borderRadius: 'var(--r)',
  fontSize: '14px',
  fontFamily: "'IBM Plex Arabic', sans-serif",
  marginBottom: '16px',
  textAlign: 'center',
};

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { register, loading, error, clearError } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    clearError();
    try {
      await register({ name, email, password });
      navigate('/home');
    } catch {
      // Error is set in the store
    }
  };

  return (
    <div style={pageStyle}>
      <div style={cardStyle}>
        <h1 style={titleStyle}>رواد المال</h1>
        <p style={subtitleStyle}>إنشاء حساب جديد</p>

        {error && <div style={errorStyle}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <label style={labelStyle} htmlFor="name">
            الاسم
          </label>
          <input
            id="name"
            type="text"
            style={inputStyle}
            placeholder="أدخل اسمك"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <label style={labelStyle} htmlFor="email">
            البريد الإلكتروني
          </label>
          <input
            id="email"
            type="email"
            style={inputStyle}
            placeholder="أدخل بريدك الإلكتروني"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            dir="ltr"
          />

          <label style={labelStyle} htmlFor="password">
            كلمة المرور
          </label>
          <input
            id="password"
            type="password"
            style={inputStyle}
            placeholder="أدخل كلمة المرور (6 أحرف على الأقل)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            dir="ltr"
          />

          <button type="submit" style={buttonStyle} disabled={loading}>
            {loading ? 'جارٍ إنشاء الحساب...' : 'إنشاء حساب'}
          </button>
        </form>

        <div style={linkContainerStyle}>
          لديك حساب بالفعل؟{' '}
          <Link to="/login" style={{ color: 'var(--blue)', fontWeight: 700 }}>
            تسجيل الدخول
          </Link>
        </div>
      </div>
    </div>
  );
}
