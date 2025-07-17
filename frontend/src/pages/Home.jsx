import { useNavigate } from 'react-router-dom';
import { useAuth } from '../components/AuthContext';
import Header from '../components/Header';

export default function Home() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <Header />

      {/* Hero Section */}
      <main className="relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            {/* Main Heading */}
            <div className="mb-8">
              <h1 className="text-6xl md:text-8xl font-bold mb-4" style={{ color: '#fff6e4' }}>
                <span className="font-limelight">This is</span>{' '}
                <span className="font-limelight" style={{ color: '#e98198' }}>
                  Orica
                </span>
              </h1>
            </div>

            {/* Subtitle */}
            <div className="mb-12 max-w-4xl mx-auto">
              <p className="text-2xl md:text-3xl leading-relaxed" style={{ color: '#fff6e4' }}>
                Make better choices. With{' '}
                <span className="font-semibold" style={{ color: '#5de7ff' }}>
                  AI + You
                </span>
                <br />
                Before you flip a coin (again),
                <br />
                Pros, cons, emotions, logic — all in one place.
                <br />
                Let your{' '}
                <span className="font-semibold" style={{ color: '#5de7ff' }}>
                  brain
                </span>{' '}
                AND your{' '}
                <span className="font-semibold" style={{ color: '#5de7ff' }}>
                  gut
                </span>{' '}
                weigh in.
              </p>
              <p className="text-4xl font-bold mt-4 transform -rotate-12 font-barrio" style={{ color: '#e98198' }}>
                Cool, right?
              </p>
            </div>

            {/* CTA Button */}
            <div className="mb-16">
              <button
                onClick={() => navigate('/decisions/create')}
                className="px-12 py-6 bg-gradient-to-r from-pink-500 to-purple-600 text-white text-xl font-bold rounded-full hover:from-pink-600 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 shadow-2xl hover:shadow-pink-500/25"
              >
                Start Deciding Now
              </button>
            </div>

            {/* Feature Box */}
            <div className="max-w-4xl mx-auto">
              <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 shadow-2xl">
                <div className="text-center mb-6">
                  <p className="text-2xl font-bold text-white mb-4">MORE THAN JUST A TOOL</p>
                  <p className="text-lg leading-relaxed" style={{ color: '#fff6e4' }}>
                    We're here to make decisions feel less scary
                    <br />
                    and more you-shaped.
                    <br />
                    <span className="font-semibold" style={{ color: '#5de7ff' }}>
                      No pressure
                    </span>
                    .{' '}
                    <span className="font-semibold" style={{ color: '#5de7ff' }}>
                      No judgment
                    </span>
                    . Just{' '}
                    <span className="font-semibold" style={{ color: '#5de7ff' }}>
                      better clarity
                    </span>
                    .
                  </p>
                </div>
                
              </div>
            </div>
          </div>
        </div>

        {/* Background Elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-pink-500/20 rounded-full blur-xl"></div>
        <div className="absolute top-40 right-20 w-32 h-32 bg-purple-500/20 rounded-full blur-xl"></div>
        <div className="absolute bottom-20 left-1/4 w-24 h-24 bg-cyan-500/20 rounded-full blur-xl"></div>
        <div className="absolute bottom-40 right-1/3 w-16 h-16 bg-blue-500/20 rounded-full blur-xl"></div>
      </main>

      {/* Footer */}
      <footer className="bg-black/20 border-t border-white/10 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-400">
            © 2024 Orica. Making decisions easier, one choice at a time.
          </p>
        </div>
      </footer>
    </div>
  );
}