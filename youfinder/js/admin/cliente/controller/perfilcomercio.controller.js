angular.module('starter')
        .controller('PerfilComercioCtrl', function ($scope, customer, RouteService) {

            $scope.customer = customer;

            $scope.goHomeUser = function () {
                RouteService.goHomeUser();
            }
        });