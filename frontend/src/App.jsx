
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home';
import CreateDecision from './pages/CreateDecision';
import RateReason from './pages/RateReason';
import Results from './pages/Results';
import { Toaster } from 'react-hot-toast'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Toaster position="top-right" />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/decisions/create" element={<CreateDecision />} />
          <Route path="/decisions/:id/rate" element={<RateReason />} />
          <Route path="/decisions/:id/results" element={<Results />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App