var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var BookingTypeSchema = new Schema({
	name: {type: String, enum: ['FIELD','BAR', 'ROOM']}
}, {_id: false});
mongoose.model('BookingType', BookingTypeSchema);

var CompanySchema = new Schema({
	cid: Number,
	name: String
}, {_id: false});
mongoose.model('Company', CompanySchema);

var PeriodSchema = new Schema({
	name: {type: String, enum: ['9:00-9:59', '10:00-10:59', '11:00-11:59', '12:00-12:59', '13:00-13:59', '14:00-14:59', '15:00-15:59', '16:00-16:59', '17:00-17:59', '18:00-18:59', '19:00-19:59', '20:00-20:59']}
}, {_id: false});
mongoose.model('Period', PeriodSchema);

var OrderSchema = new Schema({
	oid: String,
	openid: String,
	username: String,
	usercontact: String,
	company: [CompanySchema],
	bookingtype: [BookingTypeSchema],
	period: [PeriodSchema],
	status: {type: String, enum:['PENDING', 'COMPLETED', 'CANCEL'], default: 'PENDING'},
	createtime: {type: Date, default: Date.now},
	updatetime: {type: Date, default: Date.now}
}, {_id: false});
mongoose.model('Order', OrderSchema);

var PaymentSchema = new Schema({
	pid: String,
	oid: String,
	openid: String,
	status: {type: String, enum:['PENDING', 'PAID', 'REFUND'], default: 'PENDING'},
	createtime: {type: Date, default: Date.now},
	updatetime: {type: Date, default: Date.now}
}, {_id: false});
mongoose.model('Payment', PaymentSchema);