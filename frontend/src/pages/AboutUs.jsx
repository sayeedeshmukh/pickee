import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';

const SKILLS = ['React', 'MERN', 'UI/UX', 'Figma', 'Frontend'];

export default function AboutUs() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#1c2838]">
      <Header />

      <main className="max-w-3xl mx-auto px-6 py-16 md:py-24">
        <p className="text-sm uppercase tracking-[0.2em] mb-4" style={{ color: '#5de7ff' }}>
          About
        </p>
        <h1 className="text-4xl md:text-5xl font-bold mb-6 font-['Limelight']" style={{ color: '#fff7e4' }}>
          Orica
        </h1>
        <p className="text-lg md:text-xl leading-relaxed mb-12 opacity-90" style={{ color: '#fff7e4' }}>
          A decision companion that weighs what you care about — not just spreadsheets. Pros add clarity;
          cons pull you back. Your mindset matters as much as the math.
        </p>

        <section className="border-t border-white/10 pt-12 mb-12">
          <h2 className="text-2xl font-semibold mb-4" style={{ color: '#fff7e4' }}>
            Built by
          </h2>
          <p className="text-3xl font-bold mb-2" style={{ color: '#e98198' }}>
            Sayee Deshmukh
          </p>
          <p className="text-lg mb-6 opacity-85" style={{ color: '#fff7e4' }}>
            B.Tech AIML student — designing and building products at the intersection of logic and feeling.
          </p>
          <div className="flex flex-wrap gap-2">
            {SKILLS.map((skill) => (
              <span
                key={skill}
                className="px-4 py-1.5 rounded-full text-sm border border-white/15"
                style={{ color: '#fff7e4', backgroundColor: 'rgba(255,255,255,0.05)' }}
              >
                {skill}
              </span>
            ))}
          </div>
        </section>

        <section className="border-t border-white/10 pt-12 mb-16">
          <h2 className="text-2xl font-semibold mb-4" style={{ color: '#fff7e4' }}>
            Why I made this
          </h2>
          <p className="text-lg leading-relaxed opacity-90" style={{ color: '#fff7e4' }}>
            I used to overthink every choice — listing pros and cons, asking everyone, and still feeling stuck.
            Orica is the tool I wished existed: compare options honestly, rate what actually matters, reflect on
            fear and values, and get a summary that respects both your head and your heart.
          </p>
        </section>

        <button
          onClick={() => navigate('/decisions/create')}
          className="w-full sm:w-auto px-10 py-4 rounded-full font-bold text-lg transition hover:scale-[1.02]"
          style={{ backgroundColor: '#5de7ff', color: '#1c2838' }}
        >
          Start a decision
        </button>
      </main>

      <footer className="border-t border-white/10 py-8 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} Orica
      </footer>
    </div>
  );
}
