
angular.module('searchapp', []).controller("searchCtrl",function($scope, searchService){
    $scope.source = 1;
    $scope.searchResults = {};
    $scope.currentPage = 1;
    $scope.searchData = function(){
        var URL;
        if($scope.source === 1){
            URL = "http://hn.algolia.com/api/v1/search?query=" + $scope.searchText || "";
        }else if($scope.source === 2){
            if(!$scope.searchText){return}
            URL = "https://en.wikipedia.org/w/api.php?action=opensearch&format=xml&search="+$scope.searchText+"&origin=*";
        }
        searchService.getSearchData(URL, function(response){
            if(searchService.isJson(response.data)){
                prepareObject(response.data);
            }else{
                xmlToJson()
            }
        });

        $scope.$on("searchPage", function(){
            $scope.searchData();
        });

        var prepareObject = function(Object){
            $scope.searchResults = Object;
            $scope.pages = Math.ceil(Object.nbHits / 20);
            $scope.$broadcast("pages",$scope.pages);
        };

        function xmlToJson(xml) {
            parser = new DOMParser();
            xml = parser.parseFromString(xml,"text/xml");
            var obj = {};

            if (xml.nodeType == 1) {
              // element
              // do attributes
              if (xml.attributes.length > 0) {
                obj["@attributes"] = {};
                for (var j = 0; j < xml.attributes.length; j++) {
                  var attribute = xml.attributes.item(j);
                  obj["@attributes"][attribute.nodeName] = attribute.nodeValue;
                }
              }
            } else if (xml.nodeType == 3) {
              // text
              obj = xml.nodeValue;
            }
          
            // do children
            // If all text nodes inside, get concatenated text from them.
            var textNodes = [].slice.call(xml.childNodes).filter(function(node) {
              return node.nodeType === 3;
            });
            if (xml.hasChildNodes() && xml.childNodes.length === textNodes.length) {
              obj = [].slice.call(xml.childNodes).reduce(function(text, node) {
                return text + node.nodeValue;
              }, "");
            } else if (xml.hasChildNodes()) {
              for (var i = 0; i < xml.childNodes.length; i++) {
                var item = xml.childNodes.item(i);
                var nodeName = item.nodeName;
                if (typeof obj[nodeName] == "undefined") {
                  obj[nodeName] = xmlToJson(item);
                } else {
                  if (typeof obj[nodeName].push == "undefined") {
                    var old = obj[nodeName];
                    obj[nodeName] = [];
                    obj[nodeName].push(old);
                  }
                  obj[nodeName].push(xmlToJson(item));
                }
              }
            }
            return obj;
          }
    };
}).directive("searchResult", function(){
    return {
        restrict: 'E',
        replace: true,
        scope:{
            searchResults: "=?",
            showAutherInfo: "=?",
            pages: "=?",
            pageNo: "=?"
        },
        templateUrl: "searchResult.html",
        controller: function ($scope, searchService){
            $scope.totalRecords = $scope.searchResults.nbHits;
            $scope.showInfo = {};
            $scope.currentPage = 1;
            $scope.startPage = 1;
            $scope.endPage = 10;
            $scope.lastPage = 
            $scope.pagelist = [];
            
            var page = 1;
            $scope.getUserInfo = function(user){
                searchService.getUserInfo("https://hn.algolia.com/api/v1/users/"+user,function(data){
                    $scope.showInfo[user] = {};
                    $scope.showInfo[user].isShow = !$scope.showInfo[user].isShow;
                    $scope.showInfo[user].details = data.data.submission_count;
                });
            };

            $scope.callPages = function(from){
                $scope.pagelist = []
                if(from === 'next'){
                    $scope.startPage += 10;
                    $scope.endPage +=10;
                    $scope.currentPage = $scope.currentPage+1;
                    for(i = ($scope.startPage); i<=($scope.endPage); i++){
                        if(i > $scope.pages){
                            break;
                        }
                        $scope.pagelist.push(i);
                        
                    }
                }else{
                    $scope.startPage -= 10;
                    $scope.endPage -=10;
                    $scope.currentPage = $scope.currentPage-1;
                    for(i = $scope.startPage; i<=$scope.endPage; i++){
                        
                        $scope.pagelist.push(i);
                    }
                }
            };

            $scope.goToPerticularPage = function(page){
                $scope.$emit("searchPage",page);
            };

            $scope.$on("pages", function(ev, data){
                $scope.startPage = 1;
                $scope.endPage = 10;
                $scope.pagelist = [];
                    for(i =$scope.startPage; i<=$scope.endPage; i++){
                        if(i > data){
                            break;
                        }
                        $scope.pagelist.push(i);
                    }
            }); 
        }
    }
}).factory("searchService",['$http','$timeout', '$q',
function ($http, $timeout, $q) {
    var service = {};
    service.getSearchData = function(URL, callback){
       
        $http.get(URL).then(function(response){
            callback(response);
        },function(error){

        });
    };

    service.getUserInfo = function(URL, callback){
        $http.get(URL).then(function(response){
            callback(response);
        },function(error){

        });
    };
    service.isJson = function(str) {
        str = typeof str !== "string"
        ? JSON.stringify(str)
        : str;
        try {
            JSON.parse(str);
        } catch (e) {
            return false;
        }
        return true;
    }
    return service;
}]);