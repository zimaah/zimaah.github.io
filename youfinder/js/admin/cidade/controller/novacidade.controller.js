angular.module('starter')
        .controller('NovaCidadeCtrl', function ($scope, Utils, RouteService, CityService) {
            $scope.city = {};

            // navegação entre telas
            $scope.goHome = function () {
                RouteService.goHomeAdmin();
            }

            $scope.goAdminListCities = function () {
                RouteService.goAdminListCities();
            }

            $scope.doClickSaveCity = function (city) {
                console.log(city);
                Utils.showLoading();
                CityService.saveNewCity(city);
            }

        })