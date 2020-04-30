const express = require('express');
const bodyparser = require("body-parser");
const mongoose = require("mongoose");
const Post = require('./models/post');
const app = express();

mongoose.connect("mongodb+srv://max:LafuODIwfWSStFBU@cluster0-poocn.mongodb.net/node-angular?retryWrites=true&w=majority")
    .then(()=> {
      console.log("Connected to Database");
    })
    .catch(() => {
      console.log("Failed to connect to Database !!");
    });


app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended : false}));

// this is middleware
app.use((req, res, next) => {

  res.setHeader("Access-Control-Allow-Origin" , "*");
  res.setHeader("Access-Control-Allow-Headers" , "Origin, X--requested-With, Content-Type, Accept");
  res.setHeader("Access-Control-Allow-Methods" , "GET, POST, PATCH, DELETE, OPTIONS");
  console.log('First midleware');
  next();
});

app.post("/api/posts", (req, res,next) =>{

  const Post = new Post({
    title : req.body.title,
    content : req.body.content
  });

  Post.save(); // save  data to DB
  console.log(posts);
  res.status(201).json({
  message: 'Post Added sucussfully !!'
});
});

app.get('/api/posts',(req, res, next) => {
  // fetch all data
  Post.find().then( documents => {
    console.log(documents) ;  // logs all data
    res.status(200).json({
      message: 'post fetched sucessfull !',
      posts: documents
    });
  });
  });


module.exports = app;
