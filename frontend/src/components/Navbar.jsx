import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/login');
  }

  const linkClass = ({ isActive }) =>
    `px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
      isActive
        ? 'text-white'
        : 'text-gray-500 hover:text-gray-200'
    }`;

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 border-b"
      style={{
        background: 'rgba(7,7,15,0.85)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        borderColor: 'var(--border)',
      }}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-16">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center text-sm"
            style={{ background: 'linear-gradient(135deg, #8b5cf6, #ec4899)' }}
          >
            🎬
          </div>
          <span className="font-bold text-lg gradient-text tracking-tight">StreamCal</span>
        </div>

        {/* Nav links */}
        <div
          className="flex items-center gap-1 rounded-xl p-1"
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border)' }}
        >
          {[
            { to: '/calendar', label: 'Calendar' },
            { to: '/search', label: 'Search' },
            { to: '/saved', label: 'My List' },
          ].map(({ to, label }) => (
            <NavLink key={to} to={to} className={linkClass}>
              {({ isActive }) => (
                <span
                  className="relative px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 block"
                  style={
                    isActive
                      ? {
                          background: 'linear-gradient(135deg, rgba(139,92,246,0.3), rgba(236,72,153,0.3))',
                          color: 'white',
                          boxShadow: '0 0 20px rgba(139,92,246,0.15)',
                        }
                      : { color: 'rgba(255,255,255,0.45)' }
                  }
                >
                  {label}
                </span>
              )}
            </NavLink>
          ))}
        </div>

        {/* User */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2.5">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold select-none"
              style={{ background: 'linear-gradient(135deg, #8b5cf6, #ec4899)' }}
            >
              {user?.username?.[0]?.toUpperCase()}
            </div>
            <span className="text-sm text-gray-400 hidden sm:block">{user?.username}</span>
          </div>
          <button
            onClick={handleLogout}
            className="px-3 py-1.5 rounded-lg text-xs font-medium text-gray-600 hover:text-gray-300 transition-colors"
            style={{ border: '1px solid var(--border)' }}
          >
            Sign out
          </button>
        </div>
      </div>
    </nav>
  );
}
