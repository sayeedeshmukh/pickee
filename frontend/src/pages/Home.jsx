import { useNavigate } from 'react-router-dom';

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Navigation */}
      <nav className="bg-white/10 backdrop-blur-md border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="text-3xl font-bold text-white">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400">
                orica
              </span>
            </div>
            <div className="flex space-x-8">
              <a href="/" className="text-white hover:text-pink-300 transition-colors font-medium">
                home
              </a>
              <a href="#about" className="text-white hover:text-pink-300 transition-colors font-medium">
                about us
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            {/* Main Heading */}
            <div className="mb-8">
              <h1 className="text-6xl md:text-8xl font-bold text-white mb-4">
                This is{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400">
                  Orica
                </span>
              </h1>
            </div>

            {/* Subtitle */}
            <div className="mb-12 max-w-4xl mx-auto">
              <p className="text-2xl md:text-3xl text-gray-300 leading-relaxed">
                Make better choices. With{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400 font-semibold">
                  AI + You
                </span>
                <br />
                Before you flip a coin (again),
                <br />
                Pros, cons, emotions, logic — all in one place.
                <br />
                Let your{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400 font-semibold">
                  brain
                </span>{' '}
                AND your{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400 font-semibold">
                  gut
                </span>{' '}
                weigh in.
              </p>
              <p className="text-4xl font-bold text-pink-400 mt-4 transform -rotate-12">
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
                  <p className="text-lg text-gray-300 leading-relaxed">
                    We're here to make decisions feel less scary
                    <br />
                    and more you-shaped.
                    <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400 font-semibold">
                      No pressure
                    </span>
                    .{' '}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400 font-semibold">
                      No judgment
                    </span>
                    . Just{' '}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400 font-semibold">
                      better clarity
                    </span>
                    .
                  </p>
                </div>
                
                {/* Feature Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                  <div className="text-center p-6 bg-white/5 rounded-xl border border-white/10">
                    <div className="text-4xl mb-4">🤖</div>
                    <h3 className="text-xl font-semibold text-white mb-2">AI-Powered Insights</h3>
                    <p className="text-gray-300">Get intelligent pros and cons generated by advanced AI</p>
                  </div>
                  
                  <div className="text-center p-6 bg-white/5 rounded-xl border border-white/10">
                    <div className="text-4xl mb-4">⚖️</div>
                    <h3 className="text-xl font-semibold text-white mb-2">Smart Analysis</h3>
                    <p className="text-gray-300">Rate importance and get personalized recommendations</p>
                  </div>
                  
                  <div className="text-center p-6 bg-white/5 rounded-xl border border-white/10">
                    <div className="text-4xl mb-4">🎯</div>
                    <h3 className="text-xl font-semibold text-white mb-2">Clear Decisions</h3>
                    <p className="text-gray-300">Make confident choices with comprehensive analysis</p>
                  </div>
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