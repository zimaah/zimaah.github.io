angular.module('starter')

        .controller('ListCustomerCtrl', function ($scope, RouteService, CustomerService, customers, Utils) {
            Utils.hideLoading();
            $scope.customers = customers;

            // navegação entre telas
            $scope.goHome = function () {
                RouteService.goHome();
            }
            $scope.abrirCadastroCliente = function () {
                RouteService.goAdminCreateCustomer();
            }
            $scope.editarCadastroCliente = function (customer) {
                RouteService.goAdminEditCustomer(customer);
            }
            $scope.removerCliente = function (customerID) {
                CustomerService.removeCustomer(customerID);
            }

        })