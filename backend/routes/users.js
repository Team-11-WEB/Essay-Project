var express = require('express');
var { ensureAuthorized } = require('../utils/loginAuth');
let models = require('../models');

var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('main.ejs');
});

/**
 * @swagger
 * /user:
 *  get:
 *    summary: "회원 목록 조회"
 *    tags:
 *    - "User"
 *    responses:
 *      200:
 *        description: "성공"
 *        schema:
 *          $ref: "#/definitions/User"
 *      404:
 *        $ref: "#/components/res/BadRequest"
 */
router.get('/', (req, res, next) => {
  models.User.findAll().then(users => {
    if (!users) {
      res.status(404).json({
        error: '회원이 없습니다.'
      });
      return;
    }
    res.status(200).json(users);
  });
});

/**
 * @swagger
 * /users/me:
 *  get:
 *    summary: "토큰 검사 후 계정 정보 반환"
 *    tags:
 *    - "User"
 *    responses:
 *      200:
 *        description: "성공"
 *        schema:
 *          $ref: "#/definitions/User"
 *      404:
 *        $ref: "#/components/res/BadRequest"
 */
router.get('/me', ensureAuthorized, (req, res, next) => {
  models.User.findOne({
    where: {
      token: req.token
    }
  }).then(user => {
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({
        error: '비 로그인 상태'
      });
    }
  });
});

module.exports = router;
