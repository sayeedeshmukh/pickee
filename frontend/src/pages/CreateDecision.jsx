import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DecisionForm from '../components/DecisionForm';
import { getDecision, generateProsConsGemini } from '../services/api';
import { toast } from 'react-hot-toast';
import { useAuth } from '../components/AuthContext';

export default function CreateDecision() {
  const navigate = useNavigate();
  const [isGenerating, setIsGenerating] = useState(false);
  const { token } = useAuth();

  const handleDecisionCreated = async (decisionId) => {
    setIsGenerating(true);
    try {
      const response = await getDecision(decisionId);
      const decision = response.data;

      // Automatically generate AI suggestions
      await generateProsConsGemini({
        optionA: decision.optionA.title,
        optionB: decision.optionB.title,
        decisionId: decisionId,
      });

      toast.success('Decision created with AI suggestions!');
      navigate(`/decisions/${decisionId}/rate`);
    } catch (error) {
      toast.error('Decision created, but AI generation failed. You can still add pros/cons manually.');
      console.error('AI generation error:', error);
      navigate(`/decisions/${decisionId}/rate`);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="max-w-4xl mx-auto py-8 px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">Create Your Decision</h1>
          <p className="text-xl text-gray-300">Define your options and let AI help you analyze them</p>
        </div>
        
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 shadow-2xl">
          <DecisionForm onDecisionCreated={handleDecisionCreated} token={token} />
        </div>
        
        {isGenerating && (
          <div className="mt-6 p-6 bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl border border-purple-200">
            <div className="flex items-center justify-center space-x-3">
              <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-purple-600"></div>
              <p className="text-purple-700 font-medium">Creating your decision and generating AI suggestions...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}