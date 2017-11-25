(function () {

    var app = angular.module('starter');
    var tourController = function ($scope, $ionicSlideBoxDelegate, RouteService, Utils, userRoot, TYPE_USER, TourService, TYPE_CUSTOMER) {

        $scope.slides = userRoot.type == TYPE_USER ? TourService.getUserTour() : TourService.getCustomerTour();

        $scope.goTo2 = function () {
            $ionicSlideBoxDelegate.slide(1);
        }

        $scope.goTo3 = function () {
            $ionicSlideBoxDelegate.slide(2);
        }

        $scope.goHome = function () {
            Utils.setLocalStorage('tourExecuted', true);
            if (userRoot.type == TYPE_CUSTOMER) {
                RouteService.goHome();
            } else {
                RouteService.goChooseCity();
            }
        }

    }

    app.controller('TourController', tourController);

})();