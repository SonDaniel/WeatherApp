var myApp = angular.module('weatherApp', ['ngRoute','ngResource']);

myApp.config(function($routeProvider){
    $routeProvider
        .when('/', {
            templateUrl: 'pages/home.html',
            controller: 'homeController'
        })
        .when('/forecast', {
            templateUrl: 'pages/forecast.html',
            controller: 'forecastController'
        })
        .when('/forecast/:days', {
            templateUrl: 'pages/forecast.html',
            controller: 'forecastController'
        })
});

myApp.service('data', function(){
    this.city = '';
});

myApp.service('weatherService',['$resource', function($resource){
    this.getWeather = function(city, days) {
        var weatherAPI = $resource("http://api.openweathermap.org/data/2.5/forecast/daily",
            {callback: "JSON_CALLBACK"}, { get: {method: "JSONP"}
            });

        return weatherAPI.get({q: city, cnt: days, APPID: '21df9f919a1b1777ba687409a8fedf2f'});

    };

}]);

myApp.controller('homeController',['$scope','$location','data', function($scope,$location, data){
    $scope.city = data.city;

    $scope.$watch('city', function(){
        data.city = $scope.city;
    });

    $scope.submit = function(){
        $location.path('/forecast');
    }

}]);

myApp.controller('forecastController',['$scope','$routeParams','data','weatherService', function($scope,$routeParams, data, weatherService){
    $scope.city = data.city;
    $scope.days = $routeParams.days || '2';

    $scope.weatherResult = weatherService.getWeather($scope.city, $scope.days);

    $scope.convertToFahrenheit = function(degK) {
        return Math.round(((degK) * (9/5)) - 459.67);
    };

    $scope.convertToDate = function(dt) {
        return new Date(dt * 1000);
    };

    console.log($scope.weatherResult);
}]);

myApp.directive('weatherResult', function(){
    return {
        templateUrl: 'directives/weatherResult.html',
        replace: true,
        scope: {
            weatherDay : "=",
            convertDate : "&",
            convertTemp : "&",
            dateFormat : "@"
        }
    }
});

