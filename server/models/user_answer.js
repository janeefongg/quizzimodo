var bookshelf = require('../db/db_config/db_config.js');

var UserAnswer = bookshelf.Model.extend({
  tablename: 'user_answer',
  hasTimestamps: true
});

module.exports = UserAnswer;
