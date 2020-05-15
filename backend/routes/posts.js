const express = require("express");
const multer =  require('multer');


const checkAuth = require('../middleware/check-auth');
const router = express.Router();

const PostController = require("../controllers/posts-controller");

const MIME_TYPE_MAP ={
'image/png': 'png',
'image/jpeg': 'jpeg',
'image/jpg': 'jpg',
};
const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let err = new Error("Invalid mime type");
    if(isValid){
      err = null;
    }

    callback(err,"backend/images");
  },
  filename: (req, file, callback) => {
    const name = file.originalname.toLowerCase().split(' ').join('-');
    const extension = MIME_TYPE_MAP[file.mimetype];
    callback(null,name + '-' + Date.now()+'.'+extension);
  }
});

//add a new post
router.post("", checkAuth ,multer({storage: storage}).single("image"),PostController.addNewPost);



// fetch all data
router.get('',PostController.fetchAllData);


// to edit an existing post - only user who create can edit it
router.put("/:id", checkAuth, multer({storage: storage}).single("image"),PostController.updatePost);



  //fetch a Particular record
router.get("/:id",PostController.fetchPost);


// Delete a particular record
router.delete("/:id", checkAuth,PostController.deletePost);

  module.exports = router;
