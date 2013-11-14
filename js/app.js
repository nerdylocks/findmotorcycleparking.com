var motoApp = angular.module("moto", ['ngRoute', 'ngResource']);
motoApp.config(['$routeProvider', function($routeProvider){
	$routeProvider
		.when('/', {templateUrl: 'partials/search.html', controller: 'InitApp'})
		.when('/list', {templateUrl: 'partials/list.html', controller: 'ShowList'})
		.when('/details/:id', {templateUrl: 'partials/details.html', controller: 'ShowDetails'})
		.when('/map', {templateUrl: 'partials/map.html', controller: 'ShowMap'})
		.otherwise({redirectTo: '/'});
}]);
var findById = function (model, id) {
    var spot = null,
        l = model.length,
        i;
    for (i = 0; i < l; i = i + 1) {
        if (model[i].id === id) {
            spot = model[i];
            break;
        }
    }
    return spot;
};
motoApp.factory('Detail', [
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