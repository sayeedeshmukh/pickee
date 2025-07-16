import { useState } from 'react';
import Rating from './Rating';
import { addProsCons, updateProsCons, deleteProsCons } from '../services/api';
import { toast } from 'react-hot-toast';

export default function ProConCard({ item, decisionId, onUpdate, onRatingChange }) {
  const [rating, setRating] = useState(item.rating || 5);
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(item.text || '');

  const handleSave = async () => {
    try {
      await addProsCons({
        decisionId,
        option: item.option,
        type: item.type,
        text,
        rating,
        source: 'user', // Always 'user' for explicitly saved items
      });
      toast.success(`${item.type === 'pro' ? 'Pro' : 'Con'} saved!`);
      setIsEditing(false);
      if (onUpdate) onUpdate(); // Trigger a refresh of the main list
    } catch (error) {
      toast.error('Failed to save');
      console.error(error);
    }
  };

  const handleRatingChange = async (newRating) => {
    try {
      if (newRating === 1) {
        // Delete the item if rating is 1
        await deleteProsCons(item._id);
        toast.success('Item removed (rated 1 star)');
      } else {
        // Update the rating
        await updateProsCons(item._id, { rating: newRating });
        toast.success('Rating updated');
      }
      
      setRating(newRating);
      if (onRatingChange) {
        onRatingChange(newRating);
      }
    } catch (error) {
      toast.error('Failed to update rating');
      console.error('Rating update error:', error);
    }
  };

  return (
    <div className={`p-6 rounded-xl mb-4 transition-all duration-200 hover:shadow-lg ${
      item.type === 'pro' 
        ? 'bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200' 
        : 'bg-gradient-to-r from-red-50 to-pink-50 border border-red-200'
    }`}>
      {isEditing ? (
        // Edit mode
        <>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg mb-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            rows={3}
            placeholder={`Enter your ${item.type}...`}
          />
          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 mb-2">Importance Rating</label>
            <Rating value={rating} onChange={setRating} />
          </div>
          <div className="flex justify-end space-x-3">
            <button
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium shadow-sm"
            >
              Save
            </button>
          </div>
        </>
      ) : (
        // Display mode
        <>
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <p className="font-medium text-gray-800 mb-3 text-lg">{item.text}</p>
              <div className="flex items-center space-x-3">
                {item.source === 'ai' && (
                  <span className="text-xs bg-purple-100 text-purple-800 px-3 py-1 rounded-full font-medium">
                    🤖 AI Generated
                  </span>
                )}
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">Importance:</span>
                  <Rating 
                    value={rating} 
                    onChange={handleRatingChange}
                    showDeleteHint={true}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-end mt-4">
            <button
              onClick={() => setIsEditing(true)}
              className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
            >
              Edit
            </button>
          </div>
        </>
      )}
    </div>
  );
}