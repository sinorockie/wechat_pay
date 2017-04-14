var crypto = require('crypto');
var express = require('express');
var util = require('util');
var request = require('request');

module.exports = function(app){
	app.use('/weui', express.static(__dirname + '/../node_modules/weui/dist/style')).
		use('/jquery', express.static(__dirname + '/../node_modules/jquery/dist')).
		use('/angular', express.static(__dirname + '/../node_modules/angular')).
		use('/static', express.static(__dirname + '/static'));

	app.get('/', function(req, res){
		util.log("CODE: " + req.query.code);
		/*
			AppID wxb8b350f3d3d0de52
			AppSecret 7d6e9ce21656e5c5a0caef33d01db31d
		 */
		request('https://api.weixin.qq.com/sns/oauth2/access_token?appid=wxb8b350f3d3d0de52&secret=7d6e9ce21656e5c5a0caef33d01db31d&code='+req.query.code+'&grant_type=authorization_code', function(error, response, body){
			req.session.openid = JSON.parse(body).openid;
			if (typeof(req.session.openid)=="undefined") {
				util.log("OPEN_ID ERROR: " + body);
			} else {
				util.log("OPEN ID: " + req.session.openid);
			}
		});
		res.render('index');
	});

	var weixin = require('./controllers/weixin_controller');
	app.get('/weixin/sign', weixin.sign);
	app.get('/weixin/preSign', weixin.preSign);
	app.get('/weixin/notify', weixin.notify);

	var orders = require('./controllers/orders_controller');
	app.get('/orders/create', orders.createOrder);
	app.get('/orders/update', orders.updateOrder);

	var payments = require('./controllers/payments_controller');
	app.get('/payments/create', payments.createPayment);
	app.get('/payments/update', payments.updatePayment);
}