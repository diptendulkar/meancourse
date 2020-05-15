const express = require("express");
const checkAuth = require('../middleware/check-auth');
const extractFile = require('../middleware/file-util');

const router = express.Router();

const PostController = require("../controllers/posts-controller");

//add a new post
router.post("", checkAuth ,extractFile,PostController.addNewPost);

// fetch all data
router.get('',PostController.fetchAllData);


// to edit an existing post - only user who create can edit it
router.put("/:id", checkAuth, extractFile,PostController.updatePost);

  //fetch a Particular record
router.get("/:id",PostController.fetchPost);


// Delete a particular record
router.delete("/:id", checkAuth,PostController.deletePost);

module.exports = router;
