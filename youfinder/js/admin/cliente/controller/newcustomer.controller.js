(function () {

    var newCustomerController = function ($scope, Utils, RouteService, CustomerService) {
        Utils.hideLoading();
        $scope.customer = {
            fullname: 'Super Cliente',
            emailone: 'super@cliente.com',
            password: '123123',
            confirmPassword: '123123',
            slogan: 'Atendendo bem para atender sempre! :)'
        };

        // navegação entre telas
        $scope.goHome = function () {
            RouteService.goHomeAdmin();
        }

        $scope.goAdminListCustomers = function () {
            RouteService.goAdminListCustomers($scope);
        }

        $scope.doClickSaveCustomer = function (customer) {
            Utils.showLoading();
            console.log(customer);
            CustomerService.saveCustomer(customer, {isNew: true});
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
                // hack to orderByChild 'id'
                config.categoryChecked.id = config.categoryChecked.$id;
                config.scope.customer.subCategories.push(config.categoryChecked);
            }
        }

    }

    var app = angular.module('starter');

    app.controller('NewCustomerCtrl', newCustomerController);

})();