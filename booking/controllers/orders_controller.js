var UUID = require('uuid');
var moment = require('moment');
var util = require('util');

var mongoose = require('mongoose'),
	Order = mongoose.model('Order');
exports.createOrder = function(req, res) {
	var newOrder = new Order({
		orderid: parseInt(new Date().getTime()) + '',
		openid: req.session.openid,
		username: req.body.username,
		usercontact: req.body.usercontact,
		company: req.body.company,
		bookingtype: req.body.bookingtype,
		bookingdate: moment(req.body.bookingdate, 'YYYY-MM-DD'),
		bookingfee: req.body.bookingfee,
		period: req.body.period
	});
	newOrder.save(function(err, results){
		if (err) {
			util.log("save order error: " + err);
			util.log("save order error: " + newOrder);
			res.status(500).json("failed to save order");
		} else {
			res.json({orderid: newOrder.orderid});
		}
	});
};

exports.updateOrder = function(req, res) {
	req.body.update.updatetime = Date.now();
	Order.update({orderid: req.body.orderid}, {$set: req.body.update}, function(err){
		if (err) {
			util.log("update order error: " + JSON.stringify(err));
			util.log("update order error: " + JSON.stringify(req.body));
			res.status(500).json("failed to update order");
		} else {
			res.json({result: 'success'});
		}
	})
};

exports.showOrders = function(req, res) {
	var fDate = moment();
	if (typeof req.query.fromDate != 'undefined' && req.query.fromDate != '') {
		fDate = moment(req.query.fromDate + ' 00:00:00', 'YYYY-MM-DD HH:mm:ss');
	} else if (req.body.fromDate != '') {
		fDate = moment(req.body.fromDate + ' 00:00:00', 'YYYY-MM-DD HH:mm:ss');
	} else {
		fDate.hour(0);
		fDate.minute(0);
		fDate.second(0);
	}
	var tDate = moment();
	if (typeof req.query.toDate != 'undefined' && req.query.toDate != '') {
		tDate = moment(req.query.toDate + ' 23:59:59', 'YYYY-MM-DD HH:mm:ss');
	} else if (req.body.toDate != '') {
		tDate = moment(req.body.toDate + ' 23:59:59', 'YYYY-MM-DD HH:mm:ss');
	} else {
		tDate.hour(23);
		tDate.minute(59);
		tDate.second(59);
	}
	util.log('showOrders.fDate: ' + fDate.format('YYYY-MM-DD HH:mm:ss'));
	util.log('showOrders.tDate: ' + tDate.format('YYYY-MM-DD HH:mm:ss'));
	var list = [];
	Order.find({'bookingdate': {$lte: fDate, $gte: tDate}}, {sort:{'bookingdate': 1, 'orderid': 1}}).exec(function(err, orders) {
		list = orders;
	});
	res.render('list', {openid: req.session.openid, list: list});
};