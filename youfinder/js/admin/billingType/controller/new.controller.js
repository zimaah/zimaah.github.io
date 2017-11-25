(function () {
    var app = angular.module('starter');
    var newBillingTypeController = function ($scope, BillingTypeService, RouteService, Utils) {
        $scope.billingType = {};

        // navegação entre telas
        $scope.goHome = function () {
            RouteService.goHomeAdmin();
        }

        $scope.doClickSave = function (billingType) {
            Utils.showLoading();
            BillingTypeService.save({
                billingType: billingType
            });
        }

        $scope.goList = function () {
            RouteService.goAdminListBillingType();
        }
        
        Utils.hideLoading();
    }
    app.controller('NewBillingTypeController', newBillingTypeController);
})();