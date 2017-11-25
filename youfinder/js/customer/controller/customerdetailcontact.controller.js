(function () {
    var app = angular.module('starter');

    app.controller('CustomerDetailContactController', function ($scope, customer, CustomerService, UIAnimationService, RouteService, Utils, configs) {
        console.log(configs);
        $scope.customer = customer;
        $scope.coverPhotoURL = Utils.getCustomerCoverPhoto(configs);
        
        $scope.iconBack = Utils.getIcon({
            name: 'back'
        });

        $scope.goBack = function () {
             if (configs.isFromSearch) {
                RouteService.goSearch(configs);
            } else {
                RouteService.goCustomerByCategory(configs);
            }
        }

        CustomerService.initTabContactCustomerProfile({
            'beanName': 'customer',
            'scope': $scope,
            'email': customer.emailone,
            'facebook': customer.facebook,
            'twitter': customer.twitter,
            'instagram': customer.instagram,
            'celphone': customer.celphone,
            'celphonewhats': customer.celphonewhats,
            'celphone2': customer.celphone2,
            'celphone2whats': customer.celphone2whats,
            'celphone3': customer.celphone3,
            'celphone3whats': customer.celphone3whats
        });

        UIAnimationService.applyUIAnimation({
            classSelector: 'customerProfileList',
            animateType: 'animate-fade-slide-in-right',
            timeoutEffect: 100 //ms
        });
    });
})();