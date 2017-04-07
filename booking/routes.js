var crypto = require('crypto');
var express = require('express');
module.exports = function(app){
	app.use('/weui', express.static(__dirname + '/../node_modules/weui/dist/style'));
	app.get('/', function(res, res){
		res.render('index');
	});
}