const database = require('./database.js');
const express = require('express');
const app = express();
const hostname = 'localhost';
let port = 8080;
var path = require('path');

app.use(express.static('build'));
database.CreateConnection();

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../', 'index.html'));
  res.sendFile(path.join(__dirname, '../content', 'testvideo.mp4'));
});

if (process.argv[2] !== undefined) {
  console.log('Custom Argument');
  port = process.argv[2];
}

app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
