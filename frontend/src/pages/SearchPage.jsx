import { useState, useEffect } from 'react';
import { searchMedia, saveItem, getSaved, deleteItem } from '../services/api';
import MediaCard from '../components/MediaCard';

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [saved, setSaved] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    getSaved().then(setSaved).catch(() => {});
  }, []);

  const savedSet = new Set(saved.map(s => `${s.type}-${s.tmdb_id}`));

  async function handleSearch(e) {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    setError(null);
    setSearched(true);
    try {
      const data = await searchMedia(query.trim());
      setResults(data.results || []);
    } catch {
      setError('Search failed. Is your TMDB API key configured?');
    } finally {
      setLoading(false);
    }
  }

  async function handleSave(item) {
    try {
      const saved_item = await saveItem({
        tmdb_id: item.id,
        type: item.media_type,
        title: item.title || item.name,
        poster_path: item.poster_path || null,
        overview: item.overview || null,
        first_air_date: item.release_date || item.first_air_date || null,
      });
      setSaved(prev => [...prev, saved_item]);
    } catch (err) {
      if (err.message !== 'Already saved') alert(err.message);
    }
  }

  async function handleRemove(item) {
    const match = saved.find(s => s.tmdb_id === item.id && s.type === item.media_type);
    if (!match) return;
    await deleteItem(match.id);
    setSaved(prev => prev.filter(s => s.id !== match.id));
  }

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-1">Search</h1>
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Find movies and series to track</p>
      </div>

      {/* Search bar */}
      <form onSubmit={handleSearch} className="relative mb-10 flex gap-3">
        <div className="relative flex-1">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg pointer-events-none" style={{ color: 'rgba(255,255,255,0.2)' }}>
            🔍
          </span>
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search movies and series..."
            className="input-glow w-full rounded-2xl pl-12 pr-5 py-4 text-white text-sm transition-all"
            style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
            }}
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="btn-brand px-8 py-4 rounded-2xl text-sm whitespace-nowrap"
        >
          {loading ? 'Searching...' : 'Search'}
        </button>
      </form>

      {error && (
        <div
          className="px-5 py-4 rounded-2xl text-sm text-red-400 mb-8"
          style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.15)' }}
        >
          {error}
        </div>
      )}

      {/* Results */}
      {results.length > 0 && (
        <>
          <p className="text-xs mb-5 font-medium uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
            {results.length} results
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {results.map(item => (
              <MediaCard
                key={`${item.media_type}-${item.id}`}
                item={item}
                onSave={handleSave}
                onRemove={() => handleRemove(item)}
                isSaved={savedSet.has(`${item.media_type}-${item.id}`)}
              />
            ))}
          </div>
        </>
      )}

      {!loading && searched && results.length === 0 && !error && (
        <div className="text-center mt-24">
          <p className="text-4xl mb-4">🔍</p>
          <p className="text-gray-400">No results for "{query}"</p>
          <p className="text-sm mt-2" style={{ color: 'var(--text-muted)' }}>Try a different search term</p>
        </div>
      )}

      {!searched && (
        <div className="text-center mt-24 select-none">
          <p className="text-6xl mb-5 opacity-20">🎬</p>
          <p className="font-medium text-gray-500">Search for your favorite shows and movies</p>
        </div>
      )}
    </div>
  );
}
