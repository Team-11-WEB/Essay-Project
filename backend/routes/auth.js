let express = require('express');
let models = require('../models');
let { generateToken } = require('../utils/token');
let { hash } = require('../utils/encryptPW');
var { ensureAuthorized } = require('../utils/loginAuth');

let router = express.Router();

const NODE_ENV = process.env.NODE_ENV;
const FRONT_HOST =
  NODE_ENV === 'production'
    ? 'https://semibasement.com'
    : 'http://localhost:3000';

/**
 *
 * /auth/register
 * post:
 *      summary: 웹페이지 회원가입
 *      parameters:
 *          - in: "body"
 *            name: "body"
 *            required: true
 *
 */
router.post('/register', async (req, res, next) => {
  // post 요청값 받아와 저장
  let curEmail = req.body.email;
  let curPW = req.body.password;
  let curClassId = req.body.classId;
  let curName = req.body.name;

  // users 테이블에 사용자 추가
  models.User.create({
    email: curEmail,
    password: hash(curPW),
    classId: curClassId,
    name: curName
  }).then(result => {
    console.log('[#register success!]' + result);
    res.send(200).json(result);
  });
});

/**
 *
 * /auth/login:
 *  post:
 *      summary: 웹페이지 로그인 요청
 *      parameters:
 *          - in: "body"
 *            name: "body"
 *            description: "로그인 body"
 *            required: true
 */
router.post('/login', async (req, res, next) => {
  // post 요청값 받아와 저장
  const curEmail = req.body.email;
  const curPW = req.body.password;

  // 토큰 생성시 필요한 payload 선언
  const payload = {
    email: curEmail
  };

  // 토큰 생성
  let token = await generateToken(payload);
  console.log('[#token success!]  ' + token);

  // 로그인한 이메일 주소에 해당하는 정보를 DB에서 조회
  // 비밀번호 일치시 cookie에 user라는 이름으로 token 값 저장
  models.User.findOne({
    where: {
      email: curEmail
    }
  }).then(user => {
    if (user) {
      if (user.password === hash(curPW)) {
        res.cookie('access_token', token);
        res.json({
          token: token
        });
        console.log('[#login sucess!]  ' + token);

        // users 테이블의 token 에 토큰 저장
        models.User.update(
          {
            token
          },
          {
            where: {
              email: curEmail
            }
          }
        ).then(result => {
          console.log('[#usersDB update sucess!]  ' + result);
        });
      } else {
        // pw가 일치하지 않을 경우 예외처리
        res.status(400).json({
          error: '잘못된 id, pw입니다. 확인 후 다시 시도해주세요.'
        });
      }
    } else {
      // 해당하는 email이 없을경우 예외처리
      res.status(400).json({
        error: '잘못된 id, pw입니다. 확인 후 다시 시도해주세요.'
      });
    }
  });
});

/**
 * /auth/logout
 * get:
 *      summary: 웹페이지 로그아웃
 *      parameter:
 *          - in: "body"
 *            name: "body"
 *
 */
router.get('/logout', ensureAuthorized, (req, res, next) => {
  // users 테이블에서 token값 null로 바꾸기
  models.User.update(
    {
      token: null
    },
    {
      where: {
        token: req.token
      }
    }
  ).then(result => {
    // cookie 값 삭제
    res.clearCookie('access_token');
    res.status(200).json({
      msg: 'logout success'
    });
    console.log('[#usersDB remove token sucess!]  ' + result);
  });
});

module.exports = router;
