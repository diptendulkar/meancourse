const express = require('express');
const app = express();

// this is middleware
app.use((req, res, next) => {

  console.log('First midleware');
  next();
});

app.use((req, res, next) => {

  res.send('Hello from Express ! SERVER iS RUNNING');
});

module.exports = app;
