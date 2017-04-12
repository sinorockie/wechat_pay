angular.module('booking', [])
	.controller('index', function($scope, $filter, $http){
		$http.get('./static/js/init.json')
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
			if (partNumber == 1) {
				$scope.partOne = true;
				$scope.partTwo = false;
				$scope.partThree = false;
				$scope.partFour = false;
			} else if (partNumber == 2) {
				$scope.partOne = false;
				$scope.partTwo = true;
				$scope.partThree = false;
				$scope.partFour = false;
			} else if (partNumber == 3) {
				$scope.partOne = false;
				$scope.partTwo = false;
				$scope.partThree = true;
				$scope.partFour = false;
			} else if (partNumber == 4) {
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
		}

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