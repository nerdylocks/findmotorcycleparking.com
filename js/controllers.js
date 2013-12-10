'use strict';

motoApp.controller('Splash', ['$scope', '$rootScope', '$location', '$window', 'Data', function($scope, $rootScope, $location, $window, Data){
	Data.fetchParkingData();
	$scope.slide = '';

	$scope.back = function(){
		$scope.slide = 'slide-right';
		$window.history.back();
	};

	$window.location = '#/search';

}]);

motoApp.controller('Search', ['$scope', '$location', 'Data', function($scope, $location, Data){
	Data.fetchParkingData();
    $scope.slide = '';
	$scope.SearchFromAddress = function(){
        $scope.slide = 'slide-down';
		$location.url('/list/' + $scope.address);
	}
}]);

motoApp.controller('List', ['$scope', '$rootScope', '$location', '$window', '$routeParams', 'Data', 'LocationServices' , 'Distance', function($scope, $rootScope, $location, $window, $routeParams, Data, LocationServices, Distance){
    $rootScope.$on('LOAD', function(){
        $rootScope.loading = true;
    });
    $rootScope.$on('UNLOAD', function(){
        $rootScope.loading = false;
    });
	$scope.spots = Data.parkingSpots;
	$scope.limit = 5;
	$scope.LoadMore = function(){
		$scope.limit += 5;
	}
    $scope.slide = '';
    $scope.go = function(path){
        $scope.slide = 'slide-left';
        $location.url(path);
    }
    $scope.back = function(){
        $scope.slide = 'slide-up';
        $window.history.back();
    };
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
    $scope.getByCurrentLocation = function(){
        LocationServices.getCurrentLocation($scope.LoadData);
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
        $scope.slide = 'slide-down';
		LocationServices.getCurrentLocation($scope.LoadData);
	} else {
		LocationServices.convertAddressToLatLng($routeParams.sortOption, $scope.LoadData);
	}
}]);

motoApp.controller('Details', ['$http', '$scope', '$window', '$routeParams', 'Distance', 'Data','Detail', 'LocationServices', function($http, $scope, $window, $routeParams, Distance, Data, Detail, LocationServices){
	$scope.spots = Data.parkingSpots;

    $scope.slide = '';
    $scope.back = function(){
        $scope.slide = 'slide-right';
        $window.history.back();
    };
	angular.extend($scope, {
		baselayers: {
			name: 'Cloudmade Night Commander',
	        type: 'xyz',
	        url: 'http://{s}.tile.cloudmade.com/{key}/{styleId}/256/{z}/{x}/{y}.png',
	        layerParams: {
	            key: '007b9471b4c74da4a6ec7ff43552b16f',
	            styleId: 999
	        },
	        layerOptions: {
	            subdomains: ['a', 'b', 'c'],
	            continuousWorld: true
	        }
		},
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
        	detectRetina: true
		}
    });
    $scope.GetDirections = function(address){
        var url = 'maps:q=';
        $window.location = url + $scope.spotDetails.lat + ', ' + $scope.spotDetails.lng;
    }
	setTimeout(function(){
		$scope.$apply(function(){
			$scope.spotDetails = Detail.get($scope.spots, {id: $routeParams.id});
			if($scope.spotDetails.free){
				$scope.spotDetails.free = 'Unmetered';
			} else {
				$scope.spotDetails.free = 'Metered';
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
