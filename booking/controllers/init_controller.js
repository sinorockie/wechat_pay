var util = require('util');
var config = require('../config');

module.exports = function(req, res) {
  res.json(config.init);
};