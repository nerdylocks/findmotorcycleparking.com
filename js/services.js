motoApp.factory('Data', function($http){
	var Data = {};

	Data.parkingSpots = [];

	Data.fetchParkingData = function(){
		$http.get('json/data.json').then(function(response){
			Data.parkingSpots = response.data.parking.spots;
			//console.log(Data.parkingSpots);
		});
		return Data.parkingSpots;
	};
	return Data;
});

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
				var self = this;
				angular.forEach(data, function(key, value){
					if(key["nbhood"] != "Garages"){
						key.distance = parseFloat(Math.round(self.get(currentLocation.lat,currentLocation.lng, key.lat, key.lng) * 100) / 100).toFixed(2);
					}
				});
			}
		}
});
motoApp.factory('LocationServices', function ($http){
	return {
		getCurrentLocation: function(callback, callbackParams){
			var currentLocation = {};
			if(navigator.geolocation){
				navigator.geolocation.getCurrentPosition(function(position){
					currentLocation.lat = position.coords.latitude
					currentLocation.lng = position.coords.longitude;
					callback(currentLocation, callbackParams);
				});
			}
		},
		convertAddressToLatLng: function(address, callback){
			var addressToLatLngUrl = 'http://maps.googleapis.com/maps/api/geocode/json?address=';
			var addressToLatLng;
			if(address.search(/Francsico/i) < 1){
				address = address + ', San Francsico, CA';
			}

			$http.get(addressToLatLngUrl + address + '&sensor=false').success(function(data, status){
				if(status == 200 && data.status == 'OK'){
					addressToLatLng = data.results[0].geometry.location;
					callback(addressToLatLng);
				} else {
					console.info('GOOGLE STATUS', data.status);
					console.info('HTTP', status);
				}
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