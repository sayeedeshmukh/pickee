import { createContext, useContext, useState, useEffect } from 'react';
import { loginUser, logoutUser } from '../services/api';

const AuthContext = createContext();

function decodeJwtPayload(jwtToken) {
  const payloadPart = jwtToken?.split?.('.')[1];
  if (!payloadPart) throw new Error('Invalid JWT (missing payload)');

  // JWT payloads are base64url encoded; `atob` expects base64.
  const base64 = payloadPart.replace(/-/g, '+').replace(/_/g, '/');
  const padded = base64.padEnd(base64.length + (4 - (base64.length % 4)) % 4, '=');

  const decoded = atob(padded);
  return JSON.parse(decoded);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [guestName, setGuestNameState] = useState(() => localStorage.getItem('orica_guest_name') || '');

  useEffect(() => {
    if (!token) {
      setUser(null);
      return;
    }

    try {
      const payload = decodeJwtPayload(token);
      if (payload?.id && payload?.username) {
        setUser({ id: payload.id, username: payload.username });
      }
    } catch (err) {
      // Don't crash the app if token decoding fails; keep existing `user`
      // (e.g. after a successful login call).
      console.warn('Failed to decode JWT payload:', err);
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

  const loginWithToken = (nextToken, nextUser) => {
    if (!nextToken) return;
    setToken(nextToken);
    localStorage.setItem('token', nextToken);
    if (nextUser) setUser(nextUser);
  };

  const logout = async () => {
    await logoutUser();
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ user, token, guestName, setGuestName, login, loginWithToken, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
} 