import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
// Import the new getGeminiSummary function
import { getDecision, getMindset, getDecisionAnalysis, getGeminiSummary } from '../services/api';
import { toast } from 'react-hot-toast'; // Make sure toast is imported

export default function Results() {
  const { id: decisionId } = useParams();
  const [decision, setDecision] = useState(null);
  const [mindset, setMindset] = useState(null);
  const [analysis, setAnalysis] = useState(null); 
  const [geminiAnalysis, setGeminiAnalysis] = useState(null); 
  const [loading, setLoading] = useState(true);
  const [loadingGeminiAnalysis, setLoadingGeminiAnalysis] = useState(false); 

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [decisionRes, mindsetRes, analysisRes] = await Promise.all([
          getDecision(decisionId),
          getMindset(decisionId),
          getDecisionAnalysis(decisionId), // Your existing analysis endpoint
        ]);
        setDecision(decisionRes.data);
        setMindset(mindsetRes.data);
        setAnalysis(analysisRes.data);
      } catch (error) {
        console.error('Failed to load initial results:', error);
        toast.error('Failed to load initial results data.');
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
      toast.success('Gemini analysis generated successfully!');
    } catch (error) {
      console.error('Failed to generate Gemini analysis:', error);
      toast.error('Failed to generate AI analysis.');
    } finally {
      setLoadingGeminiAnalysis(false);
    }
  };


  if (loading) return <div>Loading results...</div>;

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">Decision Results</h1>

      <div className="mb-6 flex justify-end">
        <button
          onClick={generateGeminiSummary} // Call the new Gemini summary function
          disabled={loadingGeminiAnalysis} // Use the new loading state
          className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 disabled:bg-blue-300"
        >
          {loadingGeminiAnalysis ? 'Generating AI Analysis...' : 'Generate AI Analysis'}
        </button>
      </div>

      <div className="bg-white shadow rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Your Decision</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="border p-4 rounded-lg">
            <h3 className="text-lg font-medium mb-2">Option A: {decision.optionA.title}</h3>
            <p>Score: {analysis?.optionA?.score}</p>
          </div>
          <div className="border p-4 rounded-lg">
            <h3 className="text-lg font-medium mb-2">Option B: {decision.optionB.title}</h3>
            <p>Score: {analysis?.optionB?.score}</p>
          </div>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Your Existing Analysis (if any)</h2>
        <p className="mb-4">{analysis?.summary || 'No existing analysis.'}</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-medium mb-2">Strengths</h3>
            <ul className="list-disc pl-5 space-y-1">
              {analysis?.strengths?.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-medium mb-2">Considerations</h3>
            <ul className="list-disc pl-5 space-y-1">
              {analysis?.considerations?.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Your Mindset</h2>
        {mindset && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p><span className="font-medium">Clarity Level:</span> {mindset.clarityLevel}</p>
              <p><span className="font-medium">Fear of Regret:</span> {mindset.fearOfRegret}</p>
            </div>
            <div>
              <p><span className="font-medium">Emotional Attachment:</span> {mindset.emotionalAttachment}</p>
              <p><span className="font-medium">Practical Approach:</span> {mindset.practicalApproach}</p>
            </div>
            {mindset.notes && (
              <div className="col-span-2">
                <p className="font-medium">Notes:</p>
                <p className="italic">{mindset.notes}</p>
              </div>
            )}
          </div>
        )}
      </div>

      {geminiAnalysis && ( // Display Gemini's analysis here
        <div className="mt-8 bg-white shadow rounded-lg p-6 border-l-4 border-blue-500">
          <h2 className="text-xl font-semibold mb-4">Gemini's Efficient Choice Analysis</h2>
          <p className="mb-4 font-bold">Recommendation: {geminiAnalysis.recommendedOption}</p>
          <h3 className="text-lg font-medium mb-2">Summary:</h3>
          <p className="whitespace-pre-line mb-4">{geminiAnalysis.summary}</p>

          {geminiAnalysis.strengths && geminiAnalysis.strengths.length > 0 && (
            <>
              <h3 className="font-medium mb-2">Key Strengths of Recommended Option:</h3>
              <ul className="list-disc pl-5 space-y-1">
                {geminiAnalysis.strengths.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </>
          )}

          {geminiAnalysis.considerations && geminiAnalysis.considerations.length > 0 && (
            <>
              <h3 className="font-medium mt-4 mb-2">Key Considerations:</h3>
              <ul className="list-disc pl-5 space-y-1">
                {geminiAnalysis.considerations.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </>
          )}
        </div>
      )}
    </div>
  );
}