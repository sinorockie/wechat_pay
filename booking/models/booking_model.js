var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var OrderSchema = new Schema({
	orderid: {type: String, index: true, uniqure: true, required: true},
	openid: String,
	username: String,
	usercontact: String,
	company: String,
	bookingtype: String,
	bookingdate: Date,
	bookingfee: Number,
	period: [String],
	status: {type: String, enum:['PENDING', 'COMPLETED', 'CANCEL'], default: 'PENDING'},
	favor: {type: Boolean, default: false},
	createtime: {type: Date, default: Date.now},
	updatetime: {type: Date, default: Date.now}
});
mongoose.model('Order', OrderSchema);

var PaymentSchema = new Schema({
	paymentid: {type: String, index: true},
	orderid: {type: String, index: true, uniqure: true, required: true},
	openid: String,
	fee: Number,
	status: {type: String, enum:['PENDING', 'PAID', 'REFUND'], default: 'PENDING'},
	createtime: {type: Date, default: Date.now},
	updatetime: {type: Date, default: Date.now}
});
mongoose.model('Payment', PaymentSchema);