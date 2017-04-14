var UUID = require('uuid');
var moment = require('moment');
var util = require('util');

var mongoose = require('mongoose'),
	Order = mongoose.model('Order');
exports.createOrder = function(req, res) {
	var newOrder = new Order({
		orderid: UUID.v1(),
		openid: 'OpendID',
		username: '石磊',
		usercontact: '18521564305',
		company: '朴洛教育科技（上海）有限公司',
		bookingtype: 'BAR',
		bookingdate: moment('2017-04-13', 'YYYY-MM-DD'),
		period: ["09:00-09:59", "10:00-10:59"]
	});
	newOrder.save(function(err, results){
		if (err) {
			util.log("SAVE ORDER ERROR: " + err);
			util.log("SAVE ORDER ERROR: " + newOrder);
			res.status(500).json("Failed to save order");
		} else {
			res.json({orderid: newOrder.orderid});
		}
	});
};

exports.updateOrder = function(req, res) {
	
};