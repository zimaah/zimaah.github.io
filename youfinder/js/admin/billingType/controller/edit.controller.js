(function () {
    var app = angular.module('starter');
    var editBillingTypeController = function ($scope, BillingTypeService, RouteService, billingType, Utils) {

        // F5 volta para listagem
        if (Utils.isObjectEmpty(billingType)) {
            RouteService.goAdminListBillingType();
        }

        $scope.billingType = billingType;

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
    app.controller('EditBillingTypeController', editBillingTypeController);
})();