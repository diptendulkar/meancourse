const multer =  require('multer');

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

      callback(err,"images");
    },
    filename: (req, file, callback) => {
      const name = file.originalname.toLowerCase().split(' ').join('-');
      const extension = MIME_TYPE_MAP[file.mimetype];
      callback(null,name + '-' + Date.now()+'.'+extension);
    }
  });

  module.exports = multer({storage: storage}).single("image");
