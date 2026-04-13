const express = require('express');
const router = express.Router();
const { getDB } = require('../db/database');
const { getTVDetails, getMovieDetails, getTVSeasonDetails } = require('../services/tmdb');
const auth = require('../middleware/auth');

const COUNTRY = process.env.WATCH_PROVIDER_COUNTRY || 'SE';

function extractProviders(watchProviders) {
  const regional = watchProviders?.results?.[COUNTRY] || {};
  return [
    ...(regional.flatrate || []),
    ...(regional.free || []),
    ...(regional.ads || []),
  ];
}

function padEpisode(season, episode) {
  return `S${String(season).padStart(2, '0')}E${String(episode).padStart(2, '0')}`;
}

async function getEventsForTV(item) {
  const events = [];

  try {
    const details = await getTVDetails(item.tmdb_id);
    const providers = extractProviders(details['watch/providers']);

    const nextEp = details.next_episode_to_air;
    const currentSeason = nextEp?.season_number || details.last_episode_to_air?.season_number;

    if (currentSeason) {
      try {
        const season = await getTVSeasonDetails(item.tmdb_id, currentSeason);
        const today = new Date().toISOString().split('T')[0];

        for (const ep of season.episodes || []) {
          if (ep.air_date && ep.air_date >= today) {
            events.push({
              date: ep.air_date,
              title: item.title,
              episode: padEpisode(ep.season_number, ep.episode_number),
              episode_title: ep.name || null,
              type: 'tv',
              tmdb_id: item.tmdb_id,
              poster_path: item.poster_path,
              providers,
            });
          }
        }
      } catch {
        if (nextEp?.air_date) {
          events.push({
            date: nextEp.air_date,
            title: item.title,
            episode: padEpisode(nextEp.season_number, nextEp.episode_number),
            episode_title: nextEp.name || null,
            type: 'tv',
            tmdb_id: item.tmdb_id,
            poster_path: item.poster_path,
            providers,
          });
        }
      }
    } else if (nextEp?.air_date) {
      events.push({
        date: nextEp.air_date,
        title: item.title,
        episode: padEpisode(nextEp.season_number, nextEp.episode_number),
        episode_title: nextEp.name || null,
        type: 'tv',
        tmdb_id: item.tmdb_id,
        poster_path: item.poster_path,
        providers,
      });
    }
  } catch (err) {
    console.error(`TV ${item.tmdb_id} error:`, err.message);
  }

  return events;
}

async function getEventsForMovie(item) {
  try {
    const details = await getMovieDetails(item.tmdb_id);
    const providers = extractProviders(details['watch/providers']);

    if (details.release_date) {
      return [{
        date: details.release_date,
        title: item.title,
        episode: null,
        episode_title: null,
        type: 'movie',
        tmdb_id: item.tmdb_id,
        poster_path: item.poster_path,
        providers,
      }];
    }
  } catch (err) {
    console.error(`Movie ${item.tmdb_id} error:`, err.message);
  }

  return [];
}

router.get('/', auth, async (req, res) => {
  const db = getDB();
  const items = db.prepare('SELECT * FROM saved_items WHERE user_id = ?').all(req.userId);

  try {
    const results = await Promise.all(
      items.map(item =>
        item.type === 'tv' ? getEventsForTV(item) : getEventsForMovie(item)
      )
    );

    const allEvents = results.flat().sort((a, b) => a.date.localeCompare(b.date));
    res.json(allEvents);
  } catch (err) {
    console.error('Calendar error:', err.message);
    res.status(500).json({ error: 'Failed to build calendar' });
  }
});

module.exports = router;
