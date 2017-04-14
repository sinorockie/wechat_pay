pu1uoEdu

GET CODE:
https://open.weixin.qq.com/connect/oauth2/authorize?appid=[]&redirect_uri=[]&response_type=code&scope=snsapi_base#wechat_redirect

redirect_uri?code=CODE

GET ACCESS_TOKEN:
https://api.weixin.qq.com/sns/oauth2/access_token?appid=[]&secret=[]&code=[]&grant_type=authorization_code

appid	是	公众号的唯一标识
secret	是	公众号的appsecret
code	是	填写第一步获取的code参数
grant_type	是	填写为authorization_code

{
   "access_token":"ACCESS_TOKEN",
   "expires_in":7200,
   "refresh_token":"REFRESH_TOKEN",
   "openid":"OPENID",
   "scope":"SCOPE",
   "unionid": "UNIONID"
}

创建订单: orderid, openid;
----------
var http = require('http');
var util = require('util');

var xml2js = require('xml2js');
var builder = new xml2js.Builder();
var parser = new xml2js.Parser();

var postXML = builder.buildObject({});
var responseXML = "";

http.request({
	hostname: 'https://api.mch.weixin.qq.com',
	path: '/pay/unifiedorder',
	data: postXML,
	method: 'POST',
	headers: {
		'Connection': 'Keep-Alive',
		'Content-Type': 'application/xml;charset=utf-8',
		'Content-length': postXML.length
	}
}, function(res) {
	util.log(res);
	if(res.statusCode==200) {
        res.on('data', function (chunk) {
            responseXML += chunk;                  
        });
        res.on('end', function (chunk) {
			parser.parseString(responseXML, function (err, result) {
				if (err) {
					util.log(err);
					res.status(500).json("Failed to get prepay_id");
				} else if (result.return_code=='SUCCESS' && result.result_code=='SUCCESS') {
					res.json({prepay_id: result.prepay_id});
				} else {
					res.status(500).json("Failed to get prepay_id");
				}
			});
        });
	} else {
		res.status(500).json("Failed to get prepay_id");
	}
}).end();

<xml>
   <appid>公众账号ID</appid>
   <mch_id>商户号</mch_id>
   <nonce_str>随机字符串</nonce_str>
   <sign>签名</sign>
   <body>商品描述</body>
   <out_trade_no>商户订单号</out_trade_no>
   <total_fee>标价金额（单位为分）</total_fee>
   <spbill_create_ip>终端IP（用户端IP）</spbill_create_ip>
   <notify_url>通知地址</notify_url>
   <trade_type>JSAPI</trade_type>
   <openid>用户标识</openid>
</xml>

key设置路径：微信商户平台(pay.weixin.qq.com)-->账户设置-->API安全-->密钥设置

function getRandomString(){
	var chars = ['0','1','2','3','4','5','6','7','8','9','A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z','a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'];
	var string="";
	for(var i=0;i<32;i++){
		var id = parseInt(Math.random()*61);
		string+=chars[id];
	}
	return string;
}

MD5(stringSignTemp).toUpperCase()
----------
wx.chooseWXPay({
    timestamp: 0, // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
    nonceStr: '', // 支付签名随机串，不长于 32 位
    package: '', // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=***）
    signType: '', // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
    paySign: '', // 支付签名
    success: function (res) {
        // 支付成功后的回调函数
    }
});
