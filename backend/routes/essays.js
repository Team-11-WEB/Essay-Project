let express = require('express');
let models = require('../models');
var { ensureAuthorized } = require('../utils/loginAuth');

let router = express.Router();

/**
 * @swagger
 * /schedules:
 *  get:
 *    summary: 독후감 목록 조회
 *    tags:
 *    - "Essay"
 *    responses:
 *      200:
 *        description: "성공"
 *        schema:
 *          type: "array"
 *          items:
 *            $ref: "#/definitions/Essay"
 *      404:
 *        $ref: "#/components/res/BadRequest"
 */
router.get('/', (req, res, next) => {
  models.Essay.findAll().then(essays => {
    if (!essays) {
      res.status(404).json({
        error: '독후감이 없습니다.'
      });
      return;
    }
    res.status(200).json(essays);
  });
});

/**
 * @swagger
 * /essays/{id}:
 *  get:
 *    summary: 독후감 조회
 *    tags:
 *    - "Essay"
 *    parameters:
 *      - in: "path"
 *        name: "id"
 *        requried: true
 *        type: "integer"
 *        format: "int64"
 *        description: "조회할 독후감의 id값"
 *    responses:
 *      200:
 *        description: "성공"
 *        schema:
 *          $ref: "#/definitions/Essay"
 *      404:
 *        $ref: "#/components/res/BadRequest"
 */

router.get('/:id', (req, res, next) => {
  const id = req.params.id;

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
 *  post:
 *    summary: 독후감 등록
 *    tags:
 *    - "Essay"
 *    parameters:
 *      - in: "body"
 *        name: "body"
 *        required: true
 *        schema:
 *          $ref: "#/definitions/EssayRegisterForm"
 *        description: "독후감을 등록하기 위한 정보"
 *    responses:
 *      200:
 *        description: "성공"
 *        schema:
 *          $ref: "#/definitions/Essay"
 *      404:
 *        $ref: "#/components/res/BadRequest"
 */
router.post('/', ensureAuthorized, (req, res, next) => {
  // 로그인 필요
  let curToken = req.token;

  // 사용자로부터 받아오는 데이터
  let curBookName = req.body.bookName;
  let curBookAuthor = req.body.bookAuthor;
  let curTitle = req.body.title;
  let curContent = req.body.content;
  let curUrl = req.body.url;

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
      return;
    }

    // 토큰을 가진 user가 있을 경우
    console.log('[#user.name] : ' + user.name);
    // 독후감 등록
    models.Essay.create({
      bookName: curBookName,
      bookAuthor: curBookAuthor,
      essayAuthor: user.name,
      title: curTitle,
      content: curContent,
      url: curUrl
    }).then(essay => {
      user.addEssay(essay);
      res.status(200).json(essay);
    });
  });
});

/**
 * @swagger
 * /essays:
 *  delete:
 *    summary: 독후감 삭제
 *    tags:
 *    - "Essay"
 *    parameters:
 *      - in: "path"
 *        name: "id"
 *        requried: true
 *        type: "integer"
 *        format: "int64"
 *        description: "삭제할 독후감의 id값"
 *    responses:
 *      200:
 *        description: "성공"
 *        schema:
 *          $ref: "#/definitions/Essay"
 *      403:
 *        $ref: "#/components/res/Forbidden"
 */
router.delete('/:id', ensureAuthorized, (req, res, next) => {
  // 로그인 필요
  let curToken = req.token;

  // 사용자로부터 받은 삭제할 독후감의 id
  let id = req.params.id;

  // 로그인 확인으로 부터 얻은 토큰으로 글쓴이인지 확인
  models.User.findOne({
    where: {
      token: curToken
    }
  }).then(user => {
    models.Essay.findByPk(id).then(essay => {
      // 글쓴이가 아닐 경우
      if (user.id != essay.userId) {
        res.status(403).json({
          error: '독후감을 삭제할 권한이 없습니다.'
        });
        return;
      }

      // 글쓴이일 경우
      models.Essay.destroy({
        where: {
          id: id
        }
      }).then(essay => {
        res.status(200).json(essay);
      });
    });
  });
});

module.exports = router;
