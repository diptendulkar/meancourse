const express = require("express");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const MongoUser = require("../models/user");

const router = express.Router();

// signup
router.post("/signup", (req, res, next) => {
  // hash the password
  bcrypt.hash(req.body.password, 10)
  .then(hashPwd => {
    const user = new MongoUser({
      email: req.body.email,
      password: hashPwd
    });
    // save data to mongo DB
    user.save()
    .then(result => {

      res.status(201).json({
        message: 'User created',
        result: result
      });

    })
    .catch( err => {
      res.status(500).json({
         message: "Email id not Available !!"
      });
    });
  });


});

//Login
router.post("/login", (req, res, next) => {
  let fetchedUser;
MongoUser.findOne({ email: req.body.email})
  .then(user => {
    if(!user){
      return res.status(401).json({
        message: "Authentication Failed wrong email !"
      });
    }
 fetchedUser = user; // if email exist the mongo return user obj
    return bcrypt.compare(req.body.password, fetchedUser.password); // compair has password
  })
  .then(result => {
    console.log("pass comp: " + result);
    if(!result){
      return res.status(401).json({
        message: "Authentication Failed  wrong password!"
      });
    }
        // Valid User - create JSon Web token - JWT
        //console.log("fetchedUser: " + fetchedUser);
        const token = jwt.sign(
          {email: fetchedUser.email, userId: fetchedUser._id},
          "diptendu_password", // secret private key
          {expiresIn: "1h"} // expires in one hour
          );
          //console.log("token = " + token);
          res.status(200).json({
            token: token,  // send the token to forntend
            message : " token generate sucessfull",
            expiresIn: 3600, // in seconds
            userId: fetchedUser._id

          });
  })
  .catch(err => {
    return res.status(401).json({
      message: "Authentication Failed !"
    });
  });

});

module.exports = router;
