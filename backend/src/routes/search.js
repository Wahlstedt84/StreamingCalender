const express = require('express');
const router = express.Router();
const { searchTMDB } = require('../services/tmdb');

router.get('/', async (req, res) => {
  const { q } = req.query;
  if (!q || !q.trim()) {
    return res.status(400).json({ error: 'Query required' });
  }

  try {
    const data = await searchTMDB(q.trim());
    const results = (data.results || []).filter(
      item => item.media_type === 'tv' || item.media_type === 'movie'
    );
    res.json({ results });
  } catch (err) {
    console.error('Search error:', err.message);
    res.status(500).json({ error: 'Search failed' });
  }
});

module.exports = router;
