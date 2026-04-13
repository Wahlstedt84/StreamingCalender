import { useState, useEffect } from 'react';
import { getCalendarEvents } from '../services/api';
import StreamingBadge from '../components/StreamingBadge';

const TMDB_IMG_SM = 'https://image.tmdb.org/t/p/w92';

const MONTHS = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December',
];
const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function toKey(year, month, day) {
  return `${year}-${String(month + 1).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
}
function todayKey() {
  const t = new Date();
  return toKey(t.getFullYear(), t.getMonth(), t.getDate());
}

export default function CalendarPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);

  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());

  useEffect(() => {
    getCalendarEvents()
      .then(setEvents)
      .catch(() => setError('Failed to load. Check your TMDB API key.'))
      .finally(() => setLoading(false));
  }, []);

  const eventsByDate = {};
  for (const e of events) {
    if (!eventsByDate[e.date]) eventsByDate[e.date] = [];
    eventsByDate[e.date].push(e);
  }

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = todayKey();

  function prevMonth() {
    if (month === 0) { setMonth(11); setYear(y => y - 1); }
    else setMonth(m => m - 1);
  }
  function nextMonth() {
    if (month === 11) { setMonth(0); setYear(y => y + 1); }
    else setMonth(m => m + 1);
  }
  function goToday() {
    setMonth(now.getMonth()); setYear(now.getFullYear()); setSelectedDate(null);
  }

  const selectedEvents = selectedDate ? (eventsByDate[selectedDate] || []) : [];
  const upcomingEvents = events.filter(e => e.date >= today).slice(0, 30);
  const sidebarEvents = selectedDate ? selectedEvents : upcomingEvents;
  const sidebarTitle = selectedDate
    ? new Date(selectedDate + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })
    : 'Upcoming';

  if (loading) {
    return (
      <div className="flex items-center justify-center mt-40">
        <div
          className="w-10 h-10 rounded-full border-2 border-transparent animate-spin"
          style={{ borderTopColor: '#8b5cf6', borderRightColor: '#ec4899' }}
        />
      </div>
    );
  }

  return (
    <div className="animate-fade-in flex gap-6 flex-col lg:flex-row">
      {/* Calendar */}
      <div className="flex-1 min-w-0">
        {/* Month header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">
              {MONTHS[month]} <span className="font-light" style={{ color: 'rgba(255,255,255,0.3)' }}>{year}</span>
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={prevMonth}
              className="w-9 h-9 rounded-xl flex items-center justify-center text-gray-400 hover:text-white transition-all"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)' }}
            >
              ‹
            </button>
            <button
              onClick={goToday}
              className="px-4 py-2 rounded-xl text-xs font-semibold transition-all"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', color: 'rgba(255,255,255,0.5)' }}
            >
              Today
            </button>
            <button
              onClick={nextMonth}
              className="w-9 h-9 rounded-xl flex items-center justify-center text-gray-400 hover:text-white transition-all"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)' }}
            >
              ›
            </button>
          </div>
        </div>

        {error && (
          <div className="px-5 py-4 rounded-2xl text-sm text-red-400 mb-6" style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.15)' }}>
            {error}
          </div>
        )}

        {events.length === 0 && !error && (
          <div className="px-5 py-4 rounded-2xl text-sm mb-6" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', color: 'var(--text-muted)' }}>
            No releases yet — add some series or movies to your list.
          </div>
        )}

        {/* Day headers */}
        <div className="grid grid-cols-7 mb-2">
          {DAYS.map(d => (
            <div key={d} className="text-center py-2 text-xs font-semibold uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.2)' }}>
              {d}
            </div>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-7 gap-1.5">
          {Array.from({ length: firstDay }, (_, i) => (
            <div key={`e${i}`} className="min-h-[90px]" />
          ))}

          {Array.from({ length: daysInMonth }, (_, i) => {
            const day = i + 1;
            const dateStr = toKey(year, month, day);
            const dayEvents = eventsByDate[dateStr] || [];
            const isToday = dateStr === today;
            const isSelected = dateStr === selectedDate;
            const hasEvents = dayEvents.length > 0;

            return (
              <div
                key={dateStr}
                onClick={() => setSelectedDate(isSelected ? null : dateStr)}
                className="min-h-[90px] p-2 rounded-2xl cursor-pointer transition-all duration-200 select-none"
                style={{
                  background: isSelected
                    ? 'rgba(139,92,246,0.12)'
                    : hasEvents
                      ? 'rgba(255,255,255,0.04)'
                      : 'rgba(255,255,255,0.02)',
                  border: isSelected
                    ? '1px solid rgba(139,92,246,0.5)'
                    : hasEvents
                      ? '1px solid rgba(255,255,255,0.07)'
                      : '1px solid rgba(255,255,255,0.03)',
                  boxShadow: isSelected ? '0 0 20px rgba(139,92,246,0.1)' : 'none',
                }}
              >
                {/* Day number */}
                <div className="flex items-start justify-between mb-1.5">
                  <span
                    className="w-6 h-6 flex items-center justify-center rounded-lg text-xs font-semibold"
                    style={
                      isToday
                        ? { background: 'linear-gradient(135deg, #8b5cf6, #ec4899)', color: 'white' }
                        : { color: hasEvents ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.2)' }
                    }
                  >
                    {day}
                  </span>
                  {dayEvents.length > 0 && (
                    <span className="text-xs font-semibold" style={{ color: 'rgba(139,92,246,0.7)' }}>
                      {dayEvents.length}
                    </span>
                  )}
                </div>

                {/* Events */}
                <div className="flex flex-col gap-0.5">
                  {dayEvents.slice(0, 3).map((ev, i) => (
                    <div key={i} className="flex items-center gap-1 min-w-0">
                      {ev.poster_path ? (
                        <img
                          src={`${TMDB_IMG_SM}${ev.poster_path}`}
                          alt=""
                          className="w-3.5 h-3.5 rounded-sm object-cover flex-shrink-0 opacity-80"
                        />
                      ) : (
                        <span className="text-xs flex-shrink-0 leading-none opacity-60">
                          {ev.type === 'tv' ? '📺' : '🎬'}
                        </span>
                      )}
                      <span className="text-xs truncate leading-snug" style={{ color: 'rgba(255,255,255,0.55)' }}>
                        {ev.episode || ev.title}
                      </span>
                    </div>
                  ))}
                  {dayEvents.length > 3 && (
                    <span className="text-xs pl-0.5" style={{ color: 'rgba(139,92,246,0.6)' }}>
                      +{dayEvents.length - 3} more
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Sidebar */}
      <div className="lg:w-72 xl:w-80 flex-shrink-0">
        <div
          className="rounded-2xl overflow-hidden lg:sticky lg:top-24"
          style={{
            background: 'rgba(13,13,28,0.7)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '1px solid var(--border)',
          }}
        >
          {/* Sidebar header */}
          <div className="px-5 py-4 flex items-center justify-between" style={{ borderBottom: '1px solid var(--border)' }}>
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest mb-0.5" style={{ color: 'var(--text-muted)' }}>
                {selectedDate ? 'Selected day' : 'Coming up'}
              </p>
              <h2 className="text-sm font-semibold text-white">{sidebarTitle}</h2>
            </div>
            {selectedDate && (
              <button
                onClick={() => setSelectedDate(null)}
                className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-600 hover:text-gray-400 transition-colors text-xs"
                style={{ background: 'rgba(255,255,255,0.05)' }}
              >
                ✕
              </button>
            )}
          </div>

          <div className="p-4 max-h-[70vh] overflow-y-auto">
            {sidebarEvents.length === 0 ? (
              <div className="text-center py-12 select-none">
                <p className="text-3xl mb-3 opacity-20">📅</p>
                <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                  {selectedDate ? 'Nothing on this day' : 'No upcoming releases'}
                </p>
              </div>
            ) : (
              <div className="flex flex-col">
                {sidebarEvents.map((ev, i) => (
                  <EventItem key={i} event={ev} showDate={!selectedDate} isLast={i === sidebarEvents.length - 1} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function EventItem({ event, showDate, isLast }) {
  return (
    <div
      className="flex gap-3 items-start py-4"
      style={{ borderBottom: isLast ? 'none' : '1px solid rgba(255,255,255,0.04)' }}
    >
      {event.poster_path ? (
        <img
          src={`${TMDB_IMG_SM}${event.poster_path}`}
          alt={event.title}
          className="w-10 h-[58px] object-cover rounded-xl flex-shrink-0"
          style={{ boxShadow: '0 8px 20px rgba(0,0,0,0.4)' }}
        />
      ) : (
        <div
          className="w-10 h-[58px] rounded-xl flex items-center justify-center text-xl flex-shrink-0"
          style={{ background: 'var(--surface2)' }}
        >
          {event.type === 'tv' ? '📺' : '🎬'}
        </div>
      )}

      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-white leading-tight truncate">{event.title}</p>

        {event.episode && (
          <p className="text-xs font-mono mt-0.5" style={{ color: '#a78bfa' }}>{event.episode}</p>
        )}

        {event.episode_title && (
          <p className="text-xs mt-0.5 truncate italic" style={{ color: 'rgba(255,255,255,0.3)' }}>
            "{event.episode_title}"
          </p>
        )}

        {showDate && (
          <p className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.3)' }}>
            {new Date(event.date + 'T12:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </p>
        )}

        {event.providers && event.providers.length > 0 && (
          <div className="flex gap-1 mt-2 flex-wrap">
            {event.providers.slice(0, 5).map(p => (
              <StreamingBadge key={p.provider_id} provider={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
