import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const storedToken = localStorage.getItem('streamcal_token');
    const storedUser = localStorage.getItem('streamcal_user');
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
    setReady(true);
  }, []);

  function login(newToken, username) {
    localStorage.setItem('streamcal_token', newToken);
    localStorage.setItem('streamcal_user', JSON.stringify({ username }));
    setToken(newToken);
    setUser({ username });
  }

  function logout() {
    localStorage.removeItem('streamcal_token');
    localStorage.removeItem('streamcal_user');
    setToken(null);
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, token, login, logout, ready }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
