'use strict';

motoApp.controller('InitApp', function($scope){
	$scope.SearchFromAddress = function(){
		window.location = '/#/list/' + $scope.address;
	}

});

motoApp.controller('ShowList', ['$scope', '$routeParams', 'Data', 'LocationServices' , 'Distance', function($scope, $routeParams, Data, LocationServices, Distance){
	$scope.spots = [];
	$scope.currentLocation = {};
	$scope.limit = 5;
	$scope.orderProp = 'distance';
	$scope.back = function(){
		window.location = '/#/';
	};
	$scope.LoadMore = function(){
		$scope.limit += 5;
	}

	$scope.LoadData = function(currentLoc){
		console.log(currentLoc);
		Data.fetchParkingData().success(function(data){
			$scope.spots = data.parking.spots;
			Distance.calculateEachDistance(currentLoc, $scope.spots);
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
			console.log($scope.spotDetails);
			if($scope.spotDetails.free){
				$scope.spotDetails.free = 'unmetered';
			} else {
				$scope.spotDetails.free = 'metered';
			}
		});
	}, 300);
}]);
