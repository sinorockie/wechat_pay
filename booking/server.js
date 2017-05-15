var util = require('util');
var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var expressSession = require('express-session');
var mongoStore = require('connect-mongo')({session: expressSession});
var mongoose = require('mongoose');
require('./models/booking_model.js');
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/booking')

var app = express();
app.engine('.html', require('ejs').__express);
app.set('views', __dirname + '/views');
app.set('view engine', 'html');
app.use(bodyParser());
app.use(cookieParser());
app.use(expressSession({
	secret: 'pu1uoEdu',
	resave: true,
	saveUninitialized: true,
	cookie: {maxAge: 60*60*1000, secure: false},
	store: new mongoStore({
		mongooseConnection: mongoose.connection,
		collection: 'sessions'
	})
}));

require('./routes')(app);
app.listen(80);

require('./weixin');

var config = require('./config');
util.log("appid: " + config.appid);
util.log("secret: " + config.secret);