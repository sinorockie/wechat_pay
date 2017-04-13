var util = require('util');
var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
const expressSession = require('express-session');
const mongoStore = require('connect-mongo')({session: expressSession});
const mongoose = require('mongoose');
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
	secret: 'SECRET',
	cookie: {maxAge: 60*60*1000},
	store: new mongoStore({
		mongooseConnection: mongoose.connection,
		collection: 'sessions'
	})
}));

require('./routes')(app);
app.listen(80);

require('./we');

util.log('SERVER IS READY!');