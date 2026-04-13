import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import CalendarPage from './pages/CalendarPage';
import SearchPage from './pages/SearchPage';
import SavedPage from './pages/SavedPage';
import AuthPage from './pages/AuthPage';

function ProtectedRoute({ children }) {
  const { user, ready } = useAuth();
  if (!ready) return null;
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

function AppRoutes() {
  const { user, ready } = useAuth();
  if (!ready) return null;

  return (
    <>
      {user && <Navbar />}
      <main className={user ? 'max-w-7xl mx-auto px-6 py-8 pt-24' : ''}>
        <Routes>
          <Route path="/login" element={user ? <Navigate to="/calendar" replace /> : <AuthPage />} />
          <Route path="/calendar" element={<ProtectedRoute><CalendarPage /></ProtectedRoute>} />
          <Route path="/search" element={<ProtectedRoute><SearchPage /></ProtectedRoute>} />
          <Route path="/saved" element={<ProtectedRoute><SavedPage /></ProtectedRoute>} />
          <Route path="*" element={<Navigate to={user ? '/calendar' : '/login'} replace />} />
        </Routes>
      </main>
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen" style={{ background: 'var(--bg)' }}>
        <AppRoutes />
      </div>
    </AuthProvider>
  );
}
