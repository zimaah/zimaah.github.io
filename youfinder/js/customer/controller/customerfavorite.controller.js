(function () {
    var app = angular.module('starter');

    var customerFavoriteController = function ($scope, RouteService, customers, Utils, UIAnimationService, CustomerService, $ionicListDelegate) {
        Utils.hideLoading();
        console.log(customers);
        $scope.customers = customers;

        $scope.showFavoriteDetail = function (customer) {
            Utils.showLoading();
            RouteService.goFavoriteDetail(customer);
        }

        $scope.goBack = function () {
            RouteService.goHome();
        }

        $scope.doToggleFavorite = function (customer) {
            CustomerService.toggleFavorite({
                customer: customer,
                customers: customers
            });

            $ionicListDelegate.$getByHandle("customerByCategoryList").closeOptionButtons();
        }

        // called when the last element of ng-repeat is displayed
        $scope.effect = function () {
            UIAnimationService.applyUIAnimation({
                classSelector: 'customerByCategoryList',
                animateType: 'animate-fade-slide-in-right',
                timeoutEffect: 200 //ms
            });
        }
        $scope.iconBack = Utils.getIcon({
            name: 'back'
        });
        $scope.favoriteOn = Utils.getIcon({
            name: 'favoriteOn'
        });
        $scope.favoriteOff = Utils.getIcon({
            name: 'favoriteOff'
        });
    }

    app.controller('CustomerFavoriteController', customerFavoriteController);
})();