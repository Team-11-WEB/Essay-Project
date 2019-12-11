let pwsecretObj = require('../config/encryptPW');
let crypto = require('crypto');

function hash(password) {
  return crypto
    .createHmac('sha256', pwsecretObj.secret)
    .update(password)
    .digest('hex');
}

exports.hash = hash;
