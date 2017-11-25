(function () {
    var app = angular.module('starter');
    var loginController = function ($scope, LoginService, RouteService, Utils) {
        $scope.login = {};
        // if is logged, redirect to home
        if (LoginService.isUserLogged()) {
            RouteService.goHome();
        }

//        $scope.login = {email: 'guilherme@youfinder.com', password: '123123'};
//        $scope.login = {email: 'zima@zima.com', password: '123123'};

        $scope.doLogin = function (login) {
            Utils.showLoading();
            if (!login.email || !login.password) {
                Utils.showAlert('Você precisa informa usuário e senha');
                Utils.hideLoading();
            } else {
                LoginService.loginEmailAndPassword(login.email, login.password);
            }
            
        }
        
        $scope.goLoginForm = function(){
            RouteService.goLoginForm();
        }

        $scope.doLoginWithFacebook = function () {
            LoginService.loginFacebook();
        }

        $scope.createAccount = function () {
            RouteService.goCreateAccount();
        }

        $scope.doCreateAccount = function (login) {
            LoginService.createAccountEmailAndPassword(login);
        }

        $scope.goLogin = function () {
            RouteService.goLogin();
        }

        $scope.resetPasswordEmail = function () {
            RouteService.goResetPasswordEmail();
        }

        $scope.doResetPasswordEmail = function (email) {
            LoginService.resetPasswordEmail(email);
        }
        
        $scope.goCustomerArea = function(){
            RouteService.goCustomerArea();
        }
        
        $scope.iconPerson = Utils.getIcon({
            name: 'persons',
            animation: 'wobble'
        });
        
        $scope.iconLogin = Utils.getIcon({
            name: 'login',
            animation: 'wobble'
        });
        
        $scope.iconCreateAccount = Utils.getIcon({
            name: 'createAccount',
            animation: 'wobble'
        });
        
        $scope.iconCheckmark = Utils.getIcon({
            name: 'checkmark',
            animation: 'wobble'
        });
    }
    
    app.controller('LoginController', loginController);
})();