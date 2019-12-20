let express = require('express');
let path = require('path');
let models = require('../models');
let { ensureAuthorizes } = require('../utils/loginAuth');

let router = express.Router();

/**
 *
 * /schedules:
 *   get:
 *     summary: 수업 일정 목록 조회
 *     tags: [Schedule]
 *     parameters:
 *       - in: "path"
 *         name: "id"
 *         requried: true
 *         type: "integer"
 *         format: "int64"
 */
router.get('/', (req, res, next) => {
  models.Schedule.findAll().then(schedules => {
    console.log('[#schedules] : ' + schedules);
    res.status(200).json(schedules);
  });
});

/**
 *
 * /schedules:
 *   post:
 *     summary: 수업 일정 등록
 *     tags: [Schedule]
 *     parameters:
 *       - in: "body"
 *         name: "body"
 *         requried: true
 */
router.post('/', (req, res, next) => {
  // 로그인 필요 --> ensureAuthorized
  // let curToken = req.token;

  // 사용자로부터 받아오는 데이터
  let curTitle = req.body.title;
  let curContent = req.body.content;
  let curLocation = req.body.location;
  let curClassData = req.body.classData;
  let curAttachTitle = req.body.attachTitle;
});

// To do: 수업 일정 삭제

module.exports = router;
