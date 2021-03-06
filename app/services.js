motoApp.factory('cordovaReady', function() {
  return function (fn) {

    var queue = [];

    var impl = function () {
      queue.push(Array.prototype.slice.call(arguments));
    };

    document.addEventListener('deviceready', function () {
      queue.forEach(function (args) {
        fn.apply(this, args);
      });
      impl = fn;
    }, false);
            
    return function () {
      return impl.apply(this, arguments);
    };
  };
});

motoApp.factory('Data', function($http, $rootScope){
	var Data = {};

	Data.parkingSpots = [];
    $rootScope.$emit('LOAD');
	Data.fetchParkingData = function(){
		$http.get('json/data.json').then(function(response){
            console.log(response.data);
			Data.parkingSpots = response.data;
            $rootScope.spots = Data.parkingSpots;
            $rootScope.$emit('UNLOAD');
		});
		return Data.parkingSpots;
	};
	return Data;
});

motoApp.factory('Distance', function($rootScope){
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
                $rootScope.$emit('LOAD');
				var self = this;
				angular.forEach(data, function(key, value){
                    key.address = key.address.split(',');
                    key.address = key.address[0];
					if(key["nbhood"] != "Garages" || key.hasOwnProperty("spaces")){
						key.distance = parseFloat(Math.round(self.get(currentLocation.lat,currentLocation.lng, key.lat, key.lng) * 100) / 100).toFixed(2);
					}
				});
                $rootScope.$emit('UNLOAD');
			}
		}
});
motoApp.factory('LocationServices', function ($http, $rootScope){
	return {
		getCurrentLocation: function(onSuccess){
            $rootScope.$emit('LOAD');
			var currentLocation = {};
			if(navigator.geolocation){
				navigator.geolocation.getCurrentPosition(function(position){
					currentLocation.lat = position.coords.latitude
					currentLocation.lng = position.coords.longitude;
					onSuccess(currentLocation);
                    $rootScope.$emit('UNLOAD');
				});
			}
		},
		googleLocations: function(location, onSuccess){
			var addressToLatLngUrl = 'http://maps.googleapis.com/maps/api/geocode/json?address=';
			var addressToLatLng;

            $rootScope.$emit('LOAD');

            if($rootScope.searchFromAddress){
                if(location.search(/Francsico/i) < 1){
                    location = location + ', San Francsico, CA';
                }
            }


			$http.get(addressToLatLngUrl + location + '&sensor=false').success(function(data, status){
				if(status == 200 && data.status == 'OK'){
					addressToLatLng = data.results[0];
                    onSuccess(addressToLatLng);
                    console.log(addressToLatLng);
                    $rootScope.$emit('UNLOAD');
				} else {
					console.info('GOOGLE STATUS', data.status);
					console.info('HTTP', status);
                    $rootScope.$emit('UNLOAD');
				}
			});
		},
        getAddress: function(){
            var googUrl = 'http://maps.googleapis.com/maps/api/geocode/json?address=';
                angular.forEach($rootScope.spots, function(key, value){
                    $http.get(googUrl + key.lat + ',' + key.lng + '&sensor=false').success(function(data){
                        if(status == 200 && data.status == 'OK'){
                            key.address = data.results[0].formatted_address;
                            console.log(data.results[0].formatted_address);
                        }
                    });
                });
        }
	}
});

motoApp.factory('Detail',[
function () {
    return {
    	findById: function (model, id) {
		    var spot = null;
		    for (i = 0; i < model.length; i = i + 1) {
		        if (model[i].id === id) {
		            spot = model[i];
		            break;
		        }
		    }
		    return spot;
		},
        query: function () {
            return model;
        },
        get: function (model, spot) {
            return this.findById(model, parseInt(spot['id']));
        }
    }
}]);