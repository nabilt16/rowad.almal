import { useEffect, type CSSProperties } from 'react';
import { Link } from 'react-router-dom';
import { useBucketStore } from '../stores/bucketStore';
import AppShell from '../components/layout/AppShell';
import LoadingSpinner from '../components/shared/LoadingSpinner';
import BucketsSetup from '../components/buckets/BucketsSetup';
import BucketsTracker from '../components/buckets/BucketsTracker';

const pageStyle: CSSProperties = {
  minHeight: '100vh',
  padding: '32px 20px 80px',
  position: 'relative',
  zIndex: 1,
  maxWidth: '960px',
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

const errorStyle: CSSProperties = {
  textAlign: 'center',
  color: 'var(--red)',
  fontFamily: "'IBM Plex Arabic', sans-serif",
  fontSize: '16px',
  padding: '40px',
};

export default function BucketsPage() {
  const { config, loading, error, fetchBuckets } = useBucketStore();

  useEffect(() => {
    fetchBuckets();
  }, [fetchBuckets]);

  return (
    <AppShell>
      <div style={pageStyle}>
        <Link to="/home" style={backLinkStyle}>
          &larr; العودة للصفحة الرئيسية
        </Link>

        {loading && !config && (
          <LoadingSpinner text="جارٍ تحميل الدلاء..." />
        )}

        {error && !config && !loading && (
          <div style={errorStyle}>{error}</div>
        )}

        {!loading && !config && !error && <BucketsSetup />}

        {config && <BucketsTracker />}
      </div>
    </AppShell>
  );
}
