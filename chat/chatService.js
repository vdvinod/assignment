
angular.module('chatapp').factory('chatService',['$http','$timeout', '$q',
    function ($http, $timeout, $q) {
        var service = {};
        service.Login = function (username, password, callback) {
            $timeout(function(){    
                callback();
            }, 1000);
        };
        
        service.SetUserDetails= function (username, id){
            var userData = {
                userName: username,
                id: id
            }
            localStorage.setItem("userInfo",JSON.stringify(userData));
        };

        service.sendMessage = function(data){
            var promise = $q.defer();
            if(data){
                promise.resolve(data);
            }else{
                promise.reject();
            }
            return promise.promise;
        };

        service.GetUserDetails = function (username){
            return JSON.parse(localStorage.getItem("userInfo"));
        };
        return service;
    }]);