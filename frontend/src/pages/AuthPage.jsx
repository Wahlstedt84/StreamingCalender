import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function AuthPage() {
  const [mode, setMode] = useState('login');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch(`/api/auth/${mode}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: username.trim(), password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Something went wrong');
        return;
      }

      login(data.token, data.username);
      navigate('/calendar');
    } catch {
      setError('Could not connect to server');
    } finally {
      setLoading(false);
    }
  }

  function switchMode() {
    setMode(m => (m === 'login' ? 'signup' : 'login'));
    setError(null);
    setPassword('');
  }

  return (
    <div className="auth-bg min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
      {/* Glow orbs */}
      <div className="auth-orb-1" />
      <div className="auth-orb-2" />

      {/* Floating logo above card */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 select-none">
        <div
          className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-brand"
          style={{ background: 'linear-gradient(135deg, #8b5cf6, #ec4899)' }}
        >
          🎬
        </div>
        <span className="gradient-text font-bold text-xl tracking-tight">StreamCal</span>
      </div>

      {/* Card */}
      <div
        className="w-full max-w-sm rounded-2xl p-8 relative animate-slide-up"
        style={{
          background: 'rgba(13,13,28,0.8)',
          backdropFilter: 'blur(40px)',
          WebkitBackdropFilter: 'blur(40px)',
          border: '1px solid rgba(255,255,255,0.08)',
          boxShadow: '0 40px 80px rgba(0,0,0,0.5), 0 0 60px rgba(139,92,246,0.05)',
        }}
      >
        <h2 className="text-xl font-bold text-white mb-1">
          {mode === 'login' ? 'Welcome back' : 'Create account'}
        </h2>
        <p className="text-sm text-gray-500 mb-7">
          {mode === 'login'
            ? 'Sign in to your streaming calendar'
            : 'Start tracking your releases'}
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-2 uppercase tracking-wider">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
              placeholder="your username"
              autoComplete="username"
              required
              className="input-glow w-full rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 transition-all"
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
              }}
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-400 mb-2 uppercase tracking-wider">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
              required
              className="input-glow w-full rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 transition-all"
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
              }}
            />
            {mode === 'signup' && (
              <p className="text-xs text-gray-600 mt-1.5 ml-1">Minimum 4 characters</p>
            )}
          </div>

          {error && (
            <div
              className="px-4 py-3 rounded-xl text-sm text-red-400"
              style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}
            >
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn-brand w-full py-3 rounded-xl text-sm mt-1"
          >
            {loading
              ? (mode === 'login' ? 'Signing in...' : 'Creating account...')
              : (mode === 'login' ? 'Sign in' : 'Create account')}
          </button>
        </form>

        <div className="mt-6 pt-6 text-center" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <span className="text-sm text-gray-600">
            {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
          </span>
          <button
            onClick={switchMode}
            className="text-sm font-semibold transition-colors"
            style={{ color: '#a78bfa' }}
            onMouseEnter={e => (e.target.style.color = '#c4b5fd')}
            onMouseLeave={e => (e.target.style.color = '#a78bfa')}
          >
            {mode === 'login' ? 'Sign up' : 'Sign in'}
          </button>
        </div>
      </div>
    </div>
  );
}
