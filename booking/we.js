var util = require('util');
var request = require('request');

/*
AppID wxb8b350f3d3d0de52
AppSecret 7d6e9ce21656e5c5a0caef33d01db31d
 */
var access_token = null;
function getAccessToken(){
	request('https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=wxb8b350f3d3d0de52&secret=7d6e9ce21656e5c5a0caef33d01db31d', function(error, response, body){
		access_token = JSON.parse(body).access_token;
		util.log("NEW ACCESS TOKEN: " + access_token);
	});
}
getAccessToken();
setInterval(getAccessToken, 1000);