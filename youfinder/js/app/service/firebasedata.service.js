angular.module('starter').factory('firebaseData', function (firebase) {
            var ref = firebase.database().ref();
            var refUser = firebase.database().ref('users');
            var refCustomer = firebase.database().ref('customers');
            var refCategory = firebase.database().ref('categories');
            var refCity = firebase.database().ref('cities');
            var refCustomerPerCategory = firebase.database().ref('customerPerCategory');
            var refFavorite = firebase.database().ref('favorites');
            var refCategoryPerCity = firebase.database().ref('categoryPerCity');
            var refChat = firebase.database().ref('chat');
            var refChatPartners = firebase.database().ref('chatPartners');
            var refChatMessages = firebase.database().ref('chatMessages');
            var refUserChats = firebase.database().ref('userChats');
            var refLogError = firebase.database().ref('logError');
            var refBillingType = firebase.database().ref('billingType');

            return {
                ref: function () {
                    return ref;
                },
                refUser: function () {
                    return refUser;
                },
                refNotify: function () {
                    return refNotify;
                },
                refCustomer: function () {
                    return refCustomer;
                },
                refCategory: function () {
                    return refCategory;
                },
                refCity: function () {
                    return refCity;
                },
                refCustomerPerCategory: function () {
                    return refCustomerPerCategory;
                },
                refFavorite: function () {
                    return refFavorite;
                },
                refCategoryPerCity: function(){
                    return refCategoryPerCity;
                },
                refChat: function(){
                    return refChat;
                },
                refChatMessages: function(){
                    return refChatMessages;
                },
                refUserChats: function(){
                    return refUserChats;
                },
                refChatPartners: function(){
                    return refChatPartners;
                },
                refLogError: function(){
                    return refLogError;
                },
                refBillingType: function(){
                    return refBillingType;
                }
                
            }
        });