(function () {
    var app = angular.module('starter');
    var config = function ($stateProvider) {

        $stateProvider.state('billingType', {
            url: '/tipos-de-faturamento',
            templateUrl: 'templates/admin/billingType/list.html',
            controller: 'ListBillingTypeController',
            resolve: {
                billingTypes: function (BillingTypeService, Utils) {
                    Utils.showLoading();
                    var billingTypes = BillingTypeService.getAll();
                    return billingTypes.$loaded();
                }
            }
        })

                .state('billingTypeNew', {
                    url: '/tipos-de-faturamento/novo',
                    templateUrl: 'templates/admin/billingType/new.html',
                    controller: 'NewBillingTypeController'
                })

                .state('billingTypeEdit', {
                    url: '/tipos-de-faturamento/editar',
                    templateUrl: 'templates/admin/billingType/edit.html',
                    controller: 'EditBillingTypeController',
                    params: {config: {}},
                    resolve: {
                        billingType: function ($stateParams) {
                            return $stateParams.config ? $stateParams.config.billingType : {};
                        }
                    }
                })
    }
    
    app.config(config);

})();