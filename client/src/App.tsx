import { lazy, Suspense, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/shared/ProtectedRoute';
import ErrorBoundary from './components/shared/ErrorBoundary';
import LoadingSpinner from './components/shared/LoadingSpinner';
import AppShell from './components/layout/AppShell';
import { useAuthStore } from './stores/authStore';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import HomePage from './pages/HomePage';
import GradePage from './pages/GradePage';
import AdminPage from './pages/AdminPage';
import BucketsPage from './pages/BucketsPage';
import ParentDashboard from './pages/ParentDashboard';

/* ── Lazy-loaded heavy pages ────────────────── */
const LessonPage = lazy(() => import('./pages/LessonPage'));
const GlossaryPage = lazy(() => import('./pages/GlossaryPage'));
const GuidePage = lazy(() => import('./pages/GuidePage'));

function SuspenseFallback() {
  return <LoadingSpinner fullScreen text="جارٍ تحميل الصفحة..." />;
}

export default function App() {
  const token = useAuthStore((s) => s.token);
  const user = useAuthStore((s) => s.user);
  const loadUser = useAuthStore((s) => s.loadUser);

  /* Auto-login: if token exists but user is not loaded, call loadUser */
  useEffect(() => {
    if (token && !user) {
      loadUser();
    }
  }, [token, user, loadUser]);

  return (
    <ErrorBoundary>
      <AppShell>
        <Suspense fallback={<SuspenseFallback />}>
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Protected routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/home" element={<HomePage />} />
              <Route path="/grade/:number" element={<GradePage />} />
              <Route path="/grade/:number/lesson/:id" element={<LessonPage />} />
              <Route path="/grade/:number/glossary" element={<GlossaryPage />} />
              <Route path="/grade/:number/guide" element={<GuidePage />} />
              <Route path="/admin" element={<AdminPage />} />
              <Route path="/buckets" element={<BucketsPage />} />
              <Route path="/parent" element={<ParentDashboard />} />
            </Route>

            {/* Default redirect */}
            <Route path="/" element={<Navigate to="/home" replace />} />
            <Route path="*" element={<Navigate to="/home" replace />} />
          </Routes>
        </Suspense>
      </AppShell>
    </ErrorBoundary>
  );
}
