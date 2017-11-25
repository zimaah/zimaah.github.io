(function () {

    var app = angular.module('starter');

    var categoriesController = function ($scope, categories, RouteService, Utils, UIAnimationService, customersByParentCategory, configs) {
        console.log(configs);
        $scope.categories = categories;
        $scope.categoryName = configs.parentCategory.fullname;
        
        $scope.listCustomersByCategory = function (subCategory) {
            console.log(configs);
            Utils.setLocalStorage('categoryHomeClick', subCategory);
            RouteService.goCustomerByCategory({
                subCategory: subCategory,
                parentCategory: configs.parentCategory,
                isFromCategories: false,
                isFromSubCategories: true,
                customersByParentCategory: customersByParentCategory
            });
        }

        $scope.goBack = function () {
            RouteService.goHome();
        }
        $scope.iconBack = Utils.getIcon({
            name: 'back'
        });

        $scope.effect = function () {
            UIAnimationService.applyUIAnimation({
                classSelector: 'categoriesList',
                animateType: 'animate-fade-slide-in-right',
                timeoutEffect: 200 //ms
            });
        }

        Utils.hideLoading();
    }

    app.controller('SubCategoriesController', categoriesController);
})();