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
            jsApiList : ['hideOptionMenu']
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
		var order_id = out_trade_no;
		var prepay_id = data.prepay_id;
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
                if(res.err_msg == "get_brand_wcpay_request:ok" ) {
					$.ajax({
						url : "./payments/update",
						type : 'post',
						dataType : 'json',
						contentType : "application/x-www-form-urlencoded; charset=utf-8",
						data : {
							orderid: order_id,
							update: {
								paymentid: prepay_id,
								status: 'PAID'
							}
						}
					}).done(function(data) {
						
					}).fail(function(data) {
						
					});
					$.ajax({
						url : "./orders/update",
						type : 'post',
						dataType : 'json',
						contentType : "application/x-www-form-urlencoded; charset=utf-8",
						data : {
							orderid: order_id,
							update: {
								status: 'COMPLETED'
							}
						}
					}).done(function(data) {
						
					}).fail(function(data) {
						
					});
					$.ajax({
						url : "./weixin/pushMsg",
						type : 'post',
						dataType : 'json',
						contentType : "application/x-www-form-urlencoded; charset=utf-8",
						data : {
							orderid: order_id
						}
					}).done(function(data) {
						
					}).fail(function(data) {
						
					});
                }
            }
        ); 
    }).fail(function(data){
        
    });
}