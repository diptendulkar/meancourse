const express = require('express');
const bodyparser = require("body-parser");


const app = express();

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended : false}));

// this is middleware
app.use((req, res, next) => {

  res.setHeader("Access-Control-Allow-Origin" , "*");
  res.setHeader("Access-Control-Allow-Header" , "Origin, X--requested-With, Content-Type, Accept");
  res.setHeader("Access-Control-Allow-Methods" , "GET, POST, PATCH, DELETE, OPTIONS");
  console.log('First midleware');
  next();
});

app.post("/api/posts", (req, res,next) =>{

  const posts = req.body;
  console.log(posts);
  res.status(201).json({
  message: 'Post Added sucussfully !!'
});
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
