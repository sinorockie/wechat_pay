var mongoose = require('mongoose'),
	Payment = mongoose.model('Payment');

exports.createPayment = function(req, res) {
	var newPayment = new Payment({
		orderid: req.body.orderid,
		openid: req.session.openid,
		fee: req.body.fee
	});
	newPayment.save(function(err, results){
		if (err) {
			util.log("save order error: " + JSON.stringify(err));
			util.log("save order error: " + JSON.stringify(newPayment));
			res.status(500).json("failed to save order");
		} else {
			res.json({
					orderid: req.body.orderid,
					openid: req.session.openid,
					fee: req.body.fee
				});
		}
	});
};

exports.updatePayment = function(req, res) {
	req.body.update.updatetime = Date.now();
	Payment.update({orderid: req.body.orderid}, {$set: req.body.update}, function(err){
		if (err) {
			util.log("update order error: " + JSON.stringify(err));
			util.log("update order error: " + JSON.stringify(req.body));
			res.status(500).json("failed to update order");
		} else {
			res.json({result: 'success'});
		}
	})
};