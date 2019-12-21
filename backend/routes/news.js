let express = require('express');
let models = require('../models');
var { ensureAuthorized } = require('../utils/loginAuth');

let router = express.Router();

/**
 * @swagger
 * /news:
 *  get:
 *    summary: 신규회원 요청 목록 조회
 *    tags:
 *    - "New"
 *    responses:
 *      200:
 *        description: "성공"
 *        schema:
 *          type: "array"
 *          items:
 *            $ref: "#/definitions/New"
 *      404:
 *        $ref: "#/components/res/BadRequest"
 */
router.get('/', (req, res, next) => {
  models.New.findAll().then(newresult => {
    if (!newresult) {
      res.status(404).json({
        error: '신규회원 요청이 없습니다.'
      });
      return;
    }
    res.status(200).json(newresult);
  });
});

/**
 * @swagger
 * /news:
 *  post:
 *    summary: 신규 회원 요청 등록
 *    tags:
 *    - "New"
 *    parameters:
 *      - in: "body"
 *        name: "body"
 *        required: true
 *        schema:
 *          $ref: "#/definitions/NewRegisterForm"
 *        description: "신규회원 상담 요청하기 위한 정보"
 *    responses:
 *      200:
 *        description: "성공"
 *        schema:
 *          $ref: "#/definitions/New"
 *      404:
 *        $ref: "#/components/res/BadRequest"
 */
router.post('/', (req, res, next) => {
  // 사용자로부터 받아오는 데이터
  let curPhoneNum = req.body.phoneNum;
  let curAge = req.body.age;
  let curContent = req.body.content;

  models.New.create({
    phoneNum: curPhoneNum,
    age: curAge,
    content: curContent
  }).then(newresult => {
    if (!newresult) {
      res.status(404).json({
        error: '신규 요청 등록 실패'
      });
      return;
    }
    res.status(200).json(newresult);
  });
});

module.exports = router;
