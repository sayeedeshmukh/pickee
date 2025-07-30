import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { useState } from 'react';

export default function Header() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="bg-gray-900/90 backdrop-blur-md border-b border-white/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="text-3xl font-bold" style={{ color: '#e98198', fontFamily: 'Limelight, cursive' }}>
            <span className='font-limelight' style={{ color: '#fff6e4' }}>orica</span>
          </div>
          {/* Hamburger for mobile */}
          <div className="sm:hidden flex items-center">
            <button
              className="text-3xl text-white focus:outline-none"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle navigation menu"
            >
              ☰
            </button>
          </div>
          {/* Desktop menu */}
          <div className="hidden sm:flex space-x-8 items-center">
            <a href="/" className="font-semibold" style={{ color: '#fff6e4' }}>
              home
            </a>
            <a href="/about" className="font-semibold" style={{ color: '#fff6e4' }}>
              about us
            </a>
            {user ? (
              <>
                <button
                  className="w-10 h-10 rounded-full flex items-center justify-center text-2xl font-bold border-2 shadow hover:scale-105 transition-transform"
                  title="Profile"
                  style={{ background: '#5de7ff', color: '#fff6e4', borderColor: '#e98198' }}
                  onClick={() => navigate('/profile')}
                >
                  <span role="img" aria-label="profile">👤</span>
                </button>
                <button
                  className="ml-4 px-4 py-2 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                  style={{ background: '#fff6e4', color: '#e98198' }}
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
                  style={{ background: '#e98198', color: '#fff6e4' }}
                  onClick={() => navigate('/signup')}
                >
                  Sign Up
                </button>
              </>
            )}
          </div>
        </div>
        {/* Mobile menu */}
        {menuOpen && (
          <div className="sm:hidden flex flex-col space-y-4 mt-2 pb-4 animate-fade-in">
            <a href="/" className="font-semibold" style={{ color: '#fff6e4' }} onClick={() => setMenuOpen(false)}>
              home
            </a>
            <a href="/about" className="font-semibold" style={{ color: '#fff6e4' }} onClick={() => setMenuOpen(false)}>
              about us
            </a>
            {user ? (
              <>
                <button
                  className="w-10 h-10 rounded-full flex items-center justify-center text-2xl font-bold border-2 shadow hover:scale-105 transition-transform"
                  title="Profile"
                  style={{ background: '#5de7ff', color: '#fff6e4', borderColor: '#e98198' }}
                  onClick={() => { setMenuOpen(false); navigate('/profile'); }}
                >
                  <span role="img" aria-label="profile">👤</span>
                </button>
                <button
                  className="px-4 py-2 rounded-lg font-medium hover:bg-gray-300 transition-colors mt-2"
                  style={{ background: '#fff6e4', color: '#e98198' }}
                  onClick={() => { setMenuOpen(false); logout(); }}
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <button
                  className="px-4 py-2 rounded-lg font-medium transition-colors hover:bg-cyan-400 mt-2"
                  style={{ background: '#5de7ff', color: '#1c2838' }}
                  onClick={() => { setMenuOpen(false); navigate('/login'); }}
                >
                  Login
                </button>
                <button
                  className="px-4 py-2 rounded-lg font-medium hover:bg-pink-600 transition-colors mt-2"
                  style={{ background: '#e98198', color: '#fff6e4' }}
                  onClick={() => { setMenuOpen(false); navigate('/signup'); }}
                >
                  Sign Up
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
} 