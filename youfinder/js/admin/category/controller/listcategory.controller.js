(function () {
    var app = angular.module('starter');
    var listCategoryController = function ($scope, RouteService, categories, Utils, CategoryService, categories) {
        $scope.categories = categories;
        Utils.hideLoading();

        // navegação entre telas
        $scope.goHome = function () {
            RouteService.goHome();
        }
        $scope.abrirCadastroCategoria = function () {
            RouteService.goAdminCreateCategory();
        }
        $scope.editarCadastroCategoria = function (category) {
            RouteService.goAdminEditCategory(category);
        }
        $scope.removerCategoria = function (categoryID) {
            CategoryService.removeCategory(categoryID);
        }

    }
    app.controller('ListCategoryController', listCategoryController);
})();