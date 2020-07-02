angular.module('chatapp').directive('chatBox', function(){
    return {
        restrict: 'E',
        replace: true,
        template: `
        <div>
        <div class="chat-box-container" ng-if="showChatBox" class="col-xs-12">
                <div ng-repeat="message in messages track by $index" ng-class="{'text-right':message.from === 'user1','text-left':message.from !== 'user1'}" >
                   <div >{{message.from}}</div>
                    <span class="message">{{message.message}}</span>
                </div>
                <div class="text-reply-container" id="replyBox">
                    <textarea col=10 row=2 placeholder="Type Your Message" ng-model="data.textMessage" ></textarea>
                    <span><button class="btn btn-xs" ng-click="sendMessage()" ng-disabled="!data.textMessage">send</button></span>
                </div>
                
            </div>
           
        </div>
            
        `,
        
        controller: function($scope, chatService, $timeout){
            $scope.data = {textMessage :""};
            
            $scope.messages = [];
            if(Array.isArray(JSON.parse(localStorage.getItem('messageList')))){
                $scope.messages = JSON.parse(localStorage.getItem('messageList'));
            }
            var scrollDown = function(){
                $('.chat-box-container').animate({
                    scrollTop: $(".chat-box-container")[0].scrollHeight
                }, 'smooth');
            }
            $timeout(function(){
                scrollDown();
            },100);
            $scope.sendMessage = function (){
                chatService.sendMessage({
                    message: $scope.data.textMessage,
                    from: 'user1'
                }).then(function(response){
                    $scope.data.textMessage = "";
                    $scope.messages.push(response);
                    scrollDown();
                    localStorage.setItem("messageList",JSON.stringify($scope.messages));
                    $timeout(function(){
                        $scope.messages.push({
                            message: Math.random(),
                            from: 'user2'
                        });
                        localStorage.setItem("messageList",JSON.stringify($scope.messages));
                        scrollDown();
                    },2000);
                }, function(){

                })
            };
        }
    }
});