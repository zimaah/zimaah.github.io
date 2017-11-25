(function () {
    var app = angular.module('starter');
    var firebaseChat = function(firebase){
        var ref = firebase.database().ref();
        var refUser = firebase.database().ref('users');
        var refChat = firebase.database().ref('chat');
        var refChatMessages = firebase.database().ref('chatMessages');
        var refUserChats = firebase.database().ref('userChats');

        return {
            ref: function () {
                return ref;
            },
            refUser: function () {
                return refUser;
            },
            refChat: function () {
                return refChat;
            },
            refChatMessages: function () {
                return refChatMessages;
            },
            refUserChats: function () {
                return refUserChats;
            }
        }
    }
    
    app.factory('FirebaseChat', firebaseChat);
})();