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
