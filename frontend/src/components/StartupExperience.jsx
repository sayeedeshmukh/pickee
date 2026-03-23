import { useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import GuestNameModal from './GuestNameModal';

const LOADING_MS = 5000;
const INTRO_SHOWN_KEY = 'orica_intro_shown_v1';

function StartupLoader({ progress }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-md text-center">
        <div className="flex items-center justify-center gap-4 mb-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500" />
        </div>

        <div className="bg-white/10 border border-white/20 rounded-full h-3 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-pink-500 to-cyan-400"
            style={{ width: `${progress}%`, transition: 'width 80ms linear' }}
          />
        </div>
        <div className="mt-4 text-white/80 text-sm sm:text-base">{progress}%</div>
        <div className="mt-2 text-white/60 text-xs sm:text-sm">Choices don't have to be hard.</div>
      </div>
    </div>
  );
}

export default function StartupExperience({ children }) {
  const { token, guestName } = useAuth();
  const [loadingDone, setLoadingDone] = useState(false);
  const [progress, setProgress] = useState(0);

  const [shouldAnimateIntro, setShouldAnimateIntro] = useState(false);
  const [introActive, setIntroActive] = useState(false);

  useEffect(() => {
    // Exactly 5 seconds: drive the progress UI via rAF, and swap views via timeout.
    const start = performance.now();
    let rafId = 0;

    const tick = () => {
      const elapsed = performance.now() - start;
      const pct = Math.min(100, Math.round((elapsed / LOADING_MS) * 100));
      setProgress(pct);

      if (elapsed < LOADING_MS) rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    const timeoutId = setTimeout(() => setLoadingDone(true), LOADING_MS);

    return () => {
      cancelAnimationFrame(rafId);
      clearTimeout(timeoutId);
    };
  }, []);

  useEffect(() => {
    try {
      const alreadyShown = localStorage.getItem(INTRO_SHOWN_KEY);
      if (!alreadyShown) {
        localStorage.setItem(INTRO_SHOWN_KEY, '1');
        setShouldAnimateIntro(true);
      }
    } catch {
      // If storage is blocked, just skip the one-time intro animation.
    }
  }, []);

  useEffect(() => {
    if (!loadingDone || !shouldAnimateIntro) return;
    // Small delay so the intro animation triggers after the loader view unmounts.
    const id = setTimeout(() => setIntroActive(true), 50);
    return () => clearTimeout(id);
  }, [loadingDone, shouldAnimateIntro]);

  if (!loadingDone) {
    return <StartupLoader progress={progress} />;
  }

  return (
    <div className={introActive ? 'orica-intro-animate' : ''}>
      {!token && !guestName ? <GuestNameModal /> : null}
      {children}
    </div>
  );
}

