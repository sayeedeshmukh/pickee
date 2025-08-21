import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <Header />

      {/* Hero Section */}
      <main className="relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
          <div className="text-center">
            {/* Main Heading */}
            <div className="mb-6 sm:mb-8">
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold mb-3 sm:mb-4" style={{ color: '#fff7e4' }}>
                <span className="font-limelight">This is</span>{' '}
                <span className="font-limelight" style={{ color: '#e98198' }}>
                  Orica
                </span>
              </h1>
            </div>

            {/* Subtitle */}
            <div className="mb-8 sm:mb-12 max-w-3xl sm:max-w-4xl mx-auto px-4">
              <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl leading-relaxed" style={{ color: '#fff7e4' }}>
                Make better choices. With{' '}
                <span className="font-semibold" style={{ color: '#5de7ff' }}>
                  AI + You
                </span>
                <br className="hidden sm:block" />
                <span className="sm:hidden"> </span>
                Before you flip a coin (again),
                <br className="hidden sm:block" />
                <span className="sm:hidden"> </span>
                Pros, cons, emotions, logic — all in one place.
                <br className="hidden sm:block" />
                <span className="sm:hidden"> </span>
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
              <p className="text-2xl sm:text-3xl md:text-4xl font-bold mt-3 sm:mt-4 transform -rotate-12 font-barrio" style={{ color: '#e98198' }}>
                Cool, right?
              </p>
            </div>

            {/* CTA Button */}
            <div className="mb-12 sm:mb-16">
              <button
                onClick={() => navigate('/decisions/create')}
                className="px-8 sm:px-10 md:px-12 py-4 sm:py-5 md:py-6 text-white text-lg sm:text-xl font-bold rounded-full transform hover:scale-105 transition-all duration-300 shadow-2xl"
                style={{backgroundColor:'#fff7e4',color:'#1c2838'}}
              >
                Start Deciding Now
              </button>
            </div>

            {/* Feature Box */}
            <div className="max-w-3xl sm:max-w-4xl mx-auto px-4">
              <div className="bg-white/10 backdrop-blur-md rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-white/20 shadow-2xl">
                <div className="text-center mb-4 sm:mb-6">
                  <p className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-3 sm:mb-4">MORE THAN JUST A TOOL</p>
                  <p className="text-sm sm:text-base md:text-lg leading-relaxed" style={{ color: '#fff7e4' }}>
                    We're here to make decisions feel less scary
                    <br className="hidden sm:block" />
                    <span className="sm:hidden"> </span>
                    and more you-shaped.
                    <br className="hidden sm:block" />
                    <span className="sm:hidden"> </span>
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
        <div className="absolute top-16 sm:top-20 left-4 sm:left-10 w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 bg-pink-500/20 rounded-full blur-xl"></div>
        <div className="absolute top-32 sm:top-40 right-4 sm:right-20 w-16 h-16 sm:w-24 sm:h-24 md:w-32 md:h-32 bg-purple-500/20 rounded-full blur-xl"></div>
        <div className="absolute bottom-16 sm:bottom-20 left-1/4 w-12 h-12 sm:w-16 sm:h-16 md:w-24 md:h-24 bg-cyan-500/20 rounded-full blur-xl"></div>
        <div className="absolute bottom-32 sm:bottom-40 right-1/3 w-8 h-8 sm:w-12 sm:h-12 md:w-16 md:h-16 bg-blue-500/20 rounded-full blur-xl"></div>
      </main>

      {/* Footer */}
      <footer className="bg-black/20 border-t border-white/10 py-6 sm:py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm sm:text-base text-gray-400">
            © 2024 Orica. Making decisions easier, one choice at a time.
          </p>
        </div>
      </footer>
    </div>
  );
}