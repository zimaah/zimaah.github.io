(function(){
    
    let editCustomerController = function ($scope, CustomerService, RouteService, Utils) {
        Utils.hideLoading();

        $scope.doClickSaveCustomer = function (customer) {
            console.log('salvando...', customer);
            CustomerService.saveCustomer(customer, {state: 'app.homecustomer'});
        }

        $scope.goBack = function () {
            RouteService.goHome();
        }
    }
    
    let app = angular.module('starter');

    app.controller('EditCustomerProfileCtrl', editCustomerController);
    
})();