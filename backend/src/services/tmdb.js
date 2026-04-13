const axios = require('axios');

const TMDB_BASE = 'https://api.themoviedb.org/3';

function getApiKey() {
  const key = process.env.TMDB_API_KEY;
  if (!key) throw new Error('TMDB_API_KEY not set');
  return key;
}

async function searchTMDB(query) {
  const response = await axios.get(`${TMDB_BASE}/search/multi`, {
    params: {
      api_key: getApiKey(),
      query,
      include_adult: false,
    },
  });
  return response.data;
}

async function getTVDetails(id) {
  const response = await axios.get(`${TMDB_BASE}/tv/${id}`, {
    params: {
      api_key: getApiKey(),
      append_to_response: 'watch/providers',
    },
  });
  return response.data;
}

async function getMovieDetails(id) {
  const response = await axios.get(`${TMDB_BASE}/movie/${id}`, {
    params: {
      api_key: getApiKey(),
      append_to_response: 'watch/providers',
    },
  });
  return response.data;
}

async function getTVSeasonDetails(seriesId, seasonNumber) {
  const response = await axios.get(`${TMDB_BASE}/tv/${seriesId}/season/${seasonNumber}`, {
    params: { api_key: getApiKey() },
  });
  return response.data;
}

module.exports = { searchTMDB, getTVDetails, getMovieDetails, getTVSeasonDetails };
