const path = require('path');
const multer = require('multer');
const multerS3 = require('multer-s3');
const AWS = require('aws-sdk');

AWS.config.loadFromPath(__dirname + '/../config/awsconfig.json');

// 해당 객체 생성은 위에 aws.config가 수행된 후 실행되야 함.
let s3 = new AWS.S3();

class S3Handler {
  // S3로 자료 업로드하는 함수
  static upload = multer({
    storage: multerS3({
      s3: s3,
      bucket: 'essay-bucket',
      contentType: multerS3.AUTO_CONTENT_TYPE,
      acl: 'public-read-write',
      key: (req, file, cb) => {
        console.log('[#file] : ' + file.originalname);
        let extension = path.extname(file.originalname);
        cb(null, extension);
      }
    })
  });

  // S3의 자료 삭제하는 함수
  static deleteFile(key) {
    return new Promise((resolve, reject) => {
      var params = {
        Bucket: 'essay-bucket',
        Key: key
      };

      s3.deleteObject(params, (err, data) => {
        if (data) {
          resolve(data);
        } else {
          console.error(err);
          reject(err);
        }
      });
    });
  }
}

module.exports = S3Handler;
