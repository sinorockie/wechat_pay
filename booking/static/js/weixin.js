$.ajax({
    url : "./weixin/sign",
    type : 'post',
    dataType : 'json',
    contentType : "application/x-www-form-urlencoded; charset=utf-8",
    data : {
        'url' : location.href.split('#')[0]
    }
}).done(function(data) {
    wx.config({
            debug : false,
            appId : data.appid,
            timestamp : data.timestamp,
            nonceStr : data.nonceStr,
            signature : data.signature,
            jsApiList : ['hideOptionMenu', 'chooseWXPay']
        });
            wx.ready(function(){
            wx.hideOptionMenu();
        });
});

function WXPay(body, out_trade_no, total_fee) {
    $.ajax({
        url : "./weixin/preSign",
        type : 'get',
        dataType : 'json',
        contentType : "application/x-www-form-urlencoded; charset=utf-8",
        data : {
            body: body,
            out_trade_no: out_trade_no,
            total_fee: total_fee
        }
    }).done(function(data) {
        console.dir('WXPay[Done]: ');
		console.dir(data);

        WeixinJSBridge.invoke(
            'getBrandWCPayRequest',
            {
                "appId": data.appId,
                "timeStamp": data.timeStamp,
                "nonceStr": data.nonceStr,    
                "package": data.package,
                "signType": data.signType,
                "paySign": data.paySign
            },
            function(res){     
                WeixinJSBridge.log(res.err_msg);
                alert(res.err_code+res.err_desc+res.err_msg);
                console.dir('WXPay[OK]: ');
                console.dir(res);
            }
        ); 
        return 0;
    }).fail(function(data){
        console.dir('WXPay[Fail]: ' + data);
        return 0;
    });
}

if (typeof WeixinJSBridge == "undefined"){
   if( document.addEventListener ){
       document.addEventListener('WeixinJSBridgeReady', WXPay, false);
   }else if (document.attachEvent){
       document.attachEvent('WeixinJSBridgeReady', WXPay); 
       document.attachEvent('onWeixinJSBridgeReady', WXPay);
   }
}