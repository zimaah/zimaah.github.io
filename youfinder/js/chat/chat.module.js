(function () {
    var app = angular.module('ChatModule', []);


    var config = function ($stateProvider) {
        console.log('Config módulo Chat');

        $stateProvider.state('chatmenu', {
            templateUrl: 'js/chat/template/chat-menu.html',
            controller: 'ChatMenuController',
            url: '/chat',
            resolve: {
                chats: function (ChatService) {
                    // here I load all chats already started
                    return ChatService.getUserChats().$loaded();
                }
            }
        })

                .state('newchat', {
                    templateUrl: 'js/chat/template/chat-friends.html',
                    controller: 'ChatFriendsController',
                    url: '/chat/amigos',
                    resolve: {
                        friends: function (UserService) {
                            // here I load all users as friends to get chat
                            return UserService.getAllUsers().$loaded();
                        },
                        userLogged: function (Utils) {
                            var userLogged = Utils.getLocalStorage('userRoot');
                            return userLogged;
                        }
                    }
                })

                .state('chat', {
                    templateUrl: 'js/chat/template/chat.html',
                    controller: 'ChatController',
                    url: '/chat/conversa',
                    params: {chatId: null, partner: null},
                    resolve: {
                        chatId: function ($stateParams) {
                            return $stateParams.chatId;
                        },
                        messages: function (ChatService, chatId) {
                            var messages = false;
                            if (chatId != null) {
                                messages = ChatService.getMessagesByChat(chatId).$loaded();
                            }

                            return messages;
                        },
                        partners: function (ChatService, chatId) {
                            var partners = ChatService.getPartnersByChat(chatId).$loaded();
                            return partners;
                        },
                        friend: function ($stateParams, Utils) {
                            Utils.hideLoading();
                            return $stateParams.partner;
                        },
                        userRoot: function (Utils) {
                            var userRoot = Utils.getLocalStorage('userRoot');
                            return userRoot;
                        },
                        partner: function (partners, ChatService, chatId) {
                            // is typing... logic
                            var partner = partners.$getRecord(partners.$keyAt(0));
                            var partnerFirebaseObject = ChatService.getPartnerFirebaseObject(chatId, partner);
                            return partnerFirebaseObject.$loaded();
                        },
                        anotherPartner: function (partners, ChatService, chatId) {
                            // is typing... logic
                            var partner = partners.$getRecord(partners.$keyAt(1));
                            var partnerFirebaseObject = ChatService.getPartnerFirebaseObject(chatId, partner);
                            return partnerFirebaseObject.$loaded();
                        }
                    }
                })


    }

    var run = function () {
        console.log('Run módulo Chat');
    }

    app.config(config);
    app.run(run);
})();