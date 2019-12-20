let express = require('express');
let path = require('path');
let models = require('../models');
let { ensureAuthorized } = require('../utils/loginAuth');
let multer = require('multer');
let multerS3 = require('multer-s3');
let AWS = require('aws-sdk');

let router = express.Router();
AWS.config.loadFromPath(__dirname + '/../config/awsconfig.json');

// 해당 객체 생성은 위에 aws.config가 수행된 후 실행되야 함.
let s3 = new AWS.S3();

// S3로 자료 업로드
const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: 'essay-bucket',
    contentType: multerS3.AUTO_CONTENT_TYPE,
    acl: 'public-read-write',
    key: (req, file, cb) => {
      console.log('[#file] : ' + file.originalname);
      cb(null, file.originalname);
    }
  })
});

// S3의 자료 삭제
function deleteFile(key) {
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

/**
 *
 * /classstories:
 *   get:
 *     summary: 수업 진행한 내용 목록 조회
 *     tags: [Classstory]
 *     parameters:
 *       - in: "path"
 *         name: "id"
 *         requried: true
 *         type: "integer"
 *         format: "int64"
 */
router.get('/', (req, res, next) => {
  models.Classstory.findAll().then(classstories => {
    console.log('[#classstories] : ' + classstories);
    res.status(200).json(classstories);
  });
});

/**
 *
 * /classstories:
 *   post:
 *     summary: 수업 진행한 내용 등록
 *     tags: [Classstory]
 *     parameters:
 *       - in: "body"
 *         name: "body"
 *         requried: true
 */
router.post(
  '/',
  ensureAuthorized,
  upload.single('attachImg'),
  (req, res, next) => {
    // 로그인 필요
    let curToken = req.token;

    // 사용자로부터 받아오는 데이터
    let curClassDate = req.body.classDate;
    let curTitle = req.body.title;
    let curContent = req.body.content;

    // 로그인 확인으로 부터 얻은 토큰으로 관리자인지 확인
    models.User.findOne({
      where: {
        token: curToken
      }
    }).then(user => {
      // 관리자가 아닐 경우
      if (user.name != 'admin') {
        res.status(403).json({
          error: '수업 진행한 내용을 업로드할 권한이 없습니다.'
        });
        return;
      }

      // 관리자일 경우
      try {
        let curClassImg = req.file.location;
        let curKey = req.file.key;
        models.Classstory.create({
          classDate: curClassDate,
          title: curTitle,
          content: curContent,
          classImg: curClassImg,
          key: curKey
        }).then(classstory => {
          console.log('[#classstory] : ' + classstory);
          res.status(200).json(classstory);
        });
      } catch (err) {
        res.status(500).json({
          error: '글 업로드 실패'
        });
      }
    });
  }
);

/**
 *
 * /classstories/deletion:
 *   post:
 *     summary: 수업 진행한 내용 삭제
 *     tags: [Classstory]
 *     parameters:
 *       - in: "body"
 *         name: "body"
 *         requried: true
 */
// --> 프론트단에서 classstory.key를 넘김.
router.post('/deletion', ensureAuthorized, (req, res, next) => {
  // 로그인 필요
  let curToken = req.token;

  // 사용자로부터 받은 삭제할 자료의 id
  let key = req.body.key;

  models.User.findOne({
    where: {
      token: curToken
    }
  }).then(async user => {
    //관리자가 아닐 경우
    if (user.name != 'admin') {
      res.status(403).json({
        error: '수업 진행한 내용을 삭제할 권한이 없습니다.'
      });
      return;
    }

    // 관리자일 경우
    await deleteFile(key);
    models.Classstory.destroy({
      where: {
        key: key
      }
    }).then(classstory => {
      console.log('[#수업 진행한 내용 삭제] : ' + key);
      res.status(200).json(classstory);
    });
  });
});

module.exports = router;
