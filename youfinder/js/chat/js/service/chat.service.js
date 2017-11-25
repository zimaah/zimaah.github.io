(function () {
    var app = angular.module('ChatModule');

    var chatService = function (firebaseData, ChatRouteService, Utils, $firebaseArray, FirebaseChat, $firebaseObject) {

        var _that = this;

        this.initChat = function (friend) {

            var today = new Date().toDateString();
            var userLogged = Utils.getLocalStorage('userRoot');
            var chat = {
                'chat_id': 'chat-' + today,
                'createdAt': new Date().toISOString()
            }

            // ref that saves information about the chat itself (ie: initial date of chat)
            var chats = $firebaseArray(firebaseData.refChat());

            var userChatsArray = $firebaseArray(firebaseData.refUserChats().child(userLogged.$id));
            userChatsArray.$loaded().then(function () {

                if (userChatsArray.length > 0) {
                    var userChat = false;

                    // verifying if chat with partner already exists
                    for (let i = 0; i < userChatsArray.length; i++) {
                        if (userChatsArray[i].partner.emailone == friend.emailone) {
                            userChat = userChatsArray[i];
                            break;
                        }
                    }

                    if (userChat) {
                        // retrieve the chat already started
                        Utils.hideLoading();

                        ChatRouteService.goChat({'chatId': userChat.chatId, 'partner': userChat.partner});
                    } else {
                        _that.newChat(chats, chat, userLogged, friend);
                    }

                } else {
                    _that.newChat(chats, chat, userLogged, friend);
                }

            });
        }

        this.newChat = function (chatsArray, chat, userLogged, friend) {
            console.log(userLogged);
            console.log(friend);

            // new chat
            chatsArray.$add(chat).then(function (newChat) {
                var chatId = newChat.key;
                
                // it needs to be calle in $q 
                var refPartners = $firebaseArray(FirebaseChat.refChat().child(chatId).child('partners'));
                refPartners.$add({
                    user: userLogged.emailone,
                    isTyping: false
                });
                refPartners.$add({
                    user: friend.emailone,
                    isTyping: false
                });
                // it needs to be calle in $q 

                var chatUserObj = {
                    'chatId': chatId,
                    'partner': {
                        'emailone': userLogged.emailone,
                        'fullname': userLogged.fullname,
                        'photoURL': userLogged.photoURL
                    }
                }

                var chatFriendObj = {
                    'chatId': chatId,
                    'partner': {
                        'emailone': friend.emailone,
                        'fullname': friend.fullname,
                        'photoURL': friend.photoURL
                    }
                }

                console.log(chatUserObj);
                console.log(chatFriendObj);
                // add o novo chat na lista de chats do usuário
                _that.addUserChat(userLogged.$id, chatFriendObj);
                _that.addUserChat(friend.$id, chatUserObj);
                Utils.hideLoading();
                ChatRouteService.goChat({'chatId': chatId, 'partner': friend});
            }
            );
        }

        this.addUserChat = function (userId, chat) {
            var refUserChats = firebaseData.refUserChats();

            var refUserChat = $firebaseArray(refUserChats.child(userId));
            refUserChat.$add(chat).then(function () {
                console.log('chat do usuário adiciona ao histórico');
            });
        }

        this.getUserChats = function () {
            var userLogged = Utils.getLocalStorage('userRoot');
            var chats = $firebaseArray(firebaseData.refUserChats().child(userLogged.$id));

            return chats;
        }

        this.getMessages = function () {
            var userLogged = Utils.getLocalStorage('userRoot');
            var ref = firebaseData.refChat().child(userLogged.$id);
            var users = $firebaseArray(ref);
            return users;
        }

        this.getMessagesByChat = function (chatId) {
            var ref = firebaseData.refChatMessages().child(chatId);
            var messages = $firebaseArray(ref);
            return messages;
        }

        this.addMessage = function (message, chatId, friend, userRoot) {
            var messagesRef = $firebaseArray(firebaseData.refChatMessages().child(chatId));

            var messageObj = {
                message: message,
                sender: {
                    fullname: userRoot.fullname,
                    emailone: userRoot.emailone
                },
                receiver: {
                    fullname: friend.fullname,
                    emailone: friend.emailone,
                    photoURL: friend.photoURL
                }
            }

            return messagesRef.$add(messageObj);
        }
        
        this.getPartnersByChat = function(chatId) {
            var ref = FirebaseChat.refChat().child(chatId).child('partners');
            var partners = $firebaseArray(ref);
            return partners;
        }
        
        this.getPartnerFirebaseObject = function(chatId, partner){
            
            var ref = FirebaseChat.refChat().child(chatId).child('partners').child(partner.$id);
//            ref.on('value', function(ss){
//                console.log(ss.val());  
//            });
            var partnerFirebaseObject = $firebaseObject(ref);
            return partnerFirebaseObject;
        }
        
    }

    app.service('ChatService', chatService);
})();