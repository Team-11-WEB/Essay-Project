let jwt = require('jsonwebtoken');
let jwtsecretObj = require('../config/jwt');

/**
 *
 * JWT 토큰 생성
 *
 * @param {any} payload
 * @returns {string} token
 */

function generateToken(payload) {
  return new Promise((resolve, reject) => {
    jwt.sign(
      //token의 payload --> req.body.email로 값 받아오기
      payload,
      jwtsecretObj.secret,
      {
        expiresIn: '7d'
      },
      (err, token) => {
        if (err) reject(err);
        resolve(token);
      }
    );
  });
}

exports.generateToken = generateToken;
