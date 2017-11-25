(function () {
    var app = angular.module('ChatModule');

    var chatController = function ($scope, ChatRouteService, userRoot, chatId, friend, ChatService, $ionicScrollDelegate, messages, partner, anotherPartner, $interval) {
        var isTypingIntervalPromise;
        var setIsTypingFalse = function(){
            // usuário logado
            if ($scope.partnerBind.user == userRoot.emailone) {
                $scope.partnerBind.isTyping = false;
            } else {
                $scope.anotherPartnerBind.isTyping = false;
            }
        }

        $scope.$on('$ionicView.beforeEnter', function () {
            // is typing logic...
            // partnerBind = userRoot
            // anotherPartnerBind = friend
            if (partner.user == userRoot.emailone) {
                partner.$bindTo($scope, "partnerBind").then(function () {
                    $scope.partnerBind.isTyping = false;
                });

                anotherPartner.$bindTo($scope, "anotherPartnerBind").then(function () {
                    $scope.anotherPartnerBind.isTyping = false;
                });
            } else {
                anotherPartner.$bindTo($scope, "partnerBind").then(function () {
                    $scope.partnerBind.isTyping = false;
                });

                partner.$bindTo($scope, "anotherPartnerBind").then(function () {
                    $scope.anotherPartnerBind.isTyping = false;
                });
            }

        });

        // three-way data-binding (Firebase -> View | View -> Firebase)
        $scope.messages = messages;

        // always set the conversation at the end
        $scope.$on('$ionicView.afterEnter', function () {
            $ionicScrollDelegate.scrollBottom(true);

            // listener to always set the scroll bottom
            messages.$watch(function (event) {
                $ionicScrollDelegate.scrollBottom(true);
            });
        });

        // receiver = the guy that receives the message
        $scope.receiver = friend.fullname;

        // sender = the guy that send the message
        $scope.sender = userRoot.emailone;

        $scope.isFriendMessage = function (message) {
            return $scope.sender != message.sender.emailone;
        }

        $scope.isFriendTyping = function () {
            var isFriendTyping = $scope.anotherPartnerBind.isTyping;
            return isFriendTyping;
        }

        $scope.isUserMessage = function (message) {
            return $scope.sender == message.sender.emailone;
        }

        $scope.addMessage = function (message) {
            $scope.message = '';
            setIsTypingFalse();
            ChatService.addMessage(message, chatId, friend, userRoot).then(function () {
                $ionicScrollDelegate.scrollBottom(true);
            });
        }

        $scope.addMessageEnter = function (event, message) {
            $interval.cancel(isTypingIntervalPromise);
            
            // typing ON...
            if ($scope.partnerBind.user == $scope.sender) {
                $scope.partnerBind.isTyping = true;
            } else {
                $scope.anotherPartnerBind.isTyping = true;
            }
            
            // interval to check if user still typing
            isTypingIntervalPromise = $interval(setIsTypingFalse, 3000);


            if (event.which == 13 || event.keyCode == 13) {
                setIsTypingFalse();
                $scope.message = '';
                ChatService.addMessage(message, chatId, friend, userRoot).then(function () {
                    $ionicScrollDelegate.scrollBottom(true);
                });
            }
        }

        $scope.goMenu = function () {
            ChatRouteService.goChatMenu();
        }

    }

    app.controller('ChatController', chatController);
})();