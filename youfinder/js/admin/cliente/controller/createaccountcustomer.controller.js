(function(){
    var app = angular.module('starter');
    var createAccountCustomerCtrl = function ($scope, RouteService, Utils) {
            console.log('CreateAccountCustomerCtrl');
            Utils.hideLoading();
            $scope.login = {};
            $scope.submitted = false;
            
            // function to submit the form after all validation has occurred            
            $scope.submitForm = function (isValid) {
                $scope.submitted = true;

                // check to make sure the form is completely valid
                if (isValid) {
                    console.log($scope.login.email);
                    console.log($scope.login.password);
                    console.log($scope.login.password2);
                    
                    RouteService.goAdminCreateCustomerData($scope.login);
                }
            };
            
            $scope.goAdminListCustomers = function(){
                RouteService.goAdminListCustomers();
            }

        console.log('CreateAccountCustomerCtrl 2');
        }

        app.controller('CreateAccountCustomerCtrl', createAccountCustomerCtrl);
})()