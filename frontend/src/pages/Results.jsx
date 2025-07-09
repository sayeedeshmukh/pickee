import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getDecision, getMindset, getDecisionAnalysis, summarizeDecision } from '../services/api';
import { toast } from 'react-hot-toast';

export default function Results() {
  const { id: decisionId } = useParams();
  const [decision, setDecision] = useState(null);
  const [mindset, setMindset] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hfSummary, setHfSummary] = useState(null);
  const [summarizing, setSummarizing] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [decisionRes, mindsetRes, analysisRes] = await Promise.all([
          getDecision(decisionId),
          getMindset(decisionId),
          getDecisionAnalysis(decisionId),
        ]);
        setDecision(decisionRes.data);
        setMindset(mindsetRes.data);
        setAnalysis(analysisRes.data);
      } catch (error) {
        console.error('Failed to load results:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [decisionId]);

  const generateHFSummary = async () => {
    setSummarizing(true);
    try {
      const response = await summarizeDecision(decisionId);
      setHfSummary(response.data.summary);
      toast.success('Hugging Face summary generated!');
    } catch (error) {
      toast.error('Failed to generate summary');
      console.error(error);
    } finally {
      setSummarizing(false);
    }
  };

  if (loading) return <div>Loading results...</div>;

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">Decision Results</h1>
      
      <div className="mb-6 flex justify-end">
        <button
          onClick={generateHFSummary}
          disabled={summarizing}
          className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 disabled:bg-blue-300"
        >
          {summarizing ? 'Generating...' : 'Generate Hugging Face Summary'}
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
        <h2 className="text-xl font-semibold mb-4">Analysis</h2>
        <p className="mb-4">{analysis?.summary}</p>
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

      {hfSummary && (
        <div className="mt-8 bg-white shadow rounded-lg p-6 border-l-4 border-blue-500">
          <h2 className="text-xl font-semibold mb-4">Hugging Face Summary</h2>
          <p className="whitespace-pre-line">{hfSummary}</p>
        </div>
      )}
    </div>
  );
}