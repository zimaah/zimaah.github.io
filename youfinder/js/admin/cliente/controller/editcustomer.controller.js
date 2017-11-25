(function () {

    var editCustomerController = function ($scope, CustomerService, RouteService, Utils) {
        console.log('super controller');
        Utils.hideLoading();

        // navegação entre telas
        $scope.goHome = function () {
            RouteService.goHomeAdmin();
        }

        $scope.doClickSaveCustomer = function (customer) {
            console.log('salvando...', customer);
            CustomerService.saveCustomer(customer, {isNew: false});
        }

        $scope.goAdminListCustomers = function () {
            RouteService.goAdminListCustomers($scope);
        }
        
        $scope.addRemSubCategory = function(config){
            let founded = config.scope.customer.subCategories.find(function(category){
                return category.$id == config.categoryChecked.$id;
            });
            
            if (founded) {
                config.scope.customer.subCategories = config.scope.customer.subCategories.filter(function(category){
                    return category.$id != founded.$id;
                });
            } else {
                config.scope.customer.subCategories[config.categoryChecked.$id] = config.categoryChecked;
            }
        }
    }

    var app = angular.module('starter');

    app.controller('EditCustomerCtrl', editCustomerController);

})();