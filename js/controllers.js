'use strict';

motoApp.controller('InitApp', ['$scope', 'LocationServices', 'Distance', 'Data', function($scope, LocationServices, Distance, Data){
	$scope.lnglat = {};
	$scope.spots = [];

	$scope.SearchFromAddress = function(){
		window.location = '/#/list/' + $scope.address;
	}

}]);
motoApp.controller('ShowList', ['$scope', '$routeParams', 'Data', 'LocationServices' , 'Distance', 'SortByDistance', function($scope, $routeParams, Data, LocationServices, Distance, SortByDistance){
	$scope.spots = [];
	$scope.currentLocation = {};
	$scope.back = function(){
		window.location = '/#/';
	};

	$scope.CalculateEachDistance = function(currentLocation, data) {
		angular.forEach(data, function(key, value){
			key.distance = parseFloat(Math.round(Distance.get(currentLocation.lat,currentLocation.lng, key.lat, key.lng) * 100) / 100).toFixed(2);
		});
	};
	$scope.LoadData = function(currentLoc){
		Data.fetchParkingData().success(function(data){
			$scope.spots = data.parking.spots;
			$scope.CalculateEachDistance(currentLoc, $scope.spots);
			Distance.sortByDistance($scope.spots);
		});
	};
	if($routeParams.sortOption == 'current-location'){
		LocationServices.getCurrentLocation($scope.LoadData);
	} else {
		LocationServices.convertAddressToLatLng($routeParams.sortOption, $scope.LoadData);
	}
}]);

motoApp.controller('ShowDetails', ['$http', '$scope', '$routeParams', 'Distance', 'Data','Detail', function($http, $scope, $routeParams, Distance, Data, Detail){
	Data.fetchParkingData().success(function(data){
		$scope.spots = data.parking.spots;
	});
	$scope.back = function(){
		window.history.back();
	};
	setTimeout(function(){
		$scope.$apply(function(){
			$scope.spotDetails = Detail.get($scope.spots, {id: $routeParams.id});
		});
	}, 300);
}]);
