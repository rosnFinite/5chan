const express = require('express');
const api = require('./api.js');
const path = require('path');
const app = express();
const hostname = 'localhost';
let port = 8080;

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static('build'));
app.use(express.static('uploads'));
app.use('/api', api);

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../', 'index.html'));
});

if (process.argv[2] !== undefined) {
  console.log('Custom Argument');
  port = process.argv[2];
}

app.get('/article', (req, res) => {
  console.log('Artikel');
  res.json({ message: 'Artikel' });
});

app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
