(function () {

    var app = angular.module('starter');

    var categoriesController = function ($scope, categories, RouteService, Utils, UIAnimationService, CategoryService) {
        Utils.hideLoading();
        $scope.categories = categories;

        $scope.goBack = function () {
            RouteService.goHome();
        }
        $scope.iconBack = Utils.getIcon({
            name: 'back'
        });

        UIAnimationService.applyUIAnimation({
            classSelector: 'categoriesList',
            animateType: 'animate-fade-slide-in-right',
            timeoutEffect: 200 //ms
        });

        listCustomersByCategory = function (category) {
            Utils.showLoading();
            Utils.setLocalStorage('categoryHomeClick', category);
            RouteService.goCustomerByCategory({
                category: category,
                isFromAllCategories: true,
                isFromSubCategories: false,
                isFromCategories: false,
                customersByParentCategory: []
            });
        }

        /**
         * config = {
         *    childCategories: [],
         *    parentCategory: {}
         * }
         * 
         * @param object config
         * @returns {undefined}
         */
        listSubCategories = function (config) {
            Utils.showLoading();
            RouteService.goSubCategories(config);
        }

        /**
         * Check if the current clicked category has child categories.
         * If has, go to subcategories.
         * Otherwise, go to category's customers;
         * 
         * @param {type} category
         * @returns {undefined}
         */
        $scope.goToSubCategoryOrCustomers = function (category) {
            console.log(category);
            var childCategoriesPromise = CategoryService.getChildCategories(category.$id);

            childCategoriesPromise.$loaded().then(function (childCategories) {

                // go to customers
                if (Utils.isEmpty(childCategories)) {
                    listCustomersByCategory(category);

                    // it has child categories, so go to child categories
                } else {
                    listSubCategories({
                        'subCategories': childCategories,
                        'parentCategory': category
                    });
                }
            })
        }

        $scope.effect = function () {
            UIAnimationService.applyUIAnimation({
                classSelector: 'categoriesList',
                animateType: 'animate-fade-slide-in-right',
                timeoutEffect: 200 //ms
            });
        }
    }

    app.controller('CategoriesController', categoriesController);
})();