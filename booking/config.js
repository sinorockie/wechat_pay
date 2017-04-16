module.exports = {
	appid: "wxb8b350f3d3d0de52",
	secret: "7d6e9ce21656e5c5a0caef33d01db31d",
	mch_id: "",
	notify_url: 'http://127.0.0.1/weixin/notify',
	init: {
		"BOOKING_TYPE_LIST": {
			"FIELD": {"chinese": "足球场"},
			"BAR": {"chinese": "书吧/咖啡厅"},
			"ROOM": {"chinese": "会议室"}
		},
		"BOOKING_PERIOD_LIST": [
			{"period": "09:00-09:59"},
			{"period": "10:00-10:59"},
			{"period": "11:00-11:59"},
			{"period": "12:00-12:59"},
			{"period": "13:00-13:59"},
			{"period": "14:00-14:59"},
			{"period": "15:00-15:59"},
			{"period": "16:00-16:59"},
			{"period": "17:00-17:59"},
			{"period": "18:00-18:59"},
			{"period": "19:00-19:59"}
		],
		"BOOKING_COMPANY_LIST": [
			{"company": ""},
			{"company": "朴洛教育科技（上海）有限公司"}
		],
		"UNIT_PRICE": 100
	}
}