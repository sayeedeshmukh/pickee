import { useEffect, useState, useRef, useCallback } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import {
  getDecision,
  getDecisionAnalysis,
  getGeminiSummary,
  getMindset,
} from '../services/api';
import { toast } from 'react-hot-toast';
import Header from '../components/Header';
import MindsetForm from '../components/MindsetForm';
import { getDecisionDisplayTitle } from '../utils/inputValidation';

export default function Results() {
  const { id: decisionId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [decision, setDecision] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [geminiAnalysis, setGeminiAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingGeminiAnalysis, setLoadingGeminiAnalysis] = useState(false);
  const [showReflection, setShowReflection] = useState(false);
  const [hasReflection, setHasReflection] = useState(false);
  const aiAnalysisRef = useRef(null);
  const reflectionRef = useRef(null);
  const initialGeminiStarted = useRef(false);

  const isTie = !!(analysis?.scores && analysis.scores.optionA === analysis.scores.optionB);

  const loadGeminiSummary = useCallback(async () => {
    setLoadingGeminiAnalysis(true);
    try {
      const summaryRes = await getGeminiSummary(decisionId);
      if (!summaryRes?.summary) {
        toast.error('AI summary could not be generated. You can retry from deeper reflection.');
        return;
      }
      setGeminiAnalysis(summaryRes);
    } catch (error) {
      console.error('Failed to generate Gemini analysis:', error);
      toast.error('AI summary unavailable right now.');
    } finally {
      setLoadingGeminiAnalysis(false);
    }
  }, [decisionId]);

  const loadCoreResults = useCallback(
    async (includeMindset = false) => {
      const [decisionRes, analysisRes] = await Promise.all([
        getDecision(decisionId),
        getDecisionAnalysis(decisionId, { includeMindset }),
      ]);
      setDecision(decisionRes.data);
      setAnalysis(analysisRes.data);
    },
    [decisionId]
  );

  useEffect(() => {
    const init = async () => {
      try {
        setLoading(true);
        await loadCoreResults(false);
        try {
          await getMindset(decisionId);
          setHasReflection(true);
        } catch {
          setHasReflection(false);
        }
      } catch (error) {
        console.error('Failed to load results:', error);
        toast.error('Failed to load results data.');
      } finally {
        setLoading(false);
      }
    };
    init();
  }, [decisionId, loadCoreResults]);

  useEffect(() => {
    if (location.state?.openReflection) {
      setShowReflection(true);
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  useEffect(() => {
    if (loading || !analysis || initialGeminiStarted.current) return;
    initialGeminiStarted.current = true;
    loadGeminiSummary();
  }, [loading, analysis, loadGeminiSummary]);

  useEffect(() => {
    if (geminiAnalysis && aiAnalysisRef.current) {
      aiAnalysisRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [geminiAnalysis]);

  useEffect(() => {
    if (showReflection && reflectionRef.current) {
      reflectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [showReflection]);

  const handleReflectionComplete = async () => {
    setShowReflection(false);
    setHasReflection(true);
    try {
      await loadCoreResults(true);
      await loadGeminiSummary();
      toast.success('Analysis updated with your reflection.');
    } catch (error) {
      console.error('Refresh after reflection:', error);
      toast.error('Reflection saved, but refresh failed. Reload the page.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div
            className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 mx-auto mb-4"
            style={{ borderColor: '#5de7ff' }}
          />
          <p className="text-xl" style={{ color: '#fff7e4' }}>
            Building your analysis…
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <Header />

      <main className="relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center mb-12">
            <h1 className="text-5xl md:text-7xl font-bold mb-6" style={{ color: '#fff7e4' }}>
              <span className="font-limelight">Your</span>{' '}
              <span className="font-limelight" style={{ color: '#e98198' }}>
                Results
              </span>
            </h1>
            <p className="text-xl md:text-2xl leading-relaxed opacity-90" style={{ color: '#fff7e4' }}>
              Each star = 1 point · pros add, cons subtract
            </p>
          </div>

          {isTie && (
            <div className="mb-10 bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-xl">
              <p className="text-lg md:text-xl" style={{ color: '#fff7e4' }}>
                Both options have the same net score. Double-check your star ratings — each con
                subtracts its star value from that option.
              </p>
              <button
                onClick={() => navigate(`/decisions/${decisionId}/rate`)}
                className="mt-4 px-6 py-3 text-sm md:text-base font-bold rounded-full"
                style={{ backgroundColor: '#5de7ff', color: '#1c2838' }}
              >
                Review ratings
              </button>
            </div>
          )}

          {/* Weighted scores */}
          <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 mb-10 border border-white/20 shadow-2xl">
            <h2 className="text-3xl font-bold text-center mb-8" style={{ color: '#fff7e4' }}>
              {getDecisionDisplayTitle(decision)}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <ScoreCard
                label="A"
                title={decision?.optionA?.title}
                score={analysis?.scores?.optionA}
                breakdown={analysis?.scoreBreakdown?.optionA}
                color="#5de7ff"
              />
              <ScoreCard
                label="B"
                title={decision?.optionB?.title}
                score={analysis?.scores?.optionB}
                breakdown={analysis?.scoreBreakdown?.optionB}
                color="#e98198"
              />
            </div>
            {analysis?.emotionalVsPractical && (
              <p className="text-center mt-6 text-lg opacity-90" style={{ color: '#5de7ff' }}>
                Your list leans {analysis.emotionalVsPractical.toLowerCase()}.
                {analysis.emotionalVsPractical === 'Emotional'
                  ? ' High-stakes worries carry real weight.'
                  : analysis.emotionalVsPractical === 'Practical'
                    ? ' Concrete benefits dominate.'
                    : ' Logic and feeling are both in play.'}
              </p>
            )}
            {analysis?.reasoning && (
              <div className="mt-8 p-6 rounded-2xl bg-white/5 border border-white/10">
                <h3 className="text-lg font-semibold mb-3" style={{ color: '#fff7e4' }}>
                  Quick read
                </h3>
                <p className="text-lg leading-relaxed opacity-95" style={{ color: '#fff7e4' }}>
                  {analysis.reasoning}
                </p>
              </div>
            )}
          </div>

          {/* AI summary */}
          <div
            ref={aiAnalysisRef}
            className="bg-white/10 backdrop-blur-md rounded-3xl p-8 mb-10 border border-white/20 shadow-2xl scroll-mt-8"
          >
            <div className="text-center mb-6">
              <h2 className="text-3xl font-bold mb-2" style={{ color: '#fff7e4' }}>
                AI decision summary
              </h2>
              <p className="opacity-80" style={{ color: '#fff7e4' }}>
                1★ = 1 pt · pros add · cons subtract
              </p>
            </div>

            {loadingGeminiAnalysis && (
              <div className="flex flex-col items-center py-12">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 mb-4" style={{ borderColor: '#5de7ff' }} />
                <p style={{ color: '#fff7e4' }}>Writing a thoughtful summary…</p>
              </div>
            )}

            {!loadingGeminiAnalysis && geminiAnalysis && (
              <>
                <div className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 p-6 rounded-2xl mb-8 border border-purple-400/30 text-center">
                  <p className="text-lg font-semibold mb-2" style={{ color: '#fff7e4' }}>
                    Leans toward
                  </p>
                  <p className="text-3xl md:text-4xl font-bold" style={{ color: '#5de7ff' }}>
                    {geminiAnalysis.recommendedOption}
                  </p>
                </div>
                <p className="text-lg leading-relaxed mb-8" style={{ color: '#fff7e4' }}>
                  {geminiAnalysis.summary}
                </p>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-xl font-semibold mb-3" style={{ color: '#5de7ff' }}>
                      Strengths
                    </h3>
                    <ul className="space-y-3">
                      {(geminiAnalysis.strengths || geminiAnalysis.reasons || []).map((item, i) => (
                        <li
                          key={i}
                          className="bg-white/5 p-4 rounded-xl border border-white/10"
                          style={{ color: '#fff7e4' }}
                        >
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-3" style={{ color: '#e98198' }}>
                      Trade-offs to sit with
                    </h3>
                    <ul className="space-y-3">
                      {(geminiAnalysis.considerations || []).map((item, i) => (
                        <li
                          key={i}
                          className="bg-white/5 p-4 rounded-xl border border-white/10"
                          style={{ color: '#fff7e4' }}
                        >
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                {hasReflection && (
                  <p className="text-center text-sm mt-6 opacity-70" style={{ color: '#5de7ff' }}>
                    Includes your deeper reflection
                  </p>
                )}
              </>
            )}

            {!loadingGeminiAnalysis && !geminiAnalysis && (
              <div className="text-center py-8">
                <button
                  onClick={loadGeminiSummary}
                  className="px-8 py-4 rounded-full font-bold"
                  style={{ backgroundColor: '#5de7ff', color: '#1c2838' }}
                >
                  Retry AI summary
                </button>
              </div>
            )}
          </div>

          {/* Optional deeper reflection — only after initial analysis */}
          {!showReflection && (
            <DeeperClarityPrompt
              hasReflection={hasReflection}
              onStart={() => setShowReflection(true)}
            />
          )}

          {showReflection && (
            <div
              ref={reflectionRef}
              className="bg-white/10 backdrop-blur-md rounded-3xl p-6 md:p-10 mb-10 border border-white/20 shadow-2xl scroll-mt-8"
            >
              <MindsetForm
                embedded
                decisionId={decisionId}
                decision={decision}
                onComplete={handleReflectionComplete}
                onCancel={() => setShowReflection(false)}
              />
            </div>
          )}

          <div className="flex flex-col sm:flex-row justify-between items-center gap-6 mt-12">
            <button
              onClick={() => navigate(`/decisions/${decisionId}/rate`)}
              className="px-8 py-4 text-lg font-medium"
              style={{ color: '#fff7e4' }}
            >
              Back to ratings
            </button>
            <button
              onClick={() => navigate('/')}
              className="px-12 py-4 text-xl font-bold rounded-full shadow-2xl"
              style={{ backgroundColor: '#fff7e4', color: '#1c2838' }}
            >
              Start new decision
            </button>
          </div>
        </div>
      </main>

      <footer className="bg-black/20 border-t border-white/10 py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-400 text-sm">
          © {new Date().getFullYear()} Orica
        </div>
      </footer>
    </div>
  );
}

function ScoreCard({ label, title, score, breakdown, color }) {
  const bg =
    label === 'A'
      ? 'from-blue-500/20 to-indigo-500/20 border-blue-400/30'
      : 'from-purple-500/20 to-pink-500/20 border-purple-400/30';
  const dot = label === 'A' ? 'bg-blue-500' : 'bg-purple-500';
  const net = breakdown?.net ?? score;
  const proPts = breakdown?.proPoints ?? 0;
  const conPts = breakdown?.conPoints ?? 0;

  return (
    <div className={`bg-gradient-to-br ${bg} p-8 rounded-2xl border backdrop-blur-sm text-center`}>
      <div
        className={`w-16 h-16 ${dot} text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4`}
      >
        {label}
      </div>
      <h3 className="text-2xl font-semibold mb-4" style={{ color: '#fff7e4' }}>
        {title}
      </h3>
      <p className="text-5xl font-bold mb-1" style={{ color }}>
        {score ?? '—'}
      </p>
      <p className="text-sm opacity-80 mb-3" style={{ color: '#fff7e4' }}>
        net points
      </p>
      {(proPts > 0 || conPts > 0) && (
        <p className="text-sm leading-relaxed opacity-90 font-mono" style={{ color: '#fff7e4' }}>
          +{proPts} pros − {conPts} cons = {net}
        </p>
      )}
    </div>
  );
}

function DeeperClarityPrompt({ hasReflection, onStart }) {
  return (
    <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 mb-10 border border-white/20 shadow-2xl text-center">
      <h2 className="text-2xl md:text-3xl font-bold mb-3" style={{ color: '#fff7e4' }}>
        {hasReflection ? 'Want to revisit your reflection?' : 'Still unsure?'}
      </h2>
      <p className="text-lg max-w-xl mx-auto mb-8 opacity-90" style={{ color: '#fff7e4' }}>
        {hasReflection
          ? 'You’ve already shared a deeper layer. Update it anytime to refresh your summary.'
          : 'Go deeper only if you need it — explore fear vs desire, values, and long-term fulfillment. We’ll refine your analysis afterward.'}
      </p>
      <button
        onClick={onStart}
        className="px-8 py-4 text-lg font-bold rounded-full shadow-lg transition hover:scale-[1.02]"
        style={{ backgroundColor: '#5de7ff', color: '#1c2838' }}
      >
        {hasReflection ? 'Update reflection' : 'Need deeper clarity?'}
      </button>
      {!hasReflection && (
        <p className="mt-6 text-sm opacity-60" style={{ color: '#fff7e4' }}>
          No pressure — many people decide right after the summary above.
        </p>
      )}
    </div>
  );
}
