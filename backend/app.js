var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

// 라우터 연결
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var authRouter = require('./routes/auth');
var essayRouter = require('./routes/essays');
var attachRouter = require('./routes/attaches');
var scheduleRouter = require('./routes/schedules');
var qnaRouter = require('./routes/qnas');

// ORM 연결
var sequelize = require('./models').sequelize;
var dataCreator = require('./models/data-creator');

// express 연결
var app = express();

// sequelize 실행 - 강제
sequelize
  .sync({ force: true })
  .then(() => {
    dataCreator.relationInit();
  })
  .then(() => {
    dataCreator.dataInit();
    console.log('[#confirm] finish sequelize sync');
  });

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// 라우터 경로 설정
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/auth', authRouter);
app.use('/essays', essayRouter);
app.use('/attaches', attachRouter);
app.use('/schedules', scheduleRouter);
app.use('/qnas', qnaRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
