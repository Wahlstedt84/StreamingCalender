import StreamingBadge from './StreamingBadge';

const TMDB_IMG = 'https://image.tmdb.org/t/p/w342';

export default function MediaCard({ item, onSave, onRemove, isSaved }) {
  const type = item.media_type || item.type;
  const title = item.title || item.name;
  const year = (item.release_date || item.first_air_date || '').slice(0, 4);
  const posterUrl = item.poster_path ? `${TMDB_IMG}${item.poster_path}` : null;

  return (
    <div className="group relative rounded-2xl overflow-hidden cursor-pointer select-none" style={{ boxShadow: '0 20px 50px rgba(0,0,0,0.5)' }}>
      {/* Poster */}
      <div className="aspect-[2/3] bg-[#13132a] overflow-hidden">
        {posterUrl ? (
          <img
            src={posterUrl}
            alt={title}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-5xl" style={{ background: 'var(--surface2)' }}>
            {type === 'tv' ? '📺' : '🎬'}
          </div>
        )}
      </div>

      {/* Gradient overlay — always */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.97) 0%, rgba(0,0,0,0.4) 45%, rgba(0,0,0,0.05) 100%)' }}
      />

      {/* Top badge */}
      <div className="absolute top-3 left-3">
        <span
          className="px-2 py-0.5 rounded-md text-xs font-bold uppercase tracking-widest"
          style={
            type === 'tv'
              ? { background: 'rgba(99,102,241,0.85)', color: 'white' }
              : { background: 'rgba(168,85,247,0.85)', color: 'white' }
          }
        >
          {type === 'tv' ? 'Series' : 'Movie'}
        </span>
      </div>

      {/* Bottom info */}
      <div className="absolute bottom-0 left-0 right-0 p-3.5">
        {/* Streaming badges */}
        {item.providers && item.providers.length > 0 && (
          <div className="flex gap-1 mb-2 flex-wrap">
            {item.providers.slice(0, 4).map(p => (
              <StreamingBadge key={p.provider_id} provider={p} />
            ))}
          </div>
        )}

        <h3 className="text-white font-semibold text-sm leading-snug line-clamp-2 mb-0.5">{title}</h3>
        {year && <p className="text-xs font-medium" style={{ color: 'rgba(255,255,255,0.35)' }}>{year}</p>}

        {/* Action button — slides up on hover */}
        <div className="overflow-hidden transition-all duration-300 max-h-0 group-hover:max-h-12 mt-0 group-hover:mt-2.5">
          <button
            onClick={isSaved ? onRemove : () => onSave(item)}
            className="w-full py-2 rounded-xl text-xs font-semibold transition-all duration-200"
            style={
              isSaved
                ? { background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)', color: '#f87171' }
                : { background: 'linear-gradient(135deg, #8b5cf6, #ec4899)', color: 'white', border: 'none' }
            }
          >
            {isSaved ? 'Remove from list' : '+ Add to My List'}
          </button>
        </div>
      </div>

      {/* Gradient border glow on hover */}
      <div
        className="absolute inset-0 rounded-2xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background: 'transparent',
          boxShadow: 'inset 0 0 0 1px rgba(139,92,246,0.4)',
        }}
      />
    </div>
  );
}
