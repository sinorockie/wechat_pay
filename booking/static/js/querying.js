angular.module('querying', [])
	.controller('list', function($scope, $filter, $http){
		$scope.from_date = "";
		$scope.to_date = "";
		$scope.$watch('input_from_date', function(newDate, oldDate) {
			$scope.from_date = $filter('date')(newDate, "yyyy-MM-dd");
		});
		$scope.$watch('input_to_date', function(newDate, oldDate) {
			$scope.to_date = $filter('date')(newDate, "yyyy-MM-dd");
		});
		$scope.list = [];
		$scope.submit = function() {
			var data = {
					fromDate: $scope.from_date,
					toDate: $scope.to_date
		        };
		    console.log(angular.fromJson(data));
			$http.post('./get', data).then(function successCallback(response) {
					var orderList = response.data.list;
					var periodString = "";
					angular.forEach(orderList, function(data,index,array){
						data.bookingdate = $filter('date')(new Date(data.bookingdate), "yyyy-MM-dd");
						periodString = "";
						angular.forEach(data.period, function(data,index,array){
							periodString += data + ",";
						});
						periodString = periodString.substr(0, periodString.length-1);
						data.period = periodString;
					});
		    		$scope.list = response.data.list;
		        }, function errorCallback(response) {
					
		    });
		};
	});