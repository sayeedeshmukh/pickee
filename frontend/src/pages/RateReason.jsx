import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ProConCard from '../components/ProConCard';
import { getDecision, getProsConsByDecision, addProsCons } from '../services/api'; // Added addProsCons import
import { toast } from 'react-hot-toast';
import Rating from '../components/Rating';

export default function RateReason() {
  const { id: decisionId } = useParams()
  const navigate = useNavigate()
  const [decision, setDecision] = useState(null)
  const [prosCons, setProsCons] = useState([])
  const [activeTab, setActiveTab] = useState('A')
  const [newItem, setNewItem] = useState({ text: '', type: 'pro', rating: 5 })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const decisionRes = await getDecision(decisionId)
        const prosConsRes = await getProsConsByDecision(decisionId)
        setDecision(decisionRes.data)
        setProsCons(prosConsRes.data)
      } catch (error) {
        toast.error('Failed to load decision data')
        console.error(error)
      }
    }
    fetchData()
  }, [decisionId])

  const handleAddNew = async () => {
    if (!newItem.text.trim()) {
      toast.error('Please enter text')
      return
    }
    try {
      await addProsCons({
        decisionId,
        option: activeTab,
        type: newItem.type,
        text: newItem.text,
        rating: newItem.rating,
        source: 'user',
      })
      toast.success('Added successfully!')
      setNewItem({ text: '', type: 'pro', rating: 5 })
      const res = await getProsConsByDecision(decisionId)
      setProsCons(res.data)
    } catch (error) {
      toast.error('Failed to add')
      console.error(error)
    }
  }

  const handleContinue = () => {
    navigate(`/decisions/${decisionId}/mindset`)
  }

  if (!decision) return <div>Loading...</div>

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">Rate Pros & Cons</h1>
      
      <div className="flex mb-6 border-b">
        <button
          className={`px-4 py-2 font-medium ${activeTab === 'A' ? 'border-b-2 border-indigo-500 text-indigo-600' : 'text-gray-500'}`}
          onClick={() => setActiveTab('A')}
        >
          {decision.optionA.title}
        </button>
        <button
          className={`px-4 py-2 font-medium ${activeTab === 'B' ? 'border-b-2 border-indigo-500 text-indigo-600' : 'text-gray-500'}`}
          onClick={() => setActiveTab('B')}
        >
          {decision.optionB.title}
        </button>
      </div>

      <div className="mb-8">
        <h2 className="text-lg font-medium mb-3">Add New</h2>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex mb-3">
            <button
              className={`px-3 py-1 mr-2 rounded ${newItem.type === 'pro' ? 'bg-green-100 text-green-800' : 'bg-gray-100'}`}
              onClick={() => setNewItem({ ...newItem, type: 'pro' })}
            >
              Pro
            </button>
            <button
              className={`px-3 py-1 rounded ${newItem.type === 'con' ? 'bg-red-100 text-red-800' : 'bg-gray-100'}`}
              onClick={() => setNewItem({ ...newItem, type: 'con' })}
            >
              Con
            </button>
          </div>
          <textarea
            value={newItem.text}
            onChange={(e) => setNewItem({ ...newItem, text: e.target.value })}
            className="w-full p-2 border rounded mb-3"
            placeholder={`Enter a ${newItem.type} for ${activeTab === 'A' ? decision.optionA.title : decision.optionB.title}`}
            rows={2}
          />
          <div className="flex items-center justify-between">
            <Rating value={newItem.rating} onChange={(val) => setNewItem({ ...newItem, rating: val })} />
            <button
              onClick={handleAddNew}
              className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
            >
              Add
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-lg font-medium">Existing Pros & Cons</h2>
        {prosCons
          .filter(item => item.option === activeTab)
          .map((item) => (
            <ProConCard
              key={item._id}
              item={item}
              decisionId={decisionId}
              onUpdate={async () => {
                const res = await getProsConsByDecision(decisionId)
                setProsCons(res.data)
              }}
            />
          ))}
      </div>

      <div className="mt-8 flex justify-end">
        <button
          onClick={handleContinue}
          className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
        >
          Continue to Mindset
        </button>
      </div>
    </div>
  )
}