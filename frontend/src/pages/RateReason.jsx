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
  const [newItem, setNewItem] = useState({ text: '', type: 'pro', rating: 5, option: 'A' });
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
        option: newItem.option,
        type: newItem.type,
        text: newItem.text,
        rating: newItem.rating,
        source: 'user',
      });
      toast.success('Added successfully!');
      setNewItem({ text: '', type: 'pro', rating: 5, option: newItem.option });
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
        await deleteProsCons(itemId);
        toast.success('Item removed (rated 1 star)');
      } else {
        await updateProsCons(itemId, { rating: newRating });
        toast.success('Rating updated');
      }
      const res = await getProsConsByDecision(decisionId);
      setProsCons(res.data);
    } catch (error) {
      toast.error('Failed to update rating');
      console.error('Rating update error:', error);
    }
  };

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

  // Split pros/cons by option and type
  const optionAPros = prosCons.filter(item => item.option === 'A' && item.type === 'pro');
  const optionACons = prosCons.filter(item => item.option === 'A' && item.type === 'con');
  const optionBPros = prosCons.filter(item => item.option === 'B' && item.type === 'pro');
  const optionBCons = prosCons.filter(item => item.option === 'B' && item.type === 'con');

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Navbar */}
      <nav className="bg-[#FFF7E2] text-[#262C38] rounded-2xl mx-2 md:mx-8 mt-4 md:mt-6 mb-6 md:mb-10 flex flex-col md:flex-row items-center justify-between px-4 md:px-8 py-3 md:py-4 shadow-lg font-['Lexend_Deca','sans-serif']">
        <div className="text-3xl md:text-4xl font-bold font-['Limelight','sans-serif']">orica</div>
        <div className="flex gap-6 md:gap-10 text-lg md:text-xl mt-2 md:mt-0">
          <button onClick={() => navigate('/')} className="navLinks home hover:text-[#48bac4]">home</button>
          <button onClick={() => navigate('/decisions/create')} className="navLinks hover:text-[#48bac4]">decide</button>
          <a href="#about" className="navLinks hover:text-[#48bac4]">about us</a>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-2 md:px-4 pb-10 md:pb-16">
        <header className="mb-6 md:mb-10 text-center">
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-2 font-['Limelight','sans-serif']">{decision.title}</h1>
          <p className="text-lg md:text-xl text-[#FFF7E2] font-['Lexend_Deca','sans-serif']">Rate the pros and cons for each option to help make your decision</p>
        </header>

        {/* Responsive Side-by-side options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
          {/* Option A */}
          <div className="bg-gradient-to-br from-blue-500/10 to-indigo-500/10 rounded-2xl p-4 md:p-6 border-2 border-blue-200 shadow-xl">
            <h2 className="text-xl md:text-2xl font-bold text-blue-700 mb-2 font-['Limelight','sans-serif']">Option A</h2>
            <p className="text-base md:text-lg text-blue-900 mb-4 md:mb-6 font-['Lexend_Deca','sans-serif']">{decision.optionA.title}</p>
            <div className="mb-3 md:mb-4">
              <h3 className="text-base md:text-lg font-semibold text-green-600 mb-2">Pros</h3>
              {optionAPros.length > 0 ? optionAPros.map(item => (
                <ProConCard key={item._id} item={item} decisionId={decisionId} onUpdate={() => getProsConsByDecision(decisionId).then(res => setProsCons(res.data))} onRatingChange={newRating => handleRatingChange(item._id, newRating)} />
              )) : <p className="text-gray-400 italic">No pros yet.</p>}
            </div>
            <div>
              <h3 className="text-base md:text-lg font-semibold text-red-600 mb-2">Cons</h3>
              {optionACons.length > 0 ? optionACons.map(item => (
                <ProConCard key={item._id} item={item} decisionId={decisionId} onUpdate={() => getProsConsByDecision(decisionId).then(res => setProsCons(res.data))} onRatingChange={newRating => handleRatingChange(item._id, newRating)} />
              )) : <p className="text-gray-400 italic">No cons yet.</p>}
            </div>
            {/* Add new pro/con for Option A */}
            <div className="mt-6 md:mt-8">
              <h4 className="text-sm md:text-md font-semibold text-[#262C38] mb-2">Add to Option A</h4>
              <div className="flex flex-col md:flex-row gap-2 mb-2">
                <select value={newItem.type} onChange={e => setNewItem({ ...newItem, type: e.target.value, option: 'A' })} className="rounded-lg px-3 py-2 bg-white/20 text-[#262C38]">
                  <option value="pro">Pro</option>
                  <option value="con">Con</option>
                </select>
                <input type="text" value={newItem.option === 'A' ? newItem.text : ''} onChange={e => setNewItem({ ...newItem, text: e.target.value, option: 'A' })} placeholder="Add your reason..." className="flex-1 rounded-lg px-3 py-2 bg-white/20 text-[#262C38]" />
                <Rating value={newItem.option === 'A' ? newItem.rating : 5} onChange={rating => setNewItem({ ...newItem, rating, option: 'A' })} />
                <button onClick={handleAddNew} disabled={isSubmitting || !newItem.text.trim() || newItem.option !== 'A'} className="px-4 py-2 bg-[#48bac4] text-white rounded-lg font-bold hover:bg-[#02939F] disabled:opacity-50">Add</button>
              </div>
            </div>
          </div>

          {/* Option B */}
          <div className="bg-gradient-to-br from-pink-500/10 to-purple-500/10 rounded-2xl p-4 md:p-6 border-2 border-pink-200 shadow-xl">
            <h2 className="text-xl md:text-2xl font-bold text-pink-700 mb-2 font-['Limelight','sans-serif']">Option B</h2>
            <p className="text-base md:text-lg text-pink-900 mb-4 md:mb-6 font-['Lexend_Deca','sans-serif']">{decision.optionB.title}</p>
            <div className="mb-3 md:mb-4">
              <h3 className="text-base md:text-lg font-semibold text-green-600 mb-2">Pros</h3>
              {optionBPros.length > 0 ? optionBPros.map(item => (
                <ProConCard key={item._id} item={item} decisionId={decisionId} onUpdate={() => getProsConsByDecision(decisionId).then(res => setProsCons(res.data))} onRatingChange={newRating => handleRatingChange(item._id, newRating)} />
              )) : <p className="text-gray-400 italic">No pros yet.</p>}
            </div>
            <div>
              <h3 className="text-base md:text-lg font-semibold text-red-600 mb-2">Cons</h3>
              {optionBCons.length > 0 ? optionBCons.map(item => (
                <ProConCard key={item._id} item={item} decisionId={decisionId} onUpdate={() => getProsConsByDecision(decisionId).then(res => setProsCons(res.data))} onRatingChange={newRating => handleRatingChange(item._id, newRating)} />
              )) : <p className="text-gray-400 italic">No cons yet.</p>}
            </div>
            {/* Add new pro/con for Option B */}
            <div className="mt-6 md:mt-8">
              <h4 className="text-sm md:text-md font-semibold text-[#262C38] mb-2">Add to Option B</h4>
              <div className="flex flex-col md:flex-row gap-2 mb-2">
                <select value={newItem.type} onChange={e => setNewItem({ ...newItem, type: e.target.value, option: 'B' })} className="rounded-lg px-3 py-2 bg-white/20 text-[#262C38]">
                  <option value="pro">Pro</option>
                  <option value="con">Con</option>
                </select>
                <input type="text" value={newItem.option === 'B' ? newItem.text : ''} onChange={e => setNewItem({ ...newItem, text: e.target.value, option: 'B' })} placeholder="Add your reason..." className="flex-1 rounded-lg px-3 py-2 bg-white/20 text-[#262C38]" />
                <Rating value={newItem.option === 'B' ? newItem.rating : 5} onChange={rating => setNewItem({ ...newItem, rating, option: 'B' })} />
                <button onClick={handleAddNew} disabled={isSubmitting || !newItem.text.trim() || newItem.option !== 'B'} className="px-4 py-2 bg-[#E88296] text-white rounded-lg font-bold hover:bg-[#c94a6a] disabled:opacity-50">Add</button>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex flex-col md:flex-row justify-between mt-10 md:mt-16 gap-4 md:gap-0">
          <button
            onClick={() => navigate('/')}
            className="px-8 py-3 text-[#262C38] bg-[#FFF7E2] rounded-lg font-bold hover:bg-[#48bac4] hover:text-white text-lg shadow-md w-full md:w-auto"
          >
            ← Back to Home
          </button>
          <button
            onClick={() => navigate(`/decisions/${decisionId}/results`)}
            className="px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg font-bold hover:from-green-700 hover:to-emerald-700 text-lg shadow-lg w-full md:w-auto"
          >
            View Results →
          </button>
        </div>
      </div>
    </div>
  );
}