
const crypto = require('crypto');
// sha1加密

exports.sha1 = function (str) {
  return crypto.createHash('sha1').update(str).digest('hex');
};


