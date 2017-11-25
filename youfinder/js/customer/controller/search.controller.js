(function () {
    var app = angular.module('starter');
    var searchController = function ($scope, RouteService, customers, Utils, CustomerService, UIAnimationService, configs, $ionicListDelegate, CordovaUtils) {
        $scope.customers = customers;
        
        $scope.clearSearch = function(){
            console.log('wqdqw');
            $scope.search = '';
        }

        // Facebook
        $scope.iconFacebook = Utils.getIcon({
            name: 'facebook'
        });
        $scope.iconFacebookClick = function (facebook) {
            CordovaUtils.social.openFacebook({
                facebook: facebook
            });
        }
        $scope.isIconFacebook = function(facebook){
            return facebook && !Utils.isEmpty(facebook);
        }
        
        // Instagram
        $scope.iconInstagram = Utils.getIcon({
            name: 'instagram'
        });
        $scope.iconInstagramClick = function (instagram) {
            CordovaUtils.social.openInstagram({
                instagram: instagram
            });
        }
        $scope.isIconInstagram = function(instagram){
            return instagram && !Utils.isEmpty(instagram);
        }
        
        // Twitter
        $scope.iconTwitter = Utils.getIcon({
            name: 'twitter'
        });
        $scope.iconTwitterClick = function (twitter) {
            CordovaUtils.social.openTwitter({
                twitter: twitter
            });
        }
        $scope.isIconTwitter = function(twitter){
            return twitter && !Utils.isEmpty(twitter);
        }
        
        // E-mail
        $scope.iconEmail = Utils.getIcon({
            name: 'email'
        });
        $scope.iconEmailClick = function (email) {
            CordovaUtils.email.openApp({
                email: email
            });
        }
        $scope.isIconEmail = function(email){
            return email && !Utils.isEmpty(email);
        }       

        $scope.iconOptions = Utils.getIcon({
            name: 'options'
        });
        $scope.iconBack = Utils.getIcon({
            name: 'back'
        });
        $scope.favoriteOn = Utils.getIcon({
            name: 'favoriteOn'
        });
        $scope.favoriteOff = Utils.getIcon({
            name: 'favoriteOff'
        });
        $scope.iconClose = Utils.getIcon({
            name: 'close'
        })

        $scope.showCustomerDetail = function (customer) {
            Utils.showLoading();
            console.log(configs);
            RouteService.goCustomerDetail(customer, configs);
        }
        
        $scope.goBack = function () {
            console.log(configs);
            RouteService.goHome();
        }

        $scope.openFilters = function () {
            RouteService.goFilterCustomer(configs);
        }

        // called when the last element of ng-repeat is displayed
        $scope.effect = function () {
            UIAnimationService.applyUIAnimation({
                classSelector: 'customerByCategoryList',
                animateType: 'animate-fade-slide-in-right',
                timeoutEffect: 200 //ms
            });
        }

        $scope.doToggleFavorite = function (customer) {
            CustomerService.toggleFavorite({
                customer: customer,
                customers: customers
            });

            $ionicListDelegate.$getByHandle("customerByCategoryList").closeOptionButtons();
        }

        Utils.hideLoading();
    }

    app.controller('SearchController', searchController);
})();