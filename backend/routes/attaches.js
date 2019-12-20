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
      let extension = path.extname(file.originalname);
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
 * @swagger
 * /attaches:
 *   get:
 *    summary: "수업 자료 목록 조회"
 *    tags:
 *    - "Attach"
 *    responses:
 *      200:
 *        description: "성공"
 *        schema:
 *          type: "array"
 *          items:
 *            $ref: "#/definitions/Attach"
 *      404:
 *        $ref: "#/components/res/BadRequest"
 */
router.get('/', (req, res, next) => {
  models.Attach.findAll().then(attaches => {
    if (attaches) {
      res.status(200).json(attaches);
    } else {
      res.status(404).json({
        error: '첨부파일 없음'
      });
    }
  });
});

/**
 * @swagger
 * /attaches/{id}:
 *   get:
 *    summary: "수업 자료 개별 조회"
 *    tags:
 *    - "Attach"
 *    parameters:
 *      - in: "path"
 *        name: "id"
 *        requried: true
 *        type: "integer"
 *        format: "int64"
 *        description: "조회할 첨부파일의 id값"
 *    responses:
 *      200:
 *        description: "성공"
 *        schema:
 *          $ref: "#/definitions/Attach"
 *      404:
 *        $ref: "#/components/res/BadRequest"
 */
router.get('/:id', (req, res, next) => {
  const id = req.params.id;

  models.Attach.findByPk(id).then(attach => {
    //해당 id의 자료가 없을 경우
    if (!attach) {
      res.status(404).json({
        error: '해당 수업 자료가 없습니다.'
      });
      return;
    }
    // 수업자료가 있을 경우
    res.status(200).json(attach);
  });
});

/**
 * @swagger
 * /attaches:
 *   post:
 *    summary: "수업 자료 등록"
 *    tags:
 *    - "Attach"
 *    parameters:
 *      - in: "body"
 *        name: "body"
 *        required: true
 *        schema:
 *          $ref: "#/definitions/AttachRegisterForm"
 *        description: "수업 자료 등록하기 위한 정보"
 *    responses:
 *      200:
 *        description: "성공"
 *        schema:
 *          $ref: "#/definitions/Attach"
 *      403:
 *        $ref: "#/components/res/Forbidden"
 *      500:
 *        $ref: "#/components/res/BadRequest"
 */
router.post(
  '/',
  ensureAuthorized,
  upload.single('attachFile'),
  (req, res, next) => {
    // 로그인 필요
    let curToken = req.token;

    // 사용자로부터 받아오는 데이터
    let curTitle = req.body.title;
    let curContent = req.body.content;

    // 로그인 확인으로 부터 얻은 토큰으로 관리자인지 확인
    models.User.findOne({
      where: {
        token: curToken
      }
    }).then(user => {
      // 관리자가 아닐경우
      if (user.name != 'admin') {
        res.status(403).json({
          error: '수업 자료를 업로드할 권한이 없습니다.'
        });
        return;
      }
      // 관리자일 경우
      try {
        let curUrl = req.file.location;
        let curKey = req.file.key;
        models.Attach.create({
          title: curTitle,
          content: curContent,
          url: curUrl,
          key: curKey
        }).then(attach => {
          res.status(200).json(attach);
        });
      } catch (err) {
        res.status(500).json({
          error: '파일 업로드 실패'
        });
      }
    });
  }
);

/**
 * @swagger
 * /attaches/deletion:
 *   post:
 *    summary: 수업 자료 삭제
 *    tags:
 *    - "Attach"
 *    parameters:
 *      - in: "body"
 *        name: "body"
 *        requried: true
 *        schema:
 *          $ref: "#/definitions/DeleteForm"
 *        description: "attach.key값 전달"
 *    responses:
 *      200:
 *        description: "성공"
 *        schema:
 *          $ref: "#/definitions/Attach"
 *      403:
 *        $ref: "#/components/res/Forbidden"
 */
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
        error: '수업 자료를 삭제할 권한이 없습니다.'
      });
      return;
    }

    // 관리자일 경우
    await deleteFile(key);
    models.Attach.destroy({
      where: {
        key: key
      }
    }).then(attach => {
      res.status(200).json(attach);
    });
  });
});

module.exports = router;
