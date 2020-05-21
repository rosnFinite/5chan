const http = require('http');

const hostname = '127.0.0.1';
const port = 8080;

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Hello World');
});

server.listen(port, hostname, () => {
  if (process.argv[2] !== null) {
    console.log(`Server running at http://${hostname}:${process.argv[2]}/`);
  } else {
    console.log(`Server running at http://${hostname}:${port}/`);
  }
});
