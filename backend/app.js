const express = require('express');
const bodyparser = require("body-parser");
const mongoose = require("mongoose");
const MongoPost = require('./models/post');
const app = express();

mongoose.connect("mongodb+srv://max:LafuODIwfWSStFBU@cluster0-poocn.mongodb.net/node-angular?retryWrites=true&w=majority", { useNewUrlParser: true , useUnifiedTopology: true})
    .then(()=> {
      console.log("Connected to Database");
    })
    .catch((e) => {
      console.log("Failed to connect to Database !!" + e.message);
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

  const post = new MongoPost({
    title : req.body.title,
    content : req.body.content
  });
// save  data to DB
  post.save().then( createdPost =>{
    console.log(createdPost);
    res.status(201).json({
      message: 'Post Added sucussfully !!',
      postId: createdPost._id
    });
  });
});

app.get('/api/posts',(req, res, next) => {
  // fetch all data
  MongoPost.find().then( documents => {
    console.log(documents) ;  // logs all data
    res.status(200).json({
      message: 'post fetched sucessfull !',
      posts: documents
    });
  });
  });

  app.delete("/api/posts/:id", (req, res, next) => {

    console.log(req.params.id);
    MongoPost.deleteOne({_id : req.params.id}).then( result => {
      console.log(result);
    });
    res.status(200).json({message : " Post Deleted !!"});
  });

module.exports = app;
