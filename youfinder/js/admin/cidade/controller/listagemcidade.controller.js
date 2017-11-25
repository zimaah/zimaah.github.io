angular.module('starter')
        .controller('ListagemCidadeCtrl', function ($scope, RouteService, cities, Utils, CityService) {
            Utils.hideLoading();
            $scope.cities = cities;

            // navegação entre telas
            $scope.goHome = function () {
                RouteService.goHome();
            }
            $scope.abrirCadastroCidade = function () {
                RouteService.goAdminCreateCity();
            }
            $scope.editarCadastroCidade = function (city) {
                RouteService.goAdminEditCity(city);
            }
            $scope.removerCidade = function (cidadeID) {
                CityService.removeCity(cidadeID);
            }

        })