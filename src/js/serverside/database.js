const sqlite3 = require('sqlite3').verbose();

const DBSOURCE = 'db.sqlite3';

const db = new sqlite3.Database(DBSOURCE, (err) => {
  if (err) {
    // Datenbankverbindung konnte nicht erstellt werden
    console.log(err.message);
    throw err;
  } else {
    // Datenbankverbindung erstellt
    console.log('Connected to SQLite database');
    db.run('CREATE TABLE article ( id INTEGER PRIMARY KEY AUTOINCREMENT,timestamp text, title text, content text, filePath text)', (err) => {
      if (err) {
        // Tabelle wurde bereits erstellt
        console.error(err);
      }
    });
  }
});

module.exports = db;
