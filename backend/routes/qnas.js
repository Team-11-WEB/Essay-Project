let express = require('express');
let models = require('../models');
let nodemailer = require('nodemailer');
const mailConfig = require(__dirname + '/../config/mailconfig.json');

let router = express.Router();

/**
 * @swagger
 * /qnas:
 *  get:
 *    summary: 질문 목록 조회
 *    tags:
 *     - "Qna"
 *    responses:
 *      200:
 *        description: "성공"
 *        schema:
 *          type: "array"
 *          items:
 *            $ref: "#/definitions/Qna"
 *      404:
 *        $ref: "#/components/res/BadRequest"
 */
router.get('/', (req, res, next) => {
  models.Qna.findAll().then(qnas => {
    if (!qnas) {
      res.status(404).json({
        error: '질문이 없습니다.'
      });
      return;
    }
    res.status(200).json(qnas);
  });
});

/**
 * @swagger
 * /qnas:
 *  post:
 *    summary: 질문 등록
 *    tags:
 *    - "Qna"
 *    parameters:
 *      - in: "body"
 *        name: "body"
 *        requried: true
 *        schema:
 *          $ref: "#/definitions/QnaRegisterForm"
 *        description: "질문을 등록하기 위한 정보"
 *    responses:
 *      200:
 *        description: "성공"
 *        schema:
 *          $ref: "#/definitions/Qna"
 *      404:
 *        $ref: "#/components/res/BadRequest"
 */
router.post('/', (req, res, next) => {
  // 사용자로부터 받아오는 데이터
  let curTitle = req.body.title;
  let curContent = req.body.content;
  let curEmail = req.body.email;

  models.Qna.create({
    title: curTitle,
    content: curContent,
    email: curEmail
  }).then(qna => {
    if (!qna) {
      res.status(404).json({
        error: '질문을 등록하지 못했습니다.'
      });
      return;
    }
    res.status(200).json(qna);
  });
});

/**
 * @swagger
 * /qnas/answer:
 *  post:
 *    summary: 질문 답장
 *    tags:
 *    - "Qna"
 *    parameters:
 *      - in: "body"
 *        name: "body"
 *        requried: true
 *        schema:
 *          $ref: "#/definitions/AnswerForm"
 *        description: "질문에 답장하기 위한 정보"
 *    responses:
 *      200:
 *        description: "성공"
 *      404:
 *        $ref: "#/components/res/BadRequest"
 */
router.post('/answer', (req, res, next) => {
  let curEmail = req.body.email;
  let curTitle = req.body.title;
  let curContent = req.body.content;

  let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: mailConfig.userId,
      pass: mailConfig.password
    }
  });

  let mailOptions = {
    from: mailConfig.userId,
    to: curEmail,
    subject: curTitle,
    text: curContent
  };

  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.log(err);
      res.status(404).json({
        error: '질문에 답장하지 못했습니다.'
      });
    } else {
      res.status(200).json(info.response);
    }
  });
});

module.exports = router;
