var util = require('util');
var config = require('../config');

module.exports = function(req, res) {
  //util.log(config.init);
  res.json(config.init);
};