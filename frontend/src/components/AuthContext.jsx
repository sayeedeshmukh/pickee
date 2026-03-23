import { createContext, useContext, useState, useEffect } from 'react';
import { loginUser, logoutUser } from '../services/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [guestName, setGuestNameState] = useState(() => localStorage.getItem('orica_guest_name') || '');

  useEffect(() => {
    if (token) {
      // Optionally decode token for user info
      const payload = JSON.parse(atob(token.split('.')[1]));
      setUser({ id: payload.id, username: payload.username });
    } else {
      setUser(null);
    }
  }, [token]);

  const setGuestName = (name) => {
    const trimmed = (name || '').trim();
    setGuestNameState(trimmed);
    localStorage.setItem('orica_guest_name', trimmed);
  };

  const login = async (email, password) => {
    const res = await loginUser({ email, password });
    setToken(res.data.token);
    localStorage.setItem('token', res.data.token);
    setUser(res.data.user);
    return res.data.user;
  };

  const logout = async () => {
    await logoutUser();
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ user, token, guestName, setGuestName, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
} 