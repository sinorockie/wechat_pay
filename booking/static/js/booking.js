angular.module('booking', [])
	.controller('index', function($scope, $filter, $http, $window){
		$http.get('./init')
			.success(function(data){
			$scope.inits = data;
		});

		$scope.inits = {};
		$scope.unit_price = 0.0;

		$scope.booking_type = "";
		$scope.booking_date = "";
		$scope.booking_period = [];
		$scope.booking_fee = 0.0;
		$scope.booking_company = "";
		$scope.booking_user = "";
		$scope.booking_contact = "";
		$scope.input_booking_date = new Date();
		$scope.input_booking_type = "";
		$scope.booking_service = false;

		$scope.partOne = true;
		$scope.partTwo = false;
		$scope.partThree = false;
		$scope.partFour = false;
		$scope.partFive = false;
		$scope.nextStep = function(partNumber) {
			if (partNumber == 1) {
				$window.location.reload();
			} else if (partNumber == 2) {
				$scope.partOne = false;
				$scope.partTwo = true;
				$scope.partThree = false;
				$scope.partFour = false;
				$scope.partFive = false;
			} else if (partNumber == 3) {
				if (angular.equals($scope.booking_date, undefined) || angular.equals($scope.booking_date, null)) {
					$('#errorTips').html("请选择预定日期");
					$('#iosDialog2').fadeIn(200);
					return;
				} else if ($scope.selected_units==0) {
					$('#errorTips').html("请选择预定时段");
					$('#iosDialog2').fadeIn(200);
					return;
				} else {
					$('#errorTips').html("");
				}
				$scope.partOne = false;
				$scope.partTwo = false;
				$scope.partThree = true;
				$scope.partFour = false;
				$scope.partFive = false;
			} else if (partNumber == 4) {
				if ($scope.isField==false) {
					if (angular.equals($scope.booking_company, undefined) || angular.equals($scope.booking_company, '') || angular.equals($scope.booking_company, null)) {
						$('#errorTips').html("请填写公司");
						$('#iosDialog2').fadeIn(200);
						return;
					}
				}
				if (angular.equals($scope.booking_user, '') || angular.equals($scope.booking_company, null)) {
					$('#errorTips').html("请填写姓名");
					$('#iosDialog2').fadeIn(200);
					return;
				}
				if (angular.equals($scope.booking_contact, '') || angular.equals($scope.booking_contact, null)) {
					$('#errorTips').html("请填写手机号");
					$('#iosDialog2').fadeIn(200);
					return;
				}
				$scope.booking_fee = $scope.unit_price * $scope.selected_units;
				if ($scope.booking_service) {
					$scope.booking_fee += $scope.inits['SERVICE_PRICE'];
				}
				$scope.partOne = false;
				$scope.partTwo = false;
				$scope.partThree = false;
				$scope.partFour = true;
			} else if (partNumber == 5) {
				$scope.partOne = false;
				$scope.partTwo = false;
				$scope.partThree = false;
				$scope.partFour = false;
				$scope.partFive = true;
			}
		}

		$scope.isField = false;
		$scope.isBar = false;
		$scope.setBookingType = function(newBookingType) {
			if (!angular.equals($scope.inits, {})) {
				$scope.input_booking_type = newBookingType;
				$scope.booking_service = false;
				$scope.booking_company = "";
				$scope.booking_type = $scope.inits['BOOKING_TYPE_LIST'][newBookingType].chinese;
				$scope.company_list = $scope.inits['BOOKING_COMPANY_LIST'];
				if (newBookingType=="FIELD") {
					$scope.unit_price = $scope.inits['FIELD_UNIT_PRICE'];
				} else if (newBookingType=="MEETINGROOMFL1") {
					$scope.unit_price = $scope.inits['MEETINGROOMFL1_UNIT_PRICE'];
				} else {
					$scope.unit_price = 0.0;
				}
				var data = {
						fromDate: $scope.input_booking_date,
						toDate: $scope.input_booking_date,
						bookingType: $scope.booking_type
					};
				$http.post('./orders/period', data).then(function successCallback(response) {
						$scope.booked_list = response.data.list;
						var tmp = [];
						angular.forEach($scope.inits['BOOKING_PERIOD_LIST'], function(data,index,array){
							var flag = false;
							angular.forEach(response.data.list, function(ld,li,la){
								angular.forEach(ld.period, function(pd,pi,pa){
									if (data.period==pd) {
										flag = true;
									}
								});
							});
							if (!flag) {
								tmp.push(data);
							}
						});
						$scope.period_list = tmp;
					}, function errorCallback(response) {
						
				});
			}
		};
		$scope.setBookingService = function() {
			$scope.booking_service = !$scope.booking_service;
		};
		$scope.selected_periods = [];
		$scope.selected_units = 0;
		$scope.selectPeriod = function(p){
			if ($scope.selected_periods.indexOf(p) >= 0) {
				$scope.selected_periods.splice($scope.selected_periods.indexOf(p), 1);
				$scope.selected_units--;
			} else {
				$scope.selected_periods.push(p);
				$scope.selected_units++;
			}
			$scope.selected_periods = $filter('orderBy')($scope.selected_periods, 'period');
			$scope.booking_period = [];
			angular.forEach($scope.selected_periods, function(data,index,array){
				$scope.booking_period.push(data);
			});
		};
		$scope.isDone = true;
		$scope.submit = function() {
			$scope.isDone = false;
			var period = [];
			angular.forEach($scope.selected_periods, function(data,index,array){
				period.push(data.period);
			});
			var data = {
					username: $scope.booking_user,
					usercontact: $scope.booking_contact,
					company: angular.equals($scope.booking_company, undefined) || angular.equals($scope.booking_company, null) ? '' : $scope.booking_company,
					bookingtype: $scope.booking_type,
					bookingdate: $scope.booking_date,
					bookingfee: $scope.booking_fee,
					period: period,
					favor: $scope.booking_service
		        };
		    console.log(angular.fromJson(data));
			$http.post('./orders/create', data).then(function successCallback(response) {
		    		var orderid = response.data.orderid;
		    		var fee = $scope.booking_fee;
					if (response.data.orderid != 0) {
						if ($scope.booking_fee>0) {
							data = {
								orderid: orderid,
								fee: fee
							}
							$http.post('./payments/create', data).then(function successCallback(response) {
									WXPay($scope.booking_type + '订单', response.data.orderid, response.data.fee);
								}, function errorCallback(response) {
									
							});
						} else {
							data = {
								orderid: response.data.orderid,
								update: {
									status: 'COMPLETED'
								}
							}
							$http.post('./orders/update', data).then(function successCallback(response) {
									$http.post('./weixin/pushMsg', {orderid: data.orderid}).then(function successCallback(response) {
		
										}, function errorCallback(response) {
											
									});
								}, function errorCallback(response) {
									
							});
						}
					} else {
						var periodString = "";
						angular.forEach(response.data.period, function(data,index,array){
							periodString += "<br>" + data + ",";
						});
						periodString = periodString.substr(0, periodString.length-1) + "&nbsp";
						$('#errorTips').html("以下时间段已被预定:" + periodString);
						$('#iosDialog2').fadeIn(200);
					}
		        }, function errorCallback(response) {
					
		    });
		};

		$scope.$watch('booking_type', function(newBookingType, oldBookingType) {
			if (!angular.equals($scope.inits, {})) {
				$scope.isField = $scope.booking_type == $scope.inits['BOOKING_TYPE_LIST']['FIELD'].chinese;
				$scope.isBar = $scope.booking_type == $scope.inits['BOOKING_TYPE_LIST']['BAR'].chinese;
			}
		});
		$scope.booked_list = [];
		$scope.$watch('input_booking_date', function(newDate, oldDate) {
			$scope.booking_date = $filter('date')(newDate, "yyyy-MM-dd");
			var data = {
					fromDate: newDate,
					toDate: newDate,
					bookingType: $scope.booking_type
		        };
		    $http.post('./orders/period', data).then(function successCallback(response) {
					$scope.booked_list = response.data.list;
					var tmp = [];
					angular.forEach($scope.inits['BOOKING_PERIOD_LIST'], function(data,index,array){
						var flag = false;
						angular.forEach(response.data.list, function(ld,li,la){
							angular.forEach(ld.period, function(pd,pi,pa){
								if (data.period==pd) {
									flag = true;
								}
							});
						});
						if (!flag) {
							tmp.push(data);
						}
					});
					$scope.period_list = tmp;
		        }, function errorCallback(response) {
					
		    });
		});
		$scope.$watch('input_booking_company', function(newCompany, oldCompany) {
			$scope.booking_company = newCompany;
		});
	});