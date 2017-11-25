(function () {

    var app = angular.module('starter');
    var customerProfileTabTwoController = function ($scope, customer, CustomerService, UIAnimationService, category, Utils) {

        $scope.customer = customer;
        $scope.coverPhotoURL = Utils.getCustomerCoverPhoto(category);

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
    }

    app.controller('CustomerProfileTabTwo', customerProfileTabTwoController);

})();