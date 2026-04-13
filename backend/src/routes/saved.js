const express = require('express');
const router = express.Router();
const { getDB } = require('../db/database');
const auth = require('../middleware/auth');

router.use(auth);

router.get('/', (req, res) => {
  const db = getDB();
  const items = db
    .prepare('SELECT * FROM saved_items WHERE user_id = ? ORDER BY added_at DESC')
    .all(req.userId);
  res.json(items);
});

router.post('/', (req, res) => {
  const { tmdb_id, type, title, poster_path, overview, first_air_date } = req.body;

  if (!tmdb_id || !type || !title) {
    return res.status(400).json({ error: 'tmdb_id, type, and title are required' });
  }

  const db = getDB();

  try {
    const result = db
      .prepare(`
        INSERT OR IGNORE INTO saved_items (user_id, tmdb_id, type, title, poster_path, overview, first_air_date)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `)
      .run(req.userId, tmdb_id, type, title, poster_path || null, overview || null, first_air_date || null);

    if (result.changes === 0) {
      return res.status(409).json({ error: 'Already saved' });
    }

    const saved = db.prepare('SELECT * FROM saved_items WHERE id = ?').get(result.lastInsertRowid);
    res.status(201).json(saved);
  } catch (err) {
    console.error('Save error:', err.message);
    res.status(500).json({ error: 'Failed to save' });
  }
});

router.delete('/:id', (req, res) => {
  const db = getDB();
  const result = db
    .prepare('DELETE FROM saved_items WHERE id = ? AND user_id = ?')
    .run(req.params.id, req.userId);

  if (result.changes === 0) {
    return res.status(404).json({ error: 'Not found' });
  }

  res.json({ success: true });
});

module.exports = router;
