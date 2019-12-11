let express = require('express');
let models = require('../models');
var { ensureAuthorized } = require('../utils/loginAuth');

let router = express.Router();

const NODE_ENV = process.env.NODE_ENV;
const FRONT_HOST =
  NODE_ENV === 'production'
    ? 'https://semibasement.com'
    : 'http://localhost:3000';

/**
 *
 * /essays/{id}:
 *   get:
 *     summary: 독후감 조회
 *     tags: [Essay]
 *     parameters:
 *       - in: "path"
 *         name: "id"
 *         requried: true
 *         type: "integer"
 *         format: "int64"
 */

router.get('/:id', (req, res, next) => {
  const id = req.params.id;
  const result = {};

  models.Essay.findByPk(id).then(essay => {
    // 해당 id의 독후감이 없을 경우
    if (!essay) {
      res.status(404).json({
        error: '해당 독후감이 없습니다.'
      });
      return;
    }
    // 독후감이 있을 경우
    res.status(200).json(essay);
  });
});

/**
 * @swagger
 * /essays:
 *   post:
 *     summary: 독후감 등록
 *     tags: [Essay]
 *     parameters:
 *       - in: "body"
 *         name: "body"
 *         required: true
 */

router.post('/', ensureAuthorized, (req, res, next) => {
  // 로그인 필요
  let curToken = req.token;

  // 사용자로부터 받아오는 데이터
  let curBookName = req.body.bookName;
  let curBookAuthor = req.body.bookAuthor;
  let curTitle = req.body.title;
  let curContent = req.body.content;

  // 로그인 확인으로 부터 얻은 토큰으로 해당 user 찾기
  models.User.findOne({
    where: {
      token: curToken
    }
  }).then(user => {
    // 해당 토큰의 user가 없을 경우
    if (!user) {
      res.status(404).json({
        error: '해당 사용자가 없습니다.'
      });
    }

    // 토큰을 가진 user가 있을 경우
    console.log('[#user.name] : ' + user.name);
    // 독후감 등록
    models.Essay.create({
      bookName: curBookName,
      bookAuthor: curBookAuthor,
      essayAuthor: user.name,
      title: curTitle,
      content: curContent
    }).then(essay => {
      console.log('[#essay] : ' + essay);
      user.addEssay(essay);
      res.status(200).json(essay);
    });
  });
});

module.exports = router;
