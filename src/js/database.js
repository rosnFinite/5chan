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
    db.run('CREATE TABLE article ( id INTEGER PRIMARY KEY AUTOINCREMENT, title text, content text, imagePath text)', (err) => {
      if (err) {
        // Tabelle wurde bereits erstellt
        console.error(err);
      } else {
        // Daten in Tabelle einfügen zum Debuggen
        // Bei wiederholten Ausführen von npm start, wird bei jedem Durchlauf versucht eine neue Row zu erstellen.
        // Beim 2. Durchlauf wird Artikel mit ID = 2 und titel/content = null erstell. Beim 3.Durchlauf Artikel mit ID= 3...
        // somit fürht der URL Aufruf von article/id bei diesen nicht zu Fehlern sondern zu Erfolg ohne Ausgabe
        var insert = 'INSERT INTO article (title, content) VALUES (?,?)';
        db.run(insert, ['Keine Ahnung was ich hier tue', 'ich würde mich freuen wenn ich wüsste was hier passiert und wie ich diese Aufgabe bestehe'], (err) => {
          if (err) {
            console.log(err.message);
          }
          console.log(`A row has been inserted with rowid ${this.lastID}`);
        });
      }
    });
  }
});

module.exports = db;
