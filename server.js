const http = require('http'); // import
const app = require('./backend/app');

const port = process.env.PORT || 3000;

app.set('port', port);
const server = http.createServer(app);

/*const server = hhtp.createServer((req, res) => {
  res.end("this is my first SERVER running ");

  });*/

server.listen(port); // set Prod  PORT or 3000 for dev

