'use strict';

var motoApp = angular.module("moto", ['ngRoute', 'ngResource', 'leaflet-directive']);

motoApp.config(['$routeProvider', function($routeProvider){
	$routeProvider
		.when('/', {templateUrl: 'partials/splash.html', controller: 'ShowSplash'})
		.when('/search', {templateUrl: 'partials/search.html', controller: 'InitApp'})
		.when('/list/:sortOption', {templateUrl: 'partials/list.html', controller: 'ShowList'})
		.when('/details/:id', {templateUrl: 'partials/details.html', controller: 'ShowDetails'})
		.when('/map', {templateUrl: 'partials/map.html', controller: 'ShowMap'})
		.otherwise({redirectTo: '/search'});
}]);