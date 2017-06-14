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
	});