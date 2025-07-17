import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

export default function Header() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  return (
    <nav className="bg-white/10 backdrop-blur-md border-b border-white/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="text-3xl font-bold" style={{ color: '#e98198', fontFamily: 'Limelight, cursive' }}>
            <span className='font-limelight' style={{ color: '#fff6e4' }}>orica</span>
          </div>
          <div className="flex space-x-8 items-center">
            <a href="/" className="font-semibold" style={{ color: '#fff6e4' }}>
              home
            </a>
            <a href="#about" className="font-semibold" style={{ color: '#fff6e4' }}>
              about us
            </a>
            {user ? (
              <>
                {/* Profile Icon */}
                <button
                  className="w-10 h-10 rounded-full flex items-center justify-center text-2xl font-bold border-2 shadow hover:scale-105 transition-transform"
                  title="Profile"
                  style={{ background: '#5de7ff', color: '#fff6e4', borderColor: '#e98198' }}
                  onClick={() => alert('Profile feature coming soon!')}
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
                  className="ml-4 px-4 py-2 rounded-lg font-medium hover:bg-purple-600 transition-colors"
                  style={{ background: '#5de7ff', color: '#fff6e4' }}
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
      </div>
    </nav>
  );
} 