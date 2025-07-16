import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getDecision, getDecisionAnalysis, getGeminiSummary } from '../services/api';
import { toast } from 'react-hot-toast';

export default function Results() {
  const { id: decisionId } = useParams();
  const navigate = useNavigate();
  const [decision, setDecision] = useState(null);
  const [analysis, setAnalysis] = useState(null); 
  const [geminiAnalysis, setGeminiAnalysis] = useState(null); 
  const [loading, setLoading] = useState(true);
  const [loadingGeminiAnalysis, setLoadingGeminiAnalysis] = useState(false); 

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [decisionRes, analysisRes] = await Promise.all([
          getDecision(decisionId),
          getDecisionAnalysis(decisionId), // Your existing analysis endpoint
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

  const generateGeminiSummary = async () => {
    setLoadingGeminiAnalysis(true);
    try {
      const summaryRes = await getGeminiSummary(decisionId); 
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
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-500 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading your decision results...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-6xl mx-auto py-8 px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Decision Results</h1>
          <p className="text-xl text-gray-600">Here's what we found for your decision</p>
        </div>

        {/* AI Analysis Button */}
        <div className="mb-8 flex justify-center">
          <button
            onClick={generateGeminiSummary}
            disabled={loadingGeminiAnalysis}
            className="px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg text-lg hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 font-medium shadow-lg transform hover:scale-105 transition-all duration-300"
          >
            {loadingGeminiAnalysis ? (
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                <span>Generating AI Analysis...</span>
              </div>
            ) : (
              '🤖 Get AI Decision Analysis'
            )}
          </button>
        </div>

        {/* Decision Overview */}
        <div className="bg-white shadow-xl rounded-2xl p-8 mb-8">
          <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">{decision.title}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-200">
              <div className="text-center mb-4">
                <div className="w-16 h-16 bg-blue-500 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-3">
                  A
                </div>
                <h3 className="text-2xl font-semibold text-blue-800 mb-2">{decision.optionA.title}</h3>
                {decision.optionA.description && (
                  <p className="text-gray-600">{decision.optionA.description}</p>
                )}
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-blue-600">
                  {analysis?.optionA?.score || 'N/A'}
                </p>
                <p className="text-sm text-gray-500">Score</p>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-xl border border-purple-200">
              <div className="text-center mb-4">
                <div className="w-16 h-16 bg-purple-500 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-3">
                  B
                </div>
                <h3 className="text-2xl font-semibold text-purple-800 mb-2">{decision.optionB.title}</h3>
                {decision.optionB.description && (
                  <p className="text-gray-600">{decision.optionB.description}</p>
                )}
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-purple-600">
                  {analysis?.optionB?.score || 'N/A'}
                </p>
                <p className="text-sm text-gray-500">Score</p>
              </div>
            </div>
          </div>
        </div>

        {/* AI Analysis Results */}
        {geminiAnalysis && (
          <div className="bg-white shadow-xl rounded-2xl p-8 mb-8 border-l-4 border-purple-500">
            <div className="text-center mb-6">
              <h2 className="text-3xl font-bold text-gray-800 mb-2">AI Decision Analysis</h2>
              <p className="text-lg text-gray-600">Powered by advanced AI insights</p>
            </div>
            
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-6 rounded-xl mb-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-purple-800 mb-2">Recommended Option</p>
                <p className="text-4xl font-bold text-purple-600">{geminiAnalysis.recommendedOption}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Summary</h3>
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">{geminiAnalysis.summary}</p>
              </div>

              <div className="space-y-6">
                {geminiAnalysis.strengths && geminiAnalysis.strengths.length > 0 && (
                  <div>
                    <h3 className="text-xl font-semibold text-green-700 mb-3">Key Strengths</h3>
                    <ul className="space-y-2">
                      {geminiAnalysis.strengths.map((item, i) => (
                        <li key={i} className="flex items-start space-x-2">
                          <span className="text-green-500 mt-1">✓</span>
                          <span className="text-gray-700">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {geminiAnalysis.considerations && geminiAnalysis.considerations.length > 0 && (
                  <div>
                    <h3 className="text-xl font-semibold text-orange-700 mb-3">Key Considerations</h3>
                    <ul className="space-y-2">
                      {geminiAnalysis.considerations.map((item, i) => (
                        <li key={i} className="flex items-start space-x-2">
                          <span className="text-orange-500 mt-1">•</span>
                          <span className="text-gray-700">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <button
            onClick={() => navigate(`/decisions/${decisionId}/rate`)}
            className="px-8 py-3 text-gray-600 hover:text-gray-800 font-medium text-lg"
          >
            ← Back to Rating
          </button>
          <button
            onClick={() => navigate('/')}
            className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 font-medium text-lg shadow-lg"
          >
            Start New Decision
          </button>
        </div>
      </div>
    </div>
  );
}