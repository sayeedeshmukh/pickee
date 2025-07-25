import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createDecision } from '../services/api';
import { toast } from 'react-hot-toast';

export default function DecisionForm({ onDecisionCreated, token }) {
  const [formData, setFormData] = useState({
    optionA: { title: '', description: '' },
    optionB: { title: '', description: '' },
    userName: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('optionA') || name.includes('optionB')) {
      const [option, field] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [option]: { ...prev[option], [field]: value }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      console.log(" Submitting decision form with:", formData);

      const response = await createDecision(formData, token);
      console.log(" Decision created:", response.data);

      toast.success('Decision created!');
      if (onDecisionCreated) {
        console.log(" Triggering onDecisionCreated with ID:", response.data._id);
        onDecisionCreated(response.data._id);
      } else {
        navigate(`/decisions/${response.data._id}/rate`);
      }
    } catch (error) {
      toast.error('Failed to create decision');
      console.error("🚨 Error creating decision:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* User Name */}
      <div className="text-center">
        <label className="block text-2xl font-semibold text-white mb-4">What's your name?</label>
        <input
          type="text"
          name="userName"
          value={formData.userName}
          onChange={handleChange}
          className="w-full max-w-md mx-auto px-6 py-4 text-lg bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-colors"
          placeholder="Enter your name here!"
          required
        />
      </div>

      {/* Options Section */}
      <div className="space-y-8">
        <h2 className="text-3xl font-bold text-center text-white mb-8">
          What are you deciding between?
        </h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Option A */}
          <div className="bg-gradient-to-br from-blue-500/20 to-indigo-500/20 p-8 rounded-2xl border border-blue-300/30 shadow-xl backdrop-blur-sm">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4 shadow-lg">
                A
              </div>
              <h3 className="text-2xl font-semibold text-blue-200">Option A</h3>
            </div>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-3">Title</label>
                <input
                  type="text"
                  name="optionA.title"
                  value={formData.optionA.title}
                  onChange={handleChange}
                  className="w-full px-4 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="e.g., Take the new job offer"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-3">Description (optional)</label>
                <textarea
                  name="optionA.description"
                  value={formData.optionA.description}
                  onChange={handleChange}
                  className="w-full px-4 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  rows={3}
                  placeholder="Add more details about this option..."
                />
              </div>
            </div>
          </div>

          {/* Option B */}
          <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 p-8 rounded-2xl border border-purple-300/30 shadow-xl backdrop-blur-sm">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4 shadow-lg">
                B
              </div>
              <h3 className="text-2xl font-semibold text-purple-200">Option B</h3>
            </div>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-3">Title</label>
                <input
                  type="text"
                  name="optionB.title"
                  value={formData.optionB.title}
                  onChange={handleChange}
                  className="w-full px-4 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                  placeholder="e.g., Stay at current job"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-3">Description (optional)</label>
                <textarea
                  name="optionB.description"
                  value={formData.optionB.description}
                  onChange={handleChange}
                  className="w-full px-4 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                  rows={3}
                  placeholder="Add more details about this option..."
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="text-center pt-8">
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-16 py-6 bg-gradient-to-r from-pink-600 to-purple-600 text-white text-xl font-bold rounded-full hover:from-pink-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 transition-all duration-300 shadow-2xl hover:shadow-pink-500/25"
        >
          {isSubmitting ? (
            <div className="flex items-center space-x-3">
              <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-white"></div>
              <span>Creating Decision...</span>
            </div>
          ) : (
            'Create Decision & Get AI Suggestions'
          )}
        </button>
      </div>
    </form>
  );
}