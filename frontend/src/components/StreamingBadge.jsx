const TMDB_IMG = 'https://image.tmdb.org/t/p/w45';

export default function StreamingBadge({ provider }) {
  if (!provider?.logo_path) return null;

  return (
    <div className="relative group/badge">
      <img
        src={`${TMDB_IMG}${provider.logo_path}`}
        alt={provider.provider_name}
        className="w-6 h-6 rounded-md object-cover"
        style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.5)' }}
      />
      <div
        className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 rounded-lg text-xs text-white whitespace-nowrap opacity-0 group-hover/badge:opacity-100 transition-opacity duration-150 pointer-events-none z-30"
        style={{
          background: 'rgba(13,13,28,0.95)',
          border: '1px solid rgba(255,255,255,0.1)',
          boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
        }}
      >
        {provider.provider_name}
      </div>
    </div>
  );
}
