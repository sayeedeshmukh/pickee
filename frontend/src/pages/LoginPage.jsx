import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../components/AuthContext';
import Header from '../components/Header';

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await login(form.email, form.password);
      navigate('/');
    } catch (err) {
      setError('Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <Header />
      <div className="flex items-center justify-center flex-grow">
        <form onSubmit={handleSubmit} className="bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl p-8 rounded-3xl w-full max-w-md">
          <h2 className="text-4xl font-limelight mb-8 text-center" style={{ color: '#e98198' }}>Login</h2>
          {error && <div className="mb-4 text-pink-400 text-center font-semibold">{error}</div>}
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="w-full mb-4 px-4 py-3 rounded-xl bg-white/20 text-[#fff6e4] placeholder-[#fff6e4] border border-white/30 focus:outline-none focus:ring-2 focus:ring-[#5de7ff] font-medium"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="w-full mb-6 px-4 py-3 rounded-xl bg-white/20 text-[#fff6e4] placeholder-[#fff6e4] border border-white/30 focus:outline-none focus:ring-2 focus:ring-[#5de7ff] font-medium"
            required
          />
          <button
            type="submit"
            className="w-full py-3 rounded-xl font-bold text-xl transition-all duration-200 shadow-lg"
            style={{ background: '#e98198', color: '#1c2838' }}
            disabled={loading}
          >
            {loading ? 'Logging In...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
} 