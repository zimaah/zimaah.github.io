angular.module('starter')
        .controller('AdminCtrl', function ($scope, $state, LoginService, $ionicSideMenuDelegate) {
            
            $scope.logout = function () {
                LoginService.logout();
            }
            
            $scope.goListCustomer = function(){
                $state.go('listagemcliente');
            }

            $scope.goHome = function () {
                $state.go('adminmenu.home');
            }
            $scope.toggleSideMenu = function () {
                $ionicSideMenuDelegate.toggleLeft();
            }
        })