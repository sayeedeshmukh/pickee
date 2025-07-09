import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { createMindset, classifyMindset } from '../services/api';
import { toast } from 'react-hot-toast';

export default function MindsetForm() {
  const { id: decisionId } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    decisionId,
    clarityLevel: '',
    fearOfRegret: '',
    emotionalAttachment: '',
    longTermThinking: '',
    practicalApproach: '',
    notes: '',
  });
  const [hfAnalysis, setHfAnalysis] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const analyzeWithHF = async () => {
    if (!formData.notes.trim()) {
      toast.error('Please enter some notes to analyze');
      return;
    }

    setAnalyzing(true);
    try {
      const analysis = await classifyMindset(formData.notes);
      setHfAnalysis(analysis.data);
      toast.success('Mindset analysis complete!');
    } catch (error) {
      toast.error('Failed to analyze mindset');
      console.error(error);
    } finally {
      setAnalyzing(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createMindset(formData);
      toast.success('Mindset saved!');
      navigate(`/decisions/${decisionId}/results`);
    } catch (error) {
      toast.error('Failed to save mindset');
      console.error(error);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">Mindset Assessment</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Clarity Level</label>
          <select
            name="clarityLevel"
            value={formData.clarityLevel}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            required
          >
            <option value="">Select</option>
            <option value="Clear">Clear</option>
            <option value="Confused">Confused</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Fear of Regret</label>
          <select
            name="fearOfRegret"
            value={formData.fearOfRegret}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            required
          >
            <option value="">Select</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Emotional Attachment</label>
          <select
            name="emotionalAttachment"
            value={formData.emotionalAttachment}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            required
          >
            <option value="">Select</option>
            <option value="Strong">Strong</option>
            <option value="Moderate">Moderate</option>
            <option value="None">None</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Long Term Thinking</label>
          <select
            name="longTermThinking"
            value={formData.longTermThinking}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            required
          >
            <option value="">Select</option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Practical Approach</label>
          <select
            name="practicalApproach"
            value={formData.practicalApproach}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            required
          >
            <option value="">Select</option>
            <option value="Always">Always</option>
            <option value="Sometimes">Sometimes</option>
            <option value="Rarely">Rarely</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Additional Notes</label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows={3}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
          <div className="mt-2 flex justify-end">
            <button
              type="button"
              onClick={analyzeWithHF}
              disabled={analyzing}
              className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 disabled:bg-blue-300"
            >
              {analyzing ? 'Analyzing...' : 'Analyze with Hugging Face'}
            </button>
          </div>
        </div>

        {hfAnalysis && (
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h3 className="font-medium text-blue-800 mb-2">Hugging Face Analysis</h3>
            <p className="text-blue-700">{hfAnalysis.summary}</p>
            
            <div className="mt-4 grid grid-cols-2 gap-2">
              {Object.entries(hfAnalysis.suggestions).map(([field, value]) => (
                <button
                  key={field}
                  type="button"
                  onClick={() => setFormData(prev => ({
                    ...prev,
                    [field]: value
                  }))}
                  className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded hover:bg-blue-200"
                >
                  Apply: {field} = {value}
                </button>
              ))}
            </div>
          </div>
        )}

        <button
          type="submit"
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Submit Mindset
        </button>
      </form>
    </div>
  );
}