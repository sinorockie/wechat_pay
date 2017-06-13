var config = require('../config');

var request = require('request');
var util = require('util');
var crypto = require('crypto');
var xml2js = require('xml2js');

var builder = new xml2js.Builder();
var parser = new xml2js.Parser();

var createNonceStr = function () {
  return Math.random().toString(36).substr(2, 15);
};

var createTimestamp = function () {
  return parseInt(new Date().getTime() / 1000) + '';
};

var raw = function (args) {
  var keys = Object.keys(args);
  keys = keys.sort()
  var newArgs = {};
  keys.forEach(function (key) {
    newArgs[key.toLowerCase()] = args[key];
  });

  var string = '';
  for (var k in newArgs) {
    string += '&' + k + '=' + newArgs[k];
  }
  string = string.substr(1);
  return string;
};

var pRaw = function (args) {
  var keys = Object.keys(args);
  keys = keys.sort()
  var newArgs = {};
  keys.forEach(function (key) {
    newArgs[key] = args[key];
  });

  var string = '';
  for (var k in newArgs) {
    string += '&' + k + '=' + newArgs[k];
  }
  string = string.substr(1);
  return string;
};

/**
* @synopsis 签名算法 
*
* @param jsapi_ticket 用于签名的 jsapi_ticket
* @param url 用于签名的 url ，注意必须动态获取，不能 hardcode
*
* @returns
*/

exports.sign = function(req, res) {
  var ret = {
    jsapi_ticket: global.jsapi_ticket,
    nonceStr: createNonceStr(),
    timestamp: createTimestamp(),
    url: req.body.url
  };
  var string = raw(ret);
      jsSHA = require('jssha');
      shaObj = new jsSHA("SHA-1", "TEXT");
    shaObj.update(string);
  ret.signature = shaObj.getHash('HEX');

  ret.appid = config.appid;

  res.json(ret);
};

exports.preSign = function(req, res) {
  var nonce_str = createNonceStr();
  var params = 'appid=' + config.appid + "&" +
    "body=" + req.query.body + "&" + 
    "mch_id=" + config.mch_id + "&" + 
    "nonce_str=" + nonce_str + "&" + 
    "notify_url=" + config.notify_url + "&" + 
    "openid=" + req.session.openid + "&" + 
    "out_trade_no=" + req.query.out_trade_no + "&" + 
    "spbill_create_ip=" + req.ip.match(/\d+\.\d+\.\d+\.\d+/) + "&" + 
    "total_fee=" + (req.query.total_fee * 100) + "&" + 
    "trade_type=JSAPI&" + 
    "key=" + config.key;
  var md5 = crypto.createHash('md5');
      md5.update(params, "utf8");
  var sign = md5.digest('hex').toUpperCase();
  var xml = "<xml>" + 
    "<appid>" + config.appid + "</appid>" + 
    "<mch_id>" + config.mch_id + "</mch_id>" + 
    "<nonce_str>" + nonce_str + "</nonce_str>" + 
    "<sign>" + sign + "</sign>" + 
    "<body><![CDATA[" + req.query.body + "]]></body>" + 
    "<out_trade_no>" + req.query.out_trade_no + "</out_trade_no>" + 
    "<total_fee>" + (req.query.total_fee * 100) + "</total_fee>" + 
    "<spbill_create_ip>" + req.ip.match(/\d+\.\d+\.\d+\.\d+/) + "</spbill_create_ip>" + 
    "<notify_url>" + config.notify_url + "</notify_url>" + 
    "<trade_type>JSAPI</trade_type>" + 
    "<openid>" + req.session.openid + "</openid>" +
    "</xml>";
  util.log(xml);
  request({
    url: 'https://api.mch.weixin.qq.com/pay/unifiedorder',
    body: xml,
    method: 'post',
    headers: {
      'content-type': 'application/xml',
    }
  }, function(error, response, body) {
    parser.parseString(body, function (err, result) {
      if (err) {
        util.log('preSign[err]: ');
		    util.log(err);
        res.status(500).json({preSign: 0});
      } else if (result.xml.return_code=='SUCCESS' && result.xml.result_code=='SUCCESS') {
        util.log('preSign[success]: ');
		    util.log(result);
        var ret = {
          appId: config.appid,
          nonceStr: createNonceStr(),
          signType: 'MD5',
          timeStamp: createTimestamp(),
          package: 'prepay_id='+result.xml.prepay_id
        };
        var string = pRaw(ret)+ "&key=" + config.key;
        crypto = require('crypto');
        md5Obj = crypto.createHash('MD5');
        md5Obj.update(string);
        ret.paySign = md5Obj.digest('HEX').toUpperCase();
        ret.prepay_id = result.xml.prepay_id;
        util.log('preSign[ret]: ');
		    util.log(ret);
        res.json(ret);
      } else {
        util.log('preSign[result]: ');
		    util.log(result);
        res.status(500).json({preSign: 0});
      }
    });
  });
};

exports.notify = function(req, res) {
  util.log("notify: " + JSON.stringify(req));
  util.log("notify: " + req);
};

var mongoose = require('mongoose'),
  Order = mongoose.model('Order');
var moment = require('moment');

exports.pushMsg = function(req, res) {
  Order.findOne({orderid: req.body.orderid})
    .exec(function(err, order) {
      util.log("pushMsg order: " + JSON.stringify(order));
      request({
        url: "https://api.weixin.qq.com/cgi-bin/message/template/send?access_token="+global.access_token,
        body: JSON.stringify({
          "touser": req.session.openid,
          "template_id": "ayXyQmQOpZBmuSnXBnGd481B8ZZS9CMiwxMz_CVarHA",
          "url": "",
          "topcolor": "#000000",
          "data": {
            "first": {"value": "你好，预订成功，信息如下：", "color": "#000000"},
            "keyword1": {"value": order.bookingtype, "color": "#000000"},
            "keyword2": {"value": moment(order.bookingdate).format('YYYY-MM-DD'), "color": "#000000"},
            "keyword3": {"value": order.period.toString(), "color": "#000000"},
            "keyword4": {"value": order.username, "color": "#000000"},
            "keyword5": {"value": order.usercontact, "color": "#000000"},
            "remark": {"value": "预定企业：" + order.company, "color": "#000000"}
          }
        }),
        method: 'post',
        headers: {
          'content-type': 'application/json',
        }
      }, function(error, response, body) {
        util.log("pushMsg error: " + JSON.stringify(body));
        res.status(200).json(JSON.stringify(body));
      });
    });
};