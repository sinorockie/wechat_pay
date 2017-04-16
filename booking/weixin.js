var util = require('util');
var request = require('request');

var config = require('./config');

function access_token() {
	request('https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid='+config.appid+'&secret='+config.secret, function(error, response, body) {
		global.access_token = JSON.parse(body).access_token;
		if (typeof(global.access_token)=="undefined") {
			util.log("access_token error: " + body);
		} else {
			util.log("access_token: " + global.access_token);
			request('https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token='+global.access_token+'&type=jsapi', function(error, response, body) {
				global.jsapi_ticket = JSON.parse(body).ticket;
				if (typeof(global.jsapi_ticket)=="undefined") {
					util.log("jsapi_ticket error: " + body);
				} else {
					util.log("jsapi_ticket: " + global.jsapi_ticket);
				}
			});
		}
	});
}

access_token();
setInterval(access_token, 1000 * 3600);