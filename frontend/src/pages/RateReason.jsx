import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import ProConCard from '../components/ProConCard';
import Rating from '../components/Rating';
import { getDecision, getProsConsByDecision, addProsCons, updateProsCons, deleteProsCons } from '../services/api';

export default function RateReason() {
  const { id: decisionId } = useParams();
  const navigate = useNavigate();
  const [decision, setDecision] = useState(null);
  const [prosCons, setProsCons] = useState([]);
  const [activeTab, setActiveTab] = useState('A');
  const [newItem, setNewItem] = useState({ text: '', type: 'pro', rating: 5 });
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [decisionRes, prosConsRes] = await Promise.all([
          getDecision(decisionId),
          getProsConsByDecision(decisionId),
        ]);
        setDecision(decisionRes.data);
        setProsCons(prosConsRes.data);
      } catch (error) {
        toast.error('Failed to load decision data');
        console.error('Fetch error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [decisionId]);

  const handleAddNew = async () => {
    if (!newItem.text.trim()) {
      toast.error('Please enter your reasoning');
      return;
    }

    setIsSubmitting(true);
    try {
      await addProsCons({
        decisionId,
        option: activeTab,
        type: newItem.type,
        text: newItem.text,
        rating: newItem.rating,
        source: 'user',
      });

      toast.success('Added successfully!');
      setNewItem({ text: '', type: 'pro', rating: 5 });

      // Refresh the list after adding
      const res = await getProsConsByDecision(decisionId);
      setProsCons(res.data);
    } catch (error) {
      toast.error('Failed to save. Please try again.');
      console.error('Submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRatingChange = async (itemId, newRating) => {
    try {
      if (newRating === 1) {
        // Delete the item if rating is 1
        await deleteProsCons(itemId);
        toast.success('Item removed (rated 1 star)');
      } else {
        // Update the rating
        await updateProsCons(itemId, { rating: newRating });
        toast.success('Rating updated');
      }
      
      // Refresh the list
      const res = await getProsConsByDecision(decisionId);
      setProsCons(res.data);
    } catch (error) {
      toast.error('Failed to update rating');
      console.error('Rating update error:', error);
    }
  };

  const filteredProsCons = prosCons.filter((item) => item.option === activeTab);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-pink-500 mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading your decision...</p>
        </div>
      </div>
    );
  }

  if (!decision) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 text-lg mb-4">Failed to load decision data</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-pink-600 text-white rounded-lg hover:bg-pink-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="max-w-6xl mx-auto py-8 px-4">
        {/* Header */}
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-white mb-4">{decision.title}</h1>
          <p className="text-xl text-gray-300">Rate the pros and cons for each option to help make your decision</p>
        </header>

        {/* Tab Navigation */}
        <div className="flex space-x-1 bg-white/10 backdrop-blur-md p-1 rounded-lg mb-8">
          <button
            onClick={() => setActiveTab('A')}
            className={`flex-1 py-3 px-6 rounded-md font-medium transition-colors ${
              activeTab === 'A' ? 'bg-white text-gray-900 shadow-lg' : 'text-white hover:text-pink-300'
            }`}
          >
            Option A: {decision.optionA.title}
          </button>
          <button
            onClick={() => setActiveTab('B')}
            className={`flex-1 py-3 px-6 rounded-md font-medium transition-colors ${
              activeTab === 'B' ? 'bg-white text-gray-900 shadow-lg' : 'text-white hover:text-pink-300'
            }`}
          >
            Option B: {decision.optionB.title}
          </button>
        </div>

        {/* Add New Pro/Con Form */}
        <div className="bg-white/10 backdrop-blur-md p-6 rounded-xl border border-white/20 mb-8 shadow-xl">
          <h3 className="text-xl font-semibold text-white mb-4">Add Your Own Pro/Con</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Type</label>
              <select
                value={newItem.type}
                onChange={(e) => setNewItem({ ...newItem, type: e.target.value })}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
              >
                <option value="pro">Pro</option>
                <option value="con">Con</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Your Reasoning</label>
              <input
                type="text"
                value={newItem.text}
                onChange={(e) => setNewItem({ ...newItem, text: e.target.value })}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                placeholder="Enter your reasoning..."
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Importance Rating</label>
              <Rating value={newItem.rating} onChange={(rating) => setNewItem({ ...newItem, rating })} />
            </div>
          </div>
          
          <div className="mt-4">
            <button
              onClick={handleAddNew}
              disabled={isSubmitting || !newItem.text.trim()}
              className="w-full py-3 bg-gradient-to-r from-pink-600 to-purple-600 text-white rounded-lg hover:from-pink-700 hover:to-purple-700 disabled:opacity-50 font-medium shadow-lg"
            >
              {isSubmitting ? 'Adding...' : 'Add Pro/Con'}
            </button>
          </div>
        </div>

        {/* Display Existing Pros/Cons */}
        <div className="space-y-8">
          <div>
            <h3 className="text-2xl font-semibold mb-6 text-green-400">Pros</h3>
            {filteredProsCons.filter(item => item.type === 'pro').map(item => (
              <ProConCard 
                key={item._id} 
                item={item} 
                decisionId={decisionId} 
                onUpdate={() => {
                  getProsConsByDecision(decisionId).then(res => setProsCons(res.data));
                }}
                onRatingChange={(newRating) => handleRatingChange(item._id, newRating)}
              />
            ))}
            {filteredProsCons.filter(item => item.type === 'pro').length === 0 && (
              <p className="text-gray-400 italic text-center py-8">No pros added yet.</p>
            )}
          </div>
          
          <div>
            <h3 className="text-2xl font-semibold mb-6 text-red-400">Cons</h3>
            {filteredProsCons.filter(item => item.type === 'con').map(item => (
              <ProConCard 
                key={item._id} 
                item={item} 
                decisionId={decisionId} 
                onUpdate={() => {
                  getProsConsByDecision(decisionId).then(res => setProsCons(res.data));
                }}
                onRatingChange={(newRating) => handleRatingChange(item._id, newRating)}
              />
            ))}
            {filteredProsCons.filter(item => item.type === 'con').length === 0 && (
              <p className="text-gray-400 italic text-center py-8">No cons added yet.</p>
            )}
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-12">
          <button
            onClick={() => navigate('/')}
            className="px-8 py-3 text-gray-300 hover:text-white font-medium text-lg"
          >
            ← Back to Home
          </button>
          <button
            onClick={() => navigate(`/decisions/${decisionId}/results`)}
            className="px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 font-medium text-lg shadow-lg"
          >
            View Results →
          </button>
        </div>
      </div>
    </div>
  );
}