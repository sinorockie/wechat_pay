var UUID = require('uuid');
var moment = require('moment');
var util = require('util');

var mongoose = require('mongoose'),
	Order = mongoose.model('Order');
exports.createOrder = function(req, res) {
	var newOrder = new Order({
		orderid: parseInt(new Date().getTime() / 1000) + '',
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