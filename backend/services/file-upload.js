   const aws = require('aws-sdk');
   const multer = require('multer');
   const multerS3 = require('multer-s3');

   aws.config.update({
    accessKeyId: "",
    secretAccessKey: "",
    region: 'us-east-2' 
   });

   const s3 = new aws.S3();

   const upload = multer({
   storage: multerS3({
    acl: 'public-read',
    s3,
    bucket: '',
    metadata: function (req, file, cb) {
        cb(null, {fieldName: "TESTING"});
    },
    key: function(req, file, cb) {
      console.log("entered upload")
      req.file = Date.now() + file.originalname;
      cb(null, Date.now() + file.originalname);
     }
    })
   });

   module.exports = upload;