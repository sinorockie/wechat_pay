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
    url: req.query.url
  };
  var string = raw(ret);
      jsSHA = require('jssha');
      shaObj = new jsSHA("SHA-1", "TEXT");
    shaObj.update(string);
  ret.signature = shaObj.getHash('HEX');

  res.json(ret);
};

var http = require('http');
var util = require('util');
var crypto = require('crypto');

var xml2js = require('xml2js');
var builder = new xml2js.Builder();
var parser = new xml2js.Parser();

exports.preSign = function(req, res) {
  var xml = builder.buildObject({
    appid: 'wxb8b350f3d3d0de52',
    mch_id: '',
    nonce_str: createNonceStr(),
    body: req.query.body,
    out_trade_no: req.query.out_trade_no,
    total_fee: req.query.total_fee,
    spbill_create_ip: req.ip.match(/\d+\.\d+\.\d+\.\d+/),
    notify_url: 'http://127.0.0.1/weixin/notify',
    trade_type: 'JSAPI',
    openid: req.session.openid
  });
  var response = "";
  http.request({
    hostname: 'https://api.mch.weixin.qq.com',
    path: '/pay/unifiedorder',
    data: xml,
    method: 'POST',
    headers: {
      'Connection': 'Keep-Alive',
      'Content-Type': 'application/xml;charset=utf-8',
      'Content-length': xml.length
    }
  }, function(res) {
    util.log(res);
    if(res.statusCode==200) {
          res.on('data', function (chunk) {
              response += chunk;                  
          });
          res.on('end', function (chunk) {
            parser.parseString(response, function (err, result) {
              if (err) {
                util.log(err);
                res.status(500).json("Failed to get prepay_id");
              } else if (result.return_code=='SUCCESS' && result.result_code=='SUCCESS') {
                var ret = {
                  appId: 'wxb8b350f3d3d0de52',
                  nonceStr: createNonceStr(),
                  timeStamp: createTimestamp(),
                  signType: 'MD5',
                  package: 'prepay_id='+result.prepay_id
                };
                var string = raw(ret);
                    crypto = require('crypto');
                    md5Obj = crypto.createHash('MD5');
                  md5Obj.update(string);
                ret.preSign = md5Obj.digest('HEX');

                res.json(ret);
              } else {
                res.status(500).json("Failed to get prepay_id");
              }
            });
          });
    } else {
      res.status(500).json("Failed to get prepay_id");
    }
  }).end();
};

exports.notify = function(req, res) {
  res.json(req.ip.match(/\d+\.\d+\.\d+\.\d+/));
};