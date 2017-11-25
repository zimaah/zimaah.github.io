(function () {
    var app = angular.module('ChatModule');
    
    var chatFriendsController = function ($scope, friends, ChatService, Utils, ChatRouteService, userLogged, UIAnimationService) {

        // list all users (friends) except own logged user
        $scope.friends = friends.filter(function (friend) {
            return friend.$id != userLogged.$id;
        });

        $scope.initChat = function (friend) {
            Utils.showLoading();
            ChatService.initChat(friend);
        }

        $scope.goBack = function () {
            ChatRouteService.goChatMenu();
        }

        $scope.clearSearch = function () {
            $scope.search = '';
        }

        // called when the last element of ng-repeat is displayed
        $scope.effect = function () {
            UIAnimationService.applyUIAnimation('friendsList');
        }
    }

    app.controller('ChatFriendsController', chatFriendsController);
})();