import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';

export default function AboutUs() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <Header />

      {/* Main Content */}
      <main className="relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            {/* Main Heading */}
            <div className="mb-12">
              <h1 className="text-6xl md:text-8xl font-bold mb-4" style={{ color: '#fff6e4' }}>
                <span className="font-limelight">About</span>{' '}
                <span className="font-limelight" style={{ color: '#e98198' }}>
                  Orica
                </span>
              </h1>
            </div>

            {/* Mission Statement */}
            <div className="mb-16 max-w-4xl mx-auto">
              <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 shadow-2xl mb-8">
                <h2 className="text-3xl font-bold mb-6" style={{ color: '#5de7ff' }}>
                  Our Mission
                </h2>
                <p className="text-xl leading-relaxed" style={{ color: '#fff6e4' }}>
                  We believe that every decision matters, and every person deserves to make choices with{' '}
                  <span className="font-semibold" style={{ color: '#5de7ff' }}>
                    confidence
                  </span>{' '}
                  and{' '}
                  <span className="font-semibold" style={{ color: '#5de7ff' }}>
                    clarity
                  </span>
                  . Orica combines the power of AI with human intuition to help you navigate life's toughest decisions.
                </p>
              </div>
            </div>

            {/* What We Do */}
            <div className="mb-16 max-w-6xl mx-auto">
              <div className="grid md:grid-cols-3 gap-8">
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-xl">
                  <div className="text-4xl mb-4">🤔</div>
                  <h3 className="text-2xl font-bold mb-4" style={{ color: '#5de7ff' }}>
                    Break Down Decisions
                  </h3>
                  <p className="text-lg" style={{ color: '#fff6e4' }}>
                    Transform complex choices into clear pros and cons, helping you see all angles of your decision.
                  </p>
                </div>
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-xl">
                  <div className="text-4xl mb-4">🧠</div>
                  <h3 className="text-2xl font-bold mb-4" style={{ color: '#5de7ff' }}>
                    AI-Powered Analysis
                  </h3>
                  <p className="text-lg" style={{ color: '#fff6e4' }}>
                    Our intelligent system analyzes your inputs and provides insights to guide your decision-making process.
                  </p>
                </div>
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-xl">
                  <div className="text-4xl mb-4">💡</div>
                  <h3 className="text-2xl font-bold mb-4" style={{ color: '#5de7ff' }}>
                    Personal Growth
                  </h3>
                  <p className="text-lg" style={{ color: '#fff6e4' }}>
                    Learn from your decisions and develop better judgment over time with our comprehensive analysis.
                  </p>
                </div>
              </div>
            </div>

            {/* Our Story */}
            <div className="mb-16 max-w-4xl mx-auto">
              <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 shadow-2xl">
                <h2 className="text-3xl font-bold mb-6" style={{ color: '#5de7ff' }}>
                  How Orica Started
                </h2> 
                <p className="text-lg leading-relaxed mb-6" style={{ color: '#fff6e4' }}>
                  I've always struggled with decisions — big or small. I'd overthink, list pros and cons, ask friends… and still feel unsure. That's when I thought — what if there was a tool that could help me figure things out clearly, without the confusion?
                </p>
                <p className="text-lg leading-relaxed" style={{ color: '#fff6e4' }}>
                  So I built <span className="font-semibold" style={{ color: '#5de7ff' }}>Orica</span> — a decision-making buddy that not only compares your options but also understands how you think. It mixes your input with a little AI magic to help you choose better.I've designed and developed Orica myself, and it's something super close to my heart. Can't wait to share it with the world soon!
                </p>
              </div>
            </div>

            {/* Values */}
            <div className="mb-16 max-w-6xl mx-auto">
              <h2 className="text-4xl font-bold mb-12" style={{ color: '#fff6e4' }}>
                Our Values
              </h2>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-xl">
                  <h3 className="text-2xl font-bold mb-4" style={{ color: '#e98198' }}>
                    Transparency
                  </h3>
                  <p className="text-lg" style={{ color: '#fff6e4' }}>
                    We believe in clear, honest communication. Our AI explains its reasoning, and we're upfront about how our system works.
                  </p>
                </div>
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-xl">
                  <h3 className="text-2xl font-bold mb-4" style={{ color: '#e98198' }}>
                    Empowerment
                  </h3>
                  <p className="text-lg" style={{ color: '#fff6e4' }}>
                    We don't make decisions for you. We give you the tools and insights to make better decisions for yourself.
                  </p>
                </div>
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-xl">
                  <h3 className="text-2xl font-bold mb-4" style={{ color: '#e98198' }}>
                    Growth
                  </h3>
                  <p className="text-lg" style={{ color: '#fff6e4' }}>
                    Every decision is a learning opportunity. We help you reflect on your choices and improve your decision-making skills.
                  </p>
                </div>
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-xl">
                  <h3 className="text-2xl font-bold mb-4" style={{ color: '#e98198' }}>
                    Accessibility
                  </h3>
                  <p className="text-lg" style={{ color: '#fff6e4' }}>
                    Good decision-making tools should be available to everyone. We're committed to keeping Orica simple and accessible.
                  </p>
                </div>
              </div>
            </div>

            {/* CTA Section */}
            <div className="mb-16 max-w-4xl mx-auto">
              <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 shadow-2xl">
                <h2 className="text-3xl font-bold mb-6" style={{ color: '#5de7ff' }}>
                  Ready to Start?
                </h2>
                <p className="text-xl mb-8" style={{ color: '#fff6e4' }}>
                  Join thousands of people who are making better decisions with Orica.
                </p>
                <button
                  onClick={() => navigate('/decisions/create')}
                  className="px-12 py-6 text-white text-xl font-bold rounded-full transform hover:scale-105 transition-all duration-300 shadow-2xl"
                  style={{backgroundColor:'#fff6e4',color:'#1c2838'}}
                >
                  Start Your First Decision
                </button>
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
            © 2025 Orica. Making decisions easier, one choice at a time.
          </p>
        </div>
      </footer>
    </div>
  );
} 