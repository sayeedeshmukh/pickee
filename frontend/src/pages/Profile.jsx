import { useAuth } from '../components/AuthContext';
import { useEffect, useState } from 'react';
import { getUserDecisionHistory } from '../services/api';
import { useNavigate } from 'react-router-dom';

export default function Profile() {
  const { user, token, logout } = useAuth();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
    getUserDecisionHistory(token)
      .then(res => setHistory(res.data))
      .catch(() => setHistory([]))
      .finally(() => setLoading(false));
  }, [token, navigate]);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex flex-col items-center justify-start py-10 relative overflow-x-hidden">
      {/* Decorative background blobs */}
      <div className="absolute top-10 left-10 w-32 h-32 bg-pink-500/20 rounded-full blur-2xl z-0"></div>
      <div className="absolute top-40 right-20 w-40 h-40 bg-purple-500/20 rounded-full blur-2xl z-0"></div>
      <div className="absolute bottom-20 left-1/4 w-28 h-28 bg-cyan-500/20 rounded-full blur-2xl z-0"></div>
      <div className="absolute bottom-40 right-1/3 w-20 h-20 bg-blue-500/20 rounded-full blur-2xl z-0"></div>
      <div className="relative z-10 w-full flex justify-center">
        <div className="w-full max-w-3xl mx-auto p-4 sm:p-8 rounded-3xl shadow-2xl min-h-[60vh] flex flex-col gap-8 border border-white/30 backdrop-blur-md" style={{background: 'rgba(24,33,50,0.75)'}}>
          <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-10">
            <div className="w-24 h-24 rounded-full flex items-center justify-center text-5xl font-bold border-4 shadow shrink-0" style={{ background: '#5de7ff', color: '#fff6e4', borderColor: '#e98198' }}>
              <span role="img" aria-label="profile">👤</span>
            </div>
            <div className="flex-1 text-center sm:text-left">
              <h2 className="text-4xl md:text-5xl font-limelight mb-2 text-white drop-shadow" style={{ color: '#fff' }}>{user.username}</h2>
              <p className="text-white/90 font-medium break-all text-lg drop-shadow">{user.email}</p>
              <button className="mt-4 px-6 py-2 rounded-lg font-medium hover:bg-blue-300/60 transition-colors w-full sm:w-auto shadow text-blue-900 bg-white/80" onClick={logout}>Logout</button>
            </div>
          </div>
          <div>
            <h3 className="text-3xl font-semibold mb-4 text-center font-limelight text-white drop-shadow">Your Decision History</h3>
            {loading ? (
              <p className="text-white/80 text-center">Loading...</p>
            ) : history.length === 0 ? (
              <p className="text-white/60 text-center">No decisions found.</p>
            ) : (
              <ul className="space-y-4">
                {history.map(decision => (
                  <li key={decision._id} className="p-4 rounded-xl border border-white/30 hover:shadow-lg transition-all cursor-pointer bg-white/20 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2" onClick={() => navigate(`/decisions/${decision._id}/results`)}>
                    <div className="text-center sm:text-left">
                      <span className="font-bold text-lg md:text-xl text-white drop-shadow" style={{ color: '#fff' }}>{decision.optionA?.title || 'Option A'}</span>
                      <span className="mx-2 text-white/70">vs</span>
                      <span className="font-bold text-lg md:text-xl text-white drop-shadow" style={{ color: '#fff' }}>{decision.optionB?.title || 'Option B'}</span>
                    </div>
                    <div className="text-sm text-white/80 text-center sm:text-right">{new Date(decision.createdAt).toLocaleString()}</div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 