motoApp.factory('Data', function($http){
	return {
		fetchParkingData : function(){
			return $http.get('json/data.json')
		}
	}
});
motoApp.factory('CalculateDistance',[
	function(){
	return {
		doo: function(thing){
			$scope.distance = GetDistance.get($scope.currentLocation.lat ,$scope.currentLocation.lng ,$scope.spotDetails.lat, $scope.spotDetails.lng);
			$scope.distance = parseFloat(Math.round($scope.distance * 100) / 100).toFixed(2) + ' miles away!';
		}
	}
}]);
motoApp.factory('Distance',
	function (){
		return {

			get: function(lat1, lng1, lat2, lng2, unit){
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
			},
			calculateEachDistance: function(currentLocation, data) {
				angular.forEach(data, function(key, value){
					//console.log(currentLocation.lat,currentLocation.lng, key.lat, key.lng);
					key.distance = parseFloat(Math.round(this.get(currentLocation.lat,currentLocation.lng, key.lat, key.lng) * 100) / 100).toFixed(2);
				});
			},
			sortByDistance: function(spots){
				spots.sort(function(a,b){
					if(a.distance > b.distance){
						return 1;
					} else if(a.distance < b.distance){
						return -1;
					}
					return 0;
				});
			}
		}
});
motoApp.factory('LocationServices', function ($http){
	return {
		getCurrentLocation: function(callback){
			var currentLocation = {};
			if(navigator.geolocation){
				navigator.geolocation.getCurrentPosition(function(position){
					currentLocation.lat = position.coords.latitude
					currentLocation.lng = position.coords.longitude;
					callback(currentLocation);
				});
			}
		},
		convertAddressToLatLng: function(address, callback, spots){
			var addressToLatLngUrl = 'http://maps.googleapis.com/maps/api/geocode/json?address=';
			var addressToLatLng;
			if(address.search(/Francsico/i) < 1){
				address = address + ', San Francsico, CA';
			}

			$http.get(addressToLatLngUrl + address + '&sensor=false').success(function(data, status){
				if(status == 200 && data.status == 'OK'){
					addressToLatLng = data.results[0].geometry.location;
					//$scope.CalculateEachDistance($scope.addressToLatLng, $scope.spots);
					callback(addressToLatLng, spots);
					console.log(addressToLatLng, spots);
				} else {
					console.info('GOOGLE STATUS', data.status);
					console.info('HTTP', status);
				}
			});
		}
	}
});

motoApp.factory('CalculateEachDistance', function(){
	return {
		init: function(currentLocation, data) {
			angular.forEach(data, function(key, value){
				console.log(currentLocation.lat,currentLocation.lng, key.lat, key.lng);
				key.distance = parseFloat(Math.round(Distance.get(currentLocation.lat,currentLocation.lng, key.lat, key.lng) * 100) / 100).toFixed(2);
			});
		}
	}
});
motoApp.factory('SortByDistance', function(){
	return {
		init: function(spots){
			spots.sort(function(a,b){
				if(a.distance > b.distance){
					return 1;
				} else if(a.distance < b.distance){
					return -1;
				}
				return 0;
			});
		}
	}
});
motoApp.factory('Detail',[
function () {
    return {
        query: function () {
            return model;
        },
        get: function (model, spot) {
        	console.log(parseInt(spot['id']));
            return findById(model, parseInt(spot['id']));
        }
    }
}]);