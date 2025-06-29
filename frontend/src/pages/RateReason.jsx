import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import ProConCard from '../components/ProConCard';
import Rating from '../components/Rating';
import { getDecision, getProsConsByDecision, addProsCons } from '../services/api';

export default function RateReason() {
  const { id: decisionId } = useParams();
  const navigate = useNavigate();
  const [decision, setDecision] = useState(null);
  const [prosCons, setProsCons] = useState([]);
  const [activeTab, setActiveTab] = useState('A');
  const [newItem, setNewItem] = useState({ 
    text: '', 
    type: 'pro', 
    rating: 5 
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch decision and pros/cons data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [decisionRes, prosConsRes] = await Promise.all([
          getDecision(decisionId),
          getProsConsByDecision(decisionId)
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

  // Handle adding new pro/con
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
      
      // Refresh the pros/cons list
      const res = await getProsConsByDecision(decisionId);
      setProsCons(res.data);
    } catch (error) {
      toast.error('Failed to save. Please try again.');
      console.error('Submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Filter pros/cons for active tab
  const filteredProsCons = prosCons.filter(item => item.option === activeTab);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (!decision) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">Failed to load decision data</p>
        <button 
          onClick={() => window.location.reload()} 
          className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Evaluate Your Options</h1>
        <p className="text-gray-600">Rate the pros and cons for each option to help make your decision</p>
      </header>

      {/* Option tabs */}
      <div className="flex mb-6 border-b">
        {['A', 'B'].map((option) => (
          <button
            key={option}
            className={`px-4 py-2 font-medium transition-colors ${activeTab === option 
              ? 'border-b-2 border-indigo-500 text-indigo-600' 
              : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab(option)}
          >
            {decision[`option${option}`].title}
          </button>
        ))}
      </div>

      {/* Add new pro/con form */}
      <section className="mb-8 bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-semibold mb-4 text-gray-800">Add New Consideration</h2>
        
        <div className="flex space-x-2 mb-4">
          <button
            className={`px-4 py-2 rounded-lg transition-colors ${newItem.type === 'pro' 
              ? 'bg-green-100 text-green-800' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            onClick={() => setNewItem({ ...newItem, type: 'pro' })}
          >
            Pro
          </button>
          <button
            className={`px-4 py-2 rounded-lg transition-colors ${newItem.type === 'con' 
              ? 'bg-red-100 text-red-800' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            onClick={() => setNewItem({ ...newItem, type: 'con' })}
          >
            Con
          </button>
        </div>
        
        <textarea
          value={newItem.text}
          onChange={(e) => setNewItem({ ...newItem, text: e.target.value })}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          placeholder={`Why is this a ${newItem.type} for ${decision[`option${activeTab}`].title}?`}
          rows={3}
        />
        
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center">
            <span className="mr-2 text-sm text-gray-600">Importance:</span>
            <Rating 
              value={newItem.rating} 
              onChange={(val) => setNewItem({ ...newItem, rating: val })} 
            />
          </div>
          
          <button
            onClick={handleAddNew}
            disabled={isSubmitting || !newItem.text.trim()}
            className={`px-4 py-2 rounded-lg text-white ${isSubmitting || !newItem.text.trim() 
              ? 'bg-indigo-400 cursor-not-allowed' 
              : 'bg-indigo-600 hover:bg-indigo-700'}`}
          >
            {isSubmitting ? 'Adding...' : 'Add Consideration'}
          </button>
        </div>
      </section>

      {/* Existing pros/cons list */}
      <section>
        <h2 className="text-lg font-semibold mb-4 text-gray-800">
          {filteredProsCons.length > 0 
            ? 'Your Considerations' 
            : 'No considerations yet. Add your first one above!'}
        </h2>
        
        <div className="space-y-3">
          {filteredProsCons.map((item) => (
            <ProConCard
              key={item._id}
              item={item}
              decisionId={decisionId}
              onUpdate={async () => {
                const res = await getProsConsByDecision(decisionId);
                setProsCons(res.data);
              }}
            />
          ))}
        </div>
      </section>

      {/* Continue button */}
      <div className="mt-8 flex justify-end">
        <button
          onClick={() => navigate(`/decisions/${decisionId}/mindset`)}
          className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          Continue to Mindset Assessment
        </button>
        
      </div>
    </div>
  );
}