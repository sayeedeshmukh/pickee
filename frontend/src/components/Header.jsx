import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { useState } from 'react';

export default function Header() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="bg-gray-900/90 backdrop-blur-md border-b border-white/20 relative z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="text-3xl font-bold" style={{ color: '#e98198', fontFamily: 'Limelight, cursive' }}>
            <span className='font-limelight' style={{ color: '#fff7e4' }}>orica</span>
          </div>
          {/* Hamburger for mobile */}
          <div className="sm:hidden flex items-center">
            <button
              className="text-3xl text-white focus:outline-none z-50"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle navigation menu"
            >
              ☰
            </button>
          </div>
          {/* Desktop menu */}
          <div className="hidden sm:flex space-x-8 items-center">
            <a href="/" className="font-semibold" style={{ color: '#fff7e4' }}>
              home
            </a>
            <a href="/about" className="font-semibold" style={{ color: '#fff7e4' }}>
              about us
            </a>
            {user ? (
              <>
                <button
                  className="w-10 h-10 rounded-full flex items-center justify-center text-2xl font-bold border-2 shadow hover:scale-105 transition-transform"
                  title="Profile"
                  style={{ background: '#5de7ff', color: '#fff7e4', borderColor: '#e98198' }}
                  onClick={() => navigate('/profile')}
                >
                  <span role="img" aria-label="profile">👤</span>
                </button>
                <button
                  className="ml-4 px-4 py-2 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                  style={{ background: '#fff7e4', color: '#e98198' }}
                  onClick={logout}
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <button
                  className="ml-4 px-4 py-2 rounded-lg font-medium transition-colors hover:bg-cyan-400"
                  style={{ background: '#5de7ff', color: '#1c2838' }}
                  onClick={() => navigate('/login')}
                >
                  Login
                </button>
                <button
                  className="ml-4 px-4 py-2 rounded-lg font-medium hover:bg-pink-600 transition-colors"
                  style={{ background: '#e98198', color: '#fff7e4' }}
                  onClick={() => navigate('/signup')}
                >
                  Sign Up
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mobile menu overlay */}
      {menuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 sm:hidden"
          onClick={() => setMenuOpen(false)}
        ></div>
      )}

      {/* Mobile menu slide-in from right */}
      <div className={`fixed top-0 right-0 h-full w-64 bg-gray-900/95 backdrop-blur-md border-l border-white/20 transform transition-transform duration-300 ease-in-out z-50 sm:hidden ${
        menuOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        <div className="flex flex-col h-full">
          {/* Close button */}
          <div className="flex justify-end p-4">
            <button
              className="text-2xl text-white hover:text-gray-300 transition-colors"
              onClick={() => setMenuOpen(false)}
              aria-label="Close menu"
            >
              ✕
            </button>
          </div>

          {/* Menu items */}
          <div className="flex flex-col flex-1 px-6 py-4 space-y-6">
            <a 
              href="/" 
              className="text-xl font-semibold py-3 border-b border-white/10 transition-colors hover:text-cyan-400" 
              style={{ color: '#fff7e4' }} 
              onClick={() => setMenuOpen(false)}
            >
              home
            </a>
            <a 
              href="/about" 
              className="text-xl font-semibold py-3 border-b border-white/10 transition-colors hover:text-cyan-400" 
              style={{ color: '#fff7e4' }} 
              onClick={() => setMenuOpen(false)}
            >
              about us
            </a>
            
            {/* Auth buttons */}
            <div className="mt-auto space-y-4">
              {user ? (
                <>
                  <button
                    className="w-full flex items-center justify-center space-x-3 py-3 px-4 rounded-lg font-medium transition-colors"
                    style={{ background: '#5de7ff', color: '#1c2838' }}
                    onClick={() => { setMenuOpen(false); navigate('/profile'); }}
                  >
                    <span role="img" aria-label="profile">👤</span>
                    <span>Profile</span>
                  </button>
                  <button
                    className="w-full py-3 px-4 rounded-lg font-medium transition-colors"
                    style={{ background: '#fff7e4', color: '#e98198' }}
                    onClick={() => { setMenuOpen(false); logout(); }}
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <button
                    className="w-full py-3 px-4 rounded-lg font-medium transition-colors"
                    style={{ background: '#5de7ff', color: '#1c2838' }}
                    onClick={() => { setMenuOpen(false); navigate('/login'); }}
                  >
                    Login
                  </button>
                  <button
                    className="w-full py-3 px-4 rounded-lg font-medium transition-colors"
                    style={{ background: '#e98198', color: '#fff7e4' }}
                    onClick={() => { setMenuOpen(false); navigate('/signup'); }}
                  >
                    Sign Up
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
} 