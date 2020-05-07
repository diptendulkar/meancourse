const express = require("express");
const bcrypt = require('bcrypt');

const MongoUser = require("../models/user");

const router = express.Router();

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

module.exports = router;
