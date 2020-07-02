
angular.module('chatapp').controller('LoginController',
    ['$scope', '$rootScope', '$location', 'chatService',
    function ($scope, $rootScope, $location, chatService) {
        $scope.login = function () {
            $scope.dataLoading = true;
            chatService.Login($scope.username, $scope.password, function() {
               
                    chatService.SetUserDetails($scope.username, 'user1');
                    $location.path('/Home');
                
            });
        };
    }]);