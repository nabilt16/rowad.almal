import { Component, type ReactNode, type ErrorInfo, type CSSProperties } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

const containerStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '100vh',
  padding: '40px',
  textAlign: 'center',
  fontFamily: "'IBM Plex Arabic', sans-serif",
  color: 'var(--white)',
  position: 'relative',
  zIndex: 1,
};

const iconStyle: CSSProperties = {
  fontSize: '64px',
  marginBottom: '16px',
};

const titleStyle: CSSProperties = {
  fontSize: '24px',
  fontWeight: 700,
  marginBottom: '12px',
  color: 'var(--gold)',
};

const messageStyle: CSSProperties = {
  fontSize: '16px',
  color: 'var(--gray-3)',
  marginBottom: '24px',
  maxWidth: '500px',
};

const buttonStyle: CSSProperties = {
  padding: '12px 32px',
  fontSize: '16px',
  fontWeight: 700,
  fontFamily: "'IBM Plex Arabic', sans-serif",
  background: 'var(--blue)',
  color: 'var(--white)',
  border: 'none',
  borderRadius: 'var(--r)',
  cursor: 'pointer',
};

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('ErrorBoundary caught:', error, info.componentStack);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div style={containerStyle}>
          <div style={iconStyle}>&#9888;&#65039;</div>
          <h1 style={titleStyle}>حدث خطأ غير متوقع</h1>
          <p style={messageStyle}>
            عذرًا، حدث خطأ أثناء تحميل الصفحة. يرجى المحاولة مرة أخرى.
          </p>
          <button style={buttonStyle} onClick={this.handleReload}>
            إعادة تحميل الصفحة
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
