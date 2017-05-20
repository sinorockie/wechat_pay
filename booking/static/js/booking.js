angular.module('booking', [])
	.controller('index', function($scope, $filter, $http){
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

		$scope.partOne = true;
		$scope.partTwo = false;
		$scope.partThree = false;
		$scope.partFour = false;
		$scope.nextStep = function(partNumber) {
			if (partNumber == 2) {
				$scope.partOne = false;
				$scope.partTwo = true;
				$scope.partThree = false;
				$scope.partFour = false;
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
			} else if (partNumber == 4) {
				if ($scope.isField==false) {
					if (angular.equals($scope.booking_company, undefined) || angular.equals($scope.booking_company, '') || angular.equals($scope.booking_company, null)) {
						$('#errorTips').html("请选择所在公司");
						$('#iosDialog2').fadeIn(200);
						return;
					} else {
						$('#errorTips').html("");
					}
				} else if (angular.equals($scope.booking_user, '') || angular.equals($scope.booking_company, null)) {
					$('#errorTips').html("请填写姓名");
					$('#iosDialog2').fadeIn(200);
					return;
				} else if (angular.equals($scope.booking_contact, '') || angular.equals($scope.booking_contact, null)) {
					$('#errorTips').html("请填写联系方式");
					$('#iosDialog2').fadeIn(200);
					return;
				} else {
					$('#errorTips').html("");
				}
				$scope.partOne = false;
				$scope.partTwo = false;
				$scope.partThree = false;
				$scope.partFour = true;
			}
		}

		$scope.isField = false;
		$scope.setBookingType = function(newBookingType) {
			if (!angular.equals($scope.inits, {})) {
				$scope.booking_type = $scope.inits['BOOKING_TYPE_LIST'][newBookingType].chinese;
				$scope.period_list = $scope.inits['BOOKING_PERIOD_LIST'];
				$scope.company_list = $scope.inits['BOOKING_COMPANY_LIST'];
			}
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
				if (index%2==0) {
					$scope.booking_period.push([data]);
				} else {
					$scope.booking_period[Math.floor(index/2)].push(data);
				}
			});
		};
		$scope.isDone = true;
		$scope.submit = function() {
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
					period: period
		        };
		    console.log(angular.fromJson(data));
			$http.post('./orders/create', data).then(function successCallback(response) {
		    		var orderid = response.data.orderid;
		    		var fee = $scope.booking_fee;
		    		if ($scope.booking_fee>0) {
		    			data = {
		    				orderid: orderid,
		    				fee: fee
		    			}
						console.log(angular.fromJson(data));
		    			$http.post('./payments/create', data).then(function successCallback(response) {
					    		var paymentid = WXPay('足球场类订单', response.data.orderid, response.data.fee);
					    		if (paymentid!=0) {
					    			data = {
					    				orderid: response.data.orderid,
					    				update: {
					    					paymentid: paymentid,
					    					status: 'PAID'
					    				}
					    			}
					    			$http.post('./payments/update', data).then(function successCallback(response) {
							    			data = {
							    				orderid: orderid,
							    				update: {
							    					status: 'COMPLETED'
							    				}
							    			}
							    			$http.post('./orders/update', data).then(function successCallback(response) {
										    		$scope.isDone = false;
										        }, function errorCallback(response) {
													$('#errorTips').html("更新非足球场类订单错误");
													$('#iosDialog2').fadeIn(200);
										    });
								        }, function errorCallback(response) {
											$('#errorTips').html("更新非球场类支付订单错误");
											$('#iosDialog2').fadeIn(200);
								    });
					    		} else {
									$('#errorTips').html("创建球场类支付订单错误");
									$('#iosDialog2').fadeIn(200);
					    		}
					        }, function errorCallback(response) {
								$('#errorTips').html("创建球场类支付订单错误");
								$('#iosDialog2').fadeIn(200);
					    });
		    		} else {
		    			data = {
		    				orderid: response.data.orderid,
		    				update: {
		    					status: 'COMPLETED'
		    				}
		    			}
		    			$http.post('./orders/update', data).then(function successCallback(response) {
					    		$scope.isDone = false;
					        }, function errorCallback(response) {
								$('#errorTips').html("更新非足球场类订单错误");
								$('#iosDialog2').fadeIn(200);
					    });
		    		}
		        }, function errorCallback(response) {
					$('#errorTips').html("创建非球场类订单错误");
					$('#iosDialog2').fadeIn(200);
		    });
		};

		$scope.$watch('booking_type', function(newBookingType, oldBookingType) {
			if (!angular.equals($scope.inits, {})) {
				$scope.isField = $scope.booking_type == $scope.inits['BOOKING_TYPE_LIST']['FIELD'].chinese;
				if ($scope.isField) {
					$scope.unit_price = $scope.inits['UNIT_PRICE'];
				} else {
					$scope.unit_price = 0.0;
				}
			}
		});
		$scope.$watch('selected_units', function(newSelectedUnits, oldSelectedUnits) {
			if (!angular.equals($scope.inits, {})) {
				$scope.booking_fee = $scope.unit_price * $scope.selected_units;
			}
		});
		$scope.$watch('input_booking_date', function(newDate, oldDate) {
			$scope.booking_date = $filter('date')(newDate, "yyyy-MM-dd");
		});
		$scope.$watch('input_booking_company', function(newCompany, oldCompany) {
			$scope.booking_company = newCompany;
		});
	});