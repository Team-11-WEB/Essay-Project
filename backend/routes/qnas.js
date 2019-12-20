let express = require('express');
let models = require('../models');
let nodemailer = require('nodemailer');
const mailConfig = require(__dirname + '/../config/mailconfig.json');

let router = express.Router();

/**
 *
 * /qnas:
 *   post:
 *     summary: 질문 등록
 *     tags: [Qna]
 *     parameters:
 *       - in: "body"
 *         name: "body"
 *         requried: true
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
    res.status(200).json(qna);
  });
});

/**
 *
 * /qnas/answer:
 *   post:
 *     summary: 질문 답장
 *     tags: [Qna]
 *     parameters:
 *       - in: "body"
 *         name: "body"
 *         requried: true
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
      res.status(404).json(err);
    } else {
      console.log('[#Email sent!] : ' + info.response);
      res.status(200).json(info.response);
    }
  });
});

module.exports = router;
