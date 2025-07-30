import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import Header from '../components/Header';

export default function SignupPage() {
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post('/api/auth/register', form);
      toast.success('Account created! Please log in.');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <Header />
      <div className="flex items-center justify-center flex-grow">
        <form onSubmit={handleSubmit} className="bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl p-8 rounded-3xl w-full max-w-md">
          <h2 className="text-4xl font-limelight mb-8 text-center" style={{ color: '#5de7ff' }}>Sign Up</h2>
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={form.username}
            onChange={handleChange}
            className="w-full mb-4 px-4 py-3 rounded-xl bg-white/20 text-[#fff6e4] placeholder-[#fff6e4] border border-white/30 focus:outline-none focus:ring-2 focus:ring-[#e98198] font-medium"
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="w-full mb-4 px-4 py-3 rounded-xl bg-white/20 text-[#fff6e4] placeholder-[#fff6e4] border border-white/30 focus:outline-none focus:ring-2 focus:ring-[#e98198] font-medium"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="w-full mb-6 px-4 py-3 rounded-xl bg-white/20 text-[#fff6e4] placeholder-[#fff6e4] border border-white/30 focus:outline-none focus:ring-2 focus:ring-[#e98198] font-medium"
            required
          />
          <button
            type="submit"
            className="w-full py-3 rounded-xl font-bold text-xl transition-all duration-200 shadow-lg"
            style={{ background: '#5de7ff', color: '#1c2838' }}
            disabled={loading}
          >
            {loading ? 'Signing Up...' : 'Sign Up'}
          </button>
        </form>
      </div>
    </div>
  );
} 