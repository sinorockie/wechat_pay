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
			$http.post('./orders/get', data).then(function successCallback(response) {
		    		$scope.list = response.data.list;
		        }, function errorCallback(response) {
					
		    });
		};
	});