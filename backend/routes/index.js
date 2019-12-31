var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('main.ejs', { title: 'Express' });
});
router.get('/signUp', function(req, res, next) {
  res.render('signUp.ejs');
});
router.get('/schedule', function(req, res, next) {
  res.render('schedule.ejs');
});
router.get('/document', function(req, res, next) {
  res.render('document.ejs');
});
router.get('/document_detail', function(req, res, next) {
  res.render('document_detail.ejs');
});
router.get('/bookReport', function(req, res, next) {
  res.render('bookReport.ejs');
});
router.get('/qna', function(req, res, next) {
  res.render('qna.ejs');
});

module.exports = router;
