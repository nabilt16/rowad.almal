import { useState, type ReactNode, type CSSProperties } from 'react';
import { useAuthStore } from '../../stores/authStore';
import OnboardingOverlay from '../onboarding/OnboardingOverlay';

/**
 * AppShell — wraps the entire app with the background gradient, grid overlay,
 * floating coin decorations, and onboarding overlay from the original HTML design.
 */

interface AppShellProps {
  children: ReactNode;
}

/** Floating coin positions — fixed set for consistency */
const COINS = [
  { left: '8%',  bottom: '-5%',  delay: '0s',    duration: '18s' },
  { left: '22%', bottom: '-10%', delay: '4s',    duration: '22s' },
  { left: '45%', bottom: '-8%',  delay: '7s',    duration: '20s' },
  { left: '65%', bottom: '-12%', delay: '2s',    duration: '25s' },
  { left: '80%', bottom: '-6%',  delay: '10s',   duration: '19s' },
  { left: '92%', bottom: '-9%',  delay: '5s',    duration: '23s' },
];

const appContainerStyle: CSSProperties = {
  position: 'relative',
  zIndex: 1,
  maxWidth: '1080px',
  margin: '0 auto',
  padding: '16px 16px 60px',
  minHeight: '100vh',
};

export default function AppShell({ children }: AppShellProps) {
  const user = useAuthStore((s) => s.user);
  const profile = useAuthStore((s) => s.profile);
  const [onboardingDismissed, setOnboardingDismissed] = useState(false);

  /* Show onboarding overlay if user is logged in but profile is NOT onboarded */
  const showOnboarding =
    user !== null &&
    profile !== null &&
    profile.onboarded === false &&
    !onboardingDismissed;

  return (
    <>
      {/* Gradient background */}
      <div className="app-bg" />

      {/* Subtle grid overlay */}
      <div className="bg-grid" />

      {/* Floating coin decorations */}
      {COINS.map((coin, i) => (
        <div
          key={i}
          className="floating-coin"
          style={{
            left: coin.left,
            bottom: coin.bottom,
            animationDelay: coin.delay,
            animationDuration: coin.duration,
          }}
        >
          $
        </div>
      ))}

      {/* Main app content */}
      <div style={appContainerStyle}>
        {children}
      </div>

      {/* Onboarding overlay for users who haven't completed onboarding */}
      {showOnboarding && (
        <OnboardingOverlay onComplete={() => setOnboardingDismissed(true)} />
      )}
    </>
  );
}
