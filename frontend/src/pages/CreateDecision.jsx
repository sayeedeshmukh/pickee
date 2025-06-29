import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DecisionForm from '../components/DecisionForm';
import { generateProsCons, getDecision } from '../services/api';
import { toast } from 'react-hot-toast';

export default function CreateDecision() {
  const navigate = useNavigate()
  const [isGenerating, setIsGenerating] = useState(false)

  const handleDecisionCreated = async (decisionId) => {
    setIsGenerating(true)
    try {
      const decision = await getDecision(decisionId)
      await generateProsCons(decisionId, {
        optionA: decision.optionA.title,
        optionB: decision.optionB.title,
      })
      toast.success('AI-generated pros/cons created!')
      navigate(`/decisions/${decisionId}/rate`)
    } catch (error) {
      toast.error('AI generation failed, but you can add pros/cons manually')
      console.error('AI generation error:', error) // Added error logging
      navigate(`/decisions/${decisionId}/rate`)
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">Create New Decision</h1>
      <DecisionForm onDecisionCreated={handleDecisionCreated} />
      {isGenerating && (
        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
          <p className="text-blue-700">Generating AI suggestions...</p>
        </div>
      )}
    </div>
  )
}