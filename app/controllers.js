'use strict';

motoApp.controller('Splash', ['$scope', '$location', '$window', 'Data', function($scope, $location, $window, Data){

	$scope.slide = '';

	$scope.back = function(){
		$scope.slide = 'slide-right';
		$window.history.back();
	};

	$window.location = '#/search';

}]);

motoApp.controller('Search', ['$scope', '$rootScope', '$location', 'Data', function($scope, $rootScope, $location, Data){
    Data.fetchParkingData();
    $rootScope.searchFromAddress = false;
    $scope.slide = '';
	$scope.SearchFromAddress = function(){
        $scope.slide = 'slide-down';
        $rootScope.searchFromAddress = true;
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

	$scope.currentLocation = {};
	$scope.orderProp = 'distance';
    $scope.getByCurrentLocation = function(){
        $rootScope.searchFromAddress = false;
        LocationServices.getCurrentLocation($scope.LoadData);
    };
	$scope.SearchFromAddress = function(){
        $rootScope.searchFromAddress = true;
		LocationServices.googleLocations($scope.newAddress, $scope.LoadData);
	};

	$scope.LoadData = function(coords){
        if($rootScope.searchFromAddress){
            Distance.calculateEachDistance(coords.geometry.location, $rootScope.spots);
        } else {
            Distance.calculateEachDistance(coords, $rootScope.spots);
        }

		setTimeout(function(){
            $rootScope.$apply();
		}, 500);
	};

	if($routeParams.sortOption == 'current-location'){
        $scope.slide = 'slide-down';
        $rootScope.searchFromAddress = false;
		LocationServices.getCurrentLocation($scope.LoadData);
	} else {
        $rootScope.searchFromAddress = true;
		LocationServices.googleLocations($routeParams.sortOption, $scope.LoadData);
	}
}]);

motoApp.controller('Details', ['$http', '$scope', '$rootScope', '$window', '$routeParams', 'Distance', 'Data','Detail', 'LocationServices', function($http, $scope, $rootScope, $window, $routeParams, Distance, Data, Detail, LocationServices){
    $scope.slide = '';
    $scope.spotDetails = {};
    $scope.back = function(){
        $scope.slide = 'slide-right';
        $window.history.back();
    };
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
        	detectRetina: true
		}
    });
    $scope.GetDirections = function(){
        var url = 'maps:q=';
        $window.location = url + $scope.spotDetails.lat + ', ' + $scope.spotDetails.lng;
    }

	setTimeout(function(){
		$scope.$apply(function(){
			$scope.spotDetails = Detail.get($rootScope.spots, {id: $routeParams.id});
            console.log($scope.spotDetails);
			if($scope.spotDetails.free){
				$scope.spotDetails.free = 'Unmetered';
			} else {
				$scope.spotDetails.free = 'Metered';
			}
			$scope.center.lat = $scope.spotDetails.lat;
			$scope.center.lng = $scope.spotDetails.lng;
			$scope.markers.main_marker.lat = $scope.spotDetails.lat;
			$scope.markers.main_marker.lng = $scope.spotDetails.lng;
		});
	}, 300);
}]);
