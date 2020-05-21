const express = require('express');
const app = express();
const hostname = 'localhost';
let port = 8080;

app.get('/', (req, res) => res.send('Helloooooo'));

if (process.argv[2] !== null) {
  port = process.argv[2];
}

app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
