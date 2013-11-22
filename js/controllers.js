motoApp.controller('InitApp', ['$scope', function($scope, GetSpots){
	

}]);
motoApp.controller('ShowList', ['$scope', '$routeParams', 'GetSpots', 'Distance', function($scope, $routeParams, GetSpots, Distance){

	$scope.spots = [];
	$scope.currentLocation = {};
	$scope.back = function(){
		window.history.back();
	};
	$scope.GetCurrentLocation = function(callback){
		if(navigator.geolocation){
			navigator.geolocation.getCurrentPosition(function(position){
				$scope.currentLocation.lat = position.coords.latitude
				$scope.currentLocation.lng = position.coords.longitude;
				callback();
			});
		}

	};

	$scope.ConvertAddressToLatLng = function(){
		//alert($scope.address);
		if($scope.address.search(/Francsico/i) < 1){
			$scope.address = $scope.address + ', San Francsico, CA';
		}
		$http.get($scope.AddressToLatLngUrl + $scope.address + '&sensor=false').success(function(data, status){
			if(status == 200 && data.status == 'OK'){
				$scope.addressToLatLng = data.results[0].geometry.location;
				$scope.CalculateEachDistance($scope.addressToLatLng, $scope.spots);
				$scope.SortByDistance($scope.spots);
				console.log($scope.addressToLatLng);
			} else {
				console.info('GOOGLE STATUS', data.status);
				console.info('HTTP', status);
			}
		});
	}

	$scope.CalculateEachDistance = function(currentLocation, data) {
		angular.forEach(data, function(key, value){
			console.log(currentLocation.lat,currentLocation.lng, key.lat, key.lng);
			key.distance = parseFloat(Math.round(Distance.get(currentLocation.lat,currentLocation.lng, key.lat, key.lng) * 100) / 100).toFixed(2);
		});
	}
	$scope.SortByDistance = function(spots){
		spots.sort(function(a,b){
			if(a.distance > b.distance){
				return 1;
			} else if(a.distance < b.distance){
				return -1;
			}
			return 0;
		});
	};
	$scope.Init = function(){
		GetSpots.fetchParkingData().success(function(data){
			$scope.spots = data.parking.spots;
			$scope.CalculateEachDistance($scope.currentLocation, $scope.spots);
			$scope.SortByDistance($scope.spots);
		});
	};
	if($routeParams.sortOption == 'current-location'){
		$scope.GetCurrentLocation($scope.Init);
	} else if ($routeParams.sortOption == 'by-address'){
		$scope.ConvertAddressToLatLng();
	}
}]);

motoApp.controller('ShowDetails', ['$http', '$scope', '$routeParams', 'Detail', function($http, $scope, $routeParams, Detail){
	$scope.url = 'json/data.json';
	$scope.spots = [];
	$scope.back = function(){
		window.history.back();
	};
	setTimeout(function(){
		$scope.$apply(function(){
			$scope.spotDetails = Detail.get($scope.spots, {id: $routeParams.id});
		});
	}, 200);
	/*$scope.CalculateDistance = function () {
		$scope.$apply(function(){
			$scope.distance = GetDistance.get($scope.currentLocation.lat ,$scope.currentLocation.lng ,$scope.spotDetails.lat, $scope.spotDetails.lng);
			$scope.distance = parseFloat(Math.round($scope.distance * 100) / 100).toFixed(2) + ' miles away!';
		});
	}*/
	/*setTimeout(function(){
		$scope.$apply(function(){
			$scope.coords.latitude = $scope.spotDetails.lat;
			$scope.coords.longitude = $scope.spotDetails.lng;
			$scope.markersProperty[0].latitude = $scope.spotDetails.lat;
			$scope.markersProperty[0].longitude = $scope.spotDetails.lng;
			$scope.zoomProperty = 16;

			$scope.centerProperty.latitude = $scope.spotDetails.lat;
			$scope.centerProperty.longitude = $scope.spotDetails.lng;

			$scope.GetCurrentLocation();
			//google.maps.event.trigger(map, 'resize');
			setTimeout(function(){
				//$scope.CalculateDistance();
				//console.log($scope.distance);
				//console.log('CURRENT LOCATION', $scope.currentLocation);
			}, 1000);
		})
	}, 500);*/
}]);
