const Database = require('better-sqlite3');
const path = require('path');

const DB_PATH = path.join('/app/data', 'streaming_calendar.db');
let db;

function getDB() {
  if (!db) {
    db = new Database(DB_PATH);
    db.pragma('journal_mode = WAL');
  }
  return db;
}

function initDB() {
  const db = getDB();

  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL UNIQUE COLLATE NOCASE,
      password_hash TEXT NOT NULL,
      created_at TEXT DEFAULT (datetime('now'))
    );
  `);

  // Check if saved_items exists and whether its unique constraint includes user_id
  const tableExists = db
    .prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='saved_items'")
    .get();

  if (tableExists) {
    // Check if the unique index covers user_id
    const indexes = db.prepare("PRAGMA index_list(saved_items)").all();
    let needsMigration = false;

    for (const idx of indexes) {
      if (idx.unique) {
        const cols = db.prepare(`PRAGMA index_info("${idx.name}")`).all().map(c => c.name);
        if (!cols.includes('user_id')) {
          needsMigration = true;
          break;
        }
      }
    }

    // Also check if user_id column exists at all
    const columns = db.prepare("PRAGMA table_info(saved_items)").all().map(c => c.name);
    if (!columns.includes('user_id')) {
      needsMigration = true;
    }

    if (needsMigration) {
      console.log('Migrating saved_items table to include user_id in unique constraint...');
      db.exec(`
        ALTER TABLE saved_items RENAME TO saved_items_old;

        CREATE TABLE saved_items (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          tmdb_id INTEGER NOT NULL,
          type TEXT NOT NULL CHECK(type IN ('tv', 'movie')),
          title TEXT NOT NULL,
          poster_path TEXT,
          overview TEXT,
          first_air_date TEXT,
          added_at TEXT DEFAULT (datetime('now')),
          UNIQUE(user_id, tmdb_id, type)
        );
      `);

      // Copy rows that have a user_id (orphaned rows without one are discarded)
      const oldCols = db.prepare("PRAGMA table_info(saved_items_old)").all().map(c => c.name);
      if (oldCols.includes('user_id')) {
        db.exec(`
          INSERT INTO saved_items (id, user_id, tmdb_id, type, title, poster_path, overview, first_air_date, added_at)
          SELECT id, user_id, tmdb_id, type, title, poster_path, overview, first_air_date, added_at
          FROM saved_items_old
          WHERE user_id IS NOT NULL;

          DROP TABLE saved_items_old;
        `);
      } else {
        db.exec(`DROP TABLE saved_items_old;`);
      }

      console.log('Migration complete.');
    }
  } else {
    db.exec(`
      CREATE TABLE saved_items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        tmdb_id INTEGER NOT NULL,
        type TEXT NOT NULL CHECK(type IN ('tv', 'movie')),
        title TEXT NOT NULL,
        poster_path TEXT,
        overview TEXT,
        first_air_date TEXT,
        added_at TEXT DEFAULT (datetime('now')),
        UNIQUE(user_id, tmdb_id, type)
      );
    `);
  }

  console.log('Database initialized');
}

module.exports = { getDB, initDB };
