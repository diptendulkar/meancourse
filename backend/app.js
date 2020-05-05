const express = require('express');
const bodyparser = require("body-parser");
const mongoose = require("mongoose");
const postsRoutes = require ("./routes/posts");
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

app.use("/api/posts",postsRoutes);

module.exports = app;
