var crypto = require('crypto');
var express = require('express');
var util = require('util');
var request = require('request');

var config = require('./config');

module.exports = function(app){
	app.use('/weui', express.static(__dirname + '/../node_modules/weui/dist/style')).
		use('/jquery', express.static(__dirname + '/../node_modules/jquery/dist')).
		use('/angular', express.static(__dirname + '/../node_modules/angular')).
		use('/static', express.static(__dirname + '/static'));

	app.get('/', function(req, res){
		request('https://api.weixin.qq.com/sns/oauth2/access_token?appid='+config.appid+'&secret='+config.secret+'&code='+req.query.code+'&grant_type=authorization_code', function(error, response, body){
			util.log("code: " + req.query.code);
			req.session.openid = JSON.parse(body).openid;
			if (typeof(req.session.openid)=="undefined") {
				util.log("openid: " + body);
			} else {
				util.log("openid error: " + req.session.openid);
			}
		});
		res.render('index');
	});

	var init = require('./controllers/init_controller');
	app.get('/init', init);

	var weixin = require('./controllers/weixin_controller');
	app.post('/weixin/sign', weixin.sign);
	app.get('/weixin/preSign', weixin.preSign);
	app.post('/weixin/notify', weixin.notify);

	var orders = require('./controllers/orders_controller');
	app.post('/orders/create', orders.createOrder);
	app.post('/orders/update', orders.updateOrder);

	var payments = require('./controllers/payments_controller');
	app.post('/payments/create', payments.createPayment);
	app.post('/payments/update', payments.updatePayment);
}