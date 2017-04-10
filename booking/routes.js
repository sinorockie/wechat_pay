var crypto = require('crypto');
var express = require('express');

module.exports = function(app){
	app.use('/weui', express.static(__dirname + '/../node_modules/weui/dist/style')).
		use('/jquery', express.static(__dirname + '/../node_modules/jquery/dist')).
		use('/angular', express.static(__dirname + '/../node_modules/angular')).
		use('/static', express.static(__dirname + '/static'));

	app.get('/', function(res, res){
		res.render('index');
	});
}