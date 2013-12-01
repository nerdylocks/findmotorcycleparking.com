'use strict';

motoApp.controller('ShowSplash', ['$scope', 'Data', function($scope, Data){
	Data.fetchParkingData();
	setTimeout(function(){
		window.location = '/#/search';
	}, 1000);
	console.log(angular.element(window).width());
}]);

motoApp.controller('InitApp', ['$scope', 'Data', function($scope, Data){
	Data.fetchParkingData();
	$scope.SearchFromAddress = function(){
		window.location = '/#/list/' + $scope.address;
	}
}]);

motoApp.controller('ShowList', ['$scope', '$routeParams', 'Data', 'LocationServices' , 'Distance', function($scope, $routeParams, Data, LocationServices, Distance){

	$scope.spots = Data.parkingSpots;
	$scope.limit = 5;
	$scope.LoadMore = function(){
		$scope.limit += 5;
	}
	if($scope.spots.length == 0){
		Data.fetchParkingData();
		setTimeout(function(){
			$scope.spots = Data.parkingSpots;
			console.log($scope.spots.length + ' now');
		}, 500);
	} else {
		console.log($scope.spots.length + ' records loaded');
	}

	$scope.currentLocation = {};
	$scope.orderProp = 'distance';

	$scope.back = function(){
		window.location = '/#/search';
	};

	$scope.SearchFromAddress = function(){
		LocationServices.convertAddressToLatLng($scope.newAddress, $scope.LoadData);
	};

	$scope.LoadData = function(location){
		Distance.calculateEachDistance(location, $scope.spots);
		setTimeout(function(){
			$scope.$apply();
		}, 500);
	};

	if($routeParams.sortOption == 'current-location'){
		LocationServices.getCurrentLocation($scope.LoadData);
	} else {
		LocationServices.convertAddressToLatLng($routeParams.sortOption, $scope.LoadData);
	}
}]);

motoApp.controller('ShowDetails', ['$http', '$scope', '$routeParams', 'Distance', 'Data','Detail', function($http, $scope, $routeParams, Distance, Data, Detail){
	$scope.spots = Data.parkingSpots;

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
                draggable: false
            }
        },
        defaults: {
        	tileLayerOptions: {
				detectRetina: true
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
