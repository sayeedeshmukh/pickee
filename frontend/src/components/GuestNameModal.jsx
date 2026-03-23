import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { useAuth } from './AuthContext';
import { requireClearText } from '../utils/inputValidation';

export default function GuestNameModal() {
  const { guestName, setGuestName } = useAuth();
  const [name, setName] = useState(guestName || '');

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = name.trim();
    const ok = requireClearText(trimmed, {
      minChars: 2,
      onError: (msg) => toast.error(msg),
    });
    if (!ok) return;
    setGuestName(trimmed);
  };

  return (
    <div
      className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center px-4"
      role="dialog"
      aria-modal="true"
    >
      <div className="w-full max-w-md bg-gray-900/95 border border-white/20 rounded-3xl shadow-2xl p-6 sm:p-8">
        <h2 className="text-white text-2xl sm:text-3xl font-bold text-center mb-2" style={{ color: '#e98198' }}>
          What's your name?
        </h2>
        <p className="text-white/80 text-center mb-6 text-sm sm:text-base">
          We'll remember it for next time.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name here"
            className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-colors"
          />
          <button
            type="submit"
            className="w-full py-3 rounded-xl font-bold text-xl transition-all duration-200 shadow-lg"
            style={{ background: '#e98198', color: '#1c2838' }}
          >
            Save & Continue
          </button>
        </form>
      </div>
    </div>
  );
}

