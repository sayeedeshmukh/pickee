import { useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import GuestNameModal from './GuestNameModal';

const SPLASH_MS = 3000;
const FADE_MS = 800;
/** Start crossfade slightly before the logo animation finishes */
const FADE_START_MS = SPLASH_MS - 500;

function StartupSplash({ exiting }) {
  return (
    <div className="flex flex-col items-center justify-center px-4 flex-1">
      <div className="w-full max-w-md text-center">
        <div className="orica-splash-logo select-none">
          <span className={`orica-splash-word${exiting ? ' orica-splash-word--exit' : ''}`}>ORICA</span>
        </div>
        <div
          className={`mt-5 text-white/70 text-xs sm:text-sm tracking-wide orica-splash-tagline${exiting ? ' orica-splash-tagline--exit' : ''}`}
        >
          Smarter decisions, simplified.
        </div>
      </div>
    </div>
  );
}

export default function StartupExperience({ children }) {
  const { token, guestName } = useAuth();
  const [appVisible, setAppVisible] = useState(false);
  const [splashMounted, setSplashMounted] = useState(true);
  const [splashExiting, setSplashExiting] = useState(false);

  useEffect(() => {
    const fadeStartId = setTimeout(() => {
      setSplashExiting(true);
      setAppVisible(true);
    }, FADE_START_MS);

    const splashEndId = setTimeout(() => {
      setSplashMounted(false);
    }, FADE_START_MS + FADE_MS);

    return () => {
      clearTimeout(fadeStartId);
      clearTimeout(splashEndId);
    };
  }, []);

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className={`orica-app-enter${appVisible ? ' orica-app-enter--visible' : ''}`}>
        {children}
      </div>

      {splashMounted && (
        <div
          className={`orica-splash-overlay${splashExiting ? ' orica-splash-overlay--exit' : ''}`}
          aria-hidden={splashExiting}
        >
          <StartupSplash exiting={splashExiting} />
        </div>
      )}

      {!splashMounted && !token && !guestName ? <GuestNameModal /> : null}
    </div>
  );
}

