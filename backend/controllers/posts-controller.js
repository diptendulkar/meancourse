const MongoPost = require('../models/post');


exports.addNewPost = (req, res,next) =>{

  const url = req.protocol + '://' + req.get("host");
  const post = new MongoPost({
    title : req.body.title,
    content : req.body.content,
    imagePath: url + "/images/" + req.file.filename,
    creator: req.userData.userId
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
  })
  .catch(error => {
    res.status(500).json({
      message: "Creating Post Failed !!"
    });
  })
  ;
}

exports.fetchAllData = (req, res, next) => {

  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.page;
  const postQuery = MongoPost.find();
  let fetchedPosts;
  if( pageSize && currentPage)
  {
    postQuery.skip(pageSize * (currentPage -1))
    .limit(pageSize);
  }
  postQuery.then( documents => {
    fetchedPosts = documents;
   return MongoPost.count();
  })
  .then(count => {
  //console.log(documents) ;  // logs all data
  res.status(200).json({
    message: 'post fetched sucessfull !',
    posts: fetchedPosts,
    maxPosts: count
  });
}).catch(error => {
  res.status(500).json({
    message: "Fetching Post Failed !"
  });
});

  }

  exports.updatePost =  (req, res, next) => {
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
      imagePath: imagePath,
      creator: req.userData.creator
    });
    console.log(post);
    MongoPost.updateOne({_id : req.params.id, creator: req.userData.userId}, post).then( result => {
      if(result.n>0){ // n = check for modified number of rec
        res.status(200).json({ message: 'Updated Successful !!'});
      }else{
        res.status(401).json({ message: 'Not Autorized to Update!!'});
      }

    })
    .catch(error => {
      res.status(500).json({
        message: "Couldn't Update the Post !"
      });
    });

  }

  exports.fetchPost =  (req, res, next) => {
    MongoPost.findById(req.params.id).then(post => {
      if(post){
        res.status(200).json(post);
      } else{
        res.status(400).json({message : 'Post no Found !'});
      }
    }).catch(error => {
      res.status(500).json({
        message: "Post no Found !"
      });
    });
  }

  exports.deletePost = (req, res, next) => {

    console.log(req.params.id);
    MongoPost.deleteOne({_id : req.params.id, creator: req.userData.userId}).then( result => {
      //console.log(result);
      if(result.n>0){
        res.status(200).json({ message: " Post Deleted !!"});
      }else{
        res.status(401).json({ message: 'Not Autorized to Delete!!'});
      }
    }).catch(error => {
      res.status(500).json({
        message: "Post Delete Failed !"
      });
    });



  }
