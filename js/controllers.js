motoApp.controller('InitApp', function($scope){
	$scope.message = 'Search, Biatch';
});

motoApp.controller('ShowList', function($scope, $http){
	$scope.url = 'json/data.json';
	$scope.spots = [];
	$scope.handleSpotsLoaded = function(data, status){
		$scope.spots = data.parking.spots;
	};
	$scope.fetchParkingData = function(){
		$http.get($scope.url).success($scope.handleSpotsLoaded);
	};
	setTimeout(function(){
		$scope.fetchParkingData();
	}, 500);
});

motoApp.controller('ShowDetails', ['$http', '$scope', '$routeParams', 'Detail', function($http, $scope, $routeParams, Detail){
	$scope.url = 'json/data.json';
	$scope.spots = [];
	$scope.handleSpotsLoaded = function(data, status){
		$scope.spots = data.parking.spots;
	};
	$scope.fetchParkingData = function(){
		$http.get($scope.url).success($scope.handleSpotsLoaded);
	};
	setTimeout(function(){
		$scope.fetchParkingData();
	}, 500);
	setTimeout(function(){
		$scope.$apply(function(){
			$scope.spotDetails = Detail.get($scope.spots, {id: $routeParams.id});
			console.log($scope.spotDetails);
		});
	}, 1000);
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