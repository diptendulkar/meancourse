const express = require("express");



const router = express.Router();
const UserController = require("../controllers/user-controller");

// signup
router.post("/signup", UserController.createUser);

//Login
router.post("/login",UserController.userLogin );

module.exports = router;
