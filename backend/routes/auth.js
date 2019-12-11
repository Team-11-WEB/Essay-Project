let express = require('express');
let models = require('../models');
let jwt = require('jsonwebtoken');
let secretObj = require('../config/jwt');

let router = express.Router();

const NODE_ENV = process.env.NODE_ENV;
const FRONT_HOST =
  NODE_ENV === 'production'
    ? 'https://semibasement.com'
    : 'http://localhost:3000';

/**
 *
 * /auth/login:
 *  get:
 *      summary: 웹페이지 로그인 요청
 *      parameters:
 *          - in: "body"
 *            name: "body"
 *            description: "로그인 body"
 *            required: true
 */
router.post('/login', (req, res, next) => {
  const curEmail = req.body.email;
  const curPW = req.body.password;

  // 토큰 생성
  let token = jwt.sign(
    {
      //token의 payload --> req.body.email로 값 받아오기
      email: curEmail
    },
    secretObj.secret
  );

  // 로그인한 이메일 주소에 해당하는 정보를 DB에서 조회
  // 비밀번호 일치시 cookie에 user라는 이름으로 token 값 저장
  models.User.findOne({
    where: {
      email: curEmail
    }
  }).then(user => {
    if (user.password === curPW) {
      res.cookie('user', token);
      res.json({
        token: token
      });
      console.log('login sucess' + token);
    }
  });
});

module.exports = router;
