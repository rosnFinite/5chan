const express = require('express');
const app = express();
const hostname = 'localhost';
let port = 8080;
var path = require('path');

app.get('/', (req, res) => res.sendFile(path.join(__dirname, '../', 'index.html')));

if (process.argv[2] !== undefined) {
  console.log('Custom Argument');
  port = process.argv[2];
}

app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
