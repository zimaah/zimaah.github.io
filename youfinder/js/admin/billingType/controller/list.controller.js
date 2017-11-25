(function () {
    var app = angular.module('starter');
    var listBillingTypeController = function ($scope, RouteService, Utils, BillingTypeService, billingTypes) {
        console.log(11);
        $scope.billingTypes = billingTypes;

        // navegação entre telas
        $scope.goHome = function () {
            RouteService.goHome();
        }
        $scope.goForm = function () {
            RouteService.goAdminCreateBillingType();
        }
        $scope.goFormEdit = function (billingType) {
            RouteService.goAdminEditBillingType({
                'billingType': billingType
            });
        }
        $scope.remove = function (billingType) {
            BillingTypeService.remove(billingType);
        }
        console.log(33);

        Utils.hideLoading();
    }
    app.controller('ListBillingTypeController', listBillingTypeController);
})();