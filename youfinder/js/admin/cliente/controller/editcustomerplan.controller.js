(function () {

    var editCustomerPlanController = function ($scope, Utils, CustomerService, customer, categories, subCategories, billingTypes) {
        $scope.billingTypes = billingTypes;
        console.log($scope.billingTypes);
        $scope.customer = customer;
        $scope.categories = categories;
        $scope.subCategories = subCategories;
        
        $scope.compareCategory = function(obj1, obj2){
            return obj1.fullname == obj2.fullname;
        }
        
        Utils.hideLoading();
    }

    var app = angular.module('starter');

    app.controller('EditCustomerPlanCtrl', editCustomerPlanController);

})();