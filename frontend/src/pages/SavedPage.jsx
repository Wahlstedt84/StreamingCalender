import { useState, useEffect } from 'react';
import { getSaved, deleteItem } from '../services/api';
import MediaCard from '../components/MediaCard';

export default function SavedPage() {
  const [saved, setSaved] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSaved()
      .then(setSaved)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  async function handleRemove(dbId) {
    await deleteItem(dbId);
    setSaved(prev => prev.filter(s => s.id !== dbId));
  }

  const tvShows = saved.filter(s => s.type === 'tv');
  const movies = saved.filter(s => s.type === 'movie');

  if (loading) {
    return (
      <div className="flex items-center justify-center mt-32">
        <div
          className="w-10 h-10 rounded-full border-2 border-transparent animate-spin"
          style={{ borderTopColor: '#8b5cf6', borderRightColor: '#ec4899' }}
        />
      </div>
    );
  }

  if (saved.length === 0) {
    return (
      <div className="animate-fade-in">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-1">My List</h1>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Your saved movies and series</p>
        </div>
        <div className="text-center mt-24 select-none">
          <p className="text-6xl mb-5 opacity-20">📋</p>
          <p className="font-medium text-gray-400">Your list is empty</p>
          <p className="text-sm mt-2" style={{ color: 'var(--text-muted)' }}>
            Search for movies and series and add them to track releases
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in space-y-12">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">My List</h1>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
            {saved.length} item{saved.length !== 1 ? 's' : ''} saved
          </p>
        </div>
      </div>

      {tvShows.length > 0 && (
        <section>
          <div className="flex items-center gap-3 mb-5">
            <span className="text-lg">📺</span>
            <h2 className="text-sm font-semibold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
              Series
            </h2>
            <span
              className="px-2 py-0.5 rounded-full text-xs font-bold"
              style={{ background: 'rgba(139,92,246,0.15)', color: '#a78bfa' }}
            >
              {tvShows.length}
            </span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {tvShows.map(item => (
              <MediaCard
                key={item.id}
                item={{ ...item, id: item.tmdb_id, media_type: item.type }}
                onSave={() => {}}
                onRemove={() => handleRemove(item.id)}
                isSaved={true}
              />
            ))}
          </div>
        </section>
      )}

      {movies.length > 0 && (
        <section>
          <div className="flex items-center gap-3 mb-5">
            <span className="text-lg">🎬</span>
            <h2 className="text-sm font-semibold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
              Movies
            </h2>
            <span
              className="px-2 py-0.5 rounded-full text-xs font-bold"
              style={{ background: 'rgba(236,72,153,0.15)', color: '#f472b6' }}
            >
              {movies.length}
            </span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {movies.map(item => (
              <MediaCard
                key={item.id}
                item={{ ...item, id: item.tmdb_id, media_type: item.type }}
                onSave={() => {}}
                onRemove={() => handleRemove(item.id)}
                isSaved={true}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
