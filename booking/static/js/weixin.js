$.ajax({
    url : "./utils/sign",
    type : 'get',
    dataType : 'json',
    contentType : "application/x-www-form-urlencoded; charset=utf-8",
    data : {
        'url' : location.href.split('#')[0]
    }
}).done(function(data) {
    wx.config({
            debug : true,
            appId : 'wxb8b350f3d3d0de52',
            timestamp : data.timestamp,
            nonceStr : data.nonceStr,
            signature : data.signature,
            jsApiList : ['hideOptionMenu', 'chooseWXPay']
        });
    wx.hideOptionMenu();
});

function WXPay(body, out_trade_no, total_fee) {
    $.ajax({
        url : "./utils/preSign",
        type : 'get',
        dataType : 'json',
        contentType : "application/x-www-form-urlencoded; charset=utf-8",
        data : {
            body: body,
            out_trade_no: out_trade_no,
            total_fee: total_fee
        }
    }).done(function(data) {
        wx.chooseWXPay({
            timestamp: data.timeStamp,
            nonceStr: data.nonceStr,
            package: data.package,
            signType: 'MD5',
            paySign: data.paySign,
            success: function (res) {
                console.dir(res);
            }
        });
    }).fail(function(data){
        console.dir(data);
    });
}