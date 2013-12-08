'use strict';

var motoApp = angular.module("moto", [
	'ngRoute', 
	'ngResource', 
	'leaflet-directive', 
	'ngTouch', 
	'ngAnimate'
]);

motoApp.config(['$routeProvider', function($routeProvider){
	$routeProvider
		.when('/', {templateUrl: 'views/splash.html', controller: 'Splash'})
		.when('/search', {templateUrl: 'views/search.html', controller: 'Search'})
		.when('/list/:sortOption', {templateUrl: 'views/list.html', controller: 'List'})
		.when('/details/:id', {templateUrl: 'views/details.html', controller: 'Details'})
		.when('/map', {templateUrl: 'views/map.html', controller: 'Map'})
		.otherwise({redirectTo: '/search'});
}]);