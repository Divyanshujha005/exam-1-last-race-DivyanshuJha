import sqlite3 from 'sqlite3';

const sqlite = sqlite3.verbose();

const db = new sqlite.Database(
  './database.db',
  (err) => {
    if (err) {
      console.error(err.message);
    } else {
      console.log(
        'Connected to SQLite database.'
      );
    }
  }
);

export default db;
/*
import sqlite3 from 'sqlite3';

sqlite3.verbose();

const db = new sqlite3.Database('./last-race.sqlite', (err) => {
  if (err) {
    console.error('Database connection error:', err.message);
  } else {
    console.log('Connected to SQLite database.');
  }
});

export default db;
*/
