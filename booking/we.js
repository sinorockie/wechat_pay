var util = require('util');
var request = require('request');

/*
AppID wxb8b350f3d3d0de52
AppSecret 7d6e9ce21656e5c5a0caef33d01db31d
 */

function access_token() {
	request('https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=wxb8b350f3d3d0de52&secret=7d6e9ce21656e5c5a0caef33d01db31d', function(error, response, body) {
		global.access_token = JSON.parse(body).access_token;
		if (typeof(global.access_token)=="undefined") {
			util.log("ACCESS_TOKEN ERROR: " + body);
		} else {
			util.log("NEW ACCESS TOKEN: " + global.access_token);
			request('https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token='+global.access_token+'&type=jsapi', function(error, response, body) {
				global.jsapi_ticket = JSON.parse(body).ticket;
				if (typeof(global.jsapi_ticket)=="undefined") {
					util.log("JSAPI_TICKET ERROR: " + body);
				} else {
					util.log("NEW JSAPI TICKET: " + global.jsapi_ticket);
				}
			});
		}
	});
}

access_token();
setInterval(access_token, 1000 * 3600);