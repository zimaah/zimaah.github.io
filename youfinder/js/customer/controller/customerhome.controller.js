(function () {

    var app = angular.module('starter');
    var homeCustomerController = function ($scope, categories, RouteService, CategoryService, Utils) {
        $scope.categories = categories;

        listCustomersByCategory = function (category) {
            Utils.showLoading();
            Utils.setLocalStorage('categoryHomeClick', category);
            RouteService.goCustomerByCategory({
                category: category,
                isFromCategories: true,
                isFromSubCategories: false,
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

        Utils.hideLoading();
    }

    app.controller('HomeCustomerController', homeCustomerController);

})();