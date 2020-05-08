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
        error: err
      });
    });
  });


});

//Login
router.post("/login", (req, res, next) => {
MongoUser.findOne({ email: req.body.email})
  .then(user => {
    if(!user){
      return res.status(401).json({
        message: "Authentication Failed !"
      });
    }
    bcrypt.compare(req.body.password, user.password); // compair has password
  })
  .then(result => {
    if(!result){
      return res.status(401).json({
        message: "Authentication Failed !"
      });
    }
    // Valid User - create JSon Web token - JWT
    const token = jwt.sign(
      {email: user.email, userId: user._id},
       "diptendu_password",
       {expiresIn: "1h"} // expires in one hour
       );

  })
  .catch(err => {
    return res.status(401).json({
      message: "Authentication Failed !"
    });
  });

});

module.exports = router;
