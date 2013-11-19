motoApp.controller('InitApp', function($scope, $http, $routeParams, $q, $log){
	$scope.url = 'json/data.json';
	$scope.spots = [];
	$scope.currentLocation = {};

	$scope.addressToLatLng = {};
	$scope.distance;
	$scope.AddressToLatLngUrl = 'http://maps.googleapis.com/maps/api/geocode/json?address=';
	$scope.address;

	$scope.handleSpotsLoaded = function(data, status){
		$scope.spots = data.parking.spots;
	};
	$scope.fetchParkingData = function(){
		$http.get($scope.url).success($scope.handleSpotsLoaded);
	};
	setTimeout(function(){
		$scope.fetchParkingData();
	}, 1500);
	$scope.ConvertAddressToLatLng = function(){
		if($scope.address.search(/Francsico/i) < 1){
			$scope.address = $scope.address + ', San Francsico, CA';
		}
		$http.get($scope.AddressToLatLngUrl + $scope.address + '&sensor=false').success(function(data, status){
			if(status == 200 && data.status == 'OK'){
				$scope.addressToLatLng = data.results[0].geometry.location;
			} else {
				console.info('GOOGLE STATUS', data.status);
				console.info('HTTP', status);
			}
		});
	};
	$scope.CalculateDistance = function () {
		$scope.$apply(function(){
			$scope.distance = $scope.GetDistance($scope.currentLocation.lat ,$scope.currentLocation.lng ,$scope.spotDetails.lat, $scope.spotDetails.lng);
			$scope.distance = parseFloat(Math.round($scope.distance * 100) / 100).toFixed(2) + ' miles away!';
		});
	};
	$scope.GetDistance = function(lat1, lng1, lat2, lng2, unit){
		var radLat1, radLat2, radLng1, radLng2;
		function getRadLat(coordinate){
			return Math.PI * coordinate/180;
		}
		radLat1 = getRadLat(lat1);
		radLat2 = getRadLat(lat2);
		radLng1 = getRadLat(lng1);
		radLng2 = getRadLat(lng2);
		var theta = lng1-lng2;
		var radtheta = Math.PI * theta/180;
		var distance = Math.sin(radLat1) * Math.sin(radLat2) + Math.cos(radLat1) * Math.cos(radLat2) * Math.cos(radtheta);
		distance = Math.acos(distance);
		distance = distance * 180/Math.PI;
		distance = distance * 60 * 1.1515;
		if(unit == "K"){
			distance = distance * 1.609344;
		}
		if(unit == "N") {
			distance = distance * 0.8684;
		}
		return distance;
	};
	$scope.CalculateEachDistance = function(currentLocation) {
		angular.forEach($scope.spots, function(key, value){
			key.distance = parseFloat(Math.round($scope.GetDistance(currentLocation.lat,currentLocation.lng, key.lat, key.lng) * 100) / 100).toFixed(2);
		});
	}

	$scope.SortByDistance = function(){
		$scope.spots.sort(function(a,b){
			if(a.distance > b.distance){
				return 1;
			} else if(a.distance < b.distance){
				return -1;
			}
			return 0;
		});
	};
	var defer = $q.defer();
	$scope.SearchFromAddress = function(){
		defer.promise
			.then(function(){
				$scope.ConvertAddressToLatLng($scope.address);
			})
			.then(function(){
				setTimeout(function(){
					$scope.CalculateEachDistance($scope.addressToLatLng);
				}, 500);
			})
			.then(function(){
				$scope.SortByDistance();
			})
			.then(function(){
				setTimeout(function(){
					window.location = '/#/list/address';
				}, 1000);
			});
			defer.resolve();
	};
});

motoApp.controller('ShowList', function($scope, $http, $q, $routeParams){
	$scope.url = 'json/data.json';
	$scope.spots = [];
	$scope.currentLocation = {};
	$scope.back = function(){
		window.history.back();
	};
	$scope.GetCurrentLocation = function(){
		if(navigator.geolocation){
			navigator.geolocation.getCurrentPosition(function(position){
				$scope.currentLocation.lat = position.coords.latitude
				$scope.currentLocation.lng = position.coords.longitude;
				setTimeout(function(){
					$scope.CalculateEachDistance($scope.currentLocation);
					//alert($scope.currentLocation);
				}, 500);
			});
		}
	};

	$scope.handleSpotsLoaded = function(data, status){
		$scope.spots = data.parking.spots;
	};
	$scope.fetchParkingData = function(){
		$http.get($scope.url).success($scope.handleSpotsLoaded);
	};
	setTimeout(function(){
		$scope.fetchParkingData();
	}, 500);

	$scope.ConvertAddressToLatLng = function(){
		//alert($scope.address);
		if($scope.address.search(/Francsico/i) < 1){
			$scope.address = $scope.address + ', San Francsico, CA';
		}
		$http.get($scope.AddressToLatLngUrl + $scope.address + '&sensor=false').success(function(data, status){
			if(status == 200 && data.status == 'OK'){
				$scope.addressToLatLng = data.results[0].geometry.location;
				console.log($scope.addressToLatLng);
			} else {
				console.info('GOOGLE STATUS', data.status);
				console.info('HTTP', status);
			}
		});
	}

	
	
	$scope.CalculateDistance = function () {
		$scope.$apply(function(){
			$scope.distance = $scope.GetDistance($scope.currentLocation.lat ,$scope.currentLocation.lng ,$scope.spotDetails.lat, $scope.spotDetails.lng);
			$scope.distance = parseFloat(Math.round($scope.distance * 100) / 100).toFixed(2) + ' miles away!';
		});
	}
	$scope.GetDistance = function(lat1, lng1, lat2, lng2, unit){
		var radLat1, radLat2, radLng1, radLng2;
		function getRadLat(coordinate){
			return Math.PI * coordinate/180;
		}
		radLat1 = getRadLat(lat1);
		radLat2 = getRadLat(lat2);
		radLng1 = getRadLat(lng1);
		radLng2 = getRadLat(lng2);
		var theta = lng1-lng2;
		var radtheta = Math.PI * theta/180;
		var distance = Math.sin(radLat1) * Math.sin(radLat2) + Math.cos(radLat1) * Math.cos(radLat2) * Math.cos(radtheta);
		distance = Math.acos(distance);
		distance = distance * 180/Math.PI;
		distance = distance * 60 * 1.1515;
		if(unit == "K"){
			distance = distance * 1.609344;
		}
		if(unit == "N") {
			distance = distance * 0.8684;
		}
		return distance;
	};
	$scope.CalculateEachDistance = function(currentLocation) {
		angular.forEach($scope.spots, function(key, value){
			key.distance = parseFloat(Math.round($scope.GetDistance(currentLocation.lat,currentLocation.lng, key.lat, key.lng) * 100) / 100).toFixed(2);
		});
		

	}

	$scope.SortByDistance = function(){
		$scope.spots.sort(function(a,b){
			if(a.distance > b.distance){
				return 1;
			} else if(a.distance < b.distance){
				return -1;
			}
			return 0;
		});
	};
	if($routeParams.sortOption == 'current-location'){
		$scope.GetCurrentLocation();
	}
});

motoApp.controller('ShowDetails', ['$http', '$scope', '$routeParams', 'Detail', function($http, $scope, $routeParams, Detail){
	$scope.url = 'json/data.json';
	$scope.spots = [];
	$scope.back = function(){
		window.history.back();
	};
	$scope.handleSpotsLoaded = function(data, status){
		$scope.spots = data.parking.spots;
	};
	$scope.fetchParkingData = function(){
		$http.get($scope.url).success($scope.handleSpotsLoaded);
	};
	setTimeout(function(){
		$scope.fetchParkingData();
	}, 1000);
	setTimeout(function(){
		$scope.$apply(function(){
			$scope.spotDetails = Detail.get($scope.spots, {id: $routeParams.id});
		});
	}, 1200);
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
