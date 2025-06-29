import { useState } from 'react'
import Rating from './Rating'
import { addProsCons } from '../services/api'
import { toast } from 'react-hot-toast'

export default function ProConCard({ item, decisionId, onUpdate }) {
  const [rating, setRating] = useState(item.rating || 5)
  const [isEditing, setIsEditing] = useState(false)
  const [text, setText] = useState(item.text || '')

  const handleSave = async () => {
    try {
      await addProsCons({
        decisionId,
        option: item.option,
        type: item.type,
        text,
        rating,
        source: 'user',
      })
      toast.success(`${item.type === 'pro' ? 'Pro' : 'Con'} saved!`)
      setIsEditing(false)
      if (onUpdate) onUpdate()
    } catch (error) {
      toast.error('Failed to save')
      console.error(error)
    }
  }

  return (
    <div className={`p-4 rounded-lg mb-3 ${item.type === 'pro' ? 'bg-green-50' : 'bg-red-50'}`}>
      {isEditing ? (
        <>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full p-2 border rounded mb-2"
            rows={2}
          />
          <Rating value={rating} onChange={setRating} />
          <div className="flex justify-end space-x-2 mt-2">
            <button
              onClick={() => setIsEditing(false)}
              className="px-3 py-1 text-sm text-gray-600"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-3 py-1 text-sm bg-indigo-600 text-white rounded"
            >
              Save
            </button>
          </div>
        </>
      ) : (
        <>
          <div className="flex justify-between items-start">
            <p className="font-medium">{item.text}</p>
            <Rating value={rating} readOnly />
          </div>
          <div className="flex justify-end mt-2">
            <button
              onClick={() => setIsEditing(true)}
              className="text-sm text-indigo-600 hover:text-indigo-800"
            >
              Edit
            </button>
          </div>
        </>
      )}
    </div>
  )
}