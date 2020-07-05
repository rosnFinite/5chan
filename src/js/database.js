var sqlite3 = require('sqlite3').verbose();

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
      } else {
        // Daten in Tabelle einfügen zum Debuggen
        // Bei wiederholten Ausführen von npm start, wird bei jedem Durchlauf versucht eine neue Row zu erstellen.
        // Beim 2. Durchlauf wird Artikel mit ID = 2 und titel/content = null erstell. Beim 3.Durchlauf Artikel mit ID= 3...
        // somit fürht der URL Aufruf von article/id bei diesen nicht zu Fehlern sondern zu Erfolg ohne Ausgabe
      }
    });
  }
});

module.exports = db;
