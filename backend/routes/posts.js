const express = require("express");
const multer =  require('multer');

const MongoPost = require('../models/post');
const router = express.Router();

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
router.post("", multer({storage: storage}).single("image"),(req, res,next) =>{

  const url = req.protocol + '://' + req.get("host");
  const post = new MongoPost({
    title : req.body.title,
    content : req.body.content,
    imagePath: url + "/images/" + req.file.filename
  });
// save  data to DB
  post.save().then( createdPost =>{
    console.log(createdPost);
    res.status(201).json({
      message: 'Post Added sucussfully !!',
      post: {
        id: createdPost._id, // map the id
        ...createdPost  // set rest of the property automatically

      }
    });
  });
});

router.get('',(req, res, next) => {
  // fetch all data
  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.page;
  const postQuery = MongoPost.find();

  if( pageSize && currentPage)
  {
    postQuery.skip(pageSize * (currentPage -1))
    .limit(pageSize);
  }
  postQuery.then( documents => {
    //console.log(documents) ;  // logs all data
    res.status(200).json({
      message: 'post fetched sucessfull !',
      posts: documents
    });
  });
  });


// to edit an existing post
  router.put("/:id", multer({storage: storage}).single("image"), (req, res, next) => {
    console.log(req.file);
    let imagePath = req.body.imagePath;
    if(req.file){
      const url = req.protocol + '://' + req.get("host");
      imagePath = url + "/images/" + req.file.filename;

    }
    const post = new MongoPost({
      _id : req.body.id,
      title : req.body.title,
      content : req.body.content,
      imagePath: imagePath
    });
    console.log(post);
    MongoPost.updateOne({_id : req.params.id}, post).then( result => {
      console.log(result);
      res.status(200).json({ message: 'Updated Successful !!'});
    });

  });

  router.get("/:id", (req, res, next) => {
  MongoPost.findById(req.params.id).then(post => {
    if(post){
      res.status(200).json(post);
    } else{
      res.status(400).json({message : 'Post no Found !'});
    }
  });
});

router.delete("/:id", (req, res, next) => {

    console.log(req.params.id);
    MongoPost.deleteOne({_id : req.params.id}).then( result => {
      console.log(result);
    });
    res.status(200).json({message : " Post Deleted !!"});
  });

  module.exports = router;
