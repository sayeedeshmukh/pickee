import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <div className="max-w-3xl mx-auto py-12 px-4 text-center">
      <h1 className="text-4xl font-bold mb-6">Decision Helper</h1>
      <p className="text-lg mb-8">
        Struggling to make a decision? We'll help you weigh the pros and cons to
        make the best choice.
      </p>
      <Link
        to="/decisions/create"
        className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
      >
        Start New Decision
      </Link>
    </div>
  )
}