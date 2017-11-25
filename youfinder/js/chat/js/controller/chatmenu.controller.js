(function () {
    var app = angular.module('ChatModule');    
    
    var chatMenuController = function ($scope, chats, ChatRouteService, UIAnimationService, Utils) {
        var newChatButton = document.getElementById('newChatButton');
        UIAnimationService.applyButtonAnimation(newChatButton);
        
        $scope.user = Utils.getLocalStorage('userRoot');

        // get all user's chats
        $scope.chats = chats;

        $scope.newChat = function () {
            ChatRouteService.goNewChat();
        }

        $scope.getChat = function (chat) {
            Utils.showLoading();
            ChatRouteService.goChat(chat);
        }

        $scope.clearSearch = function () {
            $scope.search = '';
        }

        // called when the last element of ng-repeat is displayed
        $scope.effect = function () {
            UIAnimationService.applyUIAnimation('conversationsList');
        }
    }
    
    app.controller('ChatMenuController', chatMenuController);
})();