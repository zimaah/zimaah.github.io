var app = angular.module('starter');

var customerFavoriteViewController = function ($scope, RouteService, Utils) {
    Utils.hideLoading();

    $scope.goBack = function () {
        RouteService.goFavorites();
    }

    $scope.openFacebook = function (facebookURL) {
        Utils.openInAppBrowser(facebookURL);
    }
}

app.controller('CustomerFavoriteViewController', customerFavoriteViewController);