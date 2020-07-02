
angular.module('chatapp', [
    'ngRoute'
])
 
.config(['$routeProvider', function ($routeProvider) {

    $routeProvider
        .when('/login', {
            controller: 'LoginController',
            templateUrl: './login.html',
        })
 
        .when('/Home', {
            controller: 'HomeController',
            templateUrl: './home.html'
        })
 
        .otherwise({ redirectTo: '/login' });
}]);