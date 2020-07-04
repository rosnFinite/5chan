const express = require('express');
const router = express.Router();
const db = require('./database.js');

// Liste aller Einträger der Datenbank
router.get('/articles', (req, res, next) => {
  var sql = 'select * from article';
  var params = [];
  db.all(sql, params, (err, rows) => {
    if (err) {
      res.status(400).json({ error: err.message });
    }
    res.json({
      message: 'success',
      data: rows
    });
  });
});

// einzelner Artikel nach ID
router.get('/article/:id', (req, res, next) => {
  var sql = 'select * from article where id = ?';
  var params = [req.params.id];
  db.get(sql, params, (err, row) => {
    if (err) {
      res.status(400).json({ error: err.message });
    } else {
      if (!row) {
        res.status(404).json({ error: 'gesuchter Artikel existiert nicht' });
        // Debug
        console.log('gesuchter Artikel existiert nicht');
      } else {
        console.log(row);
        res.json({
          message: 'success',
          data: row
        });
      }
    }
  });
});

// Artikel erstellen
router.post('/article/', (req, res, next) => {
  var errors = [];
  if (!req.body.title) {
    errors.push('Kein Titel angegeben');
  }
  if (!req.body.content) {
    errors.push('Kein Inhalt angegeben');
  }
  var data = {
    title: req.body.title,
    content: req.body.content
  };
  var sql = 'INSERT INTO article (title, content) VALUES (?,?)';
  var params = [data.title, data.content];
  db.run(sql, params, function (err, result) {
    if (err) {
      res.status(400).json({ error: err.message });
    }
    res.json({
      message: 'success',
      data: data,
      id: this.lastID
    });
  });
});

// Artikel aktualisieren
router.patch('/article/:id', (req, res) => {
  var data = {
    title: req.body.title,
    content: req.body.content
  };
  // COALSEC behält aktuellen Stand, falls keine Änderung
  db.run(
    'UPDATE article set title = COALESEC(?,title), content = COALESEC(?,content)',
    [data.title, data.content, req.params.id],
    function (err, result) {
      if (err) {
        res.status(400).json({ error: res.message });
      }
      res.json({
        message: 'success',
        data: data,
        changes: this.changes
      });
    }
  );
});

// Artikel löschen
router.delete('/user/:id', (req, res, next) => {
  db.run(
    'DELETE FROM article WHERE id = ?',
    req.params.id,
    function (err, result) {
      if (err) {
        res.status(400).json({ error: res.message });
      }
      res.json({
        message: 'deleted',
        changes: this.changes
      });
    }
  );
});

module.exports = router;
