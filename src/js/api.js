const express = require('express');
const router = express.Router();
const db = require('./database.js');
const check = require('express-validator').check;
const path = require('path');
const fs = require('fs');

// Konfiguration des internen Dateispeichers
const multer = require('multer');
const storage = multer.diskStorage({
  // Speicherpfad innerhalb des Projekts
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../../uploads/'));
  },
  filename: function (req, file, cb) {
    const now = new Date().toISOString(); const date = now.replace(/:/g, '-'); cb(null, date + file.originalname);
  }
});
const fileFilter = (req, file, cb) => {
  //  Erlaube nur JPEG und JSON uploads
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'application/json') {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({ storage: storage, fileFilter: fileFilter });

// GET alle Blogbeiträge
router.get('/articles', (req, res, next) => {
  const sql = 'select * from article';
  const params = [];
  db.all(sql, params, (err, rows) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({
      message: 'success',
      data: rows
    });
  });
});

// GET Anzahl der Einträge in der Datenbank
router.get('/articles/count', (req, res, next) => {
  const sql = 'select count(*) as count from article';
  const params = [];
  console.log('counts');
  db.all(sql, params, (err, result) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.send(result[0]);
    console.log(result[0]);
  });
});

// GET Thumbnail anhand seiner ID
router.get('/article/thumbnail/:id', (req, res, next) => {
  db.get('select filePath from article where id = ?', req.params.id, (err, result) => {
    if (err) {
      console.log('NO');
      return;
    }
    try {
      res.sendFile(result.filePath);
    } catch (error) {
      console.log('Keine Thumbnail angegeben');
      res.status(400).json({ error: error.message, message: 'Fehler' });
    }
  });
});

// GET Artikel anhand seiner ID
router.get('/article/:id', (req, res, next) => {
  const sql = 'select * from article where id = ?';
  const params = [req.params.id];
  db.get(sql, params, (err, row) => {
    if (err) {
      res.status(400).json({ error: err.message });
    } else {
      if (!row) {
        res.status(404).json({ error: 'gesuchter Artikel existiert nicht' });
        // Debug
        console.log('gesuchter Artikel existiert nicht');
        return;
      }
      console.log(row);
      res.json({
        message: 'success',
        data: row
      });
    }
  });
});

// Erstellen eines neuen Blogeintrags
// POST Artikel {timestamp, title, content, thumbnail}
router.post('/article/', upload.single('articleImage'), [
  check('title').escape(),
  check('content').escape()
], (req, res, next) => {
  const errors = [];
  if (!req.body.title) {
    errors.push('Kein Titel angegeben');
  }
  if (!req.body.content) {
    errors.push('Kein Inhalt angegeben');
  }
  var data = {
    timestamp: new Date().toLocaleString('de-DE', { timeZone: 'Europe/Berlin' }),
    title: req.body.title,
    content: req.body.content,
    articleImage: null
  };
  if (req.file !== undefined) {
    data.articleImage = req.file.path;
  } else {
    console.log('No Image');
  }
  const sql = 'INSERT INTO article (timestamp, title, content, filePath) VALUES (?,?,?,?)';
  const params = [data.timestamp, data.title, data.content, data.articleImage];
  db.run(sql, params, function (err, result) {
    if (err) {
      res.status(400).json({ error: err.message, message: 'Fehler' });
      // Damit restliche Code nicht fortgesetzt wird
      return;
    }
    res.json({
      message: 'success',
      data: data,
      id: this.lastID
    });
  });
});

// PATCH Artikel mit ID = id
router.patch('/article/:id', upload.single('articleImage'), [
  check('title').escape(),
  check('content').escape()
], (req, res, next) => {
  // Veraltetes Bild aus Datei löschen
  if (req.file !== undefined) {
    db.get('SELECT filePath FROM article WHERE id = ?', req.params.id, (err, result) => {
      if (err) {
        console.log(err);
        console.log(result);
        return;
      }
      try {
        fs.unlinkSync(result.filePath);
      } catch (err) {
        console.error(err);
        console.log(result);
      }
    });
  }
  var data = {
    timestamp: new Date().toISOString(),
    title: req.body.title,
    content: req.body.content,
    articleImage: req.file !== undefined ? req.file.path : null
  };
  console.log(data);

  // Aktualisierung des Datenbankeintrags
  db.run(
    'UPDATE article SET timestamp = ?, title = COALESCE(?,title), content = COALESCE(?,content), filePath = COALESCE(?,filePath) WHERE id = ?',
    [data.timestamp, data.title, data.content, data.articleImage, req.params.id],
    function (err, result) {
      if (err) {
        res.status(400).json({ error: res.message });
        return;
      }
      console.log(data.articleImage);
      res.json({
        message: 'success',
        data: data,
        changes: this.changes
      });
    }
  );
  db.get('SELECT filePath FROM article WHERE id = ?', req.params.id, (err, result) => {
    if (err) {
      console.log(err);
      return;
    }
    console.log('Ergebnis der Aktualisierung');
    console.log(result);
  });
});

// DELETE Artikel mit ID = id
router.delete('/article/:id', (req, res, next) => {
  // Löschen des Thumbnails innerhalb des Dateisystems
  db.get('SELECT filePath FROM article WHERE id = ?', req.params.id, (err, result) => {
    if (err) {
      console.log(err);
      return;
    }
    try {
      fs.unlinkSync(result.filePath);
    } catch (err) {
      console.error(err);
    }
  });
  // Löschen des Datenbankeintrags
  db.run(
    'DELETE FROM article WHERE id = ?',
    req.params.id,
    function (err, result) {
      if (err) {
        res.status(400).json({ error: res.message });
        return;
      }
      res.json({
        message: 'deleted',
        changes: this.changes
      });
    }
  );
});

module.exports = router;
