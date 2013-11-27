'use strict';

motoApp.controller('ShowSplash', function($scope){
	setTimeout(function(){
		window.location = '/#/search';
	}, 2000)

});

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
	$scope.SearchFromAddress = function(){
		LocationServices.convertAddressToLatLng($scope.newAddress, $scope.LoadData);
	};

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
	angular.extend($scope, {
        center: {
            lat: 37.7833,
            lng: -122.4167,
            zoom: 16
        },
        markers: {
            main_marker: {
                lat: 37.7833,
            	lng: -122.4167,
                draggable: true
            }
        }
    });
	$scope.back = function(){
		window.history.back();
	};
	setTimeout(function(){
		$scope.$apply(function(){
			$scope.spotDetails = Detail.get($scope.spots, {id: $routeParams.id});
			if($scope.spotDetails.free){
				$scope.spotDetails.free = 'unmetered';
			} else {
				$scope.spotDetails.free = 'metered';
			}
			console.log($scope.spotDetails.lat, $scope.spotDetails.lng);
			$scope.center.lat = $scope.spotDetails.lat;
			$scope.center.lng = $scope.spotDetails.lng;
			$scope.markers.main_marker.lat = $scope.spotDetails.lat;
			$scope.markers.main_marker.lng = $scope.spotDetails.lng;
			console.log($scope.center);
		});
	}, 300);
}]);
