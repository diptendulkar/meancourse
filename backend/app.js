const express = require('express');
const bodyparser = require("body-parser");
const mongoose = require("mongoose");
const postsRoutes = require ("./routes/posts");
const userRoutes = require ("./routes/user"); // user authentication
const path = require("path");
const app = express();

mongoose.connect("mongodb+srv://max:"+process.env.MONGO_ATLAS_PASSWORD+"@cluster0-poocn.mongodb.net/node-angular?", { useNewUrlParser: true , useUnifiedTopology: true})
    .then(()=> {
      console.log("Connected to Database");
    })
    .catch((e) => {
      console.log("Failed to connect to Database !!" + e.message);
    });


app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended : false}));
app.use("/images", express.static(path.join("images")));
// this is middleware
app.use((req, res, next) => {

  res.setHeader("Access-Control-Allow-Origin" , "*");
  res.setHeader("Access-Control-Allow-Headers" , "Origin, X--requested-With, Content-Type, Accept, Authorization");
  res.setHeader("Access-Control-Allow-Methods" , "GET, POST, PATCH, PUT,DELETE, OPTIONS");
  console.log('First midleware');
  next();
});

app.use("/api/posts",postsRoutes);
app.use("/api/user",userRoutes);

module.exports = app;
