import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getDecision, getDecisionAnalysis, getGeminiSummary, submitStillNotSure, getStillNotSure } from '../services/api';
import { toast } from 'react-hot-toast';
import Header from '../components/Header';
import { requireClearText, UNCLEAR_INPUT_MESSAGE } from '../utils/inputValidation';

export default function Results() {
  const { id: decisionId } = useParams();
  const navigate = useNavigate();
  const [decision, setDecision] = useState(null);
  const [analysis, setAnalysis] = useState(null); 
  const [geminiAnalysis, setGeminiAnalysis] = useState(null); 
  const [loading, setLoading] = useState(true);
  const [loadingGeminiAnalysis, setLoadingGeminiAnalysis] = useState(false); 
  const aiAnalysisRef = useRef(null);
  const isTie = !!(analysis && analysis.scores && analysis.scores.optionA === analysis.scores.optionB);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [decisionRes, analysisRes] = await Promise.all([
          getDecision(decisionId),
          getDecisionAnalysis(decisionId), 
        ]);
        setDecision(decisionRes.data);
        setAnalysis(analysisRes.data);
      } catch (error) {
        console.error('Failed to load initial results:', error);
        toast.error('Failed to load results data.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [decisionId]);

  useEffect(() => {
    if (geminiAnalysis && aiAnalysisRef.current) {
      aiAnalysisRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [geminiAnalysis]);

  const generateGeminiSummary = async () => {
    setLoadingGeminiAnalysis(true);
    try {
      const summaryRes = await getGeminiSummary(decisionId);
      const isFallback =
        summaryRes?.recommendedOption === 'No recommendation available' ||
        summaryRes?.summary === 'AI analysis could not be generated at this time.';
      if (isFallback) {
        toast.error('AI analysis could not be generated. Check backend logs and try again.');
        return;
      }
      setGeminiAnalysis(summaryRes);
      toast.success('AI analysis generated successfully!');
    } catch (error) {
      console.error('Failed to generate Gemini analysis:', error);
      toast.error('Failed to generate AI analysis.');
    } finally {
      setLoadingGeminiAnalysis(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 mx-auto mb-4" style={{ borderColor: '#5de7ff' }}></div>
          <p className="text-xl" style={{ color: '#fff7e4' }}>Loading your decision results...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <Header />

      <main className="relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          {/* Header Section */}
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-7xl font-bold mb-6" style={{ color: '#fff7e4' }}>
              <span className="font-limelight">Your</span>{' '}
              <span className="font-limelight" style={{ color: '#e98198' }}>
                Results
              </span>
            </h1>
            <p className="text-xl md:text-2xl leading-relaxed" style={{ color: '#fff7e4' }}>
              Here's what we found for your decision
            </p>
          </div>

          {/* Tie Reminder */}
          {isTie && (
            <div className="mb-12 bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-xl">
              <p className="text-lg md:text-xl" style={{ color: '#fff7e4' }}>
                Both options are currently tied. Are you sure you rated the pros and cons according to your importance?
              </p>
              <div className="mt-4">
                <button
                  onClick={() => navigate(`/decisions/${decisionId}/rate`)}
                  className="px-6 py-3 text-sm md:text-base font-bold rounded-full transform hover:scale-105 transition-all"
                  style={{ backgroundColor: '#5de7ff', color: '#1c2838' }}
                >
                  Review Ratings
                </button>
              </div>
            </div>
          )}

          {/* AI Analysis Button */}
          <div className="mb-12 flex justify-center">
            <button
              onClick={generateGeminiSummary}
              disabled={loadingGeminiAnalysis}
              className="px-10 py-5 text-xl font-bold rounded-full transform hover:scale-105 transition-all duration-300 shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ backgroundColor: '#5de7ff', color: '#1c2838' }}
            >
              {loadingGeminiAnalysis ? (
                <div className="flex items-center space-x-3">
                  <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-current"></div>
                  <span>Generating AI Analysis...</span>
                </div>
              ) : (
                'Get AI Decision Analysis'
              )}
            </button>
          </div>

          {/* Decision Overview */}
          <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 mb-12 border border-white/20 shadow-2xl">
            <h2 className="text-4xl font-bold text-center mb-10" style={{ color: '#fff7e4' }}>{decision.title}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-gradient-to-br from-blue-500/20 to-indigo-500/20 p-8 rounded-2xl border border-blue-400/30 backdrop-blur-sm">
                <div className="text-center mb-6">
                  <div className="w-20 h-20 bg-blue-500 text-white rounded-full flex items-center justify-center text-3xl font-bold mx-auto mb-4 shadow-lg">
                    A
                  </div>
                  <h3 className="text-3xl font-semibold mb-3" style={{ color: '#fff7e4' }}>{decision.optionA.title}</h3>
                  {decision.optionA.description && (
                    <p className="text-lg" style={{ color: '#fff7e4' }}>{decision.optionA.description}</p>
                  )}
                </div>
                <div className="text-center">
                  <p className="text-5xl font-bold mb-2" style={{ color: '#5de7ff' }}>
                    {analysis?.scores?.optionA ?? 'N/A'}
                  </p>
                  <p className="text-lg" style={{ color: '#fff7e4' }}>Score</p>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 p-8 rounded-2xl border border-purple-400/30 backdrop-blur-sm">
                <div className="text-center mb-6">
                  <div className="w-20 h-20 bg-purple-500 text-white rounded-full flex items-center justify-center text-3xl font-bold mx-auto mb-4 shadow-lg">
                    B
                  </div>
                  <h3 className="text-3xl font-semibold mb-3" style={{ color: '#fff7e4' }}>{decision.optionB.title}</h3>
                  {decision.optionB.description && (
                    <p className="text-lg" style={{ color: '#fff7e4' }}>{decision.optionB.description}</p>
                  )}
                </div>
                <div className="text-center">
                  <p className="text-5xl font-bold mb-2" style={{ color: '#e98198' }}>
                    {analysis?.scores?.optionB ?? 'N/A'}
                  </p>
                  <p className="text-lg" style={{ color: '#fff7e4' }}>Score</p>
                </div>
              </div>
            </div>
          </div>

          {/* AI Analysis Results */}
          {geminiAnalysis && (
            <div
              ref={aiAnalysisRef}
              className="bg-white/10 backdrop-blur-md rounded-3xl p-8 mb-12 border border-white/20 shadow-2xl scroll-mt-8"
            >
              <div className="text-center mb-8">
                <h2 className="text-4xl font-bold mb-4" style={{ color: '#fff7e4' }}>AI Decision Analysis</h2>
                <p className="text-xl" style={{ color: '#fff7e4' }}>Powered by advanced AI insights</p>
              </div>
              
              <div className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 p-8 rounded-2xl mb-8 border border-purple-400/30">
                <div className="text-center">
                  <p className="text-2xl font-bold mb-3" style={{ color: '#fff7e4' }}>Recommended Option</p>
                  <p className="text-6xl font-bold" style={{ color: '#5de7ff' }}>{geminiAnalysis.recommendedOption}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                <div>
                  <h3 className="text-2xl font-semibold mb-4" style={{ color: '#fff7e4' }}>Summary</h3>
                  <p className="text-lg leading-relaxed" style={{ color: '#fff7e4' }}>{geminiAnalysis.summary}</p>
                </div>
                <div>
                  <h3 className="text-2xl font-semibold mb-4" style={{ color: '#fff7e4' }}>Why Choose This Option?</h3>
                  <div className="space-y-4">
                    {geminiAnalysis.reasons && geminiAnalysis.reasons.map((reason, index) => (
                      <div key={index} className="bg-white/5 p-4 rounded-xl border border-white/10">
                        <p className="text-lg leading-relaxed" style={{ color: '#fff7e4' }}>{reason}</p>
                      </div>
                    ))}
                    {!geminiAnalysis.reasons && (
                      <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                        <p className="text-lg leading-relaxed" style={{ color: '#fff7e4' }}>
                          Based on your ratings and the factors you've considered, this option appears to align best with your priorities and values. 
                          The analysis shows it scores higher in the areas that matter most to you.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* Still Not Sure? Section */}
          <StillNotSureSection decision={decision} decisionId={decisionId} />

          {/* Navigation */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-6 mt-16">
            <button
              onClick={() => navigate(`/decisions/${decisionId}/rate`)}
              className="px-8 py-4 text-lg font-medium transition-all duration-300 hover:scale-105"
              style={{ color: '#fff7e4' }}
            >
              Back to Rating
            </button>
            <button
              onClick={() => navigate('/')}
              className="px-12 py-4 text-xl font-bold rounded-full transform hover:scale-105 transition-all duration-300 shadow-2xl"
              style={{ backgroundColor: '#fff7e4', color: '#1c2838' }}
            >
              Start New Decision
            </button>
          </div>
        </div>

        {/* Background Elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-pink-500/20 rounded-full blur-xl"></div>
        <div className="absolute top-40 right-20 w-32 h-32 bg-purple-500/20 rounded-full blur-xl"></div>
        <div className="absolute bottom-20 left-1/4 w-24 h-24 bg-cyan-500/20 rounded-full blur-xl"></div>
        <div className="absolute bottom-40 right-1/3 w-16 h-16 bg-blue-500/20 rounded-full blur-xl"></div>
      </main>

      {/* Footer */}
      <footer className="bg-black/20 border-t border-white/10 py-8 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-400">
            © 2024 Orica. Making decisions easier, one choice at a time.
          </p>
        </div>
      </footer>
    </div>
  );
}

function StillNotSureSection({ decision, decisionId }) {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    feelings: '',
    missingInfo: '',
    confidence: '',
    helpNeeded: '',
    extra: '',
    userPreference: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [advice, setAdvice] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!decisionId) return;
    getStillNotSure(decisionId)
      .then((res) => {
        const data = res.data;
        if (!data?.advice) return;
        setForm({
          feelings: data.feelings || '',
          missingInfo: data.missingInfo || '',
          confidence: String(data.confidence ?? ''),
          helpNeeded: data.helpNeeded || '',
          extra: data.extra || '',
          userPreference: data.userPreference || '',
        });
        setAdvice(data.advice);
        setSubmitted(true);
      })
      .catch(() => {
        // No saved responses yet — expected on first visit
      });
  }, [decisionId]);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const okFeelings = requireClearText(form.feelings, {
      minChars: 5,
      onError: (msg) => toast.error(msg),
    });
    if (!okFeelings) return;

    const confidenceNum = Number(form.confidence);
    if (!Number.isFinite(confidenceNum) || confidenceNum < 1 || confidenceNum > 10) {
      toast.error(UNCLEAR_INPUT_MESSAGE);
      return;
    }

    if (!['A', 'B'].includes(form.userPreference)) {
      toast.error(UNCLEAR_INPUT_MESSAGE);
      return;
    }

    setSubmitting(true);
    try {
      const res = await submitStillNotSure(decisionId, {
        feelings: form.feelings.trim(),
        missingInfo: form.missingInfo.trim(),
        confidence: confidenceNum,
        helpNeeded: form.helpNeeded.trim(),
        extra: form.extra.trim(),
        userPreference: form.userPreference,
      });
      setAdvice(res.data.advice);
      setSubmitted(true);
      toast.success('Advice tailored to your answers!');
    } catch (error) {
      console.error('Still Not Sure submit error:', error);
      toast.error('Failed to get advice. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 mb-8 border border-white/20 shadow-2xl">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold mb-4" style={{ color: '#fff7e4' }}>Still Not Sure?</h2>
        <p className="text-xl leading-relaxed" style={{ color: '#fff7e4' }}>
          If you're still unsure, please tell us more. Your answers will help us understand your mindset and give you tailored advice!
        </p>
      </div>
      {!showForm && !submitted && (
        <div className="flex justify-center">
          <button
            className="px-8 py-4 text-xl font-bold rounded-full transform hover:scale-105 transition-all duration-300 shadow-2xl"
            style={{ backgroundColor: '#5de7ff', color: '#1c2838' }}
            onClick={() => setShowForm(true)}
          >
            I'm Still Not Sure
          </button>
        </div>
      )}
      {showForm && !submitted && (
        <form onSubmit={handleSubmit} className="max-w-2xl mx-auto mt-8 space-y-6">
          <div>
            <label className="block font-semibold mb-3 text-lg" style={{ color: '#fff7e4' }}>1. What are you feeling about this decision?</label>
                          <input
                type="text"
                name="feelings"
                value={form.feelings}
                onChange={handleChange}
                className="w-full rounded-xl border border-white/30 p-4 text-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 bg-white/10 backdrop-blur-sm"
                style={{ color: '#fff7e4' }}
                placeholder="e.g. anxious, excited, confused, etc."
              />
          </div>
          <div>
            <label className="block font-semibold mb-3 text-lg" style={{ color: '#fff7e4' }}>2. Is there any information you wish you had?</label>
                          <input
                type="text"
                name="missingInfo"
                value={form.missingInfo}
                onChange={handleChange}
                className="w-full rounded-xl border border-white/30 p-4 text-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 bg-white/10 backdrop-blur-sm"
                style={{ color: '#fff7e4' }}
                placeholder="e.g. more facts, advice from someone, etc."
              />
          </div>
          <div>
            <label className="block font-semibold mb-3 text-lg" style={{ color: '#fff7e4' }}>3. How confident do you feel about making a choice? (1-10)</label>
                          <input
                type="number"
                name="confidence"
                value={form.confidence}
                onChange={handleChange}
                className="w-full rounded-xl border border-white/30 p-4 text-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 bg-white/10 backdrop-blur-sm"
                style={{ color: '#fff7e4' }}
                placeholder="e.g. 5"
              />
          </div>
          <div>
            <label className="block font-semibold mb-3 text-lg" style={{ color: '#fff7e4' }}>4. What would help you feel more confident?</label>
                          <input
                type="text"
                name="helpNeeded"
                value={form.helpNeeded}
                onChange={handleChange}
                className="w-full rounded-xl border border-white/30 p-4 text-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 bg-white/10 backdrop-blur-sm"
                style={{ color: '#fff7e4' }}
                placeholder="e.g. talking to a friend, more research, etc."
              />
          </div>
          <div>
            <label className="block font-semibold mb-3 text-lg" style={{ color: '#fff7e4' }}>5. Anything else on your mind?</label>
                          <textarea
                name="extra"
                value={form.extra}
                onChange={handleChange}
                className="w-full rounded-xl border border-white/30 p-4 text-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 bg-white/10 backdrop-blur-sm"
                style={{ color: '#fff7e4' }}
                rows={3}
                placeholder="Share any other thoughts..."
              />
          </div>
          <div>
            <label className="block font-semibold mb-3 text-lg" style={{ color: '#fff7e4' }}>6. If you had to choose right now, which option would you lean towards?</label>
                          <select
                name="userPreference"
                value={form.userPreference}
                onChange={handleChange}
                className="w-full rounded-xl border border-white/30 p-4 text-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 bg-white/10 backdrop-blur-sm"
                style={{ color: '#fff7e4' }}
              >
                <option value="" style={{ backgroundColor: '#1c2838', color: '#fff7e4' }}>Select an option</option>
                <option value="A" style={{ backgroundColor: '#1c2838', color: '#fff7e4' }}>
                  Option A — {decision?.optionA?.title || 'A'}
                </option>
                <option value="B" style={{ backgroundColor: '#1c2838', color: '#fff7e4' }}>
                  Option B — {decision?.optionB?.title || 'B'}
                </option>
              </select>
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="mt-6 px-8 py-4 text-xl font-bold rounded-full transform hover:scale-105 transition-all duration-300 shadow-2xl disabled:opacity-50"
            style={{ backgroundColor: '#e98198', color: '#fff7e4' }}
          >
            {submitting ? 'Analyzing your answers...' : 'Submit'}
          </button>
        </form>
      )}
      {submitted && (
        <div className="mt-8 text-center">
          <h3 className="text-2xl font-semibold mb-4" style={{ color: '#5de7ff' }}>Here's some advice for you:</h3>
          <p className="text-lg leading-relaxed whitespace-pre-line" style={{ color: '#fff7e4' }}>{advice}</p>
        </div>
      )}
    </div>
  );
}