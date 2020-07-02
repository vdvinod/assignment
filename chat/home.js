'use strict';
 
angular.module('chatapp').controller('HomeController',['$scope', 'chatService',function ($scope, chatService) {
      $scope.userData = chatService.GetUserDetails();
      $scope.showChatBox = false;
}]);