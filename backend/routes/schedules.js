let express = require('express');
let models = require('../models');
let { ensureAuthorized } = require('../utils/loginAuth');

let router = express.Router();

/**
 * @swagger
 * /schedules:
 *  get:
 *    summary: 수업 일정 목록 조회
 *    tags:
 *    - "Schedule"
 *    responses:
 *      200:
 *        description: "성공"
 *        schema:
 *          type: "array"
 *          items:
 *            $ref: "#/definitions/Schedule"
 *      404:
 *        $ref: "#/components/res/BadRequest"
 */
router.get('/', (req, res, next) => {
  models.Schedule.findAll().then(schedules => {
    if (!schedules) {
      res.status(404).json({
        error: '수업 일정이 없습니다.'
      });
      return;
    }
    res.status(200).json(schedules);
  });
});

// TO DO: 첨부파일 등록을 어떻게 할 것인가....
/**
 * @swagger
 * /schedules:
 *  post:
 *    summary: 수업 일정 등록
 *    tags:
 *    - "Schedule"
 *    parameters:
 *      - in: "body"
 *        name: "body"
 *        requried: true
 *        schema:
 *          $ref: "#/definitions/ScheduleRegisterForm"
 *        description: "수업 일정 등록하기 위한 정보"
 *    responses:
 *      200:
 *        description: "성공"
 *        schema:
 *          $ref: "#/definitions/Schedule"
 *      403:
 *        $ref: "#/components/res/Forbidden"
 */
router.post('/', ensureAuthorized, (req, res, next) => {
  // 로그인 필요
  let curToken = req.token;

  // 사용자로부터 받아오는 데이터
  let curTitle = req.body.title;
  let curContent = req.body.content;
  let curLocation = req.body.location;
  let curClassId = req.body.classId;
  let curClassDate = req.body.classDate;
  let curAttachId = req.body.attachId;

  // 로그인 확인으로 부터 얻은 토큰으로 관리자인지 확인
  models.User.findOne({
    where: {
      token: curToken
    }
  }).then(user => {
    // 관리자가 아닐 경우
    if (user.name != 'admin') {
      res.status(403).json({
        error: '수업 일정을 업로드할 권한이 없습니다.'
      });
      return;
    }

    // 관리자일 경우
    models.Attach.findByPk(curAttachId).then(attach => {
      models.Schedule.create({
        title: curTitle,
        content: curContent,
        location: curLocation,
        classId: curClassId,
        attachUrl: attach.url,
        attachTitle: attach.title,
        classDate: curClassDate
      }).then(schedule => {
        res.status(200).json(schedule);
      });
    });
  });
});

/**
 * @swagger
 * /schedules:
 *  delete:
 *    summary: 수업 일정 삭제
 *    tags:
 *    - "Schedule"
 *    parameters:
 *      - in: "path"
 *        name: "id"
 *        requried: true
 *        type: "integer"
 *        format: "int64"
 *        description: "삭제할 수업 일정의 id값"
 *    responses:
 *      200:
 *        description: "성공"
 *        schema:
 *          $ref: "#/definitions/Schedule"
 *      403:
 *        $ref: "#/components/res/Forbidden"
 */
router.delete('/:id', ensureAuthorized, (req, res, next) => {
  // 로그인 필요
  let curToken = req.token;

  // 사용자로부터 받은 삭제할 일정의 id
  let id = req.params.id;

  // 로그인 확인으로 부터 얻은 토큰으로 관리자인지 확인
  models.User.findOne({
    where: {
      token: curToken
    }
  }).then(user => {
    //관리자가 아닐 경우
    if (user.name != 'admin') {
      res.status(403).json({
        error: '수업 일정을 삭제할 권한이 없습니다.'
      });
      return;
    }

    // 관리자일 경우
    models.Schedule.destroy({
      where: {
        id: id
      }
    }).then(schedule => {
      res.status(200).json(schedule);
    });
  });
});

module.exports = router;
