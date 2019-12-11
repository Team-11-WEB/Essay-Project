var express = require('express');
var { ensureAuthorized } = require('../utils/loginAuth');
let models = require('../models');

var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('main.ejs');
});

/**
 * /users/me
 * get:
 *    summary: 토큰 검사 후 계정 정보 반환
 *             토큰 추출하기 위해 ensureAuthorized 먼저 실행
 *
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
        error: '사용자 없음'
      });
    }
  });
});

module.exports = router;
