var crypto = require('crypto');
var express = require('express');
var util = require('util');
var request = require('request');
var rp = require('request-promise');

var config = require('./config');

module.exports = function(app){
	app.use('/weui', express.static(__dirname + '/../node_modules/weui/dist/style')).
		use('/jquery', express.static(__dirname + '/../node_modules/jquery/dist')).
		use('/angular', express.static(__dirname + '/../node_modules/angular')).
		use('/static', express.static(__dirname + '/static'));

	app.get('/', function(req, res){
		util.log("req.query.code: " + req.query.code);
		util.log("req.session.openid: " + req.session.openid);
		var options = {
			uri: 'https://api.weixin.qq.com/sns/oauth2/access_token',
			qs: {
				appid: config.appid,
				secret: config.secret,
				code: req.query.code,
				grant_type: 'authorization_code'
			},
			headers: {
				'User-Agent': 'Request-Promise'
			},
			json: true
		};
		rp(options)
			.then(function (repos) {
				if (typeof(req.session.openid)!="undefined") {
					res.render('index', {openid: req.session.openid});
				} else if (typeof(repos.openid)!="undefined") {
					util.log("repos.openid: " + repos.openid);
					req.session.openid = repos.openid;
					res.render('index', {openid: req.session.openid});
				} else {
					util.log("repos: " + JSON.stringify(repos));
					res.send("repos: " + JSON.stringify(repos));
				}
			})
			.catch(function (err) {
				util.log("err: " + JSON.stringify(err));
				res.send("err: " + JSON.stringify(err));
			});
	});

	var init = require('./controllers/init_controller');
	app.get('/init', init);

	var weixin = require('./controllers/weixin_controller');
	app.post('/weixin/sign', weixin.sign);
	app.get('/weixin/preSign', weixin.preSign);
	app.post('/weixin/notify', weixin.notify);
	app.post('/weixin/pushMsg', weixin.pushMsg);

	var orders = require('./controllers/orders_controller');
	app.post('/orders/create', orders.createOrder);
	app.post('/orders/update', orders.updateOrder);
	app.get('/orders/list', function(req, res){res.render('list')});
	app.post('/orders/get', orders.getOrders);

	var payments = require('./controllers/payments_controller');
	app.post('/payments/create', payments.createPayment);
	app.post('/payments/update', payments.updatePayment);
}