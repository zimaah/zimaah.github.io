(function () {

    var newCustomerDataController = function ($scope, Utils, categories) {
        Utils.hideLoading();
        $scope.customer = $scope.$parent.customer;
        $scope.categories = categories;
        console.log($scope.customer);
        $scope.subCategories = $scope.customer.subCategories || [];
        
        $scope.onCategoryChange = function(categoryId){
            let subs = $scope.categories.filter(function(category){
                return category.super == categoryId;
            });
            
            $scope.subCategories = subs;
        }
        
        $scope.compareCategory = function(obj1, obj2){
            return obj1.fullname == obj2.fullname;
        }

    }

    var app = angular.module('starter');

    app.controller('NewCustomerDataCtrl', newCustomerDataController);

})();