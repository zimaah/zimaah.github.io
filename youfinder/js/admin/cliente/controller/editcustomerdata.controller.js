(function () {

    var  editCustomerDataController = function (RouteService, $scope, Utils, categories, customer, subCategories) {
        Utils.hideLoading();
        $scope.customer = customer;
        $scope.categories = categories;
        $scope.subCategories = subCategories || [];

        // F5 volta para listagem
        if (Utils.isObjectEmpty(customer)) {
            RouteService.goAdminListCustomers();
        }
        
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

    var  app = angular.module('starter');

    app.controller('EditCustomerDataCtrl', editCustomerDataController);

})();