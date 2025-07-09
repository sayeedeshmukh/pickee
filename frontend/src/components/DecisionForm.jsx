import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createDecision } from '../services/api';
import { toast } from 'react-hot-toast';

export default function DecisionForm({ onDecisionCreated }) {
  const [formData, setFormData] = useState({
    optionA: { title: '', pros: [], cons: [] },
    optionB: { title: '', pros: [], cons: [] },
    userName: '',
  })
  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value } = e.target
    if (name.includes('optionA') || name.includes('optionB')) {
      const [option, field] = name.split('.')
      setFormData(prev => ({
        ...prev,
        [option]: { ...prev[option], [field]: value }
      }))
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
    }
  }

 const handleSubmit = async (e) => {
  e.preventDefault()
  try {
    console.log("📤 Submitting decision form with:", formData)

    const response = await createDecision(formData)
    console.log("✅ Decision created:", response.data)

    toast.success('Decision created!')
    if (onDecisionCreated) {
      console.log("➡️ Triggering onDecisionCreated with ID:", response.data._id)
      onDecisionCreated(response.data._id)
    } else {
      navigate(`/decisions/${response.data._id}/rate`)
    }
  } catch (error) {
    toast.error('Failed to create decision')
    console.error("🚨 Error creating decision:", error)
  }
}


  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700">Your Name</label>
        <input
          type="text"
          name="userName"
          value={formData.userName}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="border p-4 rounded-lg">
          <h3 className="text-lg font-medium mb-4">Option A</h3>
          <div>
            <label className="block text-sm font-medium text-gray-700">Title</label>
            <input
              type="text"
              name="optionA.title"
              value={formData.optionA.title}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </div>
        </div>

        <div className="border p-4 rounded-lg">
          <h3 className="text-lg font-medium mb-4">Option B</h3>
          <div>
            <label className="block text-sm font-medium text-gray-700">Title</label>
            <input
              type="text"
              name="optionB.title"
              value={formData.optionB.title}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </div>
        </div>
      </div>

      <button
        type="submit"
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        Create Decision
      </button>
    </form>
  )
}