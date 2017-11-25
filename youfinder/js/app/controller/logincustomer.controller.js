(function () {
    var app = angular.module('starter');
    var loginCustomerController = function ($scope, LoginService, RouteService) {

        $scope.login = {
//            email: 'super@cliente.com',
//            password: '123123'
        };

        $scope.doLogin = function (login) {
            LoginService.loginEmailAndPasswordCustomer(login.email, login.password);
        }

        $scope.resetPasswordEmail = function () {
            RouteService.goResetPasswordEmail();
        }

        $scope.doResetPasswordEmail = function (email) {
            LoginService.resetPasswordEmail(email);
        }
        
        $scope.goLogin = function () {
            RouteService.goLogin();
        }
    }

    app.controller('LoginCustomerController', loginCustomerController);
})();