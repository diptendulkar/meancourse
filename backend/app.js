const express = require('express');
const app = express();

// this is middleware Optional
app.use((req, res, next) => {

  console.log('First midleware');
  next();
});

app.use('/api/posts',(req, res, next) => {

  const posts =[
    {id: 'fad123', title:'First Server-side post', content:'this  First code is comming from server'},
    {id: 'fad124', title:'Second Server-side post', content:'this Second code is comming from server'}
  ];

  res.status(200).json({
    message: 'post fetched sucessfull !',
    posts: posts
  });
});

module.exports = app;
