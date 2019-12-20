function ensureAuthorized(req, res, next) {
  'use strict';
  var bearerHeader = req.cookies.access_token,
    bearer;
  var bearerToken;
  if (typeof bearerHeader !== 'undefined') {
    bearer = bearerHeader.split(' ');
    bearerToken = bearer;
    console.log('[#Token] : ' + bearerToken);
    req.token = bearerToken;
    next(); // 다음 콜백함수 진행
  } else {
    res.status(403).json({
      error: '토큰이 유효하지 않습니다.'
    });
  }
}

exports.ensureAuthorized = ensureAuthorized;
